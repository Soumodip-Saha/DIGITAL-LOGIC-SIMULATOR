/**
 * DELD Virtual Trainer Kit - Main Application Controller
 * Coordinates UI events, tool state machine, canvas pan/zoom,
 * modals, presets, and real-time simulator loops.
 */

import { CircuitSimulator } from './simulation.js';
import { BoardRenderer } from './board.js';
import { WireRenderer, WIRE_PALETTE } from './wire.js';
import { StorageManager } from './storage.js';
import { DatasheetViewer } from './datasheet.js';
import { IC_LIBRARY, IC_CATEGORIES } from './ic-library.js';
import { LAB_PRESETS } from './presets.js';

class DeldApp {
  constructor() {
    this.activeTool = 'select'; // 'select' | 'wire' | 'add-ic' | 'remove-ic' | 'remove-wire' | 'hand'
    this.circuitName = 'Untitled Circuit';

    // Canvas Pan & Zoom State
    this.zoom = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.isPanning = false;
    this.panStart = { x: 0, y: 0 };

    // Active wire drawing state
    this.wireStart = null; // { comp, pin, coord: {x, y} }

    // Selected IC for insertion
    this.selectedICForPlacement = null;
    this.targetBaseForInsertion = 'auto';

    // Truth Table mode: 'circuit' (Total Circuit) or 'ic' (Individual IC)
    this.truthTableMode = 'circuit';

    this.init();
  }

  init() {
    // 1. Initialize Core Engines
    this.sim = new CircuitSimulator();
    this.storage = new StorageManager(this.sim);

    const svgElement = document.getElementById('trainer-kit-svg');
    this.board = new BoardRenderer(svgElement, this.sim, {
      onPinClick: (endpoint, coord) => this.handlePinClick(endpoint, coord),
      onPinMouseDown: (endpoint, coord, e) => this.handlePinMouseDown(endpoint, coord, e),
      onPinMouseUp: (endpoint, coord, e) => this.handlePinMouseUp(endpoint, coord, e),
      onICBaseClick: (baseIdx) => this.handleICBaseClick(baseIdx),
      onICRemove: (baseIdx) => this.handleICRemove(baseIdx),
      onSwitchToggle: (idx) => this.handleSwitchToggle(idx),
      onPulsePress: () => this.sim.setManualPulse(true),
      onPulseRelease: () => this.sim.setManualPulse(false),
      onPowerToggle: () => this.handlePowerToggle()
    });

    this.wireRenderer = new WireRenderer(this.board.wireLayer);
    this.datasheetViewer = new DatasheetViewer(document.getElementById('datasheet-modal'));

    // 2. Setup Canvas Zoom & Pan
    this.setupCanvasNavigation();

    // 3. Setup UI Controls & Toolbars
    this.setupToolbar();
    this.setupModals();
    this.setupPresets();
    this.setupShortcuts();

    // 4. Subscribe to Simulation updates
    this.sim.subscribe(() => {
      this.board.updateDynamicElements();
      this.wireRenderer.renderWires(
        this.sim.wires,
        (endpoint) => this.board.getPinCoord(endpoint),
        this.sim.power,
        this.activeTool,
        (wireId) => this.handleWireClick(wireId)
      );
      this.updateUndoRedoUI();

      // If truth table modal is open, refresh live input highlighting
      const ttModal = document.getElementById('truth-table-modal');
      if (ttModal && !ttModal.classList.contains('hidden')) {
        this.updateTruthTableView();
      }
    });

    // 5. Check URL hash for shared circuit or load autosave
    const sharedName = this.storage.loadFromURLHash();
    if (sharedName) {
      this.setCircuitName(sharedName);
      this.showToast(`Loaded shared circuit "${sharedName}"!`, 'success');
    } else {
      this.storage.loadAutoSave();
    }

    // Center board on initial load
    this.fitToScreen();
    this.board.updateDynamicElements();
  }

  // ==========================================
  // TOOLBAR & STATE MACHINE
  // ==========================================

  setTool(tool) {
    this.activeTool = tool;

    // Reset wire in-progress if changing tools
    if (this.wireStart) {
      this.cancelWireDrawing();
    }

    // Update toolbar buttons active styling
    document.querySelectorAll('.tool-btn').forEach(btn => {
      if (btn.getAttribute('data-tool') === tool) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const canvasContainer = document.getElementById('canvasContainer');
    if (tool === 'hand') {
      canvasContainer.style.cursor = 'grab';
    } else if (tool === 'remove-wire' || tool === 'remove-ic') {
      canvasContainer.style.cursor = 'crosshair';
    } else {
      canvasContainer.style.cursor = 'default';
    }

    // Re-render wires with updated cursor styles
    this.wireRenderer.renderWires(
      this.sim.wires,
      (endpoint) => this.board.getPinCoord(endpoint),
      this.sim.power,
      this.activeTool,
      (wireId) => this.handleWireClick(wireId)
    );
  }

  setupToolbar() {
    // Tool buttons
    document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.getAttribute('data-tool');
        if (tool === 'add-ic') {
          this.openICLibraryModal();
        } else {
          this.setTool(tool);
        }
      });
    });

    // Undo / Redo
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    if (undoBtn) undoBtn.addEventListener('click', () => this.handleUndo());
    if (redoBtn) redoBtn.addEventListener('click', () => this.handleRedo());

    // Zoom buttons
    document.getElementById('zoomInBtn')?.addEventListener('click', () => this.adjustZoom(0.15));
    document.getElementById('zoomOutBtn')?.addEventListener('click', () => this.adjustZoom(-0.15));
    document.getElementById('zoomResetBtn')?.addEventListener('click', () => this.resetZoom());
    document.getElementById('fitScreenBtn')?.addEventListener('click', () => this.fitToScreen());

    // Circuit Name input
    const nameInput = document.getElementById('circuitNameInput');
    if (nameInput) {
      nameInput.value = this.circuitName;
      nameInput.addEventListener('change', (e) => {
        this.setCircuitName(e.target.value.trim() || 'Untitled Circuit');
      });
    }

    // Wire Color Picker
    const colorPaletteContainer = document.getElementById('wireColorPicker');
    if (colorPaletteContainer) {
      WIRE_PALETTE.forEach(c => {
        const swatch = document.createElement('button');
        swatch.className = 'w-5 h-5 rounded-full border border-slate-600 focus:outline-none transition-transform hover:scale-110';
        swatch.style.backgroundColor = c.hex;
        swatch.setAttribute('data-hex', c.hex.toLowerCase());
        swatch.addEventListener('click', () => {
          this.wireRenderer.setCurrentColor(c.hex);
          colorPaletteContainer.querySelectorAll('button').forEach(b => b.classList.remove('ring-2', 'ring-white'));
          swatch.classList.add('ring-2', 'ring-white');
        });
        if (c.hex === WIRE_PALETTE[0].hex) swatch.classList.add('ring-2', 'ring-white');
        colorPaletteContainer.appendChild(swatch);
      });
    }

    // Signal highlight mode toggle
    const sigGlowToggle = document.getElementById('signalGlowToggle');
    if (sigGlowToggle) {
      sigGlowToggle.addEventListener('click', () => {
        this.wireRenderer.toggleSignalColorMode();
        sigGlowToggle.classList.toggle('active', this.wireRenderer.signalColorMode);
        this.sim.evaluate();
      });
    }
  }

  setCircuitName(name) {
    this.circuitName = name;
    const nameInput = document.getElementById('circuitNameInput');
    if (nameInput) nameInput.value = name;
    document.title = `${name} | Virtual DELD Trainer Kit`;
  }

  updateUndoRedoUI() {
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    if (undoBtn) undoBtn.disabled = !this.storage.canUndo();
    if (redoBtn) redoBtn.disabled = !this.storage.canRedo();
  }

  handleUndo() {
    if (this.storage.undo()) {
      this.showToast('Action undone');
    }
  }

  handleRedo() {
    if (this.storage.redo()) {
      this.showToast('Action redone');
    }
  }

  // ==========================================
  // HARDWARE & INTERACTION HANDLERS
  // ==========================================

  handlePowerToggle() {
    const newState = !this.sim.power;
    this.sim.setPower(newState);
    if (newState) {
      this.showToast('Power ON: Circuit active & simulating', 'success');
    } else {
      this.showToast('Power OFF: Circuit unpowered', 'info');
    }
  }

  handleSwitchToggle(switchIdx) {
    this.sim.toggleSwitch(switchIdx);
    this.storage.recordState();
  }

  handlePinMouseDown(endpoint, coord, e) {
    if (this.activeTool === 'remove-wire' || (e && e.button !== 0)) return;
    this.pinDown = {
      endpoint: { comp: endpoint.comp, pin: String(endpoint.pin) },
      coord,
      startX: e ? e.clientX : 0,
      startY: e ? e.clientY : 0,
      isDragging: false
    };
  }

  handlePinMouseUp(endpoint, coord, e) {
    if (this.activeTool === 'remove-wire' || (e && e.button !== 0)) return;

    // Check if this was an active drag from a different pin
    if (this.pinDown && this.pinDown.isDragging) {
      const from = this.pinDown.endpoint;
      const to = { comp: endpoint.comp, pin: String(endpoint.pin) };
      if (from.comp !== to.comp || from.pin !== to.pin) {
        this.finishWireConnection(from, to);
        this.dragCompleted = true;
      } else {
        this.cancelWireDrawing();
      }
    }
    this.pinDown = null;
  }

  handlePinClick(endpoint, coord) {
    if (this.activeTool === 'remove-wire' || this.activeTool === 'remove-ic' || this.activeTool === 'hand') return;

    // If drag gesture already completed the connection, ignore the subsequent click
    if (this.dragCompleted) {
      this.dragCompleted = false;
      return;
    }

    const clicked = { comp: endpoint.comp, pin: String(endpoint.pin) };

    if (!this.wireStart) {
      // 1st Click: Start new wire
      this.startWireDrawing(clicked, coord);
      this.showToast(`Wire started from ${clicked.comp} pin ${clicked.pin}. Click destination pin to connect.`, 'info');
    } else {
      // 2nd Click: Finish wire
      const from = { comp: this.wireStart.comp, pin: String(this.wireStart.pin) };
      const to = clicked;

      if (from.comp === to.comp && from.pin === to.pin) {
        this.cancelWireDrawing();
        this.showToast('Wire cancelled.', 'info');
        return;
      }

      this.finishWireConnection(from, to);
    }
  }

  startWireDrawing(endpoint, coord) {
    if (this.wireStart) {
      const prevPinEl = document.querySelector(`.terminal-pin[data-comp="${this.wireStart.comp}"][data-pin="${this.wireStart.pin}"]`);
      if (prevPinEl) {
        prevPinEl.classList.remove('wire-start-active');
        const ring = prevPinEl.querySelector('.terminal-hover-ring');
        if (ring) {
          ring.setAttribute('opacity', '0');
          ring.setAttribute('stroke', '#facc15');
          ring.setAttribute('stroke-width', '2.5');
        }
      }
    }
    this.wireStart = { comp: endpoint.comp, pin: String(endpoint.pin), coord };

    // Highlight starting pin with vibrant cyan glow
    const pinEl = document.querySelector(`.terminal-pin[data-comp="${endpoint.comp}"][data-pin="${endpoint.pin}"]`);
    if (pinEl) {
      pinEl.classList.add('wire-start-active');
      const ring = pinEl.querySelector('.terminal-hover-ring');
      if (ring) {
        ring.setAttribute('opacity', '1');
        ring.setAttribute('stroke', '#38bdf8');
        ring.setAttribute('stroke-width', '3.5');
      }
    }
  }

  finishWireConnection(from, to) {
    const added = this.sim.addWire(from, to, this.wireRenderer.currentColor);
    if (added) {
      this.storage.recordState();
      this.wireRenderer.advanceColor();
      this.updateColorPickerActiveRing();
      this.showToast('Connection established!', 'success');
    } else {
      this.showToast('Connection already exists or invalid.', 'warning');
    }
    this.cancelWireDrawing();
  }

  updateColorPickerActiveRing() {
    const colorPaletteContainer = document.getElementById('wireColorPicker');
    if (colorPaletteContainer) {
      const curHex = this.wireRenderer.currentColor.toLowerCase();
      colorPaletteContainer.querySelectorAll('button').forEach(b => {
        b.classList.remove('ring-2', 'ring-white');
        if (b.getAttribute('data-hex') === curHex) {
          b.classList.add('ring-2', 'ring-white');
        }
      });
    }
  }

  cancelWireDrawing() {
    if (this.wireStart) {
      const pinEl = document.querySelector(`.terminal-pin[data-comp="${this.wireStart.comp}"][data-pin="${this.wireStart.pin}"]`);
      if (pinEl) {
        pinEl.classList.remove('wire-start-active');
        const ring = pinEl.querySelector('.terminal-hover-ring');
        if (ring) {
          ring.setAttribute('opacity', '0');
          ring.setAttribute('stroke', '#facc15');
          ring.setAttribute('stroke-width', '2.5');
        }
      }
    }
    this.wireStart = null;
    this.wireRenderer.clearPreview();
  }

  handleWireClick(wireId) {
    if (this.activeTool === 'remove-wire') {
      if (this.sim.removeWire(wireId)) {
        this.storage.recordState();
        this.showToast('Wire removed.', 'info');
      }
    }
  }

  handleICBaseClick(baseIdx) {
    if (this.activeTool === 'remove-ic') {
      this.handleICRemove(baseIdx);
      return;
    }

    // Open unlocked IC library modal targeting this exact base (allows 1-click mounting or replacement)
    this.openICLibraryModal(baseIdx);
  }

  handleICRemove(baseIdx) {
    const base = this.sim.icBases[baseIdx];
    if (base && base.icId) {
      const removedId = base.icId;
      this.sim.removeIC(baseIdx);
      this.board.updateDynamicElements();
      this.storage.recordState();
      this.showToast(`Removed ${removedId} from IC Base ${baseIdx + 1}`, 'info');
    }
  }

  // ==========================================
  // UNLOCKED IC LIBRARY & MODAL (USER CHOOSES BASE)
  // ==========================================

  openICLibraryModal(preferredBaseIdx = null) {
    const modal = document.getElementById('ic-modal');
    if (!modal) return;

    if (preferredBaseIdx !== null && preferredBaseIdx !== undefined) {
      this.targetBaseForInsertion = String(preferredBaseIdx);
    } else {
      const firstEmpty = this.sim.icBases.findIndex(b => !b.icId);
      this.targetBaseForInsertion = firstEmpty !== -1 ? String(firstEmpty) : '0';
    }

    this.updateTargetBaseUI();
    this.renderICLibraryGrid('all', '');
    modal.classList.remove('hidden');
  }

  updateTargetBaseUI() {
    const container = document.getElementById('targetBaseButtonContainer');
    const badge = document.getElementById('targetBaseBadge');
    const notice = document.getElementById('targetBaseNotice');
    if (!container) return;

    const currentBaseIdx = Number(this.targetBaseForInsertion);

    // Render 5 interactive base buttons with live occupancy status
    container.innerHTML = [0, 1, 2, 3, 4].map(idx => {
      const base = this.sim.icBases[idx];
      const isSelected = idx === currentBaseIdx;
      const occupied = base && base.icId;
      const label = `Base ${idx + 1}`;
      const statusText = occupied ? base.icId : 'Empty';

      if (isSelected) {
        return `
          <button type="button" class="target-base-btn text-xs px-3 py-1.5 rounded-lg font-bold border transition-all bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-300 flex items-center gap-1.5 cursor-pointer" data-base="${idx}">
            <span>${label}</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded bg-sky-800/80 text-sky-100">${statusText}</span>
          </button>
        `;
      } else {
        return `
          <button type="button" class="target-base-btn text-xs px-3 py-1.5 rounded-lg font-semibold border transition-all bg-white text-slate-700 border-slate-300 hover:border-sky-400 hover:bg-sky-50/50 flex items-center gap-1.5 cursor-pointer" data-base="${idx}">
            <span>${label}</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded ${occupied ? 'bg-amber-100 text-amber-800 font-bold' : 'bg-slate-100 text-slate-500'}">${statusText}</span>
          </button>
        `;
      }
    }).join('');

    // Re-bind click events
    container.querySelectorAll('.target-base-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.targetBaseForInsertion = btn.getAttribute('data-base');
        this.updateTargetBaseUI();
        const activeTab = document.querySelector('.ic-category-tab.active')?.getAttribute('data-cat') || 'all';
        const query = document.getElementById('icSearchInput')?.value.toLowerCase() || '';
        this.renderICLibraryGrid(activeTab, query);
      });
    });

    if (badge) {
      badge.textContent = `Base ${currentBaseIdx + 1}`;
    }

    if (notice) {
      const targetIC = this.sim.icBases[currentBaseIdx]?.icId;
      if (targetIC) {
        notice.textContent = `Destination: IC Base ${currentBaseIdx + 1} (Currently contains ${targetIC}). Selecting any IC below will replace it.`;
      } else {
        notice.textContent = `Destination: IC Base ${currentBaseIdx + 1} (Currently Empty). Click any IC below to mount it here.`;
      }
    }
  }

  mountIC(icId) {
    let baseIdx = Number(this.targetBaseForInsertion);
    if (isNaN(baseIdx) || baseIdx < 0 || baseIdx >= 5) {
      baseIdx = this.sim.icBases.findIndex(b => !b.icId);
      if (baseIdx === -1) baseIdx = 0;
    }

    const success = this.sim.insertIC(baseIdx, icId);
    if (success) {
      this.setTool('select');
      this.board.updateDynamicElements();
      this.storage.recordState();
      this.showToast(`Mounted ${icId} onto IC Base ${baseIdx + 1}!`, 'success');
      document.getElementById('ic-modal')?.classList.add('hidden');
    } else {
      this.showToast(`Failed to mount ${icId}`, 'error');
    }
  }

  setupModals() {
    this.updateTargetBaseUI();

    // Close buttons for all modals
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.modal-backdrop').classList.add('hidden');
        this.targetBaseForInsertion = 'auto';
      });
    });

    // Close modals on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.add('hidden');
          this.targetBaseForInsertion = 'auto';
        }
      });
    });

    // IC Modal search & filter
    const searchInput = document.getElementById('icSearchInput');
    const categoryTabs = document.querySelectorAll('.ic-category-tab');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const activeTab = document.querySelector('.ic-category-tab.active')?.getAttribute('data-cat') || 'all';
        this.renderICLibraryGrid(activeTab, e.target.value.toLowerCase());
      });
    }

    categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.getAttribute('data-cat');
        const query = searchInput?.value.toLowerCase() || '';
        this.renderICLibraryGrid(cat, query);
      });
    });

    // Menu Bar Dropdowns & Actions
    this.setupDropdownMenus();
  }

  renderICLibraryGrid(category = 'all', query = '') {
    const grid = document.getElementById('ic-grid-container');
    if (!grid) return;

    const items = Object.values(IC_LIBRARY).filter(ic => {
      const matchesCategory = (category === 'all') || (ic.category === category);
      const matchesQuery = !query ||
        ic.id.toLowerCase().includes(query) ||
        ic.name.toLowerCase().includes(query) ||
        ic.description.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });

    if (items.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full text-center py-12 text-slate-400">
          <p class="text-base font-semibold">No matching ICs found</p>
          <p class="text-sm">Try searching for a 74LS part number like "74LS00", "Adder", or "Counter"</p>
        </div>
      `;
      return;
    }

    let targetLabel;
    if (this.targetBaseForInsertion === 'auto') {
      const firstEmpty = this.sim.icBases.findIndex(b => !b.icId);
      targetLabel = firstEmpty !== -1 ? `Base ${firstEmpty + 1}` : 'Base 1';
    } else {
      targetLabel = `Base ${Number(this.targetBaseForInsertion) + 1}`;
    }

    grid.innerHTML = items.map(ic => `
      <div class="ic-card bg-white border border-slate-200 hover:border-sky-500 rounded-xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md cursor-pointer group" data-ic="${ic.id}">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="font-mono font-extrabold text-base text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-300 group-hover:border-sky-300">
              ${ic.id}
            </span>
            <span class="text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
              ${ic.category.toUpperCase()}
            </span>
          </div>
          <h3 class="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">${ic.name}</h3>
          <p class="text-xs text-slate-500 mt-1 line-clamp-2">${ic.description}</p>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button type="button" class="view-datasheet-btn text-xs font-semibold text-slate-600 hover:text-sky-600 flex items-center gap-1 transition-colors" data-ic="${ic.id}">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Datasheet</span>
          </button>
          
          <button type="button" class="insert-ic-btn bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors shadow-sm flex items-center gap-1.5" data-ic="${ic.id}">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            <span>Mount to ${targetLabel}</span>
          </button>
        </div>
      </div>
    `).join('');

    // Bind datasheet button
    grid.querySelectorAll('.view-datasheet-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const icId = btn.getAttribute('data-ic');
        this.datasheetViewer.show(icId);
      });
    });

    // Bind card click and mount button click
    grid.querySelectorAll('.ic-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.view-datasheet-btn')) return;
        const icId = card.getAttribute('data-ic');
        if (icId) {
          this.mountIC(icId);
        }
      });
    });
  }

  // ==========================================
  // PRESETS & EXPERIMENTS
  // ==========================================

  setupPresets() {
    // Quick Presets header button
    document.getElementById('openPresetsQuickBtn')?.addEventListener('click', () => {
      document.getElementById('presets-modal')?.classList.remove('hidden');
    });

    const presetsListContainer = document.getElementById('presets-list-container');
    if (!presetsListContainer) return;

    presetsListContainer.innerHTML = LAB_PRESETS.map((p, idx) => `
      <div class="preset-item p-4 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-4 transition-all shadow-sm">
        <div>
          <h4 class="font-bold text-sm text-slate-900 mb-0.5">${p.title}</h4>
          <p class="text-xs text-slate-500 leading-relaxed">${p.description}</p>
        </div>
        <button type="button" class="load-preset-btn flex-shrink-0 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm" data-idx="${idx}">
          Load Circuit
        </button>
      </div>
    `).join('');

    presetsListContainer.querySelectorAll('.load-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-idx'));
        this.loadPreset(idx);
        document.getElementById('presets-modal')?.classList.add('hidden');
      });
    });
  }

  loadPreset(index) {
    const preset = LAB_PRESETS[index];
    if (!preset) return;

    this.sim.resetCircuit();

    // Configure preset switches
    if (preset.switches) {
      preset.switches.forEach((val, i) => {
        this.sim.setSwitch(i, val);
      });
    }

    // Insert ICs
    if (preset.icBases) {
      preset.icBases.forEach(b => {
        this.sim.insertIC(b.id, b.icId);
      });
    }

    // Connect wires
    if (preset.wires) {
      preset.wires.forEach(w => {
        this.sim.addWire(w.from, w.to, w.color);
      });
    }

    this.setCircuitName(preset.title);
    this.storage.recordState();
    this.showToast(`Loaded "${preset.title}"! Turn Power ON to run.`, 'success');
  }

  // ==========================================
  // DROPDOWN MENUS & ACTIONS
  // ==========================================

  setupDropdownMenus() {
    // 3-Dots More Menu Toggle & Click-to-Stay Handling
    const moreMenuBtn = document.getElementById('moreMenuBtn');
    const moreMenuDropdown = document.getElementById('moreMenuDropdown');
    if (moreMenuBtn && moreMenuDropdown) {
      moreMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = moreMenuDropdown.classList.contains('hidden');
        moreMenuDropdown.classList.toggle('hidden', !isHidden);
        moreMenuBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
      });

      // Close dropdown when any item inside is clicked
      moreMenuDropdown.querySelectorAll('button').forEach(item => {
        item.addEventListener('click', () => {
          moreMenuDropdown.classList.add('hidden');
          moreMenuBtn.setAttribute('aria-expanded', 'false');
        });
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!moreMenuDropdown.contains(e.target) && e.target !== moreMenuBtn) {
          moreMenuDropdown.classList.add('hidden');
          moreMenuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // New circuit
    document.getElementById('menuNewCircuit')?.addEventListener('click', () => {
      if (confirm('Create a new blank circuit? Any unsaved changes will be cleared.')) {
        this.sim.resetCircuit();
        this.setCircuitName('Untitled Circuit');
        this.storage.recordState();
        this.showToast('New circuit created', 'info');
      }
    });

    // Open Presets Modal
    document.getElementById('menuOpenPresets')?.addEventListener('click', () => {
      document.getElementById('presets-modal')?.classList.remove('hidden');
    });

    // Save / Export JSON
    document.getElementById('menuExportJSON')?.addEventListener('click', () => {
      this.storage.exportJSON(this.circuitName);
    });

    // Import JSON
    const fileInput = document.getElementById('circuitFileInput');
    document.getElementById('menuImportJSON')?.addEventListener('click', () => {
      fileInput?.click();
    });
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) {
          this.storage.importJSON(file)
            .then(name => {
              this.setCircuitName(name);
              this.showToast(`Imported circuit "${name}" successfully!`, 'success');
            })
            .catch(err => {
              this.showToast('Failed to import circuit JSON file.', 'error');
            });
        }
        fileInput.value = '';
      });
    }

    // Share Modal
    document.getElementById('menuShareCircuit')?.addEventListener('click', () => {
      const shareUrl = this.storage.generateShareURL(this.circuitName);
      const urlInput = document.getElementById('shareUrlInput');
      if (urlInput) urlInput.value = shareUrl;

      const embedCode = `<iframe src="${shareUrl}" width="1200" height="710" frameborder="0" allowfullscreen></iframe>`;
      const embedInput = document.getElementById('shareEmbedInput');
      if (embedInput) embedInput.value = embedCode;

      document.getElementById('share-modal')?.classList.remove('hidden');
    });

    // Copy Share link button
    document.getElementById('copyShareUrlBtn')?.addEventListener('click', () => {
      const input = document.getElementById('shareUrlInput');
      if (input) {
        navigator.clipboard.writeText(input.value);
        this.showToast('Share link copied to clipboard!', 'success');
      }
    });

    // Reset Circuit
    document.getElementById('menuResetCircuit')?.addEventListener('click', () => {
      if (confirm('Reset and remove all wires and components?')) {
        this.sim.resetCircuit();
        this.storage.recordState();
        this.showToast('Circuit reset to default state.', 'info');
      }
    });

    // Setup Truth Table & Saved Circuits controls
    this.setupTruthTable();
    this.setupSavedCircuits();
  }

  // ==========================================
  // LIVE TRUTH TABLE INSPECTOR
  // ==========================================

  setupTruthTable() {
    const btn = document.getElementById('navTruthTableBtn');
    const modal = document.getElementById('truth-table-modal');
    const select = document.getElementById('truthTableICSelect');
    const circuitModeBtn = document.getElementById('ttModeCircuitBtn');
    const icModeBtn = document.getElementById('ttModeICBtn');

    if (btn && modal) {
      btn.addEventListener('click', () => {
        this.openTruthTableModal();
      });
    }

    if (select) {
      select.addEventListener('change', (e) => {
        this.renderICTruthTable(e.target.value);
      });
    }

    if (circuitModeBtn) {
      circuitModeBtn.addEventListener('click', () => {
        this.setTruthTableMode('circuit');
      });
    }

    if (icModeBtn) {
      icModeBtn.addEventListener('click', () => {
        this.setTruthTableMode('ic');
      });
    }
  }

  setTruthTableMode(mode) {
    this.truthTableMode = mode;
    const circuitBtn = document.getElementById('ttModeCircuitBtn');
    const icBtn = document.getElementById('ttModeICBtn');
    const circuitSection = document.getElementById('ttCircuitSection');
    const icSection = document.getElementById('ttICSection');

    if (mode === 'circuit') {
      if (circuitBtn) {
        circuitBtn.className = 'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all bg-sky-500 text-white shadow-xs';
      }
      if (icBtn) {
        icBtn.className = 'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all bg-slate-100 hover:bg-slate-200 text-slate-600';
      }
      if (circuitSection) circuitSection.classList.remove('hidden');
      if (icSection) icSection.classList.add('hidden');
    } else {
      if (circuitBtn) {
        circuitBtn.className = 'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all bg-slate-100 hover:bg-slate-200 text-slate-600';
      }
      if (icBtn) {
        icBtn.className = 'flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all bg-sky-500 text-white shadow-xs';
      }
      if (circuitSection) circuitSection.classList.add('hidden');
      if (icSection) icSection.classList.remove('hidden');
    }

    this.updateTruthTableView();
  }

  updateTruthTableView() {
    if (this.truthTableMode === 'circuit') {
      this.renderCircuitTruthTable();
    } else {
      const select = document.getElementById('truthTableICSelect');
      if (select && select.value) {
        this.renderICTruthTable(select.value);
      }
    }
  }

  openTruthTableModal(preferredIcId = null) {
    const modal = document.getElementById('truth-table-modal');
    const select = document.getElementById('truthTableICSelect');
    if (!modal) return;

    // Check if circuit has any inputs and outputs connected
    const tt = this.sim.generateCircuitTruthTable();
    const hasCircuit = tt.inputs.length > 0 && tt.outputs.length > 0;

    // Populate select dropdown with mounted ICs first, then full library
    if (select) {
      select.innerHTML = '';

      const mountedGroup = document.createElement('optgroup');
      mountedGroup.label = 'Mounted in IC Bases';
      let hasMounted = false;

      this.sim.icBases.forEach((base, idx) => {
        if (base.icId) {
          const opt = document.createElement('option');
          opt.value = base.icId;
          opt.textContent = `Base ${idx + 1}: ${base.icId} (${IC_LIBRARY[base.icId]?.name || ''})`;
          mountedGroup.appendChild(opt);
          hasMounted = true;
        }
      });

      if (hasMounted) {
        select.appendChild(mountedGroup);
      }

      const allGroup = document.createElement('optgroup');
      allGroup.label = 'All Digital ICs';
      Object.keys(IC_LIBRARY).forEach(icId => {
        const opt = document.createElement('option');
        opt.value = icId;
        opt.textContent = `${icId} - ${IC_LIBRARY[icId].name}`;
        allGroup.appendChild(opt);
      });
      select.appendChild(allGroup);

      // Pick target IC
      let targetIC = preferredIcId;
      if (!targetIC) {
        const firstMounted = this.sim.icBases.find(b => b.icId);
        targetIC = firstMounted ? firstMounted.icId : '74LS00';
      }
      select.value = targetIC;
    }

    // Default to circuit mode if circuit wires exist, else IC inspector
    const initialMode = hasCircuit ? 'circuit' : 'ic';
    this.setTruthTableMode(initialMode);
    modal.classList.remove('hidden');
  }

  renderCircuitTruthTable() {
    const summaryEl = document.getElementById('ttCircuitSummary');
    const container = document.getElementById('ttCircuitContainer');
    if (!container) return;

    const tt = this.sim.generateCircuitTruthTable();

    // 1. If empty or no complete circuit path
    if (!tt.rows || tt.rows.length === 0) {
      if (summaryEl) {
        summaryEl.innerHTML = `
          <div class="flex items-center gap-2 text-slate-500">
            <span class="w-2 h-2 rounded-full bg-amber-400"></span>
            <span class="font-medium">Circuit connectivity incomplete</span>
          </div>
        `;
      }
      container.innerHTML = `
        <div class="p-8 text-center space-y-3">
          <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
          <h3 class="font-bold text-slate-800 text-sm">Circuit Inputs or Outputs Not Connected</h3>
          <p class="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            ${tt.emptyReason || 'Connect input switches to your IC inputs, and IC outputs to LEDs to generate the complete circuit truth table.'}
          </p>
          <div class="pt-2 flex justify-center gap-2">
            <button type="button" id="ttFallbackICBtn" class="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition-colors">
              Inspect Individual IC Gates Instead
            </button>
          </div>
        </div>
      `;
      const fallbackBtn = container.querySelector('#ttFallbackICBtn');
      if (fallbackBtn) {
        fallbackBtn.addEventListener('click', () => this.setTruthTableMode('ic'));
      }
      return;
    }

    // 2. Render Circuit Summary
    if (summaryEl) {
      summaryEl.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          <!-- Inputs Column -->
          <div class="flex flex-col gap-1">
            <div class="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-sky-500"></span>
              <span>Initial Inputs (${tt.inputs.length})</span>
            </div>
            <div class="flex flex-wrap gap-1.5 items-center">
              ${tt.inputs.map(sw => {
                const val = this.sim.switches[sw];
                return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold ${val ? 'bg-sky-500 text-white shadow-xs' : 'bg-slate-200 text-slate-700'}">SW ${sw} = ${val}</span>`;
              }).join('')}
            </div>
          </div>

          <!-- Logic Stages Column -->
          <div class="flex flex-col gap-1 border-y md:border-y-0 md:border-x border-slate-200 py-2 md:py-0 md:px-3">
            <div class="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-violet-500"></span>
              <span>Logic Stages (${tt.activeICs.length} ICs)</span>
            </div>
            <div class="flex flex-wrap gap-1 text-[11px] text-slate-700 font-semibold">
              ${tt.activeICs.length > 0 
                ? tt.activeICs.map(ic => `<span class="px-2 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-200 font-mono">Base ${ic.baseIndex + 1}: ${ic.icId}</span>`).join('') 
                : '<span class="text-slate-400 italic">Direct wiring</span>'}
            </div>
          </div>

          <!-- Final Outputs Column -->
          <div class="flex flex-col gap-1">
            <div class="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Final Outputs (${tt.outputs.length})</span>
            </div>
            <div class="flex flex-wrap gap-1.5 items-center">
              ${tt.outputs.map(led => {
                const val = this.sim.leds[led];
                return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold ${val ? 'bg-emerald-500 text-white shadow-xs' : 'bg-slate-200 text-slate-700'}">OUT ${led} = ${val}</span>`;
              }).join('')}
            </div>
          </div>
        </div>
      `;
    }

    // 3. Render End-to-End Truth Table
    container.innerHTML = `
      <table class="w-full text-left border-collapse text-xs">
        <thead class="sticky top-0 bg-white z-10 shadow-xs">
          <tr class="border-b border-slate-200">
            ${tt.inputs.map(sw => `<th class="px-3 py-2.5 font-bold text-sky-800 bg-sky-50/75 font-mono border-r border-sky-100/60">SW ${sw}</th>`).join('')}
            ${tt.outputs.map(led => `<th class="px-3 py-2.5 font-bold text-emerald-800 bg-emerald-50/75 font-mono border-r border-emerald-100/60">OUT ${led}</th>`).join('')}
            <th class="px-3 py-2.5 text-right font-bold text-slate-500 bg-slate-50">Circuit State</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          ${tt.rows.map((row, rIdx) => {
            const isActive = row.isLive;
            const trClass = isActive
              ? 'bg-emerald-50/90 text-emerald-950 font-bold border-l-4 border-emerald-500 shadow-xs'
              : 'hover:bg-slate-50 cursor-pointer text-slate-700 transition-colors';

            return `
              <tr class="${trClass}" data-row-idx="${rIdx}" ${isActive ? 'data-live="true"' : ''} title="Click row to set switches to this combination">
                ${tt.inputs.map(sw => `<td class="px-3 py-2 font-mono ${isActive ? 'text-emerald-900 font-extrabold' : ''}">${row.inputs[sw]}</td>`).join('')}
                ${tt.outputs.map(led => `<td class="px-3 py-2 font-mono ${isActive ? 'text-emerald-900 font-extrabold' : ''}">${row.outputs[led]}</td>`).join('')}
                <td class="px-3 py-2 text-right">
                  ${isActive 
                    ? '<span class="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-500 text-white shadow-xs tracking-wider">● LIVE INPUT</span>' 
                    : '<span class="text-[10px] text-slate-400 opacity-0 hover:opacity-100">Click to test</span>'}
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;

    // Row click listeners: Clicking a row sets switches on the kit to that row!
    const rows = container.querySelectorAll('tbody tr[data-row-idx]');
    rows.forEach(tr => {
      tr.addEventListener('click', () => {
        const rIdx = Number(tr.getAttribute('data-row-idx'));
        const rowData = tt.rows[rIdx];
        if (rowData && rowData.inputs) {
          Object.entries(rowData.inputs).forEach(([swStr, val]) => {
            const swNum = Number(swStr);
            this.sim.switches[swNum] = val ? 1 : 0;
          });
          this.board.updateDynamicElements();
          this.sim.evaluate();
          this.showToast(`Applied Input State: ${tt.inputs.map(s => `SW${s}=${rowData.inputs[s]}`).join(' ')}`, 'info');
        }
      });
    });
  }

  renderICTruthTable(icId) {
    const container = document.getElementById('truthTableContainer');
    const descEl = document.getElementById('truthTableActiveDescription');
    if (!container) return;

    const ic = IC_LIBRARY[icId];
    if (!ic) return;

    if (descEl) {
      descEl.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="font-bold text-sky-900">${ic.id}: ${ic.name}</span>
          <span class="font-mono text-slate-500">${ic.pins}-pin DIP Package</span>
        </div>
        <p class="mt-0.5 text-slate-600">${ic.description}</p>
      `;
    }

    if (!ic.truthTable) {
      container.innerHTML = `<div class="p-6 text-center text-slate-400 text-xs italic">Truth table specification in datasheet.</div>`;
      return;
    }

    const { headers, rows } = ic.truthTable;

    // Check if this IC is currently mounted on the board to evaluate active row
    const mountedBase = this.sim.icBases.find(b => b.icId === icId);
    let activeRowIndex = -1;

    if (mountedBase && this.sim.power) {
      if (headers.length >= 3 && (headers[0] === 'A' || headers[0] === '1A') && (headers[1] === 'B' || headers[1] === '1B')) {
        const inA = mountedBase.pins[1] ? mountedBase.pins[1].level : 0;
        const inB = mountedBase.pins[2] ? mountedBase.pins[2].level : 0;
        activeRowIndex = rows.findIndex(r => String(r[0]) === String(inA) && String(r[1]) === String(inB));
      } else if (headers.length >= 2 && (headers[0] === 'A' || headers[0] === '1A')) {
        const inA = mountedBase.pins[1] ? mountedBase.pins[1].level : 0;
        activeRowIndex = rows.findIndex(r => String(r[0]) === String(inA));
      }
    }

    container.innerHTML = `
      <table class="w-full text-left border-collapse text-xs">
        <thead>
          <tr class="bg-slate-100 border-b border-slate-200">
            ${headers.map(h => `<th class="px-3 py-2 font-bold text-slate-700 font-mono">${h}</th>`).join('')}
            <th class="px-3 py-2 text-right font-bold text-slate-500">Status</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row, rIdx) => {
            const isActive = rIdx === activeRowIndex;
            const trClass = isActive 
              ? 'bg-emerald-50 text-emerald-950 font-bold border-l-4 border-emerald-500' 
              : 'border-b border-slate-100 hover:bg-slate-50 text-slate-700';

            return `
              <tr class="${trClass} transition-colors">
                ${row.map(cell => `<td class="px-3 py-2 font-mono">${cell}</td>`).join('')}
                <td class="px-3 py-2 text-right">
                  ${isActive ? '<span class="inline-block px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-500 text-white shadow-xs">LIVE INPUT</span>' : ''}
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  }

  // Alias for backward compatibility
  renderTruthTable(icId) {
    this.renderICTruthTable(icId);
  }

  // ==========================================
  // SAVED CIRCUITS MANAGER
  // ==========================================

  setupSavedCircuits() {
    // Top nav Save Button
    document.getElementById('navSaveBtn')?.addEventListener('click', () => {
      const modal = document.getElementById('saved-circuits-modal');
      const input = document.getElementById('saveCircuitNameInput');
      if (input) input.value = this.circuitName !== 'Untitled circuit' ? this.circuitName : '';
      this.renderSavedCircuitsList();
      modal?.classList.remove('hidden');
    });

    // Top nav My Circuits Button
    document.getElementById('navSavedCircuitsBtn')?.addEventListener('click', () => {
      this.renderSavedCircuitsList();
      document.getElementById('saved-circuits-modal')?.classList.remove('hidden');
    });

    // Confirm Save Circuit in Modal
    document.getElementById('confirmSaveCircuitBtn')?.addEventListener('click', () => {
      const input = document.getElementById('saveCircuitNameInput');
      const name = input?.value.trim() || this.circuitName || 'My Circuit';
      const saved = this.storage.saveNamedCircuit(name);
      this.setCircuitName(saved.name);
      this.renderSavedCircuitsList();
      this.showToast(`Circuit "${saved.name}" saved to browser!`, 'success');
      if (input) input.value = '';
    });
  }

  renderSavedCircuitsList() {
    const listContainer = document.getElementById('savedCircuitsListContainer');
    if (!listContainer) return;

    const savedList = this.storage.getSavedCircuits();
    if (savedList.length === 0) {
      listContainer.innerHTML = `
        <div class="py-8 text-center text-slate-400 text-xs">
          <p class="font-semibold text-slate-500">No saved circuits yet.</p>
          <p class="mt-1">Enter a name above and click "Save Circuit" to store your design.</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = savedList.map(item => `
      <div class="p-3 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-xs transition-all">
        <div class="flex-1 min-w-0">
          <h4 class="font-bold text-xs text-slate-900 truncate">${item.name}</h4>
          <div class="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500 font-medium">
            <span>${item.date || 'Saved'}</span>
            <span>•</span>
            <span>${item.icCount || 0} ICs</span>
            <span>•</span>
            <span>${item.wireCount || 0} Wires</span>
          </div>
        </div>

        <div class="flex items-center gap-1.5 flex-shrink-0">
          <button type="button" class="load-saved-btn bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-2.5 py-1 rounded-lg transition-colors" data-id="${item.id}">
            Load
          </button>
          <button type="button" class="export-saved-btn bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-2 py-1 rounded-lg transition-colors" data-id="${item.id}" title="Download JSON">
            JSON
          </button>
          <button type="button" class="delete-saved-btn hover:bg-red-100 text-slate-400 hover:text-red-600 p-1 rounded-md transition-colors" data-id="${item.id}" title="Delete circuit">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      </div>
    `).join('');

    // Bind item actions
    listContainer.querySelectorAll('.load-saved-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const name = this.storage.loadSavedCircuit(id);
        if (name) {
          this.setCircuitName(name);
          this.showToast(`Loaded circuit "${name}"!`, 'success');
          document.getElementById('saved-circuits-modal')?.classList.add('hidden');
        }
      });
    });

    listContainer.querySelectorAll('.export-saved-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const item = this.storage.getSavedCircuits().find(c => c.id === id);
        if (item) {
          this.storage.exportJSON(item.name);
        }
      });
    });

    listContainer.querySelectorAll('.delete-saved-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Delete this saved circuit from browser storage?')) {
          this.storage.deleteSavedCircuit(id);
          this.renderSavedCircuitsList();
          this.showToast('Circuit deleted from saved list.', 'info');
        }
      });
    });
  }

  // ==========================================
  // CANVAS ZOOM & PAN
  // ==========================================

  setupCanvasNavigation() {
    const container = document.getElementById('canvasContainer');
    const editor = document.getElementById('editor');

    // Pan via Mouse Drag
    container.addEventListener('mousedown', (e) => {
      // Do not initiate pan if clicking on interactive board components
      if (
        e.target.closest('.terminal-pin') || 
        e.target.closest('.input-toggle-switch') || 
        e.target.closest('.master-power-btn') || 
        e.target.closest('.manual-pulse-box') || 
        e.target.closest('.chip-remove-btn') ||
        e.target.closest('.exact-ic-base') ||
        e.target.closest('.mounted-ic-overlay')
      ) {
        return;
      }

      if (this.activeTool === 'hand' || e.button === 1 || this.isSpaceDown) {
        this.isPanning = true;
        this.panStart = { x: e.clientX - this.panX, y: e.clientY - this.panY };
        container.style.cursor = 'grabbing';
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isPanning) {
        this.panX = e.clientX - this.panStart.x;
        this.panY = e.clientY - this.panStart.y;
        this.applyTransform();
        return;
      }

      // If mouse is pressed on a pin and moves beyond 5px threshold, activate drag mode
      if (this.pinDown && !this.pinDown.isDragging) {
        const dist = Math.hypot(e.clientX - this.pinDown.startX, e.clientY - this.pinDown.startY);
        if (dist > 5) {
          this.pinDown.isDragging = true;
          this.startWireDrawing(this.pinDown.endpoint, this.pinDown.coord);
        }
      }

      if (this.wireStart) {
        // Track mouse coordinate mapped to SVG viewBox space
        const svg = document.getElementById('trainer-kit-svg');
        if (svg) {
          const pt = svg.createSVGPoint();
          pt.x = e.clientX;
          pt.y = e.clientY;
          const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
          this.wireRenderer.renderPreview(this.wireStart.coord, { x: svgP.x, y: svgP.y });
        }
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (this.isPanning) {
        this.isPanning = false;
        container.style.cursor = this.activeTool === 'hand' || this.isSpaceDown ? 'grab' : 'default';
      }

      // Check for drag-to-connect finish on window mouseup
      if (this.pinDown) {
        if (this.pinDown.isDragging) {
          const targetPinEl = document.elementFromPoint(e.clientX, e.clientY)?.closest('.terminal-pin');
          if (targetPinEl) {
            const toComp = targetPinEl.getAttribute('data-comp');
            const toPin = targetPinEl.getAttribute('data-pin');
            if (toComp && toPin && (toComp !== this.pinDown.endpoint.comp || toPin !== this.pinDown.endpoint.pin)) {
              this.finishWireConnection(this.pinDown.endpoint, { comp: toComp, pin: toPin });
              this.dragCompleted = true;
            } else {
              this.cancelWireDrawing();
            }
          } else {
            this.cancelWireDrawing();
          }
        }
        this.pinDown = null;
      }
    });

    // Cancel in-progress wire when clicking empty space
    container.addEventListener('click', (e) => {
      if (this.dragCompleted) {
        this.dragCompleted = false;
        return;
      }
      if (this.wireStart && !e.target.closest('.terminal-pin')) {
        this.cancelWireDrawing();
        this.showToast('Wire connection canceled.', 'info');
      }
    });

    // Spacebar to pan
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        this.isSpaceDown = true;
        container.style.cursor = 'grab';
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        this.isSpaceDown = false;
        container.style.cursor = this.activeTool === 'hand' ? 'grab' : 'default';
      }
    });

    // Zoom via Mouse Wheel
    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      this.adjustZoomRatio(zoomFactor, e.clientX, e.clientY);
    }, { passive: false });
  }

  adjustZoom(delta) {
    this.zoom = Number(Math.min(3.0, Math.max(0.4, this.zoom + delta)).toFixed(2));
    this.applyTransform();
  }

  adjustZoomRatio(ratio, clientX, clientY) {
    const container = document.getElementById('canvasContainer');
    const rect = container.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    const newZoom = Number(Math.min(3.0, Math.max(0.4, this.zoom * ratio)).toFixed(2));
    this.panX = Math.round(mouseX - (mouseX - this.panX) * (newZoom / this.zoom));
    this.panY = Math.round(mouseY - (mouseY - this.panY) * (newZoom / this.zoom));
    this.zoom = newZoom;
    this.applyTransform();
  }

  resetZoom() {
    this.zoom = 1.0;
    const container = document.getElementById('canvasContainer');
    const cw = container.clientWidth || window.innerWidth;
    const ch = container.clientHeight || (window.innerHeight - 52);
    this.panX = Math.round((cw - 1576) / 2);
    this.panY = Math.round((ch - 720) / 2);
    this.applyTransform();
  }

  fitToScreen() {
    const container = document.getElementById('canvasContainer');
    const cw = container.clientWidth || window.innerWidth;
    const ch = container.clientHeight || (window.innerHeight - 52);

    const scaleX = (cw - 30) / 1576;
    const scaleY = (ch - 30) / 720;
    const optimal = Math.min(scaleX, scaleY);

    this.zoom = Number(Math.min(3.0, Math.max(0.45, optimal)).toFixed(2));

    this.panX = Math.round((cw - 1576 * this.zoom) / 2);
    this.panY = Math.round((ch - 720 * this.zoom) / 2);
    this.applyTransform();
  }

  applyTransform() {
    const editor = document.getElementById('editor');
    if (editor) {
      editor.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
    }
    const zoomText = document.getElementById('zoomPercentage');
    if (zoomText) {
      zoomText.textContent = `${Math.round(this.zoom * 100)}%`;
    }
  }

  setupShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ignore if typing in text inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        this.handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        this.handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        this.storage.exportJSON(this.circuitName);
      } else if (e.key === 'Escape') {
        this.cancelWireDrawing();
        document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.add('hidden'));
      }
    });
  }

  showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type} animate-slide-up flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium shadow-xl`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✓';
    else if (type === 'warning') icon = '⚠️';
    else if (type === 'error') icon = '✕';

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

// Initialize on DOM ready (handles both loading and already-loaded states)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.app = new DeldApp();
  });
} else {
  window.app = new DeldApp();
}


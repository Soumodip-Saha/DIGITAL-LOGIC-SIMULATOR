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
import { DigitalLogicSuite } from './logic-suite.js';

class DeldApp {
  constructor() {
    this.activeTool = 'wire'; // 'wire' | 'select' | 'add-ic' | 'remove-ic' | 'remove-wire' | 'hand'
    this.circuitName = 'Untitled Circuit';

    // Canvas Pan & Zoom State
    this.zoom = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.isPanning = false;
    this.panStart = { x: 0, y: 0 };

    // Active wire drawing state
    this.wireStart = null; // { comp, pin, coord: {x, y} }
    this.selectedPin = null; // Absolute pin selection: { comp, pin, coord }
    this.dragCompleted = false;

    // Selected IC for insertion
    this.selectedICForPlacement = null;
    this.targetBaseForInsertion = 'auto';

    // Truth Table mode: 'circuit' (Total Circuit) or 'ic' (Individual IC)
    this.truthTableMode = 'circuit';
    this.suite = new DigitalLogicSuite();
    this.currentSuiteTab = 'kmap';

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
    this.setupDigitalLogicSuite();
    this.setupAutoWireSystem();
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

      // If Digital Logic Suite is open, refresh live logic suite
      const lsModal = document.getElementById('logic-suite-modal');
      if (lsModal && !lsModal.classList.contains('hidden')) {
        this.updateLogicSuiteLive();
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
    if (tool === 'select') tool = 'wire';
    this.activeTool = tool;

    // Reset wire in-progress if changing tools
    if (this.wireStart) {
      this.cancelWireDrawing();
    }

    // Update toolbar buttons active styling
    document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
      const t = btn.getAttribute('data-tool');
      if (t === tool || (tool === 'wire' && t === 'select')) {
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

    if (tool !== 'hand') {
      this.isPanning = false;
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

  // ==========================================
  // ABSOLUTE PIN SELECTION & CONNECTION
  // ==========================================

  selectPin(endpoint, coord) {
    if (this.selectedPin) {
      this.clearPinHighlight(this.selectedPin);
    }

    const normPin = String(endpoint.pin).trim();
    const pinCoord = coord || this.board.getPinCoord(endpoint);
    this.selectedPin = { comp: endpoint.comp, pin: normPin, coord: pinCoord };
    this.wireStart = this.selectedPin;

    // Highlight starting pin with vibrant cyan glow ring
    this.setPinHighlight(this.selectedPin, true);

    // Update bottom Pin Selection HUD
    const hud = document.getElementById('pinSelectionHUD');
    const nameSpan = document.getElementById('pinSelectionHUDLabel') || document.getElementById('pinSelectionName');
    if (hud && nameSpan) {
      const pinName = this.board.getHumanReadablePinName(this.selectedPin);
      nameSpan.textContent = pinName;
      hud.classList.remove('hidden');
    }

    const pinName = this.board.getHumanReadablePinName(this.selectedPin);
    this.showToast(`Selected: ${pinName}. Click destination pin to connect.`, 'info');
  }

  deselectPin() {
    if (this.selectedPin) {
      this.clearPinHighlight(this.selectedPin);
      this.selectedPin = null;
    }
    this.wireStart = null;
    this.wireRenderer.clearPreview();

    const hud = document.getElementById('pinSelectionHUD');
    if (hud) {
      hud.classList.add('hidden');
    }
  }

  setPinHighlight(endpoint, active) {
    const pinEl = document.querySelector(`.terminal-pin[data-comp="${endpoint.comp}"][data-pin="${endpoint.pin}"]`);
    if (pinEl) {
      const ring = pinEl.querySelector('.terminal-hover-ring');
      if (active) {
        pinEl.classList.add('wire-start-active');
        if (ring) {
          ring.setAttribute('opacity', '1');
          ring.setAttribute('stroke', '#38bdf8');
          ring.setAttribute('stroke-width', '3.5');
        }
      } else {
        pinEl.classList.remove('wire-start-active');
        if (ring) {
          ring.setAttribute('opacity', '0');
          ring.setAttribute('stroke', '#facc15');
          ring.setAttribute('stroke-width', '2.5');
        }
      }
    }
  }

  clearPinHighlight(endpoint) {
    this.setPinHighlight(endpoint, false);
  }

  connectPins(from, to, customColor = null) {
    const color = customColor || this.wireRenderer.currentColor;
    const added = this.sim.addWire(from, to, color);

    this.deselectPin();

    if (added) {
      this.storage.recordState();
      if (!customColor) {
        this.wireRenderer.advanceColor();
        this.updateColorPickerActiveRing();
      }
      const fromName = this.board.getHumanReadablePinName(from);
      const toName = this.board.getHumanReadablePinName(to);
      this.showToast(`Connected ${fromName} → ${toName}!`, 'success');
      this.updateAutoWireModalUI();
      return true;
    } else {
      this.showToast('Connection already exists or pins invalid.', 'warning');
      return false;
    }
  }

  finishWireConnection(from, to) {
    return this.connectPins(from, to);
  }

  startWireDrawing(endpoint, coord) {
    this.selectPin(endpoint, coord);
  }

  cancelWireDrawing() {
    this.deselectPin();
  }

  handlePinClick(endpoint, coord) {
    if (this.activeTool === 'remove-wire' || this.activeTool === 'remove-ic') return;
    if (this.activeTool === 'hand') {
      this.setTool('wire');
    }

    if (this.dragCompleted) {
      this.dragCompleted = false;
      return;
    }

    const clicked = { comp: endpoint.comp, pin: String(endpoint.pin).trim() };

    if (!this.selectedPin) {
      // First pin clicked: Select it absolutely
      this.selectPin(clicked, coord);
    } else {
      // Second pin clicked: Check if same pin clicked again (toggle off)
      if (this.selectedPin.comp === clicked.comp && this.selectedPin.pin === clicked.pin) {
        this.deselectPin();
        this.showToast('Pin deselected.', 'info');
        return;
      }

      // Absolute connection guaranteed: connect selectedPin to clicked pin
      const from = { comp: this.selectedPin.comp, pin: this.selectedPin.pin };
      const to = clicked;
      this.connectPins(from, to);
    }
  }

  handlePinMouseDown(endpoint, coord, e) {
    if (this.activeTool === 'remove-wire' || (e && e.button !== 0)) return;
    if (this.activeTool === 'hand') {
      this.setTool('wire');
    }
    this.isPanning = false;
    this.pinDown = {
      endpoint: { comp: endpoint.comp, pin: String(endpoint.pin).trim() },
      coord,
      startX: e ? e.clientX : 0,
      startY: e ? e.clientY : 0,
      isDragging: false
    };
  }

  handlePinMouseUp(endpoint, coord, e) {
    if (this.activeTool === 'remove-wire' || (e && e.button !== 0)) return;

    if (this.pinDown && this.pinDown.isDragging) {
      // Geometric CTM nearest-pin snapping guarantees exact target identification
      const targetPin = (e && e.clientX !== undefined)
        ? (this.board.findPinNearScreenPoint(e.clientX, e.clientY) || endpoint)
        : endpoint;

      const from = this.pinDown.endpoint;
      const to = { comp: targetPin.comp, pin: String(targetPin.pin).trim() };
      if (from.comp !== to.comp || from.pin !== to.pin) {
        this.connectPins(from, to);
        this.dragCompleted = true;
      } else {
        this.deselectPin();
      }
    }
    this.pinDown = null;
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
      // CRITICAL: Update board dynamic elements immediately so IC chips are mounted
      // and their pin coordinates are mapped in board.pinCoords BEFORE wires are added
      this.board.updateDynamicElements();
    }

    // Connect wires
    if (preset.wires) {
      preset.wires.forEach(w => {
        this.sim.addWire(w.from, w.to, w.color);
      });
    }

    // Turn Power ON automatically so user can simulate immediately
    this.sim.setPower(true);
    this.board.updateDynamicElements();
    this.wireRenderer.renderWires(
      this.sim.wires,
      (endpoint) => this.board.getPinCoord(endpoint),
      this.sim.power,
      this.activeTool,
      (wireId) => this.handleWireClick(wireId)
    );

    this.setCircuitName(preset.title);
    this.storage.recordState();
    this.showToast(`Loaded "${preset.title}" with ICs and wiring ready!`, 'success');
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

    if (mountedBase && this.sim.power && mountedBase.pins) {
      const getPin = (p) => mountedBase.pins[p] ? (mountedBase.pins[p].level || 0) : 0;

      if (['74LS00', '74LS08', '74LS32', '74LS86', '74LS266'].includes(icId)) {
        // Gate 1: Pin 1 (1A), Pin 2 (1B)
        const inA = getPin(1);
        const inB = getPin(2);
        activeRowIndex = rows.findIndex(r => String(r[0]) === String(inA) && String(r[1]) === String(inB));
      } else if (icId === '74LS02') {
        // 74LS02 NOR: Gate 1 Inputs are Pin 2 (1A) and Pin 3 (1B)
        const inA = getPin(2);
        const inB = getPin(3);
        activeRowIndex = rows.findIndex(r => String(r[0]) === String(inA) && String(r[1]) === String(inB));
      } else if (icId === '74LS04' || icId === '74LS14') {
        // Inverter: Pin 1 (1A)
        const inA = getPin(1);
        activeRowIndex = rows.findIndex(r => String(r[0]) === String(inA));
      } else if (icId === '74LS10' || icId === '74LS11' || icId === '74LS27') {
        // 3-input gates: Gate 1 pins 1, 2, 13
        const inA = getPin(1);
        const inB = getPin(2);
        const inC = getPin(13);
        activeRowIndex = rows.findIndex(r => String(r[0]) === String(inA) && String(r[1]) === String(inB) && String(r[2]) === String(inC));
      } else if (icId === '74LS20' || icId === '74LS21') {
        const allOnes = getPin(1) === 1 && getPin(2) === 1 && getPin(4) === 1 && getPin(5) === 1;
        activeRowIndex = allOnes ? 0 : 1;
      } else if (icId === '74LS30') {
        const allOnes = [1, 2, 3, 4, 5, 6, 11, 12].every(p => getPin(p) === 1);
        activeRowIndex = allOnes ? 0 : 1;
      } else if (icId === '74LS85') {
        // 4-bit Magnitude Comparator
        const a = (getPin(15) << 3) | (getPin(13) << 2) | (getPin(12) << 1) | getPin(10);
        const b = (getPin(1) << 3) | (getPin(14) << 2) | (getPin(11) << 1) | getPin(9);
        if (a > b) activeRowIndex = 0;
        else if (a < b) activeRowIndex = 1;
        else activeRowIndex = 2;
      } else if (icId === '74LS151') {
        // 8:1 MUX: Pin 7 (S#), Pins 9(C), 10(B), 11(A)
        const s = getPin(7);
        if (s === 1) {
          activeRowIndex = 0;
        } else {
          const sel = (getPin(9) << 2) | (getPin(10) << 1) | getPin(11);
          activeRowIndex = Math.min(rows.length - 1, sel + 1);
        }
      } else if (icId === '74LS153') {
        // Dual 4:1 MUX: Pin 1 (1G#), Pins 2(B), 14(A)
        const g1 = getPin(1);
        if (g1 === 1) {
          activeRowIndex = 0;
        } else {
          const sel = (getPin(2) << 1) | getPin(14);
          activeRowIndex = Math.min(rows.length - 1, sel + 1);
        }
      } else if (icId === '74LS157') {
        // Quad 2:1 MUX: Pin 15 (STROBE#), Pin 1 (SELECT)
        const strobe = getPin(15);
        if (strobe === 1) {
          activeRowIndex = 0;
        } else {
          activeRowIndex = getPin(1) === 0 ? 1 : 2;
        }
      } else if (icId === '74LS138') {
        // 3:8 Decoder: G1 (pin 6), G2A# (pin 4), G2B# (pin 5)
        const en = getPin(6) === 1 && getPin(4) === 0 && getPin(5) === 0;
        if (!en) {
          activeRowIndex = 0;
        } else {
          const sel = (getPin(3) << 2) | (getPin(2) << 1) | getPin(1);
          activeRowIndex = Math.min(rows.length - 1, sel + 1);
        }
      } else if (icId === '74LS148') {
        // 8:3 Priority Encoder: Pin 5 (EI#), Inputs 4#(1), 5#(2), 6#(3), 7#(4), 0#(10), 1#(11), 2#(12), 3#(13)
        const ei = getPin(5);
        if (ei === 1) {
          activeRowIndex = 0;
        } else {
          const priorityPins = [
            { row: 2, pin: 4 },  // 7#
            { row: 3, pin: 3 },  // 6#
            { row: 4, pin: 2 },  // 5#
            { row: 5, pin: 1 },  // 4#
            { row: 6, pin: 13 }, // 3#
            { row: 7, pin: 12 }, // 2#
            { row: 8, pin: 11 }, // 1#
            { row: 9, pin: 10 }  // 0#
          ];
          const match = priorityPins.find(p => getPin(p.pin) === 0);
          activeRowIndex = match ? match.row : 1;
        }
      } else if (icId === '74LS74') {
        // Dual D FF
        const pre = getPin(4);
        const clr = getPin(1);
        if (pre === 0 && clr === 1) activeRowIndex = 0;
        else if (pre === 1 && clr === 0) activeRowIndex = 1;
        else if (pre === 0 && clr === 0) activeRowIndex = 2;
        else activeRowIndex = 3;
      } else {
        // Generic fallback: check first 1 or 2 pins
        const inPins = Object.entries(ic.pinout || {}).filter(([p, inf]) => inf.type === 'input').map(([p]) => Number(p));
        if (inPins.length >= 2) {
          const v0 = getPin(inPins[0]);
          const v1 = getPin(inPins[1]);
          activeRowIndex = rows.findIndex(r => (String(r[0]) === String(v0) || r[0] === 'X') && (String(r[1]) === String(v1) || r[1] === 'X'));
        }
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

    // Clicking empty canvas deselects active pin selection
    container.addEventListener('click', (e) => {
      if (
        !e.target.closest('.terminal-pin') &&
        !e.target.closest('.input-toggle-switch') &&
        !e.target.closest('.master-power-btn') &&
        !e.target.closest('.manual-pulse-box') &&
        !e.target.closest('.chip-remove-btn') &&
        !e.target.closest('.exact-ic-base') &&
        !e.target.closest('.mounted-ic-overlay') &&
        !e.target.closest('.wire-path')
      ) {
        if (this.selectedPin && !this.dragCompleted) {
          this.deselectPin();
        }
      }
    });

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
      // If mouse is pressed on a pin, prioritize wire dragging over canvas panning
      if (this.pinDown) {
        this.isPanning = false;
        if (!this.pinDown.isDragging) {
          const dist = Math.hypot(e.clientX - this.pinDown.startX, e.clientY - this.pinDown.startY);
          if (dist > 3) {
            this.pinDown.isDragging = true;
            if (!this.selectedPin) {
              this.selectPin(this.pinDown.endpoint, this.pinDown.coord);
            }
          }
        }
      }

      if (this.isPanning) {
        this.panX = e.clientX - this.panStart.x;
        this.panY = e.clientY - this.panStart.y;
        this.applyTransform();
        return;
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
          // Geometric CTM nearest-pin mapping guarantees exact target identification
          const targetPin = this.board.findPinNearScreenPoint(e.clientX, e.clientY);
          let toComp = null;
          let toPin = null;

          if (targetPin) {
            toComp = targetPin.comp;
            toPin = String(targetPin.pin).trim();
          } else {
            // Fallback to DOM elementFromPoint
            const targetPinEl = document.elementFromPoint(e.clientX, e.clientY)?.closest('.terminal-pin');
            if (targetPinEl) {
              toComp = targetPinEl.getAttribute('data-comp');
              toPin = targetPinEl.getAttribute('data-pin');
            }
          }

          if (toComp && toPin && (toComp !== this.pinDown.endpoint.comp || toPin !== this.pinDown.endpoint.pin)) {
            this.connectPins(this.pinDown.endpoint, { comp: toComp, pin: toPin });
            this.dragCompleted = true;
          } else if (toComp && toPin && toComp === this.pinDown.endpoint.comp && toPin === this.pinDown.endpoint.pin) {
            this.deselectPin();
          }
          // Note: If dropped in empty space, keep selectedPin active so user can click destination!
        }
        this.pinDown = null;
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
      } else if (e.key.toLowerCase() === 'w' || e.key.toLowerCase() === 'v') {
        this.setTool('wire');
      } else if (e.key.toLowerCase() === 'h') {
        this.setTool('hand');
      }
    });
  }


  // ==========================================
  // DIGITAL LOGIC SUITE (6 TOOLS) INTEGRATION
  // ==========================================

  setupDigitalLogicSuite() {
    const floatingBtn = document.getElementById('floatingLogicSuiteBtn');
    const navBtn = document.getElementById('navLogicSuiteBtn');
    const dropdown = document.getElementById('logicSuiteDropdown');
    const modal = document.getElementById('logic-suite-modal');

    // Toggle dropdown from floating toolbar lightbulb
    if (floatingBtn && dropdown) {
      floatingBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = dropdown.classList.contains('hidden');
        dropdown.classList.toggle('hidden', !isHidden);
      });
    }

    // Toggle dropdown from navbar
    if (navBtn && dropdown) {
      navBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = dropdown.classList.contains('hidden');
        dropdown.classList.toggle('hidden', !isHidden);
      });
    }

    // Dropdown items click handling
    if (dropdown) {
      dropdown.querySelectorAll('[data-tool-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const action = btn.getAttribute('data-tool-action');
          dropdown.classList.add('hidden');
          this.openDigitalLogicSuite(action);
        });
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (
          !dropdown.contains(e.target) &&
          (!floatingBtn || !floatingBtn.contains(e.target)) &&
          (!navBtn || !navBtn.contains(e.target))
        ) {
          dropdown.classList.add('hidden');
        }
      });
    }

    // Live Kit Sync Toggle button
    const liveToggleBtn = document.getElementById('suiteLiveSyncToggle');
    const liveDotPing = document.getElementById('suiteLiveDotPing');
    const liveDot = document.getElementById('suiteLiveDot');

    if (liveToggleBtn) {
      liveToggleBtn.addEventListener('click', () => {
        this.suite.liveSync = !this.suite.liveSync;
        if (this.suite.liveSync) {
          liveToggleBtn.textContent = 'LIVE ON';
          liveToggleBtn.className = 'text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-xs cursor-pointer';
          if (liveDot) liveDot.className = 'relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500';
          if (liveDotPing) liveDotPing.classList.remove('hidden');
          this.showToast('Live Kit Sync Enabled: Analyzing real trainer kit circuit in real-time!', 'success');
        } else {
          liveToggleBtn.textContent = 'LIVE OFF';
          liveToggleBtn.className = 'text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-all shadow-xs cursor-pointer';
          if (liveDot) liveDot.className = 'relative inline-flex rounded-full h-2.5 w-2.5 bg-slate-500';
          if (liveDotPing) liveDotPing.classList.add('hidden');
          this.showToast('Live Kit Sync Paused: Custom Design / Edit Mode active.', 'info');
        }
        this.updateLogicSuiteLive();
      });
    }

    // Counter Live Clock Stepper button
    const counterStepBtn = document.getElementById('counterStepClockBtn');
    if (counterStepBtn) {
      counterStepBtn.addEventListener('click', () => {
        this.stepLiveCounter();
      });
    }

    // FSM Live Clock Stepper button
    const fsmStepBtn = document.getElementById('fsmStepClockBtn');
    if (fsmStepBtn) {
      fsmStepBtn.addEventListener('click', () => {
        this.stepLiveFSM();
      });
    }

    // Target Output selector dropdown
    const outputSelect = document.getElementById('suiteOutputSelect');
    if (outputSelect) {
      outputSelect.addEventListener('change', (e) => {
        this.suiteTargetOutputLed = Number(e.target.value);
        this.updateLogicSuiteLive();
      });
    }

    // Modal navigation tab switching
    if (modal) {
      modal.querySelectorAll('.suite-tab-btn[data-suite-tab]').forEach(tabBtn => {
        tabBtn.addEventListener('click', () => {
          const tab = tabBtn.getAttribute('data-suite-tab');
          this.setSuiteTab(tab);
        });
      });

      // Solve -> Build button
      const buildBtn = document.getElementById('suiteBuildCircuitBtn');
      if (buildBtn) {
        buildBtn.addEventListener('click', () => {
          this.handleSuiteBuild();
        });
      }

      // K-Map variable buttons
      modal.querySelectorAll('.kmap-var-btn[data-kmap-vars]').forEach(btn => {
        btn.addEventListener('click', () => {
          const vars = Number(btn.getAttribute('data-kmap-vars'));
          this.suite.setVarsCount(vars);
          modal.querySelectorAll('.kmap-var-btn').forEach(b => {
            b.className = 'kmap-var-btn px-3 py-1 rounded-lg text-slate-600 hover:text-slate-900 transition-colors';
          });
          btn.className = 'kmap-var-btn px-3 py-1 rounded-lg bg-white text-amber-600 shadow-xs font-bold transition-colors';
          this.renderKMapTab();
        });
      });

      // K-Map Clear & Fill buttons
      document.getElementById('kmapClearBtn')?.addEventListener('click', () => {
        this.suite.minterms.clear();
        this.suite.dontCares.clear();
        this.renderKMapTab();
      });

      document.getElementById('kmapFillOnesBtn')?.addEventListener('click', () => {
        const total = 1 << this.suite.varsCount;
        this.suite.dontCares.clear();
        for (let i = 0; i < total; i++) this.suite.minterms.add(i);
        this.renderKMapTab();
      });

      // Copy SOP button
      document.getElementById('copyKMapSOPBtn')?.addEventListener('click', () => {
        const qm = this.suite.solveQuineMcCluskey();
        navigator.clipboard.writeText(qm.sop);
        this.showToast(`Copied SOP: F = ${qm.sop}`, 'success');
      });

      // Algebraic Presets
      modal.querySelectorAll('.algebraic-preset-btn[data-preset]').forEach(btn => {
        btn.addEventListener('click', () => {
          const preset = btn.getAttribute('data-preset');
          this.currentAlgebraicPreset = preset;
          if (preset === 'consensus') {
            this.suite.setVarsCount(3);
            this.suite.minterms = new Set([3, 5, 6, 7]); // AB + A'C + BC
            this.suite.dontCares = new Set([]);
          } else if (preset === 'absorption') {
            this.suite.setVarsCount(2);
            this.suite.minterms = new Set([2, 3]); // A + AB = A
            this.suite.dontCares = new Set([]);
          } else if (preset === 'demorgan') {
            this.suite.setVarsCount(2);
            this.suite.minterms = new Set([0]); // (A+B)' = A'B'
            this.suite.dontCares = new Set([]);
          } else if (preset === 'current') {
            if (this.suite.liveSync) {
              this.updateLogicSuiteLive();
            }
          }
          this.renderKMapTab();
          this.renderSimplifierTab(preset);
        });
      });

      // Counter selects
      const counterSeq = document.getElementById('counterSeqSelect');
      const counterFF = document.getElementById('counterFFSelect');
      if (counterSeq) counterSeq.addEventListener('change', () => this.renderCounterTab());
      if (counterFF) counterFF.addEventListener('change', () => this.renderCounterTab());

      // FSM select
      const fsmSelect = document.getElementById('fsmPresetSelect');
      if (fsmSelect) fsmSelect.addEventListener('change', () => this.renderFSMTab());
    }
  }

  openDigitalLogicSuite(preferredTool = 'kmap') {
    const modal = document.getElementById('logic-suite-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    this.setSuiteTab(preferredTool);
    this.updateLogicSuiteLive();
  }

  setSuiteTab(tabId) {
    this.currentSuiteTab = tabId;
    const modal = document.getElementById('logic-suite-modal');
    if (!modal) return;

    // Update active tab buttons
    modal.querySelectorAll('.suite-tab-btn').forEach(btn => {
      const isCurrent = btn.getAttribute('data-suite-tab') === tabId;
      if (isCurrent) {
        btn.className = 'suite-tab-btn active px-4 py-2.5 rounded-t-xl border-b-2 font-bold transition-all text-amber-400 border-amber-400 bg-slate-800/80';
      } else {
        btn.className = 'suite-tab-btn px-4 py-2.5 rounded-t-xl border-b-2 font-bold transition-all text-slate-400 border-transparent hover:text-slate-200';
      }
    });

    // Update tool badge
    const badge = document.getElementById('suiteActiveToolBadge');
    if (badge) {
      const titles = {
        'kmap': 'K-Map Solver',
        'truth-table': 'Truth Table & Waveform',
        'simplifier': 'Algebraic Simplifier',
        'circuit': 'Circuit Diagram',
        'counter': 'Counter Designer',
        'fsm': 'FSM Designer'
      };
      badge.textContent = titles[tabId] || 'Logic Suite';
    }

    // Hide all panels, show active panel
    modal.querySelectorAll('.suite-tab-panel').forEach(panel => {
      panel.classList.add('hidden');
    });
    const activePanel = document.getElementById(`suiteTabPanel_${tabId}`);
    if (activePanel) activePanel.classList.remove('hidden');

    // Trigger tab specific rendering or live update
    if (this.suite && this.suite.liveSync) {
      this.updateLogicSuiteLive();
    } else {
      if (tabId === 'kmap') this.renderKMapTab();
      else if (tabId === 'truth-table') this.renderTruthTableTab();
      else if (tabId === 'simplifier') this.renderSimplifierTab();
      else if (tabId === 'circuit') this.renderCircuitTab();
      else if (tabId === 'counter') this.renderCounterTab();
      else if (tabId === 'fsm') this.renderFSMTab();
    }
  }

  // ==========================================
  // LIVE LOGIC SUITE REAL-TIME SYNC & RENDERERS
  // ==========================================

  updateLogicSuiteLive() {
    const modal = document.getElementById('logic-suite-modal');
    if (!modal || modal.classList.contains('hidden')) return;

    if (this.suite.liveSync) {
      const circuitData = this.sim.generateCircuitTruthTable();

      if (this.suiteTargetOutputLed === undefined || !circuitData.outputs.includes(this.suiteTargetOutputLed)) {
        this.suiteTargetOutputLed = circuitData.outputs.length > 0 ? circuitData.outputs[0] : 0;
      }
      this.suite.syncWithCircuit(circuitData, this.suiteTargetOutputLed);

      // Update Live Circuit Banner
      const banner = document.getElementById('suiteLiveCircuitBanner');
      const summaryEl = document.getElementById('suiteLiveCircuitSummary');
      const inputStateEl = document.getElementById('suiteLiveInputState');
      const outputStateEl = document.getElementById('suiteLiveOutputState');
      const outputWrapper = document.getElementById('suiteOutputSelectWrapper');
      const outputSelect = document.getElementById('suiteOutputSelect');

      if (banner && summaryEl) {
        if (circuitData.inputs.length > 0 && circuitData.outputs.length > 0) {
          banner.className = 'px-6 py-2 bg-emerald-950/70 border-b border-emerald-800/60 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-emerald-200 select-none';
          const activeICNames = circuitData.activeICs.map(ic => `${ic.icId} on Base ${ic.baseIndex + 1}`).join(', ') || 'Direct Connection';
          summaryEl.textContent = `⚡ Live Circuit: ${circuitData.inputs.map(s => 'SW ' + s).join(', ')} ➔ [${activeICNames}] ➔ OUT ${this.suiteTargetOutputLed}`;
          
          if (inputStateEl) {
            const inStrs = circuitData.inputs.map(s => `SW${s}=${this.sim.switches[s] || 0}`);
            inputStateEl.textContent = `Live Inputs: ${inStrs.join(', ')}`;
          }

          if (outputWrapper && outputSelect) {
            outputWrapper.classList.remove('hidden');
            const currentVal = String(this.suiteTargetOutputLed);
            const optionsHtml = circuitData.outputs.map(out => {
              return `<option value="${out}" ${String(out) === currentVal ? 'selected' : ''}>OUT ${out}</option>`;
            }).join('');
            if (outputSelect.innerHTML !== optionsHtml) {
              outputSelect.innerHTML = optionsHtml;
            }
            outputSelect.value = currentVal;
          }

          if (outputStateEl) {
            const outVal = this.sim.leds[this.suiteTargetOutputLed] || 0;
            outputStateEl.textContent = `Live Output: OUT${this.suiteTargetOutputLed}=${outVal} (${outVal ? 'HIGH' : 'LOW'})`;
            outputStateEl.className = outVal ? 'bg-emerald-900 px-2 py-0.5 rounded border border-emerald-500 font-extrabold text-emerald-300 shadow-xs' : 'bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-semibold text-slate-400';
          }
        } else {
          banner.className = 'px-6 py-2 bg-amber-950/70 border-b border-amber-800/60 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-amber-200 select-none';
          summaryEl.textContent = circuitData.emptyReason || 'No complete circuit detected between switches and LEDs.';
          if (inputStateEl) inputStateEl.textContent = 'Custom Design Mode';
          if (outputWrapper) outputWrapper.classList.add('hidden');
          if (outputStateEl) outputStateEl.textContent = 'Solve → Build on Kit below';
        }
      }
    }

    // Refresh currently open tab
    if (this.currentSuiteTab === 'kmap') this.renderKMapTab();
    else if (this.currentSuiteTab === 'truth-table') this.renderTruthTableTab();
    else if (this.currentSuiteTab === 'simplifier') this.renderSimplifierTab();
    else if (this.currentSuiteTab === 'circuit') this.renderCircuitTab();
    else if (this.currentSuiteTab === 'counter') this.renderCounterTab();
    else if (this.currentSuiteTab === 'fsm') this.renderFSMTab();
  }

  // --- K-MAP TAB RENDERER (LIVE) ---
  renderKMapTab() {
    const container = document.getElementById('kmapGridContainer');
    const mintermsEl = document.getElementById('kmapMintermsSummary');
    const sopEl = document.getElementById('kmapMinimizedSOP');
    const gateBadge = document.getElementById('kmapGateCountBadge');
    const groupsListEl = document.getElementById('kmapGroupsList');
    const groupCountEl = document.getElementById('kmapGroupCount');
    const qmStepsEl = document.getElementById('kmapQMSteps');
    if (!container) return;

    const numVars = this.suite.varsCount;
    const grid = this.suite.getKMapGridConfig(numVars);
    const qm = this.suite.solveQuineMcCluskey();
    const liveMinterm = this.suite.liveRowIndex;

    // 1. Render interactive table with live active cell highlight
    let tableHtml = '<table class="kmap-grid-table select-none">';
    
    // Top column header
    tableHtml += '<tr><th class="p-2 text-xs font-mono font-bold text-slate-400">' + grid.rowVars.join('') + ' \ ' + grid.colVars.join('') + '</th>';
    grid.colLabels.forEach(cl => {
      tableHtml += `<th class="p-2 text-xs font-mono font-bold text-slate-700 text-center">${cl}</th>`;
    });
    tableHtml += '</tr>';

    // Grid rows
    grid.rowLabels.forEach((rl, rIdx) => {
      tableHtml += `<tr><th class="p-2 text-xs font-mono font-bold text-slate-700 text-right pr-3">${rl}</th>`;
      grid.colLabels.forEach((cl, cIdx) => {
        const minterm = grid.cells[rIdx][cIdx];
        const val = this.suite.getCellState(minterm);
        const isLiveCell = (minterm === liveMinterm);

        let cellClass = 'kmap-cell relative';
        if (val === 1) cellClass += ' state-1';
        else if (val === 'X') cellClass += ' state-x';
        if (isLiveCell) cellClass += ' ring-4 ring-emerald-500 shadow-lg scale-105 z-10 bg-emerald-100/50';

        tableHtml += `
          <td>
            <div class="${cellClass}" data-minterm="${minterm}" title="${isLiveCell ? 'LIVE: Current switch inputs match this cell!' : ''}">
              <span class="kmap-cell-idx">m${minterm}</span>
              ${isLiveCell ? '<span class="absolute top-1 right-1 px-1 py-0.2 rounded text-[8px] font-black bg-emerald-500 text-white animate-pulse">LIVE</span>' : ''}
              <span class="kmap-val">${val}</span>
            </div>
          </td>
        `;
      });
      tableHtml += '</tr>';
    });
    tableHtml += '</table>';
    container.innerHTML = tableHtml;

    // Bind cell clicks (toggles cell and pauses live sync if user custom edits)
    container.querySelectorAll('.kmap-cell[data-minterm]').forEach(cell => {
      cell.addEventListener('click', () => {
        const m = Number(cell.getAttribute('data-minterm'));
        if (this.suite.liveSync) {
          this.suite.liveSync = false;
          const liveToggleBtn = document.getElementById('suiteLiveSyncToggle');
          if (liveToggleBtn) {
            liveToggleBtn.textContent = 'LIVE OFF';
            liveToggleBtn.className = 'text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-all shadow-xs cursor-pointer';
          }
          this.showToast('Paused Live Sync for manual K-Map editing. Click LIVE ON to re-sync.', 'info');
        }
        this.suite.toggleCell(m);
        this.renderKMapTab();
      });
    });

    // 2. Update stats and equations
    const mintermArr = Array.from(this.suite.minterms).sort((a,b) => a-b);
    if (mintermsEl) mintermsEl.textContent = mintermArr.length ? `Σ m(${mintermArr.join(', ')})` : '0 minterms';
    const outName = this.suite.outputLedName || 'F';
    if (sopEl) sopEl.textContent = `${outName} = ${qm.sop || '0'}`;
    if (gateBadge) gateBadge.textContent = `Required Gates: ${qm.gateCount}`;
    if (groupCountEl) groupCountEl.textContent = `${qm.terms.length} Group${qm.terms.length === 1 ? '' : 's'}`;

    // 3. Render Prime Implicant groups
    if (groupsListEl) {
      if (qm.terms.length === 0) {
        groupsListEl.innerHTML = '<div class="text-slate-400 italic text-center py-2">No active groups</div>';
      } else {
        groupsListEl.innerHTML = qm.terms.map((t) => `
          <div class="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full flex-shrink-0" style="background-color: ${t.color}"></span>
              <span class="font-bold text-slate-800 font-mono">${t.term}</span>
            </div>
            <span class="font-mono text-[11px] text-slate-500">m(${t.minterms.join(', ')})</span>
          </div>
        `).join('');
      }
    }

    // 4. Quine-McCluskey Steps
    if (qmStepsEl) {
      qmStepsEl.innerHTML = qm.qmSteps.map(step => `<div>• ${step}</div>`).join('');
    }
  }

  // --- TRUTH TABLE & WAVEFORM TAB RENDERER (LIVE) ---
  renderTruthTableTab() {
    const tableContainer = document.getElementById('suiteTruthTableContainer');
    const stdEl = document.getElementById('ttStandardForms');
    const canvas = document.getElementById('suiteWaveformCanvas');
    if (!tableContainer) return;

    const data = this.suite.generateTruthTableData();
    const liveRowIndex = data.liveRowIndex !== undefined ? data.liveRowIndex : -1;

    if (stdEl) {
      stdEl.textContent = `${data.sopStandard} • ${data.posStandard}`;
    }

    const outputHeader = data.outputName || 'F (Output)';
    const hasMultipleOutputs = Boolean(data.allOutputLeds && data.allOutputLeds.length > 1);
    const activeTargetLed = data.outputLed !== undefined ? data.outputLed : (data.allOutputLeds && data.allOutputLeds[0]);

    const tableHeadersHtml = hasMultipleOutputs
      ? data.allOutputLeds.map(led => {
          const isActive = led === activeTargetLed;
          return `
            <th class="px-3 py-2 text-center border-l border-slate-200 cursor-pointer transition-colors ${isActive ? 'bg-emerald-100/90 text-emerald-800 font-extrabold shadow-xs' : 'text-slate-600 hover:bg-slate-200/70 font-bold'}"
                data-output-select="${led}" title="Click to solve this output in K-Map & Simplifier">
              OUT ${led} ${isActive ? '<span class="text-[9px] bg-emerald-600 text-white px-1 py-0.2 rounded ml-1">TARGET</span>' : ''}
            </th>
          `;
        }).join('')
      : `<th class="px-3 py-2 text-emerald-700 font-bold">${outputHeader}</th>`;

    tableContainer.innerHTML = `
      <div class="text-[11px] text-slate-500 px-3 py-1.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <span>💡 Click any row to test on trainer kit in real-time</span>
        <span class="font-bold text-emerald-700">Live Active Row Highlighted</span>
      </div>
      <table class="w-full text-left text-xs font-mono border-collapse">
        <thead class="bg-slate-100 border-b border-slate-200 sticky top-0">
          <tr>
            <th class="px-3 py-2 text-slate-500">Row</th>
            ${data.vars.map(v => `<th class="px-3 py-2 text-sky-700">${v}</th>`).join('')}
            ${tableHeadersHtml}
            <th class="px-3 py-2 text-slate-500 text-center">Kit Action</th>
          </tr>
        </thead>
        <tbody>
          ${data.rows.map(r => {
            const isLive = r.isLive || (r.index === liveRowIndex);
            const rowClass = isLive
              ? 'bg-emerald-100/90 border-l-4 border-l-emerald-600 font-extrabold text-emerald-950 shadow-xs'
              : 'border-b border-slate-100 hover:bg-slate-50 cursor-pointer';

            const outputCellsHtml = hasMultipleOutputs
              ? data.allOutputLeds.map(led => {
                  const val = r.allOutputs ? r.allOutputs[led] : (led === activeTargetLed ? r.output : 0);
                  const isTarget = led === activeTargetLed;
                  return `
                    <td class="px-3 py-2 font-bold text-center border-l border-slate-100 ${isTarget ? 'bg-emerald-50/50' : ''} ${val === 1 ? 'text-emerald-700' : 'text-slate-400'}">
                      ${val}
                      ${isTarget && isLive ? '<span class="ml-1.5 px-1 py-0.2 rounded bg-emerald-600 text-white font-black text-[8px] animate-pulse">LIVE</span>' : ''}
                    </td>
                  `;
                }).join('')
              : `
                <td class="px-3 py-2 font-bold ${r.output === 1 ? 'text-emerald-700' : (r.output === 'X' ? 'text-blue-500' : 'text-slate-400')}">
                  ${r.output}
                  ${isLive ? '<span class="ml-2 px-1.5 py-0.5 rounded bg-emerald-600 text-white font-black text-[9px] animate-pulse">▶ LIVE</span>' : ''}
                </td>
              `;

            return `
              <tr class="${rowClass} suite-live-tt-row" data-row-index="${r.index}" title="Click to test this row on trainer kit">
                <td class="px-3 py-2 text-slate-500 font-bold">m${r.index}</td>
                ${r.inputs.map(b => `<td class="px-3 py-2 font-bold ${b ? 'text-sky-600' : 'text-slate-400'}">${b}</td>`).join('')}
                ${outputCellsHtml}
                <td class="px-3 py-2 text-center">
                  <button type="button" class="px-2 py-0.5 rounded text-[10px] font-bold text-sky-700 hover:bg-sky-100 transition-colors">
                    ${isLive ? 'Active' : 'Apply'}
                  </button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;

    // Click output headers to switch active target output
    tableContainer.querySelectorAll('[data-output-select]').forEach(th => {
      th.addEventListener('click', (e) => {
        e.stopPropagation();
        const selected = Number(th.getAttribute('data-output-select'));
        this.suiteTargetOutputLed = selected;
        this.updateLogicSuiteLive();
      });
    });

    // Bind row clicks to set kit switches in real-time
    tableContainer.querySelectorAll('.suite-live-tt-row').forEach(row => {
      row.addEventListener('click', () => {
        const rowIdx = Number(row.getAttribute('data-row-index'));
        this.applyTruthTableRowToKit(rowIdx);
      });
    });

    // Draw Logic Analyzer Waveform on Canvas with Live Cursor
    if (canvas && canvas.getContext) {
      const ctx = canvas.getContext('2d');
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Dark background
      ctx.fillStyle = '#0b1329';
      ctx.fillRect(0, 0, w, h);

      const numSteps = data.rows.length;
      const colWidth = (w - 70) / numSteps;
      const outSignals = hasMultipleOutputs
        ? data.allOutputLeds.map(led => `OUT ${led}`)
        : [outputHeader];
      const signals = [...data.vars, ...outSignals];
      const rowHeight = (h - 30) / signals.length;

      signals.forEach((sig, idx) => {
        const yBase = 25 + idx * rowHeight;
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 10px JetBrains Mono, monospace';
        ctx.textAlign = 'right';
        ctx.fillText(sig, 55, yBase + 15);

        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(65, yBase + rowHeight);
        ctx.lineTo(w - 10, yBase + rowHeight);
        ctx.stroke();

        const isInput = idx < data.vars.length;
        ctx.strokeStyle = !isInput ? '#10b981' : (idx % 2 === 0 ? '#38bdf8' : '#a855f7');
        ctx.lineWidth = 2;
        ctx.beginPath();

        let lastVal = null;
        for (let s = 0; s < numSteps; s++) {
          let val;
          if (isInput) {
            val = data.rows[s].inputs[idx];
          } else {
            const outLedIndex = idx - data.vars.length;
            if (hasMultipleOutputs) {
              const outLed = data.allOutputLeds[outLedIndex];
              val = data.rows[s].allOutputs ? (data.rows[s].allOutputs[outLed] || 0) : 0;
            } else {
              val = data.rows[s].output === 1 ? 1 : 0;
            }
          }
          const xStart = 65 + s * colWidth;
          const xEnd = xStart + colWidth;
          const yHigh = yBase + 4;
          const yLow = yBase + rowHeight - 8;
          const yCur = val ? yHigh : yLow;

          if (s === 0) {
            ctx.moveTo(xStart, yCur);
          } else if (lastVal !== val) {
            ctx.lineTo(xStart, yCur);
          }
          ctx.lineTo(xEnd, yCur);
          lastVal = val;
        }
        ctx.stroke();
      });

      // Time step headers
      ctx.fillStyle = '#64748b';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      for (let s = 0; s < numSteps; s++) {
        const x = 65 + s * colWidth + colWidth / 2;
        ctx.fillText(`t${s}`, x, 14);
      }

      // Draw Live Playhead Cursor
      if (liveRowIndex >= 0 && liveRowIndex < numSteps) {
        const liveX = 65 + liveRowIndex * colWidth + colWidth / 2;

        // Glowing live vertical line
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(liveX, 16);
        ctx.lineTo(liveX, h - 10);
        ctx.stroke();
        ctx.setLineDash([]);

        // Live Marker Badge at top
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(liveX, 16, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 9px monospace';
        ctx.fillText('LIVE', liveX, 10);
      }
    }
  }

  applyTruthTableRowToKit(rowIndex) {
    if (this.suite.liveCircuitInfo && this.suite.liveCircuitInfo.inputs) {
      const activeSwitches = this.suite.liveCircuitInfo.inputs;
      const N = activeSwitches.length;
      activeSwitches.forEach((swNum, bitPos) => {
        const shift = N - 1 - bitPos;
        const bitVal = (rowIndex >> shift) & 1;
        this.sim.switches[swNum] = bitVal;
      });
      this.sim.power = true;
      this.storage.recordState();
      this.sim.evaluate();
      this.board.updateDynamicElements();
      this.showToast(`Set kit switches to row m${rowIndex}!`, 'success');
      this.updateLogicSuiteLive();
    }
  }

  // --- ALGEBRAIC SIMPLIFIER TAB RENDERER ---
  renderSimplifierTab(preset = null) {
    const container = document.getElementById('suiteAlgebraicStepsContainer');
    if (!container) return;

    if (preset) {
      this.currentAlgebraicPreset = preset;
    } else if (!this.currentAlgebraicPreset) {
      this.currentAlgebraicPreset = 'current';
    }

    // Update active preset button style
    const modal = document.getElementById('logic-suite-modal');
    if (modal) {
      modal.querySelectorAll('.algebraic-preset-btn').forEach(btn => {
        const p = btn.getAttribute('data-preset');
        if (p === this.currentAlgebraicPreset) {
          btn.className = 'algebraic-preset-btn active px-3 py-1.5 rounded-lg bg-purple-600 text-white font-bold text-xs shadow-xs';
        } else {
          btn.className = 'algebraic-preset-btn px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700';
        }
      });
    }

    const steps = this.suite.generateAlgebraicProof(
      this.suite.varsCount,
      this.suite.minterms,
      this.suite.dontCares,
      this.currentAlgebraicPreset
    );

    let html = '';
    steps.forEach((step, idx) => {
      const stepNum = step.step || (idx + 1);
      const isFinal = idx === steps.length - 1;
      const borderClass = isFinal ? 'border-2 border-purple-500 bg-purple-50/40' : 'border border-slate-200 bg-white';
      const badgeClass = isFinal ? 'bg-purple-600 text-white font-black' : 'bg-purple-100 text-purple-800 font-bold';

      html += `
        <div class="p-4 rounded-xl ${borderClass} shadow-xs space-y-2 transition-all hover:shadow-md">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded text-[10px] ${badgeClass}">STEP ${stepNum}</span>
              <span class="text-xs font-bold text-slate-800">${step.law}</span>
            </div>
            ${isFinal ? '<span class="text-[10px] font-extrabold text-purple-600 uppercase tracking-wider bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-300">★ Simplified Irredundant SOP</span>' : ''}
          </div>
          <div class="p-2.5 rounded-lg bg-slate-900 text-purple-300 font-mono text-sm font-extrabold tracking-wide overflow-x-auto select-all shadow-inner">
            ${step.expr}
          </div>
          <p class="text-xs text-slate-600 leading-relaxed">${step.note}</p>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // --- CIRCUIT DIAGRAM TAB RENDERER ---
  renderCircuitTab() {
    const origBadge = document.getElementById('circuitOrigGatesBadge');
    const minBadge = document.getElementById('circuitMinGatesBadge');
    const origContainer = document.getElementById('circuitOrigSvgContainer');
    const minContainer = document.getElementById('circuitMinSvgContainer');
    if (!origContainer || !minContainer) return;

    const spec = this.suite.getCircuitSchematicSpec();
    const qm = this.suite.solveQuineMcCluskey();

    if (origBadge) {
      origBadge.textContent = `${spec.original.totalGates} Gates (${spec.original.inverters} NOT, ${spec.original.andGates} AND, ${spec.original.orGates} OR)`;
    }
    if (minBadge) {
      minBadge.textContent = `${spec.minimized.totalGates} Gates (${spec.minimized.reductionPercent}% reduction)`;
    }

    const vars = this.suite.varNames.slice(0, this.suite.varsCount);
    const origTerms = Array.from(this.suite.minterms).sort((a,b) => a-b).map(m => {
      const bin = m.toString(2).padStart(this.suite.varsCount, '0');
      return bin.split('').map((b, idx) => b === '1' ? vars[idx] : vars[idx] + "'").join('');
    });

    const minTerms = qm.terms.map(t => t.term);

    origContainer.innerHTML = this.renderSchematicSVG(vars, origTerms, 'Original Canonical SOP', false);
    minContainer.innerHTML = this.renderSchematicSVG(vars, minTerms, 'Minimized Irredundant Schematic', true);
  }

  /**
   * Generates a clean, crisp logic gate schematic SVG.
   */
  renderSchematicSVG(vars, terms, title, isMinimized = false) {
    const W = 520;
    const H = 260;
    const themeColor = isMinimized ? '#10b981' : '#0284c7';
    const gateFill = isMinimized ? '#ecfdf5' : '#f0f9ff';
    const gateStroke = isMinimized ? '#059669' : '#0284c7';

    if (!terms || terms.length === 0) {
      return `
        <svg viewBox="0 0 ${W} ${H}" class="w-full h-full select-none" style="min-height: 240px;">
          <rect width="${W}" height="${H}" rx="12" fill="#0b1329"/>
          <text x="${W/2}" y="${H/2 - 10}" text-anchor="middle" fill="#64748b" font-family="monospace" font-size="14" font-weight="bold">No Active Minterms (Output F = 0)</text>
          <path d="M ${W/2 - 40} ${H/2 + 20} H ${W/2 + 40}" stroke="#ef4444" stroke-width="2"/>
          <path d="M ${W/2 - 25} ${H/2 + 26} H ${W/2 + 25}" stroke="#ef4444" stroke-width="2"/>
          <path d="M ${W/2 - 10} ${H/2 + 32} H ${W/2 + 10}" stroke="#ef4444" stroke-width="2"/>
          <text x="${W/2}" y="${H/2 + 50}" text-anchor="middle" fill="#ef4444" font-family="monospace" font-size="11" font-weight="bold">GND (LOW)</text>
        </svg>
      `;
    }

    const varColors = {
      'A': '#38bdf8',
      'B': '#34d399',
      'C': '#a78bfa',
      'D': '#fb923c'
    };

    const numTerms = terms.length;
    const midY = H / 2;
    const termSpacing = Math.min(55, Math.max(34, 180 / (numTerms || 1)));
    const startY = midY - ((numTerms - 1) * termSpacing) / 2;

    const xRailsStart = 30;
    const railPitch = 16;
    const xAndGates = 190;
    const xOrGate = 400;
    const xOut = 495;

    let svg = `<svg viewBox="0 0 ${W} ${H}" class="w-full h-full select-none" style="min-height: 240px;">`;
    svg += `<rect width="${W}" height="${H}" rx="12" fill="#0b1329"/>`;
    svg += `<text x="16" y="22" fill="#94a3b8" font-family="monospace" font-size="10" font-weight="bold">${title} • ${numTerms} Term${numTerms === 1 ? '' : 's'}</text>`;

    const railXMap = {};
    vars.forEach((v, vIdx) => {
      const xTrue = xRailsStart + vIdx * railPitch * 2;
      const xComp = xTrue + railPitch;
      railXMap[v] = xTrue;
      railXMap[v + "'"] = xComp;

      const col = varColors[v] || '#94a3b8';

      // True Rail
      svg += `<line x1="${xTrue}" y1="36" x2="${xTrue}" y2="${H - 20}" stroke="${col}" stroke-width="1.5" stroke-opacity="0.8"/>`;
      svg += `<circle cx="${xTrue}" cy="36" r="3" fill="${col}"/>`;
      svg += `<text x="${xTrue}" y="32" fill="${col}" font-family="monospace" font-size="10" font-weight="extrabold" text-anchor="middle">${v}</text>`;

      // Inverter for Complemented Rail
      svg += `<line x1="${xTrue}" y1="52" x2="${xComp}" y2="52" stroke="${col}" stroke-width="1.5" stroke-opacity="0.7"/>`;
      svg += `<circle cx="${xTrue}" cy="52" r="2" fill="${col}"/>`;
      svg += `<polygon points="${xComp-8},48 ${xComp},52 ${xComp-8},56" fill="#1e293b" stroke="#64748b" stroke-width="1"/>`;
      svg += `<circle cx="${xComp+2}" cy="52" r="2" fill="#1e293b" stroke="#64748b" stroke-width="1"/>`;
      svg += `<line x1="${xComp}" y1="54" x2="${xComp}" y2="${H - 20}" stroke="${col}" stroke-width="1.5" stroke-dasharray="3,2" stroke-opacity="0.7"/>`;
      svg += `<text x="${xComp}" y="42" fill="#64748b" font-family="monospace" font-size="8" font-weight="bold" text-anchor="middle">${v}'</text>`;
    });

    const andOutputs = [];

    terms.forEach((term, tIdx) => {
      const yTerm = startY + tIdx * termSpacing;

      const lits = [];
      for (let i = 0; i < term.length; i++) {
        if (vars.includes(term[i])) {
          let lit = term[i];
          if (term[i + 1] === "'") {
            lit += "'";
            i++;
          }
          lits.push(lit);
        }
      }

      if (lits.length === 1 && numTerms === 1) {
        const rx = railXMap[lits[0]] || xRailsStart;
        svg += `<line x1="${rx}" y1="${yTerm}" x2="${xOut}" y2="${yTerm}" stroke="${themeColor}" stroke-width="2"/>`;
        svg += `<circle cx="${rx}" cy="${yTerm}" r="3" fill="${themeColor}"/>`;
        andOutputs.push({ x: xOut, y: yTerm });
      } else {
        const andW = 32;
        const andH = 26;
        const gX = xAndGates;
        const gY = yTerm - andH / 2;

        const inY1 = yTerm - 6;
        const inY2 = yTerm + 6;
        const inYs = lits.length <= 1 ? [yTerm] : [inY1, inY2];

        lits.forEach((lit, lIdx) => {
          const rx = railXMap[lit];
          const targetY = inYs[lIdx % inYs.length];
          if (rx) {
            const col = varColors[lit.replace("'", '')] || '#94a3b8';
            svg += `<circle cx="${rx}" cy="${targetY}" r="2.5" fill="${col}"/>`;
            svg += `<line x1="${rx}" y1="${targetY}" x2="${gX}" y2="${targetY}" stroke="${col}" stroke-width="1.5"/>`;
          }
        });

        svg += `
          <path d="M ${gX} ${gY} h 16 a 13 13 0 0 1 13 13 a 13 13 0 0 1 -13 13 h -16 z"
                fill="${gateFill}" fill-opacity="0.15" stroke="${gateStroke}" stroke-width="2"/>
          <text x="${gX + 13}" y="${yTerm + 3}" fill="#cbd5e1" font-family="monospace" font-size="8" font-weight="bold" text-anchor="middle">${term}</text>
        `;

        const outX = gX + 29;
        andOutputs.push({ x: outX, y: yTerm });
      }
    });

    if (numTerms > 1) {
      const orW = 38;
      const orH = Math.max(38, Math.min(100, numTerms * 20));
      const orX = xOrGate;
      const orY = midY - orH / 2;

      andOutputs.forEach((pt, pIdx) => {
        const orInY = midY - ((numTerms - 1) * 10) / 2 + pIdx * 10;
        svg += `<path d="M ${pt.x} ${pt.y} H ${orX - 12} L ${orX + 4} ${orInY}" fill="none" stroke="${themeColor}" stroke-width="1.8"/>`;
      });

      svg += `
        <path d="M ${orX} ${orY} q 12 ${orH/2} 0 ${orH} q 24 0 38 -${orH/2} q -14 -${orH/2} -38 -${orH/2} z"
              fill="${gateFill}" fill-opacity="0.2" stroke="${gateStroke}" stroke-width="2.2"/>
        <text x="${orX + 16}" y="${midY + 4}" fill="#ffffff" font-family="monospace" font-size="10" font-weight="extrabold" text-anchor="middle">OR</text>
      `;

      const finalOutX = orX + 38;
      svg += `<line x1="${finalOutX}" y1="${midY}" x2="${xOut}" y2="${midY}" stroke="${themeColor}" stroke-width="2.5"/>`;
      svg += `<circle cx="${xOut}" cy="${midY}" r="4" fill="${themeColor}"/>`;
      svg += `<text x="${xOut + 8}" y="${midY + 4}" fill="#22c55e" font-family="monospace" font-size="12" font-weight="extrabold">F (OUT)</text>`;
    } else if (numTerms === 1 && andOutputs.length > 0) {
      const pt = andOutputs[0];
      svg += `<line x1="${pt.x}" y1="${pt.y}" x2="${xOut}" y2="${pt.y}" stroke="${themeColor}" stroke-width="2.5"/>`;
      svg += `<circle cx="${xOut}" cy="${pt.y}" r="4" fill="${themeColor}"/>`;
      svg += `<text x="${xOut + 8}" y="${pt.y + 4}" fill="#22c55e" font-family="monospace" font-size="12" font-weight="extrabold">F (OUT)</text>`;
    }

    svg += `</svg>`;
    return svg;
  }

  // --- COUNTER DESIGNER TAB RENDERER (LIVE) ---
  renderCounterTab() {
    const seqSelect = document.getElementById('counterSeqSelect');
    const ffSelect = document.getElementById('counterFFSelect');
    const lockoutText = document.getElementById('counterLockoutText');
    const excitationList = document.getElementById('counterExcitationList');
    const transitionsList = document.getElementById('counterTransitionsList');
    const stateBadge = document.getElementById('counterLiveStateBadge');

    const res = this.suite.designCounter({
      sequenceType: seqSelect?.value || 'bcd',
      flipFlop: ffSelect?.value || 'D'
    });

    const curIdx = this.suite.counterCurrentIndex % res.seq.length;
    const curVal = res.seq[curIdx];
    const curBin = curVal.toString(2).padStart(res.numBits, '0');
    const nextVal = res.seq[(curIdx + 1) % res.seq.length];
    const nextBin = nextVal.toString(2).padStart(res.numBits, '0');

    if (stateBadge) {
      stateBadge.textContent = `Live State: S${curVal} (${curBin})`;
    }

    if (lockoutText) lockoutText.textContent = res.lockoutNote;

    if (excitationList) {
      excitationList.innerHTML = res.excitationEquations.map(eq => `
        <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
          <span class="font-bold text-slate-800">${eq.flipFlop}:</span>
          <span class="text-sky-700 font-bold">${eq.equation}</span>
        </div>
      `).join('');
    }

    if (transitionsList) {
      transitionsList.innerHTML = res.transitions.map((t) => {
        const isCurrent = (t.from === curVal);
        const cardClass = isCurrent
          ? 'p-2.5 bg-emerald-50 border-2 border-emerald-500 rounded-xl flex items-center justify-between shadow-xs font-bold text-emerald-950'
          : 'p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between';

        return `
          <div class="${cardClass}">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded ${isCurrent ? 'bg-emerald-600 text-white' : 'bg-sky-100 text-sky-800'} font-bold">S${t.from}</span>
              <span class="text-slate-500">(${t.fromBin})</span>
              ${isCurrent ? '<span class="text-[10px] text-emerald-600 font-extrabold animate-pulse">◀ ACTIVE</span>' : ''}
            </div>
            <span class="text-slate-400 font-bold">→</span>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">S${t.to}</span>
              <span class="text-slate-500">(${t.toBin})</span>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  stepLiveCounter() {
    this.suite.counterCurrentIndex = (this.suite.counterCurrentIndex + 1);
    this.sim.setManualPulse(true);
    setTimeout(() => this.sim.setManualPulse(false), 150);
    this.renderCounterTab();
    this.showToast('Clock pulse fired: Counter advanced to next state!', 'info');
  }

  // --- FSM DESIGNER TAB RENDERER (LIVE) ---
  renderFSMTab() {
    const presetSelect = document.getElementById('fsmPresetSelect');
    const diagramContainer = document.getElementById('fsmDiagramContainer');
    const tableEl = document.getElementById('fsmTransitionsTable');
    const eqList = document.getElementById('fsmEquationsList');
    const stateBadge = document.getElementById('fsmLiveStateBadge');
    const inputBadge = document.getElementById('fsmLiveInputBadge');

    const fsm = this.suite.designFSM(presetSelect?.value || 'seq101');
    const curState = this.suite.fsmCurrentState || 'S0';

    // Current input bit from SW 0 on kit
    const curInputBit = this.sim.switches[0] || 0;

    if (stateBadge) stateBadge.textContent = `Live State: ${curState}`;
    if (inputBadge) inputBadge.textContent = `Input X: SW0=${curInputBit}`;

    if (diagramContainer) {
      diagramContainer.innerHTML = `
        <svg class="w-full h-full" viewBox="0 0 400 220">
          ${fsm.states.map((s, idx) => {
            const cx = 80 + idx * 120;
            const cy = 110;
            const isActive = (s.name === curState);

            return `
              <g>
                <circle cx="${cx}" cy="${cy}" r="30" fill="${isActive ? '#dcfce7' : '#f0fdf4'}" stroke="${isActive ? '#16a34a' : '#86efac'}" stroke-width="${isActive ? '4' : '2.5'}" ${isActive ? 'filter="drop-shadow(0 0 8px rgba(34,197,94,0.6))"' : ''}/>
                <text x="${cx}" y="${cy + 4}" font-size="13" font-weight="bold" fill="${isActive ? '#14532d' : '#15803d'}" text-anchor="middle">${s.name}</text>
                <text x="${cx}" y="${cy + 48}" font-size="10" font-weight="bold" fill="#64748b" text-anchor="middle">${s.code}</text>
                ${isActive ? `<text x="${cx}" y="${cy - 36}" font-size="9" font-weight="black" fill="#16a34a" text-anchor="middle">ACTIVE</text>` : ''}
              </g>
            `;
          }).join('')}

          <path d="M 108 100 Q 140 70 172 100" fill="none" stroke="#3b82f6" stroke-width="2"/>
          <text x="140" y="80" font-size="10" font-weight="bold" fill="#2563eb" text-anchor="middle">1 / 0</text>
          
          <path d="M 228 100 Q 260 70 292 100" fill="none" stroke="#3b82f6" stroke-width="2"/>
          <text x="260" y="80" font-size="10" font-weight="bold" fill="#2563eb" text-anchor="middle">0 / 0</text>

          <path d="M 292 125 Q 200 175 108 125" fill="none" stroke="#ec4899" stroke-width="2"/>
          <text x="200" y="165" font-size="10" font-weight="bold" fill="#db2777" text-anchor="middle">1 / 1 (Detected!)</text>
        </svg>
      `;
    }

    if (tableEl) {
      tableEl.innerHTML = `
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-100 border-b border-slate-200">
              <th class="p-1.5">Current</th>
              <th class="p-1.5">Input X</th>
              <th class="p-1.5">Next State</th>
              <th class="p-1.5">Output Z</th>
            </tr>
          </thead>
          <tbody>
            ${fsm.transitions.map(tr => {
              const isActive = (tr.from === curState && tr.input === curInputBit);
              const trClass = isActive ? 'bg-purple-100 font-extrabold text-purple-950 border-l-4 border-l-purple-600' : 'border-b border-slate-100';

              return `
                <tr class="${trClass}">
                  <td class="p-1.5 font-bold">${tr.from} ${isActive ? '◀' : ''}</td>
                  <td class="p-1.5">${tr.input}</td>
                  <td class="p-1.5 font-bold text-sky-700">${tr.next}</td>
                  <td class="p-1.5 font-bold ${tr.out ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400'}">${tr.out}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    }

    if (eqList) {
      eqList.innerHTML = fsm.equations.map(eq => `
        <div class="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
          <span class="font-bold text-slate-700">${eq.target}:</span>
          <span class="font-bold text-purple-700">${eq.expr}</span>
        </div>
      `).join('');
    }
  }

  stepLiveFSM() {
    const fsm = this.suite.designFSM(document.getElementById('fsmPresetSelect')?.value || 'seq101');
    const curInput = this.sim.switches[0] || 0;
    const curState = this.suite.fsmCurrentState || 'S0';

    const match = fsm.transitions.find(tr => tr.from === curState && tr.input === curInput);
    if (match) {
      this.suite.fsmCurrentState = match.next;
      this.sim.setManualPulse(true);
      setTimeout(() => this.sim.setManualPulse(false), 150);
      this.renderFSMTab();
      this.showToast(`FSM transitioned from ${curState} ➔ ${match.next} (Output Z=${match.out})`, 'info');
    }
  }

  // --- SOLVE -> BUILD CIRCUIT ON TRAINER KIT ---
  handleSuiteBuild() {
    let spec;
    if (this.currentSuiteTab === 'counter') {
      const counterSeq = document.getElementById('counterSeqSelect')?.value || 'bcd';
      const counterFF = document.getElementById('counterFFSelect')?.value || 'D';
      spec = this.suite.synthesizeCounterToKit({ sequenceType: counterSeq, flipFlop: counterFF });
    } else {
      spec = this.suite.synthesizeCircuitToKit();
    }

    this.sim.resetCircuit();

    if (spec.icBases) {
      spec.icBases.forEach(b => {
        this.sim.insertIC(b.id, b.icId);
      });
      // CRITICAL: Update board dynamic elements immediately so IC chips are mounted
      // and their pin coordinates are mapped in board.pinCoords BEFORE wires are added
      this.board.updateDynamicElements();
    }

    if (spec.wires) {
      spec.wires.forEach(w => {
        this.sim.addWire(w.from, w.to, w.color);
      });
    }

    if (spec.switches) {
      spec.switches.forEach(swIdx => {
        this.sim.switches[swIdx] = 1;
      });
    }

    this.sim.setPower(true);
    this.board.updateDynamicElements();
    this.wireRenderer.renderWires(
      this.sim.wires,
      (endpoint) => this.board.getPinCoord(endpoint),
      this.sim.power,
      this.activeTool,
      (wireId) => this.handleWireClick(wireId)
    );

    this.setCircuitName(spec.title || 'Digital Logic Circuit');
    this.storage.recordState();

    document.getElementById('logic-suite-modal')?.classList.add('hidden');
    this.showToast(`⚡ Built "${spec.title}" on Trainer Kit! Power is ON.`, 'success');
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

  // ==========================================
  // AUTOMATIC WIRE ROUTING & SYSTEM
  // ==========================================

  setupAutoWireSystem() {
    const modal = document.getElementById('auto-wire-modal');
    const navBtn = document.getElementById('navAutoWireBtn');
    const hudAutoWireBtn = document.getElementById('pinSelectionAutoWireBtn');
    const hudCancelBtn = document.getElementById('pinSelectionCancelBtn');
    const singleConnectBtn = document.getElementById('autoWireSingleConnectBtn');
    const batchExecuteBtn = document.getElementById('autoWireBatchExecuteBtn');
    const clearAllWiresBtn = document.getElementById('autoWireClearAllWiresBtn');
    const tabDropdownBtn = document.getElementById('tabAutoWireDropdownBtn');
    const tabBatchBtn = document.getElementById('tabAutoWireBatchBtn');
    const dropdownSection = document.getElementById('autoWireDropdownSection');
    const batchSection = document.getElementById('autoWireBatchSection');

    // Tab switching
    if (tabDropdownBtn && tabBatchBtn && dropdownSection && batchSection) {
      tabDropdownBtn.addEventListener('click', () => {
        tabDropdownBtn.className = 'auto-wire-tab-btn active px-4 py-2.5 rounded-t-xl border-b-2 font-bold transition-all text-cyan-400 border-cyan-400 bg-slate-800/80';
        tabBatchBtn.className = 'auto-wire-tab-btn px-4 py-2.5 rounded-t-xl border-b-2 font-bold transition-all text-slate-400 border-transparent hover:text-slate-200';
        dropdownSection.classList.remove('hidden');
        batchSection.classList.add('hidden');
      });

      tabBatchBtn.addEventListener('click', () => {
        tabBatchBtn.className = 'auto-wire-tab-btn active px-4 py-2.5 rounded-t-xl border-b-2 font-bold transition-all text-cyan-400 border-cyan-400 bg-slate-800/80';
        tabDropdownBtn.className = 'auto-wire-tab-btn px-4 py-2.5 rounded-t-xl border-b-2 font-bold transition-all text-slate-400 border-transparent hover:text-slate-200';
        batchSection.classList.remove('hidden');
        dropdownSection.classList.add('hidden');
      });
    }

    // Populate Pin Dropdowns & Color Swatches
    this.populateAutoWireDropdowns();

    // Open from Navbar Button
    if (navBtn && modal) {
      navBtn.addEventListener('click', () => {
        this.populateAutoWireDropdowns();
        this.updateAutoWireModalUI();
        modal.classList.remove('hidden');
      });
    }

    // HUD Auto-Wire Button
    if (hudAutoWireBtn && modal) {
      hudAutoWireBtn.addEventListener('click', () => {
        this.populateAutoWireDropdowns();
        if (this.selectedPin) {
          const fromVal = `${this.selectedPin.comp}:${this.selectedPin.pin}`;
          const fromSelect = document.getElementById('autoWireFromSelect');
          if (fromSelect) fromSelect.value = fromVal;
        }
        this.updateAutoWireModalUI();
        modal.classList.remove('hidden');
      });
    }

    // HUD Cancel Button
    if (hudCancelBtn) {
      hudCancelBtn.addEventListener('click', () => {
        this.deselectPin();
        this.showToast('Pin selection cancelled.', 'info');
      });
    }

    // Single Wire Connect
    if (singleConnectBtn) {
      singleConnectBtn.addEventListener('click', () => {
        const fromSelect = document.getElementById('autoWireFromSelect');
        const toSelect = document.getElementById('autoWireToSelect');
        if (!fromSelect || !toSelect) return;

        const fromVal = fromSelect.value;
        const toVal = toSelect.value;
        if (!fromVal || !toVal) {
          this.showToast('Please select both source and destination pins.', 'warning');
          return;
        }

        const [fromComp, fromPin] = fromVal.split(':');
        const [toComp, toPin] = toVal.split(':');

        if (fromComp === toComp && fromPin === toPin) {
          this.showToast('Cannot connect a pin to itself.', 'warning');
          return;
        }

        const color = this.wireRenderer.currentColor;
        const success = this.connectPins({ comp: fromComp, pin: fromPin }, { comp: toComp, pin: toPin }, color);
        if (success) {
          this.updateAutoWireModalUI();
        }
      });
    }

    // Batch Auto-Wire Execution
    if (batchExecuteBtn) {
      batchExecuteBtn.addEventListener('click', () => {
        const textarea = document.getElementById('autoWireBatchInput') || document.getElementById('autoWireBatchText');
        if (!textarea) return;
        this.executeAutoWireBatch(textarea.value);
      });
    }

    // Batch Presets
    document.querySelectorAll('.batch-insert-btn, .auto-wire-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const syntax = btn.getAttribute('data-text') || btn.getAttribute('data-syntax');
        const textarea = document.getElementById('autoWireBatchInput') || document.getElementById('autoWireBatchText');
        if (textarea && syntax) {
          if (textarea.value.trim() === '') {
            textarea.value = syntax.trim() + '\n';
          } else {
            textarea.value = textarea.value.trim() + '\n' + syntax.trim() + '\n';
          }
          textarea.focus();
        }
      });
    });

    // Clear All Wires
    if (clearAllWiresBtn) {
      clearAllWiresBtn.addEventListener('click', () => {
        if (this.sim.wires.length === 0) {
          this.showToast('No active wires to clear.', 'info');
          return;
        }
        if (confirm(`Disconnect all ${this.sim.wires.length} wires from the board?`)) {
          this.sim.wires = [];
          this.sim.evaluate();
          this.storage.recordState();
          this.updateAutoWireModalUI();
          this.showToast('All wires disconnected.', 'info');
        }
      });
    }
  }

  populateAutoWireDropdowns() {
    const fromSelect = document.getElementById('autoWireFromSelect');
    const toSelect = document.getElementById('autoWireToSelect');
    const swatchesContainer = document.getElementById('autoWireColorSwatches');
    if (!fromSelect || !toSelect) return;

    const availableCategories = this.board.getAllAvailablePins();

    const renderOptions = () => {
      return availableCategories.map(cat => `
        <optgroup label="${cat.category}">
          ${cat.pins.map(p => `<option value="${p.value}">${p.label}</option>`).join('')}
        </optgroup>
      `).join('');
    };

    const optionsHtml = renderOptions();
    const prevFrom = fromSelect.value;
    const prevTo = toSelect.value;

    fromSelect.innerHTML = optionsHtml;
    toSelect.innerHTML = optionsHtml;

    if (prevFrom) fromSelect.value = prevFrom;
    else fromSelect.value = 'switch:15';

    if (prevTo) toSelect.value = prevTo;
    else toSelect.value = 'icbase_0:1';

    // Populate Color Swatches
    if (swatchesContainer && swatchesContainer.children.length === 0) {
      swatchesContainer.innerHTML = WIRE_PALETTE.map(c => `
        <button type="button" class="w-6 h-6 rounded-full border border-slate-400 hover:scale-110 transition-transform cursor-pointer auto-wire-color-swatch ${c.hex === this.wireRenderer.currentColor ? 'ring-2 ring-sky-500' : ''}" style="background-color: ${c.hex}" data-hex="${c.hex}" title="${c.name}"></button>
      `).join('');

      swatchesContainer.querySelectorAll('.auto-wire-color-swatch').forEach(b => {
        b.addEventListener('click', () => {
          const hex = b.getAttribute('data-hex');
          this.wireRenderer.setCurrentColor(hex);
          swatchesContainer.querySelectorAll('.auto-wire-color-swatch').forEach(s => s.classList.remove('ring-2', 'ring-sky-500'));
          b.classList.add('ring-2', 'ring-sky-500');
          this.updateColorPickerActiveRing();
        });
      });
    }
  }

  updateAutoWireModalUI() {
    const countBadge = document.getElementById('autoWireActiveCount') || document.getElementById('autoWireCountBadge');
    if (countBadge) {
      countBadge.textContent = this.sim.wires.length;
    }

    const listContainer = document.getElementById('autoWireExistingList');
    if (listContainer) {
      if (this.sim.wires.length === 0) {
        listContainer.innerHTML = `
          <div class="text-center py-6 text-slate-400 italic text-xs">
            No wires connected yet. Select pins above or click terminals directly on the board.
          </div>
        `;
      } else {
        listContainer.innerHTML = this.sim.wires.map((w) => {
          const fromName = this.board.getHumanReadablePinName(w.from);
          const toName = this.board.getHumanReadablePinName(w.to);
          return `
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full border border-black/20 shadow-sm shrink-0" style="background-color: ${w.color || '#3b82f6'};"></span>
                <span class="font-bold text-slate-800">${fromName}</span>
                <span class="text-slate-400">➔</span>
                <span class="font-bold text-slate-800">${toName}</span>
              </div>
              <button type="button" class="disconnect-wire-btn text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded text-xs font-semibold transition-colors cursor-pointer" data-wire-id="${w.id}">
                Disconnect
              </button>
            </div>
          `;
        }).join('');

        listContainer.querySelectorAll('.disconnect-wire-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const wireId = btn.getAttribute('data-wire-id');
            if (wireId) {
              this.sim.removeWire(wireId);
              this.storage.recordState();
              this.updateAutoWireModalUI();
              this.showToast('Wire disconnected.', 'info');
            }
          });
        });
      }
    }
  }

  parsePinString(rawStr) {
    if (!rawStr) return null;
    const s = rawStr.trim().toLowerCase();

    // 1. Power connections
    if (['vcc', '+5v', '5v', 'power:vcc', 'power_vcc', 'pwr:vcc', 'vcc:0'].includes(s)) {
      return { comp: 'power', pin: 'vcc' };
    }
    if (['gnd', 'ground', '0v', 'power:gnd', 'power_gnd', 'pwr:gnd', 'gnd:0'].includes(s)) {
      return { comp: 'power', pin: 'gnd' };
    }

    // 2. Switches: SW 15, Switch 15, SW15, IN 15, S15
    const swMatch = s.match(/^(?:sw(?:itch)?|input|in|s)\s*[:\-_]?\s*(\d{1,2})$/);
    if (swMatch) {
      const num = parseInt(swMatch[1], 10);
      if (num >= 0 && num <= 15) return { comp: 'switch', pin: String(num) };
    }

    // 3. Output LEDs: OUT 13, LED 13, Output 13, OUT13, O13
    const outMatch = s.match(/^(?:out(?:put)?|led|o)\s*[:\-_]?\s*(\d{1,2})$/);
    if (outMatch) {
      const num = parseInt(outMatch[1], 10);
      if (num >= 0 && num <= 15) return { comp: 'led', pin: String(num) };
    }

    // 4. Clock: CLK 1Hz, Clock 10Hz, etc.
    const clkMatch = s.match(/^(?:clk|clock)\s*[:\-_]?\s*(1hz|5hz|10hz|100hz|1khz|10khz|100khz|1|5|10|manual|manual_inv)$/);
    if (clkMatch) {
      const val = clkMatch[1].replace('hz', '');
      return { comp: 'clock', pin: val };
    }

    // 5. Pulsers: Pulse 1, Pulse A, Pulser 2, Pulser B
    const pulseMatch = s.match(/^(?:pulse|pulser)\s*[:\-_]?\s*([12ab])$/);
    if (pulseMatch) {
      const p = ['1', 'a'].includes(pulseMatch[1]) ? '1' : '2';
      return { comp: 'pulse', pin: p };
    }

    // 6. 7-Segment Displays: Disp 1 Pin A, Display 2 Pin DP
    const dispMatch = s.match(/^(?:disp(?:lay)?)\s*([12])\s*(?:pin|p|:)?\s*([a-g]|dp)$/);
    if (dispMatch) {
      return { comp: `display_${dispMatch[1]}`, pin: dispMatch[2] };
    }

    // 7. IC Base Pin: IC1 Pin 14, Base 1 Pin 7, IC 2 Pin 1, IC1:14, Base 1:7
    const icMatch = s.match(/^(?:ic(?:base)?|base)\s*[:\-_]?\s*(\d)\s*(?:pin|p|:)?\s*[:\-_]?\s*(\d{1,2})$/);
    if (icMatch) {
      const baseNum = parseInt(icMatch[1], 10);
      const baseIdx = baseNum >= 1 ? baseNum - 1 : 0;
      const pinNum = parseInt(icMatch[2], 10);
      if (baseIdx >= 0 && baseIdx < 5 && pinNum >= 1 && pinNum <= 20) {
        return { comp: `icbase_${baseIdx}`, pin: String(pinNum) };
      }
    }

    // 8. Named IC Chip lookup: e.g. "74LS08 Pin 3", "7408 Pin 1"
    const chipMatch = s.match(/^(74[a-z0-9]+)\s*(?:pin|p|:)?\s*[:\-_]?\s*(\d{1,2})$/);
    if (chipMatch) {
      const chipQuery = chipMatch[1];
      const pinNum = parseInt(chipMatch[2], 10);
      const foundIdx = this.sim.icBases.findIndex(b => b.icId && b.icId.toLowerCase().includes(chipQuery));
      if (foundIdx !== -1 && pinNum >= 1 && pinNum <= 20) {
        return { comp: `icbase_${foundIdx}`, pin: String(pinNum) };
      }
    }

    // 9. Direct endpoint format: comp:pin (e.g. switch:15, icbase_0:3)
    if (s.includes(':')) {
      const parts = s.split(':');
      let comp = parts[0].trim();
      if (comp === 'output') comp = 'led';
      return { comp, pin: parts[1].trim() };
    }

    return null;
  }

  executeAutoWireBatch(text) {
    const statusMsg = document.getElementById('autoWireBatchLogContainer') || document.getElementById('autoWireStatusMsg');
    if (!text || text.trim() === '') {
      this.showToast('Please enter at least one wire connection command.', 'warning');
      return;
    }

    const lines = text.split('\n');
    let successCount = 0;
    let duplicateCount = 0;
    const errors = [];
    const logItems = [];

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) {
        return;
      }

      // Match delimiters: '->', '=>', 'to', ',', '--'
      const parts = trimmed.split(/\s*(?:->|=>|\bto\b|,|--)\s*/i);
      if (parts.length < 2) {
        errors.push(`Line ${idx + 1}: Expected format "FROM -> TO" (Got: "${trimmed}")`);
        return;
      }

      const fromStr = parts[0].trim();
      const toStr = parts[1].trim();

      const fromEp = this.parsePinString(fromStr);
      const toEp = this.parsePinString(toStr);

      if (!fromEp) {
        errors.push(`Line ${idx + 1}: Unrecognized source pin "${fromStr}"`);
        return;
      }
      if (!toEp) {
        errors.push(`Line ${idx + 1}: Unrecognized destination pin "${toStr}"`);
        return;
      }

      if (fromEp.comp === toEp.comp && String(fromEp.pin) === String(toEp.pin)) {
        errors.push(`Line ${idx + 1}: Cannot connect pin to itself (${fromStr})`);
        return;
      }

      const added = this.sim.addWire(fromEp, toEp, this.wireRenderer.currentColor);
      if (added) {
        successCount++;
        this.wireRenderer.advanceColor();
        logItems.push(`✓ Connected: ${fromStr} ➔ ${toStr}`);
      } else {
        duplicateCount++;
        logItems.push(`⚠ Already connected: ${fromStr} ➔ ${toStr}`);
      }
    });

    if (successCount > 0) {
      this.storage.recordState();
      this.updateColorPickerActiveRing();
      this.updateAutoWireModalUI();
      this.showToast(`Auto-wired ${successCount} connection(s) successfully!`, 'success');
    }

    if (statusMsg) {
      statusMsg.classList.remove('hidden');
      statusMsg.innerHTML = `
        <div class="font-bold text-emerald-400 mb-1">⚡ Batch Results: ${successCount} added, ${duplicateCount} skipped, ${errors.length} failed</div>
        ${logItems.map(item => `<div class="text-slate-300 text-[11px]">${item}</div>`).join('')}
        ${errors.map(err => `<div class="text-rose-400 text-[11px]">✕ ${err}</div>`).join('')}
      `;
    }
  }
}

// Initialize as soon as DOM is ready or if SVG container is already in document
function initDeldApp() {
  if (!window.app) {
    try {
      window.app = new DeldApp();
    } catch (e) {
      console.error('Failed to initialize DeldApp:', e);
    }
  }
}

if (document.getElementById('trainer-kit-svg')) {
  initDeldApp();
} else if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDeldApp);
  window.addEventListener('load', initDeldApp);
} else {
  initDeldApp();
}


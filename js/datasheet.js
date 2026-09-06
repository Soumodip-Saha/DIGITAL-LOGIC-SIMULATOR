/**
 * DELD Virtual Trainer Kit - IC Datasheet & Pinout Viewer
 * Displays authentic pinout diagrams, functional truth tables,
 * and electrical logic descriptions.
 */

import { IC_LIBRARY } from './ic-library.js';

export class DatasheetViewer {
  constructor(modalElement) {
    this.modal = modalElement;
    this.currentIC = '74LS00';
  }

  show(icId) {
    if (!IC_LIBRARY[icId]) icId = '74LS00';
    this.currentIC = icId;
    this.render();
    this.modal.classList.remove('hidden');
  }

  hide() {
    this.modal.classList.add('hidden');
  }

  render() {
    const ic = IC_LIBRARY[this.currentIC];
    if (!ic) return;

    // Set Header
    const titleEl = this.modal.querySelector('#datasheet-title');
    const descEl = this.modal.querySelector('#datasheet-desc');
    const pinsCountEl = this.modal.querySelector('#datasheet-pins-count');

    if (titleEl) titleEl.textContent = ic.name;
    if (descEl) descEl.textContent = ic.description;
    if (pinsCountEl) pinsCountEl.textContent = `${ic.pins}-Pin Dual In-Line Package (DIP)`;

    // Render Pinout Diagram (SVG DIP Chip)
    const diagramContainer = this.modal.querySelector('#datasheet-pinout-diagram');
    if (diagramContainer) {
      diagramContainer.innerHTML = this._buildPinoutSVG(ic);
    }

    // Render Truth Table
    const truthTableContainer = this.modal.querySelector('#datasheet-truth-table');
    if (truthTableContainer) {
      truthTableContainer.innerHTML = this._buildTruthTableHTML(ic);
    }

    // Render Pin List Table
    const pinTableBody = this.modal.querySelector('#datasheet-pins-table-body');
    if (pinTableBody) {
      pinTableBody.innerHTML = Object.entries(ic.pinout).map(([pinNum, data]) => {
        let typeBadgeClass = 'badge-input';
        if (data.type === 'output') typeBadgeClass = 'badge-output';
        else if (data.type === 'vcc') typeBadgeClass = 'badge-vcc';
        else if (data.type === 'gnd') typeBadgeClass = 'badge-gnd';
        else if (data.type === 'nc') typeBadgeClass = 'badge-nc';

        return `
          <tr class="border-b border-slate-700/60 hover:bg-slate-800/40 transition-colors">
            <td class="px-4 py-2 text-center font-mono font-bold text-slate-200">${pinNum}</td>
            <td class="px-4 py-2 font-mono font-bold text-sky-400">${data.name}</td>
            <td class="px-4 py-2">
              <span class="inline-block px-2 py-0.5 text-xs font-semibold rounded ${typeBadgeClass}">
                ${data.type.toUpperCase()}
              </span>
            </td>
            <td class="px-4 py-2 text-sm text-slate-300">${data.desc || '-'}</td>
          </tr>
        `;
      }).join('');
    }
  }

  _buildPinoutSVG(ic) {
    const pins = ic.pins;
    const half = pins / 2;
    const height = half * 32 + 50;
    const width = 300;

    const leftPins = [];
    const rightPins = [];

    for (let p = 1; p <= half; p++) leftPins.push(p);
    for (let p = pins; p > half; p--) rightPins.push(p);

    let pinsSVG = '';

    // Left pins
    leftPins.forEach((p, idx) => {
      const py = 45 + idx * 30;
      const def = ic.pinout[p] || { name: 'NC', type: 'nc' };
      pinsSVG += `
        <!-- Pin lead -->
        <rect x="40" y="${py - 4}" width="30" height="8" fill="#94a3b8" rx="2"/>
        <!-- Pin number -->
        <text x="32" y="${py + 3}" text-anchor="end" font-family="'Inter', monospace" font-size="11" font-weight="700" fill="#94a3b8">${p}</text>
        <!-- Pin label inside chip -->
        <text x="78" y="${py + 3}" font-family="'Inter', sans-serif" font-size="10" font-weight="700" fill="#38bdf8">${def.name}</text>
      `;
    });

    // Right pins
    rightPins.forEach((p, idx) => {
      const py = 45 + idx * 30;
      const def = ic.pinout[p] || { name: 'NC', type: 'nc' };
      pinsSVG += `
        <rect x="230" y="${py - 4}" width="30" height="8" fill="#94a3b8" rx="2"/>
        <text x="268" y="${py + 3}" font-family="'Inter', monospace" font-size="11" font-weight="700" fill="#94a3b8">${p}</text>
        <text x="222" y="${py + 3}" text-anchor="end" font-family="'Inter', sans-serif" font-size="10" font-weight="700" fill="#38bdf8">${def.name}</text>
      `;
    });

    return `
      <svg viewBox="0 0 ${width} ${height}" class="w-full max-w-xs mx-auto drop-shadow-lg">
        <!-- Chip body -->
        <rect x="70" y="20" width="160" height="${height - 35}" rx="6" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        <!-- Top orientation notch -->
        <path d="M 135 20 A 15 15 0 0 0 165 20" fill="#1e293b"/>
        <!-- Pin 1 dot -->
        <circle cx="85" cy="38" r="4" fill="#64748b"/>
        <!-- Chip label -->
        <text x="150" y="${height / 2}" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="900" font-size="16" fill="#f8fafc" letter-spacing="1">
          ${ic.id}
        </text>
        <text x="150" y="${height / 2 + 18}" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="600" font-size="9" fill="#64748b">
          TOP VIEW (DIP-${pins})
        </text>
        ${pinsSVG}
      </svg>
    `;
  }

  _buildTruthTableHTML(ic) {
    if (!ic.truthTable) {
      return `<p class="text-sm text-slate-400 italic p-4 text-center">Refer to datasheet operational details.</p>`;
    }

    const { headers, rows } = ic.truthTable;
    return `
      <table class="w-full text-left border-collapse text-xs">
        <thead>
          <tr class="bg-slate-800/80 border-b border-slate-700">
            ${headers.map(h => `<th class="px-3 py-2 font-semibold text-sky-300">${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map(row => `
            <tr class="border-b border-slate-800 hover:bg-slate-800/40">
              ${row.map(cell => `<td class="px-3 py-2 font-mono text-slate-200">${cell}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
}

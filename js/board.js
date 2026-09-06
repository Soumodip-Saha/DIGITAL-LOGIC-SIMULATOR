/**
 * DELD Virtual Trainer Kit - Authentic Board SVG Renderer
 * Faithfully matches DeldSim hardware trainer kit:
 * - Solid cyan board with middle inset
 * - 16 outputs (15..0) with VCC, 2 Seven-Segment Displays, and Power button on top
 * - 5 Universal IC bases with DIP socket, notch, silver pin leads, and terminal holes
 * - 16 inputs (15..0) with toggle switches and GND at bottom
 * - Clock section with 10, 5, 1, 0.5 Hz ports & GENERATE PULSE button
 */

export class BoardRenderer {
  constructor(svgElement, simulation, callbacks = {}) {
    this.svg = svgElement;
    this.sim = simulation;
    this.callbacks = callbacks;

    this.width = 1576;
    this.height = 720;

    // Pin coordinate registry: key -> { x, y }
    this.pinCoords = new Map();

    this.initDefs();
    this.renderStaticBoard();
  }

  getPinCoord(endpoint) {
    if (!endpoint) return null;
    const key = `${endpoint.comp}:${endpoint.pin}`;
    const coord = this.pinCoords.get(key);
    if (!coord) return null;
    return {
      x: coord.x,
      y: coord.y,
      side: coord.side,
      type: coord.type,
      comp: endpoint.comp,
      pin: endpoint.pin
    };
  }

  initDefs() {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <filter id="board-shadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#0f172a" flood-opacity="0.25"/>
      </filter>
      <filter id="wire-shadow-filter" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.3"/>
      </filter>
      <filter id="chip-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#000000" flood-opacity="0.4"/>
      </filter>

      <!-- Glow for LEDs -->
      <filter id="led-glow-red" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="led-glow-green" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      <!-- LED Gradients -->
      <radialGradient id="led-red-on" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="30%" stop-color="#ff4d4d"/>
        <stop offset="75%" stop-color="#ef4444"/>
        <stop offset="100%" stop-color="#991b1b"/>
      </radialGradient>
      <radialGradient id="led-red-off" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#450a0a"/>
        <stop offset="100%" stop-color="#180404"/>
      </radialGradient>

      <radialGradient id="led-green-on" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="30%" stop-color="#86efac"/>
        <stop offset="75%" stop-color="#22c55e"/>
        <stop offset="100%" stop-color="#14532d"/>
      </radialGradient>
      <radialGradient id="led-green-off" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#052e16"/>
        <stop offset="100%" stop-color="#02140a"/>
      </radialGradient>

      <!-- Terminal Hole Gradients -->
      <radialGradient id="pin-hole-metal" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#64748b"/>
        <stop offset="50%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#000000"/>
      </radialGradient>
    `;
    this.svg.appendChild(defs);
  }

  renderStaticBoard() {
    this.svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
    this.svg.setAttribute('width', String(this.width));
    this.svg.setAttribute('height', String(this.height));

    // 1. Outer Main Trainer Board (Solid vibrant cyan blue)
    const board = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    board.setAttribute('x', '20');
    board.setAttribute('y', '20');
    board.setAttribute('width', String(this.width - 40));
    board.setAttribute('height', String(this.height - 40));
    board.setAttribute('rx', '14');
    board.setAttribute('fill', '#0ca5d7');
    board.setAttribute('filter', 'url(#board-shadow)');
    this.svg.appendChild(board);

    // 2. Middle Inset Panel for IC Bases (Slightly deeper cyan inset)
    const inset = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    inset.setAttribute('x', '40');
    inset.setAttribute('y', '125');
    inset.setAttribute('width', String(this.width - 80));
    inset.setAttribute('height', '435');
    inset.setAttribute('rx', '8');
    inset.setAttribute('fill', '#0097cb');
    this.svg.appendChild(inset);

    // Right Edge Rotated Watermark Text
    const edgeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    edgeText.setAttribute('x', '1520');
    edgeText.setAttribute('y', '342');
    edgeText.setAttribute('text-anchor', 'middle');
    edgeText.setAttribute('transform', 'rotate(-90 1520 342)');
    edgeText.setAttribute('font-family', "'Inter', sans-serif");
    edgeText.setAttribute('font-weight', '700');
    edgeText.setAttribute('font-size', '13');
    edgeText.setAttribute('fill', '#bae6fd');
    edgeText.setAttribute('letter-spacing', '1.5');
    edgeText.textContent = 'Digital Electronics Simulator • 100% Free & Unlocked';
    this.svg.appendChild(edgeText);

    // 3. Top Section: Output LEDs (15..0), VCC, 7-Segment Displays & Power Button
    this.renderTopSection();

    // 4. Middle Section: 5 IC Bases
    this.renderMiddleICBases();

    // 5. Bottom Section: Input Switches (15..0), GND, Clock Ports & Pulse Generator
    this.renderBottomSection();

    // Dynamic Layers for Chips and Wires
    this.icLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.icLayer.setAttribute('id', 'trainer-ic-layer');
    this.svg.appendChild(this.icLayer);

    this.wireLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.wireLayer.setAttribute('id', 'trainer-wire-layer');
    this.svg.appendChild(this.wireLayer);
  }

  /**
   * Helper to create authentic circular pin socket terminal contact hole.
   */
  createPinHole(cx, cy, comp, pin, label = '', container = null, side = null) {
    const pinStr = String(pin);
    const key = `${comp}:${pinStr}`;
    let computedSide = side;
    let type = comp;
    if (!computedSide) {
      if (comp.startsWith('icbase_')) {
        type = 'ic';
        const pNum = parseInt(pinStr, 10);
        computedSide = (pNum >= 1 && pNum <= 10) ? 'left' : 'right';
      } else if (comp === 'switch' || comp === 'clock' || (comp === 'power' && pinStr === 'gnd')) {
        computedSide = 'bottom';
        type = (comp === 'power' && pinStr === 'gnd') ? 'gnd' : comp;
      } else if (comp === 'led' || comp.startsWith('display') || (comp === 'power' && pinStr === 'vcc')) {
        computedSide = 'top';
        type = (comp === 'power' && pinStr === 'vcc') ? 'vcc' : comp;
      } else {
        computedSide = cy > 400 ? 'bottom' : 'top';
      }
    }
    this.pinCoords.set(key, { x: cx, y: cy, side: computedSide, type });

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'terminal-pin');
    g.setAttribute('data-comp', comp);
    g.setAttribute('data-pin', pinStr);
    g.setAttribute('cursor', 'pointer');
    g.style.pointerEvents = 'all';

    g.innerHTML = `
      <!-- Generous hit circle (30px diameter) with opacity 0 to guarantee SVG hit-testing across all browsers -->
      <circle cx="${cx}" cy="${cy}" r="15" fill="#000000" opacity="0" pointer-events="all"/>
      <!-- Outer silver rim -->
      <circle cx="${cx}" cy="${cy}" r="8.5" fill="#cbd5e1" stroke="#334155" stroke-width="1.2" filter="url(#chip-shadow)" pointer-events="all"/>
      <!-- Inner contact hole -->
      <circle cx="${cx}" cy="${cy}" r="5.5" fill="url(#pin-hole-metal)" pointer-events="all"/>
      <!-- Hover / Active highlight circle -->
      <circle class="terminal-hover-ring" cx="${cx}" cy="${cy}" r="12" fill="none" stroke="#facc15" stroke-width="2.5" opacity="0" pointer-events="none"/>
    `;

    g.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.callbacks.onPinClick) {
        this.callbacks.onPinClick({ comp, pin: pinStr }, { x: cx, y: cy });
      }
    });

    g.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      if (this.callbacks.onPinMouseDown) {
        this.callbacks.onPinMouseDown({ comp, pin: pinStr }, { x: cx, y: cy }, e);
      }
    });

    g.addEventListener('mouseup', (e) => {
      e.stopPropagation();
      if (this.callbacks.onPinMouseUp) {
        this.callbacks.onPinMouseUp({ comp, pin: pinStr }, { x: cx, y: cy }, e);
      }
    });

    g.addEventListener('mouseenter', () => {
      if (!g.classList.contains('wire-start-active')) {
        g.querySelector('.terminal-hover-ring')?.setAttribute('opacity', '1');
      }
    });
    g.addEventListener('mouseleave', () => {
      if (!g.classList.contains('wire-start-active')) {
        g.querySelector('.terminal-hover-ring')?.setAttribute('opacity', '0');
      }
    });

    const targetContainer = container || this.svg;
    targetContainer.appendChild(g);
    return g;
  }

  // ==========================================
  // TOP SECTION: OUTPUTS (15..0), VCC, 7-SEGS, POWER
  // ==========================================

  renderTopSection() {
    // Title: OUTPUT SECTION
    const outTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    outTitle.setAttribute('x', '410');
    outTitle.setAttribute('y', '44');
    outTitle.setAttribute('text-anchor', 'middle');
    outTitle.setAttribute('font-family', "'Inter', sans-serif");
    outTitle.setAttribute('font-weight', '900');
    outTitle.setAttribute('font-size', '13');
    outTitle.setAttribute('fill', '#002b49');
    outTitle.setAttribute('letter-spacing', '2');
    outTitle.textContent = 'OUTPUT SECTION';
    this.svg.appendChild(outTitle);

    // 16 Output LEDs: numbered 15 down to 0 (Left to Right)
    const startX = 60;
    const spacingX = 43;

    for (let i = 15; i >= 0; i--) {
      const colIndex = 15 - i;
      const cx = startX + colIndex * spacingX;

      // Number label on top
      const numText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      numText.setAttribute('x', String(cx));
      numText.setAttribute('y', '62');
      numText.setAttribute('text-anchor', 'middle');
      numText.setAttribute('font-family', "'Inter', sans-serif");
      numText.setAttribute('font-weight', '800');
      numText.setAttribute('font-size', '11.5');
      numText.setAttribute('fill', '#002b49');
      numText.textContent = String(i);
      this.svg.appendChild(numText);

      // Contact pin hole
      this.createPinHole(cx, 76, 'led', String(i));

      // Output LED Lamp directly underneath pin hole (enlarged for crisp glow)
      const led = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      led.setAttribute('id', `output-led-lamp-${i}`);
      led.setAttribute('cx', String(cx));
      led.setAttribute('cy', '96');
      led.setAttribute('r', '8');
      led.setAttribute('fill', 'url(#led-red-off)');
      led.setAttribute('stroke', '#0f172a');
      led.setAttribute('stroke-width', '1.5');
      this.svg.appendChild(led);
    }

    // VCC Terminal (to the right of output 0)
    const vccX = startX + 16 * spacingX + 15;
    const vccLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    vccLabel.setAttribute('x', String(vccX));
    vccLabel.setAttribute('y', '62');
    vccLabel.setAttribute('text-anchor', 'middle');
    vccLabel.setAttribute('font-family', "'Inter', sans-serif");
    vccLabel.setAttribute('font-weight', '900');
    vccLabel.setAttribute('font-size', '12');
    vccLabel.setAttribute('fill', '#dc2626');
    vccLabel.textContent = 'VCC';
    this.svg.appendChild(vccLabel);

    this.createPinHole(vccX, 76, 'power', 'vcc');
    this.pinCoords.set('vcc:0', { x: vccX, y: 76 });
    this.pinCoords.set('vcc:vcc', { x: vccX, y: 76 });

    // Dual 7-Segment Displays (Right top)
    const disp1X = 815;
    const disp0X = 1065;
    const dispY = 28;
    this.render7SegmentModule(disp1X, dispY, 1);
    this.render7SegmentModule(disp0X, dispY, 0);

    // Master Power Button (Far Right Top)
    const pwrX = 1345;
    const pwrY = 72;

    const pwrLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    pwrLabel.setAttribute('x', String(pwrX));
    pwrLabel.setAttribute('y', '50');
    pwrLabel.setAttribute('text-anchor', 'middle');
    pwrLabel.setAttribute('font-family', "'Inter', sans-serif");
    pwrLabel.setAttribute('font-weight', '700');
    pwrLabel.setAttribute('font-size', '9');
    pwrLabel.setAttribute('fill', '#002b49');
    pwrLabel.textContent = 'Power';
    this.svg.appendChild(pwrLabel);

    const pwrBtn = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    pwrBtn.setAttribute('class', 'master-power-btn');
    pwrBtn.setAttribute('cursor', 'pointer');
    pwrBtn.innerHTML = `
      <!-- Generous invisible hit circle (48px diameter) -->
      <circle cx="${pwrX}" cy="${pwrY}" r="24" fill="transparent"/>
      <circle cx="${pwrX}" cy="${pwrY}" r="16" fill="#0f172a" stroke="#334155" stroke-width="1.5" pointer-events="none"/>
      <circle id="power-indicator-ring" cx="${pwrX}" cy="${pwrY}" r="12" fill="#dc2626" pointer-events="none"/>
      <!-- Power Icon ⏻ -->
      <path d="M ${pwrX} ${pwrY - 6} L ${pwrX} ${pwrY - 1}" stroke="#ffffff" stroke-width="2" stroke-linecap="round" pointer-events="none"/>
      <path d="M ${pwrX - 4.5} ${pwrY - 3} A 5.5 5.5 0 1 0 ${pwrX + 4.5} ${pwrY - 3}" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" pointer-events="none"/>
    `;

    pwrBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.callbacks.onPowerToggle) {
        this.callbacks.onPowerToggle();
      }
    });
    this.svg.appendChild(pwrBtn);
  }

  /**
   * Renders an authentic, high-clarity 7-Segment Display module with:
   * 1. High-contrast 7-segment LED digit with red illumination and DP
   * 2. 4 BCD input pins (8, 4, 2, 1) with built-in hex/decimal decoding (DeldSim compatible)
   * 3. 8 Segment input pins (a, b, c, d, e, f, g, dp) for direct decoder experiments (e.g. 74LS47)
   * 4. Completely isolated, non-overlapping pin terminals with clear typography
   */
  render7SegmentModule(x, y, dispIdx) {
    const w = 236;
    const h = 88;

    // 1. Dark Navy Module Bezel
    const panel = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    panel.setAttribute('x', String(x));
    panel.setAttribute('y', String(y));
    panel.setAttribute('width', String(w));
    panel.setAttribute('height', String(h));
    panel.setAttribute('rx', '7');
    panel.setAttribute('fill', '#002138');
    panel.setAttribute('stroke', '#003a63');
    panel.setAttribute('stroke-width', '1.5');
    panel.setAttribute('filter', 'url(#board-shadow)');
    this.svg.appendChild(panel);

    // 2. Title Badge directly above LED Digit
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', String(x + 32));
    title.setAttribute('y', String(y + 15));
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-family', "'Inter', sans-serif");
    title.setAttribute('font-weight', '900');
    title.setAttribute('font-size', '9.5');
    title.setAttribute('fill', '#38bdf8');
    title.setAttribute('letter-spacing', '0.5');
    title.textContent = `DISP ${dispIdx}`;
    this.svg.appendChild(title);

    // 3. LED Digit Housing (Left Side)
    const ledX = x + 10;
    const ledY = y + 22;
    const ledW = 44;
    const ledH = 58;

    const ledHousing = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    ledHousing.setAttribute('x', String(ledX));
    ledHousing.setAttribute('y', String(ledY));
    ledHousing.setAttribute('width', String(ledW));
    ledHousing.setAttribute('height', String(ledH));
    ledHousing.setAttribute('rx', '4');
    ledHousing.setAttribute('fill', '#0f172a');
    ledHousing.setAttribute('stroke', '#1e293b');
    ledHousing.setAttribute('stroke-width', '1.2');
    this.svg.appendChild(ledHousing);

    // 7-Segment Paths inside housing
    const sx = ledX + 8;
    const sy = ledY + 8;
    const segGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    segGroup.setAttribute('id', `display-${dispIdx}-segments`);

    const segPaths = {
      a: `M ${sx + 3} ${sy} L ${sx + 21} ${sy} L ${sx + 18} ${sy + 4} L ${sx + 6} ${sy + 4} Z`,
      b: `M ${sx + 22} ${sy + 2} L ${sx + 22} ${sy + 18} L ${sx + 18} ${sy + 15} L ${sx + 18} ${sy + 5} Z`,
      c: `M ${sx + 22} ${sy + 21} L ${sx + 22} ${sy + 37} L ${sx + 18} ${sy + 34} L ${sx + 18} ${sy + 23} Z`,
      d: `M ${sx + 3} ${sy + 39} L ${sx + 21} ${sy + 39} L ${sx + 18} ${sy + 35} L ${sx + 6} ${sy + 35} Z`,
      e: `M ${sx + 2} ${sy + 21} L ${sx + 2} ${sy + 37} L ${sx + 6} ${sy + 34} L ${sx + 6} ${sy + 23} Z`,
      f: `M ${sx + 2} ${sy + 2} L ${sx + 2} ${sy + 18} L ${sx + 6} ${sy + 15} L ${sx + 6} ${sy + 5} Z`,
      g: `M ${sx + 5} ${sy + 19} L ${sx + 19} ${sy + 19} L ${sx + 17} ${sy + 21.5} L ${sx + 7} ${sy + 21.5} Z`
    };

    Object.entries(segPaths).forEach(([seg, d]) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('id', `disp-${dispIdx}-seg-${seg}`);
      path.setAttribute('d', d);
      path.setAttribute('fill', '#2d0909'); // Unlit dim red
      segGroup.appendChild(path);
    });

    // Decimal Point DP
    const dp = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dp.setAttribute('id', `disp-${dispIdx}-seg-dp`);
    dp.setAttribute('cx', String(ledX + ledW - 6));
    dp.setAttribute('cy', String(ledY + ledH - 8));
    dp.setAttribute('r', '2.5');
    dp.setAttribute('fill', '#2d0909');
    segGroup.appendChild(dp);

    this.svg.appendChild(segGroup);

    // 4. BCD 4-Bit Inputs Section (Center, x + 62 to x + 118)
    const bcdHeader = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    bcdHeader.setAttribute('x', String(x + 90));
    bcdHeader.setAttribute('y', String(y + 15));
    bcdHeader.setAttribute('text-anchor', 'middle');
    bcdHeader.setAttribute('font-family', "'Inter', sans-serif");
    bcdHeader.setAttribute('font-weight', '800');
    bcdHeader.setAttribute('font-size', '8');
    bcdHeader.setAttribute('fill', '#94a3b8');
    bcdHeader.textContent = 'BCD (8-4-2-1)';
    this.svg.appendChild(bcdHeader);

    // 4 BCD Pins in a clean 2x2 grid with generous 24px spacing
    const bcdPins = [
      { pin: '8', x: x + 78, y: y + 37, labelY: y + 26 },
      { pin: '4', x: x + 102, y: y + 37, labelY: y + 26 },
      { pin: '2', x: x + 78, y: y + 67, labelY: y + 83 },
      { pin: '1', x: x + 102, y: y + 67, labelY: y + 83 }
    ];

    bcdPins.forEach(bp => {
      // Pin label
      const lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      lbl.setAttribute('x', String(bp.x));
      lbl.setAttribute('y', String(bp.labelY));
      lbl.setAttribute('text-anchor', 'middle');
      lbl.setAttribute('font-family', "'Inter', sans-serif");
      lbl.setAttribute('font-weight', '800');
      lbl.setAttribute('font-size', '8.5');
      lbl.setAttribute('fill', '#38bdf8');
      lbl.textContent = bp.pin;
      this.svg.appendChild(lbl);

      // Contact pin hole
      this.createPinHole(bp.x, bp.y, `display_${dispIdx}`, bp.pin);
      // Aliases
      this.pinCoords.set(`display_${dispIdx}:bcd_${bp.pin}`, { x: bp.x, y: bp.y });
    });

    // 5. Segment Inputs Section (Right, x + 128 to x + 230)
    const segHeader = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    segHeader.setAttribute('x', String(x + 175));
    segHeader.setAttribute('y', String(y + 15));
    segHeader.setAttribute('text-anchor', 'middle');
    segHeader.setAttribute('font-family', "'Inter', sans-serif");
    segHeader.setAttribute('font-weight', '800');
    segHeader.setAttribute('font-size', '8');
    segHeader.setAttribute('fill', '#94a3b8');
    segHeader.textContent = 'SEGMENTS (a-g)';
    this.svg.appendChild(segHeader);

    // 8 Segment Pins in 2 rows of 4 (spacing: 22px)
    const segPinsRow1 = ['a', 'b', 'c', 'd'];
    const segPinsRow2 = ['e', 'f', 'g', 'dp'];

    segPinsRow1.forEach((s, idx) => {
      const px = x + 142 + idx * 22;
      const py = y + 37;
      const lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      lbl.setAttribute('x', String(px));
      lbl.setAttribute('y', String(y + 26));
      lbl.setAttribute('text-anchor', 'middle');
      lbl.setAttribute('font-family', "'JetBrains Mono', monospace");
      lbl.setAttribute('font-weight', '800');
      lbl.setAttribute('font-size', '8');
      lbl.setAttribute('fill', '#38bdf8');
      lbl.textContent = s;
      this.svg.appendChild(lbl);

      this.createPinHole(px, py, `display_${dispIdx}`, s);
    });

    segPinsRow2.forEach((s, idx) => {
      const px = x + 142 + idx * 22;
      const py = y + 67;
      const lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      lbl.setAttribute('x', String(px));
      lbl.setAttribute('y', String(y + 83));
      lbl.setAttribute('text-anchor', 'middle');
      lbl.setAttribute('font-family', "'JetBrains Mono', monospace");
      lbl.setAttribute('font-weight', '800');
      lbl.setAttribute('font-size', '8');
      lbl.setAttribute('fill', '#38bdf8');
      lbl.textContent = s;
      this.svg.appendChild(lbl);

      this.createPinHole(px, py, `display_${dispIdx}`, s);
    });
  }

  // ==========================================
  // MIDDLE SECTION: 5 IC BASES
  // ==========================================

  // ==========================================
  // ==========================================
  // MIDDLE SECTION: 5 IC BASES (DeldSim Authentic 20-Pin Universal Sockets)
  // ==========================================

  renderMiddleICBases() {
    this.icBasesContainer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this.icBasesContainer.setAttribute('id', 'trainer-ic-bases-layer');
    this.svg.appendChild(this.icBasesContainer);

    const baseCenters = [230, 500, 770, 1040, 1310];
    this.baseLayers = [];

    baseCenters.forEach((cx, idx) => {
      const baseG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      baseG.setAttribute('class', 'exact-ic-base');
      baseG.setAttribute('data-base-idx', String(idx));
      this.icBasesContainer.appendChild(baseG);
      this.baseLayers.push(baseG);

      this.renderExactICBase(cx, 340, idx);
    });
  }

  /**
   * Renders an authentic DeldSim 20-pin DIP universal socket:
   * - 10 horizontal silver legs on left (Pins 1..10, Top to Bottom)
   * - 10 horizontal silver legs on right (Pins 20..11, Top to Bottom: Pin 20 opposite Pin 1, Pin 11 opposite Pin 10)
   * - Dark charcoal DIP-20 body with top semicircular notch
   * - Vertical rotated text: "IC BASE 1" .. "IC BASE 5"
   * - Authentic terminal contact holes and clear pin number labels
   */
  renderExactICBase(cx, cy, baseIdx) {
    const g = this.baseLayers ? this.baseLayers[baseIdx] : null;
    if (!g) return;
    g.innerHTML = '';

    const rows = 10;
    const pinSpacingY = 16.5;
    const chipH = (rows - 1) * pinSpacingY + 34; // ~182.5px
    const chipW = 76;
    const chipX = cx - chipW / 2;
    const chipY = cy - chipH / 2;

    const legLength = 18;
    const legWidth = 4.5;
    const startPinY = chipY + 17;

    // 1. Draw Legs on Left (Pins 1..10, Top to Bottom)
    for (let row = 0; row < rows; row++) {
      const p = row + 1;
      const py = startPinY + row * pinSpacingY;

      // Silver horizontal leg sticking out
      const leg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      leg.setAttribute('x', String(chipX - legLength));
      leg.setAttribute('y', String(py - legWidth / 2));
      leg.setAttribute('width', String(legLength));
      leg.setAttribute('height', String(legWidth));
      leg.setAttribute('fill', '#94a3b8');
      leg.setAttribute('rx', '1.5');
      g.appendChild(leg);

      // Terminal contact hole at leg tip
      const holeX = chipX - legLength - 8;
      this.createPinHole(holeX, py, `icbase_${baseIdx}`, String(p), '', g);

      // Pin number text
      const numTxt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      numTxt.setAttribute('id', `base-${baseIdx}-pinlbl-left-${p}`);
      numTxt.setAttribute('x', String(holeX - 11));
      numTxt.setAttribute('y', String(py + 4));
      numTxt.setAttribute('text-anchor', 'end');
      numTxt.setAttribute('font-family', "'Inter', sans-serif");
      numTxt.setAttribute('font-size', '11');
      numTxt.setAttribute('font-weight', '800');
      numTxt.setAttribute('fill', '#bae6fd');
      numTxt.textContent = String(p);
      g.appendChild(numTxt);
    }

    // 2. Draw Legs on Right (Pins 20..11, Top to Bottom)
    // Row 0 is pin 20 (directly opposite Pin 1)
    // Row 9 is pin 11 (directly opposite Pin 10)
    for (let row = 0; row < rows; row++) {
      const p = 20 - row;
      const py = startPinY + row * pinSpacingY;

      // Silver leg
      const leg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      leg.setAttribute('x', String(chipX + chipW));
      leg.setAttribute('y', String(py - legWidth / 2));
      leg.setAttribute('width', String(legLength));
      leg.setAttribute('height', String(legWidth));
      leg.setAttribute('fill', '#94a3b8');
      leg.setAttribute('rx', '1.5');
      g.appendChild(leg);

      // Terminal hole at leg tip
      const holeX = chipX + chipW + legLength + 8;
      this.createPinHole(holeX, py, `icbase_${baseIdx}`, String(p), '', g);

      // Pin number text
      const numTxt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      numTxt.setAttribute('id', `base-${baseIdx}-pinlbl-right-${p}`);
      numTxt.setAttribute('x', String(holeX + 11));
      numTxt.setAttribute('y', String(py + 4));
      numTxt.setAttribute('text-anchor', 'start');
      numTxt.setAttribute('font-family', "'Inter', sans-serif");
      numTxt.setAttribute('font-size', '11');
      numTxt.setAttribute('font-weight', '800');
      numTxt.setAttribute('fill', '#bae6fd');
      numTxt.textContent = String(p);
      g.appendChild(numTxt);
    }

    // 3. Dark Charcoal DIP-20 Socket Body (Authentic DeldSim #383838)
    const body = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    body.setAttribute('id', `ic-base-body-${baseIdx}`);
    body.setAttribute('x', String(chipX));
    body.setAttribute('y', String(chipY));
    body.setAttribute('width', String(chipW));
    body.setAttribute('height', String(chipH));
    body.setAttribute('rx', '4');
    body.setAttribute('fill', '#383838');
    body.setAttribute('stroke', '#222222');
    body.setAttribute('stroke-width', '1.5');
    body.setAttribute('filter', 'url(#chip-shadow)');
    body.setAttribute('cursor', 'pointer');
    g.appendChild(body);

    // Notch at top (Semi-circular cutout into chip body, background color inside)
    const notch = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    notch.setAttribute('d', `M ${cx - 10} ${chipY} A 10 10 0 0 0 ${cx + 10} ${chipY}`);
    notch.setAttribute('fill', '#0ca5d7'); // Solid board cyan
    notch.setAttribute('pointer-events', 'none');
    g.appendChild(notch);

    // Pin 1 Dot
    const p1Dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    p1Dot.setAttribute('cx', String(chipX + 10));
    p1Dot.setAttribute('cy', String(chipY + 12));
    p1Dot.setAttribute('r', '2.5');
    p1Dot.setAttribute('fill', '#525252');
    p1Dot.setAttribute('pointer-events', 'none');
    g.appendChild(p1Dot);

    // Vertical Label: "IC BASE 1" ... "IC BASE 5" (Rotated 90 deg clockwise, bold white font)
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('id', `ic-base-label-${baseIdx}`);
    label.setAttribute('x', String(cx));
    label.setAttribute('y', String(cy));
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('transform', `rotate(90 ${cx} ${cy})`);
    label.setAttribute('font-family', "'Inter', sans-serif");
    label.setAttribute('font-weight', '900');
    label.setAttribute('font-size', '12');
    label.setAttribute('fill', '#ffffff');
    label.setAttribute('letter-spacing', '3.5');
    label.setAttribute('pointer-events', 'none');
    label.textContent = `IC BASE ${baseIdx + 1}`;
    g.appendChild(label);

    // Full hit area over entire socket body to capture all clicks reliably
    const hitArea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    hitArea.setAttribute('x', String(chipX));
    hitArea.setAttribute('y', String(chipY));
    hitArea.setAttribute('width', String(chipW));
    hitArea.setAttribute('height', String(chipH));
    hitArea.setAttribute('fill', 'transparent');
    hitArea.setAttribute('cursor', 'pointer');

    hitArea.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.callbacks.onICBaseClick) {
        this.callbacks.onICBaseClick(baseIdx);
      }
    });
    g.appendChild(hitArea);
  }

  // ==========================================
  // BOTTOM SECTION: INPUTS (15..0), GND, CLOCKS, GENERATE PULSE
  // ==========================================

  renderBottomSection() {
    // 1. INPUT SECTION
    const inTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    inTitle.setAttribute('x', '410');
    inTitle.setAttribute('y', '702');
    inTitle.setAttribute('text-anchor', 'middle');
    inTitle.setAttribute('font-family', "'Inter', sans-serif");
    inTitle.setAttribute('font-weight', '900');
    inTitle.setAttribute('font-size', '13');
    inTitle.setAttribute('fill', '#002b49');
    inTitle.setAttribute('letter-spacing', '2');
    inTitle.textContent = 'INPUT SECTION';
    this.svg.appendChild(inTitle);

    const startX = 60;
    const spacingX = 43;

    for (let i = 15; i >= 0; i--) {
      const colIndex = 15 - i;
      const cx = startX + colIndex * spacingX;

      // Contact pin hole at top
      this.createPinHole(cx, 590, 'switch', String(i));

      // Toggle Switch: realistic vertical slot with circular knob
      const swG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      swG.setAttribute('class', 'input-toggle-switch');
      swG.setAttribute('data-switch-idx', String(i));
      swG.setAttribute('cursor', 'pointer');

      swG.innerHTML = `
        <!-- Generous invisible hit area (36px wide x 60px high) -->
        <rect x="${cx - 18}" y="605" width="36" height="60" fill="transparent"/>
        <!-- Vertical slot -->
        <rect x="${cx - 5}" y="612" width="10" height="25" rx="5" fill="#002b49" pointer-events="none"/>
        <!-- Toggle Knob (circle with chrome highlight) -->
        <circle id="switch-knob-${i}" cx="${cx}" cy="630" r="7.5" fill="#f8fafc" stroke="#334155" stroke-width="1.5" filter="url(#chip-shadow)" pointer-events="none"/>
        <!-- Number text at bottom -->
        <text x="${cx}" y="658" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="11.5" fill="#002b49" pointer-events="none">${i}</text>
      `;

      swG.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.callbacks.onSwitchToggle) {
          this.callbacks.onSwitchToggle(i);
        }
      });
      this.svg.appendChild(swG);
    }

    // GND Terminal (to the right of switch 0)
    const gndX = startX + 16 * spacingX + 15;
    const gndLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    gndLabel.setAttribute('x', String(gndX));
    gndLabel.setAttribute('y', '574');
    gndLabel.setAttribute('text-anchor', 'middle');
    gndLabel.setAttribute('font-family', "'Inter', sans-serif");
    gndLabel.setAttribute('font-weight', '900');
    gndLabel.setAttribute('font-size', '12');
    gndLabel.setAttribute('fill', '#002b49');
    gndLabel.textContent = 'GND';
    this.svg.appendChild(gndLabel);

    this.createPinHole(gndX, 590, 'power', 'gnd');
    this.pinCoords.set('gnd:0', { x: gndX, y: 590 });
    this.pinCoords.set('gnd:gnd', { x: gndX, y: 590 });

    // 2. CLOCK SECTION (Right side)
    const clkTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    clkTitle.setAttribute('x', '1180');
    clkTitle.setAttribute('y', '702');
    clkTitle.setAttribute('text-anchor', 'middle');
    clkTitle.setAttribute('font-family', "'Inter', sans-serif");
    clkTitle.setAttribute('font-weight', '900');
    clkTitle.setAttribute('font-size', '13');
    clkTitle.setAttribute('fill', '#002b49');
    clkTitle.setAttribute('letter-spacing', '2');
    clkTitle.textContent = 'CLOCK SECTION';
    this.svg.appendChild(clkTitle);

    // 4 frequencies: 10, 5, 1, 0.5 (ordered left to right)
    const freqs = [10, 5, 1, 0.5];
    const clkStartX = 1040;
    const clkSpacing = 42;

    freqs.forEach((hz, idx) => {
      const cx = clkStartX + idx * clkSpacing;

      // Contact pin hole
      this.createPinHole(cx, 590, 'clock', String(hz));

      // Indicator LED
      const hzSafe = String(hz).replace('.', '_');
      const led = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      led.setAttribute('id', `clock-led-${hzSafe}`);
      led.setAttribute('cx', String(cx));
      led.setAttribute('cy', '624');
      led.setAttribute('r', '7');
      led.setAttribute('fill', 'url(#led-green-off)');
      led.setAttribute('stroke', '#0f172a');
      led.setAttribute('stroke-width', '1.2');
      this.svg.appendChild(led);

      // Frequency label below
      const lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      lbl.setAttribute('x', String(cx));
      lbl.setAttribute('y', '658');
      lbl.setAttribute('text-anchor', 'middle');
      lbl.setAttribute('font-family', "'Inter', sans-serif");
      lbl.setAttribute('font-weight', '800');
      lbl.setAttribute('font-size', '11.5');
      lbl.setAttribute('fill', '#002b49');
      lbl.textContent = String(hz);
      this.svg.appendChild(lbl);
    });

    // GENERATE PULSE Button & Ports (Far right)
    const pulseX = 1240;
    const pulseY = 600;

    // HIGH and LOW port pins above
    const highPinX = pulseX + 35;
    const lowPinX = pulseX + 95;

    const highTxt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    highTxt.setAttribute('x', String(highPinX));
    highTxt.setAttribute('y', '574');
    highTxt.setAttribute('text-anchor', 'middle');
    highTxt.setAttribute('font-family', "'Inter', sans-serif");
    highTxt.setAttribute('font-size', '7.5');
    highTxt.setAttribute('font-weight', '800');
    highTxt.setAttribute('fill', '#002b49');
    highTxt.textContent = 'HIGH';
    this.svg.appendChild(highTxt);

    const lowTxt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    lowTxt.setAttribute('x', String(lowPinX));
    lowTxt.setAttribute('y', '574');
    lowTxt.setAttribute('text-anchor', 'middle');
    lowTxt.setAttribute('font-family', "'Inter', sans-serif");
    lowTxt.setAttribute('font-size', '7.5');
    lowTxt.setAttribute('font-weight', '800');
    lowTxt.setAttribute('fill', '#002b49');
    lowTxt.textContent = 'LOW';
    this.svg.appendChild(lowTxt);

    this.createPinHole(highPinX, 590, 'clock', 'manual'); // Manual pulse output
    this.createPinHole(lowPinX, 590, 'clock', 'manual_inv'); // Inverted pulse

    // GENERATE PULSE Push Button Box
    const pulseBtn = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    pulseBtn.setAttribute('class', 'manual-pulse-box');
    pulseBtn.setAttribute('cursor', 'pointer');

    pulseBtn.innerHTML = `
      <!-- Generous invisible hit area (140px x 42px) -->
      <rect x="${pulseX - 6}" y="${pulseY + 8}" width="142" height="42" fill="transparent"/>
      <!-- Black rounded rectangular body -->
      <rect id="pulse-box-rect" x="${pulseX}" y="${pulseY + 12}" width="130" height="32" rx="6" fill="#111827" stroke="#1f2937" stroke-width="1.5" filter="url(#chip-shadow)" pointer-events="none"/>
      <!-- Pulse waveform icon in red -->
      <path d="M ${pulseX + 14} ${pulseY + 28} L ${pulseX + 22} ${pulseY + 28} L ${pulseX + 26} ${pulseY + 18} L ${pulseX + 30} ${pulseY + 38} L ${pulseX + 34} ${pulseY + 28} L ${pulseX + 42} ${pulseY + 28}" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>
      <!-- Text: GENERATE PULSE -->
      <text x="${pulseX + 78}" y="${pulseY + 32}" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="900" font-size="8.5" fill="#f8fafc" letter-spacing="0.5" pointer-events="none">GENERATE PULSE</text>
    `;

    const pressHandler = (e) => {
      e.stopPropagation();
      pulseBtn.querySelector('#pulse-box-rect')?.setAttribute('fill', '#1e293b');
      if (this.callbacks.onPulsePress) this.callbacks.onPulsePress();
    };

    const releaseHandler = (e) => {
      e.stopPropagation();
      pulseBtn.querySelector('#pulse-box-rect')?.setAttribute('fill', '#111827');
      if (this.callbacks.onPulseRelease) this.callbacks.onPulseRelease();
    };

    pulseBtn.addEventListener('mousedown', pressHandler);
    pulseBtn.addEventListener('mouseup', releaseHandler);
    pulseBtn.addEventListener('mouseleave', releaseHandler);
    pulseBtn.addEventListener('click', (e) => e.stopPropagation());

    this.svg.appendChild(pulseBtn);
  }

  // ==========================================
  // DYNAMIC UPDATES: SWITCHES, LEDS, CLOCKS, ICs
  // ==========================================

  updateDynamicElements() {
    const isPowerOn = this.sim.power;

    // 1. Master Power Indicator
    const pwrRing = this.svg.querySelector('#power-indicator-ring');
    if (pwrRing) {
      if (isPowerOn) {
        pwrRing.setAttribute('fill', '#16a34a');
        pwrRing.setAttribute('filter', 'url(#led-glow-green)');
      } else {
        pwrRing.setAttribute('fill', '#dc2626');
        pwrRing.removeAttribute('filter');
      }
    }

    // 2. Output LEDs
    this.sim.leds.forEach((val, i) => {
      const led = this.svg.querySelector(`#output-led-lamp-${i}`);
      if (led) {
        const active = isPowerOn && val === 1;
        led.setAttribute('fill', active ? 'url(#led-red-on)' : 'url(#led-red-off)');
        if (active) led.setAttribute('filter', 'url(#led-glow-red)');
        else led.removeAttribute('filter');
      }
    });

    // 3. Input Switches
    this.sim.switches.forEach((val, i) => {
      const knob = this.svg.querySelector(`#switch-knob-${i}`);
      if (knob) {
        // Up when 1 (HIGH), Down when 0 (LOW)
        knob.setAttribute('cy', val === 1 ? '618' : '630');
        knob.setAttribute('fill', val === 1 ? '#38bdf8' : '#e2e8f0');
      }
    });

    // 4. Clock LEDs - only pulse when connected to at least one active circuit wire
    [0.5, 1, 5, 10].forEach(hz => {
      const hzSafe = String(hz).replace('.', '_');
      const led = document.getElementById(`clock-led-${hzSafe}`) || document.getElementById(`clock-led-${hz}`);
      if (led) {
        const hasConnection = this.sim.wires.some(w =>
          (w.from.comp === 'clock' && (String(w.from.pin) === String(hz) || String(w.from.pin) === hzSafe)) ||
          (w.to.comp === 'clock' && (String(w.to.pin) === String(hz) || String(w.to.pin) === hzSafe))
        );
        const active = isPowerOn && hasConnection && this.sim.clocks[hz] === 1;
        led.setAttribute('fill', active ? 'url(#led-green-on)' : 'url(#led-green-off)');
        if (active) led.setAttribute('filter', 'url(#led-glow-green)');
        else led.removeAttribute('filter');
      }
    });

    // 5. 7-Segment Displays
    this.sim.displays.forEach((disp, dispIdx) => {
      Object.entries(disp).forEach(([seg, val]) => {
        const el = this.svg.querySelector(`#disp-${dispIdx}-seg-${seg}`);
        if (el) {
          const active = isPowerOn && val === 1;
          el.setAttribute('fill', active ? '#ef4444' : '#2d0909');
          if (active) el.setAttribute('filter', 'url(#led-glow-red)');
          else el.removeAttribute('filter');
        }
      });
    });

    // 6. IC Chips in IC Bases
    this.renderICChips();
  }

  /**
   * Renders inserted IC chips with chip labels and pinout function markers.
   */
  renderICChips() {
    this.icLayer.innerHTML = '';

    const baseCenters = [230, 500, 770, 1040, 1310];
    const rows = 10;
    const pinSpacingY = 16.5;
    const socketH = (rows - 1) * pinSpacingY + 34;
    const chipW = 76;

    this.sim.icBases.forEach((base, baseIdx) => {
      const cx = baseCenters[baseIdx];
      const cy = 340;
      const chipX = cx - chipW / 2;
      const chipY = cy - socketH / 2;
      const startPinY = chipY + 17;

      const baseBody = this.svg.querySelector(`#ic-base-body-${baseIdx}`);
      const baseLabel = this.svg.querySelector(`#ic-base-label-${baseIdx}`);

      // Reset pin labels to default socket numbering if empty
      if (!base.icId) {
        if (baseBody) {
          baseBody.setAttribute('stroke', '#222222');
          baseBody.setAttribute('stroke-width', '1.5');
        }
        if (baseLabel) {
          baseLabel.textContent = `IC BASE ${baseIdx + 1}`;
          baseLabel.setAttribute('fill', '#ffffff');
        }
        for (let r = 0; r < rows; r++) {
          const leftLbl = this.svg.querySelector(`#base-${baseIdx}-pinlbl-left-${r + 1}`);
          if (leftLbl) {
            leftLbl.textContent = String(r + 1);
            leftLbl.setAttribute('fill', '#bae6fd');
          }
          const rightLbl = this.svg.querySelector(`#base-${baseIdx}-pinlbl-right-${20 - r}`);
          if (rightLbl) {
            rightLbl.textContent = String(20 - r);
            rightLbl.setAttribute('fill', '#bae6fd');
          }
        }
        return;
      }

      // Base is occupied
      const icDef = IC_LIBRARY[base.icId];
      const icPins = icDef ? icDef.pins : 14;
      const icRows = icPins / 2; // 7 for 14-pin ICs; 8 for 16-pin ICs; 10 for 20-pin ICs

      if (baseBody) {
        baseBody.setAttribute('stroke', '#0284c7');
        baseBody.setAttribute('stroke-width', '2');
      }
      if (baseLabel) {
        baseLabel.textContent = base.icId;
        baseLabel.setAttribute('fill', '#38bdf8');
      }

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'mounted-ic-overlay');

      // 1. Mounted IC Chip Package Body (Top-aligned in socket)
      const icChipH = (icRows - 1) * pinSpacingY + 36;
      const icChip = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      icChip.setAttribute('d', `M ${chipX} ${chipY} L ${cx - 10} ${chipY} A 10 10 0 0 0 ${cx + 10} ${chipY} L ${chipX + chipW} ${chipY} L ${chipX + chipW} ${chipY + icChipH} L ${chipX} ${chipY + icChipH} Z`);
      icChip.setAttribute('fill', '#18181b');
      icChip.setAttribute('stroke', '#38bdf8');
      icChip.setAttribute('stroke-width', '1.8');
      icChip.setAttribute('filter', 'url(#chip-shadow)');
      icChip.setAttribute('cursor', 'pointer');
      icChip.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.callbacks.onICBaseClick) {
          this.callbacks.onICBaseClick(baseIdx);
        }
      });
      g.appendChild(icChip);

      // Pin 1 Dot on IC
      const icP1Dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      icP1Dot.setAttribute('cx', String(chipX + 8));
      icP1Dot.setAttribute('cy', String(chipY + 12));
      icP1Dot.setAttribute('r', '2.5');
      icP1Dot.setAttribute('fill', '#38bdf8');
      icP1Dot.setAttribute('pointer-events', 'none');
      g.appendChild(icP1Dot);

      // 2. Vertical IC Model Label in center of chip (DeldSim authentic style)
      const centerY = chipY + icChipH / 2 - 2;
      const modelLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      modelLabel.setAttribute('x', String(cx));
      modelLabel.setAttribute('y', String(centerY));
      modelLabel.setAttribute('text-anchor', 'middle');
      modelLabel.setAttribute('transform', `rotate(90 ${cx} ${centerY})`);
      modelLabel.setAttribute('font-family', "'JetBrains Mono', monospace");
      modelLabel.setAttribute('font-weight', '900');
      modelLabel.setAttribute('font-size', '12');
      modelLabel.setAttribute('fill', '#38bdf8');
      modelLabel.setAttribute('letter-spacing', '2.5');
      modelLabel.setAttribute('pointer-events', 'none');
      modelLabel.textContent = base.icId;
      g.appendChild(modelLabel);

      // 3. Quick Remove button at bottom of chip
      const removeBtn = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      removeBtn.setAttribute('class', 'chip-remove-btn');
      removeBtn.setAttribute('cursor', 'pointer');
      const removeY = chipY + icChipH - 12;
      removeBtn.innerHTML = `
        <rect x="${cx - 22}" y="${removeY}" width="44" height="11" rx="2.5" fill="#ef4444" opacity="0.95"/>
        <text x="${cx}" y="${removeY + 8}" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="7.5" fill="#ffffff" pointer-events="none">✕ REMOVE</text>
      `;
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.callbacks.onICRemove) {
          this.callbacks.onICRemove(baseIdx);
        }
      });
      g.appendChild(removeBtn);

      // 4. Pin Functions & Aliases for Active Rows
      for (let r = 0; r < icRows; r++) {
        const py = startPinY + r * pinSpacingY;

        // Left side pin
        const pNumLeft = r + 1;
        const leftData = base.pins[pNumLeft] || {};
        const leftHoleX = chipX - 18 - 8;
        this.pinCoords.set(`icbase_${baseIdx}:${pNumLeft}`, { x: leftHoleX, y: py, side: 'left', type: 'ic' });

        const leftLbl = this.svg.querySelector(`#base-${baseIdx}-pinlbl-left-${pNumLeft}`);
        if (leftLbl) {
          leftLbl.textContent = String(pNumLeft);
          leftLbl.setAttribute('fill', '#38bdf8');
        }

        // Left pin function label inside chip edge
        if (leftData.name) {
          const pinTxt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          pinTxt.setAttribute('x', String(chipX + 5));
          pinTxt.setAttribute('y', String(py + 3.5));
          pinTxt.setAttribute('text-anchor', 'start');
          pinTxt.setAttribute('font-family', "'JetBrains Mono', monospace");
          pinTxt.setAttribute('font-size', '8');
          pinTxt.setAttribute('font-weight', '800');
          let color = '#38bdf8';
          if (leftData.type === 'vcc') color = '#f87171';
          else if (leftData.type === 'gnd') color = '#cbd5e1';
          else if (leftData.type === 'output') color = '#4ade80';
          pinTxt.setAttribute('fill', color);
          pinTxt.setAttribute('pointer-events', 'none');
          pinTxt.textContent = leftData.name;
          g.appendChild(pinTxt);
        }

        // Right side pin:
        // IC pin number (e.g. 14 down to 8 for 14-pin IC; 16 down to 9 for 16-pin IC)
        const icPinRight = icPins - r;
        const socketPinRight = 20 - r;
        const rightData = base.pins[icPinRight] || {};
        const rightHoleX = chipX + chipW + 18 + 8;

        // Register IC pin number (takes precedence for mounted chip)
        this.pinCoords.set(`icbase_${baseIdx}:${icPinRight}`, { x: rightHoleX, y: py, side: 'right', type: 'ic' });
        // Register socket pin number alias only if it does not collide with an active IC pin number
        if (socketPinRight > icPins) {
          this.pinCoords.set(`icbase_${baseIdx}:${socketPinRight}`, { x: rightHoleX, y: py, side: 'right', type: 'ic' });
        }
        this.pinCoords.set(`icbase_${baseIdx}:socket_${socketPinRight}`, { x: rightHoleX, y: py, side: 'right', type: 'ic' });

        // Update board right pin label to show the IC pin number for intuitive wiring
        const rightLbl = this.svg.querySelector(`#base-${baseIdx}-pinlbl-right-${socketPinRight}`);
        if (rightLbl) {
          rightLbl.textContent = String(icPinRight);
          rightLbl.setAttribute('fill', '#38bdf8');
        }

        // Right pin function label inside chip edge
        if (rightData.name) {
          const pinTxt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          pinTxt.setAttribute('x', String(chipX + chipW - 5));
          pinTxt.setAttribute('y', String(py + 3.5));
          pinTxt.setAttribute('text-anchor', 'end');
          pinTxt.setAttribute('font-family', "'JetBrains Mono', monospace");
          pinTxt.setAttribute('font-size', '8');
          pinTxt.setAttribute('font-weight', '800');
          let color = '#38bdf8';
          if (rightData.type === 'vcc') color = '#f87171';
          else if (rightData.type === 'gnd') color = '#cbd5e1';
          else if (rightData.type === 'output') color = '#4ade80';
          pinTxt.setAttribute('fill', color);
          pinTxt.setAttribute('pointer-events', 'none');
          pinTxt.textContent = rightData.name;
          g.appendChild(pinTxt);
        }
      }

      // Dim unpopulated socket rows below the chip
      for (let r = icRows; r < rows; r++) {
        const leftP = r + 1;
        const rightP = 20 - r;
        const leftLbl = this.svg.querySelector(`#base-${baseIdx}-pinlbl-left-${leftP}`);
        if (leftLbl) {
          leftLbl.textContent = String(leftP);
          leftLbl.setAttribute('fill', '#64748b'); // Dimmed
        }
        const rightLbl = this.svg.querySelector(`#base-${baseIdx}-pinlbl-right-${rightP}`);
        if (rightLbl) {
          rightLbl.textContent = String(rightP);
          rightLbl.setAttribute('fill', '#64748b'); // Dimmed
        }
      }

      this.icLayer.appendChild(g);
    });
  }
}

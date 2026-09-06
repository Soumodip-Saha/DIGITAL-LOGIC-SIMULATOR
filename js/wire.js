/**
 * DELD Virtual Trainer Kit - Wire & Patch Cord Renderer
 * Authentic DeldSim Manhattan (orthogonal 90-degree) wire routing,
 * multi-wire collision avoidance, color themes, and signal styling.
 */

export const WIRE_PALETTE = [
  { name: 'Purple', hex: '#2512a8' },
  { name: 'Cyan', hex: '#00f5f5' },
  { name: 'Orange', hex: '#ff7f00' },
  { name: 'Green', hex: '#16a34a' },
  { name: 'Red', hex: '#dc2626' },
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'White', hex: '#f8fafc' },
  { name: 'Black', hex: '#1e293b' }
];

export class WireRenderer {
  constructor(svgContainer, options = {}) {
    this.container = svgContainer;
    this.colorIndex = 0;
    this.currentColor = WIRE_PALETTE[0].hex;
    this.signalColorMode = false; // Authentic palette colors by default; toggleable via toolbar
    this.drawingWire = null;
    this.wirePathElements = new Map(); // wireId -> SVG group
  }

  setCurrentColor(hex) {
    this.currentColor = hex;
    const foundIdx = WIRE_PALETTE.findIndex(c => c.hex.toLowerCase() === hex.toLowerCase());
    if (foundIdx !== -1) {
      this.colorIndex = foundIdx;
    }
  }

  advanceColor() {
    this.colorIndex = (this.colorIndex + 1) % WIRE_PALETTE.length;
    this.currentColor = WIRE_PALETTE[this.colorIndex].hex;
    return this.currentColor;
  }

  toggleSignalColorMode(enabled) {
    this.signalColorMode = enabled !== undefined ? enabled : !this.signalColorMode;
  }

  /**
   * Converts an array of points into a clean SVG path string with collinear points simplified.
   */
  static pointsToSvgPath(points) {
    if (!points || points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    // 1. Remove consecutive duplicates
    const cleaned = [];
    for (let i = 0; i < points.length; i++) {
      const pt = points[i];
      if (cleaned.length === 0 || Math.hypot(cleaned[cleaned.length - 1].x - pt.x, cleaned[cleaned.length - 1].y - pt.y) > 0.5) {
        cleaned.push(pt);
      }
    }

    // 2. Remove collinear redundant points
    const simplified = [];
    for (let i = 0; i < cleaned.length; i++) {
      const pt = cleaned[i];
      if (simplified.length >= 2) {
        const p0 = simplified[simplified.length - 2];
        const p1 = simplified[simplified.length - 1];
        const p2 = pt;
        // Both vertical
        if (Math.abs(p0.x - p1.x) < 0.1 && Math.abs(p1.x - p2.x) < 0.1) {
          simplified.pop();
        }
        // Both horizontal
        else if (Math.abs(p0.y - p1.y) < 0.1 && Math.abs(p1.y - p2.y) < 0.1) {
          simplified.pop();
        }
      }
      simplified.push(pt);
    }

    const d = [`M ${simplified[0].x} ${simplified[0].y}`];
    for (let i = 1; i < simplified.length; i++) {
      d.push(`L ${simplified[i].x} ${simplified[i].y}`);
    }
    return d.join(' ');
  }

  /**
   * Computes authentic DeldSim Manhattan (orthogonal 90-degree) routing between two coordinates.
   */
  static computeOrthogonalPath(c1, c2, wireIndex = 0, allWires = []) {
    if (!c1 || !c2) return '';

    const isPin = (p) => {
      const side = p.side;
      const comp = p.comp || '';
      return side === 'left' || side === 'right' || comp.startsWith('icbase_');
    };

    const isTerm = (p) => !isPin(p);

    const getSide = (p) => {
      if (p.side) return p.side;
      if (p.y < 200) return 'top';
      if (p.y > 480) return 'bottom';
      return p.x < 788 ? 'left' : 'right';
    };

    let isReversed = false;
    let p1 = { ...c1 };
    let p2 = { ...c2 };

    // Standardize: p1 is terminal, p2 is IC pin whenever connecting between them
    if (isPin(p1) && isTerm(p2)) {
      p1 = { ...c2 };
      p2 = { ...c1 };
      isReversed = true;
    }

    const side1 = getSide(p1);
    const side2 = getSide(p2);
    const points = [];

    // IC base centers: Base 0=230, Base 1=500, Base 2=770, Base 3=1040, Base 4=1310
    const baseCenters = [230, 500, 770, 1040, 1310];

    const getBaseIdx = (p) => {
      if (p.comp && p.comp.startsWith('icbase_')) {
        const match = p.comp.match(/icbase_(\d+)/);
        if (match) return parseInt(match[1], 10);
      }
      let closestIdx = 0;
      let minDist = 9999;
      baseCenters.forEach((cx, idx) => {
        const d = Math.abs(p.x - cx);
        if (d < minDist) {
          minDist = d;
          closestIdx = idx;
        }
      });
      return closestIdx;
    };

    // Helper: checks if horizontal segment [xA, xB] at y crosses any other IC base
    const crossesOtherBases = (xA, xB, y, targetIdx) => {
      if (y < 235 || y > 445) return false;
      const minX = Math.min(xA, xB);
      const maxX = Math.max(xA, xB);
      for (let idx = 0; idx < baseCenters.length; idx++) {
        if (idx === targetIdx) continue;
        const cx = baseCenters[idx];
        if (minX < (cx + 100) && maxX > (cx - 100)) {
          return true;
        }
      }
      return false;
    };

    // CASE 1: Terminal to IC Pin
    if (isTerm(p1) && isPin(p2)) {
      const isTop = (side1 === 'top' || p1.y < p2.y);
      const isLeftPin = (side2 === 'left');
      const baseIdx = getBaseIdx(p2);
      const cx = baseCenters[baseIdx];

      // Safe vertical gutters outside all pin numbers:
      // Left pin numbers span cx - 95 to cx - 75; Safe gutter is at cx - 110 (x <= cx - 100)
      // Right pin numbers span cx + 75 to cx + 95; Safe gutter is at cx + 110 (x >= cx + 100)
      const gutterX = isLeftPin ? (cx - 110) : (cx + 110);

      // Check if local: terminal is in front of the pin side, without crossing any other base
      const isCorrectSide = isLeftPin ? (p1.x <= p2.x) : (p1.x >= p2.x);
      const isWithinCol = Math.abs(p1.x - p2.x) < 90;
      const isLocal = isCorrectSide && isWithinCol && !crossesOtherBases(p1.x, p2.x, p2.y, baseIdx);

      if (isLocal) {
        let trunkX = p1.x;
        let jogY = null;
        let jogToX = null;

        if (allWires && allWires.length > 0) {
          allWires.forEach((otherW, oIdx) => {
            if (oIdx === wireIndex) return;
            const oc1 = otherW.c1;
            const oc2 = otherW.c2;
            if (!oc1 || !oc2) return;

            const otherTerm = isTerm(oc1) ? oc1 : (isTerm(oc2) ? oc2 : null);
            const otherPin = isPin(oc1) ? oc1 : (isPin(oc2) ? oc2 : null);

            if (otherTerm && otherPin && Math.abs(otherTerm.x - p1.x) < 4) {
              const otherIsTop = (getSide(otherTerm) === 'top' || otherTerm.y < otherPin.y);
              if (isTop && !otherIsTop && p2.y > otherPin.y) {
                jogY = otherPin.y - 12;
                jogToX = isLeftPin ? p1.x + 8 : p1.x - 8;
              } else if (isTop === otherIsTop && oIdx < wireIndex) {
                const laneOffset = ((wireIndex % 3) + 1) * (isLeftPin ? 7 : -7);
                trunkX = p1.x + laneOffset;
              }
            }
          });
        }

        points.push({ x: p1.x, y: p1.y });
        if (jogY !== null && jogToX !== null) {
          points.push({ x: p1.x, y: jogY });
          points.push({ x: jogToX, y: jogY });
          points.push({ x: jogToX, y: p2.y });
        } else if (trunkX !== p1.x) {
          const initY = isTop ? p1.y + 14 : p1.y - 14;
          points.push({ x: p1.x, y: initY });
          points.push({ x: trunkX, y: initY });
          points.push({ x: trunkX, y: p2.y });
        } else {
          points.push({ x: trunkX, y: p2.y });
        }
        points.push({ x: p2.x, y: p2.y });
      } else {
        // Non-local route: MUST USE TOP OR BOTTOM HIGHWAY to avoid all IC bases and pin numbers!
        // Top highway is at y = 175; Bottom highway is at y = 485
        const highwayLane = (wireIndex % 4) * 7;
        const yHighway = isTop ? (175 + highwayLane) : (485 - highwayLane);

        points.push({ x: p1.x, y: p1.y });
        points.push({ x: p1.x, y: yHighway });
        points.push({ x: gutterX, y: yHighway });
        points.push({ x: gutterX, y: p2.y });
        points.push({ x: p2.x, y: p2.y });
      }
    }
    // CASE 2: IC Pin to IC Pin
    else if (isPin(p1) && isPin(p2)) {
      const baseIdx1 = getBaseIdx(p1);
      const baseIdx2 = getBaseIdx(p2);
      const cx1 = baseCenters[baseIdx1];
      const cx2 = baseCenters[baseIdx2];

      const gutter1X = side1 === 'left' ? (cx1 - 110) : (cx1 + 110);
      const gutter2X = side2 === 'left' ? (cx2 - 110) : (cx2 + 110);

      if (baseIdx1 === baseIdx2 && side1 === side2) {
        // Same IC base and same side (e.g. Pin 1 to Pin 2)
        const gutterOffset = 18 + ((wireIndex % 3) * 7);
        const localGutterX = side1 === 'left' ? (p1.x - 46 - gutterOffset) : (p1.x + 46 + gutterOffset);
        points.push({ x: p1.x, y: p1.y });
        points.push({ x: localGutterX, y: p1.y });
        points.push({ x: localGutterX, y: p2.y });
        points.push({ x: p2.x, y: p2.y });
      } else {
        // Cross IC bases or opposite sides: route through highways!
        const useTop = ((p1.y + p2.y) / 2) < 340;
        const highwayLane = (wireIndex % 4) * 7;
        const yHighway = useTop ? (175 + highwayLane) : (485 - highwayLane);

        points.push({ x: p1.x, y: p1.y });
        points.push({ x: gutter1X, y: p1.y });
        points.push({ x: gutter1X, y: yHighway });
        points.push({ x: gutter2X, y: yHighway });
        points.push({ x: gutter2X, y: p2.y });
        points.push({ x: p2.x, y: p2.y });
      }
    }
    // CASE 3: Terminal to Terminal
    else {
      if (side1 === 'bottom' && side2 === 'bottom') {
        const trunkY = Math.min(p1.y, p2.y) - 20 - ((wireIndex % 4) * 8);
        points.push({ x: p1.x, y: p1.y });
        points.push({ x: p1.x, y: trunkY });
        points.push({ x: p2.x, y: trunkY });
        points.push({ x: p2.x, y: p2.y });
      } else if (side1 === 'top' && side2 === 'top') {
        const trunkY = Math.max(p1.y, p2.y) + 20 + ((wireIndex % 4) * 8);
        points.push({ x: p1.x, y: p1.y });
        points.push({ x: p1.x, y: trunkY });
        points.push({ x: p2.x, y: trunkY });
        points.push({ x: p2.x, y: p2.y });
      } else {
        const midY = (p1.y + p2.y) / 2;
        points.push({ x: p1.x, y: p1.y });
        points.push({ x: p1.x, y: midY });
        points.push({ x: p2.x, y: midY });
        points.push({ x: p2.x, y: p2.y });
      }
    }

    if (isReversed) {
      points.reverse();
    }

    return WireRenderer.pointsToSvgPath(points);
  }

  /**
   * Fallback Bezier curve method if ever requested.
   */
  static computeBezierPath(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.hypot(dx, dy);
    const sag = Math.min(120, Math.max(30, distance * 0.22));
    const cp1x = x1 + dx * 0.25;
    const cp1y = y1 + Math.abs(dy) * 0.15 + sag;
    const cp2x = x1 + dx * 0.75;
    const cp2y = y2 + Math.abs(dy) * 0.15 + sag;
    return `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
  }

  /**
   * Renders the temporary rubberband wire following the mouse during drag.
   */
  renderPreview(startCoord, currentCoord) {
    let previewEl = this.container.querySelector('#wire-preview-path');
    if (!startCoord || !currentCoord) {
      if (previewEl) previewEl.remove();
      return;
    }

    const d = WireRenderer.computeOrthogonalPath(startCoord, currentCoord);

    if (!previewEl) {
      previewEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      previewEl.setAttribute('id', 'wire-preview-path');
      previewEl.setAttribute('fill', 'none');
      previewEl.setAttribute('stroke-width', '2.5');
      previewEl.setAttribute('stroke-linecap', 'round');
      previewEl.setAttribute('stroke-linejoin', 'round');
      previewEl.setAttribute('stroke-dasharray', '5 3');
      previewEl.setAttribute('pointer-events', 'none');
      this.container.appendChild(previewEl);
    }

    previewEl.setAttribute('d', d);
    previewEl.setAttribute('stroke', this.currentColor);
  }

  clearPreview() {
    const previewEl = this.container.querySelector('#wire-preview-path');
    if (previewEl) previewEl.remove();
  }

  /**
   * Renders all circuit wires onto the SVG layer.
   */
  renderWires(wires, getPinCoord, isPowerOn, activeTool, onWireClick) {
    const currentWireIds = new Set(wires.map(w => w.id));

    // Remove deleted wires
    for (const [id, el] of this.wirePathElements.entries()) {
      if (!currentWireIds.has(id)) {
        el.remove();
        this.wirePathElements.delete(id);
      }
    }

    // Map all coordinates first for collision awareness
    const mappedWires = wires.map((wire, idx) => {
      const c1 = getPinCoord(wire.from);
      const c2 = getPinCoord(wire.to);
      return { wire, c1, c2, idx };
    });

    // Render or update active wires
    mappedWires.forEach(({ wire, c1, c2, idx }) => {
      if (!c1 || !c2) return;

      const d = WireRenderer.computeOrthogonalPath(c1, c2, idx, mappedWires);

      let group = this.wirePathElements.get(wire.id);
      let shadowPath, mainPath, hitPath;

      if (!group) {
        group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'circuit-wire-group');
        group.setAttribute('data-wire-id', wire.id);

        // Soft shadow underneath wire for depth
        shadowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        shadowPath.setAttribute('class', 'wire-shadow');
        shadowPath.setAttribute('fill', 'none');
        shadowPath.setAttribute('stroke', 'rgba(0,0,0,0.25)');
        shadowPath.setAttribute('stroke-width', '3.5');
        shadowPath.setAttribute('stroke-linecap', 'round');
        shadowPath.setAttribute('stroke-linejoin', 'round');
        shadowPath.setAttribute('filter', 'url(#wire-shadow-filter)');

        // Main visible wire: 2.5px width with round joins
        mainPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        mainPath.setAttribute('class', 'wire-main');
        mainPath.setAttribute('fill', 'none');
        mainPath.setAttribute('stroke-width', '2.5');
        mainPath.setAttribute('stroke-linecap', 'round');
        mainPath.setAttribute('stroke-linejoin', 'round');

        // Invisible wider hit area for easy clicking when in remove-wire mode
        hitPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        hitPath.setAttribute('class', 'wire-hitbox');
        hitPath.setAttribute('fill', 'none');
        hitPath.setAttribute('stroke', 'transparent');
        hitPath.setAttribute('stroke-width', '14');
        hitPath.setAttribute('stroke-linecap', 'round');
        hitPath.setAttribute('stroke-linejoin', 'round');
        hitPath.setAttribute('pointer-events', activeTool === 'remove-wire' ? 'stroke' : 'none');
        hitPath.setAttribute('cursor', activeTool === 'remove-wire' ? 'crosshair' : 'default');

        hitPath.addEventListener('click', (e) => {
          e.stopPropagation();
          if (onWireClick) onWireClick(wire.id);
        });

        // Hover effect in remove-wire mode
        hitPath.addEventListener('mouseenter', () => {
          if (activeTool === 'remove-wire') {
            mainPath.setAttribute('stroke-width', '4');
            mainPath.setAttribute('stroke', '#ef4444');
            group.classList.add('wire-marked-delete');
          }
        });

        hitPath.addEventListener('mouseleave', () => {
          mainPath.setAttribute('stroke-width', '2.5');
          group.classList.remove('wire-marked-delete');
          this._applyWireColor(mainPath, wire, isPowerOn);
        });

        group.appendChild(shadowPath);
        group.appendChild(mainPath);
        group.appendChild(hitPath);
        this.container.appendChild(group);
        this.wirePathElements.set(wire.id, group);
      } else {
        shadowPath = group.querySelector('.wire-shadow');
        mainPath = group.querySelector('.wire-main');
        hitPath = group.querySelector('.wire-hitbox');
        hitPath.setAttribute('pointer-events', activeTool === 'remove-wire' ? 'stroke' : 'none');
        hitPath.setAttribute('cursor', activeTool === 'remove-wire' ? 'crosshair' : 'default');
      }

      // Update path data
      shadowPath.setAttribute('d', d);
      mainPath.setAttribute('d', d);
      hitPath.setAttribute('d', d);

      // Color handling
      this._applyWireColor(mainPath, wire, isPowerOn);
    });
  }

  _applyWireColor(mainPath, wire, isPowerOn) {
    if (this.signalColorMode && isPowerOn) {
      if (wire.level === 1) {
        // High voltage: glowing bright red/coral
        mainPath.setAttribute('stroke', '#F64E4D');
        mainPath.style.filter = 'drop-shadow(0 0 3px rgba(246, 78, 77, 0.8))';
      } else {
        // Low voltage: deep dark/subtle
        mainPath.setAttribute('stroke', '#1e293b');
        mainPath.style.filter = 'none';
      }
    } else {
      // Normal color mode: authentic custom wire palette color
      mainPath.setAttribute('stroke', wire.color || this.currentColor);
      mainPath.style.filter = 'none';
    }
  }
}

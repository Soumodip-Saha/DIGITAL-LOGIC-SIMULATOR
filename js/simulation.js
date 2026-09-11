/**
 * DELD Virtual Trainer Kit - Real-Time Circuit Simulation Engine
 * Handles signal propagation, clock timers, multi-stage IC evaluation,
 * and wire state resolution.
 */

import { IC_LIBRARY } from './ic-library.js';

export class CircuitSimulator {
  constructor() {
    this.power = false; // Master power switch state

    // 16 Input switches (0 = LOW, 1 = HIGH)
    this.switches = new Array(16).fill(0);

    // 16 Output LEDs (0 = OFF, 1 = ON)
    this.leds = new Array(16).fill(0);

    // Clock frequencies: 0.5Hz, 1Hz, 5Hz, 10Hz
    this.clocks = {
      0.5: 0,
      1: 0,
      5: 0,
      10: 0,
      manual: 0 // Pulse button
    };

    // 2 Seven-segment displays, each with segments { a, b, c, d, e, f, g, dp }
    this.displays = [
      { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, dp: 0 },
      { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, dp: 0 }
    ];

    // 5 IC Bases (0 to 4)
    // Each base has:
    // - icId: null or string (e.g. '74LS00')
    // - pins: map of pinNumber (1..20) -> { level: 0/1, type: 'input'|'output'|'vcc'|'gnd'|'nc' }
    // - state: internal sequential state (for flip-flops, counters, shift registers)
    this.icBases = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      icId: null,
      pins: {},
      state: {}
    }));

    // Array of active wires:
    // { id, from: { comp, pin }, to: { comp, pin }, color, level: 0|1 }
    this.wires = [];

    // Change listeners
    this.listeners = new Set();
    this._suppressNotify = false;

    // Setup real-time clocks
    this.clockIntervals = [];
    this._startClocks();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    if (this._suppressNotify) return;
    for (const listener of this.listeners) {
      try {
        listener(this);
      } catch (err) {
        console.error('Simulation listener error:', err);
      }
    }
  }

  _startClocks() {
    this._stopClocks();

    const freqs = [0.5, 1, 5, 10];
    freqs.forEach(hz => {
      const halfPeriodMs = Math.round(1000 / (hz * 2));
      const interval = setInterval(() => {
        if (this.power) {
          const hzSafe = String(hz).replace('.', '_');
          const hasWire = this.wires.some(w =>
            (w.from.comp === 'clock' && (String(w.from.pin) === String(hz) || String(w.from.pin) === hzSafe)) ||
            (w.to.comp === 'clock' && (String(w.to.pin) === String(hz) || String(w.to.pin) === hzSafe))
          );
          if (hasWire) {
            this.clocks[hz] = this.clocks[hz] === 1 ? 0 : 1;
            this.evaluate();
          } else if (this.clocks[hz] !== 0) {
            this.clocks[hz] = 0;
          }
        }
      }, halfPeriodMs);
      this.clockIntervals.push(interval);
    });
  }

  _stopClocks() {
    this.clockIntervals.forEach(id => clearInterval(id));
    this.clockIntervals = [];
  }

  setPower(on) {
    this.power = Boolean(on);
    if (!this.power) {
      // Powering down resets volatile signals
      this.leds.fill(0);
      this.wires.forEach(w => w.level = 0);
      this.displays.forEach(d => {
        Object.keys(d).forEach(k => d[k] = 0);
      });
      // Clear IC pin levels
      this.icBases.forEach(base => {
        Object.keys(base.pins).forEach(p => {
          base.pins[p].level = 0;
        });
      });
      this.notify();
    } else {
      this.evaluate();
    }
  }

  toggleSwitch(index) {
    if (index >= 0 && index < 16) {
      this.switches[index] = this.switches[index] === 1 ? 0 : 1;
      this.evaluate();
    }
  }

  setSwitch(index, val) {
    if (index >= 0 && index < 16) {
      this.switches[index] = val ? 1 : 0;
      this.evaluate();
    }
  }

  setManualPulse(active) {
    this.clocks.manual = active ? 1 : 0;
    this.evaluate();
  }

  insertIC(baseIndex, icId) {
    if (baseIndex < 0 || baseIndex >= 5) return false;
    const icDef = IC_LIBRARY[icId];
    if (!icDef) return false;

    const base = this.icBases[baseIndex];
    base.icId = icId;
    base.pins = {};

    // Initialize pins based on IC definition
    for (let p = 1; p <= icDef.pins; p++) {
      const def = icDef.pinout[p] || { name: 'NC', type: 'nc' };
      base.pins[p] = {
        name: def.name,
        type: def.type,
        level: 0
      };
    }

    // Initialize IC state if sequential
    base.state = icDef.initState ? icDef.initState() : {};

    this.evaluate();
    return true;
  }

  removeIC(baseIndex) {
    if (baseIndex < 0 || baseIndex >= 5) return false;
    const base = this.icBases[baseIndex];
    const prevId = base.icId;
    base.icId = null;
    base.pins = {};
    base.state = {};

    // Remove wires connected to this IC base
    this.wires = this.wires.filter(w => {
      const touchesBase =
        (w.from.comp === `icbase_${baseIndex}`) ||
        (w.to.comp === `icbase_${baseIndex}`);
      return !touchesBase;
    });

    this.evaluate();
    return prevId !== null;
  }

  _normalizeEndpoint(ep) {
    if (!ep) return null;
    let comp = String(ep.comp).toLowerCase().trim();
    let pin = String(ep.pin).toLowerCase().trim();

    if (comp === 'power' && pin === 'vcc') { comp = 'vcc'; pin = '0'; }
    else if (comp === 'power' && pin === 'gnd') { comp = 'gnd'; pin = '0'; }
    else if (comp === 'vcc') { pin = '0'; }
    else if (comp === 'gnd') { pin = '0'; }
    else if (comp === 'output') { comp = 'led'; }
    else if (comp.startsWith('ic_')) { comp = comp.replace('ic_', 'icbase_'); }
    else if (comp.startsWith('base_')) { comp = comp.replace('base_', 'icbase_'); }

    return { comp, pin };
  }

  addWire(from, to, color = '#F64E4D') {
    const nFrom = this._normalizeEndpoint(from);
    const nTo = this._normalizeEndpoint(to);
    if (!nFrom || !nTo) return null;
    if (nFrom.comp === nTo.comp && nFrom.pin === nTo.pin) return null;

    // Check if wire already exists (normalized)
    const exists = this.wires.some(w => {
      const wFrom = this._normalizeEndpoint(w.from);
      const wTo = this._normalizeEndpoint(w.to);
      return (
        (wFrom.comp === nFrom.comp && wFrom.pin === nFrom.pin && wTo.comp === nTo.comp && wTo.pin === nTo.pin) ||
        (wFrom.comp === nTo.comp && wFrom.pin === nTo.pin && wTo.comp === nFrom.comp && wTo.pin === nFrom.pin)
      );
    });
    if (exists) return null;

    const wire = {
      id: `w_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      from: nFrom,
      to: nTo,
      color: color || '#F64E4D',
      level: 0
    };

    this.wires.push(wire);
    this.evaluate();
    return wire;
  }

  removeWire(wireId) {
    const idx = this.wires.findIndex(w => w.id === wireId);
    if (idx !== -1) {
      this.wires.splice(idx, 1);
      this.evaluate();
      return true;
    }
    return false;
  }

  clearWires() {
    this.wires = [];
    this.evaluate();
  }

  resetCircuit() {
    this.switches.fill(0);
    this.leds.fill(0);
    this.displays.forEach(d => {
      Object.keys(d).forEach(k => d[k] = 0);
    });
    this.wires = [];
    this.icBases.forEach(base => {
      base.icId = null;
      base.pins = {};
      base.state = {};
    });
    this.power = false;
    this.notify();
  }

  /**
   * Evaluates the circuit by propagating logic levels across the connection graph.
   * Multi-pass relaxation handles multi-stage cascaded ICs (e.g. Adder or Counter chains).
   */
  evaluate() {
    if (!this.power) {
      this.notify();
      return;
    }

    // Build node graph representation
    // Each terminal has a unique key: e.g. "switch:3", "led:0", "clock:1", "vcc:0", "gnd:0", "ic:1:3"
    const termKey = endpoint => `${endpoint.comp}:${endpoint.pin}`;

    // Map of driver outputs
    const drivers = new Map();

    // Constant power drivers
    drivers.set('power:vcc', 1);
    drivers.set('vcc:0', 1);
    drivers.set('vcc:vcc', 1);
    drivers.set('power:gnd', 0);
    drivers.set('gnd:0', 0);
    drivers.set('gnd:gnd', 0);

    // Switches as drivers
    this.switches.forEach((val, i) => {
      drivers.set(`switch:${i}`, val);
    });

    // Clock signals as drivers
    drivers.set('clock:0.5', this.clocks[0.5]);
    drivers.set('clock:0_5', this.clocks[0.5]);
    drivers.set('clock:1', this.clocks[1]);
    drivers.set('clock:5', this.clocks[5]);
    drivers.set('clock:10', this.clocks[10]);
    drivers.set('clock:manual', this.clocks.manual);
    drivers.set('clock:manual_inv', this.clocks.manual === 1 ? 0 : 1);
    drivers.set('clock:high', this.clocks.manual);
    drivers.set('clock:low', this.clocks.manual === 1 ? 0 : 1);

    // Reset IC pin input levels before propagation
    this.icBases.forEach((base, bIdx) => {
      if (!base.icId) return;
      Object.keys(base.pins).forEach(p => {
        if (base.pins[p].type === 'input') {
          base.pins[p].level = 0; // default pulled low
        } else if (base.pins[p].type === 'vcc') {
          base.pins[p].level = 1;
        } else if (base.pins[p].type === 'gnd') {
          base.pins[p].level = 0;
        }
      });
    });

    // Relaxation loop for multi-stage combinational circuits (up to 8 passes)
    const MAX_PASSES = 8;
    for (let pass = 0; pass < MAX_PASSES; pass++) {
      let changed = false;

      // Propagate signals across connected wire networks (nets)
      // Multi-pass flood-fill ensures daisy-chained pins (e.g. Pin A -> Pin B -> Pin C)
      // receive signals regardless of connection sequence or branch depth.
      let netChanged = true;
      let netPasses = 0;
      while (netChanged && netPasses < 12) {
        netChanged = false;
        netPasses++;
        this.wires.forEach(w => {
          const keyA = termKey(w.from);
          const keyB = termKey(w.to);
          const hasA = drivers.has(keyA);
          const hasB = drivers.has(keyB);

          let signal = 0;
          if (hasA) {
            signal = drivers.get(keyA);
            if (!hasB || drivers.get(keyB) !== signal) {
              drivers.set(keyB, signal);
              netChanged = true;
            }
          } else if (hasB) {
            signal = drivers.get(keyB);
            if (!hasA || drivers.get(keyA) !== signal) {
              drivers.set(keyA, signal);
              netChanged = true;
            }
          }

          if (w.level !== signal) {
            w.level = signal;
            changed = true;
          }

          // Apply signal to receiver endpoints
          this._applySignalToEndpoint(w.from, signal);
          this._applySignalToEndpoint(w.to, signal);
        });
      }

      // Evaluate each IC
      this.icBases.forEach((base, bIdx) => {
        if (!base.icId) return;
        const icDef = IC_LIBRARY[base.icId];
        if (!icDef || !icDef.simulate) return;

        // Collect inputs for this IC
        const inputs = {};
        for (let p = 1; p <= icDef.pins; p++) {
          inputs[p] = base.pins[p] ? base.pins[p].level : 0;
        }

        // Run IC logic evaluation
        const outputs = icDef.simulate(inputs, base.state);

        // Update output pins and drivers
        if (outputs) {
          Object.entries(outputs).forEach(([pinNum, val]) => {
            const p = Number(pinNum);
            if (base.pins[p]) {
              const oldVal = base.pins[p].level;
              base.pins[p].level = val;
              drivers.set(`icbase_${bIdx}:${p}`, val);

              // Also map to socket pin if applicable for dual-compatibility:
              if (icDef.pins === 14 && p >= 8 && p <= 14) {
                const socketPin = 20 - (14 - p);
                drivers.set(`icbase_${bIdx}:${socketPin}`, val);
                drivers.set(`icbase_${bIdx}:socket_${socketPin}`, val);
              } else if (icDef.pins === 16 && p >= 9 && p <= 16) {
                const socketPin = 20 - (16 - p);
                drivers.set(`icbase_${bIdx}:${socketPin}`, val);
                drivers.set(`icbase_${bIdx}:socket_${socketPin}`, val);
              }

              if (oldVal !== val) {
                changed = true;
              }
            }
          });
        }
      });

      if (!changed) break;
    }

    // Update Output LEDs based on connected incoming wires
    const newLeds = new Array(16).fill(0);
    this.wires.forEach(w => {
      [w.from, w.to].forEach(endpoint => {
        if (endpoint.comp === 'led') {
          const idx = Number(endpoint.pin);
          if (idx >= 0 && idx < 16) {
            if (w.level === 1) newLeds[idx] = 1;
          }
        }
      });
    });
    this.leds = newLeds;

    // Update 7-Segment Displays based on connected incoming wires (Supports both BCD and direct segment inputs)
    const newDisplays = [
      { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, dp: 0 },
      { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, dp: 0 }
    ];
    const bcdBits = [
      { 8: 0, 4: 0, 2: 0, 1: 0, hasBcd: false },
      { 8: 0, 4: 0, 2: 0, 1: 0, hasBcd: false }
    ];

    this.wires.forEach(w => {
      [w.from, w.to].forEach(endpoint => {
        if (endpoint.comp === 'display_0' || endpoint.comp === 'display_1') {
          const dispIdx = endpoint.comp === 'display_0' ? 0 : 1;
          const pinKey = String(endpoint.pin).toLowerCase();

          // Check for BCD inputs (8, 4, 2, 1)
          if (pinKey === '8' || pinKey === 'bcd_8' || pinKey === 'd' || pinKey === '3') {
            bcdBits[dispIdx].hasBcd = true;
            if (w.level === 1) bcdBits[dispIdx]['8'] = 1;
          } else if (pinKey === '4' || pinKey === 'bcd_4' || pinKey === 'c' || pinKey === '2') {
            bcdBits[dispIdx].hasBcd = true;
            if (w.level === 1) bcdBits[dispIdx]['4'] = 1;
          } else if (pinKey === '2' || pinKey === 'bcd_2' || pinKey === 'b' || pinKey === '1') {
            bcdBits[dispIdx].hasBcd = true;
            if (w.level === 1) bcdBits[dispIdx]['2'] = 1;
          } else if (pinKey === '1' || pinKey === 'bcd_1' || pinKey === '0') {
            bcdBits[dispIdx].hasBcd = true;
            if (w.level === 1) bcdBits[dispIdx]['1'] = 1;
          }

          // Also check for direct segment pins ('a'..'g', 'dp')
          if (['a', 'b', 'c', 'd', 'e', 'f', 'g', 'dp'].includes(pinKey)) {
            if (w.level === 1) {
              newDisplays[dispIdx][pinKey] = 1;
            }
          }
        }
      });
    });

    // BCD 4-bit decoder table (0..15 -> a..g)
    const BCD_DECODE = {
      0:  { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 0 },
      1:  { a: 0, b: 1, c: 1, d: 0, e: 0, f: 0, g: 0 },
      2:  { a: 1, b: 1, c: 0, d: 1, e: 1, f: 0, g: 1 },
      3:  { a: 1, b: 1, c: 1, d: 1, e: 0, f: 0, g: 1 },
      4:  { a: 0, b: 1, c: 1, d: 0, e: 0, f: 1, g: 1 },
      5:  { a: 1, b: 0, c: 1, d: 1, e: 0, f: 1, g: 1 },
      6:  { a: 1, b: 0, c: 1, d: 1, e: 1, f: 1, g: 1 },
      7:  { a: 1, b: 1, c: 1, d: 0, e: 0, f: 0, g: 0 },
      8:  { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1 },
      9:  { a: 1, b: 1, c: 1, d: 1, e: 0, f: 1, g: 1 },
      10: { a: 1, b: 1, c: 1, d: 0, e: 1, f: 1, g: 1 }, // A
      11: { a: 0, b: 0, c: 1, d: 1, e: 1, f: 1, g: 1 }, // b
      12: { a: 1, b: 0, c: 0, d: 1, e: 1, f: 1, g: 0 }, // C
      13: { a: 0, b: 1, c: 1, d: 1, e: 1, f: 0, g: 1 }, // d
      14: { a: 1, b: 0, c: 0, d: 1, e: 1, f: 1, g: 1 }, // E
      15: { a: 1, b: 0, c: 0, d: 0, e: 1, f: 1, g: 1 }  // F
    };

    [0, 1].forEach(dispIdx => {
      if (bcdBits[dispIdx].hasBcd) {
        const val = (bcdBits[dispIdx]['8'] * 8) + (bcdBits[dispIdx]['4'] * 4) + (bcdBits[dispIdx]['2'] * 2) + (bcdBits[dispIdx]['1'] * 1);
        const decoded = BCD_DECODE[val] || BCD_DECODE[0];
        Object.entries(decoded).forEach(([seg, lit]) => {
          if (lit === 1) newDisplays[dispIdx][seg] = 1;
        });
      }
    });

    this.displays = newDisplays;

    this.notify();
  }

  _applySignalToEndpoint(endpoint, signal) {
    if (endpoint.comp.startsWith('icbase_')) {
      const bIdx = Number(endpoint.comp.replace('icbase_', ''));
      let pinStr = String(endpoint.pin).trim();
      const base = this.icBases[bIdx];
      if (!base || !base.icId) return;

      const icDef = IC_LIBRARY[base.icId];
      if (!icDef) return;

      let pinNum = Number(pinStr);

      // Translate socket pin number to IC pin number if socket pin was targeted
      if (pinStr.startsWith('socket_')) {
        const sNum = parseInt(pinStr.replace('socket_', ''), 10);
        if (icDef.pins === 14 && sNum >= 14 && sNum <= 20) {
          pinNum = 14 - (20 - sNum);
        } else if (icDef.pins === 16 && sNum >= 13 && sNum <= 20) {
          pinNum = 16 - (20 - sNum);
        } else {
          pinNum = sNum;
        }
      } else if (icDef.pins === 14 && pinNum > 14 && pinNum <= 20) {
        pinNum = 14 - (20 - pinNum); // 20 -> 14 (VCC), 19 -> 13, ..., 15 -> 9
      } else if (icDef.pins === 16 && pinNum > 16 && pinNum <= 20) {
        pinNum = 16 - (20 - pinNum); // 20 -> 16 (VCC), 19 -> 15, ..., 17 -> 9
      }

      if (base.pins[pinNum] && base.pins[pinNum].type === 'input') {
        if (signal === 1) {
          base.pins[pinNum].level = 1;
        }
      }
    }
  }

  serialize() {
    return {
      version: '1.0',
      switches: [...this.switches],
      icBases: this.icBases.map(b => ({
        id: b.id,
        icId: b.icId
      })),
      wires: this.wires.map(w => ({
        from: { ...w.from },
        to: { ...w.to },
        color: w.color
      }))
    };
  }

  deserialize(data) {
    this.resetCircuit();
    if (!data) return;

    if (Array.isArray(data.switches)) {
      data.switches.forEach((val, i) => {
        if (i < 16) this.switches[i] = val ? 1 : 0;
      });
    }

    if (Array.isArray(data.icBases)) {
      data.icBases.forEach(b => {
        if (b.icId && b.id >= 0 && b.id < 5) {
          this.insertIC(b.id, b.icId);
        }
      });
    }

    if (Array.isArray(data.wires)) {
      data.wires.forEach(w => {
        this.addWire(w.from, w.to, w.color);
      });
    }

    this.evaluate();
  }

  /**
   * Generates the end-to-end circuit truth table from initial input switches to final output LEDs.
   * Discovers active inputs and outputs, tests all 2^N input combinations, and highlights current live row.
   */
  generateCircuitTruthTable() {
    const connectedSwitchesSet = new Set();
    const connectedLedsSet = new Set();
    const activeICsMap = new Map();

    this.wires.forEach(w => {
      [w.from, w.to].forEach(ep => {
        if (ep.comp === 'switch') {
          const swNum = Number(ep.pin);
          if (!isNaN(swNum) && swNum >= 0 && swNum < 16) {
            connectedSwitchesSet.add(swNum);
          }
        } else if (ep.comp === 'led') {
          const ledNum = Number(ep.pin);
          if (!isNaN(ledNum) && ledNum >= 0 && ledNum < 16) {
            connectedLedsSet.add(ledNum);
          }
        } else if (ep.comp.startsWith('icbase_')) {
          const bIdx = Number(ep.comp.replace('icbase_', ''));
          if (this.icBases[bIdx] && this.icBases[bIdx].icId) {
            const icId = this.icBases[bIdx].icId;
            activeICsMap.set(bIdx, {
              baseIndex: bIdx,
              icId,
              name: IC_LIBRARY[icId]?.name || icId
            });
          }
        }
      });
    });

    const activeSwitches = Array.from(connectedSwitchesSet).sort((a, b) => a - b);
    const activeLeds = Array.from(connectedLedsSet).sort((a, b) => a - b);
    const activeICs = Array.from(activeICsMap.values()).sort((a, b) => a.baseIndex - b.baseIndex);

    if (activeSwitches.length === 0 || activeLeds.length === 0) {
      let emptyReason = 'No complete circuit detected between switches and LEDs.';
      if (activeSwitches.length === 0 && activeLeds.length === 0) {
        emptyReason = 'No input switches or output LEDs are currently connected.';
      } else if (activeSwitches.length === 0) {
        emptyReason = 'No input switches are connected. Connect switches to your IC inputs.';
      } else {
        emptyReason = 'No output LEDs are connected. Connect IC outputs to LEDs.';
      }
      return {
        inputs: activeSwitches,
        outputs: activeLeds,
        activeICs,
        rows: [],
        liveRowIndex: -1,
        emptyReason
      };
    }

    const N = activeSwitches.length;
    if (N > 8) {
      return {
        inputs: activeSwitches,
        outputs: activeLeds,
        activeICs,
        rows: [],
        liveRowIndex: -1,
        emptyReason: `Too many input switches connected (${N} switches). Truth table supports up to 8 inputs (256 combinations).`
      };
    }

    // Backup current circuit state
    const prevPower = this.power;
    const prevSwitches = [...this.switches];
    const prevLeds = [...this.leds];
    const prevWireLevels = this.wires.map(w => w.level);
    const prevStates = this.icBases.map(b => JSON.parse(JSON.stringify(b.state || {})));
    const prevPinLevels = this.icBases.map(b => {
      const pins = {};
      Object.entries(b.pins || {}).forEach(([p, d]) => { pins[p] = d.level; });
      return pins;
    });
    const prevSuppress = this._suppressNotify;

    this._suppressNotify = true;
    this.power = true;

    const totalRows = 1 << N;
    const rows = [];
    let liveRowIndex = -1;

    for (let r = 0; r < totalRows; r++) {
      const inputVals = {};
      let isLive = true;

      activeSwitches.forEach((swNum, bitPos) => {
        const shift = N - 1 - bitPos;
        const bitVal = (r >> shift) & 1;
        this.switches[swNum] = bitVal;
        inputVals[swNum] = bitVal;
        if (prevSwitches[swNum] !== bitVal) {
          isLive = false;
        }
      });

      if (isLive) {
        liveRowIndex = r;
      }

      this.evaluate();

      const outputVals = {};
      activeLeds.forEach(ledNum => {
        outputVals[ledNum] = this.leds[ledNum] || 0;
      });

      rows.push({
        rowIndex: r,
        inputs: inputVals,
        outputs: outputVals,
        isLive
      });
    }

    // Restore original state completely to prevent phantom LED illumination
    this.power = prevPower;
    this.switches = prevSwitches;
    this.leds = prevLeds;
    this.wires.forEach((w, idx) => {
      w.level = prevWireLevels[idx] !== undefined ? prevWireLevels[idx] : 0;
    });
    this.icBases.forEach((b, i) => {
      b.state = prevStates[i];
      if (b.pins && prevPinLevels[i]) {
        Object.entries(prevPinLevels[i]).forEach(([p, lvl]) => {
          if (b.pins[p]) b.pins[p].level = lvl;
        });
      }
    });
    this._suppressNotify = prevSuppress;

    if (prevPower) {
      this.evaluate();
    } else {
      this.leds.fill(0);
      this.wires.forEach(w => w.level = 0);
      this.notify();
    }

    return {
      inputs: activeSwitches,
      outputs: activeLeds,
      activeICs,
      rows,
      liveRowIndex
    };
  }
}

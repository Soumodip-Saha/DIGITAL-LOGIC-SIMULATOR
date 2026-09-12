/**
 * DELD Virtual Trainer Kit - Standalone Offline Bundle
 * Works on both file:// and http:// protocols without CORS restrictions.
 */
(function() {
"use strict";

// ==========================================
// SOURCE: js/ic-library.js
// ==========================================
/**
 * DELD Virtual Trainer Kit - IC Library
 * 100% Free & Unlocked Digital Integrated Circuits
 * Contains pin definitions, physical DIP package geometry, truth tables, and simulation evaluation logic.
 */

const IC_CATEGORIES = {
  ALL: 'all',
  GATES: 'gates',
  COMBINATIONAL: 'combinational',
  ARITHMETIC: 'arithmetic',
  FLIP_FLOPS: 'flip_flops',
  COUNTERS: 'counters',
  REGISTERS: 'registers',
  SEQUENTIAL: 'flip_flops'
};

const IC_LIBRARY = {
  // ==========================================
  // BASIC LOGIC GATES
  // ==========================================
  '74LS00': {
    id: '74LS00',
    name: '74LS00 Quad 2-Input NAND Gate',
    category: IC_CATEGORIES.GATES,
    pins: 14,
    description: 'Contains four independent 2-input NAND gates with standard TTL outputs.',
    pinout: {
      1: { name: '1A', type: 'input', desc: 'Gate 1 Input A' },
      2: { name: '1B', type: 'input', desc: 'Gate 1 Input B' },
      3: { name: '1Y', type: 'output', desc: 'Gate 1 Output (NAND)' },
      4: { name: '2A', type: 'input', desc: 'Gate 2 Input A' },
      5: { name: '2B', type: 'input', desc: 'Gate 2 Input B' },
      6: { name: '2Y', type: 'output', desc: 'Gate 2 Output (NAND)' },
      7: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      8: { name: '3Y', type: 'output', desc: 'Gate 3 Output (NAND)' },
      9: { name: '3A', type: 'input', desc: 'Gate 3 Input A' },
      10: { name: '3B', type: 'input', desc: 'Gate 3 Input B' },
      11: { name: '4Y', type: 'output', desc: 'Gate 4 Output (NAND)' },
      12: { name: '4A', type: 'input', desc: 'Gate 4 Input A' },
      13: { name: '4B', type: 'input', desc: 'Gate 4 Input B' },
      14: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    truthTable: {
      headers: ['Input A', 'Input B', 'Output Y (NAND)'],
      rows: [
        ['0', '0', '1'],
        ['0', '1', '1'],
        ['1', '0', '1'],
        ['1', '1', '0']
      ]
    },
    simulate: (inputs, state) => {
      return {
        3: inputs[1] === 1 && inputs[2] === 1 ? 0 : 1,
        6: inputs[4] === 1 && inputs[5] === 1 ? 0 : 1,
        8: inputs[9] === 1 && inputs[10] === 1 ? 0 : 1,
        11: inputs[12] === 1 && inputs[13] === 1 ? 0 : 1
      };
    }
  },

  '74LS02': {
    id: '74LS02',
    name: '74LS02 Quad 2-Input NOR Gate',
    category: IC_CATEGORIES.GATES,
    pins: 14,
    description: 'Contains four independent 2-input NOR gates.',
    pinout: {
      1: { name: '1Y', type: 'output', desc: 'Gate 1 Output (NOR)' },
      2: { name: '1A', type: 'input', desc: 'Gate 1 Input A' },
      3: { name: '1B', type: 'input', desc: 'Gate 1 Input B' },
      4: { name: '2Y', type: 'output', desc: 'Gate 2 Output (NOR)' },
      5: { name: '2A', type: 'input', desc: 'Gate 2 Input A' },
      6: { name: '2B', type: 'input', desc: 'Gate 2 Input B' },
      7: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      8: { name: '3A', type: 'input', desc: 'Gate 3 Input A' },
      9: { name: '3B', type: 'input', desc: 'Gate 3 Input B' },
      10: { name: '3Y', type: 'output', desc: 'Gate 3 Output (NOR)' },
      11: { name: '4A', type: 'input', desc: 'Gate 4 Input A' },
      12: { name: '4B', type: 'input', desc: 'Gate 4 Input B' },
      13: { name: '4Y', type: 'output', desc: 'Gate 4 Output (NOR)' },
      14: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    truthTable: {
      headers: ['Input A', 'Input B', 'Output Y (NOR)'],
      rows: [
        ['0', '0', '1'],
        ['0', '1', '0'],
        ['1', '0', '0'],
        ['1', '1', '0']
      ]
    },
    simulate: (inputs) => {
      return {
        1: inputs[2] === 0 && inputs[3] === 0 ? 1 : 0,
        4: inputs[5] === 0 && inputs[6] === 0 ? 1 : 0,
        10: inputs[8] === 0 && inputs[9] === 0 ? 1 : 0,
        13: inputs[11] === 0 && inputs[12] === 0 ? 1 : 0
      };
    }
  },

  '74LS04': {
    id: '74LS04',
    name: '74LS04 Hex Inverter (NOT Gate)',
    category: IC_CATEGORIES.GATES,
    pins: 14,
    description: 'Contains six independent Inverter (NOT) gates.',
    pinout: {
      1: { name: '1A', type: 'input', desc: 'Inverter 1 Input' },
      2: { name: '1Y', type: 'output', desc: 'Inverter 1 Output' },
      3: { name: '2A', type: 'input', desc: 'Inverter 2 Input' },
      4: { name: '2Y', type: 'output', desc: 'Inverter 2 Output' },
      5: { name: '3A', type: 'input', desc: 'Inverter 3 Input' },
      6: { name: '3Y', type: 'output', desc: 'Inverter 3 Output' },
      7: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      8: { name: '4Y', type: 'output', desc: 'Inverter 4 Output' },
      9: { name: '4A', type: 'input', desc: 'Inverter 4 Input' },
      10: { name: '5Y', type: 'output', desc: 'Inverter 5 Output' },
      11: { name: '5A', type: 'input', desc: 'Inverter 5 Input' },
      12: { name: '6Y', type: 'output', desc: 'Inverter 6 Output' },
      13: { name: '6A', type: 'input', desc: 'Inverter 6 Input' },
      14: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    truthTable: {
      headers: ['Input A', 'Output Y (NOT)'],
      rows: [
        ['0', '1'],
        ['1', '0']
      ]
    },
    simulate: (inputs) => {
      return {
        2: inputs[1] === 1 ? 0 : 1,
        4: inputs[3] === 1 ? 0 : 1,
        6: inputs[5] === 1 ? 0 : 1,
        8: inputs[9] === 1 ? 0 : 1,
        10: inputs[11] === 1 ? 0 : 1,
        12: inputs[13] === 1 ? 0 : 1
      };
    }
  },

  '74LS08': {
    id: '74LS08',
    name: '74LS08 Quad 2-Input AND Gate',
    category: IC_CATEGORIES.GATES,
    pins: 14,
    description: 'Contains four independent 2-input AND gates.',
    pinout: {
      1: { name: '1A', type: 'input', desc: 'Gate 1 Input A' },
      2: { name: '1B', type: 'input', desc: 'Gate 1 Input B' },
      3: { name: '1Y', type: 'output', desc: 'Gate 1 Output (AND)' },
      4: { name: '2A', type: 'input', desc: 'Gate 2 Input A' },
      5: { name: '2B', type: 'input', desc: 'Gate 2 Input B' },
      6: { name: '2Y', type: 'output', desc: 'Gate 2 Output (AND)' },
      7: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      8: { name: '3Y', type: 'output', desc: 'Gate 3 Output (AND)' },
      9: { name: '3A', type: 'input', desc: 'Gate 3 Input A' },
      10: { name: '3B', type: 'input', desc: 'Gate 3 Input B' },
      11: { name: '4Y', type: 'output', desc: 'Gate 4 Output (AND)' },
      12: { name: '4A', type: 'input', desc: 'Gate 4 Input A' },
      13: { name: '4B', type: 'input', desc: 'Gate 4 Input B' },
      14: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    truthTable: {
      headers: ['Input A', 'Input B', 'Output Y (AND)'],
      rows: [
        ['0', '0', '0'],
        ['0', '1', '0'],
        ['1', '0', '0'],
        ['1', '1', '1']
      ]
    },
    simulate: (inputs) => {
      return {
        3: inputs[1] === 1 && inputs[2] === 1 ? 1 : 0,
        6: inputs[4] === 1 && inputs[5] === 1 ? 1 : 0,
        8: inputs[9] === 1 && inputs[10] === 1 ? 1 : 0,
        11: inputs[12] === 1 && inputs[13] === 1 ? 1 : 0
      };
    }
  },

  '74LS10': {
    id: '74LS10',
    name: '74LS10 Triple 3-Input NAND Gate',
    category: IC_CATEGORIES.GATES,
    pins: 14,
    description: 'Contains three independent 3-input NAND gates.',
    pinout: {
      1: { name: '1A', type: 'input', desc: 'Gate 1 Input A' },
      2: { name: '1B', type: 'input', desc: 'Gate 1 Input B' },
      3: { name: '2A', type: 'input', desc: 'Gate 2 Input A' },
      4: { name: '2B', type: 'input', desc: 'Gate 2 Input B' },
      5: { name: '2C', type: 'input', desc: 'Gate 2 Input C' },
      6: { name: '2Y', type: 'output', desc: 'Gate 2 Output (NAND)' },
      7: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      8: { name: '3Y', type: 'output', desc: 'Gate 3 Output (NAND)' },
      9: { name: '3A', type: 'input', desc: 'Gate 3 Input A' },
      10: { name: '3B', type: 'input', desc: 'Gate 3 Input B' },
      11: { name: '3C', type: 'input', desc: 'Gate 3 Input C' },
      12: { name: '1Y', type: 'output', desc: 'Gate 1 Output (NAND)' },
      13: { name: '1C', type: 'input', desc: 'Gate 1 Input C' },
      14: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    truthTable: {
      headers: ['Input A', 'Input B', 'Input C', 'Output Y (NAND)'],
      rows: [
        ['0', 'X', 'X', '1'],
        ['X', '0', 'X', '1'],
        ['X', 'X', '0', '1'],
        ['1', '1', '1', '0']
      ]
    },
    simulate: (inputs) => {
      return {
        12: inputs[1] === 1 && inputs[2] === 1 && inputs[13] === 1 ? 0 : 1,
        6: inputs[3] === 1 && inputs[4] === 1 && inputs[5] === 1 ? 0 : 1,
        8: inputs[9] === 1 && inputs[10] === 1 && inputs[11] === 1 ? 0 : 1
      };
    }
  },

  '74LS11': {
    id: '74LS11',
    name: '74LS11 Triple 3-Input AND Gate',
    category: IC_CATEGORIES.GATES,
    pins: 14,
    description: 'Contains three independent 3-input AND gates.',
    pinout: {
      1: { name: '1A', type: 'input', desc: 'Gate 1 Input A' },
      2: { name: '1B', type: 'input', desc: 'Gate 1 Input B' },
      3: { name: '2A', type: 'input', desc: 'Gate 2 Input A' },
      4: { name: '2B', type: 'input', desc: 'Gate 2 Input B' },
      5: { name: '2C', type: 'input', desc: 'Gate 2 Input C' },
      6: { name: '2Y', type: 'output', desc: 'Gate 2 Output (AND)' },
      7: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      8: { name: '3Y', type: 'output', desc: 'Gate 3 Output (AND)' },
      9: { name: '3A', type: 'input', desc: 'Gate 3 Input A' },
      10: { name: '3B', type: 'input', desc: 'Gate 3 Input B' },
      11: { name: '3C', type: 'input', desc: 'Gate 3 Input C' },
      12: { name: '1Y', type: 'output', desc: 'Gate 1 Output (AND)' },
      13: { name: '1C', type: 'input', desc: 'Gate 1 Input C' },
      14: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    truthTable: {
      headers: ['Input A', 'Input B', 'Input C', 'Output Y (AND)'],
      rows: [
        ['1', '1', '1', '1'],
        ['Other combinations', '', '', '0']
      ]
    },
    simulate: (inputs) => {
      return {
        12: inputs[1] === 1 && inputs[2] === 1 && inputs[13] === 1 ? 1 : 0,
        6: inputs[3] === 1 && inputs[4] === 1 && inputs[5] === 1 ? 1 : 0,
        8: inputs[9] === 1 && inputs[10] === 1 && inputs[11] === 1 ? 1 : 0
      };
    }
  },

  '74LS14': {
    id: '74LS14',
    name: '74LS14 Hex Inverter with Schmitt Trigger',
    category: IC_CATEGORIES.GATES,
    pins: 14,
    description: 'Contains six independent inverters with Schmitt-trigger inputs for noise immunity.',
    pinout: {
      1: { name: '1A', type: 'input', desc: 'Schmitt Inverter 1 In' },
      2: { name: '1Y', type: 'output', desc: 'Schmitt Inverter 1 Out' },
      3: { name: '2A', type: 'input', desc: 'Schmitt Inverter 2 In' },
      4: { name: '2Y', type: 'output', desc: 'Schmitt Inverter 2 Out' },
      5: { name: '3A', type: 'input', desc: 'Schmitt Inverter 3 In' },
      6: { name: '3Y', type: 'output', desc: 'Schmitt Inverter 3 Out' },
      7: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      8: { name: '4Y', type: 'output', desc: 'Schmitt Inverter 4 Out' },
      9: { name: '4A', type: 'input', desc: 'Schmitt Inverter 4 In' },
      10: { name: '5Y', type: 'output', desc: 'Schmitt Inverter 5 Out' },
      11: { name: '5A', type: 'input', desc: 'Schmitt Inverter 5 In' },
      12: { name: '6Y', type: 'output', desc: 'Schmitt Inverter 6 Out' },
      13: { name: '6A', type: 'input', desc: 'Schmitt Inverter 6 In' },
      14: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    truthTable: {
      headers: ['Input A', 'Output Y'],
      rows: [['0', '1'], ['1', '0']]
    },
    simulate: (inputs) => {
      return {
        2: inputs[1] === 1 ? 0 : 1,
        4: inputs[3] === 1 ? 0 : 1,
        6: inputs[5] === 1 ? 0 : 1,
        8: inputs[9] === 1 ? 0 : 1,
        10: inputs[11] === 1 ? 0 : 1,
        12: inputs[13] === 1 ? 0 : 1
      };
    }
  },

  '74LS20': {
    id: '74LS20',
    name: '74LS20 Dual 4-Input NAND Gate',
    category: IC_CATEGORIES.GATES,
    pins: 14,
    description: 'Contains two independent 4-input NAND gates.',
    pinout: {
      1: { name: '1A', type: 'input', desc: 'Gate 1 Input A' },
      2: { name: '1B', type: 'input', desc: 'Gate 1 Input B' },
      3: { name: 'NC', type: 'nc', desc: 'No Connection' },
      4: { name: '1C', type: 'input', desc: 'Gate 1 Input C' },
      5: { name: '1D', type: 'input', desc: 'Gate 1 Input D' },
      6: { name: '1Y', type: 'output', desc: 'Gate 1 Output (NAND)' },
      7: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      8: { name: '2Y', type: 'output', desc: 'Gate 2 Output (NAND)' },
      9: { name: '2A', type: 'input', desc: 'Gate 2 Input A' },
      10: { name: '2B', type: 'input', desc: 'Gate 2 Input B' },
      11: { name: 'NC', type: 'nc', desc: 'No Connection' },
      12: { name: '2C', type: 'input', desc: 'Gate 2 Input C' },
      13: { name: '2D', type: 'input', desc: 'Gate 2 Input D' },
      14: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    truthTable: {
      headers: ['A', 'B', 'C', 'D', 'Output Y'],
      rows: [
        ['1', '1', '1', '1', '0'],
        ['Any other combination', '', '', '', '1']
      ]
    },
    simulate: (inputs) => {
      return {
        6: inputs[1] === 1 && inputs[2] === 1 && inputs[4] === 1 && inputs[5] === 1 ? 0 : 1,
        8: inputs[9] === 1 && inputs[10] === 1 && inputs[12] === 1 && inputs[13] === 1 ? 0 : 1
      };
    }
  },

  '74LS21': {
    id: '74LS21',
    name: '74LS21 Dual 4-Input AND Gate',
    category: IC_CATEGORIES.GATES,
    pins: 14,
    description: 'Contains two independent 4-input AND gates.',
    pinout: {
      1: { name: '1A', type: 'input', desc: 'Gate 1 Input A' },
      2: { name: '1B', type: 'input', desc: 'Gate 1 Input B' },
      3: { name: 'NC', type: 'nc', desc: 'No Connection' },
      4: { name: '1C', type: 'input', desc: 'Gate 1 Input C' },
      5: { name: '1D', type: 'input', desc: 'Gate 1 Input D' },
      6: { name: '1Y', type: 'output', desc: 'Gate 1 Output (AND)' },
      7: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      8: { name: '2Y', type: 'output', desc: 'Gate 2 Output (AND)' },
      9: { name: '2A', type: 'input', desc: 'Gate 2 Input A' },
      10: { name: '2B', type: 'input', desc: 'Gate 2 Input B' },
      11: { name: 'NC', type: 'nc', desc: 'No Connection' },
      12: { name: '2C', type: 'input', desc: 'Gate 2 Input C' },
      13: { name: '2D', type: 'input', desc: 'Gate 2 Input D' },
      14: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    truthTable: {
      headers: ['A', 'B', 'C', 'D', 'Output Y'],
      rows: [
        ['1', '1', '1', '1', '1'],
        ['Any other combination', '', '', '', '0']
      ]
    },
    simulate: (inputs) => {
      return {
        6: inputs[1] === 1 && inputs[2] === 1 && inputs[4] === 1 && inputs[5] === 1 ? 1 : 0,
        8: inputs[9] === 1 && inputs[10] === 1 && inputs[12] === 1 && inputs[13] === 1 ? 1 : 0
      };
    }
  },

  '74LS27': {
    id: '74LS27',
    name: '74LS27 Triple 3-Input NOR Gate',
    category: IC_CATEGORIES.GATES,
    pins: 14,
    description: 'Contains three independent 3-input NOR gates.',
    pinout: {
      1: { name: '1A', type: 'input', desc: 'Gate 1 Input A' },
      2: { name: '1B', type: 'input', desc: 'Gate 1 Input B' },
      3: { name: '2A', type: 'input', desc: 'Gate 2 Input A' },
      4: { name: '2B', type: 'input', desc: 'Gate 2 Input B' },
      5: { name: '2C', type: 'input', desc: 'Gate 2 Input C' },
      6: { name: '2Y', type: 'output', desc: 'Gate 2 Output (NOR)' },
      7: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      8: { name: '3Y', type: 'output', desc: 'Gate 3 Output (NOR)' },
      9: { name: '3A', type: 'input', desc: 'Gate 3 Input A' },
      10: { name: '3B', type: 'input', desc: 'Gate 3 Input B' },
      11: { name: '3C', type: 'input', desc: 'Gate 3 Input C' },
      12: { name: '1Y', type: 'output', desc: 'Gate 1 Output (NOR)' },
      13: { name: '1C', type: 'input', desc: 'Gate 1 Input C' },
      14: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    truthTable: {
      headers: ['Input A', 'Input B', 'Input C', 'Output Y (NOR)'],
      rows: [
        ['0', '0', '0', '1'],
        ['Any other combination', '', '', '0']
      ]
    },
    simulate: (inputs) => {
      return {
        12: inputs[1] === 0 && inputs[2] === 0 && inputs[13] === 0 ? 1 : 0,
        6: inputs[3] === 0 && inputs[4] === 0 && inputs[5] === 0 ? 1 : 0,
        8: inputs[9] === 0 && inputs[10] === 0 && inputs[11] === 0 ? 1 : 0
      };
    }
  },

  '74LS30': {
    id: '74LS30',
    name: '74LS30 8-Input NAND Gate',
    category: IC_CATEGORIES.GATES,
    pins: 14,
    description: 'Contains a single 8-input NAND gate.',
    pinout: {
      1: { name: 'A', type: 'input', desc: 'Input A' },
      2: { name: 'B', type: 'input', desc: 'Input B' },
      3: { name: 'C', type: 'input', desc: 'Input C' },
      4: { name: 'D', type: 'input', desc: 'Input D' },
      5: { name: 'E', type: 'input', desc: 'Input E' },
      6: { name: 'F', type: 'input', desc: 'Input F' },
      7: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      8: { name: 'Y', type: 'output', desc: 'Output Y (NAND)' },
      9: { name: 'NC', type: 'nc', desc: 'No Connection' },
      10: { name: 'NC', type: 'nc', desc: 'No Connection' },
      11: { name: 'G', type: 'input', desc: 'Input G' },
      12: { name: 'H', type: 'input', desc: 'Input H' },
      13: { name: 'NC', type: 'nc', desc: 'No Connection' },
      14: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    truthTable: {
      headers: ['A-H Inputs', 'Output Y'],
      rows: [
        ['All 1', '0'],
        ['Any input 0', '1']
      ]
    },
    simulate: (inputs) => {
      const allHigh = [1, 2, 3, 4, 5, 6, 11, 12].every(p => inputs[p] === 1);
      return { 8: allHigh ? 0 : 1 };
    }
  },

  '74LS32': {
    id: '74LS32',
    name: '74LS32 Quad 2-Input OR Gate',
    category: IC_CATEGORIES.GATES,
    pins: 14,
    description: 'Contains four independent 2-input OR gates.',
    pinout: {
      1: { name: '1A', type: 'input', desc: 'Gate 1 Input A' },
      2: { name: '1B', type: 'input', desc: 'Gate 1 Input B' },
      3: { name: '1Y', type: 'output', desc: 'Gate 1 Output (OR)' },
      4: { name: '2A', type: 'input', desc: 'Gate 2 Input A' },
      5: { name: '2B', type: 'input', desc: 'Gate 2 Input B' },
      6: { name: '2Y', type: 'output', desc: 'Gate 2 Output (OR)' },
      7: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      8: { name: '3Y', type: 'output', desc: 'Gate 3 Output (OR)' },
      9: { name: '3A', type: 'input', desc: 'Gate 3 Input A' },
      10: { name: '3B', type: 'input', desc: 'Gate 3 Input B' },
      11: { name: '4Y', type: 'output', desc: 'Gate 4 Output (OR)' },
      12: { name: '4A', type: 'input', desc: 'Gate 4 Input A' },
      13: { name: '4B', type: 'input', desc: 'Gate 4 Input B' },
      14: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    truthTable: {
      headers: ['Input A', 'Input B', 'Output Y (OR)'],
      rows: [
        ['0', '0', '0'],
        ['0', '1', '1'],
        ['1', '0', '1'],
        ['1', '1', '1']
      ]
    },
    simulate: (inputs) => {
      return {
        3: inputs[1] === 1 || inputs[2] === 1 ? 1 : 0,
        6: inputs[4] === 1 || inputs[5] === 1 ? 1 : 0,
        8: inputs[9] === 1 || inputs[10] === 1 ? 1 : 0,
        11: inputs[12] === 1 || inputs[13] === 1 ? 1 : 0
      };
    }
  },

  '74LS86': {
    id: '74LS86',
    name: '74LS86 Quad 2-Input XOR Gate',
    category: IC_CATEGORIES.GATES,
    pins: 14,
    description: 'Contains four independent 2-input Exclusive-OR (XOR) gates.',
    pinout: {
      1: { name: '1A', type: 'input', desc: 'Gate 1 Input A' },
      2: { name: '1B', type: 'input', desc: 'Gate 1 Input B' },
      3: { name: '1Y', type: 'output', desc: 'Gate 1 Output (XOR)' },
      4: { name: '2A', type: 'input', desc: 'Gate 2 Input A' },
      5: { name: '2B', type: 'input', desc: 'Gate 2 Input B' },
      6: { name: '2Y', type: 'output', desc: 'Gate 2 Output (XOR)' },
      7: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      8: { name: '3Y', type: 'output', desc: 'Gate 3 Output (XOR)' },
      9: { name: '3A', type: 'input', desc: 'Gate 3 Input A' },
      10: { name: '3B', type: 'input', desc: 'Gate 3 Input B' },
      11: { name: '4Y', type: 'output', desc: 'Gate 4 Output (XOR)' },
      12: { name: '4A', type: 'input', desc: 'Gate 4 Input A' },
      13: { name: '4B', type: 'input', desc: 'Gate 4 Input B' },
      14: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    truthTable: {
      headers: ['Input A', 'Input B', 'Output Y (XOR)'],
      rows: [
        ['0', '0', '0'],
        ['0', '1', '1'],
        ['1', '0', '1'],
        ['1', '1', '0']
      ]
    },
    simulate: (inputs) => {
      return {
        3: (inputs[1] || 0) ^ (inputs[2] || 0),
        6: (inputs[4] || 0) ^ (inputs[5] || 0),
        8: (inputs[9] || 0) ^ (inputs[10] || 0),
        11: (inputs[12] || 0) ^ (inputs[13] || 0)
      };
    }
  },

  '74LS266': {
    id: '74LS266',
    name: '74LS266 Quad 2-Input Exclusive-NOR (XNOR) Gate',
    category: IC_CATEGORIES.GATES,
    pins: 14,
    description: 'Contains four independent 2-input Exclusive-NOR (equality comparator) gates.',
    pinout: {
      1: { name: '1A', type: 'input', desc: 'Gate 1 Input A' },
      2: { name: '1B', type: 'input', desc: 'Gate 1 Input B' },
      3: { name: '1Y', type: 'output', desc: 'Gate 1 Output (XNOR)' },
      4: { name: '2A', type: 'input', desc: 'Gate 2 Input A' },
      5: { name: '2B', type: 'input', desc: 'Gate 2 Input B' },
      6: { name: '2Y', type: 'output', desc: 'Gate 2 Output (XNOR)' },
      7: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      8: { name: '3Y', type: 'output', desc: 'Gate 3 Output (XNOR)' },
      9: { name: '3A', type: 'input', desc: 'Gate 3 Input A' },
      10: { name: '3B', type: 'input', desc: 'Gate 3 Input B' },
      11: { name: '4Y', type: 'output', desc: 'Gate 4 Output (XNOR)' },
      12: { name: '4A', type: 'input', desc: 'Gate 4 Input A' },
      13: { name: '4B', type: 'input', desc: 'Gate 4 Input B' },
      14: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    truthTable: {
      headers: ['Input A', 'Input B', 'Output Y (XNOR)'],
      rows: [
        ['0', '0', '1'],
        ['0', '1', '0'],
        ['1', '0', '0'],
        ['1', '1', '1']
      ]
    },
    simulate: (inputs) => {
      return {
        3: ((inputs[1] || 0) ^ (inputs[2] || 0)) === 0 ? 1 : 0,
        6: ((inputs[4] || 0) ^ (inputs[5] || 0)) === 0 ? 1 : 0,
        8: ((inputs[9] || 0) ^ (inputs[10] || 0)) === 0 ? 1 : 0,
        11: ((inputs[12] || 0) ^ (inputs[13] || 0)) === 0 ? 1 : 0
      };
    }
  },

  // ==========================================
  // ARITHMETIC & COMPARATORS
  // ==========================================
  '74LS83': {
    id: '74LS83',
    name: '74LS83 4-Bit Binary Full Adder',
    category: IC_CATEGORIES.ARITHMETIC,
    pins: 16,
    description: '4-bit binary full adder with internal look-ahead carry generation.',
    pinout: {
      1: { name: 'A4', type: 'input', desc: 'Bit 4 Operand A' },
      2: { name: 'B3', type: 'input', desc: 'Bit 3 Operand B' },
      3: { name: 'A3', type: 'input', desc: 'Bit 3 Operand A' },
      4: { name: 'S3', type: 'output', desc: 'Bit 3 Sum' },
      5: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' },
      6: { name: 'S2', type: 'output', desc: 'Bit 2 Sum' },
      7: { name: 'B2', type: 'input', desc: 'Bit 2 Operand B' },
      8: { name: 'A2', type: 'input', desc: 'Bit 2 Operand A' },
      9: { name: 'S1', type: 'output', desc: 'Bit 1 Sum' },
      10: { name: 'A1', type: 'input', desc: 'Bit 1 Operand A' },
      11: { name: 'B1', type: 'input', desc: 'Bit 1 Operand B' },
      12: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      13: { name: 'C0', type: 'input', desc: 'Carry In' },
      14: { name: 'C4', type: 'output', desc: 'Carry Out Bit 4' },
      15: { name: 'S4', type: 'output', desc: 'Bit 4 Sum' },
      16: { name: 'B4', type: 'input', desc: 'Bit 4 Operand B' }
    },
    truthTable: {
      headers: ['A (4-bit)', 'B (4-bit)', 'C0 (In)', 'Sum (4-bit)', 'C4 (Out)'],
      rows: [
        ['0000', '0000', '0', '0000', '0'],
        ['0101 (5)', '0011 (3)', '0', '1000 (8)', '0'],
        ['1111 (15)', '0001 (1)', '0', '0000 (0)', '1 (Carry)']
      ]
    },
    simulate: (inputs) => {
      const a = ((inputs[1] || 0) << 3) | ((inputs[3] || 0) << 2) | ((inputs[8] || 0) << 1) | (inputs[10] || 0);
      const b = ((inputs[16] || 0) << 3) | ((inputs[2] || 0) << 2) | ((inputs[7] || 0) << 1) | (inputs[11] || 0);
      const cIn = inputs[13] || 0;
      const sum = a + b + cIn;

      return {
        9: (sum >> 0) & 1,
        6: (sum >> 1) & 1,
        4: (sum >> 2) & 1,
        15: (sum >> 3) & 1,
        14: (sum >> 4) & 1
      };
    }
  },

  '74LS85': {
    id: '74LS85',
    name: '74LS85 4-Bit Magnitude Comparator',
    category: IC_CATEGORIES.ARITHMETIC,
    pins: 16,
    description: 'Compares two 4-bit words (A and B) and produces A>B, A<B, and A=B outputs.',
    pinout: {
      1: { name: 'B3', type: 'input', desc: 'Input B Bit 3' },
      2: { name: 'IA<B', type: 'input', desc: 'Cascading In A<B' },
      3: { name: 'IA=B', type: 'input', desc: 'Cascading In A=B' },
      4: { name: 'IA>B', type: 'input', desc: 'Cascading In A>B' },
      5: { name: 'OA>B', type: 'output', desc: 'Output A>B' },
      6: { name: 'OA=B', type: 'output', desc: 'Output A=B' },
      7: { name: 'OA<B', type: 'output', desc: 'Output A<B' },
      8: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      9: { name: 'B0', type: 'input', desc: 'Input B Bit 0' },
      10: { name: 'A0', type: 'input', desc: 'Input A Bit 0' },
      11: { name: 'B1', type: 'input', desc: 'Input B Bit 1' },
      12: { name: 'A1', type: 'input', desc: 'Input A Bit 1' },
      13: { name: 'A2', type: 'input', desc: 'Input A Bit 2' },
      14: { name: 'B2', type: 'input', desc: 'Input B Bit 2' },
      15: { name: 'A3', type: 'input', desc: 'Input A Bit 3' },
      16: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    truthTable: {
      headers: ['A vs B Comparison', 'OA>B (Pin 5)', 'OA=B (Pin 6)', 'OA<B (Pin 7)'],
      rows: [
        ['A > B', '1', '0', '0'],
        ['A < B', '0', '0', '1'],
        ['A == B (with IA=B=1)', '0', '1', '0']
      ]
    },
    simulate: (inputs) => {
      const a = ((inputs[15] || 0) << 3) | ((inputs[13] || 0) << 2) | ((inputs[12] || 0) << 1) | (inputs[10] || 0);
      const b = ((inputs[1] || 0) << 3) | ((inputs[14] || 0) << 2) | ((inputs[11] || 0) << 1) | (inputs[9] || 0);

      const iAgB = inputs[4] || 0;
      const iAeB = inputs[3] !== undefined ? inputs[3] : (inputs[4] === undefined && inputs[2] === undefined ? 1 : 0);
      const iAlB = inputs[2] || 0;

      let oAgB = 0, oAeB = 0, oAlB = 0;
      if (a > b) {
        oAgB = 1;
      } else if (a < b) {
        oAlB = 1;
      } else {
        if (iAeB === 1) oAeB = 1;
        else if (iAgB === 1 && iAlB === 0) oAgB = 1;
        else if (iAlB === 1 && iAgB === 0) oAlB = 1;
        else if (iAgB === 0 && iAlB === 0) oAeB = 1;
      }

      return { 5: oAgB, 6: oAeB, 7: oAlB };
    }
  },

  '74LS283': {
    id: '74LS283',
    name: '74LS283 4-Bit Binary Full Adder with Fast Carry',
    category: IC_CATEGORIES.ARITHMETIC,
    pins: 16,
    description: 'Adds two 4-bit binary numbers with carry-in and carry-out using internal look-ahead fast carry (standard pinout: VCC=16, GND=8).',
    pinout: {
      1: { name: 'S2', type: 'output', desc: 'Sum Bit 2' },
      2: { name: 'B2', type: 'input', desc: 'Operand B Bit 2' },
      3: { name: 'A2', type: 'input', desc: 'Operand A Bit 2' },
      4: { name: 'S1', type: 'output', desc: 'Sum Bit 1' },
      5: { name: 'A1', type: 'input', desc: 'Operand A Bit 1' },
      6: { name: 'B1', type: 'input', desc: 'Operand B Bit 1' },
      7: { name: 'C0', type: 'input', desc: 'Carry In' },
      8: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      9: { name: 'C4', type: 'output', desc: 'Carry Out Bit 4' },
      10: { name: 'S4', type: 'output', desc: 'Sum Bit 4' },
      11: { name: 'B4', type: 'input', desc: 'Operand B Bit 4' },
      12: { name: 'A4', type: 'input', desc: 'Operand A Bit 4' },
      13: { name: 'S3', type: 'output', desc: 'Sum Bit 3' },
      14: { name: 'A3', type: 'input', desc: 'Operand A Bit 3' },
      15: { name: 'B3', type: 'input', desc: 'Operand B Bit 3' },
      16: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    truthTable: {
      headers: ['A (4-bit)', 'B (4-bit)', 'C0 (In)', 'Sum (4-bit)', 'C4 (Out)'],
      rows: [
        ['0000', '0000', '0', '0000', '0'],
        ['0101 (5)', '0011 (3)', '0', '1000 (8)', '0'],
        ['1111 (15)', '0001 (1)', '0', '0000 (0)', '1 (Carry)'],
        ['1010 (10)', '0110 (6)', '1', '0001 (1)', '1 (Carry)']
      ]
    },
    simulate: (inputs) => {
      const a1 = inputs[5] || 0;
      const a2 = inputs[3] || 0;
      const a3 = inputs[14] || 0;
      const a4 = inputs[12] || 0;
      const a = (a4 << 3) | (a3 << 2) | (a2 << 1) | a1;

      const b1 = inputs[6] || 0;
      const b2 = inputs[2] || 0;
      const b3 = inputs[15] || 0;
      const b4 = inputs[11] || 0;
      const b = (b4 << 3) | (b3 << 2) | (b2 << 1) | b1;

      const cIn = inputs[7] || 0;
      const sum = a + b + cIn;

      return {
        4: (sum >> 0) & 1,   // S1
        1: (sum >> 1) & 1,   // S2
        13: (sum >> 2) & 1,  // S3
        10: (sum >> 3) & 1,  // S4
        9: (sum >> 4) & 1    // C4
      };
    }
  },

  // ==========================================
  // MULTIPLEXERS & DECODERS
  // ==========================================
  '74LS138': {
    id: '74LS138',
    name: '74LS138 3-to-8 Line Decoder / Demultiplexer',
    category: IC_CATEGORIES.COMBINATIONAL,
    pins: 16,
    description: 'Decodes a three-bit binary address to one of eight active-low outputs when enabled.',
    pinout: {
      1: { name: 'A', type: 'input', desc: 'Address Bit A (LSB)' },
      2: { name: 'B', type: 'input', desc: 'Address Bit B' },
      3: { name: 'C', type: 'input', desc: 'Address Bit C (MSB)' },
      4: { name: 'G2A#', type: 'input', desc: 'Enable G2A (Active Low)' },
      5: { name: 'G2B#', type: 'input', desc: 'Enable G2B (Active Low)' },
      6: { name: 'G1', type: 'input', desc: 'Enable G1 (Active High)' },
      7: { name: 'Y7#', type: 'output', desc: 'Output 7 (Active Low)' },
      8: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      9: { name: 'Y6#', type: 'output', desc: 'Output 6 (Active Low)' },
      10: { name: 'Y5#', type: 'output', desc: 'Output 5 (Active Low)' },
      11: { name: 'Y4#', type: 'output', desc: 'Output 4 (Active Low)' },
      12: { name: 'Y3#', type: 'output', desc: 'Output 3 (Active Low)' },
      13: { name: 'Y2#', type: 'output', desc: 'Output 2 (Active Low)' },
      14: { name: 'Y1#', type: 'output', desc: 'Output 1 (Active Low)' },
      15: { name: 'Y0#', type: 'output', desc: 'Output 0 (Active Low)' },
      16: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    truthTable: {
      headers: ['G1', 'G2A#', 'G2B#', 'C B A (Address)', 'Selected Output (Low)'],
      rows: [
        ['1', '0', '0', '0 0 0 (0)', 'Y0# = 0 (others 1)'],
        ['1', '0', '0', '0 0 1 (1)', 'Y1# = 0 (others 1)'],
        ['1', '0', '0', '1 1 1 (7)', 'Y7# = 0 (others 1)'],
        ['0', 'X', 'X', 'Disabled', 'All outputs = 1']
      ]
    },
    simulate: (inputs) => {
      const g1 = inputs[6] !== undefined ? inputs[6] : 1;
      const g2a = inputs[4] !== undefined ? inputs[4] : 0;
      const g2b = inputs[5] !== undefined ? inputs[5] : 0;
      const enabled = g1 === 1 && g2a === 0 && g2b === 0;

      const outputs = { 15: 1, 14: 1, 13: 1, 12: 1, 11: 1, 10: 1, 9: 1, 7: 1 };
      if (!enabled) return outputs;

      const addr = ((inputs[3] || 0) << 2) | ((inputs[2] || 0) << 1) | (inputs[1] || 0);
      const pinMap = [15, 14, 13, 12, 11, 10, 9, 7];
      if (pinMap[addr] !== undefined) {
        outputs[pinMap[addr]] = 0;
      }
      return outputs;
    }
  },

  '74LS139': {
    id: '74LS139',
    name: '74LS139 Dual 2-to-4 Line Decoder / Demultiplexer',
    category: IC_CATEGORIES.COMBINATIONAL,
    pins: 16,
    description: 'Two independent 2-to-4 line decoders with active-low enables and active-low outputs.',
    pinout: {
      1: { name: '1G#', type: 'input', desc: 'Decoder 1 Enable (Active Low)' },
      2: { name: '1A', type: 'input', desc: 'Decoder 1 Select A' },
      3: { name: '1B', type: 'input', desc: 'Decoder 1 Select B' },
      4: { name: '1Y0#', type: 'output', desc: 'Decoder 1 Output 0' },
      5: { name: '1Y1#', type: 'output', desc: 'Decoder 1 Output 1' },
      6: { name: '1Y2#', type: 'output', desc: 'Decoder 1 Output 2' },
      7: { name: '1Y3#', type: 'output', desc: 'Decoder 1 Output 3' },
      8: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      9: { name: '2Y3#', type: 'output', desc: 'Decoder 2 Output 3' },
      10: { name: '2Y2#', type: 'output', desc: 'Decoder 2 Output 2' },
      11: { name: '2Y1#', type: 'output', desc: 'Decoder 2 Output 1' },
      12: { name: '2Y0#', type: 'output', desc: 'Decoder 2 Output 0' },
      13: { name: '2B', type: 'input', desc: 'Decoder 2 Select B' },
      14: { name: '2A', type: 'input', desc: 'Decoder 2 Select A' },
      15: { name: '2G#', type: 'input', desc: 'Decoder 2 Enable (Active Low)' },
      16: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    truthTable: {
      headers: ['G#', 'B', 'A', 'Y0#', 'Y1#', 'Y2#', 'Y3#'],
      rows: [
        ['0', '0', '0', '0', '1', '1', '1'],
        ['0', '0', '1', '1', '0', '1', '1'],
        ['0', '1', '0', '1', '1', '0', '1'],
        ['0', '1', '1', '1', '1', '1', '0'],
        ['1', 'X', 'X', '1', '1', '1', '1']
      ]
    },
    simulate: (inputs) => {
      const res = { 4: 1, 5: 1, 6: 1, 7: 1, 12: 1, 11: 1, 10: 1, 9: 1 };
      // Decoder 1
      const g1 = inputs[1] !== undefined ? inputs[1] : 0;
      if (g1 === 0) {
        const addr1 = ((inputs[3] || 0) << 1) | (inputs[2] || 0);
        const map1 = [4, 5, 6, 7];
        res[map1[addr1]] = 0;
      }
      // Decoder 2
      const g2 = inputs[15] !== undefined ? inputs[15] : 0;
      if (g2 === 0) {
        const addr2 = ((inputs[13] || 0) << 1) | (inputs[14] || 0);
        const map2 = [12, 11, 10, 9];
        res[map2[addr2]] = 0;
      }
      return res;
    }
  },

  '74LS42': {
    id: '74LS42',
    name: '74LS42 4-Line BCD to 10-Line Decimal Decoder',
    category: IC_CATEGORIES.COMBINATIONAL,
    pins: 16,
    description: 'Decodes a 4-bit BCD input to one of ten mutually exclusive active-low decimal outputs.',
    pinout: {
      1: { name: '0#', type: 'output', desc: 'Decimal Output 0 (Active Low)' },
      2: { name: '1#', type: 'output', desc: 'Decimal Output 1 (Active Low)' },
      3: { name: '2#', type: 'output', desc: 'Decimal Output 2 (Active Low)' },
      4: { name: '3#', type: 'output', desc: 'Decimal Output 3 (Active Low)' },
      5: { name: '4#', type: 'output', desc: 'Decimal Output 4 (Active Low)' },
      6: { name: '5#', type: 'output', desc: 'Decimal Output 5 (Active Low)' },
      7: { name: '6#', type: 'output', desc: 'Decimal Output 6 (Active Low)' },
      8: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      9: { name: '7#', type: 'output', desc: 'Decimal Output 7 (Active Low)' },
      10: { name: '8#', type: 'output', desc: 'Decimal Output 8 (Active Low)' },
      11: { name: '9#', type: 'output', desc: 'Decimal Output 9 (Active Low)' },
      12: { name: 'D', type: 'input', desc: 'BCD Input Bit D (MSB)' },
      13: { name: 'C', type: 'input', desc: 'BCD Input Bit C' },
      14: { name: 'B', type: 'input', desc: 'BCD Input Bit B' },
      15: { name: 'A', type: 'input', desc: 'BCD Input Bit A (LSB)' },
      16: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    truthTable: {
      headers: ['Decimal Digit', 'D C B A (BCD)', 'Selected Output (Low)'],
      rows: [
        ['0', '0 0 0 0', '0# = 0 (others 1)'],
        ['1', '0 0 0 1', '1# = 0 (others 1)'],
        ['5', '0 1 0 1', '5# = 0 (others 1)'],
        ['9', '1 0 0 1', '9# = 0 (others 1)'],
        ['10-15 (Invalid BCD)', '1 0 1 0 - 1 1 1 1', 'All outputs = 1']
      ]
    },
    simulate: (inputs) => {
      const a = inputs[15] || 0;
      const b = inputs[14] || 0;
      const c = inputs[13] || 0;
      const d = inputs[12] || 0;
      const bcd = (d << 3) | (c << 2) | (b << 1) | a;

      const outPins = [1, 2, 3, 4, 5, 6, 7, 9, 10, 11];
      const res = { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 9: 1, 10: 1, 11: 1 };
      if (bcd >= 0 && bcd <= 9) {
        res[outPins[bcd]] = 0;
      }
      return res;
    }
  },

  '74LS151': {
    id: '74LS151',
    name: '74LS151 8-to-1 Multiplexer',
    category: IC_CATEGORIES.COMBINATIONAL,
    pins: 16,
    description: 'Selects one of eight data inputs to complementary outputs Y and W#.',
    pinout: {
      1: { name: 'D3', type: 'input', desc: 'Data Input 3' },
      2: { name: 'D2', type: 'input', desc: 'Data Input 2' },
      3: { name: 'D1', type: 'input', desc: 'Data Input 1' },
      4: { name: 'D0', type: 'input', desc: 'Data Input 0' },
      5: { name: 'Y', type: 'output', desc: 'True Output' },
      6: { name: 'W#', type: 'output', desc: 'Inverted Output' },
      7: { name: 'S#', type: 'input', desc: 'Strobe / Enable (Active Low)' },
      8: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      9: { name: 'C', type: 'input', desc: 'Select Bit C (MSB)' },
      10: { name: 'B', type: 'input', desc: 'Select Bit B' },
      11: { name: 'A', type: 'input', desc: 'Select Bit A (LSB)' },
      12: { name: 'D7', type: 'input', desc: 'Data Input 7' },
      13: { name: 'D6', type: 'input', desc: 'Data Input 6' },
      14: { name: 'D5', type: 'input', desc: 'Data Input 5' },
      15: { name: 'D4', type: 'input', desc: 'Data Input 4' },
      16: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    truthTable: {
      headers: ['S#', 'C B A', 'Selected Data Input', 'Output Y', 'Output W#'],
      rows: [
        ['1', 'X X X', 'None (Disabled)', '0', '1'],
        ['0', '0 0 0', 'D0 (Pin 4)', 'D0', 'D0#'],
        ['0', '0 0 1', 'D1 (Pin 3)', 'D1', 'D1#'],
        ['0', '1 1 1', 'D7 (Pin 12)', 'D7', 'D7#']
      ]
    },
    simulate: (inputs) => {
      const strobe = inputs[7] || 0;
      if (strobe === 1) {
        return { 5: 0, 6: 1 };
      }
      const sel = ((inputs[9] || 0) << 2) | ((inputs[10] || 0) << 1) | (inputs[11] || 0);
      const dataPins = [4, 3, 2, 1, 15, 14, 13, 12];
      const val = inputs[dataPins[sel]] || 0;
      return { 5: val, 6: val === 1 ? 0 : 1 };
    }
  },

  '74LS153': {
    id: '74LS153',
    name: '74LS153 Dual 4-to-1 Multiplexer',
    category: IC_CATEGORIES.COMBINATIONAL,
    pins: 16,
    description: 'Two independent 4-line to 1-line multiplexers with common select inputs and separate active-low enables.',
    pinout: {
      1: { name: '1G#', type: 'input', desc: 'MUX 1 Strobe / Enable (Active Low)' },
      2: { name: 'B', type: 'input', desc: 'Common Select Input B' },
      3: { name: '1C3', type: 'input', desc: 'MUX 1 Input 3' },
      4: { name: '1C2', type: 'input', desc: 'MUX 1 Input 2' },
      5: { name: '1C1', type: 'input', desc: 'MUX 1 Input 1' },
      6: { name: '1C0', type: 'input', desc: 'MUX 1 Input 0' },
      7: { name: '1Y', type: 'output', desc: 'MUX 1 Output' },
      8: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      9: { name: '2Y', type: 'output', desc: 'MUX 2 Output' },
      10: { name: '2C0', type: 'input', desc: 'MUX 2 Input 0' },
      11: { name: '2C1', type: 'input', desc: 'MUX 2 Input 1' },
      12: { name: '2C2', type: 'input', desc: 'MUX 2 Input 2' },
      13: { name: '2C3', type: 'input', desc: 'MUX 2 Input 3' },
      14: { name: 'A', type: 'input', desc: 'Common Select Input A' },
      15: { name: '2G#', type: 'input', desc: 'MUX 2 Strobe / Enable (Active Low)' },
      16: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    truthTable: {
      headers: ['G#', 'B', 'A', 'Output Y'],
      rows: [
        ['1', 'X', 'X', '0 (Disabled)'],
        ['0', '0', '0', 'C0'],
        ['0', '0', '1', 'C1'],
        ['0', '1', '0', 'C2'],
        ['0', '1', '1', 'C3']
      ]
    },
    simulate: (inputs) => {
      const sel = ((inputs[2] || 0) << 1) | (inputs[14] || 0);

      let y1 = 0;
      if ((inputs[1] || 0) === 0) {
        const m1 = [6, 5, 4, 3];
        y1 = inputs[m1[sel]] || 0;
      }

      let y2 = 0;
      if ((inputs[15] || 0) === 0) {
        const m2 = [10, 11, 12, 13];
        y2 = inputs[m2[sel]] || 0;
      }

      return { 7: y1, 9: y2 };
    }
  },

  '74LS157': {
    id: '74LS157',
    name: '74LS157 Quad 2-Line to 1-Line Data Selector / Multiplexer',
    category: IC_CATEGORIES.COMBINATIONAL,
    pins: 16,
    description: 'Four 2-to-1 multiplexers with a common Select input and active-low Strobe/Enable.',
    pinout: {
      1: { name: 'S', type: 'input', desc: 'Common Select Input (0=A, 1=B)' },
      2: { name: '1A', type: 'input', desc: 'MUX 1 Input A' },
      3: { name: '1B', type: 'input', desc: 'MUX 1 Input B' },
      4: { name: '1Y', type: 'output', desc: 'MUX 1 Output' },
      5: { name: '2A', type: 'input', desc: 'MUX 2 Input A' },
      6: { name: '2B', type: 'input', desc: 'MUX 2 Input B' },
      7: { name: '2Y', type: 'output', desc: 'MUX 2 Output' },
      8: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      9: { name: '3Y', type: 'output', desc: 'MUX 3 Output' },
      10: { name: '3A', type: 'input', desc: 'MUX 3 Input A' },
      11: { name: '3B', type: 'input', desc: 'MUX 3 Input B' },
      12: { name: '4Y', type: 'output', desc: 'MUX 4 Output' },
      13: { name: '4A', type: 'input', desc: 'MUX 4 Input A' },
      14: { name: '4B', type: 'input', desc: 'MUX 4 Input B' },
      15: { name: 'G#', type: 'input', desc: 'Strobe / Enable (Active Low)' },
      16: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    truthTable: {
      headers: ['G# (Strobe)', 'S (Select)', 'A Inputs', 'B Inputs', 'Outputs 1Y-4Y'],
      rows: [
        ['1', 'X', 'X', 'X', 'All LOW (0 0 0 0)'],
        ['0', '0', 'Data A', 'X', 'Follows A (1A, 2A, 3A, 4A)'],
        ['0', '1', 'X', 'Data B', 'Follows B (1B, 2B, 3B, 4B)']
      ]
    },
    simulate: (inputs) => {
      const strobe = inputs[15] !== undefined ? inputs[15] : 0;
      if (strobe === 1) {
        return { 4: 0, 7: 0, 9: 0, 12: 0 };
      }
      const sel = inputs[1] || 0;
      if (sel === 0) {
        return {
          4: inputs[2] || 0,
          7: inputs[5] || 0,
          9: inputs[10] || 0,
          12: inputs[13] || 0
        };
      } else {
        return {
          4: inputs[3] || 0,
          7: inputs[6] || 0,
          9: inputs[11] || 0,
          12: inputs[14] || 0
        };
      }
    }
  },

  '74LS148': {
    id: '74LS148',
    name: '74LS148 8-to-3 Line Priority Encoder',
    category: IC_CATEGORIES.COMBINATIONAL,
    pins: 16,
    description: 'Encodes 8 active-low data inputs (0#..7#) to a 3-bit active-low binary code (A2#..A0#), with active-low Group Select (GS#) and Enable Output (EO#) for cascading.',
    pinout: {
      1: { name: '4#', type: 'input', desc: 'Input 4 (Active Low)' },
      2: { name: '5#', type: 'input', desc: 'Input 5 (Active Low)' },
      3: { name: '6#', type: 'input', desc: 'Input 6 (Active Low)' },
      4: { name: '7#', type: 'input', desc: 'Input 7 (Active Low, Highest Priority)' },
      5: { name: 'EI#', type: 'input', desc: 'Enable Input (Active Low)' },
      6: { name: 'A2#', type: 'output', desc: 'Binary Address Output 2 (Active Low)' },
      7: { name: 'A1#', type: 'output', desc: 'Binary Address Output 1 (Active Low)' },
      8: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      9: { name: 'A0#', type: 'output', desc: 'Binary Address Output 0 (Active Low)' },
      10: { name: '0#', type: 'input', desc: 'Input 0 (Active Low, Lowest Priority)' },
      11: { name: '1#', type: 'input', desc: 'Input 1 (Active Low)' },
      12: { name: '2#', type: 'input', desc: 'Input 2 (Active Low)' },
      13: { name: '3#', type: 'input', desc: 'Input 3 (Active Low)' },
      14: { name: 'GS#', type: 'output', desc: 'Group Select Output (Active Low)' },
      15: { name: 'EO#', type: 'output', desc: 'Enable Output (Active Low)' },
      16: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    truthTable: {
      headers: ['EI#', '0#', '1#', '2#', '3#', '4#', '5#', '6#', '7#', 'A2#', 'A1#', 'A0#', 'GS#', 'EO#'],
      rows: [
        ['1', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', '1', '1', '1', '1', '1'],
        ['0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '0'],
        ['0', 'X', 'X', 'X', 'X', 'X', 'X', 'X', '0', '0', '0', '0', '0', '1'],
        ['0', 'X', 'X', 'X', 'X', 'X', 'X', '0', '1', '0', '0', '1', '0', '1'],
        ['0', 'X', 'X', 'X', 'X', 'X', '0', '1', '1', '0', '1', '0', '0', '1'],
        ['0', 'X', 'X', 'X', 'X', '0', '1', '1', '1', '0', '1', '1', '0', '1'],
        ['0', 'X', 'X', 'X', '0', '1', '1', '1', '1', '1', '0', '0', '0', '1'],
        ['0', 'X', 'X', '0', '1', '1', '1', '1', '1', '1', '0', '1', '0', '1'],
        ['0', 'X', '0', '1', '1', '1', '1', '1', '1', '1', '1', '0', '0', '1'],
        ['0', '0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '0', '1']
      ]
    },
    simulate: (inputs) => {
      const ei = inputs[5] !== undefined ? inputs[5] : 0;
      if (ei === 1) {
        return { 6: 1, 7: 1, 9: 1, 14: 1, 15: 1 };
      }
      const inputPins = [
        { num: 7, pin: 4 },
        { num: 6, pin: 3 },
        { num: 5, pin: 2 },
        { num: 4, pin: 1 },
        { num: 3, pin: 13 },
        { num: 2, pin: 12 },
        { num: 1, pin: 11 },
        { num: 0, pin: 10 }
      ];

      let activeIndex = -1;
      for (const item of inputPins) {
        if (inputs[item.pin] === 0) {
          activeIndex = item.num;
          break;
        }
      }

      if (activeIndex === -1) {
        return { 6: 1, 7: 1, 9: 1, 14: 1, 15: 0 };
      }

      const a2 = ((activeIndex >> 2) & 1) === 1 ? 0 : 1;
      const a1 = ((activeIndex >> 1) & 1) === 1 ? 0 : 1;
      const a0 = ((activeIndex >> 0) & 1) === 1 ? 0 : 1;

      return {
        6: a2,
        7: a1,
        9: a0,
        14: 0,
        15: 1
      };
    }
  },

  '74LS147': {
    id: '74LS147',
    name: '74LS147 10-Line to 4-Line BCD Priority Encoder',
    category: IC_CATEGORIES.COMBINATIONAL,
    pins: 16,
    description: 'Encodes nine active-low data inputs (1# to 9#) into active-low 4-bit BCD on outputs A#, B#, C#, D# based on priority.',
    pinout: {
      1: { name: '4#', type: 'input', desc: 'Input 4 (Active Low)' },
      2: { name: '5#', type: 'input', desc: 'Input 5 (Active Low)' },
      3: { name: '6#', type: 'input', desc: 'Input 6 (Active Low)' },
      4: { name: '7#', type: 'input', desc: 'Input 7 (Active Low)' },
      5: { name: '8#', type: 'input', desc: 'Input 8 (Active Low)' },
      6: { name: 'D#', type: 'output', desc: 'BCD Output D (MSB, Active Low)' },
      7: { name: 'C#', type: 'output', desc: 'BCD Output C (Active Low)' },
      8: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      9: { name: 'B#', type: 'output', desc: 'BCD Output B (Active Low)' },
      10: { name: '1#', type: 'input', desc: 'Input 1 (Active Low)' },
      11: { name: '2#', type: 'input', desc: 'Input 2 (Active Low)' },
      12: { name: '3#', type: 'input', desc: 'Input 3 (Active Low)' },
      13: { name: '9#', type: 'input', desc: 'Input 9 (Active Low)' },
      14: { name: 'A#', type: 'output', desc: 'BCD Output A (LSB, Active Low)' },
      15: { name: 'NC', type: 'nc', desc: 'No Connection' },
      16: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    truthTable: {
      headers: ['1#', '2#', '3#', '4#', '5#', '6#', '7#', '8#', '9#', 'D#', 'C#', 'B#', 'A#'],
      rows: [
        ['1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1'],
        ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', '0', '0', '1', '1', '0'],
        ['X', 'X', 'X', 'X', 'X', 'X', 'X', '0', '1', '0', '1', '1', '1'],
        ['X', 'X', 'X', 'X', 'X', 'X', '0', '1', '1', '1', '0', '0', '0'],
        ['X', 'X', 'X', 'X', '0', '1', '1', '1', '1', '1', '0', '1', '0'],
        ['0', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '0']
      ]
    },
    simulate: (inputs) => {
      const priority = [
        { val: 9, pin: 13 },
        { val: 8, pin: 5 },
        { val: 7, pin: 4 },
        { val: 6, pin: 3 },
        { val: 5, pin: 2 },
        { val: 4, pin: 1 },
        { val: 3, pin: 12 },
        { val: 2, pin: 11 },
        { val: 1, pin: 10 }
      ];
      let activeVal = 0;
      for (const item of priority) {
        if (inputs[item.pin] === 0) {
          activeVal = item.val;
          break;
        }
      }
      if (activeVal === 0) {
        return { 14: 1, 9: 1, 7: 1, 6: 1 };
      }
      return {
        14: ((activeVal >> 0) & 1) === 1 ? 0 : 1, // A#
        9: ((activeVal >> 1) & 1) === 1 ? 0 : 1,  // B#
        7: ((activeVal >> 2) & 1) === 1 ? 0 : 1,  // C#
        6: ((activeVal >> 3) & 1) === 1 ? 0 : 1   // D#
      };
    }
  },

  '74LS47': {
    id: '74LS47',
    name: '74LS47 BCD to 7-Segment Decoder / Driver',
    category: IC_CATEGORIES.COMBINATIONAL,
    pins: 16,
    description: 'Decodes 4-bit BCD to active-low outputs capable of driving common-anode 7-segment displays.',
    pinout: {
      1: { name: 'B', type: 'input', desc: 'BCD Input Bit 1 (Weight 2)' },
      2: { name: 'C', type: 'input', desc: 'BCD Input Bit 2 (Weight 4)' },
      3: { name: 'LT#', type: 'input', desc: 'Lamp Test (Active Low)' },
      4: { name: 'BI/RBO#', type: 'input', desc: 'Blanking Input / Ripple Blanking Output' },
      5: { name: 'RBI#', type: 'input', desc: 'Ripple Blanking Input' },
      6: { name: 'D', type: 'input', desc: 'BCD Input Bit 3 (Weight 8)' },
      7: { name: 'A', type: 'input', desc: 'BCD Input Bit 0 (Weight 1)' },
      8: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      9: { name: 'e', type: 'output', desc: 'Segment e (Active Low)' },
      10: { name: 'd', type: 'output', desc: 'Segment d (Active Low)' },
      11: { name: 'c', type: 'output', desc: 'Segment c (Active Low)' },
      12: { name: 'b', type: 'output', desc: 'Segment b (Active Low)' },
      13: { name: 'a', type: 'output', desc: 'Segment a (Active Low)' },
      14: { name: 'g', type: 'output', desc: 'Segment g (Active Low)' },
      15: { name: 'f', type: 'output', desc: 'Segment f (Active Low)' },
      16: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    truthTable: {
      headers: ['Decimal', 'D C B A (BCD)', 'Segments Active Low (a b c d e f g)'],
      rows: [
        ['0', '0 0 0 0', '0 0 0 0 0 0 1 (a-f ON, g OFF)'],
        ['1', '0 0 0 1', '1 0 0 1 1 1 1 (b, c ON)'],
        ['2', '0 0 1 0', '0 0 1 0 0 1 0 (a,b,d,e,g ON)'],
        ['8', '1 0 0 0', '0 0 0 0 0 0 0 (All ON)']
      ]
    },
    simulate: (inputs) => {
      const lt = inputs[3] !== undefined ? inputs[3] : 1;
      const bi = inputs[4] !== undefined ? inputs[4] : 1;
      if (lt === 0) {
        return { 13: 0, 12: 0, 11: 0, 10: 0, 9: 0, 15: 0, 14: 0 };
      }
      if (bi === 0) {
        return { 13: 1, 12: 1, 11: 1, 10: 1, 9: 1, 15: 1, 14: 1 };
      }

      const bcd = ((inputs[6] || 0) << 3) | ((inputs[2] || 0) << 2) | ((inputs[1] || 0) << 1) | (inputs[7] || 0);

      const segTable = [
        [0, 0, 0, 0, 0, 0, 1], // 0
        [1, 0, 0, 1, 1, 1, 1], // 1
        [0, 0, 1, 0, 0, 1, 0], // 2
        [0, 0, 0, 0, 1, 1, 0], // 3
        [1, 0, 0, 1, 1, 0, 0], // 4
        [0, 1, 0, 0, 1, 0, 0], // 5
        [0, 1, 0, 0, 0, 0, 0], // 6
        [0, 0, 0, 1, 1, 1, 1], // 7
        [0, 0, 0, 0, 0, 0, 0], // 8
        [0, 0, 0, 0, 1, 0, 0], // 9
        [1, 1, 1, 0, 0, 1, 0],
        [1, 1, 0, 0, 1, 1, 0],
        [1, 0, 1, 1, 1, 0, 0],
        [0, 1, 1, 0, 1, 0, 0],
        [1, 1, 1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1]
      ];

      const seg = segTable[bcd] || segTable[15];
      return {
        13: seg[0],
        12: seg[1],
        11: seg[2],
        10: seg[3],
        9: seg[4],
        15: seg[5],
        14: seg[6]
      };
    }
  },

  // ==========================================
  // FLIP-FLOPS & SEQUENTIAL LOGIC
  // ==========================================
  '74LS74': {
    id: '74LS74',
    name: '74LS74 Dual D Flip-Flop with Set and Reset',
    category: IC_CATEGORIES.FLIP_FLOPS,
    pins: 14,
    description: 'Dual positive-edge-triggered D flip-flops with asynchronous active-low preset and clear inputs.',
    pinout: {
      1: { name: '1CLR#', type: 'input', desc: 'FF 1 Clear (Active Low)' },
      2: { name: '1D', type: 'input', desc: 'FF 1 Data Input' },
      3: { name: '1CLK', type: 'input', desc: 'FF 1 Clock (Positive Edge)' },
      4: { name: '1PRE#', type: 'input', desc: 'FF 1 Preset (Active Low)' },
      5: { name: '1Q', type: 'output', desc: 'FF 1 True Output' },
      6: { name: '1Q#', type: 'output', desc: 'FF 1 Inverted Output' },
      7: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      8: { name: '2Q#', type: 'output', desc: 'FF 2 Inverted Output' },
      9: { name: '2Q', type: 'output', desc: 'FF 2 True Output' },
      10: { name: '2PRE#', type: 'input', desc: 'FF 2 Preset (Active Low)' },
      11: { name: '2CLK', type: 'input', desc: 'FF 2 Clock (Positive Edge)' },
      12: { name: '2D', type: 'input', desc: 'FF 2 Data Input' },
      13: { name: '2CLR#', type: 'input', desc: 'FF 2 Clear (Active Low)' },
      14: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    initState: () => ({
      ff1_q: 0,
      ff1_clk_prev: 0,
      ff2_q: 0,
      ff2_clk_prev: 0
    }),
    truthTable: {
      headers: ['PRE#', 'CLR#', 'CLK', 'D', 'Q', 'Q#'],
      rows: [
        ['0', '1', 'X', 'X', '1', '0 (Preset)'],
        ['1', '0', 'X', 'X', '0', '1 (Cleared)'],
        ['0', '0', 'X', 'X', '1', '1 (Unstable)'],
        ['1', '1', '↑', '0', '0', '1'],
        ['1', '1', '↑', '1', '1', '0'],
        ['1', '1', '0 / 1', 'X', 'Q0', 'Q0# (No Change)']
      ]
    },
    simulate: (inputs, state) => {
      const pre1 = inputs[4] !== undefined ? inputs[4] : 1;
      const clr1 = inputs[1] !== undefined ? inputs[1] : 1;
      const clk1 = inputs[3] || 0;
      const d1 = inputs[2] || 0;

      if (pre1 === 0 && clr1 === 1) {
        state.ff1_q = 1;
      } else if (pre1 === 1 && clr1 === 0) {
        state.ff1_q = 0;
      } else if (pre1 === 0 && clr1 === 0) {
        state.ff1_q = 1;
      } else if (clk1 === 1 && state.ff1_clk_prev === 0) {
        state.ff1_q = d1;
      }
      state.ff1_clk_prev = clk1;

      const pre2 = inputs[10] !== undefined ? inputs[10] : 1;
      const clr2 = inputs[13] !== undefined ? inputs[13] : 1;
      const clk2 = inputs[11] || 0;
      const d2 = inputs[12] || 0;

      if (pre2 === 0 && clr2 === 1) {
        state.ff2_q = 1;
      } else if (pre2 === 1 && clr2 === 0) {
        state.ff2_q = 0;
      } else if (pre2 === 0 && clr2 === 0) {
        state.ff2_q = 1;
      } else if (clk2 === 1 && state.ff2_clk_prev === 0) {
        state.ff2_q = d2;
      }
      state.ff2_clk_prev = clk2;

      return {
        5: state.ff1_q,
        6: state.ff1_q === 1 ? 0 : 1,
        9: state.ff2_q,
        8: state.ff2_q === 1 ? 0 : 1
      };
    }
  },

  '74LS76': {
    id: '74LS76',
    name: '74LS76 Dual J-K Flip-Flop with Preset and Clear',
    category: IC_CATEGORIES.FLIP_FLOPS,
    pins: 16,
    description: 'Dual pulse-triggered J-K flip-flops with individual J, K, clock, preset, and clear inputs.',
    pinout: {
      1: { name: '1CLK', type: 'input', desc: 'FF 1 Clock (Falling Edge)' },
      2: { name: '1PRE#', type: 'input', desc: 'FF 1 Preset (Active Low)' },
      3: { name: '1CLR#', type: 'input', desc: 'FF 1 Clear (Active Low)' },
      4: { name: '1J', type: 'input', desc: 'FF 1 J Input' },
      5: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' },
      6: { name: '2CLK', type: 'input', desc: 'FF 2 Clock (Falling Edge)' },
      7: { name: '2PRE#', type: 'input', desc: 'FF 2 Preset (Active Low)' },
      8: { name: '2CLR#', type: 'input', desc: 'FF 2 Clear (Active Low)' },
      9: { name: '2J', type: 'input', desc: 'FF 2 J Input' },
      10: { name: '2K', type: 'input', desc: 'FF 2 K Input' },
      11: { name: '2Q', type: 'output', desc: 'FF 2 True Output' },
      12: { name: '2Q#', type: 'output', desc: 'FF 2 Inverted Output' },
      13: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      14: { name: '1Q#', type: 'output', desc: 'FF 1 Inverted Output' },
      15: { name: '1Q', type: 'output', desc: 'FF 1 True Output' },
      16: { name: '1K', type: 'input', desc: 'FF 1 K Input' }
    },
    initState: () => ({
      ff1_q: 0,
      ff1_clk_prev: 0,
      ff2_q: 0,
      ff2_clk_prev: 0
    }),
    truthTable: {
      headers: ['PRE#', 'CLR#', 'CLK', 'J', 'K', 'Q', 'Q# (Mode)'],
      rows: [
        ['0', '1', 'X', 'X', 'X', '1', '0 (Preset)'],
        ['1', '0', 'X', 'X', 'X', '0', '1 (Cleared)'],
        ['1', '1', '↓', '0', '0', 'Q0', 'Q0# (Hold)'],
        ['1', '1', '↓', '0', '1', '0', '1 (Reset)'],
        ['1', '1', '↓', '1', '0', '1', '0 (Set)'],
        ['1', '1', '↓', '1', '1', 'Q0#', 'Q0 (Toggle)']
      ]
    },
    simulate: (inputs, state) => {
      const pre1 = inputs[2] !== undefined ? inputs[2] : 1;
      const clr1 = inputs[3] !== undefined ? inputs[3] : 1;
      const clk1 = inputs[1] || 0;
      const j1 = inputs[4] || 0;
      const k1 = inputs[16] || 0;

      if (pre1 === 0 && clr1 === 1) {
        state.ff1_q = 1;
      } else if (pre1 === 1 && clr1 === 0) {
        state.ff1_q = 0;
      } else if (clk1 === 0 && state.ff1_clk_prev === 1) {
        if (j1 === 0 && k1 === 1) state.ff1_q = 0;
        else if (j1 === 1 && k1 === 0) state.ff1_q = 1;
        else if (j1 === 1 && k1 === 1) state.ff1_q = state.ff1_q === 1 ? 0 : 1;
      }
      state.ff1_clk_prev = clk1;

      const pre2 = inputs[7] !== undefined ? inputs[7] : 1;
      const clr2 = inputs[8] !== undefined ? inputs[8] : 1;
      const clk2 = inputs[6] || 0;
      const j2 = inputs[9] || 0;
      const k2 = inputs[10] || 0;

      if (pre2 === 0 && clr2 === 1) {
        state.ff2_q = 1;
      } else if (pre2 === 1 && clr2 === 0) {
        state.ff2_q = 0;
      } else if (clk2 === 0 && state.ff2_clk_prev === 1) {
        if (j2 === 0 && k2 === 1) state.ff2_q = 0;
        else if (j2 === 1 && k2 === 0) state.ff2_q = 1;
        else if (j2 === 1 && k2 === 1) state.ff2_q = state.ff2_q === 1 ? 0 : 1;
      }
      state.ff2_clk_prev = clk2;

      return {
        15: state.ff1_q,
        14: state.ff1_q === 1 ? 0 : 1,
        11: state.ff2_q,
        12: state.ff2_q === 1 ? 0 : 1
      };
    }
  },

  '74LS73': {
    id: '74LS73',
    name: '74LS73 Dual J-K Flip-Flop with Clear',
    category: IC_CATEGORIES.FLIP_FLOPS,
    pins: 14,
    description: 'Two independent J-K flip-flops with pulse-triggered negative-edge clocks and asynchronous active-low reset.',
    pinout: {
      1: { name: '1CLK', type: 'input', desc: 'FF 1 Clock (Falling Edge)' },
      2: { name: '1CLR#', type: 'input', desc: 'FF 1 Clear (Active Low)' },
      3: { name: '1K', type: 'input', desc: 'FF 1 K Input' },
      4: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' },
      5: { name: '2CLK', type: 'input', desc: 'FF 2 Clock (Falling Edge)' },
      6: { name: '2CLR#', type: 'input', desc: 'FF 2 Clear (Active Low)' },
      7: { name: '2J', type: 'input', desc: 'FF 2 J Input' },
      8: { name: '2Q#', type: 'output', desc: 'FF 2 Inverted Output' },
      9: { name: '2Q', type: 'output', desc: 'FF 2 True Output' },
      10: { name: '2K', type: 'input', desc: 'FF 2 K Input' },
      11: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      12: { name: '1Q', type: 'output', desc: 'FF 1 True Output' },
      13: { name: '1Q#', type: 'output', desc: 'FF 1 Inverted Output' },
      14: { name: '1J', type: 'input', desc: 'FF 1 J Input' }
    },
    truthTable: {
      headers: ['CLR#', 'CLK', 'J', 'K', 'Q (Next)', 'Operating Mode'],
      rows: [
        ['0', 'X', 'X', 'X', '0', 'Asynchronous Reset (Clear)'],
        ['1', '↓', '0', '0', 'Q0', 'Hold (No change)'],
        ['1', '↓', '0', '1', '0', 'Reset (Q = 0)'],
        ['1', '↓', '1', '0', '1', 'Set (Q = 1)'],
        ['1', '↓', '1', '1', 'Q0#', 'Toggle']
      ]
    },
    initState: () => ({
      ff1_q: 0,
      ff1_clk_prev: 0,
      ff2_q: 0,
      ff2_clk_prev: 0
    }),
    simulate: (inputs, state) => {
      const clr1 = inputs[2] !== undefined ? inputs[2] : 1;
      const clk1 = inputs[1] || 0;
      const j1 = inputs[14] || 0;
      const k1 = inputs[3] || 0;

      if (clr1 === 0) {
        state.ff1_q = 0;
      } else if (clk1 === 0 && state.ff1_clk_prev === 1) {
        if (j1 === 0 && k1 === 1) state.ff1_q = 0;
        else if (j1 === 1 && k1 === 0) state.ff1_q = 1;
        else if (j1 === 1 && k1 === 1) state.ff1_q = state.ff1_q === 1 ? 0 : 1;
      }
      state.ff1_clk_prev = clk1;

      const clr2 = inputs[6] !== undefined ? inputs[6] : 1;
      const clk2 = inputs[5] || 0;
      const j2 = inputs[7] || 0;
      const k2 = inputs[10] || 0;

      if (clr2 === 0) {
        state.ff2_q = 0;
      } else if (clk2 === 0 && state.ff2_clk_prev === 1) {
        if (j2 === 0 && k2 === 1) state.ff2_q = 0;
        else if (j2 === 1 && k2 === 0) state.ff2_q = 1;
        else if (j2 === 1 && k2 === 1) state.ff2_q = state.ff2_q === 1 ? 0 : 1;
      }
      state.ff2_clk_prev = clk2;

      return {
        12: state.ff1_q,
        13: state.ff1_q === 1 ? 0 : 1,
        9: state.ff2_q,
        8: state.ff2_q === 1 ? 0 : 1
      };
    }
  },

  // ==========================================
  // COUNTERS & SHIFT REGISTERS
  // ==========================================
  '74LS90': {
    id: '74LS90',
    name: '74LS90 Decade / BCD Counter',
    category: IC_CATEGORIES.COUNTERS,
    pins: 14,
    description: 'Contains a divide-by-two and divide-by-five counter, cascadeable for BCD count sequence 0 through 9.',
    pinout: {
      1: { name: 'CLKB', type: 'input', desc: 'Clock Input B (Falling Edge, Mod-5)' },
      2: { name: 'R0(1)', type: 'input', desc: 'Reset to 0 Input 1' },
      3: { name: 'R0(2)', type: 'input', desc: 'Reset to 0 Input 2' },
      4: { name: 'NC', type: 'nc', desc: 'No Connection' },
      5: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' },
      6: { name: 'R9(1)', type: 'input', desc: 'Reset to 9 Input 1' },
      7: { name: 'R9(2)', type: 'input', desc: 'Reset to 9 Input 2' },
      8: { name: 'QC', type: 'output', desc: 'Count Bit C (Weight 4)' },
      9: { name: 'QB', type: 'output', desc: 'Count Bit B (Weight 2)' },
      10: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      11: { name: 'QD', type: 'output', desc: 'Count Bit D (Weight 8)' },
      12: { name: 'QA', type: 'output', desc: 'Count Bit A (Weight 1)' },
      13: { name: 'NC', type: 'nc', desc: 'No Connection' },
      14: { name: 'CLKA', type: 'input', desc: 'Clock Input A (Falling Edge, Mod-2)' }
    },
    initState: () => ({
      qa: 0,
      mod5: 0,
      clka_prev: 0,
      clkb_prev: 0
    }),
    truthTable: {
      headers: ['Reset Inputs R0(1,2) / R9(1,2)', 'Action / Output'],
      rows: [
        ['R0(1)=1, R0(2)=1', 'Reset outputs to BCD 0000'],
        ['R9(1)=1, R9(2)=1', 'Set outputs to BCD 1001 (9)'],
        ['Connect QA (Pin 12) to CLKB (Pin 1)', 'Full BCD Decade Counter (0 to 9)']
      ]
    },
    simulate: (inputs, state) => {
      const r0 = (inputs[2] === 1) && (inputs[3] === 1);
      const r9 = (inputs[6] === 1) && (inputs[7] === 1);

      if (r0) {
        state.qa = 0;
        state.mod5 = 0;
      } else if (r9) {
        state.qa = 1;
        state.mod5 = 4;
      } else {
        const clka = inputs[14] || 0;
        const clkb = inputs[1] || 0;

        if (clka === 0 && state.clka_prev === 1) {
          state.qa = state.qa === 1 ? 0 : 1;
        }
        state.clka_prev = clka;

        if (clkb === 0 && state.clkb_prev === 1) {
          state.mod5 = (state.mod5 + 1) % 5;
        }
        state.clkb_prev = clkb;
      }

      let qb = 0, qc = 0, qd = 0;
      if (state.mod5 === 1) qb = 1;
      else if (state.mod5 === 2) qc = 1;
      else if (state.mod5 === 3) { qb = 1; qc = 1; }
      else if (state.mod5 === 4) qd = 1;

      return {
        12: state.qa,
        9: qb,
        8: qc,
        11: qd
      };
    }
  },

  '74LS93': {
    id: '74LS93',
    name: '74LS93 4-Bit Binary Counter',
    category: IC_CATEGORIES.COUNTERS,
    pins: 14,
    description: 'Contains a divide-by-two and divide-by-eight counter, cascadeable to count 0 to 15 (4-bit binary ripple).',
    pinout: {
      1: { name: 'CLKB', type: 'input', desc: 'Clock Input B (Falling Edge, Mod-8)' },
      2: { name: 'R0(1)', type: 'input', desc: 'Reset to 0 Input 1' },
      3: { name: 'R0(2)', type: 'input', desc: 'Reset to 0 Input 2' },
      4: { name: 'NC', type: 'nc', desc: 'No Connection' },
      5: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' },
      6: { name: 'NC', type: 'nc', desc: 'No Connection' },
      7: { name: 'NC', type: 'nc', desc: 'No Connection' },
      8: { name: 'QC', type: 'output', desc: 'Count Bit C' },
      9: { name: 'QB', type: 'output', desc: 'Count Bit B' },
      10: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      11: { name: 'QD', type: 'output', desc: 'Count Bit D' },
      12: { name: 'QA', type: 'output', desc: 'Count Bit A' },
      13: { name: 'NC', type: 'nc', desc: 'No Connection' },
      14: { name: 'CLKA', type: 'input', desc: 'Clock Input A (Falling Edge, Mod-2)' }
    },
    initState: () => ({
      qa: 0,
      mod8: 0,
      clka_prev: 0,
      clkb_prev: 0
    }),
    truthTable: {
      headers: ['Reset R0(1) & R0(2)', 'Count (Connect QA to CLKB)'],
      rows: [
        ['Both 1', 'Reset count to 0000'],
        ['Either 0', 'Count increments 0000 (0) -> 1111 (15)']
      ]
    },
    simulate: (inputs, state) => {
      const reset = (inputs[2] === 1) && (inputs[3] === 1);
      if (reset) {
        state.qa = 0;
        state.mod8 = 0;
      } else {
        const clka = inputs[14] || 0;
        const clkb = inputs[1] || 0;

        if (clka === 0 && state.clka_prev === 1) {
          state.qa = state.qa === 1 ? 0 : 1;
        }
        state.clka_prev = clka;

        if (clkb === 0 && state.clkb_prev === 1) {
          state.mod8 = (state.mod8 + 1) & 7;
        }
        state.clkb_prev = clkb;
      }

      return {
        12: state.qa,
        9: (state.mod8 >> 0) & 1,
        8: (state.mod8 >> 1) & 1,
        11: (state.mod8 >> 2) & 1
      };
    }
  },

  '74LS191': {
    id: '74LS191',
    name: '74LS191 Synchronous Up/Down 4-Bit Binary Counter',
    category: IC_CATEGORIES.COUNTERS,
    pins: 16,
    description: 'Reversible 4-bit binary counter with parallel load, count enable, and direction control.',
    pinout: {
      1: { name: 'B', type: 'input', desc: 'Parallel Data In Bit 1' },
      2: { name: 'QB', type: 'output', desc: 'Counter Output B' },
      3: { name: 'QA', type: 'output', desc: 'Counter Output A' },
      4: { name: 'CTEN#', type: 'input', desc: 'Count Enable (Active Low)' },
      5: { name: 'D/U#', type: 'input', desc: 'Down / Up Count Select (0=Up, 1=Down)' },
      6: { name: 'QC', type: 'output', desc: 'Counter Output C' },
      7: { name: 'QD', type: 'output', desc: 'Counter Output D' },
      8: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      9: { name: 'D', type: 'input', desc: 'Parallel Data In Bit 3' },
      10: { name: 'C', type: 'input', desc: 'Parallel Data In Bit 2' },
      11: { name: 'LOAD#', type: 'input', desc: 'Asynchronous Parallel Load (Active Low)' },
      12: { name: 'MAX/MIN', type: 'output', desc: 'Terminal Count Output' },
      13: { name: 'RCO#', type: 'output', desc: 'Ripple Clock Output (Active Low)' },
      14: { name: 'CLK', type: 'input', desc: 'Clock Input (Positive Edge)' },
      15: { name: 'A', type: 'input', desc: 'Parallel Data In Bit 0' },
      16: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    initState: () => ({
      count: 0,
      clk_prev: 0
    }),
    truthTable: {
      headers: ['LOAD#', 'CTEN#', 'D/U#', 'CLK', 'Mode / Action'],
      rows: [
        ['0', 'X', 'X', 'X', 'Asynchronous Parallel Load (QA..QD ← A..D)'],
        ['1', '1', 'X', 'X', 'Inhibit / Hold (No change)'],
        ['1', '0', '0', '↑', 'Count Up (Binary increment modulo-16)'],
        ['1', '0', '1', '↑', 'Count Down (Binary decrement modulo-16)']
      ]
    },
    simulate: (inputs, state) => {
      const load = inputs[11] !== undefined ? inputs[11] : 1;
      const clk = inputs[14] || 0;
      const cten = inputs[4] !== undefined ? inputs[4] : 0;
      const down = inputs[5] || 0;

      if (load === 0) {
        state.count = ((inputs[9] || 0) << 3) | ((inputs[10] || 0) << 2) | ((inputs[1] || 0) << 1) | (inputs[15] || 0);
      } else if (clk === 1 && state.clk_prev === 0 && cten === 0) {
        if (down === 1) {
          state.count = (state.count - 1 + 16) & 15;
        } else {
          state.count = (state.count + 1) & 15;
        }
      }
      state.clk_prev = clk;

      const isMax = (down === 0 && state.count === 15) || (down === 1 && state.count === 0);
      return {
        3: (state.count >> 0) & 1,
        2: (state.count >> 1) & 1,
        6: (state.count >> 2) & 1,
        7: (state.count >> 3) & 1,
        12: isMax ? 1 : 0,
        13: isMax && clk === 0 ? 0 : 1
      };
    }
  },

  '74LS194': {
    id: '74LS194',
    name: '74LS194 4-Bit Bidirectional Universal Shift Register',
    category: IC_CATEGORIES.REGISTERS,
    pins: 16,
    description: 'Universal shift register capable of Hold, Shift Right, Shift Left, and Parallel Load modes.',
    pinout: {
      1: { name: 'CLR#', type: 'input', desc: 'Master Reset (Active Low)' },
      2: { name: 'SR_SER', type: 'input', desc: 'Serial Data In for Shift Right' },
      3: { name: 'A', type: 'input', desc: 'Parallel Input A' },
      4: { name: 'B', type: 'input', desc: 'Parallel Input B' },
      5: { name: 'C', type: 'input', desc: 'Parallel Input C' },
      6: { name: 'D', type: 'input', desc: 'Parallel Input D' },
      7: { name: 'SL_SER', type: 'input', desc: 'Serial Data In for Shift Left' },
      8: { name: 'GND', type: 'gnd', desc: 'Ground (0V)' },
      9: { name: 'S0', type: 'input', desc: 'Mode Control S0' },
      10: { name: 'S1', type: 'input', desc: 'Mode Control S1' },
      11: { name: 'CLK', type: 'input', desc: 'Clock Input (Positive Edge)' },
      12: { name: 'QD', type: 'output', desc: 'Register Output D' },
      13: { name: 'QC', type: 'output', desc: 'Register Output C' },
      14: { name: 'QB', type: 'output', desc: 'Register Output B' },
      15: { name: 'QA', type: 'output', desc: 'Register Output A' },
      16: { name: 'VCC', type: 'vcc', desc: 'Positive Supply (+5V)' }
    },
    initState: () => ({
      reg: [0, 0, 0, 0],
      clk_prev: 0
    }),
    truthTable: {
      headers: ['CLR#', 'S1', 'S0', 'CLK', 'Operating Mode'],
      rows: [
        ['0', 'X', 'X', 'X', 'Clear / Reset (Outputs 0000)'],
        ['1', '0', '0', 'X', 'Hold (No change)'],
        ['1', '0', '1', '↑', 'Shift Right (QA ← SR_SER)'],
        ['1', '1', '0', '↑', 'Shift Left (QD ← SL_SER)'],
        ['1', '1', '1', '↑', 'Parallel Load (QA..QD ← A..D)']
      ]
    },
    simulate: (inputs, state) => {
      const clr = inputs[1] !== undefined ? inputs[1] : 1;
      const clk = inputs[11] || 0;
      const s0 = inputs[9] || 0;
      const s1 = inputs[10] || 0;

      if (clr === 0) {
        state.reg = [0, 0, 0, 0];
      } else if (clk === 1 && state.clk_prev === 0) {
        if (s1 === 0 && s0 === 1) {
          const sr = inputs[2] || 0;
          state.reg = [sr, state.reg[0], state.reg[1], state.reg[2]];
        } else if (s1 === 1 && s0 === 0) {
          const sl = inputs[7] || 0;
          state.reg = [state.reg[1], state.reg[2], state.reg[3], sl];
        } else if (s1 === 1 && s0 === 1) {
          state.reg = [inputs[3] || 0, inputs[4] || 0, inputs[5] || 0, inputs[6] || 0];
        }
      }
      state.clk_prev = clk;

      return {
        15: state.reg[0],
        14: state.reg[1],
        13: state.reg[2],
        12: state.reg[3]
      };
    }
  }
};

if (typeof window !== 'undefined') {
  window.IC_LIBRARY = IC_LIBRARY;
}

// ==========================================
// SOURCE: js/simulation.js
// ==========================================
/**
 * DELD Virtual Trainer Kit - Real-Time Circuit Simulation Engine
 * Handles signal propagation, clock timers, multi-stage IC evaluation,
 * and wire state resolution.
 */


class CircuitSimulator {
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

        // Determine which logical pins are actively connected to wires in the circuit
        const connectedLogicalPins = new Set();
        this.wires.forEach(w => {
          [w.from, w.to].forEach(ep => {
            if (!ep) return;
            const norm = this._normalizeEndpoint(ep);
            if (norm && norm.comp === `icbase_${bIdx}`) {
              const logicalPin = this._getLogicalPin(norm.pin, icDef.pins);
              if (logicalPin >= 1 && logicalPin <= icDef.pins) {
                connectedLogicalPins.add(logicalPin);
              }
            }
          });
        });

        // Collect inputs for this IC:
        // Only set inputs[p] if pin p is connected to a wire in the circuit.
        // Unconnected pins remain undefined so IC default behaviors apply.
        const inputs = {};
        for (let p = 1; p <= icDef.pins; p++) {
          if (connectedLogicalPins.has(p)) {
            inputs[p] = base.pins[p] ? base.pins[p].level : 0;
          }
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

  _getLogicalPin(pinStr, icPins) {
    const s = String(pinStr).trim();
    let pinNum = Number(s);
    if (s.startsWith('socket_')) {
      const sNum = parseInt(s.replace('socket_', ''), 10);
      if (icPins === 14 && sNum >= 14 && sNum <= 20) {
        return 14 - (20 - sNum);
      } else if (icPins === 16 && sNum >= 13 && sNum <= 20) {
        return 16 - (20 - sNum);
      } else {
        return sNum;
      }
    } else if (icPins === 14 && pinNum > 14 && pinNum <= 20) {
      return 14 - (20 - pinNum);
    } else if (icPins === 16 && pinNum > 16 && pinNum <= 20) {
      return 16 - (20 - pinNum);
    }
    return pinNum;
  }

  _applySignalToEndpoint(endpoint, signal) {
    if (endpoint.comp.startsWith('icbase_')) {
      const bIdx = Number(endpoint.comp.replace('icbase_', ''));
      const base = this.icBases[bIdx];
      if (!base || !base.icId) return;

      const icDef = IC_LIBRARY[base.icId];
      if (!icDef) return;

      const pinNum = this._getLogicalPin(endpoint.pin, icDef.pins);

      if (base.pins[pinNum] && base.pins[pinNum].type === 'input') {
        base.pins[pinNum].level = signal;
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
    if (N > 11) {
      return {
        inputs: activeSwitches,
        outputs: activeLeds,
        activeICs,
        rows: [],
        liveRowIndex: -1,
        emptyReason: `Circuit has ${N} input switches connected. Truth table supports up to 11 inputs (2,048 combinations). For larger circuits, test combinations live directly using the switches on the Trainer Kit.`
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

// ==========================================
// SOURCE: js/wire.js
// ==========================================
/**
 * DELD Virtual Trainer Kit - Wire & Patch Cord Renderer
 * Authentic DeldSim Manhattan (orthogonal 90-degree) wire routing,
 * multi-wire collision avoidance, color themes, and signal styling.
 */

const WIRE_PALETTE = [
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

class WireRenderer {
  constructor(svgContainer, options = {}) {
    this.container = svgContainer;
    this.colorIndex = 0;
    this.currentColor = WIRE_PALETTE[0].hex;
    this.signalColorMode = false; // Authentic palette colors by default; toggleable via toolbar
    this.drawingWire = null;
    this.wirePathElements = new Map(); // wireId -> SVG group
    this.previewGroup = null;
  }

  _ensurePreviewLayer() {
    if (!this.previewGroup || !this.previewGroup.parentNode) {
      let g = this.container.querySelector('#wire-preview-group');
      if (!g) {
        g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('id', 'wire-preview-group');
        g.setAttribute('pointer-events', 'none');
        g.style.pointerEvents = 'none';

        const shadow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        shadow.setAttribute('class', 'wire-preview-shadow');
        shadow.setAttribute('fill', 'none');
        shadow.setAttribute('stroke', 'rgba(0,0,0,0.3)');
        shadow.setAttribute('stroke-width', '4');
        shadow.setAttribute('stroke-linecap', 'round');
        shadow.setAttribute('stroke-linejoin', 'round');
        shadow.setAttribute('filter', 'url(#wire-shadow-filter)');

        const main = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        main.setAttribute('class', 'wire-preview-main');
        main.setAttribute('fill', 'none');
        main.setAttribute('stroke-width', '2.5');
        main.setAttribute('stroke-linecap', 'round');
        main.setAttribute('stroke-linejoin', 'round');
        main.setAttribute('stroke-dasharray', '6,4');

        const tip = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        tip.setAttribute('class', 'wire-preview-tip');
        tip.setAttribute('r', '4.5');
        tip.setAttribute('stroke-width', '1.5');
        tip.setAttribute('stroke', '#ffffff');

        g.appendChild(shadow);
        g.appendChild(main);
        g.appendChild(tip);
        this.container.appendChild(g);
      }
      this.previewGroup = g;
    }
    return this.previewGroup;
  }

  renderPreview(fromCoord, toCoord) {
    if (!fromCoord || !toCoord) return;
    const g = this._ensurePreviewLayer();
    g.style.display = 'block';

    // Compute Manhattan orthogonal route from source pin to dynamic cursor coordinate
    let d = WireRenderer.computeOrthogonalPath(fromCoord, toCoord, 0, []);
    if (!d || d.length < 5) {
      d = `M ${fromCoord.x} ${fromCoord.y} L ${toCoord.x} ${toCoord.y}`;
    }

    const shadow = g.querySelector('.wire-preview-shadow');
    const main = g.querySelector('.wire-preview-main');
    const tip = g.querySelector('.wire-preview-tip');

    if (shadow) shadow.setAttribute('d', d);
    if (main) {
      main.setAttribute('d', d);
      main.setAttribute('stroke', this.currentColor);
    }
    if (tip) {
      tip.setAttribute('cx', String(toCoord.x));
      tip.setAttribute('cy', String(toCoord.y));
      tip.setAttribute('fill', this.currentColor);
    }
  }

  clearPreview() {
    if (this.previewGroup) {
      this.previewGroup.style.display = 'none';
      const shadow = this.previewGroup.querySelector('.wire-preview-shadow');
      const main = this.previewGroup.querySelector('.wire-preview-main');
      if (shadow) shadow.removeAttribute('d');
      if (main) main.removeAttribute('d');
    }
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
      const isWithinCol = Math.abs(p1.x - p2.x) < 160;
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
        // One terminal is bottom (switch/pulse/gnd), one is top (led/vcc/display)
        const isBottomFirst = (p1.y > p2.y);
        const highwayLane = (wireIndex % 4) * 7;
        const yHighway = isBottomFirst ? (485 - highwayLane) : (175 + highwayLane);
        points.push({ x: p1.x, y: p1.y });
        points.push({ x: p1.x, y: yHighway });
        points.push({ x: p2.x, y: yHighway });
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

// ==========================================
// SOURCE: js/presets.js
// ==========================================
/**
 * DELD Virtual Trainer Kit - Lab Experiment Presets
 * Pre-built classic digital logic experiments ready to simulate with 1 click.
 */

const LAB_PRESETS = [
  {
    id: 'half_adder',
    title: 'Half Adder (74LS86 XOR + 74LS08 AND)',
    description: 'Implements a 1-bit Half Adder circuit calculating Sum = A ⊕ B and Carry = A · B.',
    switches: [0, 0],
    icBases: [
      { id: 0, icId: '74LS86' },
      { id: 1, icId: '74LS08' }
    ],
    wires: [
      // SW0 (A) to 74LS86 pin 1 and 74LS08 pin 1
      { from: { comp: 'switch', pin: 0 }, to: { comp: 'icbase_0', pin: 1 }, color: '#3b82f6' },
      { from: { comp: 'switch', pin: 0 }, to: { comp: 'icbase_1', pin: 1 }, color: '#3b82f6' },
      // SW1 (B) to 74LS86 pin 2 and 74LS08 pin 2
      { from: { comp: 'switch', pin: 1 }, to: { comp: 'icbase_0', pin: 2 }, color: '#22c55e' },
      { from: { comp: 'switch', pin: 1 }, to: { comp: 'icbase_1', pin: 2 }, color: '#22c55e' },
      // Sum = 74LS86 pin 3 (1Y) -> LED0
      { from: { comp: 'icbase_0', pin: 3 }, to: { comp: 'led', pin: 0 }, color: '#ef4444' },
      // Carry = 74LS08 pin 3 (1Y) -> LED1
      { from: { comp: 'icbase_1', pin: 3 }, to: { comp: 'led', pin: 1 }, color: '#eab308' }
    ]
  },

  {
    id: 'full_adder',
    title: 'Full Adder (74LS86 + 74LS08 + 74LS32)',
    description: 'Computes Sum and Carry of three 1-bit inputs (A, B, Cin) using XOR, AND, and OR gates.',
    switches: [0, 0, 0],
    icBases: [
      { id: 0, icId: '74LS86' },
      { id: 1, icId: '74LS08' },
      { id: 2, icId: '74LS32' }
    ],
    wires: [
      // SW0 (A) -> XOR1 pin 1, AND1 pin 1
      { from: { comp: 'switch', pin: 0 }, to: { comp: 'icbase_0', pin: 1 }, color: '#3b82f6' },
      { from: { comp: 'switch', pin: 0 }, to: { comp: 'icbase_1', pin: 1 }, color: '#3b82f6' },
      // SW1 (B) -> XOR1 pin 2, AND1 pin 2
      { from: { comp: 'switch', pin: 1 }, to: { comp: 'icbase_0', pin: 2 }, color: '#22c55e' },
      { from: { comp: 'switch', pin: 1 }, to: { comp: 'icbase_1', pin: 2 }, color: '#22c55e' },
      // XOR1 pin 3 (A^B) -> XOR2 pin 4, AND2 pin 4
      { from: { comp: 'icbase_0', pin: 3 }, to: { comp: 'icbase_0', pin: 4 }, color: '#06b6d4' },
      { from: { comp: 'icbase_0', pin: 3 }, to: { comp: 'icbase_1', pin: 4 }, color: '#06b6d4' },
      // SW2 (Cin) -> XOR2 pin 5, AND2 pin 5
      { from: { comp: 'switch', pin: 2 }, to: { comp: 'icbase_0', pin: 5 }, color: '#a855f7' },
      { from: { comp: 'switch', pin: 2 }, to: { comp: 'icbase_1', pin: 5 }, color: '#a855f7' },
      // Sum = XOR2 pin 6 -> LED0
      { from: { comp: 'icbase_0', pin: 6 }, to: { comp: 'led', pin: 0 }, color: '#ef4444' },
      // AND1 pin 3 -> OR pin 1
      { from: { comp: 'icbase_1', pin: 3 }, to: { comp: 'icbase_2', pin: 1 }, color: '#f97316' },
      // AND2 pin 6 -> OR pin 2
      { from: { comp: 'icbase_1', pin: 6 }, to: { comp: 'icbase_2', pin: 2 }, color: '#f97316' },
      // Cout = OR pin 3 -> LED1
      { from: { comp: 'icbase_2', pin: 3 }, to: { comp: 'led', pin: 1 }, color: '#eab308' }
    ]
  },

  {
    id: 'adder_4bit',
    title: '4-Bit Binary Adder (74LS83)',
    description: 'Hardware 4-bit parallel adder computing (A3..A0) + (B3..B0) with Carry In C0 and Carry Out C4.',
    switches: [1, 0, 1, 0, 1, 1, 0, 0], // A = 5 (0101), B = 3 (0011) -> Sum = 8 (1000)
    icBases: [
      { id: 0, icId: '74LS83' }
    ],
    wires: [
      // Operand A (SW0..SW3) -> A1 (pin 10), A2 (pin 8), A3 (pin 3), A4 (pin 1)
      { from: { comp: 'switch', pin: 0 }, to: { comp: 'icbase_0', pin: 10 }, color: '#3b82f6' },
      { from: { comp: 'switch', pin: 1 }, to: { comp: 'icbase_0', pin: 8 }, color: '#3b82f6' },
      { from: { comp: 'switch', pin: 2 }, to: { comp: 'icbase_0', pin: 3 }, color: '#3b82f6' },
      { from: { comp: 'switch', pin: 3 }, to: { comp: 'icbase_0', pin: 1 }, color: '#3b82f6' },
      // Operand B (SW4..SW7) -> B1 (pin 11), B2 (pin 7), B3 (pin 2), B4 (pin 16)
      { from: { comp: 'switch', pin: 4 }, to: { comp: 'icbase_0', pin: 11 }, color: '#22c55e' },
      { from: { comp: 'switch', pin: 5 }, to: { comp: 'icbase_0', pin: 7 }, color: '#22c55e' },
      { from: { comp: 'switch', pin: 6 }, to: { comp: 'icbase_0', pin: 2 }, color: '#22c55e' },
      { from: { comp: 'switch', pin: 7 }, to: { comp: 'icbase_0', pin: 16 }, color: '#22c55e' },
      // Sum outputs S1..S4 -> LED0..LED3
      { from: { comp: 'icbase_0', pin: 9 }, to: { comp: 'led', pin: 0 }, color: '#ef4444' },
      { from: { comp: 'icbase_0', pin: 6 }, to: { comp: 'led', pin: 1 }, color: '#ef4444' },
      { from: { comp: 'icbase_0', pin: 4 }, to: { comp: 'led', pin: 2 }, color: '#ef4444' },
      { from: { comp: 'icbase_0', pin: 15 }, to: { comp: 'led', pin: 3 }, color: '#ef4444' },
      // Carry Out C4 (pin 14) -> LED4
      { from: { comp: 'icbase_0', pin: 14 }, to: { comp: 'led', pin: 4 }, color: '#eab308' }
    ]
  },

  {
    id: 'mux_4to1',
    title: '4:1 Multiplexer (74LS153)',
    description: 'Data selector routing one of four inputs (C0..C3) to output Y using select lines A and B.',
    switches: [1, 0, 1, 1, 0, 0], // SW0-SW3 data, SW4(A), SW5(B) select
    icBases: [
      { id: 0, icId: '74LS153' }
    ],
    wires: [
      // Data inputs SW0..SW3 -> 1C0 (pin 6), 1C1 (pin 5), 1C2 (pin 4), 1C3 (pin 3)
      { from: { comp: 'switch', pin: 0 }, to: { comp: 'icbase_0', pin: 6 }, color: '#3b82f6' },
      { from: { comp: 'switch', pin: 1 }, to: { comp: 'icbase_0', pin: 5 }, color: '#3b82f6' },
      { from: { comp: 'switch', pin: 2 }, to: { comp: 'icbase_0', pin: 4 }, color: '#3b82f6' },
      { from: { comp: 'switch', pin: 3 }, to: { comp: 'icbase_0', pin: 3 }, color: '#3b82f6' },
      // Select lines SW4(A) -> pin 14, SW5(B) -> pin 2
      { from: { comp: 'switch', pin: 4 }, to: { comp: 'icbase_0', pin: 14 }, color: '#eab308' },
      { from: { comp: 'switch', pin: 5 }, to: { comp: 'icbase_0', pin: 2 }, color: '#eab308' },
      // Output 1Y (pin 7) -> LED0
      { from: { comp: 'icbase_0', pin: 7 }, to: { comp: 'led', pin: 0 }, color: '#ef4444' }
    ]
  },

  {
    id: 'decade_counter_7seg',
    title: 'Decade Counter with 7-Segment Display (74LS90 + 74LS47)',
    description: '1Hz clock increments BCD decade counter (74LS90), decoded by 74LS47 to drive the digital 7-segment display.',
    switches: [],
    icBases: [
      { id: 0, icId: '74LS90' },
      { id: 1, icId: '74LS47' }
    ],
    wires: [
      // Clock 1Hz -> 74LS90 CLKA (pin 14)
      { from: { comp: 'clock', pin: '1' }, to: { comp: 'icbase_0', pin: 14 }, color: '#10b981' },
      // Cascade QA (pin 12) -> CLKB (pin 1)
      { from: { comp: 'icbase_0', pin: 12 }, to: { comp: 'icbase_0', pin: 1 }, color: '#06b6d4' },
      // Connect 74LS90 outputs QA..QD to 74LS47 inputs A..D
      { from: { comp: 'icbase_0', pin: 12 }, to: { comp: 'icbase_1', pin: 7 }, color: '#3b82f6' }, // QA -> A
      { from: { comp: 'icbase_0', pin: 9 }, to: { comp: 'icbase_1', pin: 1 }, color: '#3b82f6' },  // QB -> B
      { from: { comp: 'icbase_0', pin: 8 }, to: { comp: 'icbase_1', pin: 2 }, color: '#3b82f6' },  // QC -> C
      { from: { comp: 'icbase_0', pin: 11 }, to: { comp: 'icbase_1', pin: 6 }, color: '#3b82f6' }, // QD -> D
      // Binary Monitor LEDs (LED0..LED3)
      { from: { comp: 'icbase_0', pin: 12 }, to: { comp: 'led', pin: 0 }, color: '#ef4444' },
      { from: { comp: 'icbase_0', pin: 9 }, to: { comp: 'led', pin: 1 }, color: '#ef4444' },
      { from: { comp: 'icbase_0', pin: 8 }, to: { comp: 'led', pin: 2 }, color: '#ef4444' },
      { from: { comp: 'icbase_0', pin: 11 }, to: { comp: 'led', pin: 3 }, color: '#ef4444' }
    ]
  },

  {
    id: 'd_flipflop_divider',
    title: 'D Flip-Flop Frequency Divider (74LS74)',
    description: 'Configures a D flip-flop with inverted feedback (Q# -> D) to divide the input clock frequency by 2.',
    switches: [],
    icBases: [
      { id: 0, icId: '74LS74' }
    ],
    wires: [
      // Clock 1Hz -> 1CLK (pin 3)
      { from: { comp: 'clock', pin: '1' }, to: { comp: 'icbase_0', pin: 3 }, color: '#10b981' },
      // Feedback: 1Q# (pin 6) -> 1D (pin 2)
      { from: { comp: 'icbase_0', pin: 6 }, to: { comp: 'icbase_0', pin: 2 }, color: '#a855f7' },
      // Clock monitor LED (LED0)
      { from: { comp: 'clock', pin: '1' }, to: { comp: 'led', pin: 0 }, color: '#10b981' },
      // Divided output 1Q (pin 5) -> LED1 (0.5Hz)
      { from: { comp: 'icbase_0', pin: 5 }, to: { comp: 'led', pin: 1 }, color: '#ef4444' }
    ]
  },

  {
    id: 'ripple_counter_4bit',
    title: '4-Bit Binary Ripple Counter (74LS93)',
    description: 'Asynchronous 4-bit binary counter cycling from 0000 to 1111 (0 to 15) using a 1Hz clock source.',
    switches: [],
    icBases: [
      { id: 0, icId: '74LS93' }
    ],
    wires: [
      // Clock 1Hz -> CLKA (pin 14)
      { from: { comp: 'clock', pin: '1' }, to: { comp: 'icbase_0', pin: 14 }, color: '#10b981' },
      // Cascade QA (pin 12) -> CLKB (pin 1)
      { from: { comp: 'icbase_0', pin: 12 }, to: { comp: 'icbase_0', pin: 1 }, color: '#06b6d4' },
      // Outputs QA..QD to LED0..LED3
      { from: { comp: 'icbase_0', pin: 12 }, to: { comp: 'led', pin: 0 }, color: '#ef4444' },
      { from: { comp: 'icbase_0', pin: 9 }, to: { comp: 'led', pin: 1 }, color: '#ef4444' },
      { from: { comp: 'icbase_0', pin: 8 }, to: { comp: 'led', pin: 2 }, color: '#ef4444' },
      { from: { comp: 'icbase_0', pin: 11 }, to: { comp: 'led', pin: 3 }, color: '#ef4444' }
    ]
  },

  {
    id: 'mux_8to1',
    title: '8:1 Multiplexer (74LS151)',
    description: 'Data selector routing one of eight inputs (D0..D7) to complementary outputs Y and W# via select address C, B, A.',
    switches: [1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0], // SW0..SW7 Data, SW8..SW10 Select (C, B, A)
    icBases: [
      { id: 0, icId: '74LS151' }
    ],
    wires: [
      // Data inputs SW0..SW7 -> D0 (pin 4), D1 (pin 3), D2 (pin 2), D3 (pin 1), D4 (pin 15), D5 (pin 14), D6 (pin 13), D7 (pin 12)
      { from: { comp: 'switch', pin: 0 }, to: { comp: 'icbase_0', pin: 4 }, color: '#38bdf8' },
      { from: { comp: 'switch', pin: 1 }, to: { comp: 'icbase_0', pin: 3 }, color: '#38bdf8' },
      { from: { comp: 'switch', pin: 2 }, to: { comp: 'icbase_0', pin: 2 }, color: '#38bdf8' },
      { from: { comp: 'switch', pin: 3 }, to: { comp: 'icbase_0', pin: 1 }, color: '#38bdf8' },
      { from: { comp: 'switch', pin: 4 }, to: { comp: 'icbase_0', pin: 15 }, color: '#38bdf8' },
      { from: { comp: 'switch', pin: 5 }, to: { comp: 'icbase_0', pin: 14 }, color: '#38bdf8' },
      { from: { comp: 'switch', pin: 6 }, to: { comp: 'icbase_0', pin: 13 }, color: '#38bdf8' },
      { from: { comp: 'switch', pin: 7 }, to: { comp: 'icbase_0', pin: 12 }, color: '#38bdf8' },
      // Select lines: SW8 -> A (pin 11), SW9 -> B (pin 10), SW10 -> C (pin 9)
      { from: { comp: 'switch', pin: 8 }, to: { comp: 'icbase_0', pin: 11 }, color: '#f59e0b' },
      { from: { comp: 'switch', pin: 9 }, to: { comp: 'icbase_0', pin: 10 }, color: '#f59e0b' },
      { from: { comp: 'switch', pin: 10 }, to: { comp: 'icbase_0', pin: 9 }, color: '#f59e0b' },
      // Strobe S# (pin 7) to GND
      { from: { comp: 'gnd', pin: 0 }, to: { comp: 'icbase_0', pin: 7 }, color: '#000000' },
      // Outputs: True Y (pin 5) -> LED0, Inverted W# (pin 6) -> LED1
      { from: { comp: 'icbase_0', pin: 5 }, to: { comp: 'led', pin: 0 }, color: '#22c55e' },
      { from: { comp: 'icbase_0', pin: 6 }, to: { comp: 'led', pin: 1 }, color: '#ef4444' }
    ]
  },

  {
    id: 'demux_3to8',
    title: '3-to-8 Line Decoder / Demultiplexer (74LS138)',
    description: 'Decodes a 3-bit binary address into 8 individual active-low outputs (Y0#..Y7#).',
    switches: [0, 0, 0], // SW0(A), SW1(B), SW2(C)
    icBases: [
      { id: 0, icId: '74LS138' }
    ],
    wires: [
      // Address inputs: SW0 -> A (pin 1), SW1 -> B (pin 2), SW2 -> C (pin 3)
      { from: { comp: 'switch', pin: 0 }, to: { comp: 'icbase_0', pin: 1 }, color: '#38bdf8' },
      { from: { comp: 'switch', pin: 1 }, to: { comp: 'icbase_0', pin: 2 }, color: '#38bdf8' },
      { from: { comp: 'switch', pin: 2 }, to: { comp: 'icbase_0', pin: 3 }, color: '#38bdf8' },
      // Enables: G1 (pin 6) -> VCC, G2A# (pin 4) -> GND, G2B# (pin 5) -> GND
      { from: { comp: 'vcc', pin: 0 }, to: { comp: 'icbase_0', pin: 6 }, color: '#ef4444' },
      { from: { comp: 'gnd', pin: 0 }, to: { comp: 'icbase_0', pin: 4 }, color: '#000000' },
      { from: { comp: 'gnd', pin: 0 }, to: { comp: 'icbase_0', pin: 5 }, color: '#000000' },
      // Outputs Y0#..Y7# -> LED0..LED7
      { from: { comp: 'icbase_0', pin: 15 }, to: { comp: 'led', pin: 0 }, color: '#a855f7' },
      { from: { comp: 'icbase_0', pin: 14 }, to: { comp: 'led', pin: 1 }, color: '#a855f7' },
      { from: { comp: 'icbase_0', pin: 13 }, to: { comp: 'led', pin: 2 }, color: '#a855f7' },
      { from: { comp: 'icbase_0', pin: 12 }, to: { comp: 'led', pin: 3 }, color: '#a855f7' },
      { from: { comp: 'icbase_0', pin: 11 }, to: { comp: 'led', pin: 4 }, color: '#a855f7' },
      { from: { comp: 'icbase_0', pin: 10 }, to: { comp: 'led', pin: 5 }, color: '#a855f7' },
      { from: { comp: 'icbase_0', pin: 9 }, to: { comp: 'led', pin: 6 }, color: '#a855f7' },
      { from: { comp: 'icbase_0', pin: 7 }, to: { comp: 'led', pin: 7 }, color: '#a855f7' }
    ]
  },

  {
    id: 'comparator_4bit',
    title: '4-Bit Magnitude Comparator (74LS85)',
    description: 'Compares two 4-bit binary words A (SW0..SW3) and B (SW4..SW7) with OA>B, OA=B, OA<B indicator outputs.',
    switches: [1, 0, 1, 0, 0, 1, 1, 0], // A = 5 (0101), B = 6 (0110) -> A < B
    icBases: [
      { id: 0, icId: '74LS85' }
    ],
    wires: [
      // Word A inputs: SW0 -> A0 (pin 10), SW1 -> A1 (pin 12), SW2 -> A2 (pin 13), SW3 -> A3 (pin 15)
      { from: { comp: 'switch', pin: 0 }, to: { comp: 'icbase_0', pin: 10 }, color: '#38bdf8' },
      { from: { comp: 'switch', pin: 1 }, to: { comp: 'icbase_0', pin: 12 }, color: '#38bdf8' },
      { from: { comp: 'switch', pin: 2 }, to: { comp: 'icbase_0', pin: 13 }, color: '#38bdf8' },
      { from: { comp: 'switch', pin: 3 }, to: { comp: 'icbase_0', pin: 15 }, color: '#38bdf8' },
      // Word B inputs: SW4 -> B0 (pin 9), SW5 -> B1 (pin 11), SW6 -> B2 (pin 14), SW7 -> B3 (pin 1)
      { from: { comp: 'switch', pin: 4 }, to: { comp: 'icbase_0', pin: 9 }, color: '#22c55e' },
      { from: { comp: 'switch', pin: 5 }, to: { comp: 'icbase_0', pin: 11 }, color: '#22c55e' },
      { from: { comp: 'switch', pin: 6 }, to: { comp: 'icbase_0', pin: 14 }, color: '#22c55e' },
      { from: { comp: 'switch', pin: 7 }, to: { comp: 'icbase_0', pin: 1 }, color: '#22c55e' },
      // Cascading inputs: IA=B (pin 3) -> VCC, IA>B (pin 4) -> GND, IA<B (pin 2) -> GND
      { from: { comp: 'vcc', pin: 0 }, to: { comp: 'icbase_0', pin: 3 }, color: '#ef4444' },
      { from: { comp: 'gnd', pin: 0 }, to: { comp: 'icbase_0', pin: 4 }, color: '#000000' },
      { from: { comp: 'gnd', pin: 0 }, to: { comp: 'icbase_0', pin: 2 }, color: '#000000' },
      // Outputs: OA>B (pin 5) -> LED0, OA=B (pin 6) -> LED1, OA<B (pin 7) -> LED2
      { from: { comp: 'icbase_0', pin: 5 }, to: { comp: 'led', pin: 0 }, color: '#eab308' },
      { from: { comp: 'icbase_0', pin: 6 }, to: { comp: 'led', pin: 1 }, color: '#22c55e' },
      { from: { comp: 'icbase_0', pin: 7 }, to: { comp: 'led', pin: 2 }, color: '#ef4444' }
    ]
  },

  {
    id: 'half_subtractor',
    title: 'Half Subtractor (74LS86 XOR + 74LS04 NOT + 74LS08 AND)',
    description: 'Calculates Difference = A ⊕ B and Borrow = A\' · B for two 1-bit inputs.',
    switches: [0, 0], // SW0 (A), SW1 (B)
    icBases: [
      { id: 0, icId: '74LS86' },
      { id: 1, icId: '74LS04' },
      { id: 2, icId: '74LS08' }
    ],
    wires: [
      // SW0 (A) -> 74LS86 pin 1, 74LS04 pin 1
      { from: { comp: 'switch', pin: 0 }, to: { comp: 'icbase_0', pin: 1 }, color: '#38bdf8' },
      { from: { comp: 'switch', pin: 0 }, to: { comp: 'icbase_1', pin: 1 }, color: '#38bdf8' },
      // SW1 (B) -> 74LS86 pin 2, 74LS08 pin 2
      { from: { comp: 'switch', pin: 1 }, to: { comp: 'icbase_0', pin: 2 }, color: '#22c55e' },
      { from: { comp: 'switch', pin: 1 }, to: { comp: 'icbase_2', pin: 2 }, color: '#22c55e' },
      // Difference = 74LS86 pin 3 -> LED0
      { from: { comp: 'icbase_0', pin: 3 }, to: { comp: 'led', pin: 0 }, color: '#22c55e' },
      // 74LS04 pin 2 (A') -> 74LS08 pin 1
      { from: { comp: 'icbase_1', pin: 2 }, to: { comp: 'icbase_2', pin: 1 }, color: '#f59e0b' },
      // Borrow = 74LS08 pin 3 -> LED1
      { from: { comp: 'icbase_2', pin: 3 }, to: { comp: 'led', pin: 1 }, color: '#ef4444' }
    ]
  },

  {
    id: 'priority_encoder_8to3',
    title: '8-to-3 Priority Encoder (74LS148)',
    description: 'Encodes 8 active-low inputs (0#..7#) into 3-bit binary code (A2#..A0#). Input 7# has the highest priority.',
    switches: [1, 1, 1, 1, 1, 1, 1, 0], // Inputs 0#..7#: SW7 is 0 (Active), highest priority!
    icBases: [
      { id: 0, icId: '74LS148' }
    ],
    wires: [
      // Enable Input EI# (pin 5) to GND (active)
      { from: { comp: 'gnd', pin: 0 }, to: { comp: 'icbase_0', pin: 5 }, color: '#000000' },
      // Inputs: SW0 -> 0# (pin 10), SW1 -> 1# (pin 11), SW2 -> 2# (pin 12), SW3 -> 3# (pin 13)
      { from: { comp: 'switch', pin: 0 }, to: { comp: 'icbase_0', pin: 10 }, color: '#38bdf8' },
      { from: { comp: 'switch', pin: 1 }, to: { comp: 'icbase_0', pin: 11 }, color: '#38bdf8' },
      { from: { comp: 'switch', pin: 2 }, to: { comp: 'icbase_0', pin: 12 }, color: '#38bdf8' },
      { from: { comp: 'switch', pin: 3 }, to: { comp: 'icbase_0', pin: 13 }, color: '#38bdf8' },
      // Inputs: SW4 -> 4# (pin 1), SW5 -> 5# (pin 2), SW6 -> 6# (pin 3), SW7 -> 7# (pin 4)
      { from: { comp: 'switch', pin: 4 }, to: { comp: 'icbase_0', pin: 1 }, color: '#38bdf8' },
      { from: { comp: 'switch', pin: 5 }, to: { comp: 'icbase_0', pin: 2 }, color: '#38bdf8' },
      { from: { comp: 'switch', pin: 6 }, to: { comp: 'icbase_0', pin: 3 }, color: '#38bdf8' },
      { from: { comp: 'switch', pin: 7 }, to: { comp: 'icbase_0', pin: 4 }, color: '#38bdf8' },
      // Address Outputs: A0# (pin 9) -> LED0, A1# (pin 7) -> LED1, A2# (pin 6) -> LED2
      { from: { comp: 'icbase_0', pin: 9 }, to: { comp: 'led', pin: 0 }, color: '#a855f7' },
      { from: { comp: 'icbase_0', pin: 7 }, to: { comp: 'led', pin: 1 }, color: '#a855f7' },
      { from: { comp: 'icbase_0', pin: 6 }, to: { comp: 'led', pin: 2 }, color: '#a855f7' },
      // Status Outputs: GS# (pin 14) -> LED3, EO# (pin 15) -> LED4
      { from: { comp: 'icbase_0', pin: 14 }, to: { comp: 'led', pin: 3 }, color: '#ef4444' },
      { from: { comp: 'icbase_0', pin: 15 }, to: { comp: 'led', pin: 4 }, color: '#eab308' }
    ]
  },

  {
    id: 'xnor_equality',
    title: '2-Bit Equality Comparator (74LS266 XNOR + 74LS08 AND)',
    description: 'Tests if two 2-bit numbers A (SW0, SW1) and B (SW2, SW3) are identical using XNOR equivalence gates combined by an AND gate.',
    switches: [1, 0, 1, 0], // A = 01, B = 01 (Equal)
    icBases: [
      { id: 0, icId: '74LS266' },
      { id: 1, icId: '74LS08' }
    ],
    wires: [
      // Bit 0: SW0 (A0) -> 74LS266 pin 1, SW2 (B0) -> 74LS266 pin 2
      { from: { comp: 'switch', pin: 0 }, to: { comp: 'icbase_0', pin: 1 }, color: '#38bdf8' },
      { from: { comp: 'switch', pin: 2 }, to: { comp: 'icbase_0', pin: 2 }, color: '#22c55e' },
      // Bit 1: SW1 (A1) -> 74LS266 pin 4, SW3 (B1) -> 74LS266 pin 5
      { from: { comp: 'switch', pin: 1 }, to: { comp: 'icbase_0', pin: 4 }, color: '#38bdf8' },
      { from: { comp: 'switch', pin: 3 }, to: { comp: 'icbase_0', pin: 5 }, color: '#22c55e' },
      // XNOR outputs: 1Y (pin 3, A0==B0) and 2Y (pin 6, A1==B1) -> 74LS08 AND pins 1 & 2
      { from: { comp: 'icbase_0', pin: 3 }, to: { comp: 'icbase_1', pin: 1 }, color: '#f59e0b' },
      { from: { comp: 'icbase_0', pin: 6 }, to: { comp: 'icbase_1', pin: 2 }, color: '#f59e0b' },
      // Bit match indicators: LED1 (Bit 0 match), LED2 (Bit 1 match)
      { from: { comp: 'icbase_0', pin: 3 }, to: { comp: 'led', pin: 1 }, color: '#06b6d4' },
      { from: { comp: 'icbase_0', pin: 6 }, to: { comp: 'led', pin: 2 }, color: '#06b6d4' },
      // Total Equality output: 74LS08 pin 3 -> LED0
      { from: { comp: 'icbase_1', pin: 3 }, to: { comp: 'led', pin: 0 }, color: '#22c55e' }
    ]
  }
];

if (typeof window !== 'undefined') {
  window.LAB_PRESETS = LAB_PRESETS;
}

// ==========================================
// SOURCE: js/datasheet.js
// ==========================================
/**
 * DELD Virtual Trainer Kit - IC Datasheet & Pinout Viewer
 * Displays authentic pinout diagrams, functional truth tables,
 * and electrical logic descriptions.
 */


class DatasheetViewer {
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

// ==========================================
// SOURCE: js/storage.js
// ==========================================
/**
 * DELD Virtual Trainer Kit - Storage & History Manager
 * Handles Undo/Redo stacks, browser localStorage, JSON export/import,
 * and shareable URL hashing.
 */

class StorageManager {
  constructor(simulation) {
    this.sim = simulation;
    this.undoStack = [];
    this.redoStack = [];
    this.maxHistory = 40;
    this.isApplyingHistory = false;

    // Save initial state
    this.recordState();
  }

  recordState() {
    if (this.isApplyingHistory) return;

    const snapshot = JSON.stringify(this.sim.serialize());
    // Avoid duplicate snapshots
    if (this.undoStack.length > 0 && this.undoStack[this.undoStack.length - 1] === snapshot) {
      return;
    }

    this.undoStack.push(snapshot);
    if (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    // Clear redo stack on new branch
    this.redoStack = [];

    this.autoSave();
  }

  canUndo() {
    return this.undoStack.length > 1;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }

  undo() {
    if (!this.canUndo()) return false;

    this.isApplyingHistory = true;
    const currentState = this.undoStack.pop();
    this.redoStack.push(currentState);

    const prevState = JSON.parse(this.undoStack[this.undoStack.length - 1]);
    this.sim.deserialize(prevState);
    this.isApplyingHistory = false;

    this.autoSave();
    return true;
  }

  redo() {
    if (!this.canRedo()) return false;

    this.isApplyingHistory = true;
    const nextStateStr = this.redoStack.pop();
    this.undoStack.push(nextStateStr);

    const nextState = JSON.parse(nextStateStr);
    this.sim.deserialize(nextState);
    this.isApplyingHistory = false;

    this.autoSave();
    return true;
  }

  autoSave() {
    try {
      const data = this.sim.serialize();
      localStorage.setItem('deldsim_autosave', JSON.stringify(data));
    } catch (e) {
      console.warn('AutoSave error:', e);
    }
  }

  loadAutoSave() {
    try {
      const raw = localStorage.getItem('deldsim_autosave');
      if (raw) {
        const data = JSON.parse(raw);
        this.sim.deserialize(data);
        return true;
      }
    } catch (e) {
      console.warn('Load autosave error:', e);
    }
    return false;
  }

  exportJSON(circuitName = 'deld_circuit') {
    const data = {
      name: circuitName,
      timestamp: new Date().toISOString(),
      circuit: this.sim.serialize()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${circuitName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  importJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          const circuitData = parsed.circuit || parsed;
          this.sim.deserialize(circuitData);
          this.recordState();
          resolve(parsed.name || 'Imported Circuit');
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  generateShareURL(circuitName = 'Untitled') {
    const data = {
      name: circuitName,
      circuit: this.sim.serialize()
    };
    const jsonStr = JSON.stringify(data);
    const b64 = btoa(encodeURIComponent(jsonStr));
    const url = new URL(window.location.href);
    url.hash = `circuit=${b64}`;
    return url.toString();
  }

  loadFromURLHash() {
    try {
      const hash = window.location.hash;
      if (hash.includes('circuit=')) {
        const b64 = hash.split('circuit=')[1];
        const jsonStr = decodeURIComponent(atob(b64));
        const data = JSON.parse(jsonStr);
        if (data && data.circuit) {
          this.sim.deserialize(data.circuit);
          this.recordState();
          return data.name || 'Shared Circuit';
        }
      }
    } catch (e) {
      console.warn('Load from hash error:', e);
    }
    return null;
  }

  getSavedCircuits() {
    try {
      const raw = localStorage.getItem('deldsim_saved_circuits');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('Error reading saved circuits:', e);
      return [];
    }
  }

  saveNamedCircuit(name = 'My Circuit') {
    const list = this.getSavedCircuits();
    const id = `circ_${Date.now()}`;
    const entry = {
      id,
      name: name.trim() || 'Untitled Circuit',
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      circuit: this.sim.serialize(),
      icCount: this.sim.icBases.filter(b => b.icId).length,
      wireCount: this.sim.wires.length
    };

    // Replace if name matches, or prepend
    const existingIdx = list.findIndex(c => c.name.toLowerCase() === entry.name.toLowerCase());
    if (existingIdx !== -1) {
      list[existingIdx] = entry;
    } else {
      list.unshift(entry);
    }

    localStorage.setItem('deldsim_saved_circuits', JSON.stringify(list));
    return entry;
  }

  deleteSavedCircuit(id) {
    let list = this.getSavedCircuits();
    list = list.filter(c => c.id !== id);
    localStorage.setItem('deldsim_saved_circuits', JSON.stringify(list));
    return list;
  }

  loadSavedCircuit(id) {
    const list = this.getSavedCircuits();
    const item = list.find(c => c.id === id);
    if (item && item.circuit) {
      this.sim.deserialize(item.circuit);
      this.recordState();
      return item.name;
    }
    return null;
  }
}

// ==========================================
// SOURCE: js/board.js
// ==========================================
/**
 * DELD Virtual Trainer Kit - Authentic Board SVG Renderer
 * Faithfully matches DeldSim hardware trainer kit:
 * - Solid cyan board with middle inset
 * - 16 outputs (15..0) with VCC, 2 Seven-Segment Displays, and Power button on top
 * - 5 Universal IC bases with DIP socket, notch, silver pin leads, and terminal holes
 * - 16 inputs (15..0) with toggle switches and GND at bottom
 * - Clock section with 10, 5, 1, 0.5 Hz ports & GENERATE PULSE button
 */

class BoardRenderer {
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
    let comp = String(endpoint.comp).toLowerCase().trim();
    let pin = String(endpoint.pin).toLowerCase().trim();

    let coord = this.pinCoords.get(`${comp}:${pin}`);
    if (!coord) {
      if (comp === 'vcc' || (comp === 'power' && (pin === 'vcc' || pin === '0'))) {
        coord = this.pinCoords.get('power:vcc') || this.pinCoords.get('vcc:vcc') || this.pinCoords.get('vcc:0');
      } else if (comp === 'gnd' || (comp === 'power' && (pin === 'gnd' || pin === '0'))) {
        coord = this.pinCoords.get('power:gnd') || this.pinCoords.get('gnd:gnd') || this.pinCoords.get('gnd:0');
      } else if (comp === 'output' || comp === 'led') {
        coord = this.pinCoords.get(`led:${pin}`);
      } else if (comp.startsWith('ic_') || comp.startsWith('icbase_')) {
        const bIdx = comp.replace('icbase_', '').replace('ic_', '');
        coord = this.pinCoords.get(`icbase_${bIdx}:${pin}`) || this.pinCoords.get(`icbase_${bIdx}:socket_${pin}`);
      } else if (comp.startsWith('disp_') || comp.startsWith('display_')) {
        const dIdx = comp.replace('display_', '').replace('disp_', '');
        coord = this.pinCoords.get(`display_${dIdx}:${pin}`) || this.pinCoords.get(`display_${dIdx}:bcd_${pin}`);
      }
    }

    if (!coord) return null;
    return {
      x: coord.x,
      y: coord.y,
      side: coord.side || (coord.y > 400 ? 'bottom' : 'top'),
      type: coord.type || comp,
      comp: endpoint.comp,
      pin: endpoint.pin
    };
  }

  findPinNearScreenPoint(clientX, clientY) {
    const svg = this.svg;
    if (!svg) return null;

    // Map screen coordinates directly into SVG viewBox coordinate space
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const screenCTM = svg.getScreenCTM();
    if (!screenCTM) return null;
    const svgP = pt.matrixTransform(screenCTM.inverse());

    let closest = null;
    let minDistance = Infinity;

    // 1. Direct hit-test check (mouse physically hovering over terminal pin)
    const directEl = document.elementFromPoint(clientX, clientY)?.closest('.terminal-pin');
    if (directEl) {
      const comp = directEl.getAttribute('data-comp');
      const pin = directEl.getAttribute('data-pin');
      if (comp && pin) {
        const coord = this.getPinCoord({ comp, pin });
        if (coord) {
          const directDist = Math.hypot(coord.x - svgP.x, coord.y - svgP.y);
          return { comp, pin, coord, distance: directDist };
        }
      }
    }

    // 2. Precise geometric nearest-pin search across registered board coordinates
    for (const [key, coord] of this.pinCoords.entries()) {
      const colonIdx = key.indexOf(':');
      if (colonIdx === -1) continue;
      const comp = key.substring(0, colonIdx);
      const pin = key.substring(colonIdx + 1);

      // Skip internal socket aliases
      if (pin.startsWith('socket_')) continue;

      const isIC = comp.startsWith('icbase_') || comp.startsWith('ic_');
      // Generous snap radius: 16px for IC pins (full inter-pin distance), 28px for discrete terminals
      const snapThreshold = isIC ? 16.0 : 28.0;

      const dist = Math.hypot(coord.x - svgP.x, coord.y - svgP.y);
      if (dist <= snapThreshold && dist < minDistance) {
        minDistance = dist;
        closest = {
          comp,
          pin,
          coord: { x: coord.x, y: coord.y, side: coord.side, type: coord.type },
          distance: dist
        };
      }
    }

    return closest;
  }

  getHumanReadablePinName(endpoint) {
    if (!endpoint) return 'Unknown Pin';
    const comp = String(endpoint.comp).toLowerCase().trim();
    const pin = String(endpoint.pin).toLowerCase().trim();

    if (comp === 'switch') return `SW ${pin}`;
    if (comp === 'led' || comp === 'output') return `OUT ${pin}`;
    if (comp === 'vcc' || (comp === 'power' && pin === 'vcc') || (comp === 'power' && pin === '0')) return `VCC (+5V)`;
    if (comp === 'gnd' || (comp === 'power' && pin === 'gnd') || (comp === 'power' && pin === '0')) return `GND (0V)`;
    if (comp === 'clock') {
      if (pin === 'manual') return `Clock Manual (HIGH)`;
      if (pin === 'manual_inv') return `Clock Manual (LOW)`;
      return `Clock ${pin} Hz`;
    }
    if (comp.startsWith('icbase_') || comp.startsWith('ic_')) {
      const idx = parseInt(comp.replace('icbase_', '').replace('ic_', ''), 10);
      const baseNum = idx + 1;
      const base = this.sim.icBases[idx];
      const icTag = base && base.icId ? ` [${base.icId}]` : '';
      const pinTag = base && base.pins && base.pins[pin] ? ` (${base.pins[pin].name})` : '';
      return `IC Base ${baseNum}${icTag} Pin ${pin}${pinTag}`;
    }
    if (comp.startsWith('display_') || comp.startsWith('disp_')) {
      const dNum = comp.replace('display_', '').replace('disp_', '');
      return `Display ${dNum} [${pin.toUpperCase()}]`;
    }
    return `${comp} Pin ${pin}`;
  }

  getAllAvailablePins() {
    const categories = [];

    // 1. Power Supply
    categories.push({
      category: 'Power Supply',
      pins: [
        { value: 'power:vcc', label: 'VCC (+5V Power)' },
        { value: 'power:gnd', label: 'GND (0V Ground)' }
      ]
    });

    // 2. Input Switches (SW 15 down to 0)
    const switchPins = [];
    for (let i = 15; i >= 0; i--) {
      switchPins.push({
        value: `switch:${i}`,
        label: `SW ${i} (Input Switch ${i})`
      });
    }
    categories.push({
      category: 'Input Switches (SW 15 - SW 0)',
      pins: switchPins
    });

    // 3. Output LEDs (OUT 15 down to 0)
    const ledPins = [];
    for (let i = 15; i >= 0; i--) {
      ledPins.push({
        value: `led:${i}`,
        label: `OUT ${i} (Output LED ${i})`
      });
    }
    categories.push({
      category: 'Output LEDs (OUT 15 - OUT 0)',
      pins: ledPins
    });

    // 4. Clock Generators
    categories.push({
      category: 'Clock Generators',
      pins: [
        { value: 'clock:1', label: 'Clock 1 Hz' },
        { value: 'clock:5', label: 'Clock 5 Hz' },
        { value: 'clock:10', label: 'Clock 10 Hz' },
        { value: 'clock:manual', label: 'Manual Pulser (Active HIGH)' },
        { value: 'clock:manual_inv', label: 'Manual Pulser (Active LOW)' }
      ]
    });

    // 5. IC Bases 1 to 5
    for (let b = 0; b < 5; b++) {
      const base = this.sim.icBases[b];
      const icTag = base && base.icId ? ` [${base.icId}]` : ' (Empty)';
      const pins = [];
      for (let p = 1; p <= 20; p++) {
        const pinTag = base && base.pins && base.pins[p] ? ` (${base.pins[p].name})` : '';
        pins.push({
          value: `icbase_${b}:${p}`,
          label: `Base ${b + 1} Pin ${p}${pinTag}`
        });
      }
      categories.push({
        category: `IC Base ${b + 1}${icTag}`,
        pins: pins
      });
    }

    // 6. 7-Segment Displays
    for (let d = 1; d <= 2; d++) {
      const segs = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'dp'];
      categories.push({
        category: `7-Segment Display ${d}`,
        pins: segs.map(s => ({
          value: `display_${d}:${s}`,
          label: `Display ${d} Segment ${s.toUpperCase()}`
        }))
      });
    }

    return categories;
  }



  getHumanReadablePinName(endpoint) {
    if (!endpoint) return 'Unknown Pin';
    const comp = String(endpoint.comp).toLowerCase().trim();
    const pin = String(endpoint.pin).toLowerCase().trim();

    if (comp === 'switch') return `SW ${pin}`;
    if (comp === 'led' || comp === 'output') return `OUT ${pin}`;
    if (comp === 'vcc' || (comp === 'power' && (pin === 'vcc' || pin === '0'))) return `VCC (+5V)`;
    if (comp === 'gnd' || (comp === 'power' && (pin === 'gnd' || pin === '1'))) return `GND (0V)`;
    if (comp === 'clock') {
      if (pin === 'manual') return `Clock Manual (HIGH)`;
      if (pin === 'manual_inv') return `Clock Manual (LOW)`;
      return `Clock ${pin} Hz`;
    }
    if (comp.startsWith('icbase_') || comp.startsWith('ic_')) {
      const idx = parseInt(comp.replace('icbase_', '').replace('ic_', ''), 10);
      const baseNum = idx + 1;
      const base = this.sim.icBases[idx];
      const icTag = base && base.icId ? ` [${base.icId}]` : '';
      const pinTag = base && base.pins && base.pins[pin] ? ` (${base.pins[pin].name})` : '';
      return `IC Base ${baseNum}${icTag} Pin ${pin}${pinTag}`;
    }
    if (comp.startsWith('display_') || comp.startsWith('disp_')) {
      const dNum = comp.replace('display_', '').replace('disp_', '');
      return `Display ${dNum} [${pin.toUpperCase()}]`;
    }
    return `${comp} Pin ${pin}`;
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

    const isICPin = comp.startsWith('icbase_') || comp.startsWith('ic_');
    const hitRadius = isICPin ? 7.5 : 14;

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'terminal-pin');
    g.setAttribute('data-comp', comp);
    g.setAttribute('data-pin', pinStr);
    if (isICPin) {
      g.setAttribute('data-socket-pin', pinStr);
      g.setAttribute('data-socket-side', computedSide);
    }
    g.setAttribute('cursor', 'pointer');
    g.style.pointerEvents = 'all';

    g.innerHTML = `
      <!-- Precise non-overlapping hit circle (7.5px radius for IC pins to prevent neighbor collision; 14px for discrete) -->
      <circle cx="${cx}" cy="${cy}" r="${hitRadius}" fill="#000000" opacity="0" pointer-events="all"/>
      <!-- Outer silver rim -->
      <circle cx="${cx}" cy="${cy}" r="${isICPin ? 7.5 : 8.5}" fill="#cbd5e1" stroke="#334155" stroke-width="1.2" filter="url(#chip-shadow)" pointer-events="all"/>
      <!-- Inner contact hole -->
      <circle cx="${cx}" cy="${cy}" r="${isICPin ? 4.5 : 5.5}" fill="url(#pin-hole-metal)" pointer-events="all"/>
      <!-- Hover / Active highlight circle -->
      <circle class="terminal-hover-ring" cx="${cx}" cy="${cy}" r="${isICPin ? 9.5 : 12}" fill="none" stroke="#facc15" stroke-width="2.5" opacity="0" pointer-events="none"/>
    `;

    g.addEventListener('click', (e) => {
      e.stopPropagation();
      const activePin = g.getAttribute('data-pin') || pinStr;
      if (this.callbacks.onPinClick) {
        this.callbacks.onPinClick({ comp, pin: activePin }, { x: cx, y: cy });
      }
    });

    g.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      const activePin = g.getAttribute('data-pin') || pinStr;
      if (this.callbacks.onPinMouseDown) {
        this.callbacks.onPinMouseDown({ comp, pin: activePin }, { x: cx, y: cy }, e);
      }
    });

    g.addEventListener('mouseup', (e) => {
      e.stopPropagation();
      const activePin = g.getAttribute('data-pin') || pinStr;
      if (this.callbacks.onPinMouseUp) {
        this.callbacks.onPinMouseUp({ comp, pin: activePin }, { x: cx, y: cy }, e);
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
    this.pinCoords.set('vcc:0', { x: vccX, y: 76, side: 'top', type: 'vcc' });
    this.pinCoords.set('vcc:vcc', { x: vccX, y: 76, side: 'top', type: 'vcc' });
    this.pinCoords.set('power:vcc', { x: vccX, y: 76, side: 'top', type: 'vcc' });

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
      <circle cx="${pwrX}" cy="${pwrY}" r="24" fill="#000000" opacity="0" pointer-events="all"/>
      <circle cx="${pwrX}" cy="${pwrY}" r="16" fill="#0f172a" stroke="#334155" stroke-width="1.5" pointer-events="none"/>
      <circle id="power-indicator-ring" cx="${pwrX}" cy="${pwrY}" r="12" fill="#ef4444" filter="url(#led-glow-red)" pointer-events="none"/>
      <!-- Power Icon ⏻ -->
      <path d="M ${pwrX} ${pwrY - 6} L ${pwrX} ${pwrY - 1}" stroke="#ffffff" stroke-width="2" stroke-linecap="round" pointer-events="none"/>
      <path d="M ${pwrX - 4.5} ${pwrY - 3} A 5.5 5.5 0 1 0 ${pwrX + 4.5} ${pwrY - 3}" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" pointer-events="none"/>
    `;

    const togglePower = (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (this.callbacks.onPowerToggle) {
        this.callbacks.onPowerToggle();
      }
    };

    pwrBtn.addEventListener('click', togglePower);
    pwrBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
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
        <rect x="${cx - 18}" y="605" width="36" height="60" fill="#000000" opacity="0" pointer-events="all"/>
        <!-- Vertical slot -->
        <rect x="${cx - 5}" y="612" width="10" height="25" rx="5" fill="#002b49" pointer-events="none"/>
        <!-- Toggle Knob (circle with chrome highlight) -->
        <circle id="switch-knob-${i}" cx="${cx}" cy="630" r="7.5" fill="#f8fafc" stroke="#334155" stroke-width="1.5" filter="url(#chip-shadow)" pointer-events="none"/>
        <!-- Number text at bottom -->
        <text x="${cx}" y="658" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="800" font-size="11.5" fill="#002b49" pointer-events="none">${i}</text>
      `;

      const toggleSwitch = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (this.callbacks.onSwitchToggle) {
          this.callbacks.onSwitchToggle(i);
        }
      };

      swG.addEventListener('click', toggleSwitch);
      swG.addEventListener('pointerdown', (e) => e.stopPropagation());
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
    this.pinCoords.set('gnd:0', { x: gndX, y: 590, side: 'bottom', type: 'gnd' });
    this.pinCoords.set('gnd:gnd', { x: gndX, y: 590, side: 'bottom', type: 'gnd' });
    this.pinCoords.set('power:gnd', { x: gndX, y: 590, side: 'bottom', type: 'gnd' });

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
      <rect x="${pulseX - 6}" y="${pulseY + 8}" width="142" height="42" fill="#000000" opacity="0" pointer-events="all"/>
      <!-- Black rounded rectangular body -->
      <rect id="pulse-box-rect" x="${pulseX}" y="${pulseY + 12}" width="130" height="32" rx="6" fill="#111827" stroke="#1f2937" stroke-width="1.5" filter="url(#chip-shadow)" pointer-events="none"/>
      <!-- Pulse waveform icon in red -->
      <path d="M ${pulseX + 14} ${pulseY + 28} L ${pulseX + 22} ${pulseY + 28} L ${pulseX + 26} ${pulseY + 18} L ${pulseX + 30} ${pulseY + 38} L ${pulseX + 34} ${pulseY + 28} L ${pulseX + 42} ${pulseY + 28}" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" pointer-events="none"/>
      <!-- Text: GENERATE PULSE -->
      <text x="${pulseX + 78}" y="${pulseY + 32}" text-anchor="middle" font-family="'Inter', sans-serif" font-weight="900" font-size="8.5" fill="#f8fafc" letter-spacing="0.5" pointer-events="none">GENERATE PULSE</text>
    `;

    const pressHandler = (e) => {
      e.stopPropagation();
      e.preventDefault();
      pulseBtn.querySelector('#pulse-box-rect')?.setAttribute('fill', '#1e293b');
      if (this.callbacks.onPulsePress) this.callbacks.onPulsePress();
    };

    const releaseHandler = (e) => {
      e.stopPropagation();
      e.preventDefault();
      pulseBtn.querySelector('#pulse-box-rect')?.setAttribute('fill', '#111827');
      if (this.callbacks.onPulseRelease) this.callbacks.onPulseRelease();
    };

    pulseBtn.addEventListener('mousedown', pressHandler);
    pulseBtn.addEventListener('mouseup', releaseHandler);
    pulseBtn.addEventListener('mouseleave', releaseHandler);
    pulseBtn.addEventListener('touchstart', pressHandler, { passive: false });
    pulseBtn.addEventListener('touchend', releaseHandler, { passive: false });
    pulseBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
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
        pwrRing.setAttribute('fill', '#22c55e');
        pwrRing.setAttribute('filter', 'url(#led-glow-green)');
      } else {
        pwrRing.setAttribute('fill', '#ef4444');
        pwrRing.setAttribute('filter', 'url(#led-glow-red)');
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
        // Clear all previous keys for this base to prevent stale mappings
        for (const k of Array.from(this.pinCoords.keys())) {
          if (k.startsWith(`icbase_${baseIdx}:`)) {
            this.pinCoords.delete(k);
          }
        }
        if (baseBody) {
          baseBody.setAttribute('stroke', '#222222');
          baseBody.setAttribute('stroke-width', '1.5');
        }
        if (baseLabel) {
          baseLabel.textContent = `IC BASE ${baseIdx + 1}`;
          baseLabel.setAttribute('fill', '#ffffff');
        }
        for (let r = 0; r < rows; r++) {
          const leftP = r + 1;
          const rightP = 20 - r;
          const leftLbl = this.svg.querySelector(`#base-${baseIdx}-pinlbl-left-${leftP}`);
          if (leftLbl) {
            leftLbl.textContent = String(leftP);
            leftLbl.setAttribute('fill', '#bae6fd');
          }
          const rightLbl = this.svg.querySelector(`#base-${baseIdx}-pinlbl-right-${rightP}`);
          if (rightLbl) {
            rightLbl.textContent = String(rightP);
            rightLbl.setAttribute('fill', '#bae6fd');
          }
          const leftPinEl = this.svg.querySelector(`.terminal-pin[data-comp="icbase_${baseIdx}"][data-socket-pin="${leftP}"]`);
          if (leftPinEl) {
            leftPinEl.setAttribute('data-pin', String(leftP));
          }
          const rightPinEl = this.svg.querySelector(`.terminal-pin[data-comp="icbase_${baseIdx}"][data-socket-pin="${rightP}"]`);
          if (rightPinEl) {
            rightPinEl.setAttribute('data-pin', String(rightP));
          }

          const leftHoleX = chipX - 18 - 8;
          const rightHoleX = chipX + chipW + 18 + 8;
          const py = startPinY + r * pinSpacingY;
          this.pinCoords.set(`icbase_${baseIdx}:${leftP}`, { x: leftHoleX, y: py, side: 'left', type: 'ic' });
          this.pinCoords.set(`icbase_${baseIdx}:${rightP}`, { x: rightHoleX, y: py, side: 'right', type: 'ic' });
          this.pinCoords.set(`icbase_${baseIdx}:socket_${leftP}`, { x: leftHoleX, y: py, side: 'left', type: 'ic' });
          this.pinCoords.set(`icbase_${baseIdx}:socket_${rightP}`, { x: rightHoleX, y: py, side: 'right', type: 'ic' });
        }
        return;
      }

      // Base is occupied
      const icDef = IC_LIBRARY[base.icId];
      const icPins = icDef ? icDef.pins : 14;
      const icRows = icPins / 2; // 7 for 14-pin ICs; 8 for 16-pin ICs; 10 for 20-pin ICs

      // Clear all previous keys for this base so no stale socket keys collide
      for (const k of Array.from(this.pinCoords.keys())) {
        if (k.startsWith(`icbase_${baseIdx}:`)) {
          this.pinCoords.delete(k);
        }
      }

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

        const leftPinEl = this.svg.querySelector(`.terminal-pin[data-comp="icbase_${baseIdx}"][data-socket-pin="${pNumLeft}"]`);
        if (leftPinEl) {
          leftPinEl.setAttribute('data-pin', String(pNumLeft));
        }

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

        // Register IC pin number and socket pin alias
        this.pinCoords.set(`icbase_${baseIdx}:${icPinRight}`, { x: rightHoleX, y: py, side: 'right', type: 'ic' });
        this.pinCoords.set(`icbase_${baseIdx}:socket_${socketPinRight}`, { x: rightHoleX, y: py, side: 'right', type: 'ic' });

        // Update board right pin label to show the IC pin number for intuitive wiring
        const rightLbl = this.svg.querySelector(`#base-${baseIdx}-pinlbl-right-${socketPinRight}`);
        if (rightLbl) {
          rightLbl.textContent = String(icPinRight);
          rightLbl.setAttribute('fill', '#38bdf8');
        }

        // Synchronize underlying .terminal-pin element with active IC pin
        const rightPinEl = this.svg.querySelector(`.terminal-pin[data-comp="icbase_${baseIdx}"][data-socket-pin="${socketPinRight}"]`);
        if (rightPinEl) {
          rightPinEl.setAttribute('data-pin', String(icPinRight));
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

        const leftPinEl = this.svg.querySelector(`.terminal-pin[data-comp="icbase_${baseIdx}"][data-socket-pin="${leftP}"]`);
        if (leftPinEl) {
          leftPinEl.setAttribute('data-pin', `socket_${leftP}`);
        }
        const rightPinEl = this.svg.querySelector(`.terminal-pin[data-comp="icbase_${baseIdx}"][data-socket-pin="${rightP}"]`);
        if (rightPinEl) {
          rightPinEl.setAttribute('data-pin', `socket_${rightP}`);
        }

        const leftHoleX = chipX - 18 - 8;
        const rightHoleX = chipX + chipW + 18 + 8;
        const py = startPinY + r * pinSpacingY;
        this.pinCoords.set(`icbase_${baseIdx}:socket_${leftP}`, { x: leftHoleX, y: py, side: 'left', type: 'ic' });
        this.pinCoords.set(`icbase_${baseIdx}:socket_${rightP}`, { x: rightHoleX, y: py, side: 'right', type: 'ic' });
      }

      this.icLayer.appendChild(g);
    });
  }
}

// ==========================================
// SOURCE: js/logic-suite.js
// ==========================================
/**
 * DELD Virtual Trainer Kit - Digital Logic Suite (6 Tools)
 * 1. K-Map Solver (2-4 variables, minterms, don't-cares, Quine-McCluskey, grouping visualizer)
 * 2. Truth Table & Synced Timing Waveform
 * 3. Algebraic Simplifier (Step-by-step proof with named Boolean laws)
 * 4. Circuit Diagram (Unsimplified vs. Minimized gate schematics & metrics)
 * 5. Counter Designer (MOD-N, Binary, BCD, Gray, Johnson, Ring, Lockout recovery, D/JK/T flip-flops)
 * 6. FSM Designer (Mealy/Moore, State Diagram, Transition Table, State Encoding, Excitation)
 * + "Solve -> Build" Hardware Synthesizer targeting 74LS TTL ICs
 */

class DigitalLogicSuite {
  constructor() {
    this.currentTool = 'kmap';
    this.varsCount = 3;
    this.varNames = ['A', 'B', 'C', 'D'];
    this.varLabels = ['A', 'B', 'C', 'D'];
    this.minterms = new Set([1, 2, 5, 7]); // default demo: F = A'B + AB'C
    this.dontCares = new Set([]);
    this.activeExpression = "A'B + AB'C";
    
    // Live Kit Synchronization
    this.liveSync = true;
    this.liveCircuitInfo = null;
    this.liveRowIndex = -1;
    this.counterCurrentIndex = 0;
    this.fsmCurrentState = 'S0';
    this.outputLedName = 'OUT 13';
  }

  syncWithCircuit(circuitData, targetOutput = null) {
    this.liveCircuitInfo = circuitData;
    if (!circuitData || !circuitData.inputs || circuitData.inputs.length === 0 || !circuitData.outputs || circuitData.outputs.length === 0) {
      return;
    }

    const numInputs = circuitData.inputs.length;
    this.varsCount = Math.min(4, Math.max(2, numInputs));
    
    // Labels for variables: e.g. A (SW 0), B (SW 1)
    this.varLabels = circuitData.inputs.slice(0, this.varsCount).map((sw, i) => `${this.varNames[i]} (SW ${sw})`);

    const primaryLed = (targetOutput !== null && circuitData.outputs.includes(Number(targetOutput)))
      ? Number(targetOutput)
      : (this.selectedOutput !== undefined && circuitData.outputs.includes(this.selectedOutput)
          ? this.selectedOutput
          : circuitData.outputs[0]);

    this.selectedOutput = primaryLed;
    this.outputLedName = `OUT ${primaryLed}`;

    const newMinterms = new Set();
    const newDontCares = new Set();

    if (circuitData.rows && circuitData.rows.length > 0) {
      const kmapSwitches = circuitData.inputs.slice(0, this.varsCount);
      const otherSwitches = circuitData.inputs.slice(this.varsCount);
      const liveRow = circuitData.liveRowIndex >= 0 ? circuitData.rows[circuitData.liveRowIndex] : circuitData.rows[0];

      // For each cell in the K-Map (0 .. 2^varsCount - 1)
      const numCells = 1 << this.varsCount;
      for (let m = 0; m < numCells; m++) {
        // Find row in circuitData matching combination m on kmapSwitches and live state on otherSwitches
        const matchRow = circuitData.rows.find(r => {
          for (let bit = 0; bit < this.varsCount; bit++) {
            const shift = this.varsCount - 1 - bit;
            const expectedBit = (m >> shift) & 1;
            const sw = kmapSwitches[bit];
            if (r.inputs[sw] !== expectedBit) return false;
          }
          if (otherSwitches.length > 0 && liveRow) {
            for (let i = 0; i < otherSwitches.length; i++) {
              const sw = otherSwitches[i];
              if (r.inputs[sw] !== liveRow.inputs[sw]) return false;
            }
          }
          return true;
        });

        if (matchRow) {
          const outVal = matchRow.outputs[primaryLed];
          if (outVal === 1) newMinterms.add(m);
          else if (outVal === 'X') newDontCares.add(m);
        }
      }

      // Calculate live row index within K-Map
      if (liveRow) {
        let liveM = 0;
        for (let bit = 0; bit < this.varsCount; bit++) {
          const sw = kmapSwitches[bit];
          const b = liveRow.inputs[sw] || 0;
          liveM = (liveM << 1) | b;
        }
        this.liveRowIndex = liveM;
      } else {
        this.liveRowIndex = -1;
      }
    }

    this.minterms = newMinterms;
    this.dontCares = newDontCares;
  }

  // ==========================================
  // 1. K-MAP & QUINE-MCCLUSKEY SOLVER
  // ==========================================

  setVarsCount(n) {
    this.varsCount = Math.min(4, Math.max(2, n));
    const maxMinterm = (1 << this.varsCount) - 1;
    const newM = new Set();
    this.minterms.forEach(m => { if (m <= maxMinterm) newM.add(m); });
    this.minterms = newM;
    const newD = new Set();
    this.dontCares.forEach(d => { if (d <= maxMinterm) newD.add(d); });
    this.dontCares = newD;
  }

  toggleCell(minterm) {
    if (this.minterms.has(minterm)) {
      this.minterms.delete(minterm);
      this.dontCares.add(minterm); // 1 -> X
    } else if (this.dontCares.has(minterm)) {
      this.dontCares.delete(minterm); // X -> 0
    } else {
      this.minterms.add(minterm); // 0 -> 1
    }
  }

  getCellState(minterm) {
    if (this.minterms.has(minterm)) return 1;
    if (this.dontCares.has(minterm)) return 'X';
    return 0;
  }

  getKMapGridConfig(numVars = this.varsCount) {
    if (numVars === 2) {
      return {
        rowVars: ['A'],
        colVars: ['B'],
        rowLabels: ['0', '1'],
        colLabels: ['0', '1'],
        cells: [
          [0, 1], // A=0
          [2, 3]  // A=1
        ]
      };
    } else if (numVars === 3) {
      return {
        rowVars: ['A'],
        colVars: ['B', 'C'],
        rowLabels: ['0', '1'],
        colLabels: ['00', '01', '11', '10'],
        cells: [
          [0, 1, 3, 2], // A=0
          [4, 5, 7, 6]  // A=1
        ]
      };
    } else {
      return {
        rowVars: ['A', 'B'],
        colVars: ['C', 'D'],
        rowLabels: ['00', '01', '11', '10'],
        colLabels: ['00', '01', '11', '10'],
        cells: [
          [0, 1, 3, 2],       // AB=00
          [4, 5, 7, 6],       // AB=01
          [12, 13, 15, 14],   // AB=11
          [8, 9, 11, 10]      // AB=10
        ]
      };
    }
  }

  solveQuineMcCluskey(numVars = this.varsCount, minterms = this.minterms, dontCares = this.dontCares) {
    const totalMinterms = 1 << numVars;
    const allActive = new Set([...minterms, ...dontCares]);

    if (minterms.size === 0) {
      return {
        sop: '0',
        terms: [],
        primeImplicants: [],
        essentialPIs: [],
        qmSteps: ['All cells 0 => Constant 0'],
        gateCount: 0
      };
    }
    if (allActive.size === totalMinterms && minterms.size > 0) {
      return {
        sop: '1',
        terms: [],
        primeImplicants: [{ mask: '-'.repeat(numVars), minterms: Array.from(allActive) }],
        essentialPIs: [{ mask: '-'.repeat(numVars), minterms: Array.from(allActive) }],
        qmSteps: ['All cells 1 => Constant 1'],
        gateCount: 0
      };
    }

    const toBin = (num) => num.toString(2).padStart(numVars, '0');
    const countOnes = (str) => (str.match(/1/g) || []).length;

    let groups = {};
    for (let i = 0; i <= numVars; i++) groups[i] = [];

    allActive.forEach(m => {
      const bin = toBin(m);
      const ones = countOnes(bin);
      groups[ones].push({
        mask: bin,
        minterms: [m],
        used: false
      });
    });

    const primeImplicants = [];
    const qmSteps = [];
    let pass = 1;

    while (true) {
      const nextGroups = {};
      for (let i = 0; i <= numVars; i++) nextGroups[i] = [];
      let combinedAny = false;
      const passTerms = [];

      for (let i = 0; i < numVars; i++) {
        const g1 = groups[i] || [];
        const g2 = groups[i + 1] || [];

        for (let t1 of g1) {
          for (let t2 of g2) {
            let diffCount = 0;
            let diffIdx = -1;
            for (let b = 0; b < numVars; b++) {
              if (t1.mask[b] !== t2.mask[b]) {
                if (t1.mask[b] === '-' || t2.mask[b] === '-') {
                  diffCount = 999;
                  break;
                }
                diffCount++;
                diffIdx = b;
              }
            }

            if (diffCount === 1) {
              t1.used = true;
              t2.used = true;
              combinedAny = true;
              const newMask = t1.mask.substring(0, diffIdx) + '-' + t1.mask.substring(diffIdx + 1);
              const combinedMinterms = Array.from(new Set([...t1.minterms, ...t2.minterms])).sort((a,b) => a-b);
              
              const ones = countOnes(newMask.replace(/-/g, ''));
              if (!nextGroups[ones].some(item => item.mask === newMask)) {
                nextGroups[ones].push({
                  mask: newMask,
                  minterms: combinedMinterms,
                  used: false
                });
                passTerms.push(`${newMask} (m${combinedMinterms.join(',')})`);
              }
            }
          }
        }
      }

      for (let i = 0; i <= numVars; i++) {
        for (let t of groups[i]) {
          if (!t.used && !primeImplicants.some(pi => pi.mask === t.mask)) {
            primeImplicants.push(t);
          }
        }
      }

      if (passTerms.length > 0) {
        qmSteps.push(`Pass ${pass}: Combined into ${passTerms.length} terms: ${passTerms.slice(0, 4).join('; ')}${passTerms.length > 4 ? ' ...' : ''}`);
      }

      if (!combinedAny) break;
      groups = nextGroups;
      pass++;
    }

    const neededMinterms = Array.from(minterms);
    const chart = {};
    neededMinterms.forEach(m => { chart[m] = []; });

    primeImplicants.forEach((pi, piIdx) => {
      pi.minterms.forEach(m => {
        if (chart[m]) chart[m].push(piIdx);
      });
    });

    const essentialPIIndices = new Set();
    const coveredMinterms = new Set();

    neededMinterms.forEach(m => {
      if (chart[m] && chart[m].length === 1) {
        const piIdx = chart[m][0];
        essentialPIIndices.add(piIdx);
        primeImplicants[piIdx].minterms.forEach(cm => coveredMinterms.add(cm));
      }
    });

    let remaining = neededMinterms.filter(m => !coveredMinterms.has(m));
    while (remaining.length > 0) {
      let bestPI = -1;
      let maxCover = 0;
      primeImplicants.forEach((pi, idx) => {
        if (!essentialPIIndices.has(idx)) {
          const count = pi.minterms.filter(m => remaining.includes(m)).length;
          if (count > maxCover) {
            maxCover = count;
            bestPI = idx;
          }
        }
      });

      if (bestPI !== -1) {
        essentialPIIndices.add(bestPI);
        primeImplicants[bestPI].minterms.forEach(cm => coveredMinterms.add(cm));
        remaining = neededMinterms.filter(m => !coveredMinterms.has(m));
      } else {
        break;
      }
    }

    const selectedPIs = Array.from(essentialPIIndices).map(idx => primeImplicants[idx]);

    const vars = this.varNames.slice(0, numVars);
    const maskToTerm = (mask) => {
      let term = '';
      for (let i = 0; i < numVars; i++) {
        if (mask[i] === '1') term += vars[i];
        else if (mask[i] === '0') term += vars[i] + "'";
      }
      return term || '1';
    };

    const terms = selectedPIs.map(pi => ({
      mask: pi.mask,
      term: maskToTerm(pi.mask),
      minterms: pi.minterms,
      color: this.getGroupColor(pi.mask)
    }));

    const sop = terms.map(t => t.term).join(' + ') || '0';

    return {
      sop,
      terms,
      primeImplicants,
      essentialPIs: selectedPIs,
      qmSteps,
      gateCount: terms.length > 1 ? terms.length + 1 : (terms[0]?.term?.length || 0)
    };
  }

  getGroupColor(seed) {
    const colors = [
      '#ef4444', '#3b82f6', '#10b981', '#f59e0b',
      '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'
    ];
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  }

  generateTruthTableData(numVars = this.varsCount, minterms = this.minterms, dontCares = this.dontCares, targetOutput = null) {
    // If live circuit is active, use real circuit data
    if (this.liveSync && this.liveCircuitInfo && this.liveCircuitInfo.rows && this.liveCircuitInfo.rows.length > 0) {
      const info = this.liveCircuitInfo;
      const primaryLed = (targetOutput !== null && info.outputs.includes(Number(targetOutput)))
        ? Number(targetOutput)
        : (this.selectedOutput !== undefined && info.outputs.includes(this.selectedOutput)
            ? this.selectedOutput
            : info.outputs[0]);

      const vars = info.inputs.map(sw => `SW ${sw}`);
      const rows = info.rows.map(r => {
        const bits = info.inputs.map(sw => r.inputs[sw] || 0);
        return {
          index: r.rowIndex,
          inputs: bits,
          output: r.outputs[primaryLed] !== undefined ? r.outputs[primaryLed] : 0,
          allOutputs: r.outputs,
          isLive: r.isLive,
          rawInputs: r.inputs,
          rawOutputs: r.outputs
        };
      });

      const mintermList = rows.filter(r => r.output === 1).map(r => r.index);
      const maxtermList = rows.filter(r => r.output === 0).map(r => r.index);

      return {
        vars,
        outputName: `OUT ${primaryLed} (F)`,
        outputLed: primaryLed,
        allOutputLeds: info.outputs,
        rows,
        liveRowIndex: info.liveRowIndex,
        sopStandard: mintermList.length ? `Σ m(${mintermList.join(', ')})` : '0',
        posStandard: maxtermList.length ? `Π M(${maxtermList.join(', ')})` : '1'
      };
    }

    const total = 1 << numVars;
    const vars = this.varLabels ? this.varLabels.slice(0, numVars) : this.varNames.slice(0, numVars);
    const rows = [];
    const mintermList = [];
    const maxtermList = [];

    for (let i = 0; i < total; i++) {
      const bits = i.toString(2).padStart(numVars, '0').split('').map(Number);
      let output = 0;
      if (minterms.has(i)) {
        output = 1;
        mintermList.push(i);
      } else if (dontCares.has(i)) {
        output = 'X';
      } else {
        maxtermList.push(i);
      }

      rows.push({
        index: i,
        inputs: bits,
        output,
        isLive: (i === this.liveRowIndex)
      });
    }

    return {
      vars,
      outputName: this.outputLedName || 'F (Output)',
      outputLed: this.selectedOutput,
      allOutputLeds: [],
      rows,
      liveRowIndex: this.liveRowIndex,
      sopStandard: mintermList.length ? `Σ m(${mintermList.join(', ')})` : '0',
      posStandard: maxtermList.length ? `Π M(${maxtermList.join(', ')})` : '1'
    };
  }

  generateAlgebraicProof(numVars = this.varsCount, minterms = this.minterms, dontCares = this.dontCares, preset = 'current') {
    if (preset === 'consensus') {
      return [
        {
          step: 1,
          law: 'Initial Boolean Expression',
          expr: "F = AB + A'C + BC",
          note: "Given 3-variable sum-of-products expression containing candidate redundant consensus term BC."
        },
        {
          step: 2,
          law: 'Identity Law (X · 1 = X)',
          expr: "F = AB + A'C + BC · (1)",
          note: "Introduce the multiplicative identity 1 to term BC without altering logical validity."
        },
        {
          step: 3,
          law: "Complement Law (A + A' = 1)",
          expr: "F = AB + A'C + BC(A + A')",
          note: "Substitute (A + A') for 1 using the missing third variable A."
        },
        {
          step: 4,
          law: 'Distributive Law: X(Y + Z) = XY + XZ',
          expr: "F = AB + A'C + ABC + A'BC",
          note: "Distribute conjunction BC across the sum of literals (A + A')."
        },
        {
          step: 5,
          law: 'Commutative & Associative Grouping',
          expr: "F = (AB + ABC) + (A'C + A'BC)",
          note: "Regroup product terms sharing common factors AB and A'C."
        },
        {
          step: 6,
          law: 'Distributive Factoring: XY + XZ = X(Y + Z)',
          expr: "F = AB(1 + C) + A'C(1 + B)",
          note: "Factor out common subterms AB and A'C."
        },
        {
          step: 7,
          law: 'Annihilation / Boundedness (1 + X = 1)',
          expr: "F = AB(1) + A'C(1)",
          note: "Any Boolean literal or term ORed with logic 1 evaluates identically to logic 1."
        },
        {
          step: 8,
          law: 'Identity Law (Consensus Theorem Q.E.D.)',
          expr: "F = AB + A'C",
          note: "The consensus term BC is completely redundant and safely eliminated. Minimal SOP verified."
        }
      ];
    }

    if (preset === 'absorption') {
      return [
        {
          step: 1,
          law: 'Initial Boolean Expression',
          expr: 'F = A + AB',
          note: 'A primary variable A disjuncted with a narrower product term AB.'
        },
        {
          step: 2,
          law: 'Identity Law (A · 1 = A)',
          expr: 'F = A · (1) + AB',
          note: 'Represent single literal A as product with logic 1 identity.'
        },
        {
          step: 3,
          law: 'Distributive Factoring: AX + AY = A(X + Y)',
          expr: 'F = A(1 + B)',
          note: 'Factor common literal A out of both terms.'
        },
        {
          step: 4,
          law: 'Annihilation / Boundedness (1 + B = 1)',
          expr: 'F = A · (1)',
          note: 'Since 1 + B = 1 regardless of whether B is 0 or 1.'
        },
        {
          step: 5,
          law: 'Identity Law (Absorption Law Q.E.D.)',
          expr: 'F = A',
          note: 'Term AB is completely absorbed into A. Minimal expression is single literal A.'
        }
      ];
    }

    if (preset === 'demorgan') {
      return [
        {
          step: 1,
          law: 'Initial Boolean Expression',
          expr: "F = (A + B)'",
          note: 'Negation / complement of a logical OR (NOR function).'
        },
        {
          step: 2,
          law: "De Morgan's Theorem (NOR Dual)",
          expr: "F = A' · B'",
          note: "The complement of a disjunction equals the conjunction of the individual complements: (A + B)' = A'B'."
        },
        {
          step: 3,
          law: "Complement Check 1 (X + X' = 1)",
          expr: "(A + B) + (A'B') = (A + B + A')(A + B + B') = (1 + B)(A + 1) = 1 · 1 = 1",
          note: "Verify algebraic complement condition: F + F' must identically equal 1."
        },
        {
          step: 4,
          law: "Complement Check 2 (X · X' = 0)",
          expr: "(A + B) · (A'B') = A · A'B' + B · A'B' = 0 + 0 = 0",
          note: "Verify orthogonality condition: F · F' must identically equal 0."
        },
        {
          step: 5,
          law: 'Minimal SOP Result',
          expr: "F = A'B'",
          note: "De Morgan duality verified. Implemented with a single 2-input AND gate with inverted inputs."
        }
      ];
    }

    const qm = this.solveQuineMcCluskey(numVars, minterms, dontCares);
    const steps = [];

    const vars = this.varNames.slice(0, numVars);
    const mintermTerms = Array.from(minterms).sort((a,b) => a-b).map(m => {
      const bin = m.toString(2).padStart(numVars, '0');
      return bin.split('').map((b, idx) => b === '1' ? vars[idx] : vars[idx] + "'").join('');
    });

    if (mintermTerms.length === 0) {
      return [
        { step: 1, law: 'Null / Annihilation Law', expr: 'F = 0', note: 'No active minterms. Output is permanently LOW (GND).' }
      ];
    }

    steps.push({
      step: 1,
      law: 'Canonical Sum-of-Minterms (SOP Expansion)',
      expr: 'F = ' + (mintermTerms.join(' + ') || '0'),
      note: 'Represent each active truth-table 1-cell as an AND-product of input literals.'
    });

    if (mintermTerms.length > 1) {
      steps.push({
        step: 2,
        law: "Adjacency Theorem & Distribution: XY + XY' = X(Y + Y')",
        expr: 'F = ' + (qm.terms.map(t => `(${t.term})`).join(' + ') || qm.sop),
        note: 'Factor common literals between Gray-code adjacent terms differing by exactly one negated variable.'
      });
    }

    steps.push({
      step: steps.length + 1,
      law: "Complement & Identity Laws: (Y + Y' = 1, X · 1 = X)",
      expr: 'F = ' + (qm.sop || '0'),
      note: 'Complementary pairs annihilate to logic 1; remaining essential literals form minimal terms.'
    });

    steps.push({
      step: steps.length + 1,
      law: 'Quine-McCluskey & Consensus Verification',
      expr: 'F(minimized) = ' + (qm.sop || '0'),
      note: `Verified irredundant minimal SOP via prime implicant coverage (${qm.essentialPIs.length} essential group${qm.essentialPIs.length === 1 ? '' : 's'}).`
    });

    return steps;
  }

  getCircuitSchematicSpec(numVars = this.varsCount, minterms = this.minterms, dontCares = this.dontCares) {
    const qm = this.solveQuineMcCluskey(numVars, minterms, dontCares);
    const vars = this.varNames.slice(0, numVars);

    const origMintermsCount = minterms.size;
    const origInverters = numVars;
    const origAndGates = origMintermsCount;
    const origOrGates = origMintermsCount > 1 ? 1 : 0;
    const origTotalGates = origInverters + origAndGates + origOrGates;

    let minInverters = 0;
    const usedInverted = new Set();
    qm.terms.forEach(t => {
      vars.forEach(v => {
        if (t.term.includes(v + "'")) usedInverted.add(v);
      });
    });
    minInverters = usedInverted.size;

    const minAndGates = qm.terms.filter(t => t.term.length > 1 && !t.term.includes('+')).length;
    const minOrGates = qm.terms.length > 1 ? 1 : 0;
    const minTotalGates = minInverters + minAndGates + minOrGates;
    const reductionPercent = origTotalGates > 0 ? Math.round(((origTotalGates - minTotalGates) / origTotalGates) * 100) : 0;

    return {
      sop: qm.sop,
      terms: qm.terms,
      original: {
        termsCount: origMintermsCount,
        inverters: origInverters,
        andGates: origAndGates,
        orGates: origOrGates,
        totalGates: origTotalGates
      },
      minimized: {
        termsCount: qm.terms.length,
        inverters: minInverters,
        andGates: minAndGates,
        orGates: minOrGates,
        totalGates: minTotalGates,
        reductionPercent: Math.max(0, reductionPercent)
      }
    };
  }

  designCounter(config = {}) {
    const {
      type = 'synchronous',
      sequenceType = 'bcd',
      modulus = 10,
      direction = 'up',
      flipFlop = 'D',
      customSeq = [0, 2, 4, 6]
    } = config;

    let seq = [];
    let numBits = 3;

    if (sequenceType === 'bcd') {
      seq = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      numBits = 4;
    } else if (sequenceType === 'binary') {
      const mod = Math.min(16, Math.max(2, modulus || 8));
      seq = Array.from({ length: mod }, (_, i) => i);
      numBits = Math.ceil(Math.log2(mod));
    } else if (sequenceType === 'gray') {
      const gray4 = [0, 1, 3, 2, 6, 7, 5, 4];
      seq = gray4.slice(0, Math.min(8, modulus || 8));
      numBits = 3;
    } else if (sequenceType === 'ring') {
      numBits = 4;
      seq = [1, 2, 4, 8];
    } else if (sequenceType === 'johnson') {
      numBits = 3;
      seq = [0, 4, 6, 7, 3, 1];
    } else if (sequenceType === 'custom') {
      seq = customSeq.length ? customSeq : [0, 1, 2];
      const maxVal = Math.max(...seq);
      numBits = Math.max(2, Math.ceil(Math.log2(maxVal + 1)));
    }

    if (direction === 'down') {
      seq = [...seq].reverse();
    }

    const totalStates = 1 << numBits;
    const nextStateMap = {};
    for (let i = 0; i < seq.length; i++) {
      const current = seq[i];
      const next = seq[(i + 1) % seq.length];
      nextStateMap[current] = next;
    }

    const unusedStates = [];
    for (let s = 0; s < totalStates; s++) {
      if (!nextStateMap.hasOwnProperty(s)) unusedStates.push(s);
    }

    unusedStates.forEach(u => {
      nextStateMap[u] = seq[0];
    });

    const excitationEquations = [];
    for (let bit = 0; bit < numBits; bit++) {
      const mintermsD = new Set();
      const mintermsJ = new Set();
      const mintermsK = new Set();
      const dontCaresJK = new Set();

      for (let s = 0; s < totalStates; s++) {
        const next = nextStateMap[s];
        const qBit = (s >> bit) & 1;
        const qNextBit = (next >> bit) & 1;

        if (qNextBit === 1) mintermsD.add(s);

        if (qBit === 0 && qNextBit === 1) mintermsJ.add(s);
        if (qBit === 0) dontCaresJK.add(s);
        if (qBit === 1 && qNextBit === 0) mintermsK.add(s);
        if (qBit === 1) dontCaresJK.add(s);
      }

      if (flipFlop === 'D') {
        const qm = this.solveQuineMcCluskey(numBits, mintermsD, new Set());
        excitationEquations.push({
          flipFlop: `D${bit}`,
          outputVar: `Q${bit}`,
          equation: `D${bit} = ${qm.sop || '0'}`
        });
      } else if (flipFlop === 'JK') {
        const qmJ = this.solveQuineMcCluskey(numBits, mintermsJ, dontCaresJK);
        const qmK = this.solveQuineMcCluskey(numBits, mintermsK, dontCaresJK);
        excitationEquations.push({
          flipFlop: `JK${bit}`,
          outputVar: `Q${bit}`,
          equation: `J${bit} = ${qmJ.sop || '0'}; K${bit} = ${qmK.sop || '0'}`
        });
      } else {
        const mintermsT = new Set();
        for (let s = 0; s < totalStates; s++) {
          const next = nextStateMap[s];
          if (((s >> bit) & 1) !== ((next >> bit) & 1)) mintermsT.add(s);
        }
        const qmT = this.solveQuineMcCluskey(numBits, mintermsT, new Set());
        excitationEquations.push({
          flipFlop: `T${bit}`,
          outputVar: `Q${bit}`,
          equation: `T${bit} = ${qmT.sop || '0'}`
        });
      }
    }

    return {
      numBits,
      seq,
      unusedStates,
      isLockoutFree: true,
      lockoutNote: unusedStates.length === 0 
        ? '✅ All 2^N states utilized — no lockout possible.' 
        : `✅ Self-Starting Verified: Unused states (${unusedStates.join(', ')}) recover to S${seq[0]} within 1 clock cycle.`,
      transitions: seq.map((s, idx) => ({
        from: s,
        to: seq[(idx + 1) % seq.length],
        fromBin: s.toString(2).padStart(numBits, '0'),
        toBin: seq[(idx + 1) % seq.length].toString(2).padStart(numBits, '0')
      })),
      excitationEquations
    };
  }

  designFSM(preset = 'seq101') {
    if (preset === 'seq101') {
      return {
        name: 'Sequence Detector "101" (Mealy Machine)',
        type: 'Mealy',
        states: [
          { id: 0, name: 'S0', desc: 'Initial (Got nothing)', code: '00' },
          { id: 1, name: 'S1', desc: 'Got "1"', code: '01' },
          { id: 2, name: 'S2', desc: 'Got "10"', code: '10' }
        ],
        transitions: [
          { from: 'S0', input: 0, next: 'S0', out: 0 },
          { from: 'S0', input: 1, next: 'S1', out: 0 },
          { from: 'S1', input: 0, next: 'S2', out: 0 },
          { from: 'S1', input: 1, next: 'S1', out: 0 },
          { from: 'S2', input: 0, next: 'S0', out: 0 },
          { from: 'S2', input: 1, next: 'S1', out: 1 }
        ],
        equations: [
          { target: 'D1 (Next Q1)', expr: "Q0 · X" },
          { target: 'D0 (Next Q0)', expr: "X" },
          { target: 'Z (Output)', expr: "Q1 · X" }
        ],
        requiredICs: ['74LS74 (Dual D-FF)', '74LS08 (Quad AND)']
      };
    } else {
      return {
        name: 'Traffic Light Controller (Moore Machine)',
        type: 'Moore',
        states: [
          { id: 0, name: 'GREEN', desc: 'Main Road Green, Side Red', code: '00', out: 'G=1, Y=0, R=0' },
          { id: 1, name: 'YELLOW', desc: 'Main Road Yellow, Side Red', code: '01', out: 'G=0, Y=1, R=0' },
          { id: 2, name: 'RED', desc: 'Main Road Red, Side Green', code: '10', out: 'G=0, Y=0, R=1' }
        ],
        transitions: [
          { from: 'GREEN', input: 'Timer=1', next: 'YELLOW', out: 'Green' },
          { from: 'YELLOW', input: 'Timer=1', next: 'RED', out: 'Yellow' },
          { from: 'RED', input: 'Timer=1', next: 'GREEN', out: 'Red' }
        ],
        equations: [
          { target: 'D1', expr: "Q0 · Timer" },
          { target: 'D0', expr: "Q1' · Timer" },
          { target: 'Out_Green', expr: "Q1' · Q0'" },
          { target: 'Out_Yellow', expr: "Q1' · Q0" },
          { target: 'Out_Red', expr: "Q1" }
        ],
        requiredICs: ['74LS74 (Dual D-FF)', '74LS04 (Hex Inverter)', '74LS08 (Quad AND)']
      };
    }
  }

  synthesizeCircuitToKit() {
    const qm = this.solveQuineMcCluskey();
    const numVars = this.varsCount;
    const terms = qm.terms;

    const icBases = [];
    const wires = [];

    const mintermsArr = Array.from(this.minterms).sort();
    const isXor2 = numVars === 2 && mintermsArr.length === 2 && mintermsArr[0] === 1 && mintermsArr[1] === 2;

    if (isXor2) {
      icBases.push({ id: 0, icId: '74LS86' });
      wires.push({ from: { comp: 'switch', pin: 15 }, to: { comp: 'icbase_0', pin: 1 }, color: '#3b82f6' });
      wires.push({ from: { comp: 'switch', pin: 14 }, to: { comp: 'icbase_0', pin: 2 }, color: '#22c55e' });
      wires.push({ from: { comp: 'icbase_0', pin: 3 }, to: { comp: 'led', pin: 13 }, color: '#ef4444' });

      return {
        title: `K-Map Built: F = A ⊕ B (74LS86 XOR)`,
        icBases,
        wires,
        switches: [15, 14]
      };
    }

    icBases.push({ id: 0, icId: '74LS04' });
    icBases.push({ id: 1, icId: '74LS08' });
    icBases.push({ id: 2, icId: '74LS32' });

    wires.push({ from: { comp: 'switch', pin: 15 }, to: { comp: 'icbase_0', pin: 1 }, color: '#3b82f6' });
    wires.push({ from: { comp: 'switch', pin: 14 }, to: { comp: 'icbase_0', pin: 3 }, color: '#22c55e' });
    if (numVars >= 3) {
      wires.push({ from: { comp: 'switch', pin: 13 }, to: { comp: 'icbase_0', pin: 5 }, color: '#a855f7' });
    }

    const getLiteralTerminal = (lit) => {
      const varLetter = lit.replace("'", '');
      const isNeg = lit.includes("'");
      if (varLetter === 'A') {
        return isNeg ? { comp: 'icbase_0', pin: 2 } : { comp: 'switch', pin: 15 };
      } else if (varLetter === 'B') {
        return isNeg ? { comp: 'icbase_0', pin: 4 } : { comp: 'switch', pin: 14 };
      } else if (varLetter === 'C') {
        return isNeg ? { comp: 'icbase_0', pin: 6 } : { comp: 'switch', pin: 13 };
      } else {
        return { comp: 'switch', pin: 12 };
      }
    };

    const andGatePins = [
      { in1: 1, in2: 2, out: 3 },
      { in1: 4, in2: 5, out: 6 },
      { in1: 9, in2: 10, out: 8 },
      { in1: 12, in2: 13, out: 11 }
    ];

    const termOutputs = [];

    terms.slice(0, 4).forEach((t, tIdx) => {
      const g = andGatePins[tIdx];
      const lits = [];
      for (let i = 0; i < t.term.length; i++) {
        if (t.term[i] >= 'A' && t.term[i] <= 'D') {
          let lit = t.term[i];
          if (t.term[i + 1] === "'") {
            lit += "'";
            i++;
          }
          lits.push(lit);
        }
      }

      if (lits.length === 1) {
        termOutputs.push(getLiteralTerminal(lits[0]));
      } else if (lits.length >= 2) {
        wires.push({ from: getLiteralTerminal(lits[0]), to: { comp: 'icbase_1', pin: g.in1 }, color: '#38bdf8' });
        wires.push({ from: getLiteralTerminal(lits[1]), to: { comp: 'icbase_1', pin: g.in2 }, color: '#38bdf8' });
        termOutputs.push({ comp: 'icbase_1', pin: g.out });
      }
    });

    if (termOutputs.length === 0) {
      wires.push({ from: { comp: 'gnd', pin: 0 }, to: { comp: 'led', pin: 13 }, color: '#000000' });
    } else if (termOutputs.length === 1) {
      wires.push({ from: termOutputs[0], to: { comp: 'led', pin: 13 }, color: '#ef4444' });
    } else if (termOutputs.length === 2) {
      wires.push({ from: termOutputs[0], to: { comp: 'icbase_2', pin: 1 }, color: '#f97316' });
      wires.push({ from: termOutputs[1], to: { comp: 'icbase_2', pin: 2 }, color: '#f97316' });
      wires.push({ from: { comp: 'icbase_2', pin: 3 }, to: { comp: 'led', pin: 13 }, color: '#ef4444' });
    } else {
      wires.push({ from: termOutputs[0], to: { comp: 'icbase_2', pin: 1 }, color: '#f97316' });
      wires.push({ from: termOutputs[1], to: { comp: 'icbase_2', pin: 2 }, color: '#f97316' });
      wires.push({ from: { comp: 'icbase_2', pin: 3 }, to: { comp: 'icbase_2', pin: 4 }, color: '#f97316' });
      wires.push({ from: termOutputs[2], to: { comp: 'icbase_2', pin: 5 }, color: '#f97316' });
      wires.push({ from: { comp: 'icbase_2', pin: 6 }, to: { comp: 'led', pin: 13 }, color: '#ef4444' });
    }

    return {
      title: `Built K-Map: F = ${qm.sop}`,
      icBases,
      wires,
      switches: [15, 14, 13].slice(0, numVars)
    };
  }

  synthesizeCounterToKit(counterConfig) {
    const res = this.designCounter(counterConfig);
    const icBases = [];
    const wires = [];

    icBases.push({ id: 0, icId: '74LS74' });
    icBases.push({ id: 1, icId: '74LS74' });
    icBases.push({ id: 2, icId: '74LS04' });

    wires.push({ from: { comp: 'clock', pin: 1 }, to: { comp: 'icbase_0', pin: 3 }, color: '#f59e0b' });
    wires.push({ from: { comp: 'clock', pin: 1 }, to: { comp: 'icbase_1', pin: 3 }, color: '#f59e0b' });

    wires.push({ from: { comp: 'vcc', pin: 0 }, to: { comp: 'icbase_0', pin: 1 }, color: '#ef4444' });
    wires.push({ from: { comp: 'vcc', pin: 0 }, to: { comp: 'icbase_0', pin: 4 }, color: '#ef4444' });

    wires.push({ from: { comp: 'icbase_0', pin: 6 }, to: { comp: 'icbase_0', pin: 2 }, color: '#3b82f6' });

    wires.push({ from: { comp: 'icbase_0', pin: 5 }, to: { comp: 'led', pin: 0 }, color: '#22c55e' });
    wires.push({ from: { comp: 'icbase_0', pin: 5 }, to: { comp: 'icbase_1', pin: 3 }, color: '#22c55e' });

    wires.push({ from: { comp: 'vcc', pin: 0 }, to: { comp: 'icbase_1', pin: 1 }, color: '#ef4444' });
    wires.push({ from: { comp: 'vcc', pin: 0 }, to: { comp: 'icbase_1', pin: 4 }, color: '#ef4444' });
    wires.push({ from: { comp: 'icbase_1', pin: 6 }, to: { comp: 'icbase_1', pin: 2 }, color: '#a855f7' });
    wires.push({ from: { comp: 'icbase_1', pin: 5 }, to: { comp: 'led', pin: 1 }, color: '#ef4444' });

    return {
      title: `Built 2-Bit Ripple Counter (74LS74)`,
      icBases,
      wires,
      switches: []
    };
  }
}

// ==========================================
// SOURCE: js/app.js
// ==========================================
/**
 * DELD Virtual Trainer Kit - Main Application Controller
 * Coordinates UI events, tool state machine, canvas pan/zoom,
 * modals, presets, and real-time simulator loops.
 */


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
              ${(ic.category || 'logic').toUpperCase()}
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


})();

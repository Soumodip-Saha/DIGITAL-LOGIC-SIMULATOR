/**
 * DELD Virtual Trainer Kit - IC Library
 * 100% Free & Unlocked Digital Integrated Circuits
 * Contains pin definitions, physical DIP package geometry, truth tables, and simulation evaluation logic.
 */

export const IC_CATEGORIES = {
  ALL: 'all',
  GATES: 'gates',
  COMBINATIONAL: 'combinational',
  ARITHMETIC: 'arithmetic',
  FLIP_FLOPS: 'flip_flops',
  COUNTERS: 'counters',
  REGISTERS: 'registers'
};

export const IC_LIBRARY = {
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
      const iAeB = inputs[3] !== undefined ? inputs[3] : 1;
      const iAlB = inputs[2] || 0;

      let oAgB = 0, oAeB = 0, oAlB = 0;
      if (a > b) {
        oAgB = 1;
      } else if (a < b) {
        oAlB = 1;
      } else {
        if (iAeB === 1) oAeB = 1;
        else if (iAgB === 1) oAgB = 1;
        else if (iAlB === 1) oAlB = 1;
      }

      return { 5: oAgB, 6: oAeB, 7: oAlB };
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
      const g1 = inputs[6] || 0;
      const g2a = inputs[4] || 0;
      const g2b = inputs[5] || 0;
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
      if ((inputs[1] || 0) === 0) {
        const addr1 = ((inputs[3] || 0) << 1) | (inputs[2] || 0);
        const map1 = [4, 5, 6, 7];
        res[map1[addr1]] = 0;
      }
      // Decoder 2
      if ((inputs[15] || 0) === 0) {
        const addr2 = ((inputs[13] || 0) << 1) | (inputs[14] || 0);
        const map2 = [12, 11, 10, 9];
        res[map2[addr2]] = 0;
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
      if (inputs[3] === 0) {
        return { 13: 0, 12: 0, 11: 0, 10: 0, 9: 0, 15: 0, 14: 0 };
      }
      if (inputs[4] === 0) {
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

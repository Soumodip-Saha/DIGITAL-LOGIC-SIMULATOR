/**
 * DELD Virtual Trainer Kit - Lab Experiment Presets
 * Pre-built classic digital logic experiments ready to simulate with 1 click.
 */

export const LAB_PRESETS = [
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
  }
];

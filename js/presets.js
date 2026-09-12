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

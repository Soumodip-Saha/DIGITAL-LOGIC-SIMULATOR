# Digital Electronics & Logic Design (DELD) Virtual Trainer Kit Simulator

A full-featured, browser-based, **100% free and unlocked** Digital Logic & Integrated Circuit (IC) Trainer Kit simulator built for engineering students, educators, and hobbyists.

Inspired by [DeldSim](https://deldsim.com/simulator), this application eliminates all paywalls, subscription locks, and login gates—giving everyone unrestricted access to all **25+ standard 74xx-series TTL and CMOS digital ICs**, sequential circuits, counters, shift registers, and interactive lab experiments.

---

## ⚡ Key Highlights & Features

- **100% Free & Unlocked**: Every single IC (including 74LS74 D Flip-Flops, 74LS76 JK Flip-Flops, 74LS83 4-Bit Adders, 74LS90 Decade Counters, 74LS151 8:1 Multiplexers, etc.) is fully unlocked out of the box with zero paywalls or account creation.
- **Authentic Virtual Trainer Board**:
  - **16 Logic Level Input Switches (SW0–SW15)** with HIGH (1) / LOW (0) toggle positions and dual indicator LEDs.
  - **16 Logic Level Output Monitor LEDs (LED0–LED15)** with realistic chrome bezels, multi-layered radial glow, and state readouts.
  - **Clock & Pulse Generator**: 4 selectable continuous frequencies (`0.5 Hz`, `1 Hz`, `5 Hz`, `10 Hz`) plus a debounced **Manual Pulse Button**.
  - **Dual 7-Segment Displays**: Independent displays with inputs for segments `a`, `b`, `c`, `d`, `e`, `f`, `g`, and decimal point `dp`.
  - **Power Supply Terminals**: Constant `+5V (VCC)` and `0V (GND)` binding post jacks.
  - **5 Universal 20-Pin IC Bases**: Mount up to 5 DIP ICs simultaneously with clear pinout silkscreen labels.
  - **Master Rocker Power Switch**: Toggle simulation power with neon indicator.
- **Realistic Patch Cord Wiring**:
  - Gravitational Bezier curve sag calculations that mirror flexible physical patch cords.
  - **Signal Glow Mode**: Wires dynamically illuminate glowing red when carrying logic `1` (HIGH) and dark when logic `0` (LOW).
  - Multi-color wire palette (Red, Blue, Green, Yellow, Cyan, Orange, Purple, White, Black).
  - Multi-connection fan-out: drive multiple input gates from a single switch or IC output.
- **Interactive Component Library & Datasheet Viewer**:
  - Full-text search and category filtering.
  - Interactive DIP package pinout schematics and functional truth tables.
- **1-Click Pre-Built Lab Experiments**:
  - Half Adder & Full Adder
  - 4-Bit Binary Parallel Adder (74LS83)
  - 4:1 Multiplexer (74LS153) & 8:1 Multiplexer (74LS151)
  - Decade BCD Counter with 7-Segment Display (74LS90 + 74LS47)
  - 4-Bit Binary Ripple Counter (74LS93)
  - D Flip-Flop Frequency Divider (74LS74)
- **Persistence & Portability**:
  - Automatic `localStorage` recovery.
  - Export & import circuit designs as `.json` files.
  - Instant shareable link with circuit state encoded in the URL hash.
  - Full Undo (`Ctrl+Z`) and Redo (`Ctrl+Y`) history.
- **Pan & Zoom Controls**: Mouse drag panning, mouse wheel zoom, 100% reset, and Fit-to-Screen.

---

## 🚀 How to Run Locally

Because the simulator is built with modern vanilla ES6 modules and SVG, you can run it immediately using any local web server.

### Option 1: Using Python (Built-in)
Run in PowerShell / Terminal:
```bash
python -m http.server 8000
```
Then open your browser and navigate to:
```
http://localhost:8000
```

### Option 2: Using Node.js / npx
```bash
npx serve .
```

---

## 🔬 Unlocked IC Library (29 Components)

| Part Number | Description | Category | Pins |
| :--- | :--- | :--- | :--- |
| **74LS00** | Quad 2-Input NAND Gate | Logic Gates | 14 |
| **74LS02** | Quad 2-Input NOR Gate | Logic Gates | 14 |
| **74LS04** | Hex Inverter (NOT Gate) | Logic Gates | 14 |
| **74LS08** | Quad 2-Input AND Gate | Logic Gates | 14 |
| **74LS10** | Triple 3-Input NAND Gate | Logic Gates | 14 |
| **74LS11** | Triple 3-Input AND Gate | Logic Gates | 14 |
| **74LS14** | Hex Schmitt-Trigger Inverter | Logic Gates | 14 |
| **74LS20** | Dual 4-Input NAND Gate | Logic Gates | 14 |
| **74LS21** | Dual 4-Input AND Gate | Logic Gates | 14 |
| **74LS27** | Triple 3-Input NOR Gate | Logic Gates | 14 |
| **74LS30** | 8-Input NAND Gate | Logic Gates | 14 |
| **74LS32** | Quad 2-Input OR Gate | Logic Gates | 14 |
| **74LS86** | Quad 2-Input XOR Gate | Logic Gates | 14 |
| **74LS266** | Quad 2-Input Exclusive-NOR (XNOR) Gate | Logic Gates | 14 |
| **74LS83** | 4-Bit Binary Full Adder | Arithmetic | 16 |
| **74LS85** | 4-Bit Magnitude Comparator | Arithmetic | 16 |
| **74LS138** | 3-to-8 Line Decoder / Demultiplexer | Combinational | 16 |
| **74LS139** | Dual 2-to-4 Line Decoder / Demux | Combinational | 16 |
| **74LS148** | 8-to-3 Line Priority Encoder | Combinational | 16 |
| **74LS151** | 8-to-1 Multiplexer | Combinational | 16 |
| **74LS153** | Dual 4-to-1 Multiplexer | Combinational | 16 |
| **74LS157** | Quad 2-to-1 Multiplexer | Combinational | 16 |
| **74LS47** | BCD to 7-Segment Decoder / Driver | Combinational | 16 |
| **74LS74** | Dual D Flip-Flop with Preset & Clear | Sequential | 14 |
| **74LS76** | Dual J-K Flip-Flop with Preset & Clear | Sequential | 16 |
| **74LS90** | Decade / BCD Counter (Mod-2 / Mod-5) | Counters | 14 |
| **74LS93** | 4-Bit Binary Counter (Mod-2 / Mod-8) | Counters | 14 |
| **74LS191** | Synchronous Up/Down 4-Bit Counter | Counters | 16 |
| **74LS194** | 4-Bit Universal Shift Register | Registers | 16 |

---

## 📜 Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + Z` | Undo last wire or component action |
| `Ctrl + Y` | Redo action |
| `Ctrl + S` | Export & download circuit JSON file |
| `Space + Drag` | Pan trainer board canvas |
| `Mouse Wheel` | Smooth zoom in / zoom out |
| `Escape` | Cancel active wire connection or close modal |

---

## 📄 License
Open source and dedicated to students and learners worldwide. Free to use, fork, and share.

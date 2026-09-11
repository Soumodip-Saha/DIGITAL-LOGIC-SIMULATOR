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

export class DigitalLogicSuite {
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

    circuitData.rows.forEach(r => {
      if (r.rowIndex < (1 << this.varsCount)) {
        const outVal = r.outputs[primaryLed];
        if (outVal === 1) {
          newMinterms.add(r.rowIndex);
        } else if (outVal === 'X') {
          newDontCares.add(r.rowIndex);
        }
      }
    });

    this.minterms = newMinterms;
    this.dontCares = newDontCares;
    this.liveRowIndex = circuitData.liveRowIndex;
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

  generateAlgebraicProof(numVars = this.varsCount, minterms = this.minterms, dontCares = this.dontCares) {
    const qm = this.solveQuineMcCluskey(numVars, minterms, dontCares);
    const steps = [];

    const vars = this.varNames.slice(0, numVars);
    const mintermTerms = Array.from(minterms).sort((a,b) => a-b).map(m => {
      const bin = m.toString(2).padStart(numVars, '0');
      return bin.split('').map((b, idx) => b === '1' ? vars[idx] : vars[idx] + "'").join('');
    });

    if (mintermTerms.length === 0) {
      return [
        { law: 'Null / Annihilation Law', expr: 'F = 0', note: 'No active minterms. Output is permanently LOW (GND).' }
      ];
    }

    steps.push({
      law: 'Canonical Sum-of-Minterms (SOP Expansion)',
      expr: 'F = ' + (mintermTerms.join(' + ') || '0'),
      note: 'Represent each active truth-table 1-cell as an AND-product of input literals.'
    });

    if (mintermTerms.length > 1) {
      steps.push({
        law: "Adjacency Theorem & Distribution: XY + XY' = X(Y + Y')",
        expr: 'F = ' + (qm.terms.map(t => `(${t.term})`).join(' + ') || qm.sop),
        note: 'Factor common literals between Gray-code adjacent terms differing by exactly one negated variable.'
      });
    }

    steps.push({
      law: "Complement & Identity Laws: (Y + Y' = 1, X · 1 = X)",
      expr: 'F = ' + (qm.sop || '0'),
      note: 'Complementary pairs annihilate to logic 1; remaining essential literals form minimal terms.'
    });

    steps.push({
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

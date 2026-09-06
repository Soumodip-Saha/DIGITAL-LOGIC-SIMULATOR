/**
 * DELD Virtual Trainer Kit - Storage & History Manager
 * Handles Undo/Redo stacks, browser localStorage, JSON export/import,
 * and shareable URL hashing.
 */

export class StorageManager {
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

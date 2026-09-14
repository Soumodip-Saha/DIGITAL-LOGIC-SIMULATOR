/**
 * DELD Virtual Trainer Kit - Backend API Client
 * Manages communication with the Python FastAPI logic engine.
 * Provides high-speed server-side truth table calculations, IC simulations,
 * and Boolean minimization with automatic fallback to local offline mode.
 */

export class DELDBackendClient {
  constructor() {
    // Determine API base URL:
    // If opened from http://127.0.0.1:8000 or http://localhost:8000, use origin.
    // Otherwise default to http://127.0.0.1:8000 (with CORS).
    const loc = typeof window !== 'undefined' ? window.location : null;
    if (loc && (loc.origin.startsWith('http://127.0.0.1:8000') || loc.origin.startsWith('http://localhost:8000'))) {
      this.baseUrl = loc.origin;
    } else {
      this.baseUrl = 'http://127.0.0.1:8000';
    }

    this.isConnected = false;
    this.latencyMs = null;
    this.lastChecked = null;
    this.checkPromise = null;

    // Trigger initial health check in background
    if (typeof window !== 'undefined') {
      this.checkConnection();
    }
  }

  /**
   * Pings the backend health endpoint to verify connectivity and latency.
   */
  async checkConnection() {
    const t0 = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(`${this.baseUrl}/api/health`, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        this.latencyMs = Math.round(performance.now() - t0);
        this.isConnected = (data.status === 'ok');
        this.lastChecked = Date.now();
        this.lastError = null;
        return this.isConnected;
      }
    } catch (err) {
      this.lastError = err.message || String(err);
      this.isConnected = false;
      this.latencyMs = null;
    }
    return false;
  }

  /**
   * Fetches authoritative datasheet truth table for an individual IC.
   */
  async getICTruthTable(icId) {
    try {
      const res = await fetch(`${this.baseUrl}/api/truth-table/ic/${encodeURIComponent(icId)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('[BackendClient] Failed to fetch IC truth table from backend:', err);
    }
    return null;
  }

  /**
   * Computes exhaustive 2^N circuit truth table on the Python logic engine.
   */
  async calculateCircuitTruthTable(circuitData) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(`${this.baseUrl}/api/truth-table/circuit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(circuitData),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        this.isConnected = true;
        return await res.json();
      }
    } catch (err) {
      this.isConnected = false;
      console.warn('[BackendClient] Backend calculation failed or timed out:', err);
    }
    return null;
  }

  /**
   * Computes Digital Logic Suite truth table and Quine-McCluskey minimization on the server.
   */
  async calculateLogicSuite(suiteRequest) {
    try {
      const res = await fetch(`${this.baseUrl}/api/truth-table/logic-suite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(suiteRequest)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('[BackendClient] Logic suite calculation failed:', err);
    }
    return null;
  }
}

// Global singleton instance
if (typeof window !== 'undefined') {
  window.backendClient = new DELDBackendClient();
}

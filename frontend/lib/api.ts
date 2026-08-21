import { ScanDetail, ScanSummary } from '../types/scan';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const api = {
  async checkHealth() {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    if (!res.ok) throw new Error('Backend offline');
    return res.json();
  },

  async startScan(targetUrl: string, authToken?: string, openapiSpec?: Record<string, unknown>): Promise<ScanDetail> {
    const res = await fetch(`${API_BASE_URL}/api/scans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target_url: targetUrl,
        auth_token: authToken || undefined,
        openapi_spec: openapiSpec || undefined
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to start scan' }));
      throw new Error(err.detail || 'Failed to start scan');
    }
    return res.json();
  },

  async startDemoScan(): Promise<ScanDetail> {
    const res = await fetch(`${API_BASE_URL}/api/demo/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to launch demo scan');
    return res.json();
  },

  async getScan(scanId: string): Promise<ScanDetail> {
    const res = await fetch(`${API_BASE_URL}/api/scans/${scanId}`);
    if (!res.ok) throw new Error('Scan not found');
    return res.json();
  },

  async listScans(): Promise<ScanSummary[]> {
    const res = await fetch(`${API_BASE_URL}/api/scans`);
    if (!res.ok) return [];
    return res.json();
  }
};

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { api } from '../lib/api';
import { ScanDetail, Finding, DiscoveredEndpoint } from '../types/scan';
import { ScoreGauge } from '../components/ScoreGauge';
import { SeverityBadge } from '../components/SeverityBadge';
import { FindingDrawer } from '../components/FindingDrawer';
import { OpenApiModal } from '../components/OpenApiModal';
import { exportScanAsJson, exportScanAsMarkdown } from '../lib/exportReport';
import {
  ShieldCheck, Zap, RefreshCw, CheckCircle2,
  Search, Server, Lock, ChevronRight, Download,
  Terminal, PlayCircle, FileJson, FileText
} from 'lucide-react';

export default function Dashboard() {
  const [targetUrl, setTargetUrl] = useState('http://127.0.0.1:8000');
  const [authToken, setAuthToken] = useState('demo-bearer-token-xyz');
  const [isScanning, setIsScanning] = useState(false);
  const [scan, setScan] = useState<ScanDetail | null>(null);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [backendHealth, setBackendHealth] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'findings' | 'endpoints'>('findings');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpenApiModalOpen, setIsOpenApiModalOpen] = useState(false);
  const [importedSpec, setImportedSpec] = useState<Record<string, unknown> | null>(null);
  const [customEndpoints, setCustomEndpoints] = useState<DiscoveredEndpoint[]>([]);

  // 1. Initial Health Check
  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      await api.checkHealth();
      setBackendHealth(true);
    } catch {
      setBackendHealth(false);
    }
  };

  // 2. Poll active scan until COMPLETED
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning && scan?.id) {
      interval = setInterval(async () => {
        try {
          const updated = await api.getScan(scan.id);
          setScan(updated);
          if (updated.status === 'COMPLETED' || updated.status === 'FAILED') {
            setIsScanning(false);
          }
        } catch {
          setIsScanning(false);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isScanning, scan?.id]);

  // 3. Start Demo Scan
  const handleRunDemoScan = async () => {
    setIsScanning(true);
    setSelectedFinding(null);
    try {
      const initScan = await api.startDemoScan();
      setScan(initScan);
    } catch {
      alert('Failed to launch demo scan. Ensure backend is running.');
      setIsScanning(false);
    }
  };

  // 4. Start Custom Scan
  const handleStartCustomScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl) return;
    setIsScanning(true);
    setSelectedFinding(null);
    try {
      const initScan = await api.startScan(targetUrl, authToken, importedSpec || undefined);
      setScan(initScan);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error starting scan';
      alert(msg);
      setIsScanning(false);
    }
  };

  const handleApplySpec = (spec: Record<string, unknown>, endpoints: DiscoveredEndpoint[]) => {
    setImportedSpec(spec);
    setCustomEndpoints(endpoints);
  };

  const filteredFindings = scan?.findings.filter(f => {
    const matchesSeverity = selectedSeverity === 'ALL' || f.severity === selectedSeverity;
    const matchesSearch = searchQuery === '' || 
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  }) || [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      <Head>
        <title>Sentinel API – Automated API Security Testing Platform</title>
        <meta name="description" content="Automated OWASP API vulnerability scanner and security assessment platform." />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>

      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-900/30">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                  SENTINEL API
                </span>
                <span className="text-[10px] font-mono uppercase bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 px-2 py-0.5 rounded-full font-bold">
                  v1.0 DEFENSE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">Automated API Security Testing Platform</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
              <div className={`w-2 h-2 rounded-full ${backendHealth ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-slate-300">CORE ENGINE: {backendHealth ? 'ONLINE' : 'OFFLINE'}</span>
            </div>

            <button
              onClick={handleRunDemoScan}
              disabled={isScanning}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs tracking-wide uppercase transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {isScanning ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 fill-current" />
              )}
              <span>Run Demo Security Scan</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Target Configuration Card */}
        <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-xl">
          <form onSubmit={handleStartCustomScan} className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <div className="flex items-center space-x-2 text-sm font-bold text-slate-200">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>API Target & Probing Configuration</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsOpenApiModalOpen(true)}
                  className="flex items-center space-x-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-mono rounded-lg border border-slate-700 transition-colors"
                >
                  <FileJson className="w-3.5 h-3.5" />
                  <span>{importedSpec ? 'OpenAPI Spec Active ✓' : 'Import OpenAPI Spec'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-6 space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase">Target Base URL</label>
                <div className="relative">
                  <Server className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="url"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://api.yourcompany.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-10 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
                  />
                </div>
              </div>

              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-mono text-slate-400 uppercase">Optional Auth Bearer Token</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={authToken}
                    onChange={(e) => setAuthToken(e.target.value)}
                    placeholder="Bearer JWT or API Key"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-10 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-mono transition-colors"
                  />
                </div>
              </div>

              <div className="md:col-span-2 flex items-end">
                <button
                  type="submit"
                  disabled={isScanning || !targetUrl}
                  className="w-full h-[42px] rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs font-mono uppercase tracking-wider transition-all border border-slate-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <PlayCircle className="w-4 h-4 text-cyan-400" />
                  <span>Launch Scan</span>
                </button>
              </div>
            </div>

            {importedSpec && customEndpoints.length > 0 && (
              <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded-xl flex items-center justify-between text-xs font-mono text-cyan-300">
                <span>Loaded {customEndpoints.length} endpoint(s) from OpenAPI specification schema.</span>
                <button
                  type="button"
                  onClick={() => { setImportedSpec(null); setCustomEndpoints([]); }}
                  className="text-slate-400 hover:text-red-400 underline"
                >
                  Clear Spec
                </button>
              </div>
            )}
          </form>
        </section>

        {/* Scan Status & Progress Bar */}
        {scan && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Metrics & Score Gauge */}
            <div className="lg:col-span-4 space-y-4">
              <ScoreGauge score={scan.score} grade={scan.grade} />

              {/* Status Overview Card */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>STATUS:</span>
                  <span className={`font-bold px-2 py-0.5 rounded ${scan.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-cyan-950 text-cyan-400 border border-cyan-800 animate-pulse'}`}>
                    {scan.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>TARGET:</span>
                  <span className="text-slate-200 truncate max-w-[200px]" title={scan.target_url}>{scan.target_url}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>ENDPOINTS:</span>
                  <span className="text-slate-200 font-bold">{scan.endpoints_count}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>SECURITY TESTS:</span>
                  <span className="text-slate-200 font-bold">{scan.tests_completed}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>DURATION:</span>
                  <span className="text-slate-200">{scan.duration_seconds}s</span>
                </div>

                {/* Report Export Buttons */}
                {scan.status === 'COMPLETED' && (
                  <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => exportScanAsMarkdown(scan)}
                      className="flex items-center justify-center space-x-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors text-[11px]"
                    >
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Export .MD</span>
                    </button>
                    <button
                      onClick={() => exportScanAsJson(scan)}
                      className="flex items-center justify-center space-x-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors text-[11px]"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Export .JSON</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Summary Statistics & Category Matrix */}
            <div className="lg:col-span-8 space-y-6">
              {/* Severity Pill Counts */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-red-950/30 border border-red-900/40 rounded-xl p-4 text-center">
                  <span className="text-xs font-mono text-red-400 block uppercase font-bold">Critical</span>
                  <span className="text-2xl font-extrabold font-mono text-red-300 mt-1 block">{scan.critical_count}</span>
                </div>
                <div className="bg-orange-950/30 border border-orange-900/40 rounded-xl p-4 text-center">
                  <span className="text-xs font-mono text-orange-400 block uppercase font-bold">High</span>
                  <span className="text-2xl font-extrabold font-mono text-orange-300 mt-1 block">{scan.high_count}</span>
                </div>
                <div className="bg-amber-950/30 border border-amber-900/40 rounded-xl p-4 text-center">
                  <span className="text-xs font-mono text-amber-400 block uppercase font-bold">Medium</span>
                  <span className="text-2xl font-extrabold font-mono text-amber-300 mt-1 block">{scan.medium_count}</span>
                </div>
                <div className="bg-blue-950/30 border border-blue-900/40 rounded-xl p-4 text-center">
                  <span className="text-xs font-mono text-blue-400 block uppercase font-bold">Low</span>
                  <span className="text-2xl font-extrabold font-mono text-blue-300 mt-1 block">{scan.low_count}</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center col-span-2 sm:col-span-1">
                  <span className="text-xs font-mono text-slate-400 block uppercase font-bold">Total Issues</span>
                  <span className="text-2xl font-extrabold font-mono text-white mt-1 block">{scan.total_findings}</span>
                </div>
              </div>

              {/* Category Breakdown Matrix */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-4 tracking-wider">
                  Automated Security Module Verification Matrix
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-300">1. Authentication Controls</span>
                    {scan.findings.some(f => f.category === 'Authentication') ? (
                      <span className="text-red-400 flex items-center gap-1">✕ Vulnerable</span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1">✓ Passed</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-300">2. Authorization / BOLA</span>
                    {scan.findings.some(f => f.category.includes('Authorization')) ? (
                      <span className="text-orange-400 flex items-center gap-1">⚠ Vulnerable</span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1">✓ Passed</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-300">3. Input Validation</span>
                    {scan.findings.some(f => f.category === 'Input Validation') ? (
                      <span className="text-red-400 flex items-center gap-1">✕ Vulnerable</span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1">✓ Passed</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-300">4. Security Headers</span>
                    {scan.findings.some(f => f.category === 'Security Headers') ? (
                      <span className="text-amber-400 flex items-center gap-1">⚠ Missing</span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1">✓ Passed</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-300">5. Rate Limiting</span>
                    {scan.findings.some(f => f.category === 'Rate Limiting') ? (
                      <span className="text-orange-400 flex items-center gap-1">⚠ Missing</span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1">✓ Passed</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-300">6. Information Disclosure</span>
                    {scan.findings.some(f => f.category === 'Information Disclosure') ? (
                      <span className="text-red-400 flex items-center gap-1">✕ Leaking</span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1">✓ Passed</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tab Navigation: Findings / Endpoints */}
        {scan && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('findings')}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all ${activeTab === 'findings' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
                >
                  Vulnerabilities ({scan.total_findings})
                </button>
                <button
                  onClick={() => setActiveTab('endpoints')}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all ${activeTab === 'endpoints' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
                >
                  Discovered Endpoints ({scan.endpoints_count})
                </button>
              </div>

              {activeTab === 'findings' && (
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Filter issues..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>

                  <select
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(e.target.value)}
                    className="bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="ALL">All Severities</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              )}
            </div>

            {/* Findings List View */}
            {activeTab === 'findings' && (
              <div className="space-y-3">
                {filteredFindings.length === 0 ? (
                  <div className="text-center py-12 bg-slate-900/30 rounded-2xl border border-slate-800/60">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
                    <h4 className="text-sm font-bold text-slate-300">Zero Matching Vulnerabilities</h4>
                    <p className="text-xs text-slate-500 mt-1">No security weaknesses match your active filters.</p>
                  </div>
                ) : (
                  filteredFindings.map((finding) => (
                    <div
                      key={finding.id}
                      onClick={() => setSelectedFinding(finding)}
                      className="p-4 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 transition-all cursor-pointer flex items-center justify-between group shadow-md"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="mt-0.5">
                          <SeverityBadge severity={finding.severity} />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {finding.title}
                            </h4>
                            <span className="text-xs font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                              {finding.category}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                            <span className="text-cyan-400 font-bold">{finding.method}</span>
                            <span className="text-slate-300">{finding.endpoint}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-mono text-slate-500 group-hover:text-cyan-400 transition-colors flex items-center gap-1">
                          Inspect <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Endpoints List View */}
            {activeTab === 'endpoints' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {scan.endpoints.map((ep, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                    <div className="space-y-1 font-mono text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold">{ep.method}</span>
                        <span className="text-slate-200 font-bold">{ep.path}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] font-sans">{ep.summary || 'Discovered Route'}</p>
                    </div>
                    {ep.requires_auth && (
                      <span className="text-[10px] font-mono bg-indigo-950/80 text-indigo-400 border border-indigo-800/60 px-2 py-0.5 rounded-full font-bold">
                        AUTH REQUIRED
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Empty State when no scan has been run */}
        {!scan && !isScanning && (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800/80 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950/50 border border-cyan-800/40 flex items-center justify-center mx-auto text-cyan-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">No Security Scan Active</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto font-mono">
                Launch a live security scan against a custom target URL or click &quot;Run Demo Security Scan&quot; to evaluate the embedded vulnerable target.
              </p>
            </div>
            <button
              onClick={handleRunDemoScan}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs tracking-wide uppercase transition-all shadow-lg shadow-cyan-500/20"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Launch Demo Scan (Instant)</span>
            </button>
          </div>
        )}
      </main>

      {/* Slide-out Vulnerability Inspector Drawer */}
      <FindingDrawer
        finding={selectedFinding}
        targetUrl={scan?.target_url || targetUrl}
        onClose={() => setSelectedFinding(null)}
      />

      {/* OpenAPI / Swagger Import Modal */}
      <OpenApiModal
        isOpen={isOpenApiModalOpen}
        onClose={() => setIsOpenApiModalOpen(false)}
        onApplySpec={handleApplySpec}
      />
    </div>
  );
}

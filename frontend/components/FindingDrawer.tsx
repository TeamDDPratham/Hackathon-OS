import React, { useState } from 'react';
import { Finding } from '../types/scan';
import { SeverityBadge } from './SeverityBadge';
import { 
  X, AlertTriangle, ShieldCheck, FileCode, 
  Terminal, Copy, Check 
} from 'lucide-react';

interface FindingDrawerProps {
  finding: Finding | null;
  targetUrl?: string;
  onClose: () => void;
}

export const FindingDrawer: React.FC<FindingDrawerProps> = ({ finding, targetUrl = 'http://127.0.0.1:8000', onClose }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  if (!finding) return null;

  // Generate realistic reproduction cURL from actual finding data
  const generateCurlCommand = (): string => {
    const fullUrl = targetUrl.replace(/\/$/, '') + finding.endpoint;
    let cmd = `curl -X ${finding.method} "${fullUrl}"`;
    
    if (finding.evidence?.payload_tested) {
      const payloadStr = JSON.stringify(finding.evidence.payload_tested).replace(/"/g, '\\"');
      cmd += ` \\\n  -H "Content-Type: application/json" \\\n  -d "${payloadStr}"`;
    } else if (finding.method === 'POST' || finding.method === 'PUT') {
      cmd += ` \\\n  -H "Content-Type: application/json" \\\n  -d "{}"`;
    }
    return cmd;
  };

  const handleCopyCode = () => {
    if (finding.remediation_code) {
      navigator.clipboard.writeText(finding.remediation_code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleCopyCurl = () => {
    const curl = generateCurlCommand();
    navigator.clipboard.writeText(curl);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-950/60 sticky top-0 backdrop-blur-md z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <SeverityBadge severity={finding.severity} />
              <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                {finding.cwe_id || 'CWE-API'}
              </span>
              <span className="text-xs font-mono text-cyan-400">
                {finding.category}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">{finding.title}</h2>
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">{finding.method}</span>
              <span className="text-slate-300">{finding.endpoint}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Description */}
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Vulnerability Overview
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
              {finding.description}
            </p>
          </div>

          {/* Impact */}
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-red-400 flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-4 h-4" /> Potential Security Impact
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-red-950/20 p-4 rounded-xl border border-red-900/30">
              {finding.impact}
            </p>
          </div>

          {/* Evidence Inspector & Reproduction cURL */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-cyan-400" /> Reproduction Evidence & cURL
              </h3>
              <button
                onClick={handleCopyCurl}
                className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors bg-slate-850 px-2 py-1 rounded border border-slate-700 bg-slate-800/50"
              >
                {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copiedCurl ? 'cURL Copied!' : 'Copy cURL'}</span>
              </button>
            </div>
            
            {/* cURL Display Box */}
            <div className="bg-black/90 p-3 rounded-t-xl border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto border-b-0">
              <pre className="text-[11px]">{generateCurlCommand()}</pre>
            </div>

            {/* Raw Evidence Payload Box */}
            <div className="bg-slate-950 p-3 rounded-b-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
              <pre className="whitespace-pre-wrap text-[11px] text-slate-400">{JSON.stringify(finding.evidence, null, 2)}</pre>
            </div>
          </div>

          {/* Remediation Guidance */}
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-4 h-4" /> Recommended Remediation
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-emerald-950/20 p-4 rounded-xl border border-emerald-900/30">
              {finding.recommendation}
            </p>
          </div>

          {/* Code Fix Diff */}
          {finding.remediation_code && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-purple-400" /> Hardened Code Implementation
                </h3>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  {copiedCode ? 'Copied' : 'Copy Code'}
                </button>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-purple-900/30 font-mono text-xs text-purple-200 overflow-x-auto">
                <pre>{finding.remediation_code}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-between items-center text-xs font-mono text-slate-400">
          <span>Finding ID: {finding.id}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-sans font-medium"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};

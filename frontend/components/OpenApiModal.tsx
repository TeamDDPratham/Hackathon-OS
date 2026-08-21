import React, { useState } from 'react';
import { X, FileJson, CheckCircle, AlertCircle } from 'lucide-react';
import { DiscoveredEndpoint } from '../types/scan';

interface OpenApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySpec: (spec: Record<string, unknown>, endpoints: DiscoveredEndpoint[]) => void;
}

export const OpenApiModal: React.FC<OpenApiModalProps> = ({ isOpen, onClose, onApplySpec }) => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [parsedEndpoints, setParsedEndpoints] = useState<DiscoveredEndpoint[]>([]);

  if (!isOpen) return null;

  const handleParse = (text: string) => {
    setJsonText(text);
    setError(null);
    if (!text.trim()) {
      setParsedEndpoints([]);
      return;
    }

    try {
      const parsed = JSON.parse(text);
      if (!parsed.paths || typeof parsed.paths !== 'object') {
        setError('Valid OpenAPI/Swagger document must contain a "paths" object.');
        setParsedEndpoints([]);
        return;
      }

      const endpoints: DiscoveredEndpoint[] = [];
      for (const [path, methods] of Object.entries(parsed.paths)) {
        if (methods && typeof methods === 'object') {
          for (const [method, details] of Object.entries(methods as Record<string, unknown>)) {
            if (['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) {
              const d = details as Record<string, unknown>;
              endpoints.push({
                path,
                method: method.toUpperCase(),
                summary: (d.summary as string) || (d.description as string) || `${method.toUpperCase()} ${path}`,
                requires_auth: Boolean(d.security)
              });
            }
          }
        }
      }

      if (endpoints.length === 0) {
        setError('No valid HTTP path operations found in OpenAPI spec.');
        setParsedEndpoints([]);
      } else {
        setParsedEndpoints(endpoints);
      }
    } catch {
      setError('Malformed JSON format. Please provide valid JSON.');
      setParsedEndpoints([]);
    }
  };

  const handleApply = () => {
    try {
      const parsed = JSON.parse(jsonText);
      onApplySpec(parsed, parsedEndpoints);
      onClose();
    } catch {
      setError('Unable to apply specification.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Import OpenAPI / Swagger Spec</h3>
              <p className="text-xs text-slate-400 font-mono">Paste raw OpenAPI v3 or Swagger 2.0 JSON document</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="text-xs font-mono text-slate-400 uppercase block mb-1.5">OpenAPI / Swagger JSON</label>
            <textarea
              rows={8}
              value={jsonText}
              onChange={(e) => handleParse(e.target.value)}
              placeholder='{ "openapi": "3.0.0", "info": { "title": "Sample API" }, "paths": { "/api/users": { "get": { "summary": "Get users" } } } }'
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-xs font-mono text-red-400 bg-red-950/30 border border-red-900/40 p-3 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {parsedEndpoints.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle className="w-3.5 h-3.5" /> Discovered {parsedEndpoints.length} Endpoint(s)
                </span>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 font-mono text-xs">
                {parsedEndpoints.map((ep, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-cyan-400 font-bold px-1.5 py-0.5 bg-slate-900 rounded">{ep.method}</span>
                      <span className="text-slate-300">{ep.path}</span>
                    </div>
                    <span className="text-[11px] text-slate-500">{ep.summary}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={parsedEndpoints.length === 0}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs uppercase disabled:opacity-50 transition-colors"
          >
            Apply Specification ({parsedEndpoints.length})
          </button>
        </div>
      </div>
    </div>
  );
};

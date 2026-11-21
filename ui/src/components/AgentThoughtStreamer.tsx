import React, { useState, useEffect, useCallback } from 'react';
import { Terminal, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface TelemetryPayload {
  policyVersion?: string;
  uptimeSeconds?: number;
  database?: { status?: string; totalProperties?: number; totalLeases?: number; totalUsers?: number };
  performanceGates?: {
    verificationGates?: string;
    lastGateRunAt?: string | null;
    lastScanFiles?: number;
    lastScanFindings?: number | null;
  };
}

export const AgentThoughtStreamer: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [telemetry, setTelemetry] = useState<TelemetryPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTelemetry = useCallback(async () => {
    setLoading(true);
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 1500);
      const res = await fetch('http://localhost:5001/api/aegis/telemetry', { signal: controller.signal });
      clearTimeout(id);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as TelemetryPayload;
      setTelemetry(json);
      setError(null);
    } catch {
      setTelemetry(null);
      setError('Offline — Start Server :5001 for live telemetry');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTelemetry();
  }, [fetchTelemetry]);

  return (
    <div
      className={`p-4 rounded-xl border backdrop-blur-md transition-colors ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-inherit">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-purple-500" />
          <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Live AEGIS Runtime Telemetry Stream
          </span>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
              telemetry
                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
            }`}
          >
            {telemetry ? 'Connected :5001' : 'Offline'}
          </span>
        </div>
        <button
          onClick={() => void fetchTelemetry()}
          className={`flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded border transition-colors ${
            isDark
              ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
              : 'bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <RefreshCw className={`w-3 h-3 text-sky-500 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="mt-3 font-mono text-xs space-y-2">
        {error ? (
          <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-500 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        ) : telemetry ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg border border-inherit">
              <div className="text-[10px] text-slate-400">Policy Version</div>
              <div className="font-semibold text-emerald-500 flex items-center gap-1 mt-0.5">
                <CheckCircle className="w-3 h-3" /> {telemetry.policyVersion ?? 'unknown'}
              </div>
            </div>
            <div className="p-2.5 rounded-lg border border-inherit">
              <div className="text-[10px] text-slate-400">Verification Gates</div>
              <div className="font-semibold mt-0.5">{telemetry.performanceGates?.verificationGates ?? 'UNVERIFIED'}</div>
            </div>
            <div className="p-2.5 rounded-lg border border-inherit">
              <div className="text-[10px] text-slate-400">Database ({telemetry.database?.status ?? 'UNKNOWN'})</div>
              <div className="mt-0.5">
                Props: {telemetry.database?.totalProperties ?? 0} | Leases: {telemetry.database?.totalLeases ?? 0} | Users: {telemetry.database?.totalUsers ?? 0}
              </div>
            </div>
            <div className="p-2.5 rounded-lg border border-inherit">
              <div className="text-[10px] text-slate-400">Latest Real Scan</div>
              <div className="mt-0.5">
                Files: {telemetry.performanceGates?.lastScanFiles ?? 0} | Findings: {telemetry.performanceGates?.lastScanFindings ?? 'N/A'}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

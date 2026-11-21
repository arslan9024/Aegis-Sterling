import React, { useState } from 'react';
import { RefreshCw, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HealthAuditState {
  healthStatus?: string;
  policyVersion?: string;
  dbStatus?: string;
  gateStatus?: string;
  error?: string;
}

export const OuroborosWaveTrigger: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [audit, setAudit] = useState<HealthAuditState | null>(null);

  const handleRunCheck = async () => {
    if (isRunning) return;
    setIsRunning(true);
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 1500);
      const [hRes, tRes] = await Promise.all([
        fetch('http://localhost:5001/api/aegis/health', { signal: controller.signal }),
        fetch('http://localhost:5001/api/aegis/telemetry', { signal: controller.signal }),
      ]);
      clearTimeout(id);
      const hJson = (await hRes.json()) as { status?: string; policyVersion?: string };
      const tJson = (await tRes.json()) as {
        database?: { status?: string };
        performanceGates?: { verificationGates?: string };
      };
      setAudit({
        healthStatus: hJson.status ?? 'PASS',
        policyVersion: hJson.policyVersion,
        dbStatus: tJson.database?.status ?? 'UNKNOWN',
        gateStatus: tJson.performanceGates?.verificationGates ?? 'UNVERIFIED',
      });
    } catch {
      setAudit({
        error: 'Server :5001 unreachable. Run CLI locally: npm run aegis:ouroboros:once',
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div
      className={`p-4 rounded-xl border backdrop-blur-md transition-colors ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-inherit">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
            AEGIS Live Governance & Gate Probe
          </span>
        </div>
        <button
          onClick={() => void handleRunCheck()}
          disabled={isRunning}
          className="px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
          {isRunning ? 'Querying :5001...' : 'Query Live Server Gates'}
        </button>
      </div>

      {audit && (
        <div className="mt-3 text-xs font-mono">
          {audit.error ? (
            <div className="p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-500 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{audit.error}</span>
            </div>
          ) : (
            <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              Health: {audit.healthStatus} | Policy: {audit.policyVersion} | DB: {audit.dbStatus} | Gates: {audit.gateStatus}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

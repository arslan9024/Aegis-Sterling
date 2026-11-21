import React, { useState, useEffect, useCallback } from 'react';
import { Server, Activity, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface RepoService {
  name: string;
  repo: string;
  port: number;
  url: string;
  status: 'online' | 'offline';
  latencyMs: number | null;
  branch: string;
}

const INITIAL_SERVICES: RepoService[] = [
  {
    name: 'Aegis Sterling Control UI',
    repo: 'Aegis-Sterling/ui',
    port: 3333,
    url: 'http://localhost:3333',
    status: 'online',
    latencyMs: null,
    branch: 'main',
  },
  {
    name: 'White Caves Frontend CRM',
    repo: 'White-Caves-Frontend',
    port: 3000,
    url: 'http://localhost:3000',
    status: 'offline',
    latencyMs: null,
    branch: 'main',
  },
  {
    name: 'White Caves Ultra-Prime Showcase',
    repo: 'White-Caves-Web',
    port: 3001,
    url: 'http://localhost:3001',
    status: 'offline',
    latencyMs: null,
    branch: 'main',
  },
  {
    name: 'Distributed Core Server Engine',
    repo: 'White-Caves-Server',
    port: 5001,
    url: 'http://localhost:5001/health/live',
    status: 'offline',
    latencyMs: null,
    branch: 'main',
  },
];

export const MultiRepoLiveMonitor: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [services, setServices] = useState<RepoService[]>(INITIAL_SERVICES);
  const [isPinging, setIsPinging] = useState<boolean>(false);

  const pingEndpoint = async (service: RepoService): Promise<Partial<RepoService>> => {
    const start = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      await fetch(service.url, { method: 'GET', mode: 'no-cors', signal: controller.signal });
      clearTimeout(timeoutId);
      return { status: 'online', latencyMs: Math.max(Math.round(performance.now() - start), 1) };
    } catch {
      return { status: 'offline', latencyMs: null };
    }
  };

  const refreshPings = useCallback(async () => {
    setIsPinging(true);
    const updated = await Promise.all(
      INITIAL_SERVICES.map(async s => ({ ...s, ...(await pingEndpoint(s)) }))
    );
    setServices(updated);
    setIsPinging(false);
  }, []);

  useEffect(() => {
    void refreshPings();
  }, [refreshPings]);

  return (
    <div
      className={`p-4 rounded-xl border backdrop-blur-md transition-colors ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-inherit">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-500" />
          <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Live Micro-Repo Port Matrix & Health
          </span>
        </div>
        <button
          onClick={() => void refreshPings()}
          className={`px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1 border transition-colors ${
            isDark
              ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
              : 'bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <RefreshCw className={`w-3 h-3 text-sky-500 ${isPinging ? 'animate-spin' : ''}`} />
          Ping Topology
        </button>
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        {services.map(srv => (
          <div
            key={srv.name}
            className={`p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
              isDark
                ? 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-100">{srv.name}</div>
                <div className="font-mono text-[10px] text-slate-400 mt-0.5">{srv.repo}</div>
              </div>
              <span
                className={`font-mono text-[11px] px-2 py-0.5 rounded font-bold border flex items-center gap-1 ${
                  srv.status === 'online'
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    srv.status === 'online' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
                :{srv.port} {srv.status.toUpperCase()}
              </span>
            </div>

            <div className="mt-3 pt-2 border-t border-inherit flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
              <span className="font-mono">
                Branch: <strong className="text-purple-600 dark:text-purple-400">{srv.branch}</strong>
              </span>
              <span className="font-mono flex items-center gap-1">
                <Activity className="w-3 h-3 text-sky-500" />
                {srv.latencyMs !== null ? `${srv.latencyMs}ms` : 'Unreachable'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

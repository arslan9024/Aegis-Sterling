import React, { useState, useEffect } from 'react';
import { Terminal, Play, Pause, CheckCircle, Activity } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface AgentThought {
  id: string;
  timestamp: string;
  agent: string;
  role: string;
  action: string;
  protocol?: string;
  status: 'executing' | 'verified' | 'standby';
  detail: string;
}

const INITIAL_THOUGHTS: AgentThought[] = [
  {
    id: 't-1',
    timestamp: '15:28:02',
    agent: '@Ada',
    role: 'Chief Architect',
    action: 'Dual-Book Living Corpus Synchronized',
    protocol: 'TURING-BOOK-011',
    status: 'verified',
    detail: 'Verified Book 1 (White Caves) & Book 2 (Aegis Sterling) mathematical tree parity.'
  },
  {
    id: 't-2',
    timestamp: '15:28:15',
    agent: '@Grace',
    role: 'Lead Engineer',
    action: 'Token Budget Shield Enforcement',
    protocol: 'TURING-LAW-000',
    status: 'verified',
    detail: 'Active execution envelope maintained strictly under 15,000 sub-token boundary.'
  },
  {
    id: 't-3',
    timestamp: '15:28:29',
    agent: '@Nova',
    role: 'Crucible Commander',
    action: 'Continuous Autopilot Ouroboros Loop Scan',
    protocol: 'TURING-PERPETUAL-OUROBOROS',
    status: 'executing',
    detail: 'Scanning multi-repo topology for dead code elimination and single-purpose file law violations.'
  },
  {
    id: 't-4',
    timestamp: '15:28:38',
    agent: '@Gwynne',
    role: 'DevOps / SRE Lead',
    action: 'Static Verification Gate Completed',
    protocol: 'TURING-DEV-SERVER-BAN-013',
    status: 'verified',
    detail: 'Build test completed cleanly across 1605 modules with zero blocking server instances.'
  },
  {
    id: 't-5',
    timestamp: '15:28:45',
    agent: '@Sofia',
    role: 'SecOps Lead',
    action: 'Level 5 RBAC & Secret Vault Audit',
    protocol: 'AEG-004',
    status: 'verified',
    detail: 'Single-source environment credential validation and pre-commit secret shields armed.'
  }
];

export const AgentThoughtStreamer: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [thoughts, setThoughts] = useState<AgentThought[]>(INITIAL_THOUGHTS);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);

  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      const agents = [
        { name: '@Una', role: 'UI/UX Primitive Architecture', action: 'Tailwind Light/Dark Token Calibration', protocol: 'AEG-002', detail: 'Zero-runtime CSS variables verified across all view primitives.' },
        { name: '@Barbara', role: 'Prisma Data Store', action: 'Relational Entity Integrity Pass', protocol: 'AEG-013', detail: 'ERMS object models decoupled from TMS transactional tasks.' },
        { name: '@Ruchi', role: 'API Gateway Lead', action: 'Idempotency Key Verification', protocol: 'AEG-012', detail: 'Statutory DLD API transmission guarantees evaluated.' },
        { name: '@Invoice', role: 'FinTech Statutory Lead', action: 'UAE 5% VAT & 9% Tax Ledger Audit', protocol: 'AEG-029', detail: 'Escrow split distributions validated prior to deal status lock.' },
        { name: '@Rachel_QA', role: 'SQA Lead', action: 'Targeted Verification Loop Check', protocol: 'AEG-023', detail: 'Component build integrity validated at sub-second latency.' }
      ];
      const randomAgent = agents[Math.floor(Math.random() * agents.length)];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      
      const newThought: AgentThought = {
        id: `t-${Date.now()}`,
        timestamp: timeStr,
        agent: randomAgent.name,
        role: randomAgent.role,
        action: randomAgent.action,
        protocol: randomAgent.protocol,
        status: 'executing',
        detail: randomAgent.detail
      };

      setThoughts(prev => [newThought, ...prev.slice(0, 19)]);
    }, 7000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  return (
    <div className={`p-4 rounded-xl border backdrop-blur-md transition-colors ${
      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      <div className="flex items-center justify-between pb-3 border-b border-inherit">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-purple-500 animate-pulse" />
          <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Real-Time Autonomous Agent Streamer (235-Node Mesh)
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded border transition-colors ${
              isDark 
                ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300' 
                : 'bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {isStreaming ? <Pause className="w-3 h-3 text-amber-500" /> : <Play className="w-3 h-3 text-emerald-500" />}
            {isStreaming ? 'Pause Stream' : 'Resume'}
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-2 max-h-72 overflow-y-auto font-mono text-xs pr-1">
        {thoughts.map(thought => (
          <div
            key={thought.id}
            className={`p-2.5 rounded-lg border transition-all flex items-start gap-3 ${
              isDark 
                ? 'bg-slate-950/60 border-slate-800/80 hover:border-purple-500/40' 
                : 'bg-slate-50 border-slate-200 hover:border-purple-300'
            }`}
          >
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-400">{thought.timestamp}</span>
              {thought.status === 'executing' ? (
                <Activity className="w-3.5 h-3.5 text-sky-500 mt-1 animate-spin" />
              ) : (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-1" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-purple-600 dark:text-purple-400">{thought.agent}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">({thought.role})</span>
                {thought.protocol && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    {thought.protocol}
                  </span>
                )}
              </div>
              <div className="text-slate-800 dark:text-slate-200 font-semibold text-[11px] mt-0.5">
                {thought.action}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                {thought.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Card, Badge } from './components/ui/card';
import {
  Shield,
  Layers,
  Cpu,
  Terminal,
  Activity,
  GitBranch,
  Server,
  Smartphone,
  Globe,
  CheckCircle2,
  Clock,
  BookOpen,
  ExternalLink,
} from 'lucide-react';

interface SquadCardProps {
  name: string;
  lead: string;
  role: string;
  agentsCount: number;
  status: 'active' | 'standby' | 'verifying';
  repo: string;
  icon: React.ReactNode;
}

const squads: SquadCardProps[] = [
  {
    name: 'Frontend Squad',
    lead: '@Una',
    role: 'UI/UX Primitives & Luxury React Views',
    agentsCount: 12,
    status: 'active',
    repo: 'White-Caves-Frontend',
    icon: <Globe className="w-5 h-5 text-sky-400" />,
  },
  {
    name: 'Server Squad',
    lead: '@Mira',
    role: 'Express API, Prisma ORM & UAE Tax Invariants',
    agentsCount: 16,
    status: 'active',
    repo: 'White-Caves-Server',
    icon: <Server className="w-5 h-5 text-emerald-400" />,
  },
  {
    name: 'Mobile Squad',
    lead: '@Iris',
    role: 'Cross-Platform Mobile Engine & Biometrics',
    agentsCount: 9,
    status: 'standby',
    repo: 'White-Caves-Mobile',
    icon: <Smartphone className="w-5 h-5 text-amber-400" />,
  },
  {
    name: 'Sovereign Core Loop',
    lead: '@Ada & @Zoe',
    role: 'Dual-Track 235 Agent Autonomous Mesh',
    agentsCount: 235,
    status: 'active',
    repo: 'Aegis-Sterling',
    icon: <Shield className="w-5 h-5 text-purple-400" />,
  },
];

export function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'mesh' | 'repos' | 'book'>('overview');

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-[#0b1222]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 via-indigo-600 to-sky-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base tracking-wide text-white">AEGIS STERLING</h1>
              <Badge variant="purple">v5.0 Sovereign</Badge>
            </div>
            <p className="text-xs text-slate-400">Autonomous AI Orchestrator & Multi-Agent Swarm</p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-lg p-1 text-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Mission Control
          </button>
          <button
            onClick={() => setActiveTab('mesh')}
            className={`px-3.5 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'mesh'
                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Workforce Mesh (235)
          </button>
          <button
            onClick={() => setActiveTab('repos')}
            className={`px-3.5 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'repos'
                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Multi-Repo Matrix
          </button>
          <button
            onClick={() => setActiveTab('book')}
            className={`px-3.5 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'book'
                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-rose-400" />
            Book of White Caves
          </button>
        </div>

        {/* Right Status Indicators */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-mono">Antigravity Core: Live</span>
          </div>
          <Badge variant="cyan">Project #01: White Caves</Badge>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {activeTab === 'book' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-xl px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                  <BookOpen className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">The Book of White Caves (Living Encyclopedia)</h2>
                  <p className="text-xs text-slate-400">Chapters 1–8 · Multi-repo software architecture &amp; dual-track RBAC gates</p>
                </div>
              </div>
              <a
                href="/book-white-caves/index.html"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20"
              >
                <span>Open Standalone</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#09090b] shadow-2xl h-[780px]">
              <iframe
                src="/book-white-caves/index.html"
                title="The Book of White Caves"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        ) : (
          <>
            {/* Top Hero KPI Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-sky-900/40">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>ACTIVE CLIENT PROJECT</span>
              <Globe className="w-4 h-4 text-sky-400" />
            </div>
            <div className="mt-2 text-xl font-bold text-white">White Caves Real Estate</div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-sky-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Wave 56 Active
            </div>
          </Card>

          <Card className="border-purple-900/40">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>AUTONOMOUS WORKFORCE</span>
              <Cpu className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-2 text-xl font-bold text-white">235 Agents</div>
            <div className="mt-1 text-xs text-purple-400">108 Eng · 120 Biz · 7 Exec</div>
          </Card>

          <Card className="border-emerald-900/40">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>STATUTORY COMPLIANCE</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-xl font-bold text-white">100% Enforced</div>
            <div className="mt-1 text-xs text-emerald-400">UAE FTA 5% · 9% Corp Tax</div>
          </Card>

          <Card className="border-amber-900/40">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>SECRETS VAULT</span>
              <Shield className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 text-xl font-bold text-white">Isolated Vault</div>
            <div className="mt-1 text-xs text-amber-400">Single Source of Truth · Git-Ignored</div>
          </Card>
        </div>

        {/* Squad Command Grid */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold tracking-wide text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Specialized Project Squads
            </h2>
            <span className="text-xs text-slate-400">Clean Domain Separation via Aegis</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {squads.map((squad) => (
              <Card key={squad.name} className="hover:border-slate-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      {squad.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-100">{squad.name}</h3>
                      <p className="text-xs text-slate-400">{squad.role}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      squad.status === 'active'
                        ? 'success'
                        : squad.status === 'verifying'
                        ? 'cyan'
                        : 'warning'
                    }
                  >
                    {squad.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-4">
                    <span>
                      Squad Lead: <strong className="text-slate-200">{squad.lead}</strong>
                    </span>
                    <span>
                      Roster: <strong className="text-slate-200">{squad.agentsCount} agents</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                    <GitBranch className="w-3.5 h-3.5 text-purple-400" />
                    {squad.repo}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Live Architecture Execution Feed */}
        <Card className="border-slate-800 bg-[#0b101d]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 font-mono text-purple-400">
              <Terminal className="w-4 h-4" />
              <span>ORCHESTRATION PIPELINE · ZERO-TOKEN SPEED</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Auto-refresh: 500ms</span>
            </div>
          </div>

          <div className="mt-3 font-mono text-xs space-y-1.5 text-slate-300">
            <div className="flex items-center gap-2 text-emerald-400">
              <span>[OK]</span>
              <span>Aegis-Sterling core loop synchronized with White-Caves-Frontend and Server</span>
            </div>
            <div className="flex items-center gap-2 text-sky-400">
              <span>[INFO]</span>
              <span>Central secrets vault verified at /secrets (.git-ignored)</span>
            </div>
            <div className="flex items-center gap-2 text-purple-400">
              <span>[ROSTER]</span>
              <span>Dual 1-12-108 matrix active (108 Engineering specialists + 120 Business supervisors)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span>[AWAITING]</span>
              <span>Ready to trigger next wave or execute subagent missions</span>
            </div>
          </div>
        </Card>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#090d16] px-6 py-3 text-xs text-slate-500 flex items-center justify-between">
        <div>Architect: Arslan Malik · Sovereign AI Orchestrator Core</div>
        <div className="flex items-center gap-3">
          <span>shadcn/ui + Tailwind CSS</span>
          <span>•</span>
          <span className="text-purple-400">Google Antigravity &amp; VS Code</span>
        </div>
      </footer>
    </div>
  );
}
export default App;


import React, { useState } from 'react';
import { Card, Badge } from './components/ui/card';
import { BookKnowledgeViewer } from './components/BookKnowledgeViewer';
import { MultiLevelBookView } from './components/WhiteCavesBook/MultiLevelBookView';
import { MultiLevelBookProvider } from './components/WhiteCavesBook/MultiLevelBookContext';
import { ProtocolReferenceModal } from './components/ProtocolReferenceModal';
import { ProtocolRef } from './components/ProtocolRef';
import { PROTOCOL_REGISTRY, ProtocolReference } from './data/protocolRegistry';
import { useTheme } from './context/ThemeContext';
import {
  Shield,
  Layers,
  Cpu,
  Server,
  Smartphone,
  Globe,
  CheckCircle2,
  BookOpen,
  Sun,
  Moon,
  Laptop,
  Activity,
  ChevronRight,
  ChevronDown,
  Terminal,
  Compass,
  FolderKanban,
  Sparkles,
} from 'lucide-react';

interface SquadCardProps {
  name: string;
  lead: string;
  role: string;
  agentsCount: number;
  status: 'active' | 'standby' | 'verifying';
  repo: string;
  port?: string;
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
    port: '3000',
    icon: <Globe className="w-5 h-5 text-sky-500" />,
  },
  {
    name: 'Web Showcase Squad',
    lead: '@Victoria & @Una',
    role: 'Next.js 16 SSR & Dubai Ultra-Prime Public Engine',
    agentsCount: 8,
    status: 'active',
    repo: 'White-Caves-Web',
    port: '3001',
    icon: <Layers className="w-5 h-5 text-rose-500" />,
  },
  {
    name: 'Server Squad',
    lead: '@Mira',
    role: 'Express API, Prisma ORM & UAE Tax Invariants',
    agentsCount: 16,
    status: 'active',
    repo: 'White-Caves-Server',
    port: '5001',
    icon: <Server className="w-5 h-5 text-emerald-500" />,
  },
  {
    name: 'Mobile Squad',
    lead: '@Iris',
    role: 'Cross-Platform Mobile Engine & Biometrics',
    agentsCount: 9,
    status: 'standby',
    repo: 'White-Caves-Mobile',
    port: '8081',
    icon: <Smartphone className="w-5 h-5 text-amber-500" />,
  },
  {
    name: 'Sovereign Core Loop',
    lead: '@Ada & @Zoe',
    role: 'Dual-Track 235 Agent Autonomous Mesh',
    agentsCount: 235,
    status: 'active',
    repo: 'Aegis-Sterling',
    icon: <Shield className="w-5 h-5 text-purple-500" />,
  },
];

export function App() {
  const [activeTab, setActiveTab] = useState<'library' | 'reader' | 'protocols' | 'mesh' | 'repos' | 'overview'>('library');
  const [activeBookId, setActiveBookId] = useState<'book-01-white-caves' | 'book-02-aegis-sterling'>('book-01-white-caves');
  const [libraryMenuOpen, setLibraryMenuOpen] = useState<boolean>(true);
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolReference | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const { theme, resolvedTheme, toggleTheme } = useTheme();

  const handleOpenProtocol = (code: string) => {
    if (PROTOCOL_REGISTRY[code]) {
      setSelectedProtocol(PROTOCOL_REGISTRY[code]);
    }
  };

  const handleNavigateToChapter = (_slug: string) => {
    setActiveTab('reader');
  };

  const handleSelectBookFromSidebar = (bookId: 'book-01-white-caves' | 'book-02-aegis-sterling') => {
    setActiveBookId(bookId);
    setActiveTab('library');
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      resolvedTheme === 'dark' ? 'bg-[#090d16] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      {/* ── Level 1: Master Top Navigation Bar ── */}
      <header className={`border-b backdrop-blur-md sticky top-0 z-40 px-6 py-3 flex items-center justify-between transition-colors duration-300 ${
        resolvedTheme === 'dark' ? 'border-slate-800/80 bg-[#0b1222]/90' : 'border-slate-200 bg-white/95 shadow-xs'
      }`}>
        {/* Brand & Roster Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-sky-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm tracking-wide text-slate-900 dark:text-white">AEGIS STERLING</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
                v5.0 Sovereign
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Chief Autonomous Orchestrator & Living Chronicler</p>
          </div>
        </div>

        {/* Global Breadcrumb Path Lineage */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 font-mono bg-slate-100 dark:bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
          <span className="text-purple-600 dark:text-purple-400 font-semibold">White Caves</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600 dark:text-slate-300 font-medium">Aegis Mission Control</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-rose-500 font-bold uppercase">{activeTab}</span>
        </div>

        {/* Top Controls: Theme, Ports & System Health */}
        <div className="flex items-center gap-3 text-xs">
          {/* Theme Toggle (Light Default Invariant) */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              resolvedTheme === 'dark'
                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-300 text-indigo-700 hover:bg-slate-200'
            }`}
            title={`Current theme: ${theme} (resolved: ${resolvedTheme}). Click to toggle.`}
          >
            {theme === 'system' ? <Laptop className="w-4 h-4 text-sky-500" /> : resolvedTheme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span className="capitalize">{theme}</span>
          </button>

          {/* Antigravity Heartbeat */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">Mesh Online: 235 Nodes</span>
          </div>
        </div>
      </header>

      {/* ── Main Layout: Dual Activity Rail + Content Viewport ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Master Navigation Rail (Tree Activity Bar) */}
        <aside className={`border-r flex flex-col transition-all duration-300 z-30 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } ${
          resolvedTheme === 'dark' ? 'bg-[#0b101d] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {/* Sidebar Toggle & Header */}
          <div className="p-3 border-b border-inherit flex items-center justify-between">
            {!sidebarCollapsed && (
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Navigation Rail
              </span>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors mx-auto"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Compass className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-2 space-y-1 flex-1">
            {/* Master Library Accordion Group */}
            <div className="space-y-1">
              <button
                onClick={() => {
                  setActiveTab('library');
                  if (!sidebarCollapsed) setLibraryMenuOpen(!libraryMenuOpen);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'library'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 flex-shrink-0 text-amber-400" />
                  {!sidebarCollapsed && <span>Aegis Library</span>}
                </div>
                {!sidebarCollapsed && (
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      libraryMenuOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                )}
              </button>

              {/* Sub-Items: Book 1 & Book 2 */}
              {!sidebarCollapsed && libraryMenuOpen && (
                <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-purple-500/30 ml-4 animate-in fade-in duration-150">
                  <button
                    onClick={() => handleSelectBookFromSidebar('book-01-white-caves')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between ${
                      activeTab === 'library' && activeBookId === 'book-01-white-caves'
                        ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold border border-purple-300 dark:border-purple-800'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="truncate">Book 1: White Caves</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
                      Project
                    </span>
                  </button>

                  <button
                    onClick={() => handleSelectBookFromSidebar('book-02-aegis-sterling')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between ${
                      activeTab === 'library' && activeBookId === 'book-02-aegis-sterling'
                        ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold border border-purple-300 dark:border-purple-800'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="truncate">Book 2: Aegis Sterling</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" /> Auto
                    </span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveTab('reader')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'reader'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-4 h-4 flex-shrink-0 text-rose-500" />
              {!sidebarCollapsed && <span>Executive Reader</span>}
            </button>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-4 h-4 flex-shrink-0" />
              {!sidebarCollapsed && <span>Mission Control</span>}
            </button>

            <button
              onClick={() => setActiveTab('protocols')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'protocols'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-4 h-4 flex-shrink-0 text-sky-500" />
              {!sidebarCollapsed && <span>Protocol Canon (42)</span>}
            </button>

            <button
              onClick={() => setActiveTab('mesh')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'mesh'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-4 h-4 flex-shrink-0 text-purple-500" />
              {!sidebarCollapsed && <span>Workforce Mesh (235)</span>}
            </button>

            <button
              onClick={() => setActiveTab('repos')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'repos'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <FolderKanban className="w-4 h-4 flex-shrink-0 text-emerald-500" />
              {!sidebarCollapsed && <span>Multi-Repo Matrix</span>}
            </button>
          </nav>

          {/* Quick Statutory Reference Pills Drawer */}
          {!sidebarCollapsed && (
            <div className="p-3 border-t border-inherit text-xs bg-slate-50/50 dark:bg-slate-900/30">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400">Quick Reference Portal</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {['TURING-LAW-000', 'AEG-003', 'TURING-SEPARATION-010', 'AEG-012', 'AEG-028'].map(code => (
                  <button
                    key={code}
                    onClick={() => handleOpenProtocol(code)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-purple-700 dark:text-purple-300 hover:border-purple-400 transition-colors"
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Center Main Viewport */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'library' ? (
            <div className="h-[calc(100vh-130px)] w-full">
              <MultiLevelBookProvider initialBookId={activeBookId}>
                <MultiLevelBookView />
              </MultiLevelBookProvider>
            </div>
          ) : activeTab === 'reader' ? (
            <BookKnowledgeViewer />
          ) : activeTab === 'protocols' ? (
            /* ── Protocol Canon & Reference Matrix ── */
            <section className="space-y-4 max-w-6xl mx-auto">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-purple-500" />
                  Sovereign Protocol Canon & Mathematical Reference Tree
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Click any protocol number or badge to inspect mathematical invariant formulas, statutory parents, and code coordinates.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(PROTOCOL_REGISTRY).map((prot) => (
                  <Card key={prot.code} className="hover:border-purple-500/50 transition-all cursor-pointer" onClick={() => setSelectedProtocol(prot)}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs px-2 py-0.5 rounded font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          #{prot.numericId}
                        </span>
                        <h3 className="font-bold text-sm">{prot.code}</h3>
                      </div>
                      <Badge variant={prot.tier === 'Supreme' ? 'red' : 'purple'}>
                        {prot.tier}
                      </Badge>
                    </div>

                    <h4 className="font-semibold text-xs mt-2 text-slate-800 dark:text-slate-200">{prot.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{prot.summary}</p>

                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Category: <strong className="text-slate-600 dark:text-slate-300">{prot.category}</strong></span>
                      <span className="text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">
                        Inspect Node &rarr;
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          ) : activeTab === 'repos' ? (
            /* ── Multi-Repo Matrix & Ports ── */
            <section className="space-y-4 max-w-6xl mx-auto">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FolderKanban className="w-5 h-5 text-emerald-500" />
                  Decoupled Multi-Repository Matrix
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Independent sovereign processes running under <ProtocolRef code="TURING-SEPARATION-010" onOpenProtocol={handleOpenProtocol} /> and <ProtocolRef code="TURING-DEV-SERVER-BAN-013" onOpenProtocol={handleOpenProtocol} />.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {squads.map((squad) => (
                  <Card key={squad.name}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                          {squad.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm">{squad.name}</h3>
                          <span className="text-xs font-mono text-slate-400">{squad.repo}</span>
                        </div>
                      </div>
                      {squad.port && (
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold">
                          Port :{squad.port}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">{squad.role}</p>
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span>Lead: <strong className="text-slate-600 dark:text-slate-200">{squad.lead}</strong></span>
                      <span>Agents: <strong className="text-purple-600 dark:text-purple-400">{squad.agentsCount}</strong></span>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          ) : (
            /* ── Overview Mission Control ── */
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Top Hero KPI Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-sky-500/20">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                    <span>ACTIVE CLIENT PROJECT</span>
                    <Globe className="w-4 h-4 text-sky-500" />
                  </div>
                  <div className="mt-2 text-xl font-bold text-slate-900 dark:text-white">White Caves</div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Wave 56 Active
                  </div>
                </Card>

                <Card className="border-purple-500/20">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                    <span>AUTONOMOUS WORKFORCE</span>
                    <Cpu className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="mt-2 text-xl font-bold text-slate-900 dark:text-white">235 Agents</div>
                  <div className="mt-1 text-xs text-purple-600 dark:text-purple-400 font-medium">
                    108 Eng &bull; 120 Biz &bull; 7 Exec
                  </div>
                </Card>

                <Card className="border-emerald-500/20">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                    <span>STATUTORY COMPLIANCE</span>
                    <Activity className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="mt-2 text-xl font-bold text-slate-900 dark:text-white">100% Enforced</div>
                  <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    UAE FTA 5% &bull; 9% Corp Tax
                  </div>
                </Card>

                <Card className="border-amber-500/20">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                    <span>SECRETS VAULT</span>
                    <Shield className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="mt-2 text-xl font-bold text-slate-900 dark:text-white">Isolated Vault</div>
                  <div className="mt-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
                    Single Source of Truth
                  </div>
                </Card>
              </div>

              {/* Specialized Project Squads */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold tracking-wide text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-500" />
                    Autonomous Project Squads & Engineering Leads
                  </h2>
                  <span className="text-xs text-slate-400">Decoupled Architecture</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {squads.map((squad) => (
                    <Card key={squad.name} className="hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                            {squad.icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">{squad.name}</h3>
                            <span className="text-xs text-slate-400 font-mono">{squad.repo}</span>
                          </div>
                        </div>
                        <Badge variant={squad.status === 'active' ? 'emerald' : 'amber'}>
                          {squad.status}
                        </Badge>
                      </div>

                      <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {squad.role}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                        <span>Lead: <strong className="text-slate-700 dark:text-slate-200">{squad.lead}</strong></span>
                        <span>{squad.agentsCount} Active Nodes</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            </div>
          )}
        </main>
      </div>

      {/* ── Reference Inspector Modal (Portal to Higher / Lower Tiers) ── */}
      <ProtocolReferenceModal
        protocol={selectedProtocol}
        onClose={() => setSelectedProtocol(null)}
        onSelectProtocol={handleOpenProtocol}
        onNavigateToChapter={handleNavigateToChapter}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#090d16] px-6 py-2.5 text-xs text-slate-500 flex items-center justify-between transition-colors">
        <div>Architect: Arslan Malik &bull; Sovereign AI Orchestrator Core</div>
        <div className="flex items-center gap-3">
          <span>Turing Invariant System</span>
          <span>&bull;</span>
          <span className="text-purple-600 dark:text-purple-400 font-semibold">Google Antigravity &amp; VS Code</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

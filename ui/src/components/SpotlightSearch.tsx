// U-04: Global Ctrl+K Spotlight Omni-Search
// Searches chapters, protocols, agents, breadcrumbs across the entire AEGIS corpus
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, BookOpen, Terminal, Cpu, ChevronRight, X } from 'lucide-react';
import { AEGIS_12_LEVEL_CORPUS } from './WhiteCavesBook/masterLibraryData';
import { PROTOCOL_REGISTRY, ProtocolReference } from '../data/protocolRegistry';
import { useTheme } from '../context/ThemeContext';

interface SearchHit {
  type: 'chapter' | 'protocol' | 'agent' | 'section';
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  action: () => void;
}

const AGENTS = [
  { name: '@Ada', role: 'Chief Architect', dept: 'Dept 01' },
  { name: '@Grace', role: 'Lead Engineer / CTO', dept: 'Dept 01' },
  { name: '@Aurora', role: 'Principal Systems CTO', dept: 'Dept 01' },
  { name: '@Margaret', role: 'Strategic Planner', dept: 'Dept 01' },
  { name: '@Elena', role: 'Chief Research Officer', dept: 'Dept 01' },
  { name: '@Zoe', role: 'Chief Operations Officer', dept: 'Dept 01' },
  { name: '@Nova', role: 'Crucible Commander', dept: 'Dept 01' },
  { name: '@Una', role: 'UI/UX Lead', dept: 'Dept 02' },
  { name: '@Iris', role: 'Mobile Lead', dept: 'Dept 03' },
  { name: '@Mira', role: 'Backend Lead', dept: 'Dept 04' },
  { name: '@Barbara', role: 'Prisma Data Lead', dept: 'Dept 05' },
  { name: '@Ruchi', role: 'API Gateway Lead', dept: 'Dept 06' },
  { name: '@Sofia', role: 'SecOps Lead', dept: 'Dept 07' },
  { name: '@Gwynne', role: 'DevOps/SRE Lead', dept: 'Dept 08' },
  { name: '@Victoria', role: 'Design/PDF Lead', dept: 'Dept 09' },
  { name: '@Invoice', role: 'i18n/RTL FinTech Lead', dept: 'Dept 10' },
  { name: '@Rania', role: 'Vision/OCR Lead', dept: 'Dept 11' },
  { name: '@Rachel_QA', role: 'SQA/E2E Lead', dept: 'Dept 12' },
];

interface SpotlightSearchProps {
  open: boolean;
  onClose: () => void;
  onOpenProtocol: (code: string) => void;
  onOpenLibrary: (bookId?: string) => void;
}

export const SpotlightSearch: React.FC<SpotlightSearchProps> = ({
  open,
  onClose,
  onOpenProtocol,
  onOpenLibrary,
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (open) onClose();
      }
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const hits = useMemo<SearchHit[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const results: SearchHit[] = [];

    // Search protocols
    Object.values(PROTOCOL_REGISTRY).forEach((p: ProtocolReference) => {
      if (
        p.code.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q)
      ) {
        results.push({
          type: 'protocol',
          label: `#${p.numericId} ${p.code}`,
          sublabel: p.title,
          icon: <Terminal className="w-3.5 h-3.5 text-purple-500" />,
          action: () => { onOpenProtocol(p.code); onClose(); },
        });
      }
    });

    // Search chapters across all books
    AEGIS_12_LEVEL_CORPUS.libraries.forEach(lib =>
      lib.books.forEach(book =>
        book.volumes.forEach(vol =>
          vol.cantos.forEach(canto =>
            canto.chapters.forEach(ch => {
              if (
                ch.title.toLowerCase().includes(q) ||
                ch.subtitle?.toLowerCase().includes(q) ||
                ch.chapterCode.toLowerCase().includes(q)
              ) {
                results.push({
                  type: 'chapter',
                  label: `${ch.chapterCode}: ${ch.title}`,
                  sublabel: `${book.title} › ${vol.title}`,
                  icon: <BookOpen className="w-3.5 h-3.5 text-sky-500" />,
                  action: () => { onOpenLibrary(book.bookId); onClose(); },
                });
              }
              ch.subChapters.forEach(sub => {
                if (sub.title.toLowerCase().includes(q) || sub.summary.toLowerCase().includes(q)) {
                  results.push({
                    type: 'section',
                    label: sub.title,
                    sublabel: `${ch.chapterCode} › ${book.title}`,
                    icon: <BookOpen className="w-3.5 h-3.5 text-emerald-500" />,
                    action: () => { onOpenLibrary(book.bookId); onClose(); },
                  });
                }
              });
            })
          )
        )
      )
    );

    // Search agents
    AGENTS.forEach(agent => {
      if (agent.name.toLowerCase().includes(q) || agent.role.toLowerCase().includes(q)) {
        results.push({
          type: 'agent',
          label: agent.name,
          sublabel: `${agent.role} · ${agent.dept}`,
          icon: <Cpu className="w-3.5 h-3.5 text-amber-500" />,
          action: () => onClose(),
        });
      }
    });

    return results.slice(0, 12);
  }, [query, onOpenProtocol, onOpenLibrary, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative w-full max-w-xl rounded-2xl shadow-2xl border overflow-hidden transition-all ${
          isDark ? 'bg-[#0d1526] border-slate-700' : 'bg-white border-slate-200'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div
          className={`flex items-center gap-3 px-4 py-3 border-b ${
            isDark ? 'border-slate-700' : 'border-slate-200'
          }`}
        >
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search chapters, protocols, agents..."
            className={`flex-1 bg-transparent text-sm outline-none placeholder-slate-400 ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}
          />
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                isDark ? 'border-slate-600 text-slate-500' : 'border-slate-300 text-slate-400'
              }`}
            >
              ESC
            </span>
            <button onClick={onClose}>
              <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
            </button>
          </div>
        </div>

        {/* Results */}
        {hits.length > 0 ? (
          <ul className="py-2 max-h-80 overflow-y-auto">
            {hits.map((hit, i) => (
              <li key={i}>
                <button
                  onClick={hit.action}
                  className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    isDark
                      ? 'hover:bg-slate-800/80 text-slate-200'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <span
                    className={`p-1.5 rounded-lg flex-shrink-0 ${
                      isDark ? 'bg-slate-800' : 'bg-slate-100'
                    }`}
                  >
                    {hit.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs truncate">{hit.label}</div>
                    <div className="text-[11px] text-slate-400 truncate">{hit.sublabel}</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                </button>
              </li>
            ))}
          </ul>
        ) : query.trim() ? (
          <div className="py-10 text-center text-sm text-slate-400">
            No results for <span className="font-semibold">"{query}"</span>
          </div>
        ) : (
          <div className="py-6 px-4 grid grid-cols-3 gap-2">
            {[
              { label: 'Protocols', icon: <Terminal className="w-3.5 h-3.5" />, hint: 'AEG-001..042' },
              { label: 'Chapters', icon: <BookOpen className="w-3.5 h-3.5" />, hint: 'Book 1 & 2' },
              { label: 'Agents', icon: <Cpu className="w-3.5 h-3.5" />, hint: '235 nodes' },
            ].map(cat => (
              <div
                key={cat.label}
                className={`p-3 rounded-xl border text-center cursor-default ${
                  isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex justify-center mb-1 text-purple-500">{cat.icon}</div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">{cat.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{cat.hint}</div>
              </div>
            ))}
          </div>
        )}

        {/* Footer hint */}
        <div
          className={`px-4 py-2 text-[10px] text-slate-400 border-t flex items-center justify-between ${
            isDark ? 'border-slate-800' : 'border-slate-100'
          }`}
        >
          <span>Aegis Omni-Search · TURING-LAW-000</span>
          <span className="font-mono">Ctrl+K to toggle</span>
        </div>
      </div>
    </div>
  );
};

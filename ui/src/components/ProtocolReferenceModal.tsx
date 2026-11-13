import React from 'react';
import { ProtocolReference } from '../data/protocolRegistry';
import {
  X,
  ExternalLink,
  Sigma,
  ArrowUpRight,
  ArrowDownRight,
  BookOpen,
  Code2,
  FileCheck,
} from 'lucide-react';

interface ProtocolReferenceModalProps {
  protocol: ProtocolReference | null;
  onClose: () => void;
  onSelectProtocol: (code: string) => void;
  onNavigateToChapter: (slug: string) => void;
}

export const ProtocolReferenceModal: React.FC<ProtocolReferenceModalProps> = ({
  protocol,
  onClose,
  onSelectProtocol,
  onNavigateToChapter,
}) => {
  if (!protocol) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0b101d] text-slate-900 dark:text-slate-100 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#090d16]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-bold border border-purple-300 dark:border-purple-800">
              #{protocol.numericId} &bull; {protocol.code}
            </span>
            <span className="text-xs px-2 py-0.5 rounded font-semibold uppercase tracking-wider bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400">
              {protocol.category}
            </span>
            <span className="text-xs px-2 py-0.5 rounded font-mono text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
              {protocol.tier} Tier
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          <div>
            <h2 className="text-xl font-bold leading-tight text-slate-900 dark:text-white">
              {protocol.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {protocol.summary}
            </p>
          </div>

          {/* Mathematical Invariant / LaTeX */}
          {protocol.mathLatex && (
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 dark:text-purple-300">
                <Sigma className="w-4 h-4" />
                <span>Mathematical Proposition & Invariant</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-black/50 border border-purple-200 dark:border-purple-900 font-mono text-sm text-purple-900 dark:text-purple-200 overflow-x-auto">
                {protocol.mathLatex}
              </div>
            </div>
          )}

          {/* Code Anchor */}
          {protocol.codeAnchor && (
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Code2 className="w-4 h-4 text-sky-500" />
              <span>Target Source Coordinate:</span>
              <span className="text-sky-600 dark:text-sky-400 font-bold">{protocol.codeAnchor}</span>
            </div>
          )}

          {/* Bi-Directional Hierarchy Navigation (Higher & Lower Tiers) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Higher Tier Portal */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                <ArrowUpRight className="w-3.5 h-3.5 text-purple-500" />
                <span>Higher Tier Parent Context</span>
              </div>
              <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                {protocol.higherTierRef || 'Supreme Constitutional Root'}
              </div>
            </div>

            {/* Lower Tier Portals */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
                <span>Lower Tier Sub-References</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {protocol.lowerTierRefs?.map((ref) => (
                  <button
                    key={ref}
                    onClick={() => onSelectProtocol(ref)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sky-600 dark:text-sky-400 hover:border-purple-400 transition-colors"
                  >
                    {ref}
                  </button>
                )) || <span className="text-xs text-slate-400">Atomic Leaf Node</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090d16] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <FileCheck className="w-4 h-4 text-emerald-500" />
            <span>Sovereign Knowledge Portal Active</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onNavigateToChapter(protocol.targetSlug);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open in Living Book</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

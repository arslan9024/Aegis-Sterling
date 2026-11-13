// U-08: ProtocolRef with hover "Peek Definition" popover
// Shows protocol title + parent tier on hover — no modal required
import React, { useState, useRef } from 'react';
import { PROTOCOL_REGISTRY } from '../data/protocolRegistry';

interface ProtocolRefProps {
  code: string;
  onOpenProtocol: (code: string) => void;
}

export const ProtocolRef: React.FC<ProtocolRefProps> = ({ code, onOpenProtocol }) => {
  const item = PROTOCOL_REGISTRY[code];
  const numId = item ? item.numericId : null;
  const [showPeek, setShowPeek] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    timer.current = setTimeout(() => setShowPeek(true), 300);
  };
  const handleMouseLeave = () => {
    if (timer.current) clearTimeout(timer.current);
    setShowPeek(false);
  };

  return (
    <span className="relative inline-flex items-baseline" onMouseLeave={handleMouseLeave}>
      <button
        onClick={() => onOpenProtocol(code)}
        onMouseEnter={handleMouseEnter}
        className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded-md font-mono text-[11px] font-bold bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/80 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 transition-all cursor-pointer shadow-xs align-baseline"
        title={item ? `${item.title} — click to inspect` : `Protocol ${code}`}
      >
        {numId !== null && <span className="opacity-50 text-[9px]">#{numId}</span>}
        <span>{code}</span>
      </button>

      {/* Peek Popover */}
      {showPeek && item && (
        <span
          className="absolute bottom-full left-0 mb-2 z-50 w-64 p-3 rounded-xl border shadow-xl pointer-events-none
            bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-left"
        >
          <span className="flex items-center gap-1.5 mb-1">
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold">
              #{item.numericId}
            </span>
            <span className="font-mono text-[10px] font-semibold text-slate-700 dark:text-slate-300">
              {item.code}
            </span>
            <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              {item.tier}
            </span>
          </span>
          <span className="block text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight mb-1">
            {item.title}
          </span>
          <span className="block text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
            {item.summary}
          </span>
          <span className="block mt-2 text-[9px] text-purple-500 dark:text-purple-400 font-semibold">
            Click to open full Protocol Inspector →
          </span>
        </span>
      )}
    </span>
  );
};

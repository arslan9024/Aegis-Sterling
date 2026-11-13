import React from 'react';
import { PROTOCOL_REGISTRY } from '../data/protocolRegistry';

interface ProtocolRefProps {
  code: string;
  onOpenProtocol: (code: string) => void;
}

export const ProtocolRef: React.FC<ProtocolRefProps> = ({ code, onOpenProtocol }) => {
  const item = PROTOCOL_REGISTRY[code];
  const numId = item ? item.numericId : null;

  return (
    <button
      onClick={() => onOpenProtocol(code)}
      className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded-md font-mono text-[11px] font-bold bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/80 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 transition-all cursor-pointer shadow-xs align-baseline"
      title={item ? `${item.title} (Click to inspect protocol)` : `Protocol ${code}`}
    >
      {numId !== null && <span className="opacity-60 text-[9px]">#{numId}</span>}
      <span>{code}</span>
    </button>
  );
};

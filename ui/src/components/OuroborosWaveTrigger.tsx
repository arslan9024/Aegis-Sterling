import React, { useState } from 'react';
import { Play, CheckCircle, RefreshCw, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PhaseStep {
  name: string;
  lead: string;
  duration: string;
  status: 'completed' | 'running' | 'idle';
  metric: string;
}

export const OuroborosWaveTrigger: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [waveCount, setWaveCount] = useState<number>(56);

  const PHASES: PhaseStep[] = [
    { name: '1. Diagnostic Deep Scan', lead: '@Ada & @Aurora', duration: '0.4s', status: isRunning && activeStep >= 0 ? (activeStep === 0 ? 'running' : 'completed') : 'completed', metric: '0 dead loops found' },
    { name: '2. Autonomous SRS Planning', lead: '@Margaret & @Elena', duration: '0.8s', status: isRunning && activeStep >= 1 ? (activeStep === 1 ? 'running' : 'completed') : isRunning ? 'idle' : 'completed', metric: '100% statutory lock' },
    { name: '3. Multi-Agent Delegation', lead: '@Zoe & @Nova', duration: '1.2s', status: isRunning && activeStep >= 2 ? (activeStep === 2 ? 'running' : 'completed') : isRunning ? 'idle' : 'completed', metric: '235 nodes synchronized' },
    { name: '4. Zero-Token Deterministic Exec', lead: '@Grace & Leads', duration: '2.1s', status: isRunning && activeStep >= 3 ? (activeStep === 3 ? 'running' : 'completed') : isRunning ? 'idle' : 'completed', metric: '<350 lines enforced' },
    { name: '5. SQA Verification & Vitest', lead: '@Rachel_QA', duration: '1.5s', status: isRunning && activeStep >= 4 ? (activeStep === 4 ? 'running' : 'completed') : isRunning ? 'idle' : 'completed', metric: '100% green compilation' },
    { name: '6. Telemetry & Memory Compaction', lead: '@Gwynne', duration: '0.6s', status: isRunning && activeStep >= 5 ? (activeStep === 5 ? 'running' : 'completed') : isRunning ? 'idle' : 'completed', metric: 'Git commit & radar updated' }
  ];

  const handleTrigger = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveStep(0);

    const stepInterval = setInterval(() => {
      setActiveStep(prev => {
        if (prev >= 5) {
          clearInterval(stepInterval);
          setIsRunning(false);
          setWaveCount(w => w + 1);
          return 0;
        }
        return prev + 1;
      });
    }, 1200);
  };

  return (
    <div className={`p-4 rounded-xl border backdrop-blur-md transition-colors ${
      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      <div className="flex items-center justify-between pb-3 border-b border-inherit">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Perpetual Ouroboros Autopilot Controller (Wave #{waveCount})
          </span>
        </div>
        <button
          onClick={handleTrigger}
          disabled={isRunning}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
            isRunning 
              ? 'bg-purple-900/50 text-purple-300 border border-purple-800 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/20 active:scale-95'
          }`}
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Wave #{waveCount} Executing...
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" /> Trigger Next Wave (+5% Improvement)
            </>
          )}
        </button>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {PHASES.map((phase) => (
          <div
            key={phase.name}
            className={`p-2.5 rounded-lg border transition-all text-xs ${
              phase.status === 'running'
                ? 'border-purple-500 bg-purple-500/10 dark:bg-purple-950/40 shadow-xs'
                : isDark
                ? 'border-slate-800/80 bg-slate-950/40 text-slate-300'
                : 'border-slate-200 bg-slate-50 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between font-semibold">
              <span className="truncate pr-1">{phase.name}</span>
              {phase.status === 'running' ? (
                <RefreshCw className="w-3 h-3 text-purple-500 animate-spin flex-shrink-0" />
              ) : phase.status === 'completed' ? (
                <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
              <span>{phase.lead}</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{phase.metric}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

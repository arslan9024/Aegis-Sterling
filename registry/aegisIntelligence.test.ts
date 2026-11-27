import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { detectCircularDependencies, runAstAudit } from '../engines/orchestrator/aegis-ast-analyzer.ts';
import { resolveDirectorForRule } from '../engines/orchestrator/aegis-dispatch.ts';
import { promoteRecurringPatterns, recordLearningEntry } from '../knowledge/learningLoop.ts';

describe('AEGIS Intelligence: AST Dependency Graph & Closed-Loop Learning', () => {
  it('detects circular dependencies and routes CIRCULAR-DEP to @Dijkstra', () => {
    const graph = new Map<string, string[]>([
      ['/repo/a.ts', ['/repo/b.ts']],
      ['/repo/b.ts', ['/repo/a.ts']],
    ]);
    const cycles = detectCircularDependencies(graph, '/repo');
    expect(cycles).toHaveLength(1);
    expect(cycles[0].rule).toBe('CIRCULAR-DEP');
    expect(resolveDirectorForRule(cycles[0].rule)).toBe('aegis-dir-06');
  });

  it('passes ast:audit on Aegis-Sterling with zero circular dependencies', () => {
    const result = runAstAudit({ json: true });
    expect(result.filesAnalyzed).toBeGreaterThan(50);
    expect(result.circularDeps).toHaveLength(0);
    expect(result.passed).toBe(true);
  }, 90000);

  it('promotes recurring learningLoop patterns into enforced rules', () => {
    const tmpLog = path.join(os.tmpdir(), `aegis-promote-${Date.now()}.json`);
    recordLearningEntry(
      {
        id: 'p-1',
        category: 'scan-finding',
        pattern: 'AEG-042: fileA.ts',
        resolution: 'Split module',
        enforcedRuleId: 'AEG-042',
      },
      tmpLog
    );
    recordLearningEntry(
      {
        id: 'p-2',
        category: 'scan-finding',
        pattern: 'AEG-042: fileB.ts',
        resolution: 'Split module',
        enforcedRuleId: 'AEG-042',
      },
      tmpLog
    );

    const promoted = promoteRecurringPatterns(2, tmpLog);
    expect(promoted).toHaveLength(1);
    expect(promoted[0].ruleId).toBe('AEG-042');
    expect(promoted[0].occurrences).toBe(2);
    fs.rmSync(tmpLog, { force: true });
  });
});

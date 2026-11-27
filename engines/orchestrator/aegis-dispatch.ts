/**
 * aegis-dispatch.ts — 12-Director -> 108-Subagent Round-Robin Dispatch & Auto-Remediation
 */

import { runScan } from './aegis-autopilot-scanner.ts';
import { AEGIS_DIRECTORS, getSubagentsForDirector } from '../../registry/aegisTeamRoster.ts';
import { loadLearningLog, recordLearningEntry } from '../../knowledge/learningLoop.ts';

export const RULE_TO_DIRECTOR_ID: Record<string, string> = {
  // @Turing (aegis-dir-01): Architecture, Governance & Root Cleanliness
  'TURING-ROOT-007': 'aegis-dir-01',
  'AEG-042': 'aegis-dir-01',
  'TURING-LAW-000': 'aegis-dir-01',
  // @Hejlsberg (aegis-dir-02): TypeScript, Types & Compiler
  'PHOENIX-TS-STRICT': 'aegis-dir-02',
  'AEGIS-TS-MIGRATION': 'aegis-dir-02',
  'TS-ERROR': 'aegis-dir-02',
  // @Beck (aegis-dir-03): Testing & Quality
  'FLAKY-TEST': 'aegis-dir-03',
  'TEST-COVERAGE': 'aegis-dir-03',
  'VITEST-FAIL': 'aegis-dir-03',
  // @Diffie (aegis-dir-04): Security & Cryptography
  'SECURITY-CRITICAL': 'aegis-dir-04',
  'SECURITY-HIGH': 'aegis-dir-04',
  'SECURITY-MEDIUM': 'aegis-dir-04',
  'SECURITY-LOW': 'aegis-dir-04',
  'SEC-GATE': 'aegis-dir-04',
  // @Knuth (aegis-dir-05): Algorithms & Performance
  'PERF-COMPLEXITY': 'aegis-dir-05',
  'DIFF-RISK-HIGH': 'aegis-dir-05',
  // @Dijkstra (aegis-dir-06): Graph, Routing & Dependencies
  'CIRCULAR-DEP': 'aegis-dir-06',
  'ARCH-BOUNDARY': 'aegis-dir-06',
  // @Codd (aegis-dir-07): Database & Schema
  'PRISMA-SCHEMA': 'aegis-dir-07',
  'DB-MIGRATION': 'aegis-dir-07',
  // @Kay (aegis-dir-08): UI, React & Design Systems
  'WC-UI-ALERT': 'aegis-dir-08',
  'UI-A11Y': 'aegis-dir-08',
  'REACT-CONTEXT-TRIAD': 'aegis-dir-08',
  // @BernersLee (aegis-dir-09): Web, APIs & Protocols
  'API-CONTRACT': 'aegis-dir-09',
  'HTTP-TIMEOUT': 'aegis-dir-09',
  // @Gosling (aegis-dir-10): Runtime, Build & CI
  'CI-GATE-FAIL': 'aegis-dir-10',
  'BUILD-FAIL': 'aegis-dir-10',
  // @Shannon (aegis-dir-11): Knowledge, Learning & Skills
  'LEARNING-LOOP-MISS': 'aegis-dir-11',
  'SKILL-DRIFT': 'aegis-dir-11',
  // @Lamport (aegis-dir-12): Distributed Systems & Idempotency
  'CONCURRENCY-RACE': 'aegis-dir-12',
  'IDEMPOTENCY-KEY': 'aegis-dir-12',
};

export interface DispatchOptions {
  targets?: string[];
  json?: boolean;
  autoRemediate?: boolean;
}

export interface SubagentAssignment {
  subagentId: string;
  subagentName: string;
  count: number;
  rules: string[];
}

export interface DirectorDispatchSummary {
  directorId: string;
  directorName: string;
  domain: string;
  modelTier?: string;
  totalCount: number;
  subagents: SubagentAssignment[];
}

export interface DispatchResult {
  totalFindings: number;
  directorsDispatched: number;
  subagentsEngaged: number;
  autoRemediated: number;
  remediatedIds: string[];
  breakdown: DirectorDispatchSummary[];
}

export function resolveDirectorForRule(rule: string): string {
  if (RULE_TO_DIRECTOR_ID[rule]) return RULE_TO_DIRECTOR_ID[rule];
  if (rule.startsWith('TS')) return 'aegis-dir-02';
  if (rule.startsWith('SEC')) return 'aegis-dir-04';
  return 'aegis-dir-01';
}

export function runDispatch(options: DispatchOptions = {}): DispatchResult {
  const { targets, json = false, autoRemediate = false } = options;
  if (!json) {
    console.log('🎯 [AEGIS Dispatch] Mapping scan findings to 12 AEGIS Directors & 108 Subagents (round-robin)...');
  }

  const scan = runScan(targets);
  const rrCursor = new Map<string, number>();
    const dirMap = new Map<
    string,
    {
      directorId: string;
      directorName: string;
      domain: string;
      modelTier: string;
      totalCount: number;
      subMap: Map<string, { subagentId: string; subagentName: string; count: number; rules: Set<string> }>;
    }
  >();

  const remediatedIds: string[] = [];
  const existingLog = autoRemediate ? loadLearningLog() : null;
  const existingIds = new Set(existingLog?.entries.map(e => e.id) ?? []);

  for (const finding of scan.findings) {
    const dirId = resolveDirectorForRule(finding.rule);
    const director = AEGIS_DIRECTORS.find(d => d.id === dirId) ?? AEGIS_DIRECTORS[0];
    const subs = getSubagentsForDirector(director.id);
    const cursor = rrCursor.get(director.id) ?? 0;
    const sub = subs[cursor % subs.length];
    rrCursor.set(director.id, cursor + 1);

    let dirEntry = dirMap.get(director.id);
    if (!dirEntry) {
      dirEntry = {
        directorId: director.id,
        directorName: director.name,
        domain: director.domain,
        modelTier: director.modelTier ?? 'inherit',
        totalCount: 0,
        subMap: new Map(),
      };
      dirMap.set(director.id, dirEntry);
    }
    dirEntry.totalCount += 1;

    const subId = sub?.id ?? 'unassigned';
    const subName = sub?.name ?? 'Unassigned';
    const subEntry = dirEntry.subMap.get(subId);
    if (subEntry) {
      subEntry.count += 1;
      subEntry.rules.add(finding.rule);
    } else {
      dirEntry.subMap.set(subId, {
        subagentId: subId,
        subagentName: subName,
        count: 1,
        rules: new Set([finding.rule]),
      });
    }

    if (autoRemediate && (finding.rule === 'AEGIS-TS-MIGRATION' || finding.rule === 'AEG-042')) {
      const learnId = `auto-${finding.rule.toLowerCase()}-${finding.id}`;
      if (!existingIds.has(learnId)) {
        recordLearningEntry({
          id: learnId,
          category: 'scan-finding',
          pattern: `${finding.rule}: ${finding.file}`,
          resolution: `Queued for ${director.name} -> ${subName} (${finding.detail})`,
          enforcedRuleId: finding.rule,
        });
        existingIds.add(learnId);
        remediatedIds.push(finding.id);
      }
    }
  }

  const breakdown: DirectorDispatchSummary[] = [...dirMap.values()].map(d => ({
    directorId: d.directorId,
    directorName: d.directorName,
    domain: d.domain,
    modelTier: d.modelTier,
    totalCount: d.totalCount,
    subagents: [...d.subMap.values()].map(s => ({
      subagentId: s.subagentId,
      subagentName: s.subagentName,
      count: s.count,
      rules: [...s.rules],
    })),
  }));

  const subagentsEngaged = breakdown.reduce((acc, d) => acc + d.subagents.length, 0);
  const result: DispatchResult = {
    totalFindings: scan.totalFindings,
    directorsDispatched: breakdown.length,
    subagentsEngaged,
    autoRemediated: remediatedIds.length,
    remediatedIds,
    breakdown,
  };

  if (json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    for (const d of breakdown) {
      const subSummary = d.subagents.map(s => `${s.subagentName}(${s.count})`).join(', ');
      console.log(`   • ${d.directorName} [${d.domain}]: ${d.totalCount} finding(s) -> ${subSummary}`);
    }
    if (autoRemediate) {
      console.log(`   ⚡ Auto-remediated / logged ${remediatedIds.length} finding(s) into learningLoop.`);
    }
    console.log(
      `✅ Dispatched ${result.totalFindings} finding(s) across ${result.directorsDispatched} Director(s) and ${result.subagentsEngaged} Subagent(s).\n`
    );
  }

  return result;
}

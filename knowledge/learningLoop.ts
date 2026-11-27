/**
 * learningLoop.ts — AEGIS V5.1 Structured Learning Loop
 * Persists resolved scan findings, recurring bug patterns, and architectural decisions
 * in Aegis-Sterling/knowledge/aegis-learning-log.json for enforcement in future runs.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const LEARNING_LOG_PATH = path.join(__dirname, 'aegis-learning-log.json');

export type LearningCategory = 'scan-finding' | 'bug-pattern' | 'architecture-decision';

export interface LearningEntry {
  id: string;
  category: LearningCategory;
  pattern: string;
  resolution: string;
  enforcedRuleId?: string;
  recordedAt: string;
}

export interface LearningLog {
  schemaVersion: string;
  updatedAt: string;
  entries: LearningEntry[];
}

export function loadLearningLog(logPath: string = LEARNING_LOG_PATH): LearningLog {
  if (!fs.existsSync(logPath)) {
    return { schemaVersion: '1.0.0', updatedAt: new Date().toISOString(), entries: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(logPath, 'utf8')) as LearningLog;
  } catch {
    return { schemaVersion: '1.0.0', updatedAt: new Date().toISOString(), entries: [] };
  }
}

export function recordLearningEntry(
  entry: Omit<LearningEntry, 'recordedAt'>,
  logPath: string = LEARNING_LOG_PATH
): LearningLog {
  const log = loadLearningLog(logPath);
  const existingIdx = log.entries.findIndex(e => e.id === entry.id);
  const nextEntry: LearningEntry = { ...entry, recordedAt: new Date().toISOString() };
  if (existingIdx >= 0) {
    log.entries[existingIdx] = nextEntry;
  } else {
    log.entries.push(nextEntry);
  }
  log.updatedAt = new Date().toISOString();
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2) + '\n', 'utf8');
  return log;
}

export function getEnforcedPatterns(logPath: string = LEARNING_LOG_PATH): string[] {
  return loadLearningLog(logPath).entries.map(e => e.pattern);
}

export interface PromotedRule {
  ruleId: string;
  pattern: string;
  occurrences: number;
  promotedAt: string;
}

export function promoteRecurringPatterns(
  minOccurrences = 2,
  logPath: string = LEARNING_LOG_PATH
): PromotedRule[] {
  const log = loadLearningLog(logPath);
  const counts = new Map<string, { count: number; ruleId: string }>();

  for (const entry of log.entries) {
    const key = entry.enforcedRuleId ?? entry.category;
    const prev = counts.get(key);
    if (prev) {
      prev.count += 1;
    } else {
      counts.set(key, { count: 1, ruleId: key });
    }
  }

  const promoted: PromotedRule[] = [];
  for (const [pattern, info] of counts.entries()) {
    if (info.count >= minOccurrences) {
      promoted.push({
        ruleId: info.ruleId,
        pattern,
        occurrences: info.count,
        promotedAt: new Date().toISOString(),
      });
    }
  }
  return promoted;
}

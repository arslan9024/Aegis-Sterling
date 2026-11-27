import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  AEGIS_DIRECTORS,
  AEGIS_SUBAGENTS,
  getAegisTeamSummary,
  getDirectorByDomain,
  getSubagentsForDirector,
} from './aegisTeamRoster.ts';
import { getEnforcedPatterns, loadLearningLog, recordLearningEntry } from '../knowledge/learningLoop.ts';

describe('AEGIS Team 12 Directors -> 108 Subagents Roster', () => {
  it('defines exactly 12 Directors and 108 Subagents (9 per Director)', () => {
    const summary = getAegisTeamSummary();
    expect(AEGIS_DIRECTORS).toHaveLength(12);
    expect(AEGIS_SUBAGENTS).toHaveLength(108);
    expect(summary.directorsCount).toBe(12);
    expect(summary.subagentsCount).toBe(108);
    expect(summary.totalAegisTeam).toBe(120);

    for (const director of AEGIS_DIRECTORS) {
      expect(getSubagentsForDirector(director.id)).toHaveLength(9);
    }
  });

  it('has 120 unique male CS-great names with no duplicates', () => {
    const allNames = [...AEGIS_DIRECTORS.map(d => d.name), ...AEGIS_SUBAGENTS.map(s => s.name)];
    expect(new Set(allNames).size).toBe(120);
  });

  it('resolves Directors by domain', () => {
    expect(getDirectorByDomain('TypeScript')?.name).toBe('@Hejlsberg');
    expect(getDirectorByDomain('Security')?.name).toBe('@Diffie');
    expect(getDirectorByDomain('Knowledge')?.name).toBe('@Shannon');
  });

  it('persists and retrieves learning loop entries', () => {
    const tmpLog = path.join(os.tmpdir(), `aegis-learning-${Date.now()}.json`);
    recordLearningEntry(
      {
        id: 'learn-001',
        category: 'architecture-decision',
        pattern: 'AEG-042 <350-line limit',
        resolution: 'Split modules into 12-Way single-purpose files',
        enforcedRuleId: 'AEG-042',
      },
      tmpLog
    );
    const log = loadLearningLog(tmpLog);
    expect(log.entries).toHaveLength(1);
    expect(getEnforcedPatterns(tmpLog)).toContain('AEG-042 <350-line limit');
    fs.rmSync(tmpLog, { force: true });
  });
});

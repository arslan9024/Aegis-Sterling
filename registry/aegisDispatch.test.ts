import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { resolveDirectorForRule, RULE_TO_DIRECTOR_ID } from '../engines/orchestrator/aegis-dispatch.ts';
import { runSkillsAudit } from '../engines/orchestrator/aegis-skills-audit.ts';
import { AEGIS_DIRECTORS, getSubagentsForDirector } from './aegisTeamRoster.ts';
import { getEnforcedPatterns, loadLearningLog, recordLearningEntry } from '../knowledge/learningLoop.ts';

describe('AEGIS 12-Director Dispatch, Skills Audit & LearningLoop', () => {
  it('maps rules across all 12 AEGIS Directors', () => {
    const mappedDirectors = new Set(Object.values(RULE_TO_DIRECTOR_ID));
    expect(mappedDirectors.size).toBe(12);
    expect(resolveDirectorForRule('AEG-042')).toBe('aegis-dir-01');
    expect(resolveDirectorForRule('PHOENIX-TS-STRICT')).toBe('aegis-dir-02');
    expect(resolveDirectorForRule('TS2322')).toBe('aegis-dir-02');
    expect(resolveDirectorForRule('SECURITY-CRITICAL')).toBe('aegis-dir-04');
    expect(resolveDirectorForRule('WC-UI-ALERT')).toBe('aegis-dir-08');
  });

  it('provides 9 specialized subagents per Director for round-robin dispatch', () => {
    for (const director of AEGIS_DIRECTORS) {
      const subs = getSubagentsForDirector(director.id);
      expect(subs).toHaveLength(9);
    }
  });

  it('passes skills:audit with 12/12 Director coverage and plugin AEG-042 <350L compliance', () => {
    const audit = runSkillsAudit({ json: true });
    expect(audit.totalDirectors).toBe(12);
    expect(audit.directorsCovered).toBe(12);
    expect(audit.totalSkills).toBeGreaterThan(0);
    const oversizedPluginSkills = audit.skills.filter(s => s.source === 'plugin' && !s.withinAeg042Limit);
    expect(oversizedPluginSkills).toHaveLength(0);
  });

  it('persists and retrieves learningLoop entries round-trip', () => {
    const tmpLog = path.join(os.tmpdir(), `aegis-dispatch-learn-${Date.now()}.json`);
    recordLearningEntry(
      {
        id: 'dispatch-learn-001',
        category: 'scan-finding',
        pattern: 'AEGIS-TS-MIGRATION: legacy.js',
        resolution: 'Queued for @Hejlsberg -> @Hickey',
        enforcedRuleId: 'AEGIS-TS-MIGRATION',
      },
      tmpLog
    );
    const log = loadLearningLog(tmpLog);
    expect(log.entries).toHaveLength(1);
    expect(getEnforcedPatterns(tmpLog)).toContain('AEGIS-TS-MIGRATION: legacy.js');
    fs.rmSync(tmpLog, { force: true });
  });
});

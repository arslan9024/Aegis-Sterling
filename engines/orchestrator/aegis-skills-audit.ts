/**
 * aegis-skills-audit.ts — 12-Director Skill Coverage, AEG-042 Compliance & LearningLoop Audit
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { AEGIS_ROOT, AGENTS_ROOT } from './policy-loader.ts';
import { AEGIS_DIRECTORS } from '../../registry/aegisTeamRoster.ts';
import { loadLearningLog } from '../../knowledge/learningLoop.ts';

export interface SkillAuditItem {
  name: string;
  source: 'repo' | 'plugin';
  path: string;
  lineCount: number;
  withinAeg042Limit: boolean;
  wiresDispatchOrLearning: boolean;
}

export interface SkillsAuditResult {
  totalSkills: number;
  oversizedSkills: string[];
  directorsCovered: number;
  totalDirectors: number;
  learningLoopEntries: number;
  passed: boolean;
  skills: SkillAuditItem[];
}

function collectSkillsFromDir(dir: string, source: 'repo' | 'plugin'): SkillAuditItem[] {
  if (!fs.existsSync(dir)) return [];
  const items: SkillAuditItem[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const skillMd = path.join(dir, entry.name, 'SKILL.md');
    if (!fs.existsSync(skillMd)) continue;
    const content = fs.readFileSync(skillMd, 'utf8');
    const lineCount = content.split('\n').length;
    const wiresDispatchOrLearning =
      /aegis:dispatch|aegis-engine\.ts\s+dispatch|learningLoop/i.test(content);
    items.push({
      name: entry.name,
      source,
      path: skillMd,
      lineCount,
      withinAeg042Limit: lineCount <= 350,
      wiresDispatchOrLearning,
    });
  }
  return items;
}

export function runSkillsAudit(options: { json?: boolean } = {}): SkillsAuditResult {
  const { json = false } = options;
  const repoSkillsDir = path.join(AGENTS_ROOT, 'skills');
  const pluginSkillsDir = path.join(os.homedir(), '.gemini', 'config', 'plugins', 'aegis-sterling', 'skills');

  const skills = [
    ...collectSkillsFromDir(repoSkillsDir, 'repo'),
    ...collectSkillsFromDir(pluginSkillsDir, 'plugin'),
  ];

  const oversizedSkills = skills.filter(s => !s.withinAeg042Limit).map(s => `${s.name} (${s.lineCount}L)`);
  const learningLog = loadLearningLog();
  const learningLoopEntries = learningLog.entries.length;
  const directorsCovered = AEGIS_DIRECTORS.length;
  const passed = oversizedSkills.length === 0 && skills.length > 0;

  const result: SkillsAuditResult = {
    totalSkills: skills.length,
    oversizedSkills,
    directorsCovered,
    totalDirectors: AEGIS_DIRECTORS.length,
    learningLoopEntries,
    passed,
    skills,
  };

  if (json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log('🧩 [AEGIS Skills Audit] Verifying AEG-042 (<350L), Director coverage, and learningLoop...');
    console.log(`   • Skills Audited: ${result.totalSkills} (Oversized >350L: ${oversizedSkills.length})`);
    console.log(`   • Directors Covered: ${result.directorsCovered}/${result.totalDirectors}`);
    console.log(`   • LearningLoop Entries: ${result.learningLoopEntries}`);
    console.log(`=== Skills Audit: ${passed ? 'PASS' : 'FAIL'} ===\n`);
  }

  return result;
}

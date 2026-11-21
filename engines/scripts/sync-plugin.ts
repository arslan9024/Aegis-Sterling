#!/usr/bin/env node
/**
 * sync-plugin.ts — Syncs the canonical aegis-sterling plugin & hook into ~/.gemini/config/plugins/aegis-sterling/
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AEGIS_ROOT = path.resolve(__dirname, '..', '..');
const SOURCE_HOOK = path.join(AEGIS_ROOT, 'hooks', 'aegis-guard.ts');
const SOURCE_SHELL_RULE = path.join(AEGIS_ROOT, 'rules', 'shellHygiene.rule.ts');
const PLUGIN_SRC = path.join(AEGIS_ROOT, 'extensions', 'plugins', 'aegis-sterling');
const PLUGIN_DEST = path.join(os.homedir(), '.gemini', 'config', 'plugins', 'aegis-sterling');

const SKILL_COPIES = [
  'whitecaves-ejari-rules',
  'session-handover',
  'ts-typecheck-triage',
  'security-audit',
  'pr-review-checklist',
  'git-manager',
];

function sync(): void {
  const hookDest = path.join(PLUGIN_SRC, 'hooks', 'aegis-guard.ts');
  fs.mkdirSync(path.dirname(hookDest), { recursive: true });
  fs.copyFileSync(SOURCE_HOOK, hookDest);

  const ruleDest = path.join(PLUGIN_SRC, 'rules', 'shellHygiene.rule.ts');
  fs.mkdirSync(path.dirname(ruleDest), { recursive: true });
  fs.copyFileSync(SOURCE_SHELL_RULE, ruleDest);

  for (const skill of SKILL_COPIES) {
    const srcSkill = path.join(AEGIS_ROOT, '.agents', 'skills', skill, 'SKILL.md');
    const dstSkill = path.join(PLUGIN_SRC, 'skills', skill, 'SKILL.md');
    if (fs.existsSync(srcSkill)) {
      fs.mkdirSync(path.dirname(dstSkill), { recursive: true });
      fs.copyFileSync(srcSkill, dstSkill);
    }
  }

  fs.mkdirSync(PLUGIN_DEST, { recursive: true });
  fs.cpSync(PLUGIN_SRC, PLUGIN_DEST, { recursive: true, force: true });
  console.log(`✅ Synced aegis-sterling plugin -> ${PLUGIN_DEST}`);
}

sync();

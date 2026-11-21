#!/usr/bin/env node
/**
 * checkpoint.ts — Durable Checkpoints + Resume (TypeScript ESM)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { AEGIS_ROOT, createTraceContext, isFeatureEnabled, loadPolicy, type AegisPolicy } from './policy-loader.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CP_DIR = join(__dirname, 'logs', 'checkpoints');

interface CheckpointIndexEntry {
  id: number;
  label: string;
  createdAt: string;
  file: string;
}

function readIndex(): { checkpoints: CheckpointIndexEntry[] } {
  mkdirSync(CP_DIR, { recursive: true });
  const idx = join(CP_DIR, 'index.json');
  return existsSync(idx) ? (JSON.parse(readFileSync(idx, 'utf8')) as { checkpoints: CheckpointIndexEntry[] }) : { checkpoints: [] };
}

function getGit(cmd: string): string | null {
  try {
    return execSync(cmd, { cwd: AEGIS_ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch {
    return null;
  }
}

export function saveCheckpoint(label: string, policy: AegisPolicy) {
  const index = readIndex();
  const safeLabel = label.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase().slice(0, 64);
  const cpFile = join(CP_DIR, `${safeLabel}-${index.checkpoints.length}.json`);
  const cp = {
    id: index.checkpoints.length,
    label: safeLabel,
    createdAt: new Date().toISOString(),
    gitHeadSha: getGit('git rev-parse HEAD'),
    gitBranch: getGit('git rev-parse --abbrev-ref HEAD'),
    policyVersion: policy.version,
  };
  writeFileSync(cpFile, JSON.stringify(cp, null, 2), 'utf8');
  index.checkpoints.push({ id: cp.id, label: safeLabel, createdAt: cp.createdAt, file: cpFile });
  writeFileSync(join(CP_DIR, 'index.json'), JSON.stringify(index, null, 2), 'utf8');
  console.log(`Checkpoint saved: [${cp.id}] ${safeLabel}`);
  return cp;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const policy = loadPolicy();
  createTraceContext(policy, { component: 'checkpoint' });
  if (!policy.checkpoints?.enabled || !isFeatureEnabled(policy, 'checkpoints')) {
    console.warn('Checkpoints disabled.');
  } else if (args.includes('--save')) {
    saveCheckpoint(args[args.indexOf('--save') + 1] ?? 'snapshot', policy);
  } else if (args.includes('--list')) {
    const index = readIndex();
    console.log(`=== Checkpoints (${index.checkpoints.length}) ===`);
    index.checkpoints.forEach(c => console.log(`  [${c.id}] ${c.label} — ${c.createdAt}`));
  } else {
    const index = readIndex();
    console.log(`=== Aegis Checkpoint Status ===\nTotal checkpoints: ${index.checkpoints.length}`);
  }
}

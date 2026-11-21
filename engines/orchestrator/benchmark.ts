#!/usr/bin/env node
/**
 * benchmark.ts — AEGIS Task Outcome & Regression Benchmark Loop (TypeScript ESM)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { isFeatureEnabled, loadPolicy } from './policy-loader.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BENCH_DIR = join(__dirname, 'logs', 'benchmarks');
const HISTORY_FILE = join(BENCH_DIR, 'task-history.jsonl');

interface TaskRecord {
  taskId: string;
  outcome: 'pass' | 'fail' | 'rework' | 'rollback';
  cycleTimeSec: number | null;
  recordedAt: string;
}

function readHistory(): TaskRecord[] {
  if (!existsSync(HISTORY_FILE)) return [];
  return readFileSync(HISTORY_FILE, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(l => JSON.parse(l) as TaskRecord);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const policy = loadPolicy();
  mkdirSync(BENCH_DIR, { recursive: true });

  if (!policy.benchmark?.enabled || !isFeatureEnabled(policy, 'benchmark')) {
    console.warn('Benchmark suite disabled.');
  } else if (args.includes('--record')) {
    const taskId = args.includes('--task') ? args[args.indexOf('--task') + 1] : `task-${Date.now()}`;
    const outcome = (args.includes('--outcome') ? args[args.indexOf('--outcome') + 1] : 'pass') as TaskRecord['outcome'];
    const cycleTimeSec = args.includes('--cycleTimeSec') ? parseInt(args[args.indexOf('--cycleTimeSec') + 1], 10) : null;
    writeFileSync(HISTORY_FILE, JSON.stringify({ taskId, outcome, cycleTimeSec, recordedAt: new Date().toISOString() }) + '\n', { flag: 'a', encoding: 'utf8' });
    console.log(`Benchmark recorded: [${outcome}] ${taskId}`);
  } else {
    const history = readHistory();
    const passed = history.filter(e => e.outcome === 'pass').length;
    console.log(`=== Aegis Benchmark Status ===\nRecorded tasks: ${history.length} | Pass count: ${passed}`);
  }
}

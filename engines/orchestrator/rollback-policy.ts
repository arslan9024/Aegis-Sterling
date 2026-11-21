#!/usr/bin/env node
/**
 * rollback-policy.ts — Structured Rollback Plan Tracker (TypeScript ESM)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { AEGIS_ROOT, createTraceContext, isFeatureEnabled, loadPolicy, type AegisPolicy } from './policy-loader.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROLLBACK_DIR = join(__dirname, 'logs', 'rollback-plans');

function getPlanFile(taskId: string): string {
  mkdirSync(ROLLBACK_DIR, { recursive: true });
  return join(ROLLBACK_DIR, `rollback-${taskId.replace(/[^a-zA-Z0-9_-]/g, '-')}.json`);
}

function getDiffFiles(): string[] {
  try {
    return execSync('git diff --name-only HEAD', { cwd: AEGIS_ROOT, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

export function createRollbackPlan(taskId: string, policy: AegisPolicy) {
  const touched = getDiffFiles();
  const plan = {
    trace: createTraceContext(policy, { component: 'rollback-policy', taskId }),
    taskId,
    createdAt: new Date().toISOString(),
    filesTouched: touched,
    fallbackOwner: policy.rollback?.fallbackOwner ?? '@Grace',
    retryCount: 0,
    maxRetries: policy.rollback?.maxRetriesBeforeRollback ?? 2,
    status: 'active',
  };
  writeFileSync(getPlanFile(taskId), JSON.stringify(plan, null, 2), 'utf8');
  console.log(`Rollback plan created for ${taskId}`);
  return plan;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const policy = loadPolicy();
  if (!policy.rollback?.enabled || !isFeatureEnabled(policy, 'rollback')) {
    console.warn('Rollback disabled.');
  } else if (args.includes('--create')) {
    createRollbackPlan(args[args.indexOf('--create') + 1] ?? 'task', policy);
  } else if (args.includes('--increment')) {
    const file = getPlanFile(args[args.indexOf('--increment') + 1] ?? 'task');
    if (existsSync(file)) {
      const plan = JSON.parse(readFileSync(file, 'utf8')) as { retryCount: number; maxRetries: number };
      plan.retryCount = (plan.retryCount ?? 0) + 1;
      writeFileSync(file, JSON.stringify(plan, null, 2), 'utf8');
      console.log(`Retries: ${plan.retryCount}/${plan.maxRetries}`);
    }
  } else {
    mkdirSync(ROLLBACK_DIR, { recursive: true });
    const files = readdirSync(ROLLBACK_DIR).filter(f => f.endsWith('.json'));
    console.log(`=== Aegis Rollback Plans (${files.length}) ===`);
  }
}

#!/usr/bin/env node
/**
 * budget-guard.ts — Session Token, Runtime & Retry Budget Guard (TypeScript ESM)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { createTraceContext, isFeatureEnabled, loadPolicy, type AegisPolicy } from './policy-loader.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BUDGET_DIR = join(__dirname, 'logs', 'budget');

interface SessionBudget {
  trace: ReturnType<typeof createTraceContext> | null;
  sessionStartedAt: string;
  estimatedTokensUsed: number;
  retriesUsed: number;
  runtimeStartMs: number;
  hardCapHit: boolean;
  hardCapReason?: string;
  hardCapAt?: string;
  lastRecordedAt?: string;
}

function getBudgetFile(): string {
  mkdirSync(BUDGET_DIR, { recursive: true });
  return join(BUDGET_DIR, 'session-budget.json');
}

function readBudget(): SessionBudget {
  const file = getBudgetFile();
  if (!existsSync(file)) {
    return { trace: null, sessionStartedAt: new Date().toISOString(), estimatedTokensUsed: 0, retriesUsed: 0, runtimeStartMs: Date.now(), hardCapHit: false };
  }
  return JSON.parse(readFileSync(file, 'utf8')) as SessionBudget;
}

export function checkBudget(policy: AegisPolicy): boolean {
  const limits = policy.observability?.budgetLimits ?? {};
  if (!limits.enabled) return true;

  const budget = readBudget();
  const runtimeSec = Math.floor((Date.now() - (budget.runtimeStartMs ?? Date.now())) / 1000);
  const maxTokens = limits.maxEstimatedTokensPerSession ?? 500000;
  const maxRuntime = limits.maxRuntimeSeconds ?? 3600;
  const maxRetries = limits.maxRetriesPerSession ?? 10;

  const violations: string[] = [];
  if (budget.estimatedTokensUsed >= maxTokens) violations.push(`Tokens: ${budget.estimatedTokensUsed}/${maxTokens}`);
  if (runtimeSec >= maxRuntime) violations.push(`Runtime: ${runtimeSec}s/${maxRuntime}s`);
  if (budget.retriesUsed >= maxRetries) violations.push(`Retries: ${budget.retriesUsed}/${maxRetries}`);

  if (violations.length > 0) {
    budget.hardCapHit = true;
    budget.hardCapReason = violations.join('; ');
    budget.hardCapAt = new Date().toISOString();
    writeFileSync(getBudgetFile(), JSON.stringify(budget, null, 2), 'utf8');
    console.error('✗ Budget limit reached:', violations.join(', '));
    if (limits.hardCap) process.exitCode = 1;
    return false;
  }
  console.log(`✓ Budget check passed (Tokens: ${budget.estimatedTokensUsed}/${maxTokens}, Runtime: ${runtimeSec}s/${maxRuntime}s)`);
  return true;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const policy = loadPolicy();
  if (!isFeatureEnabled(policy, 'budget')) {
    console.warn('Budget guard disabled.');
  } else if (args.includes('--check')) {
    checkBudget(policy);
  } else if (args.includes('--record')) {
    const budget = readBudget();
    budget.estimatedTokensUsed += parseInt(args.includes('--tokens') ? args[args.indexOf('--tokens') + 1] : '0', 10) || 0;
    budget.retriesUsed += parseInt(args.includes('--retries') ? args[args.indexOf('--retries') + 1] : '0', 10) || 0;
    budget.lastRecordedAt = new Date().toISOString();
    writeFileSync(getBudgetFile(), JSON.stringify(budget, null, 2), 'utf8');
    console.log(`Budget recorded: tokens=${budget.estimatedTokensUsed}, retries=${budget.retriesUsed}`);
  } else if (args.includes('--reset')) {
    const budget: SessionBudget = { trace: createTraceContext(policy, { component: 'budget-guard' }), sessionStartedAt: new Date().toISOString(), estimatedTokensUsed: 0, retriesUsed: 0, runtimeStartMs: Date.now(), hardCapHit: false };
    writeFileSync(getBudgetFile(), JSON.stringify(budget, null, 2), 'utf8');
    console.log('Session budget reset.');
  } else {
    const budget = readBudget();
    console.log(`=== Aegis Budget Status ===\nTokens: ${budget.estimatedTokensUsed}\nRetries: ${budget.retriesUsed}`);
  }
}

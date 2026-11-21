#!/usr/bin/env node
/**
 * confidence-router.ts — Confidence & Diff-Risk Task Router (TypeScript ESM)
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { createTraceContext, isFeatureEnabled, loadPolicy, type AegisPolicy } from './policy-loader.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const LOGS_DIR = join(__dirname, 'logs');
const ROUTING_DIR = join(LOGS_DIR, 'confidence');

function safeRead<T>(file: string): T | null {
  try {
    return JSON.parse(readFileSync(file, 'utf8')) as T;
  } catch {
    return null;
  }
}

export function evaluateTask(taskId: string, policy: AegisPolicy) {
  mkdirSync(ROUTING_DIR, { recursive: true });
  const cfg = policy.confidenceRouting ?? {};
  const highRiskDomains = cfg.highRiskDomains ?? ['security', 'auth', 'payment', 'database-migration'];
  const gatesReport = safeRead<{ overallPassed?: boolean }>(join(LOGS_DIR, 'verification-gates-report.json'));

  let riskScore = 0;
  let confidenceScore = 1.0;
  if (highRiskDomains.some(d => taskId.toLowerCase().includes(d))) riskScore += 30;
  if (gatesReport && !gatesReport.overallPassed) {
    riskScore += 25;
    confidenceScore -= 0.25;
  }

  const decision = riskScore <= (cfg.riskScoreLowMax ?? 30) && confidenceScore >= (cfg.autoApproveMinConfidence ?? 0.8)
    ? 'autopilot'
    : 'human-approval';

  const result = {
    taskId,
    trace: createTraceContext(policy, { component: 'confidence-router', taskId }),
    riskScore,
    confidenceScore,
    decision,
    evaluatedAt: new Date().toISOString(),
  };
  writeFileSync(join(ROUTING_DIR, `routing-${taskId.replace(/[^a-zA-Z0-9_-]/g, '-')}.json`), JSON.stringify(result, null, 2), 'utf8');
  return result;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const policy = loadPolicy();
  if (!policy.confidenceRouting?.enabled || !isFeatureEnabled(policy, 'routing')) {
    console.warn('Confidence routing disabled.');
  } else if (args.includes('--evaluate')) {
    console.log(JSON.stringify(evaluateTask(args[args.indexOf('--evaluate') + 1] ?? 'task', policy), null, 2));
  } else {
    console.log(`=== Confidence Router ===\nAuto-approve >= ${policy.confidenceRouting?.autoApproveMinConfidence ?? 0.8}, Low risk <= ${policy.confidenceRouting?.riskScoreLowMax ?? 30}`);
  }
}

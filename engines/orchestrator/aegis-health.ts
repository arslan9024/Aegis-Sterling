#!/usr/bin/env node
/**
 * aegis-health.ts — Unified AEGIS Health Snapshot Summary
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createTraceContext, loadPolicy, runPolicyDiffGate } from './policy-loader.ts';
import { runGovernanceAudit } from './governance-audit.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const LOGS_DIR = join(__dirname, 'logs');

function safeReadJSON<T = Record<string, unknown>>(filePath: string): T | null {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8')) as T;
  } catch {
    return null;
  }
}

const policy = loadPolicy();
const trace = createTraceContext(policy);
const diffGate = runPolicyDiffGate(policy);
const gates = safeReadJSON<{ overallPassed?: boolean; hardFails?: string[] }>(join(LOGS_DIR, 'verification-gates-report.json'));
const budget = safeReadJSON<{ hardCapHit?: boolean; retriesUsed?: number }>(join(LOGS_DIR, 'budget', 'session-budget.json'));
const workflowState = safeReadJSON<{ currentStep?: string }>(join(LOGS_DIR, 'workflow-state', 'current-state.json'));
const governanceAudit = runGovernanceAudit();

const summary = {
  generatedAt: new Date().toISOString(),
  trace,
  policy: {
    version: policy.version,
    schemaVersion: policy.schemaVersion,
    rolloutEnv: policy.rollout?.environment ?? 'development',
  },
  gates: {
    policyDiffPassed: diffGate.passed,
    policyDiffCriticalChanges: diffGate.criticalDiffs.length,
    verificationPassed: gates?.overallPassed ?? null,
    verificationHardFails: gates?.hardFails ?? [],
    governanceAuditPassed: governanceAudit.errors.length === 0,
    governanceAuditWarnings: governanceAudit.warnings.length,
  },
  runtime: {
    workflowStep: workflowState?.currentStep ?? null,
    budgetHardCapHit: budget?.hardCapHit ?? false,
    budgetRetriesUsed: budget?.retriesUsed ?? 0,
  },
  files: {
    policyBaselineExists: existsSync(join(LOGS_DIR, 'policy-baseline.json')),
    traceDirExists: existsSync(join(LOGS_DIR, 'traces')),
  },
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(summary, null, 2));
} else {
  console.log('\n=== Aegis Health Summary ===');
  console.log(`Policy: ${summary.policy.version} (schema ${summary.policy.schemaVersion})`);
  console.log(`Policy diff gate: ${summary.gates.policyDiffPassed ? 'PASS' : 'WARN'} (critical diffs: ${summary.gates.policyDiffCriticalChanges})`);
  console.log(`Verification gates: ${summary.gates.verificationPassed === null ? 'N/A' : summary.gates.verificationPassed ? 'PASS' : 'FAIL'}`);
  console.log(`Governance audit: ${summary.gates.governanceAuditPassed ? 'PASS' : 'FAIL'}`);
}

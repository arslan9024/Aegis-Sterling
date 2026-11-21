#!/usr/bin/env node
/**
 * policy-gate.ts — Validates Policy Schema & Critical Diffs (TypeScript ESM)
 */

import { loadPolicy, runPolicyDiffGate, validatePolicy } from './policy-loader.ts';

const policy = loadPolicy();
const issues = validatePolicy(policy);
const diff = runPolicyDiffGate(policy);

if (issues.length > 0) {
  console.error('Policy schema validation failed:');
  issues.forEach(issue => console.error(`  - ${issue}`));
  process.exit(1);
}

if (!diff.passed) {
  console.error('Policy diff gate failed: critical policy changes require acknowledgement.');
  console.error(`Ack file: ${diff.ackPath}`);
  process.exit(2);
}

console.log(`Policy gate passed (version=${policy.version}, mode=${diff.mode}, changedKeys=${diff.changed.length})`);

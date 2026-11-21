#!/usr/bin/env node
/**
 * context-manager.ts — Context Budget & Handoff Status Utility (TypeScript ESM)
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getContextBudget, loadPolicy } from './policy-loader.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const LOGS_DIR = join(__dirname, 'logs');

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const policy = loadPolicy();
  const args = process.argv.slice(2);
  const freeBudget = getContextBudget(policy, 'free');
  const premiumBudget = getContextBudget(policy, 'premium');
  const scanPath = join(LOGS_DIR, 'aegis-scan-report.json');
  const scanExists = existsSync(scanPath);

  if (args.includes('--json') || args.includes('--manifest') || args.includes('--handoff')) {
    console.log(JSON.stringify({
      policyVersion: policy.version,
      budgetsKB: { free: freeBudget.limitKB, premium: premiumBudget.limitKB },
      scanReportAvailable: scanExists,
      lastScanAt: scanExists ? (JSON.parse(readFileSync(scanPath, 'utf8')) as { generatedAt?: string }).generatedAt : null,
    }, null, 2));
  } else {
    console.log(`=== Aegis Context Manager ===\nBudgets: free=${freeBudget.limitKB}KB, premium=${premiumBudget.limitKB}KB | Scan report=${scanExists}`);
  }
}

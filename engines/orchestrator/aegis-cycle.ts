#!/usr/bin/env node
/**
 * aegis-cycle.ts — AEGIS Unified Audit Cycle Runner (No auto-push to main per mergePolicy)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AGENTS_ROOT, loadPolicy } from './policy-loader.ts';
import { runScan } from './aegis-autopilot-scanner.ts';
import { runAllGates } from './verification-gates.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RUN_LOG = path.join(AGENTS_ROOT, 'plans', 'AEGIS_RUN_LOG.md');

async function main() {
  const args = process.argv.slice(2);
  const cycleIdx = args.indexOf('--cycle');
  const cycleLabel = cycleIdx !== -1 && args[cycleIdx + 1] ? args[cycleIdx + 1] : 'manual';

  console.log(`\n🛡️  AEGIS CYCLE [${cycleLabel}] — Real Scan + Verification Gates\n`);

  const scan = runScan();
  const policy = loadPolicy();
  const gates = runAllGates(policy);

  fs.mkdirSync(path.dirname(RUN_LOG), { recursive: true });
  const entry = [
    `\n## Cycle ${cycleLabel} — ${new Date().toISOString()}`,
    `- **Files Scanned**: ${scan.totalFilesScanned}`,
    `- **Concrete Findings**: ${scan.totalFindings}`,
    `- **Gates Passed**: ${gates.overallPassed ? 'YES' : 'NO'}`,
    '---\n',
  ].join('\n');
  fs.appendFileSync(RUN_LOG, entry, 'utf8');

  console.log(`\n✅ Cycle complete. Git push disabled by mergePolicy (use PRs/feature branches).`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(err => {
    console.error('❌ AEGIS Cycle Failed:', err);
    process.exitCode = 1;
  });
}

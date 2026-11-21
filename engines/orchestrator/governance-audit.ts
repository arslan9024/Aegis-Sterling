#!/usr/bin/env node
/**
 * governance-audit.ts — Canonical AEGIS Governance Artifact & Policy Auditor
 */

import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AEGIS_ROOT, AGENTS_ROOT, loadPolicy, validatePolicy } from './policy-loader.ts';
import { AEGIS_42_PROTOCOLS } from '../../.agents/aegis/protocols/aegisMasterProtocols.ts';

export interface GovernanceAuditResult {
  errors: string[];
  warnings: string[];
  info: string[];
}

export function runGovernanceAudit(): GovernanceAuditResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const info: string[] = [];
  const policy = loadPolicy();

  for (const issue of validatePolicy(policy)) {
    errors.push(`policy: ${issue}`);
  }

  const requiredFiles: Array<[string, string]> = [
    ['.agents/AGENTS.md', join(AGENTS_ROOT, 'AGENTS.md')],
    ['.agents/orchestrator/policy.json', join(AGENTS_ROOT, 'orchestrator', 'policy.json')],
    ['extensions/plugins/aegis-sterling/plugin.json', join(AEGIS_ROOT, 'extensions', 'plugins', 'aegis-sterling', 'plugin.json')],
    ['extensions/plugins/aegis-sterling/hooks.json', join(AEGIS_ROOT, 'extensions', 'plugins', 'aegis-sterling', 'hooks.json')],
  ];

  for (const [label, fullPath] of requiredFiles) {
    if (!existsSync(fullPath)) errors.push(`missing canonical file: ${label}`);
  }

  const protocolCount = Object.keys(AEGIS_42_PROTOCOLS).length;
  if (protocolCount < 42) {
    errors.push(`expected 42 protocol rules in aegisMasterProtocols.ts, found ${protocolCount}`);
  } else {
    info.push(`${protocolCount}/42 protocol rules verified`);
  }

  return { errors, warnings, info };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const strict = process.argv.includes('--strict');
  const jsonOut = process.argv.includes('--json');
  const result = runGovernanceAudit();
  if (jsonOut) {
    console.log(JSON.stringify(result, null, 2));
  } else if (result.errors.length > 0) {
    console.error('❌ Governance audit failed:', result.errors.join('; '));
  } else {
    console.log('✅ Governance audit passed.');
  }
  if (result.errors.length || (strict && result.warnings.length)) process.exitCode = 1;
}

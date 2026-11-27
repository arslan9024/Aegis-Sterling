#!/usr/bin/env node
/**
 * verification-gates.ts — Cross-Platform AEGIS Security, Diff-Risk & Flaky-Test Gates (TypeScript ESM)
 * Replaces POSIX `find` with recursive Node fs walking so Windows scans work natively.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve } from 'node:path';
import { AEGIS_ROOT, createTraceContext, isFeatureEnabled, loadPolicy, type AegisPolicy } from './policy-loader.ts';
import { recordLearningEntry } from '../../knowledge/learningLoop.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const LOGS_DIR = join(__dirname, 'logs');
const REPORT_FILE = join(LOGS_DIR, 'verification-gates-report.json');
const IGNORE_DIRS = new Set(['node_modules', 'dist', '.next', '.git', 'coverage', '.agents']);

interface SecurityRule {
  pattern: RegExp;
  label: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  skipTestFiles?: boolean;
}

export interface SecurityFinding {
  file: string;
  line: number;
  label: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  domain: string;
  excerpt: string;
  enforcementTier?: 'block' | 'warn';
  waived?: boolean;
  waiver?: { reason: string; expiresAt?: string } | null;
}

const SECURITY_PATTERNS: SecurityRule[] = [
  { pattern: /\beval\s*\(/, label: 'eval() usage', severity: 'high' },
  { pattern: /new\s+Function\s*\(/, label: 'new Function() usage', severity: 'high' },
  { pattern: /process\.env\.[A-Z_]+\s*=/, label: 'env var mutation', severity: 'medium', skipTestFiles: true },
  {
    pattern: /(?:password|secret|token|apiKey|api_key|auth_token)\s*[:=]\s*["'][a-zA-Z0-9_\-./+]{12,}["']/,
    label: 'potential hardcoded secret',
    severity: 'critical',
    skipTestFiles: true,
  },
  { pattern: /\.innerHTML\s*=/, label: 'direct innerHTML assignment (XSS risk)', severity: 'medium' },
  { pattern: /dangerouslySetInnerHTML/, label: 'dangerouslySetInnerHTML usage', severity: 'low' },
];

const SCAN_DIRS = ['src', 'server', 'app', 'engines'];
const HIGH_RISK_PATHS = [
  'server/routes/auth',
  'server/database',
  'server/middleware',
  'src/utils/superUserAccess',
  'src/App.tsx',
  'prisma/',
  'policy.json',
];

function resolveTargetRoot(argv: string[]): string {
  const idx = argv.indexOf('--target');
  if (idx !== -1 && argv[idx + 1]) return resolve(argv[idx + 1]);
  const cwd = process.cwd();
  if (SCAN_DIRS.some(d => existsSync(join(cwd, d)))) return cwd;
  const siblingFrontend = resolve(AEGIS_ROOT, '..', 'White-Caves-Frontend');
  return existsSync(siblingFrontend) ? siblingFrontend : AEGIS_ROOT;
}

function walkFilesCrossPlatform(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFilesCrossPlatform(full, out);
    } else if (/\.(tsx?|jsx?)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
      out.push(full);
    }
  }
  return out;
}

function classifyDomain(file: string, label: string): string {
  const text = `${file} ${label}`.toLowerCase();
  if (text.includes('auth')) return 'auth';
  if (text.includes('payment') || text.includes('stripe')) return 'payment';
  if (text.includes('prisma') || text.includes('database') || text.includes('mongo')) return 'database';
  if (text.includes('xss') || text.includes('secret') || text.includes('token') || text.includes('security')) return 'security';
  return 'general';
}

export function runSecurityScan(policy: AegisPolicy, targetRoot: string = resolveTargetRoot([])) {
  const findings: SecurityFinding[] = [];
  let scannedFiles = 0;

  for (const dir of SCAN_DIRS) {
    const fullDir = join(targetRoot, dir);
    if (!existsSync(fullDir)) continue;
    const files = walkFilesCrossPlatform(fullDir);
    scannedFiles += files.length;

    for (const file of files) {
      let content = '';
      try {
        content = readFileSync(file, 'utf8');
      } catch {
        continue;
      }
      const lines = content.split('\n');
      const isTestFile = /\.test\.[jt]sx?$|\.spec\.[jt]sx?$|__tests__/.test(file);
      const relPath = relative(targetRoot, file).replace(/\\/g, '/');

      lines.forEach((line, i) => {
        for (const rule of SECURITY_PATTERNS) {
          if (rule.skipTestFiles && isTestFile) continue;
          if (rule.pattern.test(line)) {
            findings.push({
              file: relPath,
              line: i + 1,
              label: rule.label,
              severity: rule.severity,
              domain: classifyDomain(relPath, rule.label),
              excerpt: line.trim().slice(0, 120),
            });
          }
        }
      });
    }
  }

  const now = Date.now();
  const enriched = findings.map(finding => {
    const exception = (policy.verification?.exceptions ?? []).find(ex => {
      if (!ex?.expiresAt || Date.parse(ex.expiresAt) < now) return false;
      if (ex.domain && ex.domain !== finding.domain) return false;
      if (ex.label && ex.label !== finding.label) return false;
      if (ex.fileContains && !finding.file.includes(ex.fileContains)) return false;
      return true;
    }) ?? null;

    const domainTier = policy.verification?.tiers?.[finding.domain] ?? policy.verification?.tiers?.general ?? { blockSeverities: ['critical'] };
    const isBlockedByTier = (domainTier.blockSeverities ?? ['critical']).includes(finding.severity);
    return {
      ...finding,
      enforcementTier: (isBlockedByTier ? 'block' : 'warn') as 'block' | 'warn',
      waived: Boolean(exception),
      waiver: exception ? { reason: exception.reason ?? 'temporary waiver', expiresAt: exception.expiresAt } : null,
    };
  });

  const blocked = enriched.filter(f => f.enforcementTier === 'block' && !f.waived);
  const critical = enriched.filter(f => f.severity === 'critical');
  const high = enriched.filter(f => f.severity === 'high');

  return {
    gate: 'security',
    targetRoot,
    scannedFiles,
    passed: blocked.length === 0,
    hardFail: blocked.length > 0 && (policy.hardStops?.stopOnSecurityScanFailure ?? true),
    summary: `${scannedFiles} files scanned -> ${enriched.length} findings (${critical.length} critical, ${high.length} high, ${blocked.length} blocking)`,
    findings: enriched,
  };
}

export function runDiffRiskScore(policy: AegisPolicy, targetRoot: string = resolveTargetRoot([])) {
  const threshold = policy.hardStops?.diffRiskScoreThreshold ?? 80;
  let diffOutput = '';
  try {
    diffOutput = execSync(`git -C "${targetRoot}" diff --stat HEAD`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  } catch {
    diffOutput = '';
  }

  const changedFiles = diffOutput
    .split('\n')
    .filter(l => l.includes('|'))
    .map(l => l.trim().split(/\s+/)[0]);

  const linesChanged = diffOutput.match(/(\d+) insertions?/)?.[1] ?? '0';
  const linesDel = diffOutput.match(/(\d+) deletions?/)?.[1] ?? '0';
  const totalLines = parseInt(linesChanged, 10) + parseInt(linesDel, 10);

  const scale = policy.verification?.diffRiskWeights?.linesChangedScale ?? 500;
  const highRiskWeight = policy.verification?.diffRiskWeights?.highRiskPathWeight ?? 10;

  const isSafeFile = (f: string) =>
    /\.(test|spec)\.[jt]sx?$|__tests__|__mocks__/.test(f) ||
    (/\.(md|json)$/.test(f) && !f.endsWith('policy.json') && !f.endsWith('package.json'));

  const safeFiles = changedFiles.filter(isSafeFile);
  const highRiskHits = changedFiles.filter(f => HIGH_RISK_PATHS.some(p => f.includes(p)));
  const nonSafeRatio = changedFiles.length > 0
    ? Math.max(0.25, (changedFiles.length - safeFiles.length) / changedFiles.length)
    : 1;

  let riskScore = Math.min(100, Math.round(((totalLines * nonSafeRatio) / scale) * 50));
  riskScore = Math.min(100, riskScore + highRiskHits.length * highRiskWeight);

  const minGroupRisk = policy.workflowGraph?.stepPatterns?.['group-review']?.minRiskScore ?? 70;
  return {
    gate: 'diff-risk',
    passed: riskScore < threshold,
    hardFail: riskScore >= threshold && (policy.hardStops?.stopOnHighDiffRisk ?? true),
    riskScore,
    threshold,
    totalLinesChanged: totalLines,
    changedFiles: changedFiles.length,
    safeFilesCount: safeFiles.length,
    highRiskFilesHit: highRiskHits,
    requiresGroupReview: riskScore >= minGroupRisk,
    summary: `Diff-risk score: ${riskScore}/${threshold} (${totalLines} lines, ${highRiskHits.length} high-risk paths, ${safeFiles.length} safe test/doc files)`,
  };
}

export function runFlakyTestDetection(policy: AegisPolicy) {
  const flakyConfig = policy.hardStops?.flakyTestDetection ?? {};
  const warnThreshold = flakyConfig.warnThreshold ?? 2;
  const testLogPath = join(LOGS_DIR, 'test-run-history.json');
  let history: Array<{ failures?: string[] }> = [];
  if (existsSync(testLogPath)) {
    try {
      history = JSON.parse(readFileSync(testLogPath, 'utf8')) as Array<{ failures?: string[] }>;
    } catch {
      history = [];
    }
  }

  const failCounts: Record<string, number> = {};
  history.forEach(run => {
    (run.failures ?? []).forEach(f => {
      failCounts[f] = (failCounts[f] ?? 0) + 1;
    });
  });

  const flakyTests = Object.entries(failCounts)
    .filter(([, count]) => count >= warnThreshold)
    .map(([test, count]) => ({ test, failCount: count }));

  return {
    gate: 'flaky-tests',
    passed: flakyTests.length === 0,
    hardFail: Boolean(flakyConfig.failOnFlaky) && flakyTests.length > 0,
    flakyTests,
    summary: flakyTests.length === 0 ? 'No flaky tests detected' : `${flakyTests.length} potentially flaky test(s)`,
  };
}

export function runAllGates(policy: AegisPolicy, targetRoot: string = resolveTargetRoot([])) {
  mkdirSync(LOGS_DIR, { recursive: true });
  const gates = [runSecurityScan(policy, targetRoot), runDiffRiskScore(policy, targetRoot), runFlakyTestDetection(policy)];
  const hardFails = gates.filter(g => g.hardFail).map(g => g.gate);

  const results = {
    trace: createTraceContext(policy, { component: 'verification-gates' }),
    version: policy.version,
    schemaVersion: policy.schemaVersion,
    targetRoot,
    runAt: new Date().toISOString(),
    gates,
    overallPassed: hardFails.length === 0,
    hardFails,
  };

  writeFileSync(REPORT_FILE, JSON.stringify(results, null, 2), 'utf8');

  console.log('\n=== Aegis Verification Gates ===');
  gates.forEach(g => {
    const icon = g.hardFail ? '✗ HARD FAIL' : g.passed ? '✓ PASS' : '⚠ WARN';
    console.log(`  [${icon}] ${g.gate}: ${g.summary}`);
  });

  if (!results.overallPassed) {
    console.log(`\n✗ Hard fails: ${hardFails.join(', ')} (Report: ${REPORT_FILE})`);
    process.exitCode = 1;
  } else {
    console.log('\n✓ All verification gates passed');
  }

  return results;
}

export const KNOWN_ERRORS = [
  { code: 'TS2305', pattern: /TS2305.*Module .* has no exported member/, label: 'Missing Prisma export', autoFix: 'npx prisma generate', retryAfter: true },
  { code: 'TS2322-fetchPriority', pattern: /TS2322.*fetchPriority/, label: 'Unsupported fetchPriority prop', autoFix: 'manual:remove-fetchPriority-attribute', retryAfter: true },
  { code: 'TS1149', pattern: /TS1149|File name .* differs? from already included/i, label: 'Import path casing mismatch', autoFix: 'manual:normalize-import-casing', retryAfter: true },
  { code: 'TS2307', pattern: /TS2307.*Cannot find module/, label: 'Missing module', autoFix: 'npm install --ignore-scripts', retryAfter: true },
];

export function tryAutoFix(errorLine: string, { dryRun = false }: { dryRun?: boolean } = {}) {
  for (const entry of KNOWN_ERRORS) {
    if (!entry.pattern.test(errorLine)) continue;
    if (entry.autoFix.startsWith('manual:') || dryRun) {
      return { matched: true, code: entry.code, action: entry.autoFix, executed: false };
    }
    try {
      execSync(entry.autoFix, { stdio: 'inherit', cwd: AEGIS_ROOT });
      recordLearningEntry({
        id: `autofix-${entry.code}`,
        category: 'bug-pattern',
        pattern: entry.label,
        resolution: `Auto-fixed via: ${entry.autoFix}`,
        enforcedRuleId: entry.code,
      });
      return { matched: true, code: entry.code, action: entry.autoFix, executed: true };
    } catch {
      return { matched: true, code: entry.code, action: entry.autoFix, executed: false };
    }
  }
  return null;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const policy = loadPolicy();
  const targetRoot = resolveTargetRoot(args);

  if (!isFeatureEnabled(policy, 'gates')) {
    console.warn('Verification gates are disabled by policy feature toggle.');
  } else if (args.includes('--security')) {
    mkdirSync(LOGS_DIR, { recursive: true });
    const r = runSecurityScan(policy, targetRoot);
    console.log(JSON.stringify(r, null, 2));
    if (r.hardFail) process.exitCode = 1;
  } else if (args.includes('--diff-risk')) {
    const r = runDiffRiskScore(policy, targetRoot);
    console.log(JSON.stringify(r, null, 2));
    if (r.hardFail) process.exitCode = 1;
  } else if (args.includes('--flaky-detect')) {
    const r = runFlakyTestDetection(policy);
    console.log(JSON.stringify(r, null, 2));
    if (r.hardFail) process.exitCode = 1;
  } else if (args.includes('--report')) {
    console.log(existsSync(REPORT_FILE) ? readFileSync(REPORT_FILE, 'utf8') : 'No report found.');
  } else {
    runAllGates(policy, targetRoot);
  }
}


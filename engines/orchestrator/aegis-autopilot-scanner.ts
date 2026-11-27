#!/usr/bin/env node
/**
 * aegis-autopilot-scanner.ts — Real Cross-Repo Codebase Audit Scanner (AEGIS V5.1)
 * Audits actual files across White-Caves repositories for concrete architectural & quality defects.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AEGIS_ROOT, AGENTS_ROOT } from './policy-loader.ts';
import { loadLearningLog, recordLearningEntry } from '../../knowledge/learningLoop.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOGS_DIR = path.join(__dirname, 'logs');
const OUT_JSON = path.join(LOGS_DIR, 'aegis-scan-report.json');
const OUT_MD = path.join(AGENTS_ROOT, 'plans', 'AEGIS_REAL_SCAN_REPORT.md');

const WORKSPACE_ROOT = path.resolve(AEGIS_ROOT, '..');
const DEFAULT_REPOS = ['White-Caves-Frontend', 'White-Caves-Server', 'White-Caves-Web', 'Aegis-Sterling'];
const IGNORE_DIRS = new Set(['node_modules', '.git', 'dist', '.next', '.agents', 'coverage', 'playwright-report', 'legacy_archive']);
const FORBIDDEN_ROOT_DIRS = ['docs', 'plans', 'strategies', 'business_docs'];

export interface RealScanFinding {
  id: string;
  repo: string;
  rule: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  file: string;
  detail: string;
}

export interface RealScanSummary {
  generatedAt: string;
  reposScanned: string[];
  totalFilesScanned: number;
  totalFindings: number;
  countsByRule: Record<string, number>;
  findings: RealScanFinding[];
}

function walkRepoFiles(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkRepoFiles(full, out);
    } else if (/\.(tsx?|jsx?)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
      out.push(full);
    }
  }
  return out;
}

export function runScan(targetDirs?: string[]): RealScanSummary {
  const repos = (targetDirs && targetDirs.length > 0)
    ? targetDirs.map(d => ({ name: path.basename(path.resolve(d)), dir: path.resolve(d) }))
    : DEFAULT_REPOS.map(name => ({ name, dir: path.join(WORKSPACE_ROOT, name) })).filter(r => fs.existsSync(r.dir));

  const findings: RealScanFinding[] = [];
  let totalFilesScanned = 0;
  let seq = 1;

  for (const repo of repos) {
    for (const forbidden of FORBIDDEN_ROOT_DIRS) {
      if (fs.existsSync(path.join(repo.dir, forbidden))) {
        findings.push({
          id: `SCAN-${String(seq++).padStart(4, '0')}`,
          repo: repo.name,
          rule: 'TURING-ROOT-007',
          severity: 'HIGH',
          file: `${forbidden}/`,
          detail: `Forbidden loose root folder '${forbidden}/' present in ${repo.name}.`,
        });
      }
    }

    const scanRoots = ['src', 'server', 'app', 'engines']
      .map(sub => path.join(repo.dir, sub))
      .filter(p => fs.existsSync(p));

    const files = scanRoots.flatMap(sr => walkRepoFiles(sr));
    totalFilesScanned += files.length;

    for (const file of files) {
      const rel = path.relative(repo.dir, file).replace(/\\/g, '/');
      const isTest = /\.(test|spec)\.|__tests__|__mocks__/.test(rel);
      const content = fs.readFileSync(file, 'utf8');
      const lineCount = content ? content.split('\n').length : 0;

      if (!isTest && lineCount > 350) {
        findings.push({
          id: `SCAN-${String(seq++).padStart(4, '0')}`,
          repo: repo.name,
          rule: 'AEG-042',
          severity: lineCount > 700 ? 'HIGH' : 'MEDIUM',
          file: rel,
          detail: `${lineCount} lines exceeds 350-line Single Purpose File ceiling.`,
        });
      }

      if (!isTest && /@ts-ignore|@ts-nocheck/.test(content)) {
        findings.push({
          id: `SCAN-${String(seq++).padStart(4, '0')}`,
          repo: repo.name,
          rule: 'PHOENIX-TS-STRICT',
          severity: 'MEDIUM',
          file: rel,
          detail: 'Contains @ts-ignore or @ts-nocheck suppression.',
        });
      }

      if (!isTest && repo.name === 'White-Caves-Frontend' && /\b(?:window\.)?alert\s*\(/.test(content)) {
        findings.push({
          id: `SCAN-${String(seq++).padStart(4, '0')}`,
          repo: repo.name,
          rule: 'WC-UI-ALERT',
          severity: 'LOW',
          file: rel,
          detail: 'Uses native alert() instead of AlertBanner / ToastContainer.',
        });
      }

      if (repo.name === 'Aegis-Sterling' && rel.startsWith('engines/orchestrator/') && /\.(js|cjs)$/.test(rel)) {
        findings.push({
          id: `SCAN-${String(seq++).padStart(4, '0')}`,
          repo: repo.name,
          rule: 'AEGIS-TS-MIGRATION',
          severity: 'LOW',
          file: rel,
          detail: 'Legacy .js/.cjs orchestrator pending conversion to TypeScript ESM.',
        });
      }
    }
  }

  const countsByRule: Record<string, number> = {};
  for (const f of findings) countsByRule[f.rule] = (countsByRule[f.rule] ?? 0) + 1;

  const summary: RealScanSummary = {
    generatedAt: new Date().toISOString(),
    reposScanned: repos.map(r => r.name),
    totalFilesScanned,
    totalFindings: findings.length,
    countsByRule,
    findings,
  };

  fs.mkdirSync(LOGS_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(summary, null, 2), 'utf8');

  const topFindings = findings.slice(0, 30);
  const md = [
    '# AEGIS Real Codebase Scan Report',
    `> Generated: ${summary.generatedAt} | Repos: ${summary.reposScanned.join(', ')} | Files Scanned: ${totalFilesScanned} | Findings: ${findings.length}`,
    '',
    '## Summary by Rule',
    ...Object.entries(countsByRule).map(([rule, count]) => `- **${rule}**: ${count}`),
    '',
    '## Top 30 Concrete Findings',
    '| ID | Repo | Rule | Severity | File | Detail |',
    '| :--- | :--- | :--- | :--- | :--- | :--- |',
    ...topFindings.map(f => `| ${f.id} | ${f.repo} | ${f.rule} | ${f.severity} | \`${f.file}\` | ${f.detail} |`),
  ].join('\n');
  fs.writeFileSync(OUT_MD, md, 'utf8');

  // Closed-loop learning: persist active scan rules and mark previously seen rules as resolved when count reaches 0
  const log = loadLearningLog();
  for (const [rule, count] of Object.entries(countsByRule)) {
    recordLearningEntry({
      id: `scan-rule-${rule}`,
      category: 'scan-finding',
      pattern: rule,
      resolution: `Active across ${count} finding(s); enforce ${rule} in pre-commit & CI.`,
      enforcedRuleId: rule,
    });
  }
  for (const entry of log.entries) {
    if (entry.category === 'scan-finding' && entry.enforcedRuleId && !(entry.enforcedRuleId in countsByRule)) {
      recordLearningEntry({
        id: entry.id,
        category: 'scan-finding',
        pattern: entry.pattern,
        resolution: `RESOLVED (0 findings in latest scan). Enforced permanently.`,
        enforcedRuleId: entry.enforcedRuleId,
      });
    }
  }

  return summary;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const idx = process.argv.indexOf('--target');
  const targets = idx !== -1 && process.argv[idx + 1] ? [process.argv[idx + 1]] : undefined;
  const result = runScan(targets);
  console.log(`🔍 [AEGIS Real Scan] Scanned ${result.totalFilesScanned} files across ${result.reposScanned.join(', ')} -> ${result.totalFindings} concrete findings.`);
  Object.entries(result.countsByRule).forEach(([rule, count]) => console.log(`   - ${rule}: ${count}`));
}

export async function runScanAsync(targetDirs?: string[], concurrency = 16): Promise<RealScanSummary> {
  const repos = (targetDirs && targetDirs.length > 0)
    ? targetDirs.map(d => ({ name: path.basename(path.resolve(d)), dir: path.resolve(d) }))
    : DEFAULT_REPOS.map(name => ({ name, dir: path.join(WORKSPACE_ROOT, name) })).filter(r => fs.existsSync(r.dir));

  const findings: RealScanFinding[] = [];
  let totalFilesScanned = 0;
  let seq = 1;

  for (const repo of repos) {
    for (const forbidden of FORBIDDEN_ROOT_DIRS) {
      if (fs.existsSync(path.join(repo.dir, forbidden))) {
        findings.push({
          id: `SCAN-${String(seq++).padStart(4, '0')}`,
          repo: repo.name,
          rule: 'TURING-ROOT-007',
          severity: 'HIGH',
          file: `${forbidden}/`,
          detail: `Forbidden loose root folder '${forbidden}/' present in ${repo.name}.`,
        });
      }
    }

    const scanRoots = ['src', 'server', 'app', 'engines']
      .map(sub => path.join(repo.dir, sub))
      .filter(p => fs.existsSync(p));
    const files = scanRoots.flatMap(sr => walkRepoFiles(sr));
    totalFilesScanned += files.length;

    for (let i = 0; i < files.length; i += concurrency) {
      const batch = files.slice(i, i + concurrency);
      const contents = await Promise.all(batch.map(f => fs.promises.readFile(f, 'utf8').catch(() => '')));
      batch.forEach((file, idx) => {
        const rel = path.relative(repo.dir, file).replace(/\\/g, '/');
        const isTest = /\.(test|spec)\.|__tests__|__mocks__/.test(rel);
        const content = contents[idx];
        const lineCount = content ? content.split('\n').length : 0;
        if (!isTest && lineCount > 350) {
          findings.push({
            id: `SCAN-${String(seq++).padStart(4, '0')}`,
            repo: repo.name,
            rule: 'AEG-042',
            severity: lineCount > 700 ? 'HIGH' : 'MEDIUM',
            file: rel,
            detail: `${lineCount} lines exceeds 350-line Single Purpose File ceiling.`,
          });
        }
        if (!isTest && /@ts-ignore|@ts-nocheck/.test(content)) {
          findings.push({
            id: `SCAN-${String(seq++).padStart(4, '0')}`,
            repo: repo.name,
            rule: 'PHOENIX-TS-STRICT',
            severity: 'MEDIUM',
            file: rel,
            detail: 'Contains @ts-ignore or @ts-nocheck suppression.',
          });
        }
      });
    }
  }

  const countsByRule = findings.reduce<Record<string, number>>((acc, f) => {
    acc[f.rule] = (acc[f.rule] ?? 0) + 1;
    return acc;
  }, {});

  return {
    generatedAt: new Date().toISOString(),
    reposScanned: repos.map(r => r.name),
    totalFilesScanned,
    totalFindings: findings.length,
    countsByRule,
    findings,
  };
}

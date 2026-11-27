#!/usr/bin/env node
/**
 * check-12-way-and-file-limits.ts — AEGIS V5.1 Single-Purpose File Law (<350 lines) & 12-Way Architecture Inventory
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditAtomicBarrelFolder } from '../../protocols/wilkes12Way/atomicFolderBarrel.protocol.ts';

export { auditAtomicBarrelFolder };

const MAX_LINES = 350;
const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  '.next',
  '.agents',
  'coverage',
  'playwright-report',
  'legacy_archive',
]);

export interface OversizedFileEntry {
  file: string;
  lines: number;
}

export interface FileLimitAuditResult {
  targetRoot: string;
  total: number;
  oversizedCount: number;
  oversized: OversizedFileEntry[];
}

export interface TwelveWayInventoryResult {
  auditedDirs: number;
  core7Dirs: number;
  full12WayDirs: number;
  testedDirs: number;
  workflowDirs: number;
}

function resolveTargetRoot(argv: string[]): string {
  const idx = argv.indexOf('--target');
  if (idx !== -1 && argv[idx + 1]) {
    return path.resolve(argv[idx + 1]);
  }
  return process.cwd();
}

function getLinesCount(filePath: string): number {
  if (!fs.existsSync(filePath)) return 0;
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content) return 0;
  return content.split('\n').length - (content.endsWith('\n') ? 1 : 0);
}

function walkSourceFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkSourceFiles(fullPath, fileList);
    } else if (/\.(tsx?|jsx?)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

export function auditFileLimits(targetRoot: string = process.cwd()): FileLimitAuditResult {
  const candidateDirs = ['src', 'server', 'app', 'engines', 'laws', 'rules', 'protocols', 'skills', 'hooks', 'registry']
    .map(d => path.join(targetRoot, d))
    .filter(d => fs.existsSync(d));

  const files = candidateDirs.flatMap(d => walkSourceFiles(d));
  const oversized: OversizedFileEntry[] = [];

  for (const file of files) {
    if (file.includes('.test.') || file.includes('.spec.') || file.includes('__mocks__')) continue;
    const lines = getLinesCount(file);
    if (lines > MAX_LINES) {
      oversized.push({ file: path.relative(targetRoot, file), lines });
    }
  }

  oversized.sort((a, b) => b.lines - a.lines);

  console.log(`🔍 [AEGIS File Limits] Audited ${files.length} source files under ${targetRoot}`);
  if (oversized.length === 0) {
    console.log('✅ 100% of non-test source files adhere to the 350-line Single Purpose File Law!');
  } else {
    console.log(`❌ Found ${oversized.length} non-test source files exceeding ${MAX_LINES} lines (AEG-042):`);
    oversized.slice(0, 15).forEach(o => {
      console.log(`   - ${o.file} (${o.lines} lines)`);
    });
  }

  return { targetRoot, total: files.length, oversizedCount: oversized.length, oversized };
}

export function auditTwelveWayInventory(targetRoot: string = process.cwd()): TwelveWayInventoryResult {
  const compDir = path.join(targetRoot, 'src', 'components');
  let core7Dirs = 0;
  let full12WayDirs = 0;
  let auditedDirs = 0;
  let testedDirs = 0;
  let workflowDirs = 0;

  function scanDir(dirPath: string): void {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const subFiles = entries.filter(e => !e.isDirectory()).map(e => e.name);
    const hasView = subFiles.some(
      f => !/\.(test|spec)\./.test(f) && (f.includes('.view.') || f.endsWith('.tsx') || f.endsWith('.jsx'))
    );
    const hasTest = subFiles.some(f => f.includes('.test.') || f.includes('.spec.'));
    const hasWorkflow = subFiles.some(f => f.includes('.workflow.') || f.includes('.dnd.') || f.includes('.pipeline.'));

    if (hasView) {
      auditedDirs++;
      const hasLogic = subFiles.some(f => f.includes('.logic.') || /^use.*\.ts$/.test(f));
      const hasStyles = subFiles.some(f => f.includes('.styles.') || f.includes('.style.') || f.endsWith('.css'));
      const hasData = subFiles.some(f => f.includes('.data.') || f.includes('.registries.'));
      const hasTypes = subFiles.some(f => f.includes('.types.') || f.includes('.config.'));
      const hasFallback = subFiles.some(f => f.includes('.fallback.'));
      const hasTelemetry = subFiles.some(f => f.includes('.telemetry.'));
      const hasI18n = subFiles.some(f => f.includes('.i18n.'));
      const hasCache = subFiles.some(f => f.includes('.cache.'));
      const hasExt = subFiles.some(f => f.includes('.workers.') || f.includes('.policy.') || f.includes('.agent.'));

      const isCore7 = hasLogic && hasStyles && hasData && hasTypes && hasTest && hasWorkflow;
      if (isCore7) core7Dirs++;
      if (isCore7 && hasFallback && hasTelemetry && hasI18n && hasCache && hasExt) full12WayDirs++;
      if (hasTest) testedDirs++;
      if (hasWorkflow) workflowDirs++;
    }

    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('_') && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        scanDir(path.join(dirPath, entry.name));
      }
    }
  }

  if (fs.existsSync(compDir)) scanDir(compDir);

  console.log(`\n📦 [12-Way Inventory] ${auditedDirs} dirs (${core7Dirs} core-7, ${full12WayDirs} full 12-way, ${testedDirs} tested, ${workflowDirs} workflows)`);
  console.log('   - Filename inventory only: file presence is not semantic compliance or executed test coverage.');
  return { auditedDirs, core7Dirs, full12WayDirs, testedDirs, workflowDirs };
}

export const auditTwelveWayArchitecture = auditTwelveWayInventory;
export const auditSevenCategoryInventory = auditTwelveWayInventory;

const MONOREPO_SUBREPOS = [
  'White-Caves-Frontend',
  'White-Caves-Server',
  'White-Caves-Web',
  'White-Caves-Mobile',
  'Aegis-Sterling',
];

export function resolveTargets(argv: string[]): string[] {
  const idx = argv.indexOf('--target');
  if (idx !== -1 && argv[idx + 1]) {
    return [path.resolve(argv[idx + 1])];
  }
  const cwd = process.cwd();
  const directSubRepos = MONOREPO_SUBREPOS.map(r => path.join(cwd, r)).filter(p => fs.existsSync(p));
  if (directSubRepos.length > 0) {
    return directSubRepos;
  }
  const parentDir = path.resolve(cwd, '..');
  const parentSubRepos = MONOREPO_SUBREPOS.map(r => path.join(parentDir, r)).filter(p => fs.existsSync(p));
  if (parentSubRepos.length > 0) {
    return parentSubRepos;
  }
  return [cwd];
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const targets = resolveTargets(process.argv.slice(2));
  let totalFiles = 0;
  let totalOversized = 0;

  for (const target of targets) {
    const result = auditFileLimits(target);
    totalFiles += result.total;
    totalOversized += result.oversizedCount;
    auditTwelveWayInventory(target);
    const atomicMatrixDir = path.join(target, 'src', 'aegis-protocols', 'canonical-108-divisions-matrix');
    if (fs.existsSync(atomicMatrixDir)) {
      const atomic = auditAtomicBarrelFolder(atomicMatrixDir);
      console.log(
        `\n🧬 [Atomic Folder & Barrel Protocol] canonical-108-divisions-matrix: ${atomic.totalFoldersAudited} folders, ${atomic.totalFilesAudited} files (max=${atomic.maxLinesObserved} lines <= 150 leaf target, valid=${atomic.valid})`
      );
      if (!atomic.valid) process.exitCode = 1;
    }
  }

  console.log(`\n📊 [AEGIS Limits Aggregate] Repos: ${targets.length} | Total Files: ${totalFiles} | Oversized (>350 lines): ${totalOversized}`);
  if (totalOversized > 0) process.exitCode = 1;
}

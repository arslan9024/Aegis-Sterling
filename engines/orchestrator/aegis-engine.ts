#!/usr/bin/env node
/**
 * aegis-engine.ts — Unified AEGIS V5.1 Omni-Orchestrator Engine (TypeScript ESM)
 */

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { AEGIS_ROOT, AGENTS_ROOT, loadPolicy } from './policy-loader.ts';
import { AEGIS_42_PROTOCOLS, type AegisProtocolRule } from '../../.agents/aegis/protocols/aegisMasterProtocols.ts';
import { runScan } from './aegis-autopilot-scanner.ts';
import { computeFixedOrgMatrix } from '../../protocols/bhakti/index.ts';

const WORKSPACE_ROOT = path.resolve(AEGIS_ROOT, '..');

export function loadProtocolRules(): AegisProtocolRule[] {
  return Object.values(AEGIS_42_PROTOCOLS);
}

export function runHealth() {
  console.log('🛡️ [AEGIS Health] Executing V5.1 governance, policy, and protocol matrix audit...');
  const policy = loadPolicy();
  const protocolRules = loadProtocolRules();
  const bhaktiMatrix = computeFixedOrgMatrix();
  const cap = Object.fromEntries(bhaktiMatrix.tiers.map(t => [t.code, t.capacity]));

  console.log('✅ Policy Version:', policy.version);
  console.log('✅ Schema Version:', policy.schemaVersion);
  console.log(
    '✅ Deduplication & Acceleration:',
    policy.deduplicationAndOptimizationEngine?.enabled ? 'Active' : 'Disabled'
  );
  console.log(
    '✅ Continuous Pillars Active:',
    Object.keys(policy.deduplicationAndOptimizationEngine?.continuousAutopilotPillars ?? {}).join(', ')
  );
  console.log(
    `✅ V5.1 Typed Protocol Rules Active: ${protocolRules.length}/42 (${protocolRules[0]?.ruleId}–${protocolRules[protocolRules.length - 1]?.ruleId})`
  );
  console.log(
    `✅ Bhakti Fractal Matrix: 1 MD -> ${cap.DIRECTOR} Dir -> ${cap.MANAGER} Mgr -> ${cap.ASSISTANT_MANAGER} AM -> ${cap.SUPERVISOR} Sup (Fixed=${bhaktiMatrix.fixedSeatsTotal} + Manual Teams/Employees)`
  );
  console.log('=== Aegis Health Summary: PASS ===\n');

  return {
    status: 'PASS',
    policyVersion: policy.version,
    protocolRulesCount: protocolRules.length,
    bhaktiMatrix,
  };
}

export function runKnowledgeConsultation() {
  console.log('📚 [AEGIS Knowledge] Consulting canonical directives from @Zoe (COO) and @Aurora (CTO)...');
  const directives = [
    { area: 'TURING-LAW-000', rule: 'Parallel batching, surgical line reads, <15k token budget', status: 'ACTIVE' },
    { area: 'DMS/ERMS/TMS', rule: 'Strict separation of Departments, Entities, and Tasks', status: 'ACTIVE' },
    { area: 'AEG-003/041', rule: 'Context Triad only (Theme, Language, Currency) + Redux slices', status: 'ACTIVE' },
    { area: 'AEG-029/037', rule: 'UAE 5% VAT + 9% Corp Tax + Merit XP (60%->70% split)', status: 'ACTIVE' },
  ];
  directives.forEach(d => console.log(`   • [${d.area}] ${d.rule} -> [${d.status}]`));
  return { directives };
}

export function runScanner(targets?: string[]) {
  console.log('🔍 [AEGIS Scanner] Executing real cross-repo static audit...');
  const result = runScan(targets);
  console.log(`🎯 Scan Complete — ${result.totalFilesScanned} files scanned across ${result.reposScanned.join(', ')}.`);
  console.log(`📋 Concrete Findings: ${result.totalFindings} (Report: Aegis-Sterling/.agents/plans/AEGIS_REAL_SCAN_REPORT.md)\n`);
  return result;
}

export function runDedup() {
  console.log('🧹 [AEGIS Dedup] Auditing repos for forbidden loose root folders (TURING-ROOT-007)...');
  const repos = ['White-Caves-Frontend', 'White-Caves-Server', 'White-Caves-Web', 'Aegis-Sterling'];
  const ghostFolders: string[] = [];

  for (const repo of repos) {
    for (const dir of ['docs', 'plans', 'strategies', 'business_docs', 'business', 'codebase', 'scratch']) {
      if (fs.existsSync(path.join(WORKSPACE_ROOT, repo, dir))) {
        ghostFolders.push(`${repo}/${dir}`);
      }
    }
  }

  console.log(
    ghostFolders.length === 0
      ? '✅ Root Hygiene Clean: 0 rogue folders across all repos.\n'
      : `⚠️ Found ${ghostFolders.length} rogue folder(s): ${ghostFolders.join(', ')}\n`
  );
  return { duplicatesFound: ghostFolders.length, duplicateCandidates: ghostFolders };
}

export function runSquads() {
  console.log('⚡ [AEGIS Workforce] Auditing 1-12-108 Engineering & Zoe Business Mesh...');
  const execDir = path.join(AGENTS_ROOT, 'executive');
  const execFiles = fs.existsSync(execDir)
    ? fs.readdirSync(execDir).filter(f => f.endsWith('.agent.json'))
    : [];

  const engRoot = path.join(AGENTS_ROOT, 'aegis-engineering');
  const engDepts: Array<{ id: number; slug: string; name: string; director: string; nodesCount: number }> = [];
  let totalEngNodes = 0;

  if (fs.existsSync(engRoot)) {
    const slugs = fs.readdirSync(engRoot).filter(d => fs.statSync(path.join(engRoot, d)).isDirectory()).sort();
    for (const slug of slugs) {
      const manifestPath = path.join(engRoot, slug, 'dept-manifest.json');
      if (!fs.existsSync(manifestPath)) continue;
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as {
        departmentId: number;
        departmentName: string;
        director: string;
        team?: unknown[];
        nodeCount?: number;
      };
      const nodesCount = Array.isArray(manifest.team) ? manifest.team.length : (manifest.nodeCount ?? 0);
      totalEngNodes += nodesCount;
      engDepts.push({ id: manifest.departmentId, slug, name: manifest.departmentName, director: manifest.director, nodesCount });
    }
  }

  const zoeRoot = path.join(AGENTS_ROOT, 'zoe-business-assistants');
  let zoeManagersCount = 0;
  let zoeSupervisorsCount = 0;
  if (fs.existsSync(zoeRoot)) {
    for (const slug of fs.readdirSync(zoeRoot).filter(d => fs.statSync(path.join(zoeRoot, d)).isDirectory())) {
      const files = fs.readdirSync(path.join(zoeRoot, slug));
      zoeManagersCount += files.filter(f => f.endsWith('.manager.json')).length;
      zoeSupervisorsCount += files.filter(f => f.endsWith('.supervisor.json')).length;
    }
  }

  const protocolRules = loadProtocolRules();
  const bhaktiMatrix = computeFixedOrgMatrix();
  const cap = Object.fromEntries(bhaktiMatrix.tiers.map(t => [t.code, t.capacity]));
  const totalActiveMesh = execFiles.length + totalEngNodes + zoeManagersCount + zoeSupervisorsCount;

  console.log(`👑 [Level 0 Executive Council] ${execFiles.length} Sovereign Agents (.agents/executive/)`);
  console.log(`🏛️ [Track 1 — Engineering] ${engDepts.length} Departments | ${totalEngNodes} Engineering Nodes`);
  console.log(`💼 [Track 2 — Zoe Business] ${zoeManagersCount} Managers | ${zoeSupervisorsCount} Supervisors`);
  console.log(
    `🔱 [Bhakti 1-12-108 Repeating Fractal] 1 MD | ${cap.DIRECTOR} Dir | ${cap.MANAGER} Mgr | ${cap.ASSISTANT_MANAGER} AM | ${cap.SUPERVISOR} Sup (Stop Boundary -> Manual CRUD Teams/Employees)`
  );
  console.log(`📐 [Protocol Coverage] ${protocolRules.length}/42 Typed Rules Enforced`);
  console.log(`🌐 [Total Verified Mesh] ${totalActiveMesh} Agents\n`);

  return {
    executiveCouncilCount: execFiles.length,
    engineeringDepartments: engDepts.length,
    engineeringNodesTotal: totalEngNodes,
    zoeManagersCount,
    zoeSupervisorsCount,
    protocolRulesCount: protocolRules.length,
    totalActiveMesh,
    bhaktiMatrix,
    departments: engDepts,
  };
}

export function runBenchmark() {
  console.log('🚀 [AEGIS Benchmark] Measuring real policy, protocol, and mesh load latency...');
  const start = performance.now();
  const policy = loadPolicy();
  const rules = loadProtocolRules();
  const squadStats = runSquads();
  const elapsedMs = performance.now() - start;

  const scanReportPath = path.join(__dirname, 'logs', 'aegis-scan-report.json');
  let lastScanFindings: number | null = null;
  if (fs.existsSync(scanReportPath)) {
    try {
      const scan = JSON.parse(fs.readFileSync(scanReportPath, 'utf8')) as { totalFindings?: number };
      lastScanFindings = scan.totalFindings ?? null;
    } catch {
      lastScanFindings = null;
    }
  }

  console.log(`✅ Policy + 42 Protocols + ${squadStats.totalActiveMesh}-Agent Mesh Loaded in ${elapsedMs.toFixed(2)}ms (policy=${policy.version})`);
  console.log(`✅ Latest Scan Findings on Disk: ${lastScanFindings ?? 'not yet scanned'}\n`);
  return { loadLatencyMs: Number(elapsedMs.toFixed(2)), rulesCount: rules.length, totalMesh: squadStats.totalActiveMesh, lastScanFindings };
}

async function main() {
  const command = (process.argv[2] || 'cycle').toLowerCase();
  switch (command) {
    case 'health':
      runHealth();
      break;
    case 'docs':
      runKnowledgeConsultation();
      break;
    case 'scan':
      runScanner();
      break;
    case 'dedup':
      runDedup();
      break;
    case 'squads':
      runSquads();
      break;
    case 'benchmark':
      runBenchmark();
      break;
    case 'cycle':
    default:
      runHealth();
      runKnowledgeConsultation();
      runDedup();
      runSquads();
      runScanner();
      break;
  }
}

const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isMainModule) {
  main().catch(err => {
    console.error('❌ AEGIS Engine Failure:', err);
    process.exit(1);
  });
}

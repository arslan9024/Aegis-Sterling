/**
 * aegis-ast-analyzer.ts — Dependency-Graph & Circular-Dependency Analyzer for @Dijkstra (aegis-dir-06)
 */

import fs from 'node:fs';
import path from 'node:path';
import { AEGIS_ROOT } from './policy-loader.ts';

export interface AstFinding {
  id: string;
  rule: 'CIRCULAR-DEP' | 'ARCH-BOUNDARY';
  severity: 'HIGH' | 'MEDIUM';
  file: string;
  detail: string;
}

export interface AstAuditResult {
  filesAnalyzed: number;
  edgesCount: number;
  circularDeps: AstFinding[];
  passed: boolean;
}

const IMPORT_RE = /(?:import|export)\s+(?:[^'"]*?\s+from\s+)?['"](\.[^'"]+)['"]/g;

function walkTsFiles(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkTsFiles(full, out);
    } else if (/\.(ts|tsx)$/.test(entry.name) && !/\.(test|spec)\./.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function resolveRelativeImport(fromFile: string, spec: string): string | null {
  const base = path.resolve(path.dirname(fromFile), spec);
  const candidates = [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts'), path.join(base, 'index.tsx')];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return path.normalize(c);
  }
  return null;
}

export function buildImportGraph(rootDir: string = AEGIS_ROOT): Map<string, string[]> {
  const files = walkTsFiles(rootDir);
  const graph = new Map<string, string[]>();

  for (const file of files) {
    const norm = path.normalize(file);
    const content = fs.readFileSync(file, 'utf8');
    const deps: string[] = [];
    let match: RegExpExecArray | null;
    IMPORT_RE.lastIndex = 0;
    while ((match = IMPORT_RE.exec(content)) !== null) {
      const resolved = resolveRelativeImport(norm, match[1]);
      if (resolved) deps.push(resolved);
    }
    graph.set(norm, deps);
  }
  return graph;
}

export function detectCircularDependencies(graph: Map<string, string[]>, rootDir: string = AEGIS_ROOT): AstFinding[] {
  const state = new Map<string, 'visiting' | 'visited'>();
  const stack: string[] = [];
  const seenCycles = new Set<string>();
  const findings: AstFinding[] = [];
  let seq = 1;

  function dfs(node: string) {
    state.set(node, 'visiting');
    stack.push(node);

    for (const dep of graph.get(node) ?? []) {
      const depState = state.get(dep);
      if (depState === 'visiting') {
        const idx = stack.indexOf(dep);
        const cycle = [...stack.slice(idx), dep].map(f => path.relative(rootDir, f).replace(/\\/g, '/'));
        const key = [...cycle].sort().join('|');
        if (!seenCycles.has(key)) {
          seenCycles.add(key);
          findings.push({
            id: `AST-${String(seq++).padStart(4, '0')}`,
            rule: 'CIRCULAR-DEP',
            severity: 'HIGH',
            file: cycle[0],
            detail: `Circular dependency: ${cycle.join(' -> ')}`,
          });
        }
      } else if (!depState) {
        dfs(dep);
      }
    }

    stack.pop();
    state.set(node, 'visited');
  }

  for (const node of graph.keys()) {
    if (!state.has(node)) dfs(node);
  }
  return findings;
}

export function runAstAudit(options: { rootDir?: string; json?: boolean } = {}): AstAuditResult {
  const { rootDir = AEGIS_ROOT, json = false } = options;
  const graph = buildImportGraph(rootDir);
  const edgesCount = [...graph.values()].reduce((acc, deps) => acc + deps.length, 0);
  const circularDeps = detectCircularDependencies(graph, rootDir);
  const result: AstAuditResult = {
    filesAnalyzed: graph.size,
    edgesCount,
    circularDeps,
    passed: circularDeps.length === 0,
  };

  if (json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log('🕸️ [AEGIS AST Audit] Dependency-graph & circular-dependency scan (@Dijkstra)...');
    console.log(`   • Files Analyzed: ${result.filesAnalyzed} | Import Edges: ${result.edgesCount}`);
    console.log(`   • Circular Dependencies: ${circularDeps.length}`);
    console.log(`=== AST Audit: ${result.passed ? 'PASS' : 'FAIL'} ===\n`);
  }
  return result;
}

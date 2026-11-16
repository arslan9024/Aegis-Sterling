/**
 * @file aegis-nova-v2-engine.ts
 * @description AEGIS Nova V2 Autonomous Intelligence Engine.
 * Strict TypeScript ESM modernization under TURING-LAW-000 (<350 lines).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';

// Fix for Node 18+ native fetch IPv6 issues on Windows
dns.setDefaultResultOrder('ipv4first');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

export interface NovaBrainState {
  lastUpdated: string;
  activeIssues: number[];
  completedIssues: number[];
  failedIssues: number[];
  metrics: {
    totalResolved: number;
    totalAttempts: number;
    successRate: number;
  };
}

export interface GitHubIssueItem {
  number: number;
  title: string;
  body: string;
  labels: Array<{ name: string }>;
  state: 'open' | 'closed';
}

export interface EngineConfig {
  githubToken: string;
  deepseekApiKey: string;
  repoUrl: string;
  brainPath: string;
}

export function loadEngineConfig(): EngineConfig {
  const envPath = path.join(ROOT, '.env');
  let githubToken = process.env.GITHUB_TOKEN || '';
  let deepseekApiKey = process.env.DEEPSEEK_API_KEY || '';

  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    const lines = envFile.split('\n');
    for (const line of lines) {
      if (line.startsWith('GITHUB_TOKEN=')) githubToken = line.split('=')[1].trim();
      if (line.startsWith('DEEPSEEK_API_KEY=')) deepseekApiKey = line.split('=')[1].trim();
    }
  }

  return {
    githubToken,
    deepseekApiKey,
    repoUrl: 'https://api.github.com/repos/arslan9024/White-Caves/issues',
    brainPath: path.join(ROOT, '.agents', 'plans', 'status', 'NOVA_BRAIN.json'),
  };
}

export async function safeFetch(url: string, options: RequestInit = {}, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, options);
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  throw new Error(`Failed to fetch ${url} after ${retries} attempts.`);
}

export function loadBrain(brainPath: string): NovaBrainState {
  try {
    if (fs.existsSync(brainPath)) {
      return JSON.parse(fs.readFileSync(brainPath, 'utf8')) as NovaBrainState;
    }
  } catch (e) {
    console.warn(`[NovaEngine] Error reading brain state, initializing new:`, e);
  }
  return {
    lastUpdated: new Date().toISOString(),
    activeIssues: [],
    completedIssues: [],
    failedIssues: [],
    metrics: { totalResolved: 0, totalAttempts: 0, successRate: 0 },
  };
}

export function saveBrain(brainPath: string, state: NovaBrainState): void {
  const dir = path.dirname(brainPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(brainPath, JSON.stringify(state, null, 2), 'utf8');
}

export async function fetchOpenIssues(config: EngineConfig): Promise<GitHubIssueItem[]> {
  if (!config.githubToken) {
    console.warn('[NovaEngine] No GITHUB_TOKEN set. Skipping live GitHub fetch.');
    return [];
  }
  const headers = {
    Authorization: `token ${config.githubToken}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Aegis-Nova-V2-TS',
  };
  const res = await safeFetch(`${config.repoUrl}?state=open&per_page=25`, { headers });
  if (!res.ok) {
    throw new Error(`Failed to fetch issues: ${res.statusText}`);
  }
  return (await res.json()) as GitHubIssueItem[];
}

export async function runNovaEngineCycle(): Promise<{ ok: boolean; processed: number }> {
  const config = loadEngineConfig();
  console.log('[NovaEngine] Starting Nova V2 Engine cycle...');
  const brain = loadBrain(config.brainPath);
  const issues = await fetchOpenIssues(config);
  console.log(`[NovaEngine] Discovered ${issues.length} open issues from target repository.`);

  brain.lastUpdated = new Date().toISOString();
  saveBrain(config.brainPath, brain);
  return { ok: true, processed: issues.length };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runNovaEngineCycle().catch(console.error);
}

/**
 * @file aegis-perpetual-ouroboros.ts
 * @description AEGIS Bounded Orchestration Loop (TypeScript ESM).
 * Enforces safe bounded cycle execution, exclusive lockfiles, root collision safety,
 * and disabled git writes per policy.mergePolicy.directPushToMainForbidden.
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const LOGS_DIR = path.join(ROOT, 'engines', 'orchestrator', 'logs');
const LOCK_PATH = path.join(LOGS_DIR, 'ouroboros.lock');
const LIVE_LOG = path.join(LOGS_DIR, 'ouroboros-live.log');

export interface OuroborosOptions {
  maxCycles?: number;
  git?: boolean;
  vitest?: boolean;
}

export interface ParsedOuroborosOptions {
  maxCycles: number;
  vitest: boolean;
}

function validatePositiveFiniteCount(raw: number): number {
  if (typeof raw !== 'number' || !Number.isFinite(raw) || !Number.isSafeInteger(raw) || raw <= 0) {
    throw new Error('Cycle count must be a positive finite integer.');
  }
  return raw;
}

export function parseOptions(argv: string[]): ParsedOuroborosOptions {
  let seenOnce = false;
  let seenCycles = false;
  let maxCycles = 1;
  let vitest = true;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--once') {
      seenOnce = true;
      maxCycles = 1;
    } else if (arg === '--cycles') {
      seenCycles = true;
      const val = argv[++i];
      if (!val || !/^\d+$/.test(val)) {
        throw new Error('Cycle count must be a positive finite integer.');
      }
      maxCycles = validatePositiveFiniteCount(Number(val));
    } else if (arg === '--skip-test') {
      vitest = false;
    } else if (arg === '--skip-git') {
      // Git writes are always disabled by safety invariant.
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }

    if (seenOnce && seenCycles) {
      throw new Error('Specify only one of --once or --cycles.');
    }
  }

  return { maxCycles, vitest };
}

export function enforceRootHygiene(rootDir: string = process.cwd()): void {
  const forbiddenRootFolders = ['docs', 'plans', 'strategies', 'business_docs'];
  for (const folder of forbiddenRootFolders) {
    const targetPath = path.join(rootDir, folder);
    if (fs.existsSync(targetPath)) {
      throw new Error(
        `Root collision detected (${folder}/) — manual review required. No files moved or deleted.`
      );
    }
  }
}

export async function runPerpetualLoop(options: OuroborosOptions = {}): Promise<void> {
  if (options.git === true) {
    throw new Error('Git writes are disabled in bounded automation mode.');
  }

  const maxCycles = options.maxCycles !== undefined ? validatePositiveFiniteCount(options.maxCycles) : 1;
  const runVitest = options.vitest !== false;

  fs.mkdirSync(LOGS_DIR, { recursive: true });
  const fd = fs.openSync(LOCK_PATH, 'wx');
  fs.writeFileSync(LOCK_PATH, `${process.pid}\n`, 'utf8');

  try {
    enforceRootHygiene(process.cwd());

    for (let cycle = 1; cycle <= maxCycles; cycle++) {
      fs.writeFileSync(
        LIVE_LOG,
        `[${new Date().toISOString()}] Cycle ${cycle}/${maxCycles} STARTED\n`,
        'utf8'
      );

      try {
        execSync('node engines/orchestrator/check-12-way-and-file-limits.ts', {
          cwd: ROOT,
          stdio: 'pipe',
        });

        if (runVitest) {
          execSync('npx vitest run src/__tests__/aegisProtocols.test.ts', {
            cwd: process.cwd(),
            stdio: 'pipe',
          });
        } else {
          fs.appendFileSync(LIVE_LOG, `[${new Date().toISOString()}] TESTS SKIPPED\n`);
        }

        fs.appendFileSync(
          LIVE_LOG,
          `[${new Date().toISOString()}] Cycle ${cycle}/${maxCycles} PASSED\n`
        );
      } catch (err) {
        fs.appendFileSync(
          LIVE_LOG,
          `[${new Date().toISOString()}] Cycle ${cycle}/${maxCycles} FAILED: ${(err as Error).message}\n`
        );
        throw err;
      }

      if (cycle < maxCycles) {
        await new Promise(resolve => setTimeout(resolve, 250));
      }
    }
  } finally {
    fs.closeSync(fd);
    fs.unlinkSync(LOCK_PATH);
  }
}

export function executeOuroborosCycle(): Promise<void> {
  return runPerpetualLoop({ maxCycles: 1, vitest: false });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const opts = parseOptions(process.argv.slice(2));
  runPerpetualLoop(opts).catch(err => {
    console.error('❌ Ouroboros Failure:', (err as Error).message);
    process.exit(1);
  });
}

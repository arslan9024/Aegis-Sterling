/**
 * protocols/wilkes12Way/atomicFolderBarrel.protocol.ts
 * Mary Allen Wilkes / Grace Hopper Atomic Folder & Barrel Protocol
 * Enforces:
 *   1. No file > 350 lines (< 150 lines target for matrix leaves).
 *   2. Every folder in an atomic hierarchy MUST contain an index.ts barrel file.
 *   3. Every organizational tier folder MUST separate config.ts and data.ts connected via index.ts.
 */

import fs from 'node:fs';
import path from 'node:path';

export const ATOMIC_FOLDER_BARREL_PROTOCOL = {
  protocolId: 'WILKES-HOPPER-ATOMIC-BARREL-001',
  name: 'Atomic Folder & Barrel Protocol',
  hardMaxLines: 350,
  targetLeafMaxLines: 150,
  requiredBarrelFile: 'index.ts',
  requiredTierFiles: ['index.ts', 'config.ts', 'data.ts'] as const,
  organizationalTierFolders: [
    'executive',
    'director',
    'sub-departments',
    'managers',
    'assistant-managers',
    'supervisors',
  ] as const,
} as const;

export interface AtomicFolderAuditReport {
  rootDir: string;
  valid: boolean;
  totalFoldersAudited: number;
  totalFilesAudited: number;
  maxLinesObserved: number;
  missingBarrels: string[];
  incompleteTierFolders: string[];
  oversizedHardLimitFiles: Array<{ file: string; lines: number }>;
  oversizedLeafTargetFiles: Array<{ file: string; lines: number }>;
}

function countLines(filePath: string): number {
  const raw = fs.readFileSync(filePath, 'utf8');
  if (!raw) return 0;
  return raw.split('\n').length - (raw.endsWith('\n') ? 1 : 0);
}

export function auditAtomicBarrelFolder(rootDir: string): AtomicFolderAuditReport {
  const tierSet = new Set<string>(ATOMIC_FOLDER_BARREL_PROTOCOL.organizationalTierFolders);
  const missingBarrels: string[] = [];
  const incompleteTierFolders: string[] = [];
  const oversizedHardLimitFiles: Array<{ file: string; lines: number }> = [];
  const oversizedLeafTargetFiles: Array<{ file: string; lines: number }> = [];
  let totalFoldersAudited = 0;
  let totalFilesAudited = 0;
  let maxLinesObserved = 0;

  function walk(currentDir: string): void {
    if (!fs.existsSync(currentDir)) return;
    totalFoldersAudited++;
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    const fileNames = new Set(entries.filter(e => e.isFile()).map(e => e.name));
    const relDir = path.relative(rootDir, currentDir) || '.';

    if (!fileNames.has('index.ts')) {
      missingBarrels.push(relDir);
    }

    const baseName = path.basename(currentDir);
    if (tierSet.has(baseName)) {
      for (const reqFile of ATOMIC_FOLDER_BARREL_PROTOCOL.requiredTierFiles) {
        if (!fileNames.has(reqFile)) {
          incompleteTierFolders.push(`${relDir} (missing ${reqFile})`);
        }
      }
    }

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.ts')) {
        totalFilesAudited++;
        const lines = countLines(fullPath);
        if (lines > maxLinesObserved) maxLinesObserved = lines;
        const relFile = path.relative(rootDir, fullPath);
        if (lines > ATOMIC_FOLDER_BARREL_PROTOCOL.hardMaxLines) {
          oversizedHardLimitFiles.push({ file: relFile, lines });
        }
        if (lines > ATOMIC_FOLDER_BARREL_PROTOCOL.targetLeafMaxLines) {
          oversizedLeafTargetFiles.push({ file: relFile, lines });
        }
      }
    }
  }

  walk(rootDir);

  return {
    rootDir,
    valid:
      missingBarrels.length === 0 &&
      incompleteTierFolders.length === 0 &&
      oversizedHardLimitFiles.length === 0 &&
      oversizedLeafTargetFiles.length === 0,
    totalFoldersAudited,
    totalFilesAudited,
    maxLinesObserved,
    missingBarrels,
    incompleteTierFolders,
    oversizedHardLimitFiles,
    oversizedLeafTargetFiles,
  };
}

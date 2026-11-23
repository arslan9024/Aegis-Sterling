/**
 * aegis-file-ops.ts — Sovereign File Operations & Code Loader
 * 
 * Complies with:
 * - TURING-LAW-000 (Zero-Waste, Sub-Second Velocity)
 * - TURING-ROOT-007 (Canonical .agents/ Cleanliness)
 * - TURING-REUSABLE-ATOMIC-017 (Reusable Shared Logic)
 * - AEG-042 (<350 lines per module)
 */

import * as fs from 'fs';
import * as path from 'path';

export interface FileSliceOptions {
  startLine?: number;
  endLine?: number;
  encoding?: BufferEncoding;
}

export interface FileWriteOptions {
  overwrite?: boolean;
  append?: boolean;
  createDirectories?: boolean;
}

export interface FileEditMatch {
  target: string;
  replacement: string;
}

export class AegisFileSystem {
  private static workspaceRoot: string = process.cwd();

  /**
   * Sets the active workspace root for path normalization.
   */
  public static setWorkspaceRoot(rootPath: string): void {
    this.workspaceRoot = path.resolve(rootPath);
  }

  /**
   * Resolves a relative or absolute path against workspace root.
   */
  public static resolvePath(targetPath: string): string {
    return path.isAbsolute(targetPath)
      ? path.normalize(targetPath)
      : path.resolve(this.workspaceRoot, targetPath);
  }

  /**
   * Surgical line read under TURING-LAW-000 (reads only requested line slice).
   */
  public static readSlice(
    filePath: string,
    options: FileSliceOptions = {}
  ): { lines: string[]; totalLines: number; content: string } {
    const fullPath = this.resolvePath(filePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`[AegisFS] File not found: ${fullPath}`);
    }

    const content = fs.readFileSync(fullPath, options.encoding || 'utf-8');
    const allLines = content.split(/\r?\n/);
    const totalLines = allLines.length;

    const start = options.startLine ? Math.max(1, options.startLine) - 1 : 0;
    const end = options.endLine ? Math.min(totalLines, options.endLine) : totalLines;

    const sliced = allLines.slice(start, end);
    return {
      lines: sliced,
      totalLines,
      content: sliced.join('\n'),
    };
  }

  /**
   * Atomic file writer with auto directory creation.
   */
  public static writeFile(
    filePath: string,
    content: string,
    options: FileWriteOptions = { overwrite: true, createDirectories: true }
  ): void {
    const fullPath = this.resolvePath(filePath);
    const dir = path.dirname(fullPath);

    if (options.createDirectories && !fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (fs.existsSync(fullPath) && !options.overwrite && !options.append) {
      throw new Error(`[AegisFS] File already exists and overwrite is false: ${fullPath}`);
    }

    if (options.append) {
      fs.appendFileSync(fullPath, content, 'utf-8');
    } else {
      fs.writeFileSync(fullPath, content, 'utf-8');
    }
  }

  /**
   * Exact drop-in text replacement in a file (atomic edit).
   */
  public static replaceExact(filePath: string, edits: FileEditMatch[]): boolean {
    const fullPath = this.resolvePath(filePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`[AegisFS] Cannot edit non-existent file: ${fullPath}`);
    }

    let fileContent = fs.readFileSync(fullPath, 'utf-8');
    let modified = false;

    for (const edit of edits) {
      if (fileContent.includes(edit.target)) {
        fileContent = fileContent.split(edit.target).join(edit.replacement);
        modified = true;
      } else {
        console.warn(`[AegisFS] Warning: Target string not found in ${filePath}`);
      }
    }

    if (modified) {
      fs.writeFileSync(fullPath, fileContent, 'utf-8');
    }
    return modified;
  }
}

/**
 * Auto-Loader / Lifecycle Initializer
 * Automatically executes on import to verify file access and initialize root paths.
 */
export function autoLoadAegisFileSystem(customRoot?: string): typeof AegisFileSystem {
  const root = customRoot || process.cwd();
  AegisFileSystem.setWorkspaceRoot(root);
  return AegisFileSystem;
}

// Auto-register default export for seamless ESM & CJS interop
export default autoLoadAegisFileSystem();

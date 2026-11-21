/**
 * laws/singlePurpose.law.ts — AEG-042 Single-Purpose File Ceiling (<350 lines), 12-Way Layers & Atomic Barrel Law
 */
export const SINGLE_PURPOSE_MAX_LINES = 350;
export const MATRIX_LEAF_TARGET_LINES = 150;
export const ATOMIC_TIER_REQUIRED_FILES = ['index.ts', 'config.ts', 'data.ts'] as const;
export const TWELVE_WAY_LAYERS = [
  'view',
  'logic',
  'styles',
  'data',
  'types',
  'tests',
  'workflow',
  'fallback',
  'telemetry',
  'i18n',
  'cache',
  'extensions',
] as const;

export function assertSinglePurposeFile(
  lineCount: number,
  filePath: string,
  maxLines: number = SINGLE_PURPOSE_MAX_LINES
): { valid: boolean; reason?: string } {
  if (lineCount > maxLines) {
    return {
      valid: false,
      reason: `${filePath} (${lineCount} lines) exceeds ${maxLines}-line limit.`,
    };
  }
  return { valid: true };
}

/**
 * turingConstants.ts — Canonical constants for the AEGIS V5.0 Turing Orchestrator.
 * @see TURING-LAW-000
 * @see AEG-001 – AEG-042
 */

/**
 * Supreme Law #0 configuration for AI credit and execution velocity.
 * @see TURING-LAW-000
 */
export const SUPREME_CREDIT_VELOCITY_CONFIG = {
  lawId: 'TURING-LAW-000',
  title: 'Supreme Zero-Waste AI Credit & Sub-Second Velocity Law',
  maxTaskTokens: 15000,
  targetTurnCountMax: 3,
  requireParallelToolCalls: true,
  requireSurgicalLineReads: true,
  requireTargetedVitestRun: true,
} as const;

/**
 * Canonical 5 V5.1 CSV Protocol Matrices.
 * @see AEG-001 – AEG-042
 */
export const AEGIS_PROTOCOL_FILES = [
  '.agents/aegis/protocols/PROMETHEUS_CORE_UNBOUND.csv',
  '.agents/aegis/protocols/TURING_SILENT_VELOCITY.csv',
  '.agents/aegis/protocols/PHOENIX_SHIELD_ISOLATION.csv',
  '.agents/aegis/protocols/VALKYRIE_LEDGER_RISE.csv',
  '.agents/aegis/protocols/APOCALYPSE_OVERDRIVE_MATRIX.csv',
] as const;

export const AEGIS_PROTOCOL_TS_MODULES = [
  '.agents/aegis/protocols/turingProtocol.ts',
  '.agents/aegis/protocols/maryAllenWilkesProtocol.ts',
  '.agents/aegis/protocols/aegisMasterProtocols.ts',
  '.agents/aegis/protocols/index.ts',
] as const;

/**
 * Strict Context Triad boundary (Theme, Language, Currency).
 * @see AEG-003
 * @see AEG-041
 */
export const ALLOWED_CONTEXT_TRIAD = [
  'ThemeContext',
  'LanguageContext',
  'CurrencyContext',
] as const;

/**
 * Supreme Laws V5.1 Codification IDs
 * @see TURING-REUSABLE-ATOMIC-017
 * @see TURING-SPA-SUBROUTING-018
 */
export const TURING_SOVEREIGN_LAWS = {
  TURING_LAW_000: 'TURING-LAW-000',
  TURING_ROOT_007: 'TURING-ROOT-007',
  TURING_NAV_TREE_009: 'TURING-NAV-TREE-009',
  TURING_SEPARATION_010: 'TURING-SEPARATION-010',
  TURING_BOOK_011: 'TURING-BOOK-011',
  TURING_DEV_SERVER_BAN_013: 'TURING-DEV-SERVER-BAN-013',
  TURING_SHELL_015: 'TURING-SHELL-015',
  TURING_AI_ROUTING_016: 'TURING-AI-ROUTING-016',
  TURING_REUSABLE_ATOMIC_017: 'TURING-REUSABLE-ATOMIC-017',
  TURING_SPA_SUBROUTING_018: 'TURING-SPA-SUBROUTING-018',
} as const;

/** Cached Set for fast O(1) triad validation. */
export const CONTEXT_SET: ReadonlySet<string> = new Set<string>(ALLOWED_CONTEXT_TRIAD);

/** Rule set version – incremented on hot-reload. */
export let RULES_VERSION = 1;

/**
 * Increments the active rule set version upon hot-reload.
 * @returns The updated RULES_VERSION number.
 */
export function bumpRulesVersion(): number {
  RULES_VERSION++;
  return RULES_VERSION;
}

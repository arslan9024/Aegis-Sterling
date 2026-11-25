/**
 * laws/turingLaws.law.ts — Canonical Turing Laws Index
 */

import { SUPREME_TURING_LAWS, type TuringLawDefinition } from '../.agents/aegis/protocols/turingProtocol.ts';

export { SUPREME_TURING_LAWS, type TuringLawDefinition };

export const EXTENDED_TURING_LAWS: Record<string, TuringLawDefinition> = {
  ...SUPREME_TURING_LAWS,
  'TURING-AI-ROUTING-016': {
    lawId: 'TURING-AI-ROUTING-016',
    name: 'AI Assistant Sovereign Routing & Acquisition Pipeline',
    category: 'SYSTEM',
    statement: 'Direct vanity routes (/dashboard/zoe, /dashboard/linda, /dashboard/mary) + Linda->Mary->Daisy->Henry acquisition pipeline.',
    enforcementMechanism: 'O(1) route normalization and Sanctum inter-agent bridges.',
  },
  'TURING-BHAKTI-FRACTAL-017': {
    lawId: 'TURING-BHAKTI-FRACTAL-017',
    name: 'Bhakti 1-12-108 Repeating Fractal Stop Boundary',
    category: 'GOVERNANCE',
    statement: '1 MD -> 12 Directors -> 108 Managers -> 1,296 Asst Managers (12/Mgr) -> 11,664 Supervisors (9/AM = 108/Mgr), then Manual CRUD for Teams & Employees.',
    enforcementMechanism: 'protocols/bhakti/ bidirectional capacity & rollup math.',
  },
  'TURING-CENTRAL-SECRETS-018': {
    lawId: 'TURING-CENTRAL-SECRETS-018',
    name: 'Centralized Monorepo Secrets Vault Mandate',
    category: 'COMPLIANCE',
    statement: 'All .env files, API keys, service account JSONs, and credentials MUST live exclusively in the centralized monorepo secrets/ directory (e.g. secrets/google/gmail.tab.env, secrets/google/google.tab.env) — never scattered inside individual app repos.',
    enforcementMechanism: 'Services resolve credentials from ../secrets/ with env fallback and zero hardcoded keys.',
  },
  'TURING-SUPERVISOR-CHAIN-019': {
    lawId: 'TURING-SUPERVISOR-CHAIN-019',
    name: 'Top-to-Bottom AI Supervisor Accountability & DMS/TMS Hierarchy Labeling Law',
    category: 'GOVERNANCE',
    statement: 'Every requested feature, update, or task group MUST be updated top-to-bottom from AI Zoe (COO) -> Department Director (DEPT-XX / DIR-XX) -> Division Manager (DIV-XX-Y / MGR-XX-Y) -> Assistant Manager (UNIT-XX-Y-ZZ / AMGR-XX-Y-ZZ) -> one specific AI Supervisor actor (SQD-XX-Y-ZZ-W / SUP-XX-Y-ZZ-W), updating Zoe team DMS positions and TMS labeled task collections in lockstep.',
    enforcementMechanism: 'rules/supervisorChain.rule.ts deterministic Bhakti coordinate derivation & DMS/TMS validation.',
  },
};

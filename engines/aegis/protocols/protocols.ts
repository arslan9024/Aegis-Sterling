/**
 * protocols.ts
 * Master Typed Protocol Matrix for AEGIS V5.0 Sovereign Orchestration.
 * Consolidates Prometheus, Turing, Phoenix, Valkyrie, and Apocalypse rules
 * into a single source of truth for both runtime validation and agent compliance.
 */

export interface AegisProtocolRule {
  ruleId: string;
  departmentCode: string;
  orchestrationDomain: string;
  ruleDefinition: string;
  executionTrigger: string;
  validationCriteria: string;
  verificationFile: string;
  protocolGroup: 'PROMETHEUS' | 'TURING' | 'PHOENIX' | 'VALKYRIE' | 'APOCALYPSE';
}

export const PROMETHEUS_RULES: AegisProtocolRule[] = [
  {
    ruleId: 'AEG-001',
    departmentCode: 'WC-UXA',
    orchestrationDomain: 'UI Primitives',
    ruleDefinition: 'Pin the White Caves Explorer strictly to Right Sidebar; Left Sidebar hosts System Activity strips only.',
    executionTrigger: 'Layout Render Cycle',
    validationCriteria: 'Zero duplicate explorer trees on left viewport strip.',
    verificationFile: 'src/components/dashboard/ExecutiveAIVSCodeSidebar/SidebarRightExplorerTree.tsx',
    protocolGroup: 'PROMETHEUS'
  },
  {
    ruleId: 'AEG-002',
    departmentCode: 'WC-UXA',
    orchestrationDomain: 'UI Primitives',
    ruleDefinition: 'Theme and language state must be derived from global Redux slice, never localized state.',
    executionTrigger: 'Session Initialization',
    validationCriteria: 'Theme changes broadcast globally across all micro-components.',
    verificationFile: 'src/store/slices/uiSlice.ts',
    protocolGroup: 'PROMETHEUS'
  },
  {
    ruleId: 'AEG-003',
    departmentCode: 'WC-UXA',
    orchestrationDomain: 'Context Triad',
    ruleDefinition: 'Enforce Context Triad: Theme, Language (EN/AR), and Currency (AED/USD) without exception.',
    executionTrigger: 'Application Boot',
    validationCriteria: 'Bidirectional RTL toggles dynamically when language switches to Arabic.',
    verificationFile: 'src/layouts/UnifiedWorkspaceLayout.tsx',
    protocolGroup: 'PROMETHEUS'
  }
];

export const TURING_RULES: AegisProtocolRule[] = [
  {
    ruleId: 'AEG-010',
    departmentCode: 'WC-UXA',
    orchestrationDomain: 'UX Architecture',
    ruleDefinition: 'Implement dynamic zero-runtime Tailwind CSS v4 variables to scrap client style calculations.',
    executionTrigger: 'Production Build Step',
    validationCriteria: 'Strips styled-components compilation latency completely out of browser engines.',
    verificationFile: 'package.json',
    protocolGroup: 'TURING'
  },
  {
    ruleId: 'AEG-011',
    departmentCode: 'WC-API',
    orchestrationDomain: 'API Framework',
    ruleDefinition: 'Wrap all external government handshake API endpoints within hard 1500ms timeout contracts.',
    executionTrigger: 'Network Request Dispatches',
    validationCriteria: 'Triggers immediate local failure failovers if state connections freeze.',
    verificationFile: 'src/components/dashboard/LeasingModule/workflow.ts',
    protocolGroup: 'TURING'
  },
  {
    ruleId: 'AEG-012',
    departmentCode: 'WC-API',
    orchestrationDomain: 'API Framework',
    ruleDefinition: 'Embed unique idempotent tracking keys on all payload submissions to regional tax or lease modules.',
    executionTrigger: 'DLD / Ejari Sync Phase',
    validationCriteria: 'Drops duplicate submission loops to block double-billing or multiple document uploads.',
    verificationFile: '.agents/aegis/core-loop/turingOrchestrator.ts',
    protocolGroup: 'TURING'
  },
  {
    ruleId: 'AEG-013',
    departmentCode: 'WC-DBP',
    orchestrationDomain: 'Data Pipelines',
    ruleDefinition: 'Transition transactional data parameters out of React Context trees into Redux Toolkit domain slices.',
    executionTrigger: 'State Mutation Event',
    validationCriteria: 'Centralizes shared entities data pipelines to eliminate cross-departmental re-renders.',
    verificationFile: 'src/store/slices/dealsSlice.ts',
    protocolGroup: 'TURING'
  },
  {
    ruleId: 'AEG-014',
    departmentCode: 'WC-DBP',
    orchestrationDomain: 'Data Pipelines',
    ruleDefinition: 'Optimize entity schemas by extracting flat database fields into strongly-typed relational models.',
    executionTrigger: 'Prisma Client Generation',
    validationCriteria: 'Enforces foreign-key safety contracts linking users properties leases and cheques.',
    verificationFile: 'prisma/schema.prisma',
    protocolGroup: 'TURING'
  },
  {
    ruleId: 'AEG-015',
    departmentCode: 'WC-DBP',
    orchestrationDomain: 'Data Pipelines',
    ruleDefinition: 'Isolate specific client identity fields securely to safeguard confidential contact parameters.',
    executionTrigger: 'Data Ingestion Pipeline',
    validationCriteria: 'Validates that raw landlord or tenant contact items are locked against data-leak vectors.',
    verificationFile: 'prisma/schema.prisma',
    protocolGroup: 'TURING'
  },
  {
    ruleId: 'AEG-016',
    departmentCode: 'WC-SEC',
    orchestrationDomain: 'Security Control',
    ruleDefinition: 'Establish automated pre-commit scanners to detect plaintext keys before tracking commits.',
    executionTrigger: 'Staging Git Verification',
    validationCriteria: 'Husky pre-commit hooks abort repository commit if secrets are caught.',
    verificationFile: '.husky/pre-commit',
    protocolGroup: 'TURING'
  },
  {
    ruleId: 'AEG-017',
    departmentCode: 'WC-SEC',
    orchestrationDomain: 'Security Control',
    ruleDefinition: 'Mask physical house or plot indicators on external visual elements automatically.',
    executionTrigger: 'Public Inventory Listing',
    validationCriteria: 'Preserves project and cluster names while hiding exact unit rows.',
    verificationFile: 'src/components/dashboard/LeasingModule/logic.ts',
    protocolGroup: 'TURING'
  }
];

export const ALL_AEGIS_PROTOCOLS: AegisProtocolRule[] = [
  ...PROMETHEUS_RULES,
  ...TURING_RULES
];

export function getProtocolRuleById(ruleId: string): AegisProtocolRule | undefined {
  return ALL_AEGIS_PROTOCOLS.find(r => r.ruleId === ruleId);
}

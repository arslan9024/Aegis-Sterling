#!/usr/bin/env node
/**
 * policy-loader.ts — Single Canonical AEGIS V5.1 Policy Loader & Diff Gate
 * Resolves Aegis-Sterling/.agents/orchestrator/policy.json as the sole runtime truth.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const AEGIS_ROOT = resolve(__dirname, '..', '..');
export const AGENTS_ROOT = join(AEGIS_ROOT, '.agents');
export const POLICY_PATH = join(AGENTS_ROOT, 'orchestrator', 'policy.json');
const LOGS_DIR = join(AEGIS_ROOT, 'engines', 'orchestrator', 'logs');
const BASELINE_PATH = join(LOGS_DIR, 'policy-baseline.json');
const ACK_PATH = join(LOGS_DIR, 'POLICY_DIFF_ACK');

export interface TaskClassRoute {
  modelTier: string;
  modelRecommendation: string;
  fallbackModel: string;
  maxPremiumTurnsPerTask: number;
}
export interface PolicyException {
  expiresAt?: string;
  domain?: string;
  label?: string;
  fileContains?: string;
  reason?: string;
}
export interface AegisPolicy {
  version: string;
  schemaVersion: string;
  approvalPhrase?: string;
  artifactSchemasDir?: string;
  changeLog?: Array<{ date: string; summary: string }>;
  compatibility?: { legacyPolicyVersions?: string[]; acceptLegacyLabels?: boolean };
  rollout?: { environment?: string; policyModeByEnv?: Record<string, string>; canaryPercentByEnv?: Record<string, number>; shadowPolicyEvaluation?: boolean; autoRollbackOnRegression?: boolean; regressionThresholdPct?: number };
  controlPlane?: { authoritativeFiles?: string[]; ownership?: Record<string, string>; changeControl?: { requireVersionBump?: boolean; requireChangelogEntry?: boolean; validationCommands?: string[]; forbidSilentDrift?: boolean } };
  planFirst?: { enabled?: boolean; defaultMode?: string; trivialExemptions?: string[]; requiredPlanPacketFields?: string[]; enforceBeforePremiumExecution?: boolean };
  contextBudget?: { enabled?: boolean; defaultMaxFiles?: number; defaultMaxInstructionFiles?: number; defaultMaxWaveBundles?: number; defaultMaxBusinessDocSections?: number; warnAfterTurns?: number; hardStopAfterTurns?: number; warnAfterApproxTokens?: number; hardStopAfterApproxTokens?: number; preferStructuredSummaries?: boolean; agentTierBudgetKB?: Record<string, number | string> };
  sessionManagement?: { oneObjectivePerSession?: boolean; oneWaveOrBugFamilyPerSession?: boolean; mandatoryEndOfSessionSummary?: boolean; requireCarryForwardList?: boolean; newChatTriggers?: string[] };
  historyManagement?: { enabled?: boolean; layers?: string[]; reuseLayer?: string; markStaleAsNonCanonical?: boolean; bootstrapFromMinimalPacket?: boolean };
  executionMode?: {
    default?: string;
  };
  features?: Record<string, boolean>;
  workflowGraph?: {
    enabled?: boolean;
    steps?: string[];
    stateDir?: string;
    stepPatterns?: {
      parallel?: Record<string, string[]>;
      handoff?: Record<string, string>;
      'group-review'?: {
        trigger?: string;
        minRiskScore?: number;
        reviewers?: string[];
        requiredApprovals?: number;
      };
    };
  };
  checkpoints?: {
    enabled?: boolean;
    maxCheckpoints?: number;
    checkpointDir?: string;
  };
  hardStops?: {
    stopOnSecurityScanFailure?: boolean;
    stopOnHighDiffRisk?: boolean;
    stopOnPolicyMismatch?: boolean;
    diffRiskScoreThreshold?: number;
    flakyTestDetection?: {
      enabled?: boolean;
      failOnFlaky?: boolean;
      warnThreshold?: number;
    };
  };
  verification?: {
    diffRiskWeights?: { linesChangedScale?: number; highRiskPathWeight?: number };
    tiers?: Record<string, { blockSeverities?: string[] }>;
    exceptions?: PolicyException[];
  };
  rollback?: {
    enabled?: boolean;
    maxRetriesBeforeRollback?: number;
    autoRollbackOnMaxRetries?: boolean;
    fallbackOwner?: string;
    rollbackPlanDir?: string;
  };
  observability?: {
    tracing?: {
      enabled?: boolean;
      traceDir?: string;
      retainDays?: number;
      emitOnAgentTurn?: boolean;
      emitOnHandoff?: boolean;
      emitOnHardStop?: boolean;
    };
    budgetLimits?: {
      enabled?: boolean;
      maxEstimatedTokensPerSession?: number;
      maxRuntimeSeconds?: number;
      maxRetriesPerSession?: number;
      hardCap?: boolean;
      budgetDir?: string;
    };
    telemetry?: Record<string, boolean>;
  };
  benchmark?: {
    enabled?: boolean;
    cadence?: string;
    metricsDir?: string;
    baselineFile?: string;
    metrics?: string[];
    regressionAlertThreshold?: number;
  };
  confidenceRouting?: {
    enabled?: boolean;
    autoApproveMinConfidence?: number;
    requireHumanApprovalMaxConfidence?: number;
    riskScoreLowMax?: number;
    riskScoreHighMin?: number;
    highRiskDomains?: string[];
    routingStateDir?: string;
    fallbackDecision?: string;
    fallbackChain?: string[];
    requireReviewMetadataOnUncertain?: boolean;
    canaryPercentOverride?: number | null;
  };
  modelRouting?: {
    policyMode?: string;
    planningAgents?: string;
    taskClassRouting?: Record<string, TaskClassRoute>;
    premiumUsage?: Record<string, unknown>;
  };
  deduplicationAndOptimizationEngine?: {
    enabled?: boolean;
    continuousAutopilotPillars?: Record<string, unknown>;
  };
  agentMesh?: {
    totalAgents?: number;
  };
  [key: string]: unknown;
}

function defaultRolloutEnvironment(): string {
  const env = (process.env.AEGIS_ENV || process.env.NODE_ENV || 'development').toLowerCase();
  if (env === 'production' || env === 'staging') return env;
  return 'development';
}

function normalizePolicy(rawPolicy: Record<string, unknown>): AegisPolicy {
  const policy = structuredClone(rawPolicy ?? {}) as AegisPolicy;
  policy.schemaVersion = String(policy.schemaVersion ?? '2.2.0');
  policy.version = String(policy.version ?? 'unknown');

  policy.rollout = policy.rollout ?? {};
  policy.rollout.environment = policy.rollout.environment ?? defaultRolloutEnvironment();
  policy.rollout.policyModeByEnv = policy.rollout.policyModeByEnv ?? {
    development: 'shadow',
    staging: 'canary',
    production: 'stable',
  };
  policy.rollout.canaryPercentByEnv = policy.rollout.canaryPercentByEnv ?? {
    development: 100,
    staging: 20,
    production: 5,
  };

  policy.features = policy.features ?? {};
  policy.features.killSwitchAll = policy.features.killSwitchAll ?? false;
  policy.features.graph = policy.features.graph ?? Boolean(policy.workflowGraph?.enabled ?? true);
  policy.features.checkpoints = policy.features.checkpoints ?? Boolean(policy.checkpoints?.enabled ?? true);
  policy.features.gates = policy.features.gates ?? true;
  policy.features.rollback = policy.features.rollback ?? Boolean(policy.rollback?.enabled ?? true);
  policy.features.tracing = policy.features.tracing ?? Boolean(policy.observability?.tracing?.enabled ?? true);
  policy.features.budget = policy.features.budget ?? Boolean(policy.observability?.budgetLimits?.enabled ?? true);
  policy.features.routing = policy.features.routing ?? Boolean(policy.confidenceRouting?.enabled ?? true);
  policy.features.benchmark = policy.features.benchmark ?? Boolean(policy.benchmark?.enabled ?? true);

  policy.modelRouting = policy.modelRouting ?? {};
  const defaultTaskClassRouting: Record<string, TaskClassRoute> = {
    exploration: { modelTier: 'free', modelRecommendation: 'Gemini Flash', fallbackModel: 'Llama 3.3 70B', maxPremiumTurnsPerTask: 0 },
    planning: { modelTier: 'free', modelRecommendation: 'Gemini Flash', fallbackModel: 'DeepSeek V3', maxPremiumTurnsPerTask: 0 },
    documentation: { modelTier: 'free', modelRecommendation: 'Llama 3.3 70B', fallbackModel: 'Gemini Flash', maxPremiumTurnsPerTask: 0 },
    triage: { modelTier: 'free', modelRecommendation: 'DeepSeek V3', fallbackModel: 'Gemini Flash', maxPremiumTurnsPerTask: 0 },
    research: { modelTier: 'free', modelRecommendation: 'DeepSeek V3', fallbackModel: 'Gemini Flash', maxPremiumTurnsPerTask: 0 },
    'architecture-arbitration': { modelTier: 'premium', modelRecommendation: 'Claude Sonnet', fallbackModel: 'GPT-4o', maxPremiumTurnsPerTask: 2 },
    'high-risk-implementation': { modelTier: 'premium', modelRecommendation: 'Claude Sonnet', fallbackModel: 'GPT-4o', maxPremiumTurnsPerTask: 4 },
    'security-sensitive': { modelTier: 'premium', modelRecommendation: 'Claude Sonnet', fallbackModel: 'GPT-4o', maxPremiumTurnsPerTask: 4 },
  };
  policy.modelRouting.taskClassRouting = { ...defaultTaskClassRouting, ...(policy.modelRouting.taskClassRouting ?? {}) };

  return policy;
}

export function loadPolicy(): AegisPolicy {
  return normalizePolicy(JSON.parse(readFileSync(POLICY_PATH, 'utf8')) as Record<string, unknown>);
}

export function validatePolicy(policy: AegisPolicy): string[] {
  const issues: string[] = [];
  if (!policy.version) issues.push('policy.version is required');
  if (!policy.schemaVersion) issues.push('policy.schemaVersion is required');
  if (!policy.workflowGraph?.steps || policy.workflowGraph.steps.length < 2) {
    issues.push('workflowGraph.steps must include at least 2 steps');
  }
  if (!policy.executionMode?.default) issues.push('executionMode.default is required');
  if (!policy.rollout?.environment) issues.push('rollout.environment is required');
  if (!policy.controlPlane?.authoritativeFiles?.length) issues.push('controlPlane.authoritativeFiles is required');
  if (!policy.planFirst?.requiredPlanPacketFields?.length) issues.push('planFirst.requiredPlanPacketFields is required');
  if (!policy.contextBudget?.defaultMaxFiles) issues.push('contextBudget.defaultMaxFiles is required');
  if (!policy.historyManagement?.layers?.length) issues.push('historyManagement.layers is required');
  if (!policy.modelRouting?.taskClassRouting?.planning) issues.push('modelRouting.taskClassRouting.planning is required');
  return issues;
}

function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj ?? {})) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(out, flattenObject(value as Record<string, unknown>, full));
    } else {
      out[full] = Array.isArray(value) ? JSON.stringify(value) : value;
    }
  }
  return out;
}

function policyMode(policy: AegisPolicy): string {
  const env = policy.rollout?.environment ?? defaultRolloutEnvironment();
  return policy.rollout?.policyModeByEnv?.[env] ?? 'stable';
}

export function getCanaryPercent(policy: AegisPolicy): number {
  if (typeof policy.confidenceRouting?.canaryPercentOverride === 'number') {
    return Math.max(0, Math.min(100, policy.confidenceRouting.canaryPercentOverride));
  }
  const env = policy.rollout?.environment ?? defaultRolloutEnvironment();
  const pct = policy.rollout?.canaryPercentByEnv?.[env];
  return typeof pct === 'number' && Number.isFinite(pct) ? Math.max(0, Math.min(100, pct)) : 100;
}

export function isFeatureEnabled(policy: AegisPolicy, feature: string): boolean {
  if (policy.features?.killSwitchAll) return false;
  const mode = policyMode(policy);
  if (feature === 'routing' && mode === 'stable' && policy.rollout?.shadowPolicyEvaluation) return true;
  return policy.features?.[feature] !== false;
}

export function getContextBudget(policy: AegisPolicy, agentTier: string = 'free'): { limitKB: number; enabled: boolean } {
  const budgetEnabled = policy.contextBudget?.enabled ?? true;
  const tierBudgets = policy.contextBudget?.agentTierBudgetKB ?? {};
  const tier = (agentTier ?? 'free').toLowerCase();
  const defaults: Record<string, number> = { free: 32, premium: 128 };
  const raw = tierBudgets[tier];
  const limitKB = typeof raw === 'number' ? raw : (defaults[tier] ?? 32);
  return { limitKB, enabled: budgetEnabled };
}

export function createTraceContext(policy: AegisPolicy, extra: Record<string, unknown> = {}) {
  const traceId = process.env.AEGIS_TRACE_ID || randomUUID();
  return {
    traceId,
    sessionId: process.env.AEGIS_SESSION_ID ?? `aegis-${Date.now()}`,
    policyVersion: policy.version,
    policySchemaVersion: policy.schemaVersion,
    environment: policy.rollout?.environment ?? defaultRolloutEnvironment(),
    ...extra,
  };
}

export function ensurePolicyBaseline(policy: AegisPolicy): AegisPolicy {
  if (existsSync(BASELINE_PATH)) {
    return JSON.parse(readFileSync(BASELINE_PATH, 'utf8')) as AegisPolicy;
  }
  mkdirSync(LOGS_DIR, { recursive: true });
  writeFileSync(BASELINE_PATH, JSON.stringify(policy, null, 2), 'utf8');
  return policy;
}

export function runPolicyDiffGate(policy: AegisPolicy) {
  const baseline = ensurePolicyBaseline(policy);
  const currentFlat = flattenObject(policy);
  const baselineFlat = flattenObject(baseline);
  const changed: Array<{ key: string; previous: unknown; current: unknown }> = [];

  for (const [key, value] of Object.entries(currentFlat)) {
    if (baselineFlat[key] !== value) {
      changed.push({ key, previous: baselineFlat[key], current: value });
    }
  }

  const criticalPrefixes = ['approvalPhrase', 'workflowGraph.steps', 'executionMode.default', 'hardStops.diffRiskScoreThreshold', 'modelRouting.planningAgents', 'modelRouting.taskClassRouting', 'planFirst', 'contextBudget'];
  const criticalDiffs = changed.filter(d => criticalPrefixes.some(prefix => d.key.startsWith(prefix)));
  const requiresAck = criticalDiffs.length > 0;
  const hasAck = existsSync(ACK_PATH);
  const stopOnPolicyMismatch = policy.hardStops?.stopOnPolicyMismatch ?? true;
  const passed = !requiresAck || hasAck || !stopOnPolicyMismatch;
  return { passed, changed, criticalDiffs, requiresAck, hasAck, ackPath: ACK_PATH, baselinePath: BASELINE_PATH, mode: policyMode(policy) };
}

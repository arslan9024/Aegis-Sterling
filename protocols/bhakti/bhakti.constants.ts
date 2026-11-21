/**
 * bhakti.constants.ts — Permanent Constants for the Bhakti 1-12-108 Repeating Fractal Protocol
 */

import type { BhaktiTierCode, BhaktiTierSpec } from './bhakti.types.ts';

export const BHAKTI_PROTOCOL_ID = 'BHAKTI_1_12_108_REPEATING_FRACTAL_V2';

export const BHAKTI_PROTOCOL_FORMULA =
  '1 MD -> 12 Directors -> 108 Managers (9/Director) -> 1,296 Assistant Managers (12/Manager) -> 11,664 Supervisors (9/Asst Mgr = 108/Manager) -> Manual CRUD Teams, Team Leaders & Employees';

export const BHAKTI_TIER_ORDER: readonly BhaktiTierCode[] = [
  'MD',
  'DIRECTOR',
  'MANAGER',
  'ASSISTANT_MANAGER',
  'SUPERVISOR',
  'TEAM_LEADER',
  'EMPLOYEE',
] as const;

export const BHAKTI_TIER_SPECS: Record<BhaktiTierCode, BhaktiTierSpec> = {
  MD: {
    code: 'MD',
    title: 'Managing Director (Sovereign Apex)',
    level: 0,
    parentTier: null,
    branchingFactorFromParent: 1,
    fixedOrgCapacity: 1,
    mode: 'FIXED_SINGLETON',
    minPromotionXp: 0,
  },
  DIRECTOR: {
    code: 'DIRECTOR',
    title: 'Corporate Department Director',
    level: 1,
    parentTier: 'MD',
    branchingFactorFromParent: 12,
    fixedOrgCapacity: 12,
    mode: 'FIXED_FRACTAL',
    minPromotionXp: 18000,
  },
  MANAGER: {
    code: 'MANAGER',
    title: 'Division Manager',
    level: 2,
    parentTier: 'DIRECTOR',
    branchingFactorFromParent: 9,
    fixedOrgCapacity: 108,
    mode: 'FIXED_FRACTAL',
    minPromotionXp: 10000,
  },
  ASSISTANT_MANAGER: {
    code: 'ASSISTANT_MANAGER',
    title: 'Assistant Manager',
    level: 3,
    parentTier: 'MANAGER',
    branchingFactorFromParent: 12,
    fixedOrgCapacity: 1296,
    mode: 'FIXED_FRACTAL',
    minPromotionXp: 6000,
  },
  SUPERVISOR: {
    code: 'SUPERVISOR',
    title: 'Unit Supervisor (Fixed Fractal Stop Boundary)',
    level: 4,
    parentTier: 'ASSISTANT_MANAGER',
    branchingFactorFromParent: 9,
    fixedOrgCapacity: 11664,
    mode: 'FIXED_FRACTAL_STOP',
    minPromotionXp: 3000,
  },
  TEAM_LEADER: {
    code: 'TEAM_LEADER',
    title: 'Manual Team Leader',
    level: 5,
    parentTier: 'SUPERVISOR',
    branchingFactorFromParent: null,
    fixedOrgCapacity: null,
    mode: 'MANUAL_CRUD',
    minPromotionXp: 1500,
  },
  EMPLOYEE: {
    code: 'EMPLOYEE',
    title: 'Manual Team Employee / Broker',
    level: 6,
    parentTier: 'TEAM_LEADER',
    branchingFactorFromParent: null,
    fixedOrgCapacity: null,
    mode: 'MANUAL_CRUD',
    minPromotionXp: 0,
  },
};

export const BHAKTI_PERFORMANCE_WEIGHTS = {
  sla: 0.35,
  completion: 0.3,
  compliance: 0.2,
  meritXp: 0.15,
} as const;

export const BHAKTI_LEADER_ROLLUP_WEIGHTS = {
  ownWeight: 0.3,
  subtreeWeight: 0.7,
} as const;

export const BHAKTI_PROMOTION_THRESHOLDS = {
  minEffectiveScore: 85,
  minConsecutiveCycles: 2,
} as const;

export const BHAKTI_DEMOTION_THRESHOLDS = {
  maxEffectiveScore: 45,
  minConsecutiveCycles: 2,
} as const;

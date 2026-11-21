/**
 * bhakti.types.ts — Strictly typed Bhakti 1-12-108 Repeating Fractal Organization Types
 */

export type BhaktiTierCode =
  | 'MD'
  | 'DIRECTOR'
  | 'MANAGER'
  | 'ASSISTANT_MANAGER'
  | 'SUPERVISOR'
  | 'TEAM_LEADER'
  | 'EMPLOYEE';

export type BhaktiTierMode =
  | 'FIXED_SINGLETON'
  | 'FIXED_FRACTAL'
  | 'FIXED_FRACTAL_STOP'
  | 'MANUAL_CRUD';

export type BhaktiPerformanceBand =
  | 'SOVEREIGN_ELITE'
  | 'HIGH_PERFORMER'
  | 'ON_TRACK'
  | 'WATCHLIST'
  | 'DEMOTION_RISK';

export interface BhaktiTierSpec {
  code: BhaktiTierCode;
  title: string;
  level: number;
  parentTier: BhaktiTierCode | null;
  branchingFactorFromParent: number | null;
  fixedOrgCapacity: number | null;
  mode: BhaktiTierMode;
  minPromotionXp: number;
}

export interface BhaktiSeatCoords {
  directorSlot?: number;
  managerSlot?: number;
  assistantManagerSlot?: number;
  supervisorSlot?: number;
  teamCode?: string;
  employeeCode?: string;
}

export interface EmployeePerformanceInput {
  slaOnTimeRate: number;
  taskCompletionRate: number;
  complianceScore: number;
  meritXp: number;
  targetXp?: number;
}

export interface BhaktiOrgNode {
  id: string;
  fullName: string;
  tier: BhaktiTierCode;
  parentId: string | null;
  seatCode: string;
  performance: EmployeePerformanceInput;
  consecutiveHighCycles?: number;
  consecutiveLowCycles?: number;
  criticalComplianceBreach?: boolean;
}

export interface BhaktiRollupNodeMetrics {
  nodeId: string;
  tier: BhaktiTierCode;
  ownScore: number;
  childrenAvgScore: number | null;
  effectiveScore: number;
  directReportCount: number;
  expectedDirectCapacity: number | null;
  spanUtilizationPct: number | null;
  totalSubtreeHeadcount: number;
  totalSubtreeXp: number;
  band: BhaktiPerformanceBand;
}

export interface BhaktiRankRecord {
  nodeId: string;
  fullName: string;
  tier: BhaktiTierCode;
  seatCode: string;
  effectiveScore: number;
  tierRank: number;
  tierTotal: number;
  percentile: number;
  peerRank: number;
  peerTotal: number;
}

export interface BhaktiPromotionDecision {
  nodeId: string;
  currentTier: BhaktiTierCode;
  targetTier: BhaktiTierCode | null;
  eligible: boolean;
  action: 'PROMOTE' | 'WAITLISTED_NO_VACANCY' | 'INELIGIBLE' | 'AT_APEX';
  reasons: string[];
}

export interface BhaktiDemotionDecision {
  nodeId: string;
  currentTier: BhaktiTierCode;
  targetTier: BhaktiTierCode | null;
  action: 'RETAIN' | 'DEMOTE' | 'PIP_REVIEW' | 'PROTECTED_APEX';
  reasons: string[];
}

export interface ManualTeamRecord {
  teamCode: string;
  teamName: string;
  supervisorSeatCode: string;
  teamLeaderId: string | null;
  employeeIds: string[];
  maxMembers: number | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * registry/supervisorMissionRegistry.ts — TURING-SUPERVISOR-CHAIN-019 Mission Registry
 * Registers and validates accountable single-actor AI Supervisor chains under AI Zoe (COO)
 * for active White Caves missions, synchronized in lockstep with DMS & TMS across all repos.
 * Single-purpose module (< 350 lines, AEG-042).
 */

import {
  buildSupervisorAuthorityChain,
  validateTaskSupervisorAssignment,
  type TaskSupervisorAuthorityLabel,
} from '../rules/supervisorChain.rule.ts';

export interface SovereignMissionSupervisorRecord {
  missionId: string;
  track: 'TRACK_A' | 'TRACK_B';
  missionTitle: string;
  reposInScope: readonly string[];
  authorityChain: TaskSupervisorAuthorityLabel;
  dmsPositionCode: string;
  tmsTaskCodes: readonly string[];
  registeredAt: string;
}

export const TRACK_A_LEASING_PORTALS_CHAIN: TaskSupervisorAuthorityLabel =
  buildSupervisorAuthorityChain(
    {
      deptSlot: 5,
      managerSlot: 2,
      assistantManagerSlot: 1,
      supervisorSlot: 1,
    },
    'AI Noor (Leasing Portals & 12-Stage Deal Cockpit Supervisor)',
    'TMS-COL-TRACK-A-LEASING-PORTALS',
    { dmsSynced: true, tmsSynced: true }
  );

export const TRACK_B_FRONTEND_DECOMPOSITION_CHAIN: TaskSupervisorAuthorityLabel =
  buildSupervisorAuthorityChain(
    {
      deptSlot: 12,
      managerSlot: 1,
      assistantManagerSlot: 1,
      supervisorSlot: 1,
    },
    'AI Mary Wilkes (Frontend Wave 2 Architecture Decomposition Supervisor)',
    'TMS-COL-TRACK-B-ARCH-DECOMPOSITION',
    { dmsSynced: true, tmsSynced: true }
  );

export const SOVEREIGN_MISSION_SUPERVISOR_CHAINS: readonly SovereignMissionSupervisorRecord[] = [
  {
    missionId: 'MISSION-2026-11-TRACK-A',
    track: 'TRACK_A',
    missionTitle: 'Auth Gateway & Role-Based Portals Overhaul (MD / Landlord / Tenant) + 12-Stage Deal Cockpit',
    reposInScope: ['Aegis-Sterling', 'White-Caves-Server', 'White-Caves-Frontend', 'White-Caves-Web'],
    authorityChain: TRACK_A_LEASING_PORTALS_CHAIN,
    dmsPositionCode: 'OPEN-DEPT05-SUP-PORTALS-01',
    tmsTaskCodes: ['TSK-PORTAL-01', 'TMS-LEASE-07'],
    registeredAt: '2026-11-25T16:30:00Z',
  },
  {
    missionId: 'MISSION-2026-11-TRACK-B',
    track: 'TRACK_B',
    missionTitle: 'Wave 2 Atomic Decomposition of Oversized Frontend Files (AEG-042 < 350 Lines)',
    reposInScope: ['Aegis-Sterling', 'White-Caves-Server', 'White-Caves-Frontend', 'White-Caves-Web'],
    authorityChain: TRACK_B_FRONTEND_DECOMPOSITION_CHAIN,
    dmsPositionCode: 'OPEN-DEPT12-SUP-ARCH-01',
    tmsTaskCodes: ['TSK-ARCH-W2', 'TMS-ARCH-W2'],
    registeredAt: '2026-11-25T16:30:00Z',
  },
] as const;

export function assertAllMissionSupervisorChainsValid(): {
  valid: boolean;
  checked: number;
  errors: string[];
} {
  const errors: string[] = [];
  for (const record of SOVEREIGN_MISSION_SUPERVISOR_CHAINS) {
    const result = validateTaskSupervisorAssignment(record.authorityChain);
    if (!result.valid) {
      errors.push(`${record.missionId}: ${result.errors.join('; ')}`);
    }
  }
  return {
    valid: errors.length === 0,
    checked: SOVEREIGN_MISSION_SUPERVISOR_CHAINS.length,
    errors,
  };
}

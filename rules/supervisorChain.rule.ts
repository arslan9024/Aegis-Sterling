/**
 * rules/supervisorChain.rule.ts — TURING-SUPERVISOR-CHAIN-019
 * Top-to-Bottom AI Supervisor Accountability, Authority Hierarchy Labeling & DMS/TMS Lockstep Rule.
 * Single-purpose module (< 350 lines, AEG-042).
 *
 * Enforces that every requested task or task group is owned by exactly one specific AI Supervisor
 * within AI Zoe (COO)'s corporate hierarchy, carrying complete auto-derived Bhakti authority labels
 * from Managing Director -> AI Zoe (COO) -> Director -> Manager -> Assistant Manager -> Supervisor.
 */

export interface BhaktiSupervisorCoordinates {
  deptSlot: number; // 1..12
  managerSlot: number; // 1..9
  assistantManagerSlot: number; // 1..12
  supervisorSlot: number; // 1..9
}

export interface TaskSupervisorAuthorityLabel {
  executiveSponsor: 'MD-01 (Arslan Malik)';
  executivePartner: 'AI Zoe (COO)';
  departmentCode: string; // DEPT-01..DEPT-12
  directorId: string; // DIR-01..DIR-12
  divisionCode: string; // DIV-XX-Y
  managerId: string; // MGR-XX-Y
  unitCode: string; // UNIT-XX-Y-ZZ
  assistantManagerId: string; // AMGR-XX-Y-ZZ
  squadCode: string; // SQD-XX-Y-ZZ-W
  supervisorId: string; // SUP-XX-Y-ZZ-W (single accountable TMS actor)
  supervisorName: string;
  taskCollectionLabel: string;
  dmsSynced: boolean;
  tmsSynced: boolean;
}

export interface SupervisorChainValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Deterministically derives the full top-to-bottom Bhakti authority label chain
 * from a single Supervisor's 4D coordinates (dept, manager, assistantManager, supervisor).
 */
export function buildSupervisorAuthorityChain(
  coords: BhaktiSupervisorCoordinates,
  supervisorName: string,
  taskCollectionLabel: string,
  syncFlags: { dmsSynced?: boolean; tmsSynced?: boolean } = {}
): TaskSupervisorAuthorityLabel {
  const { deptSlot, managerSlot, assistantManagerSlot, supervisorSlot } = coords;
  if (deptSlot < 1 || deptSlot > 12) throw new RangeError(`deptSlot must be 1..12, got ${deptSlot}`);
  if (managerSlot < 1 || managerSlot > 9) throw new RangeError(`managerSlot must be 1..9, got ${managerSlot}`);
  if (assistantManagerSlot < 1 || assistantManagerSlot > 12) {
    throw new RangeError(`assistantManagerSlot must be 1..12, got ${assistantManagerSlot}`);
  }
  if (supervisorSlot < 1 || supervisorSlot > 9) {
    throw new RangeError(`supervisorSlot must be 1..9, got ${supervisorSlot}`);
  }

  const dd = String(deptSlot).padStart(2, '0');
  const aa = String(assistantManagerSlot).padStart(2, '0');

  return {
    executiveSponsor: 'MD-01 (Arslan Malik)',
    executivePartner: 'AI Zoe (COO)',
    departmentCode: `DEPT-${dd}`,
    directorId: `DIR-${dd}`,
    divisionCode: `DIV-${dd}-${managerSlot}`,
    managerId: `MGR-${dd}-${managerSlot}`,
    unitCode: `UNIT-${dd}-${managerSlot}-${aa}`,
    assistantManagerId: `AMGR-${dd}-${managerSlot}-${aa}`,
    squadCode: `SQD-${dd}-${managerSlot}-${aa}-${supervisorSlot}`,
    supervisorId: `SUP-${dd}-${managerSlot}-${aa}-${supervisorSlot}`,
    supervisorName: supervisorName.trim(),
    taskCollectionLabel: taskCollectionLabel.trim(),
    dmsSynced: Boolean(syncFlags.dmsSynced),
    tmsSynced: Boolean(syncFlags.tmsSynced),
  };
}

/**
 * Validates that a TMS task or task group satisfies TURING-SUPERVISOR-CHAIN-019:
 * - Complete top-to-bottom authority codes (DEPT -> DIV -> UNIT -> SQD)
 * - Exactly one specific Supervisor actor under AI Zoe (COO)'s chain
 * - DMS and TMS lockstep synchronization flags verified
 */
export function validateTaskSupervisorAssignment(
  label: Partial<TaskSupervisorAuthorityLabel> | null | undefined
): SupervisorChainValidationResult {
  const errors: string[] = [];
  if (!label) {
    return { valid: false, errors: ['Missing TaskSupervisorAuthorityLabel (TURING-SUPERVISOR-CHAIN-019).'] };
  }
  if (label.executivePartner !== 'AI Zoe (COO)') {
    errors.push('executivePartner must be "AI Zoe (COO)".');
  }
  if (!label.departmentCode || !/^DEPT-(0[1-9]|1[0-2])$/.test(label.departmentCode)) {
    errors.push(`Invalid departmentCode: "${label.departmentCode ?? ''}". Expected DEPT-01..DEPT-12.`);
  }
  if (!label.directorId || !/^DIR-(0[1-9]|1[0-2])$/.test(label.directorId)) {
    errors.push(`Invalid directorId: "${label.directorId ?? ''}". Expected DIR-01..DIR-12.`);
  }
  if (!label.managerId || !/^MGR-(0[1-9]|1[0-2])-[1-9]$/.test(label.managerId)) {
    errors.push(`Invalid managerId: "${label.managerId ?? ''}". Expected MGR-XX-Y.`);
  }
  if (!label.assistantManagerId || !/^AMGR-(0[1-9]|1[0-2])-[1-9]-(0[1-9]|1[0-2])$/.test(label.assistantManagerId)) {
    errors.push(`Invalid assistantManagerId: "${label.assistantManagerId ?? ''}". Expected AMGR-XX-Y-ZZ.`);
  }
  if (!label.supervisorId || !/^SUP-(0[1-9]|1[0-2])-[1-9]-(0[1-9]|1[0-2])-[1-9]$/.test(label.supervisorId)) {
    errors.push(`Invalid supervisorId: "${label.supervisorId ?? ''}". Expected SUP-XX-Y-ZZ-W.`);
  }
  if (!label.squadCode || !/^SQD-(0[1-9]|1[0-2])-[1-9]-(0[1-9]|1[0-2])-[1-9]$/.test(label.squadCode)) {
    errors.push(`Invalid squadCode: "${label.squadCode ?? ''}". Expected SQD-XX-Y-ZZ-W.`);
  }
  if (!label.supervisorName || label.supervisorName.trim().length < 2) {
    errors.push('supervisorName must identify one specific AI Supervisor actor.');
  }
  if (!label.taskCollectionLabel || label.taskCollectionLabel.trim().length < 3) {
    errors.push('taskCollectionLabel is required for TMS labeled task collections.');
  }
  if (!label.dmsSynced || !label.tmsSynced) {
    errors.push('Both dmsSynced and tmsSynced must be true (DMS Zoe team & TMS task lockstep required).');
  }

  return { valid: errors.length === 0, errors };
}

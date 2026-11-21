/**
 * bhakti.manualTeams.ts — Manual CRUD for Teams, Team Leaders & Employees Under Supervisors
 */

import { parseBhaktiSeatCode } from './bhakti.topDown.ts';
import type { ManualTeamRecord } from './bhakti.types.ts';

export type ManualTeamStore = Map<string, ManualTeamRecord>;

export function createManualTeamStore(initial: readonly ManualTeamRecord[] = []): ManualTeamStore {
  const store: ManualTeamStore = new Map();
  for (const t of initial) store.set(t.teamCode, { ...t, employeeIds: [...t.employeeIds] });
  return store;
}

export function createManualTeam(
  store: ManualTeamStore,
  input: { supervisorSeatCode: string; teamCode: string; teamName: string; maxMembers?: number | null }
): ManualTeamRecord {
  const parsed = parseBhaktiSeatCode(input.supervisorSeatCode);
  if (parsed.tier !== 'SUPERVISOR') {
    throw new Error(`Teams may only be created under a SUPERVISOR seat; got ${parsed.tier}`);
  }
  if (store.has(input.teamCode)) {
    throw new Error(`Manual team '${input.teamCode}' already exists.`);
  }
  const now = new Date().toISOString();
  const record: ManualTeamRecord = {
    teamCode: input.teamCode,
    teamName: input.teamName,
    supervisorSeatCode: input.supervisorSeatCode,
    teamLeaderId: null,
    employeeIds: [],
    maxMembers: input.maxMembers ?? null,
    createdAt: now,
    updatedAt: now,
  };
  store.set(record.teamCode, record);
  return record;
}

export function updateManualTeam(
  store: ManualTeamStore,
  teamCode: string,
  patch: Partial<Pick<ManualTeamRecord, 'teamName' | 'maxMembers'>>
): ManualTeamRecord {
  const existing = store.get(teamCode);
  if (!existing) throw new Error(`Team '${teamCode}' not found.`);
  const updated: ManualTeamRecord = {
    ...existing,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  store.set(teamCode, updated);
  return updated;
}

export function deleteManualTeam(store: ManualTeamStore, teamCode: string): boolean {
  return store.delete(teamCode);
}

export function assignTeamLeader(store: ManualTeamStore, teamCode: string, leaderId: string): ManualTeamRecord {
  const existing = store.get(teamCode);
  if (!existing) throw new Error(`Team '${teamCode}' not found.`);
  const updated: ManualTeamRecord = { ...existing, teamLeaderId: leaderId, updatedAt: new Date().toISOString() };
  store.set(teamCode, updated);
  return updated;
}

export function addEmployeeToTeam(store: ManualTeamStore, teamCode: string, employeeId: string): ManualTeamRecord {
  const existing = store.get(teamCode);
  if (!existing) throw new Error(`Team '${teamCode}' not found.`);
  if (existing.employeeIds.includes(employeeId)) return existing;
  if (typeof existing.maxMembers === 'number' && existing.employeeIds.length >= existing.maxMembers) {
    throw new Error(`Team '${teamCode}' has reached its manual quota (${existing.maxMembers}).`);
  }
  const updated: ManualTeamRecord = {
    ...existing,
    employeeIds: [...existing.employeeIds, employeeId],
    updatedAt: new Date().toISOString(),
  };
  store.set(teamCode, updated);
  return updated;
}

export function removeEmployeeFromTeam(store: ManualTeamStore, teamCode: string, employeeId: string): ManualTeamRecord {
  const existing = store.get(teamCode);
  if (!existing) throw new Error(`Team '${teamCode}' not found.`);
  const updated: ManualTeamRecord = {
    ...existing,
    employeeIds: existing.employeeIds.filter(id => id !== employeeId),
    updatedAt: new Date().toISOString(),
  };
  store.set(teamCode, updated);
  return updated;
}

export function listTeamsBySupervisor(store: ManualTeamStore, supervisorSeatCode: string): ManualTeamRecord[] {
  return [...store.values()].filter(t => t.supervisorSeatCode === supervisorSeatCode);
}

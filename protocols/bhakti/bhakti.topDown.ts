/**
 * bhakti.topDown.ts — Top-to-Bottom Bhakti 1-12-108 Fractal Capacity, Seat Code & Slot Guards
 */
import { BHAKTI_PROTOCOL_FORMULA, BHAKTI_PROTOCOL_ID, BHAKTI_TIER_ORDER, BHAKTI_TIER_SPECS } from "./bhakti.constants.ts";
import type { BhaktiSeatCoords, BhaktiTierCode, BhaktiTierMode, BhaktiTierSpec } from "./bhakti.types.ts";

export function computeTierCapacity(tier: BhaktiTierCode): number | "MANUAL_CRUD" {
  const spec = BHAKTI_TIER_SPECS[tier];
  if (spec.mode === "MANUAL_CRUD") return "MANUAL_CRUD";
  let capacity = 1;
  let current: BhaktiTierCode | null = tier;
  while (current) {
    const s: BhaktiTierSpec = BHAKTI_TIER_SPECS[current];
    if (s.branchingFactorFromParent === null) return "MANUAL_CRUD";
    capacity *= s.branchingFactorFromParent;
    current = s.parentTier;
  }
  return capacity;
}

export function computeFixedOrgMatrix() {
  const tiers = BHAKTI_TIER_ORDER.map(code => {
    const spec = BHAKTI_TIER_SPECS[code];
    return { code, title: spec.title, level: spec.level, mode: spec.mode, branchingFactorFromParent: spec.branchingFactorFromParent, capacity: computeTierCapacity(code) };
  });
  const fixedSeatsTotal = tiers.reduce((sum, t) => (typeof t.capacity === "number" ? sum + t.capacity : sum), 0);
  const asstPerMgr = BHAKTI_TIER_SPECS.ASSISTANT_MANAGER.branchingFactorFromParent ?? 12;
  const supPerAsst = BHAKTI_TIER_SPECS.SUPERVISOR.branchingFactorFromParent ?? 9;
  return {
    protocolId: BHAKTI_PROTOCOL_ID,
    formula: BHAKTI_PROTOCOL_FORMULA,
    tiers,
    fixedSeatsTotal,
    perManagerSubtree: { manager: 1, assistantManagers: asstPerMgr, supervisorsPerAssistantManager: supPerAsst, supervisorsPerManager: asstPerMgr * supPerAsst, teamsMode: "MANUAL_CRUD" as const, employeesMode: "MANUAL_CRUD" as const },
  };
}

function pad2(n: number): string { return String(n).padStart(2, "0"); }
function assertRange(val: number, min: number, max: number, label: string): void {
  if (!Number.isInteger(val) || val < min || val > max) throw new Error(`Invalid Bhakti slot for ${label}: expected ${min}..${max}, got ${val}`);
}

export function formatBhaktiSeatCode(coords: BhaktiSeatCoords): string {
  const parts = ["MD-01"];
  if (coords.directorSlot !== undefined) { assertRange(coords.directorSlot, 1, 12, "directorSlot"); parts.push(`DIR-${pad2(coords.directorSlot)}`); }
  if (coords.managerSlot !== undefined) { if (coords.directorSlot === undefined) throw new Error("directorSlot is required before managerSlot"); assertRange(coords.managerSlot, 1, 9, "managerSlot"); parts.push(`MGR-${pad2(coords.managerSlot)}`); }
  if (coords.assistantManagerSlot !== undefined) { if (coords.managerSlot === undefined) throw new Error("managerSlot is required before assistantManagerSlot"); assertRange(coords.assistantManagerSlot, 1, 12, "assistantManagerSlot"); parts.push(`AM-${pad2(coords.assistantManagerSlot)}`); }
  if (coords.supervisorSlot !== undefined) { if (coords.assistantManagerSlot === undefined) throw new Error("assistantManagerSlot is required before supervisorSlot"); assertRange(coords.supervisorSlot, 1, 9, "supervisorSlot"); parts.push(`SUP-${pad2(coords.supervisorSlot)}`); }
  if (coords.teamCode) { if (coords.supervisorSlot === undefined) throw new Error("supervisorSlot is required before teamCode"); parts.push(`TEAM-${coords.teamCode}`); }
  if (coords.employeeCode) { if (!coords.teamCode) throw new Error("teamCode is required before employeeCode"); parts.push(`EMP-${coords.employeeCode}`); }
  return parts.join(".");
}

export function parseBhaktiSeatCode(seatCode: string): { tier: BhaktiTierCode; coords: BhaktiSeatCoords } {
  const segments = seatCode.trim().split(".");
  if (segments[0] !== "MD-01") throw new Error(`Seat code must start with MD-01: ${seatCode}`);
  const coords: BhaktiSeatCoords = {};
  let tier: BhaktiTierCode = "MD";
  for (const seg of segments.slice(1)) {
    const dir = seg.match(/^DIR-(\d{2})$/);
    if (dir) { coords.directorSlot = Number(dir[1]); assertRange(coords.directorSlot, 1, 12, "DIR"); tier = "DIRECTOR"; continue; }
    const mgr = seg.match(/^MGR-(\d{2})$/);
    if (mgr) { coords.managerSlot = Number(mgr[1]); assertRange(coords.managerSlot, 1, 9, "MGR"); tier = "MANAGER"; continue; }
    const am = seg.match(/^AM-(\d{2})$/);
    if (am) { coords.assistantManagerSlot = Number(am[1]); assertRange(coords.assistantManagerSlot, 1, 12, "AM"); tier = "ASSISTANT_MANAGER"; continue; }
    const sup = seg.match(/^SUP-(\d{2})$/);
    if (sup) { coords.supervisorSlot = Number(sup[1]); assertRange(coords.supervisorSlot, 1, 9, "SUP"); tier = "SUPERVISOR"; continue; }
    const team = seg.match(/^TEAM-([A-Za-z0-9_-]+)$/);
    if (team) { coords.teamCode = team[1]; tier = "TEAM_LEADER"; continue; }
    const emp = seg.match(/^EMP-([A-Za-z0-9_-]+)$/);
    if (emp) { coords.employeeCode = emp[1]; tier = "EMPLOYEE"; continue; }
    throw new Error(`Unrecognized Bhakti seat segment "${seg}" in "${seatCode}"`);
  }
  return { tier, coords };
}

export function checkTopDownSlotAvailability(
  parentTier: BhaktiTierCode,
  currentDirectCount: number,
  manualQuota?: number | null
): { allowed: boolean; childTier: BhaktiTierCode | null; capacity: number | "UNLIMITED"; remaining: number | "UNLIMITED"; mode: BhaktiTierMode | "LEAF"; reason: string } {
  const parentLevel = BHAKTI_TIER_SPECS[parentTier].level;
  const childCode = BHAKTI_TIER_ORDER[parentLevel + 1] ?? null;
  if (!childCode) return { allowed: false, childTier: null, capacity: 0, remaining: 0, mode: "LEAF", reason: `${parentTier} is a leaf tier.` };
  const childSpec = BHAKTI_TIER_SPECS[childCode];
  if (childSpec.mode === "MANUAL_CRUD") {
    if (typeof manualQuota === "number" && manualQuota >= 0) {
      const remaining = Math.max(0, manualQuota - currentDirectCount);
      return { allowed: currentDirectCount < manualQuota, childTier: childCode, capacity: manualQuota, remaining, mode: "MANUAL_CRUD", reason: currentDirectCount < manualQuota ? "Manual CRUD quota available." : `Manual quota (${manualQuota}) reached.` };
    }
    return { allowed: true, childTier: childCode, capacity: "UNLIMITED", remaining: "UNLIMITED", mode: "MANUAL_CRUD", reason: `${childCode} uses unlimited manual CRUD under ${parentTier}.` };
  }
  const maxSlots = childSpec.branchingFactorFromParent ?? 0;
  const remaining = Math.max(0, maxSlots - currentDirectCount);
  const allowed = currentDirectCount < maxSlots;
  return { allowed, childTier: childCode, capacity: maxSlots, remaining, mode: childSpec.mode, reason: allowed ? `${remaining}/${maxSlots} ${childCode} slots open.` : `All ${maxSlots} ${childCode} slots are occupied.` };
}

/**
 * rules/dmsErmsTms.rule.ts — TURING-SEPARATION-010 Strict DMS / ERMS / TMS Boundary Rule
 */
export const DMS_ERMS_TMS_LAYERS = {
  DMS: "Departments & Organizational Hierarchy",
  ERMS: "Entities (Actors & Objects — zero task steps)",
  TMS: "Tasks & Actions (Verbs connecting Actors within Departments)",
} as const;

export type DomainLayer = keyof typeof DMS_ERMS_TMS_LAYERS;

export function validateDomainBoundary(layer: DomainLayer, hasTaskMutation: boolean): { valid: boolean; reason?: string } {
  if ((layer === "DMS" || layer === "ERMS") && hasTaskMutation) {
    return { valid: false, reason: `${layer} must not contain task mutations; move actions into TMS.` };
  }
  return { valid: true };
}

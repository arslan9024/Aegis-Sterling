/**
 * rules/uaeCompliance.rule.ts — UAE Statutory DLD, Ejari, FTA VAT & Corporate Tax Rules
 */
export const UAE_STATUTORY_CONSTANTS = {
  vatResidentialPct: 0,
  vatCommercialPct: 5,
  corporateTaxPct: 9,
  govApiTimeoutMs: 1500,
  form12EvictionMonths: 12,
  standardPdcCounts: [1, 2, 4, 6] as const,
} as const;

export function validateUaeDealCompliance(input: { propertyClass: "residential" | "commercial"; vatRatePct: number; chequeCount: number }): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  const expectedVat = input.propertyClass === "commercial" ? UAE_STATUTORY_CONSTANTS.vatCommercialPct : UAE_STATUTORY_CONSTANTS.vatResidentialPct;
  if (input.vatRatePct !== expectedVat) violations.push(`VAT mismatch for ${input.propertyClass}: expected ${expectedVat}%, got ${input.vatRatePct}%.`);
  if (!(UAE_STATUTORY_CONSTANTS.standardPdcCounts as readonly number[]).includes(input.chequeCount)) violations.push(`Non-standard PDC count: ${input.chequeCount}.`);
  return { valid: violations.length === 0, violations };
}

/**
 * bhakti.promotions.ts — Promotion & Demotion Evaluator Respecting Bhakti 1-12-108 Slot Caps
 */
import { BHAKTI_DEMOTION_THRESHOLDS, BHAKTI_PROMOTION_THRESHOLDS, BHAKTI_TIER_ORDER, BHAKTI_TIER_SPECS } from "./bhakti.constants.ts";
import { checkTopDownSlotAvailability } from "./bhakti.topDown.ts";
import type { BhaktiDemotionDecision, BhaktiOrgNode, BhaktiPromotionDecision, BhaktiRollupNodeMetrics, BhaktiTierCode } from "./bhakti.types.ts";

export function getNextPromotionTier(tier: BhaktiTierCode): BhaktiTierCode | null {
  if (tier === "MD" || tier === "DIRECTOR") return null;
  const idx = BHAKTI_TIER_ORDER.indexOf(tier);
  return idx > 1 ? BHAKTI_TIER_ORDER[idx - 1] : null;
}

export function getDemotionTier(tier: BhaktiTierCode): BhaktiTierCode | null {
  if (tier === "MD" || tier === "EMPLOYEE") return null;
  const idx = BHAKTI_TIER_ORDER.indexOf(tier);
  return idx >= 0 && idx < BHAKTI_TIER_ORDER.length - 1 ? BHAKTI_TIER_ORDER[idx + 1] : null;
}

export function evaluatePromotion(
  node: BhaktiOrgNode,
  rollup: BhaktiRollupNodeMetrics,
  targetParentCurrentDirectCount: number,
  manualQuota?: number | null
): BhaktiPromotionDecision {
  const targetTier = getNextPromotionTier(node.tier);
  if (!targetTier) {
    return { nodeId: node.id, currentTier: node.tier, targetTier: null, eligible: false, action: "AT_APEX", reasons: [`${node.tier} cannot promote further (${node.tier === "MD" ? "singleton apex" : "MD seat reserved"}).`] };
  }
  const reasons: string[] = [];
  const targetSpec = BHAKTI_TIER_SPECS[targetTier];
  const highCycles = node.consecutiveHighCycles ?? 0;
  if (rollup.effectiveScore < BHAKTI_PROMOTION_THRESHOLDS.minEffectiveScore) reasons.push(`Effective score ${rollup.effectiveScore} < required ${BHAKTI_PROMOTION_THRESHOLDS.minEffectiveScore}.`);
  if (highCycles < BHAKTI_PROMOTION_THRESHOLDS.minConsecutiveCycles) reasons.push(`Consecutive high cycles ${highCycles} < required ${BHAKTI_PROMOTION_THRESHOLDS.minConsecutiveCycles}.`);
  if (node.performance.meritXp < targetSpec.minPromotionXp) reasons.push(`Merit XP ${node.performance.meritXp} < required ${targetSpec.minPromotionXp} for ${targetTier}.`);
  if (node.criticalComplianceBreach) reasons.push("Blocked by active critical compliance breach.");
  if (reasons.length > 0) return { nodeId: node.id, currentTier: node.tier, targetTier, eligible: false, action: "INELIGIBLE", reasons };
  const slotCheck = checkTopDownSlotAvailability(targetSpec.parentTier!, targetParentCurrentDirectCount, manualQuota);
  if (!slotCheck.allowed) return { nodeId: node.id, currentTier: node.tier, targetTier, eligible: true, action: "WAITLISTED_NO_VACANCY", reasons: [`Eligible for ${targetTier}, but parent ${targetSpec.parentTier} has 0 vacancies (${slotCheck.reason}).`] };
  return { nodeId: node.id, currentTier: node.tier, targetTier, eligible: true, action: "PROMOTE", reasons: [`Cleared score (${rollup.effectiveScore}), XP (${node.performance.meritXp}), and ${targetTier} slot check.`] };
}

export function evaluateDemotion(node: BhaktiOrgNode, rollup: BhaktiRollupNodeMetrics): BhaktiDemotionDecision {
  if (node.tier === "MD") return { nodeId: node.id, currentTier: node.tier, targetTier: null, action: "PROTECTED_APEX", reasons: ["Managing Director is the sovereign protected apex."] };
  const lowCycles = node.consecutiveLowCycles ?? 0;
  const scoreBreach = rollup.effectiveScore < BHAKTI_DEMOTION_THRESHOLDS.maxEffectiveScore && lowCycles >= BHAKTI_DEMOTION_THRESHOLDS.minConsecutiveCycles;
  if (!node.criticalComplianceBreach && !scoreBreach) return { nodeId: node.id, currentTier: node.tier, targetTier: null, action: "RETAIN", reasons: [`Performance band ${rollup.band} within retention bounds.`] };
  const reasons: string[] = [];
  if (node.criticalComplianceBreach) reasons.push("Critical statutory/compliance breach.");
  if (scoreBreach) reasons.push(`Effective score ${rollup.effectiveScore} < ${BHAKTI_DEMOTION_THRESHOLDS.maxEffectiveScore} for ${lowCycles} cycles.`);
  const targetTier = getDemotionTier(node.tier);
  return { nodeId: node.id, currentTier: node.tier, targetTier, action: targetTier ? "DEMOTE" : "PIP_REVIEW", reasons };
}

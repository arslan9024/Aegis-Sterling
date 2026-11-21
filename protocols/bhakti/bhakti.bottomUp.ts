/**
 * bhakti.bottomUp.ts — Bottom-to-Top Reporting Chain, Performance Rollup & Tier Ranking Formula
 */
import { BHAKTI_LEADER_ROLLUP_WEIGHTS, BHAKTI_PERFORMANCE_WEIGHTS, BHAKTI_TIER_SPECS } from "./bhakti.constants.ts";
import type { BhaktiOrgNode, BhaktiPerformanceBand, BhaktiRankRecord, BhaktiRollupNodeMetrics, EmployeePerformanceInput } from "./bhakti.types.ts";

function clamp(n: number, min: number, max: number): number { return Math.min(max, Math.max(min, n)); }
function round2(n: number): number { return Math.round(n * 100) / 100; }

export function computeIndividualPerformanceScore(input: EmployeePerformanceInput): number {
  const sla = clamp(input.slaOnTimeRate, 0, 100);
  const completion = clamp(input.taskCompletionRate, 0, 100);
  const compliance = clamp(input.complianceScore, 0, 100);
  const targetXp = input.targetXp && input.targetXp > 0 ? input.targetXp : 5000;
  const xpPct = clamp((input.meritXp / targetXp) * 100, 0, 100);
  return round2(sla * BHAKTI_PERFORMANCE_WEIGHTS.sla + completion * BHAKTI_PERFORMANCE_WEIGHTS.completion + compliance * BHAKTI_PERFORMANCE_WEIGHTS.compliance + xpPct * BHAKTI_PERFORMANCE_WEIGHTS.meritXp);
}

export function classifyPerformanceBand(score: number): BhaktiPerformanceBand {
  if (score >= 90) return "SOVEREIGN_ELITE";
  if (score >= 75) return "HIGH_PERFORMER";
  if (score >= 60) return "ON_TRACK";
  if (score >= 45) return "WATCHLIST";
  return "DEMOTION_RISK";
}

export function resolveUpwardChain(nodeId: string, nodesById: ReadonlyMap<string, BhaktiOrgNode>): BhaktiOrgNode[] {
  const chain: BhaktiOrgNode[] = [];
  const visited = new Set<string>();
  let currentId: string | null = nodeId;
  while (currentId) {
    if (visited.has(currentId)) throw new Error(`Cycle detected in Bhakti reporting chain at node "${currentId}"`);
    visited.add(currentId);
    const node = nodesById.get(currentId);
    if (!node) break;
    chain.push(node);
    currentId = node.parentId;
  }
  return chain;
}

export function rollUpBottomToTop(nodes: readonly BhaktiOrgNode[]): Map<string, BhaktiRollupNodeMetrics> {
  const childrenByParent = new Map<string, BhaktiOrgNode[]>();
  for (const node of nodes) {
    if (!node.parentId) continue;
    const list = childrenByParent.get(node.parentId) ?? [];
    list.push(node);
    childrenByParent.set(node.parentId, list);
  }
  const bottomUpOrder = [...nodes].sort((a, b) => BHAKTI_TIER_SPECS[b.tier].level - BHAKTI_TIER_SPECS[a.tier].level);
  const rollups = new Map<string, BhaktiRollupNodeMetrics>();
  const childSpecMap = new Map<string, number | null>();
  for (const spec of Object.values(BHAKTI_TIER_SPECS)) {
    if (spec.parentTier) childSpecMap.set(spec.parentTier, spec.branchingFactorFromParent);
  }
  for (const node of bottomUpOrder) {
    const ownScore = computeIndividualPerformanceScore(node.performance);
    const children = childrenByParent.get(node.id) ?? [];
    let childrenAvgScore: number | null = null;
    let totalSubtreeHeadcount = 1;
    let totalSubtreeXp = node.performance.meritXp;
    if (children.length > 0) {
      let weightedSum = 0;
      let weightTotal = 0;
      for (const child of children) {
        const cm = rollups.get(child.id);
        if (!cm) continue;
        weightedSum += cm.effectiveScore * cm.totalSubtreeHeadcount;
        weightTotal += cm.totalSubtreeHeadcount;
        totalSubtreeHeadcount += cm.totalSubtreeHeadcount;
        totalSubtreeXp += cm.totalSubtreeXp;
      }
      childrenAvgScore = weightTotal > 0 ? round2(weightedSum / weightTotal) : null;
    }
    const effectiveScore = childrenAvgScore !== null
      ? round2(ownScore * BHAKTI_LEADER_ROLLUP_WEIGHTS.ownWeight + childrenAvgScore * BHAKTI_LEADER_ROLLUP_WEIGHTS.subtreeWeight)
      : ownScore;
    const expectedDirectCapacity = childSpecMap.get(node.tier) ?? null;
    const spanUtilizationPct = expectedDirectCapacity && expectedDirectCapacity > 0 ? round2((children.length / expectedDirectCapacity) * 100) : null;
    rollups.set(node.id, { nodeId: node.id, tier: node.tier, ownScore, childrenAvgScore, effectiveScore, directReportCount: children.length, expectedDirectCapacity, spanUtilizationPct, totalSubtreeHeadcount, totalSubtreeXp, band: classifyPerformanceBand(effectiveScore) });
  }
  return rollups;
}

export function computeTierRankings(nodes: readonly BhaktiOrgNode[], rollups: ReadonlyMap<string, BhaktiRollupNodeMetrics>): BhaktiRankRecord[] {
  const byTier = new Map<string, BhaktiOrgNode[]>();
  const byParent = new Map<string, BhaktiOrgNode[]>();
  for (const node of nodes) {
    const tList = byTier.get(node.tier) ?? [];
    tList.push(node);
    byTier.set(node.tier, tList);
    const pKey = `${node.tier}::${node.parentId ?? "ROOT"}`;
    const pList = byParent.get(pKey) ?? [];
    pList.push(node);
    byParent.set(pKey, pList);
  }
  const scoreOf = (id: string) => rollups.get(id)?.effectiveScore ?? 0;
  const tierRankMap = new Map<string, { rank: number; total: number }>();
  for (const group of byTier.values()) {
    const sorted = [...group].sort((a, b) => scoreOf(b.id) - scoreOf(a.id));
    sorted.forEach((n, idx) => tierRankMap.set(n.id, { rank: idx + 1, total: sorted.length }));
  }
  const peerRankMap = new Map<string, { rank: number; total: number }>();
  for (const group of byParent.values()) {
    const sorted = [...group].sort((a, b) => scoreOf(b.id) - scoreOf(a.id));
    sorted.forEach((n, idx) => peerRankMap.set(n.id, { rank: idx + 1, total: sorted.length }));
  }
  return nodes.map(n => {
    const tr = tierRankMap.get(n.id) ?? { rank: 1, total: 1 };
    const pr = peerRankMap.get(n.id) ?? { rank: 1, total: 1 };
    const percentile = tr.total <= 1 ? 100 : round2(((tr.total - tr.rank) / (tr.total - 1)) * 100);
    return { nodeId: n.id, fullName: n.fullName, tier: n.tier, seatCode: n.seatCode, effectiveScore: scoreOf(n.id), tierRank: tr.rank, tierTotal: tr.total, percentile, peerRank: pr.rank, peerTotal: pr.total };
  });
}

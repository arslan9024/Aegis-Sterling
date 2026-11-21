/**
 * laws/siddhantaDoctrine.law.ts — Siddhanta 4-Stage Execution Protocol & 3 Sovereign Pillars
 */
import { SIDDHANTA_STAGES, isValidSiddhantaStage } from "../.agents/aegis/protocols/siddhantaKernel.ts";
export { SIDDHANTA_STAGES, isValidSiddhantaStage };

export const SIDDHANTA_THREE_PILLARS = [
  { id: "KRAMA", name: "Hierarchy (Krama-Siddhanta)", rule: "Strict downward delegation and upward reporting without skipping tiers." },
  { id: "NISTHA", name: "Loyalty (Nistha-Siddhanta)", rule: "Single point of allegiance (Eka-Nistha) to the Managing Director." },
  { id: "AJNA", name: "Obedience (Ajna-Siddhanta)", rule: "Explicit user directives executed faithfully with zero unrequested overreach." },
] as const;

/**
 * aegisTeamRoster.ts — Unified 12 Directors + 108 Subagents roster helpers.
 */

import { AEGIS_DIRECTORS } from './aegisDirectors.ts';
import { AEGIS_SUBAGENTS } from './aegisSubagents.ts';
import type { AegisDirectorSpec, AegisSubagentSpec, AegisTeamRosterSummary } from './aegisTeamTypes.ts';

export { AEGIS_DIRECTORS, AEGIS_SUBAGENTS };

export function getSubagentsForDirector(directorId: string): AegisSubagentSpec[] {
  return AEGIS_SUBAGENTS.filter(sub => sub.directorId === directorId);
}

export function getDirectorByDomain(domain: string): AegisDirectorSpec | undefined {
  const q = domain.toLowerCase();
  return AEGIS_DIRECTORS.find(d => d.domain.toLowerCase().includes(q));
}

export function getAegisTeamSummary(): AegisTeamRosterSummary {
  return {
    directorsCount: AEGIS_DIRECTORS.length,
    subagentsCount: AEGIS_SUBAGENTS.length,
    totalAegisTeam: AEGIS_DIRECTORS.length + AEGIS_SUBAGENTS.length,
    departments: AEGIS_DIRECTORS.map(d => ({
      departmentId: d.departmentId,
      director: d.name,
      domain: d.domain,
      subagentsCount: getSubagentsForDirector(d.id).length,
    })),
  };
}

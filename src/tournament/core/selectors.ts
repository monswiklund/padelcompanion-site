import { TournamentState, DivisionConfig } from "./state";

type DivisionStateLike = {
  divisions?: DivisionConfig[] | null;
};

/**
 * Returns divisions sorted by their stable 'order' property.
 * This is the canonical order for all scheduling and display logic.
 */
export function getSortedDivisions(state: DivisionStateLike): DivisionConfig[] {
  if (!state.divisions) return [];
  return [...state.divisions].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/**
 * Returns a division by its stable ID.
 */
export function getDivisionById(state: DivisionStateLike, id: string): DivisionConfig | undefined {
  return state.divisions?.find(d => d.id === id);
}

/**
 * Returns a division by various lookups (ID first, then Name).
 * Used for legacy compatibility where only names might be available.
 */
export function findDivision(state: DivisionStateLike, idOrName: string): DivisionConfig | undefined {
  if (!state.divisions) return undefined;
  
  // Try ID match first (stable)
  let div = state.divisions.find(d => d.id === idOrName);
  if (div) return div;
  
  // Fallback to name match (legacy)
  const lowerName = idOrName.toLowerCase();
  return state.divisions.find(d => d.name.toLowerCase() === lowerName);
}

/**
 * Calculates the starting court offset for a given division.
 * Sums the 'courts' count of all divisions that precede it in the sorted order.
 */
export function getDivisionCourtOffset(state: DivisionStateLike, divisionId: string): number {
  const sorted = getSortedDivisions(state);
  let offset = 0;
  
  for (const div of sorted) {
    if (div.id === divisionId) break;
    offset += Math.max(1, div.courts || 1);
  }
  
  return offset;
}

/**
 * Returns the human-readable name of a division by its ID.
 */
export function getDivisionName(state: DivisionStateLike, divisionId: string): string {
  const div = getDivisionById(state, divisionId);
  return div ? div.name : "Unknown Division";
}

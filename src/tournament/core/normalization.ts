import { createId } from "../../shared/utils";
import type { TournamentState, DivisionConfig, Player } from "./state";

/**
 * Normalizes the tournament state, specifically focusing on division mode migrations.
 * This function MUST be idempotent. It should be safe to call multiple times without
 * creating duplicate divisions or assigning new IDs if the mapping already exists.
 * 
 * Rules:
 * 1. Ensure `divisions` array exists and has at least one division.
 * 2. Scan legacy `player.division` labels and map to stable `DivisionConfig` objects.
 * 3. Assign `player.divisionId`.
 * 4. Fallback: Unknown or empty legacy labels map to a default division.
 * 5. Re-sort and re-index `order` property deterministically (0..n-1).
 */
export function normalizeTournamentState(state: TournamentState): TournamentState {
  // We only care if we are currently in division format, or if we have divisions that need normalizing
  // Let's normalize regardless of format so that if they switch, the divisions are sound.
  
  if (!state.divisions) {
    state.divisions = [];
  }

  // To maintain id-stability, first populate a map of known divisions
  const knownDivisionIds = new Set<string>();
  const knownDivisionNames = new Map<string, DivisionConfig>();

  state.divisions.forEach(d => {
    // Clean existing name if it has prefix
    d.name = d.name.replace(/^Division\s+/i, "").trim();
    knownDivisionIds.add(d.id);
    knownDivisionNames.set(d.name.toLowerCase(), d);
  });

  let nextOrder = state.divisions.length > 0
    ? Math.max(...state.divisions.map(d => d.order ?? 0)) + 1
    : 0;

  // Function to get or create a division matching a name
  const getOrCreateDivision = (name: string): DivisionConfig => {
    const cleanName = name.replace(/^Division\s+/i, "").trim();
    const lowerName = cleanName.toLowerCase();
    let div = knownDivisionNames.get(lowerName);
    if (!div) {
      div = {
        id: createId(),
        name: cleanName,
        courts: state.divisionCourts || 2,
        order: nextOrder++
      };
      state.divisions!.push(div);
      knownDivisionNames.set(lowerName, div);
      knownDivisionIds.add(div.id);
    }
    return div;
  };

  // Get or Create default division named "A" for empty/unknown labels
  const getDefaultDivision = (): DivisionConfig => {
    return getOrCreateDivision("A");
  };

  if (state.players && Array.isArray(state.players)) {
    state.players.forEach(p => {
      // If player already has a valid divisionId, they are normalized
      if (p.divisionId && knownDivisionIds.has(p.divisionId)) {
        // Even if ID is valid, ensure the display string is in sync with the config name
        const div = state.divisions.find(d => d.id === p.divisionId);
        if (div) p.division = div.name;
        return;
      }

      // Read legacy label
      const legacyLabel = (p.division || "").trim();

      let targetDivision: DivisionConfig;

      if (!legacyLabel) {
        // Fallback for empty label
        targetDivision = getDefaultDivision();
      } else {
        // Fallback for non-standard label: create a division with that exact name
        targetDivision = getOrCreateDivision(legacyLabel);
      }

      p.divisionId = targetDivision.id;
      p.division = targetDivision.name; // Keep display cache in sync
    });
  }

  // Invariant 1: Ensure at least one division exists
  if (state.divisions.length === 0) {
    getDefaultDivision();
  }

  // Invariant 2: Ensure order is deterministic (0..n-1)
  state.divisions.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  state.divisions.forEach((div, index) => {
    div.order = index;
  });

  const existingCourtNames = state.divisionCourtNames || {};
  state.divisionCourtNames = Object.fromEntries(
    state.divisions.map((div) => [
      div.id,
      Array.from(
        { length: Math.max(1, div.courts || 1) },
        (_, index) => {
          const value =
            existingCourtNames[div.id]?.[index] ??
            existingCourtNames[div.name]?.[index];
          return typeof value === "string" ? value : "";
        },
      ),
    ]),
  );

  return state;
}

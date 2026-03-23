import type { TournamentState } from "@/context/TournamentContext";
import { getSortedDivisions, findDivision, getDivisionCourtOffset } from "../core/selectors";

type DivisionCourtNames = Record<string, string[]>;

function getDivisionFallbackName(division: string, localCourtNumber: number) {
  return `${division}${localCourtNumber}`;
}

/**
 * Legend:
 * divisionId: stable ID of the division (new logic)
 * division: name / label of the division (legacy compatibility)
 */

export function syncDivisionCourtNames(
  divisions: TournamentState["divisions"],
  divisionCourtNames: DivisionCourtNames = {},
): DivisionCourtNames {
  if (!divisions) return {};

  // Always iterate in stable order (division.order)
  const sorted = [...divisions].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return Object.fromEntries(
    sorted.map((div) => [
      div.name,
      Array.from({ length: Math.max(1, div.courts || 1) }, (_, index) => {
        const value = divisionCourtNames[div.name]?.[index];
        return typeof value === "string" ? value : "";
      }),
    ]),
  );
}

function getLocalDivisionCourtNumber(
  state: Pick<TournamentState, "divisions">,
  courtNum: number,
  divisionIdOrName: string,
): number | null {
  const div = findDivision(state, divisionIdOrName);
  if (!div) return null;

  const offset = getDivisionCourtOffset(state, div.id);
  const courtsPerDivision = Math.max(1, div.courts || 1);

  const localCourtNumber = courtNum - offset;
  if (localCourtNumber < 1 || localCourtNumber > courtsPerDivision) {
    return null;
  }

  return localCourtNumber;
}

export function getCourtDisplayName(
  state: Pick<
    TournamentState,
    | "players"
    | "format"
    | "courtFormat"
    | "customCourtNames"
    | "divisionCourts"
    | "divisionCourtNames"
    | "divisions"
  >,
  courtNum: number,
  divisionIdOrName?: string | null,
): string {
  if (state.format === "division" && divisionIdOrName) {
    const localCourtNumber = getLocalDivisionCourtNumber(
      state,
      courtNum,
      divisionIdOrName,
    );

    if (localCourtNumber) {
      const div = findDivision(state, divisionIdOrName);
      const divName = div ? div.name : (divisionIdOrName || "A");
      
      const customName =
        state.divisionCourtNames?.[divName]?.[localCourtNumber - 1];
      if (customName) return customName;
      return getDivisionFallbackName(divName, localCourtNumber);
    }
  }

  if (
    state.courtFormat === "custom" &&
    typeof state.customCourtNames[courtNum - 1] === "string" &&
    state.customCourtNames[courtNum - 1]
  ) {
    return state.customCourtNames[courtNum - 1];
  }

  if (state.courtFormat === "number") return courtNum.toString();
  return `Court ${courtNum}`;
}

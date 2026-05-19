import type { TournamentState } from "$lib/stores/tournament.svelte";
import { findDivision, getDivisionCourtOffset } from "$lib/tournament/core/selectors";

type DivisionCourtNames = Record<string, string[]>;

function getDivisionFallbackName(division: string, localCourtNumber: number) {
  return `${division}${localCourtNumber}`;
}

export function syncDivisionCourtNames(
  divisions: TournamentState["divisions"],
  divisionCourtNames: DivisionCourtNames = {},
): DivisionCourtNames {
  if (!divisions) return {};

  const sorted = [...divisions].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return Object.fromEntries(
    sorted.map((div) => [
      div.id,
      Array.from({ length: Math.max(1, div.courts || 1) }, (_, index) => {
        const value =
          divisionCourtNames[div.id]?.[index] ??
          divisionCourtNames[div.name]?.[index];
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
  const div = findDivision(state as any, divisionIdOrName);
  if (!div) return null;

  const offset = getDivisionCourtOffset(state as any, div.id);
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
      state as any,
      courtNum,
      divisionIdOrName,
    );

    if (localCourtNumber) {
      const div = findDivision(state as any, divisionIdOrName);
      const divName = div ? div.name : (divisionIdOrName || "A");

      const customName =
        (div && state.divisionCourtNames?.[div.id]?.[localCourtNumber - 1]) ||
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

import type { TournamentState } from "@/context/TournamentContext";

type DivisionCourtNames = Record<string, string[]>;

function getDivisionFallbackName(division: string, localCourtNumber: number) {
  return `${division}${localCourtNumber}`;
}

export function getSortedDivisionNames(
  players: TournamentState["players"],
): string[] {
  return Array.from(
    new Map(players.map((player) => [player.division || "A", true])).keys(),
  ).sort();
}

export function syncDivisionCourtNames(
  players: TournamentState["players"],
  divisionCourts: number,
  divisionCourtNames: DivisionCourtNames = {},
): DivisionCourtNames {
  const normalizedCourtCount = Math.max(1, divisionCourts || 1);

  return Object.fromEntries(
    getSortedDivisionNames(players).map((division) => [
      division,
      Array.from({ length: normalizedCourtCount }, (_, index) => {
        const value = divisionCourtNames[division]?.[index];
        return typeof value === "string" ? value : "";
      }),
    ]),
  );
}

function getLocalDivisionCourtNumber(
  state: Pick<TournamentState, "players" | "divisionCourts">,
  courtNum: number,
  division: string,
): number | null {
  const divisionNames = getSortedDivisionNames(state.players);
  const divisionIndex = divisionNames.indexOf(division);
  const courtsPerDivision = Math.max(1, state.divisionCourts || 1);

  if (divisionIndex === -1) return null;

  const localCourtNumber = courtNum - divisionIndex * courtsPerDivision;
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
  >,
  courtNum: number,
  division?: string | null,
): string {
  if (state.format === "division" && division) {
    const localCourtNumber = getLocalDivisionCourtNumber(
      state,
      courtNum,
      division,
    );

    if (localCourtNumber) {
      const customName =
        state.divisionCourtNames?.[division]?.[localCourtNumber - 1];
      if (customName) return customName;
      return getDivisionFallbackName(division, localCourtNumber);
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

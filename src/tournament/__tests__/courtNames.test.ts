import { describe, expect, it } from "vitest";

import type { TournamentState } from "@/context/TournamentContext";
import {
  getCourtDisplayName,
  syncDivisionCourtNames,
} from "@/tournament/ui/courtNames";

function createState(overrides: Partial<TournamentState> = {}): TournamentState {
  return {
    version: 1,
    players: [
      { id: "a1", name: "Lag 1", division: "A" },
      { id: "a2", name: "Lag 2", division: "A" },
      { id: "b1", name: "Lag 3", division: "B" },
      { id: "b2", name: "Lag 4", division: "B" },
    ],
    format: "division",
    courts: 4,
    scoringMode: "total",
    pointsPerMatch: 24,
    rankingCriteria: "points",
    courtFormat: "court",
    customCourtNames: [],
    divisionCourtNames: {
      A: ["Center", "Glas"],
      B: ["Bana 5", "Bana 6"],
    },
    maxRepeats: 99,
    pairingStrategy: "optimal",
    strictStrategy: false,
    preferredPartners: [],
    manualByes: [],
    hideLeaderboard: true,
    showPositionChanges: false,
    gridColumns: 0,
    leaderboardColumns: 1,
    textSize: 100,
    bracketScale: 100,
    isLocked: true,
    allowCourtChange: true,
    tournamentName: "",
    tournamentNotes: "",
    schedule: [],
    currentRound: 0,
    roundStartedAt: null,
    sessionStartedAt: null,
    leaderboard: [],
    allRounds: null,
    historyData: [],
    timer: {
      remainingSeconds: 720,
      isRunning: false,
      duration: 12,
      status: "idle",
    },
    winnersCourt: null,
    bracket: null,
    plannedStartTime: "17:00",
    matchDuration: 15,
    divisionCourts: 2,
    tiebreaker: "difference",
    ui: {
      currentRoute: "",
      selectedMatchId: null,
      activeBracketTab: "A",
    },
    ...overrides,
  };
}

describe("court name helpers", () => {
  it("uses division-specific names for division matches", () => {
    const state = createState();

    expect(getCourtDisplayName(state, 1, "A")).toBe("Center");
    expect(getCourtDisplayName(state, 2, "A")).toBe("Glas");
    expect(getCourtDisplayName(state, 3, "B")).toBe("Bana 5");
    expect(getCourtDisplayName(state, 4, "B")).toBe("Bana 6");
  });

  it("falls back to division-local labels when names are missing", () => {
    const state = createState({
      divisionCourtNames: {
        A: ["", ""],
        B: [""],
      },
    });

    expect(getCourtDisplayName(state, 1, "A")).toBe("A1");
    expect(getCourtDisplayName(state, 2, "A")).toBe("A2");
    expect(getCourtDisplayName(state, 3, "B")).toBe("B1");
    expect(getCourtDisplayName(state, 4, "B")).toBe("B2");
  });

  it("syncs division name arrays to active divisions and court count", () => {
    const names = syncDivisionCourtNames(
      createState().players,
      3,
      {
        A: ["Center"],
        B: ["Bana 5", "Bana 6", "Bana 7", "Ignored"],
        C: ["Unused"],
      },
    );

    expect(names).toEqual({
      A: ["Center", "", ""],
      B: ["Bana 5", "Bana 6", "Bana 7"],
    });
  });
});

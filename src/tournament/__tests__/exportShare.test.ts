import { describe, expect, it } from "vitest";

import { exportTournamentData } from "@/tournament/ui/setup/exportShare";
import { parseTournamentSnapshot } from "@/tournament/sync/snapshot";
import type { TournamentState } from "@/context/TournamentContext";

function createState(overrides: Partial<TournamentState> = {}): TournamentState {
  return {
    version: 1,
    players: [
      { id: "t1", name: "Lag 1", division: "A" },
      { id: "t2", name: "Lag 2", division: "A" },
    ],
    format: "division",
    courts: 2,
    scoringMode: "time",
    pointsPerMatch: 15,
    rankingCriteria: "points",
    courtFormat: "court",
    customCourtNames: [],
    divisionCourtNames: {},
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
    tournamentName: "Division Export",
    tournamentNotes: "",
    schedule: [
      {
        number: 1,
        completed: true,
        matches: [
          {
            court: 1,
            team1: [{ id: "t1", name: "Lag 1", division: "A" }],
            team2: [{ id: "t2", name: "Lag 2", division: "A" }],
            score1: 6,
            score2: 4,
          },
        ],
        byes: [],
      },
    ],
    currentRound: 1,
    roundStartedAt: null,
    sessionStartedAt: 1700000000000,
    leaderboard: [{ id: "t1", name: "Lag 1", points: 3, matchPoints: 3 }],
    allRounds: null,
    historyData: [],
    timer: {
      remainingSeconds: 0,
      isRunning: false,
      duration: 15,
      status: "idle",
    },
    winnersCourt: null,
    bracket: null,
    ui: {
      currentRoute: "/tournament/division",
      selectedMatchId: null,
      activeBracketTab: "A",
    },
    tiebreaker: "difference",
    divisionCourts: 2,
    ...overrides,
  };
}

describe("exportTournamentData", () => {
  it("exports the provided tournament state instead of the current global one", () => {
    const exported = exportTournamentData(
      createState({
        tournamentName: "History Row Export",
        players: [{ id: "t9", name: "Lag 9", division: "B" }],
      }),
    );

    const snapshot = parseTournamentSnapshot(exported);

    expect(snapshot.metadata.name).toBe("History Row Export");
    expect(snapshot.state.players).toHaveLength(1);
    expect(snapshot.state.players[0].name).toBe("Lag 9");
  });

  it("includes division-specific court names in exports", () => {
    const exported = exportTournamentData(
      createState({
        divisionCourtNames: {
          A: ["Center", "Glas"],
          B: ["Bana 5", "Bana 6"],
        },
      }),
    );

    const snapshot = parseTournamentSnapshot(exported);

    expect(snapshot.state.divisionCourtNames).toEqual({
      A: ["Center", "Glas"],
      B: ["Bana 5", "Bana 6"],
    });
  });
});

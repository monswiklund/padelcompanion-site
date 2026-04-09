import { describe, expect, it } from "vitest";

import type { TournamentState } from "@/context/TournamentContext";
import {
  TOURNAMENT_SNAPSHOT_SCHEMA_VERSION,
  createTournamentSnapshot,
  parseTournamentSnapshot,
  restoreTournamentStateFromSnapshot,
} from "@/tournament/sync/snapshot";

function createState(overrides: Partial<TournamentState> = {}): TournamentState {
  return {
    version: 1,
    players: [
      { id: "p1", name: "Alice" },
      { id: "p2", name: "Bob" },
      { id: "p3", name: "Cara" },
      { id: "p4", name: "Dan" },
    ],
    format: "americano",
    courts: 1,
    scoringMode: "total",
    pointsPerMatch: 24,
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
    isLocked: false,
    allowCourtChange: true,
    tournamentName: "Tuesday Americano",
    tournamentNotes: "Indoor league",
    schedule: [
      {
        number: 1,
        completed: false,
        matches: [
          {
            court: 1,
            team1: [
              { id: "p1", name: "Alice" },
              { id: "p2", name: "Bob" },
            ],
            team2: [
              { id: "p3", name: "Cara" },
              { id: "p4", name: "Dan" },
            ],
            score1: 6,
            score2: 4,
          },
        ],
        byes: [],
      },
    ],
    currentRound: 1,
    roundStartedAt: 1700000000000,
    sessionStartedAt: 1700000000000,
    leaderboard: [{ id: "p1", name: "Alice", points: 6 }],
    allRounds: null,
    historyData: [{ id: "local-history-only" }],
    timer: {
      remainingSeconds: 300,
      isRunning: true,
      duration: 12,
      status: "running",
    },
    winnersCourt: null,
    bracket: null,
    bracketConfig: undefined,
    ui: {
      currentRoute: "/tournament/generator",
      selectedMatchId: "m1",
      activeBracketTab: "A",
    },
    tiebreaker: "difference",
    divisionCourts: 2,
    ...overrides,
  };
}

describe("Tournament snapshot", () => {
  it("creates a backend-friendly snapshot with metadata", () => {
    const snapshot = createTournamentSnapshot(createState());

    expect(snapshot.snapshotSchemaVersion).toBe(
      TOURNAMENT_SNAPSHOT_SCHEMA_VERSION,
    );
    expect(snapshot.metadata).toEqual({
      name: "Tuesday Americano",
      format: "americano",
      playerCount: 4,
      currentRound: 1,
      status: "active",
    });
    expect(snapshot.exportedAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/,
    );
  });

  it("strips client-only fields from the synced state", () => {
    const snapshot = createTournamentSnapshot(createState());

    expect(snapshot.state).not.toHaveProperty("ui");
    expect(snapshot.state).not.toHaveProperty("historyData");
    expect(snapshot.state.players).toHaveLength(4);
    expect(snapshot.state.schedule[0].matches[0].score1).toBe(6);
  });

  it("restores a state payload that can hydrate the app again", () => {
    const original = createState({
      winnersCourt: { sides: { A: { courts: [], queue: [], round: 1, history: [] } }, twist: false },
    });
    const snapshot = createTournamentSnapshot(original);
    const restored = restoreTournamentStateFromSnapshot(snapshot);

    expect(restored.tournamentName).toBe(original.tournamentName);
    expect(restored.schedule).toEqual(original.schedule);
    expect(restored.winnersCourt).toEqual(original.winnersCourt);
    expect(restored).not.toHaveProperty("ui");
  });

  it("preserves division-specific court names in snapshots", () => {
    const snapshot = createTournamentSnapshot(
      createState({
        format: "division",
        players: [
          { id: "t1", name: "Lag 1", division: "A" },
          { id: "t2", name: "Lag 2", division: "A" },
          { id: "t3", name: "Lag 3", division: "B" },
          { id: "t4", name: "Lag 4", division: "B" },
        ],
        divisionCourtNames: {
          A: ["Center", "Glas"],
          B: ["Balkong", "Ute"],
        },
      }),
    );

    expect(snapshot.state.divisionCourtNames).toEqual({
      A: ["Center", "Glas"],
      B: ["Balkong", "Ute"],
    });
  });

  it("marks empty tournaments as drafts", () => {
    const snapshot = createTournamentSnapshot(
      createState({
        players: [],
        schedule: [],
        currentRound: 0,
        tournamentName: "",
      }),
    );

    expect(snapshot.metadata.status).toBe("draft");
    expect(snapshot.metadata.playerCount).toBe(0);
  });

  it("marks active Winners Court sessions as active even without a schedule", () => {
    const snapshot = createTournamentSnapshot(
      createState({
        schedule: [],
        winnersCourt: {
          sides: {
            A: { courts: [], queue: [], round: 1, history: [] },
          },
          twist: false,
        },
      }),
    );

    expect(snapshot.metadata.status).toBe("active");
  });

  it("parses legacy exports into snapshot format", () => {
    const snapshot = parseTournamentSnapshot(
      JSON.stringify({
        name: "Legacy Export",
        format: "americano",
        players: [{ id: "p1", name: "Alice" }],
        schedule: [],
        leaderboard: [],
      }),
    );

    expect(snapshot.metadata.name).toBe("Legacy Export");
    expect(snapshot.state.players).toHaveLength(1);
    expect(snapshot.snapshotSchemaVersion).toBe(
      TOURNAMENT_SNAPSHOT_SCHEMA_VERSION,
    );
  });
});

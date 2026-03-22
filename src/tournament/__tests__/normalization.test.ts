import { describe, it, expect } from "vitest";
import { normalizeTournamentState } from "../core/normalization";
import type { TournamentState, Player } from "../core/state";

describe("normalizeTournamentState", () => {
  const createBaseState = (): TournamentState => ({
    version: 1,
    format: "division",
    courts: 4,
    scoringMode: "total",
    pointsPerMatch: 24,
    rankingCriteria: "points",
    courtFormat: "court",
    customCourtNames: [],
    divisionCourtNames: {},
    maxRepeats: 99,
    pairingStrategy: "optimal",
    preferredPartners: [],
    manualByes: [],
    hideLeaderboard: false,
    showPositionChanges: true,
    gridColumns: 0,
    textSize: 100,
    bracketScale: 100,
    isLocked: false,
    tournamentName: "Test",
    tournamentNotes: "",
    divisions: [],
    schedule: [],
    currentRound: 0,
    leaderboard: [],
    allRounds: null,
    maxCourts: 4,
    bracket: {
      format: "single",
      teams: [],
      matches: [],
      standings: [],
      meta: { name: "", notes: "", createdAt: null }
    },
    winnersCourt: null,
    ui: { currentRoute: "", selectedMatchId: null, activeBracketTab: "A" },
    players: []
  });

  it("should create a default division if divisions array is missing or empty", () => {
    const state = createBaseState();
    delete (state as any).divisions;

    const normalized = normalizeTournamentState(state);
    expect(normalized.divisions).toBeDefined();
    expect(normalized.divisions!.length).toBe(1);
    expect(normalized.divisions![0].name).toBe("A");
  });

  it("should map legacy 'A', 'B' player divisions into stable divisions", () => {
    const state = createBaseState();
    state.players = [
      { id: 1, name: "P1", division: "A" },
      { id: 2, name: "P2", division: "B" },
      { id: 3, name: "P3", division: "A" }
    ] as Player[];

    const normalized = normalizeTournamentState(state);
    expect(normalized.divisions!.length).toBe(2);
    
    const divA = normalized.divisions!.find(d => d.name === "A");
    const divB = normalized.divisions!.find(d => d.name === "B");
    
    expect(divA).toBeDefined();
    expect(divB).toBeDefined();

    expect(normalized.players[0].divisionId).toBe(divA!.id);
    expect(normalized.players[1].divisionId).toBe(divB!.id);
    expect(normalized.players[2].divisionId).toBe(divA!.id);
  });

  it("should fallback to 'Division A' for empty or missing legacy labels", () => {
    const state = createBaseState();
    state.players = [
      { id: 1, name: "P1", division: "" },
      { id: 2, name: "P2" } // missing division property
    ] as Player[];

    const normalized = normalizeTournamentState(state);
    expect(normalized.divisions!.length).toBe(1);
    const defaultDiv = normalized.divisions![0];
    expect(defaultDiv.name).toBe("A");

    expect(normalized.players[0].divisionId).toBe(defaultDiv.id);
    expect(normalized.players[1].divisionId).toBe(defaultDiv.id);
  });

  it("is idempotent: running multiple times does not duplicate divisions or change IDs", () => {
    const state = createBaseState();
    state.players = [
      { id: 1, name: "P1", division: "A" },
      { id: 2, name: "P2", division: "B" }
    ] as Player[];

    // First run
    const run1 = normalizeTournamentState(state);
    const idsRun1 = run1.divisions!.map(d => d.id);
    const p1DivId1 = run1.players[0].divisionId;

    // Second run
    // Using JSON parse/stringify to simulate save/load persistence cycle
    const persistedState = JSON.parse(JSON.stringify(run1));
    const run2 = normalizeTournamentState(persistedState);
    const idsRun2 = run2.divisions!.map(d => d.id);
    const p1DivId2 = run2.players[0].divisionId;

    expect(idsRun1).toEqual(idsRun2);
    expect(p1DivId1).toBe(p1DivId2);
    expect(run2.divisions!.length).toBe(2);
  });

  it("should sort order deterministically and normalize to 0..n-1", () => {
    const state = createBaseState();
    state.divisions = [
      { id: "d1", name: "Div1", courts: 2, order: 10 },
      { id: "d2", name: "Div2", courts: 2, order: 5 },
      { id: "d3", name: "Div3", courts: 2, order: 20 },
    ];

    const normalized = normalizeTournamentState(state);
    
    // Ordered by existing orders: 5 (d2) -> 10 (d1) -> 20 (d3)
    // Assigned indices: 0 -> 1 -> 2
    expect(normalized.divisions![0].id).toBe("d2");
    expect(normalized.divisions![0].order).toBe(0);
    
    expect(normalized.divisions![1].id).toBe("d1");
    expect(normalized.divisions![1].order).toBe(1);
    
    expect(normalized.divisions![2].id).toBe("d3");
    expect(normalized.divisions![2].order).toBe(2);
  });
});

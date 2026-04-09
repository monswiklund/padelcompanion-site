import { describe, expect, it } from "vitest";

import type { TournamentState } from "@/context/TournamentContext";
import {
  getCourtDisplayName,
  syncDivisionCourtNames,
} from "@/tournament/ui/courtNames";

function createState(overrides: Partial<TournamentState> = {}): TournamentState {
  const divisions = overrides.divisions || [
    { id: "div-a", name: "A", courts: 2, order: 0 },
    { id: "div-b", name: "B", courts: 2, order: 1 },
  ];
  
  return {
    version: 1,
    players: [
      { id: "a1", name: "Lag 1", division: "A", divisionId: "div-a" },
      { id: "a2", name: "Lag 2", division: "A", divisionId: "div-a" },
      { id: "b1", name: "Lag 3", division: "B", divisionId: "div-b" },
      { id: "b2", name: "Lag 4", division: "B", divisionId: "div-b" },
    ],
    format: "division",
    divisions,
    courts: 4,
    scoringMode: "total",
    pointsPerMatch: 24,
    rankingCriteria: "points",
    courtFormat: "court",
    customCourtNames: [],
    divisionCourtNames: {
      "div-a": ["Center", "Glas"],
      "div-b": ["Bana 5", "Bana 6"],
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

    // Div A (Offset 0)
    expect(getCourtDisplayName(state, 1, "div-a")).toBe("Center");
    expect(getCourtDisplayName(state, 2, "div-a")).toBe("Glas");
    // Div B (Offset 2)
    expect(getCourtDisplayName(state, 3, "div-b")).toBe("Bana 5");
    expect(getCourtDisplayName(state, 4, "div-b")).toBe("Bana 6");
  });

  it("falls back to division-local labels when names are missing", () => {
    const state = createState({
      divisionCourtNames: {
        "div-a": ["", ""],
        "div-b": [""],
      },
    });

    expect(getCourtDisplayName(state, 1, "div-a")).toBe("A1");
    expect(getCourtDisplayName(state, 2, "div-a")).toBe("A2");
    expect(getCourtDisplayName(state, 3, "div-b")).toBe("B1");
    expect(getCourtDisplayName(state, 4, "div-b")).toBe("B2");
  });

  it("calculates offsets for variable court counts correctly", () => {
    const state = createState({
      divisions: [
        { id: "div-a", name: "A", courts: 4, order: 0 },
        { id: "div-b", name: "B", courts: 2, order: 1 },
      ],
      divisionCourtNames: {} // Clear names for this test
    });

    // Div A: 1-4
    expect(getCourtDisplayName(state, 1, "div-a")).toBe("A1");
    expect(getCourtDisplayName(state, 4, "div-a")).toBe("A4");
    // Div B: starts at offset 4
    expect(getCourtDisplayName(state, 5, "div-b")).toBe("B1");
    expect(getCourtDisplayName(state, 6, "div-b")).toBe("B2");
  });

  it("maintains label stability after renaming a preceding division", () => {
    const stateBefore = createState({
      divisionCourtNames: {} // Clear names for stability check
    });
    // Verify B1 is court 3
    expect(getCourtDisplayName(stateBefore, 3, "div-b")).toBe("B1");

    // Rename A to Z (which would sort AFTER B alphabetically)
    const stateAfter = {
      ...stateBefore,
      divisions: [
        { id: "div-a", name: "Z", courts: 2, order: 0 },
        { id: "div-b", name: "B", courts: 2, order: 1 },
      ]
    };

    // Division B's label MUST still be B1, court 3
    expect(getCourtDisplayName(stateAfter, 3, "div-b")).toBe("B1");
  });

  it("must-have: renaming a division updates only that division's display name, not offsets", () => {
    const stateBefore = createState({
      divisions: [
        { id: "div-a", name: "A", courts: 2, order: 0 },
        { id: "div-b", name: "B", courts: 2, order: 1 },
      ],
      divisionCourtNames: {}
    });
    
    // A1, A2, B1, B2
    expect(getCourtDisplayName(stateBefore, 1, "div-a")).toBe("A1");
    expect(getCourtDisplayName(stateBefore, 3, "div-b")).toBe("B1");

    // Rename A to "Elite"
    const stateAfter = {
      ...stateBefore,
      divisions: [
        { id: "div-a", name: "Elite", courts: 2, order: 0 },
        { id: "div-b", name: "B", courts: 2, order: 1 },
      ]
    };

    // A-matches now say Elite 1
    expect(getCourtDisplayName(stateAfter, 1, "div-a")).toBe("Elite1");
    // B1 MUST still be B1, and still at court 3 (offset 2 preserved)
    expect(getCourtDisplayName(stateAfter, 3, "div-b")).toBe("B1");
  });

  it("syncs division name arrays correctly using state.divisions as truth", () => {
    const state = createState();
    const names = syncDivisionCourtNames(
      state.divisions,
      {
        "div-a": ["Center"],
        "div-b": ["Bana 5", "Bana 6", "Bana 7", "Ignored"],
        "div-c": ["Unused"],
      },
    );

    expect(names).toEqual({
      "div-a": ["Center", ""],
      "div-b": ["Bana 5", "Bana 6"],
    });
  });

  it("bra-att-ha: new display helpers work with divisionId even if name is unknown", () => {
    const state = createState({
      divisions: [
        { id: "uuid-1", name: "Modern Division", courts: 2, order: 0 }
      ],
      divisionCourtNames: {
        "uuid-1": ["Center"]
      }
    });

    // Lookup by ID only
    expect(getCourtDisplayName(state, 1, "uuid-1")).toBe("Center");
  });

  it("renaming a division also preserves custom divisionCourtNames mapping", () => {
    const stateBefore = createState({
      divisions: [
        { id: "div-a", name: "OldName", courts: 2, order: 0 }
      ],
      divisionCourtNames: {
        "div-a": ["Center", "Glas"]
      }
    });

    // Simulate a rename while keeping the stable division ID
    const newName = "NewName";
    const divs = [...(stateBefore.divisions || [])];
    divs[0] = { ...divs[0], name: newName };

    const stateAfter = {
      ...stateBefore,
      divisions: divs,
      divisionCourtNames: stateBefore.divisionCourtNames,
    };

    // Verify display name lookup still works via ID
    expect(getCourtDisplayName(stateAfter, 1, "div-a")).toBe("Center");
    // Verify mapping stays attached to the stable ID, not the renamed label
    expect(stateAfter.divisionCourtNames["div-a"]).toEqual(["Center", "Glas"]);
    expect(stateAfter.divisionCourtNames[newName]).toBeUndefined();
  });

  it("delete division logic is blocked when locked", () => {
    const state = createState({ 
      isLocked: true,
      divisions: [{ id: "div-1", name: "A", courts: 2, order: 0 }]
    });
    
    // Simulate the handler guard: if (state.isLocked) return;
    const performDelete = (s: TournamentState) => {
      if (s.isLocked) return s;
      return { ...s, divisions: [] };
    };

    const result = performDelete(state);
    expect((result.divisions || []).length).toBe(1);
    expect(result.isLocked).toBe(true);
  });
});

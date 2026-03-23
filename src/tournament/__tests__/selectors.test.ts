import { describe, expect, it } from "vitest";
import { getSortedDivisions, getDivisionCourtOffset, findDivision } from "../core/selectors";
import { TournamentState } from "../core/state";

describe("division selectors", () => {
  const mockState: Partial<TournamentState> = {
    divisions: [
      { id: "div-b", name: "Division B", courts: 2, order: 1 },
      { id: "div-a", name: "Division A", courts: 4, order: 0 },
    ],
  };

  it("getSortedDivisions: should sort divisions by the order property", () => {
    const sorted = getSortedDivisions(mockState as TournamentState);
    expect(sorted[0].id).toBe("div-a");
    expect(sorted[1].id).toBe("div-b");
  });

  it("getDivisionCourtOffset: should calculate cumulative offsets correctly", () => {
    const state = mockState as TournamentState;
    // Div A (order 0) starts at 0
    expect(getDivisionCourtOffset(state, "div-a")).toBe(0);
    // Div B (order 1) starts after Div A (4 courts)
    expect(getDivisionCourtOffset(state, "div-b")).toBe(4);
  });

  it("findDivision: should find by ID or case-insensitive name", () => {
    const state = mockState as TournamentState;
    
    // By ID
    expect(findDivision(state, "div-a")?.name).toBe("Division A");
    
    // By Name (case insensitive)
    expect(findDivision(state, "division b")?.id).toBe("div-b");
    
    // Unknown
    expect(findDivision(state, "non-existent")).toBeUndefined();
  });

  it("getDivisionCourtOffset: should derive offsets from division.order, not raw name sorting", () => {
    const state: Partial<TournamentState> = {
      divisions: [
        { id: "div-z", name: "Z-Division", courts: 2, order: 0 },
        { id: "div-a", name: "A-Division", courts: 2, order: 1 },
      ],
    };
    // Z (order 0) starts at 0
    expect(getDivisionCourtOffset(state as TournamentState, "div-z")).toBe(0);
    // A (order 1) starts at 2, even though "A" < "Z" alphabetically
    expect(getDivisionCourtOffset(state as TournamentState, "div-a")).toBe(2);
  });

  it("getDivisionCourtOffset: ensures rename does not change other divisions' offsets", () => {
    const stateBefore: Partial<TournamentState> = {
      divisions: [
        { id: "div-a", name: "A", courts: 4, order: 0 },
        { id: "div-b", name: "B", courts: 2, order: 1 },
      ],
    };
    expect(getDivisionCourtOffset(stateBefore as TournamentState, "div-b")).toBe(4);

    const stateAfter: Partial<TournamentState> = {
      divisions: [
        { id: "div-a", name: "Z-New", courts: 4, order: 0 },
        { id: "div-b", name: "B", courts: 2, order: 1 },
      ],
    };
    // Offset for B stays 4 even though A's name changed
    expect(getDivisionCourtOffset(stateAfter as TournamentState, "div-b")).toBe(4);
  });
});

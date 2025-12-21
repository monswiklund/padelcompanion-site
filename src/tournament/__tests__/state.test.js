import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  state,
  saveState,
  loadState,
  resetTournamentState,
  initLeaderboard,
} from "../state.js";

describe("State Management", () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: vi.fn((key) => store[key] || null),
      setItem: vi.fn((key, value) => {
        store[key] = value.toString();
      }),
      clear: vi.fn(() => {
        store = {};
      }),
    };
  })();

  beforeEach(() => {
    vi.stubGlobal("localStorage", localStorageMock);
    resetTournamentState();
    state.players = [];
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should initialize with default values", () => {
    expect(state.courts).toBe(2);
    expect(state.format).toBe("americano");
    expect(state.schedule).toEqual([]);
  });

  it("should save state to localStorage", () => {
    state.players = [{ id: 1, name: "Test" }];
    state.courts = 4;

    saveState();

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "tournament-state",
      expect.stringContaining('"courts":4')
    );
  });

  it("should load state from localStorage", () => {
    const mockData = JSON.stringify({
      players: [{ id: 99, name: "Loaded" }],
      courts: 3,
    });
    localStorage.getItem.mockReturnValue(mockData);

    const success = loadState();

    expect(success).toBe(true);
    expect(state.players[0].name).toBe("Loaded");
    expect(state.courts).toBe(3);
  });

  it("should fail gracefully if localStorage is corrupt", () => {
    localStorage.getItem.mockReturnValue("{ invalid json");

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const success = loadState();

    expect(success).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
  });

  it("should reset tournament state but keep players", () => {
    state.players = [{ id: 1, name: "KeepMe" }];
    state.schedule = [{ match: 1 }];
    state.currentRound = 5;

    resetTournamentState();

    expect(state.players.length).toBe(1);
    expect(state.schedule).toEqual([]);
    expect(state.currentRound).toBe(0);
  });

  it("should initialize leaderboard correctly", () => {
    state.players = [
      { id: 1, name: "P1" },
      { id: 2, name: "P2" },
    ];
    initLeaderboard();

    expect(state.leaderboard.length).toBe(2);
    expect(state.leaderboard[0].points).toBe(0);
    expect(state.leaderboard[0].wins).toBe(0);
    expect(state.leaderboard[0].played).toBe(0);
  });
});

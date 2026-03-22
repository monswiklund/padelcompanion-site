import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import type { TournamentState } from "@/context/TournamentContext";
import { CloudService } from "@/tournament/sync/cloud";
import { StorageService } from "@/shared/storage";

function createState(): TournamentState {
  return {
    version: 1,
    players: [{ id: "p1", name: "Alice" }],
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
    tournamentName: "Share Test",
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
    ui: {
      currentRoute: "",
      selectedMatchId: null,
      activeBracketTab: "A",
    },
    tiebreaker: "difference",
    divisionCourts: 2,
  };
}

describe("CloudService", () => {
  const fetchMock = vi.fn();
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
    };
  })();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("localStorage", localStorageMock);
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("creates sessions using snapshot payloads", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        id: "session-1",
        shareCode: "ABC123",
        editToken: "token-1",
        updatedAt: "2026-03-17T08:00:00.000Z",
        snapshot: CloudService.createSnapshot(createState()),
      }),
    });

    const result = await CloudService.createSession(createState());

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/tournament-sessions",
      expect.objectContaining({
        method: "POST",
      }),
    );
    expect(result.shareCode).toBe("ABC123");
    expect(result.editToken).toBe("token-1");
  });

  it("loads and parses stored snapshots", async () => {
    const snapshot = CloudService.createSnapshot(createState());
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        id: "session-1",
        shareCode: "ABC123",
        updatedAt: "2026-03-17T08:00:00.000Z",
        snapshot,
      }),
    });

    const loaded = await CloudService.getSession("ABC123");

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/tournament-sessions/ABC123",
      expect.any(Object),
    );
    expect(loaded.metadata.name).toBe("Share Test");
  });

  it("falls back to local session storage when API is unavailable", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

    const created = await CloudService.createSession(createState());
    const loaded = await CloudService.getSession(created.shareCode);

    expect(created.id).toContain("session_");
    expect(loaded.metadata.name).toBe("Share Test");
    expect(StorageService.getItem("tournament-cloud-sessions")).toBeTruthy();
  });

  it("sends the edit token when updating a session", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        id: "session-1",
        shareCode: "ABC123",
        editToken: "token-1",
        updatedAt: "2026-03-17T08:00:00.000Z",
        snapshot: CloudService.createSnapshot(createState()),
      }),
    });

    await CloudService.updateSession("session-1", "token-1", createState());

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/tournament-sessions/session-1/snapshot",
      expect.objectContaining({
        method: "PUT",
        headers: expect.objectContaining({
          "X-Session-Token": "token-1",
        }),
      }),
    );
  });
});

import { describe, expect, it, vi, afterEach } from "vitest";
import { getEstimatedRoundStartDate } from "../ui/components/scheduleTiming";
import type { TournamentState } from "@/context/TournamentContext";

function createState(overrides: Partial<TournamentState> = {}): TournamentState {
  return {
    version: 1,
    players: [],
    format: "division",
    courts: 2,
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

describe("schedule timing estimates", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("adds a 2 minute buffer to the first two division rounds", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-17T12:00:00+01:00"));

    const state = createState();
    const estimate = getEstimatedRoundStartDate(state, 2);

    expect(estimate.getHours()).toBe(17);
    expect(estimate.getMinutes()).toBe(34);
  });

  it("uses completed round durations for future estimates", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-17T12:00:00+01:00"));

    const state = createState({
      schedule: [
        { number: 1, matches: [], completed: true, durationSeconds: 20 * 60 },
        { number: 2, matches: [], completed: true, durationSeconds: 10 * 60 },
      ],
    });

    const estimate = getEstimatedRoundStartDate(state, 2);

    expect(estimate.getHours()).toBe(17);
    expect(estimate.getMinutes()).toBe(30);
  });

  it("uses session start as anchor when the next round is ready but not started", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-17T13:04:00+01:00"));

    const state = createState({
      schedule: [
        { number: 1, matches: [], completed: true, durationSeconds: 17 * 60 },
        { number: 2, matches: [], completed: true, durationSeconds: 17 * 60 },
        { number: 3, matches: [], completed: false },
      ],
      sessionStartedAt: new Date("2026-03-17T12:30:00+01:00").getTime(),
    });

    const estimate = getEstimatedRoundStartDate(state, 2);

    expect(estimate.getHours()).toBe(13);
    expect(estimate.getMinutes()).toBe(4);
  });

  it("anchors upcoming rounds to the active round's actual start time", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-17T13:30:00+01:00"));

    const activeRoundStart = new Date("2026-03-17T13:25:00+01:00").getTime();

    const state = createState({
      schedule: [
        { number: 1, matches: [], completed: true, durationSeconds: 20 * 60 },
        { number: 2, matches: [], completed: false },
      ],
      roundStartedAt: activeRoundStart,
    });

    const estimate = getEstimatedRoundStartDate(state, 2);

    expect(estimate.getHours()).toBe(13);
    expect(estimate.getMinutes()).toBe(42);
  });

  it("never estimates the next round before the active round has already run", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-17T13:50:00+01:00"));

    const activeRoundStart = new Date("2026-03-17T13:25:00+01:00").getTime();

    const state = createState({
      schedule: [
        { number: 1, matches: [], completed: true, durationSeconds: 15 * 60 },
        { number: 2, matches: [], completed: false },
      ],
      roundStartedAt: activeRoundStart,
    });

    const estimate = getEstimatedRoundStartDate(state, 2);

    expect(estimate.getHours()).toBe(13);
    expect(estimate.getMinutes()).toBe(50);
  });
});

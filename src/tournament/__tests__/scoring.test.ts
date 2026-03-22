import { describe, it, expect, beforeEach, vi } from "vitest";
import { generateMexicanoNextRound } from "../scoring/index.js";
import { generateDivisionSchedule } from "../scoring/divisionGenerator";
import { state } from "../core/state.js";

describe("Mexicano Scoring Logic", () => {
  beforeEach(() => {
    // Reset state
    state.courts = 2; // 8 players
    state.maxRepeats = 0; // Strict no repeats
    state.schedule = [];
    state.currentRound = 1;
    state.strictStrategy = false; // Default Smart
    state.pairingStrategy = "oneThree"; // Standard
    state.manualByes = [];
    state.preferredPartners = [];
  });

  const createPlayers = (count) =>
    Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `P${i + 1}`,
      points: 10 + i, // Different points to establish ranking 1..N
      playedWith: [],
      played: 1,
      byeCount: 0,
    }));

  // Mock Helper: Create a previous round where 8 & 6 played together
  // Ranking: P8 (High), P7, P6...
  // Standard 1&3 (P8 & P6) vs 2&4 (P7 & P5).
  // We want to force a collision.
  it("SMART Mode: Should override OneThree strategy if it causes consecutive repeat", () => {
    const players = createPlayers(8);

    // Setup history: P8 and P6 played together
    const p8Input = players.find((p) => p.id === 8);
    const p6Input = players.find((p) => p.id === 6);
    p8Input.playedWith = [6];
    p6Input.playedWith = [8];

    state.schedule = [
      {
        completed: true,
        matches: [
          { team1: [{ id: 8 }, { id: 6 }], team2: [{ id: 1 }, { id: 2 }] },
        ],
      },
    ];

    state.pairingStrategy = "oneThree";
    state.strictStrategy = false; // SMART
    state.maxRepeats = 0; // 0 repeats allowed

    // Run Logic
    const round = generateMexicanoNextRound({
      leaderboard: players,
      manualByes: state.manualByes || [],
      courts: state.courts,
      preferredPartners: state.preferredPartners || [],
      pairingStrategy: state.pairingStrategy,
      maxRepeats: state.maxRepeats,
      strictStrategy: state.strictStrategy
    });

    // Should NOT pair 8 & 6.
    const matchWith8 = round.matches.find(
      (m) => m.team1.some((p) => p.id === 8) || m.team2.some((p) => p.id === 8)
    );

    // Find partner of 8
    let partner;
    if (matchWith8.team1.some((p) => p.id === 8)) {
      partner = matchWith8.team1.find((p) => p.id !== 8);
    } else {
      partner = matchWith8.team2.find((p) => p.id !== 8);
    }

    // In OneThree: Partner is 3rd best (P6).
    // Since we blocked 8&6, it should mismatch.
    expect(partner.id).not.toBe(6);
  });

  it("STRICT Mode: Should ENFORCE OneThree strategy even if it causes consecutive repeat", () => {
    const players = createPlayers(8);

    const p8Input = players.find((p) => p.id === 8);
    const p6Input = players.find((p) => p.id === 6);
    p8Input.playedWith = [6];
    p6Input.playedWith = [8];

    state.schedule = [
      {
        completed: true,
        matches: [
          { team1: [{ id: 8 }, { id: 6 }], team2: [{ id: 1 }, { id: 2 }] },
        ],
      },
    ];

    state.pairingStrategy = "oneThree";
    state.strictStrategy = true; // STRICT
    state.maxRepeats = 0;

    const round = generateMexicanoNextRound({
      leaderboard: players,
      manualByes: state.manualByes || [],
      courts: state.courts,
      preferredPartners: state.preferredPartners || [],
      pairingStrategy: state.pairingStrategy,
      maxRepeats: state.maxRepeats,
      strictStrategy: state.strictStrategy
    });

    // Should pair 8 & 6 because we forced it.
    const matchWith8 = round.matches.find(
      (m) => m.team1.some((p) => p.id === 8) || m.team2.some((p) => p.id === 8)
    );

    let partner;
    if (matchWith8.team1.some((p) => p.id === 8)) {
      partner = matchWith8.team1.find((p) => p.id !== 8);
    } else {
      partner = matchWith8.team2.find((p) => p.id !== 8);
    }

    expect(partner.id).toBe(6);
  });
});

describe("Division Scheduling", () => {
  it("splits oversized division rounds into sub-rounds so all teams play evenly", () => {
    const players = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: `Lag ${i + 1}`,
      divisionId: "div_A",
    }));

    const schedule = generateDivisionSchedule({
      players,
      divisions: [
        { id: "div_A", name: "A", courts: 2, order: 0 }
      ]
    });

    const playedCounts = new Map<number, number>();
    schedule.forEach((round) => {
      round.matches.forEach((match) => {
        [...match.team1, ...match.team2].forEach((player) => {
          const playerId = player.id as number;
          playedCounts.set(playerId, (playedCounts.get(playerId) || 0) + 1);
        });
      });
    });

    expect(schedule).toHaveLength(14);
    players.forEach((player) => {
      expect(playedCounts.get(player.id)).toBe(7);
    });
  });

  it("handles asymmetrical courts gracefully (e.g. 4 vs 2)", () => {
    // 8 players in A (4 courts) -> 4 matches per round -> 7 rounds total
    // 8 players in B (2 courts) -> 2 matches per sub-round -> 14 rounds total
    const playersA = Array.from({ length: 8 }, (_, i) => ({
      id: `A${i + 1}`, name: `Lag A${i + 1}`, divisionId: "div_A",
    }));
    const playersB = Array.from({ length: 8 }, (_, i) => ({
      id: `B${i + 1}`, name: `Lag B${i + 1}`, divisionId: "div_B",
    }));

    const schedule = generateDivisionSchedule({
      players: [...playersA, ...playersB],
      divisions: [
        { id: "div_A", name: "A", courts: 4, order: 0 },
        { id: "div_B", name: "B", courts: 2, order: 1 } // Less courts = longer schedule
      ]
    });

    expect(schedule).toHaveLength(14); // Driven by Div B taking 14 sub-rounds

    // Round 1 should have 4 matches from A + 2 matches from B = 6 matches
    expect(schedule[0].matches).toHaveLength(6);

    // Round 8 should have 0 matches from A + 2 matches from B = 2 matches
    expect(schedule[7].matches).toHaveLength(2);
    // and all 8 teams from A should be in byes
    expect(schedule[7].byes.length).toBeGreaterThanOrEqual(8);
  });
});

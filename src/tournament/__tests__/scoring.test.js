import { describe, it, expect, beforeEach, vi } from "vitest";
import { generateMexicanoNextRound } from "./scoring/index.js";
import { state } from "./core/state.js";

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

  // Mock Helper: Create a previous round where 1&3 played together
  // Ranking: P1 (High), P2, P3...
  // Standard 1&3 vs 2&4 would pair P1 & P3.
  // We want to force a collision.
  it("SMART Mode: Should override OneThree strategy if it causes consecutive repeat", () => {
    const players = createPlayers(8);
    // Leaderboard sorted by points: P8(17pts)... P1(10pts)
    // Wait, generateMexicanoNextRound sorts by points DESC.
    // So P8 is top.
    // Top 4: P8, P7, P6, P5.
    // Standard (oneThree): (P8 & P6) vs (P7 & P5).

    // Let's say in previous round P8 and P6 played together.
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
    const round = generateMexicanoNextRound(players);

    // Should NOT pair 8 & 6.
    // 8 is top.
    const matchWith8 = round.matches.find(
      (m) => m.team1.some((p) => p.id === 8) || m.team2.some((p) => p.id === 8)
    );
    const p8 =
      matchWith8.team1.find((p) => p.id === 8) ||
      matchWith8.team2.find((p) => p.id === 8);
    const partner = matchWith8.team1.find((p) => p.id !== 8)
      ? matchWith8.team1.find((p) => p.id !== 8)
      : matchWith8.team2.find((p) => p.id !== 8);

    // In OneThree: Partner is 3rd best (P6).
    // Since we blocked 8&6, it should mismatch.
    expect(partner.id).not.toBe(6);
  });

  it("STRICT Mode: Should ENFORCE OneThree strategy even if it causes consecutive repeat", () => {
    const players = createPlayers(8);
    // Top 4: P8, P7, P6, P5.
    // Previous round: 8 & 6 played.
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

    const round = generateMexicanoNextRound(players);

    // Should pair 8 & 6 because we forced it.
    const matchWith8 = round.matches.find(
      (m) => m.team1.some((p) => p.id === 8) || m.team2.some((p) => p.id === 8)
    );
    const partner = matchWith8.team1.includes((p) => p.id === 8)
      ? matchWith8.team1.find((p) => p.id !== 8)
      : matchWith8.team1.find((p) => p.id === 8)
      ? matchWith8.team1.find((p) => p.id !== 8)
      : matchWith8.team2.find((p) => p.id !== 8);

    // Finding partner manually
    let p8Partner;
    if (matchWith8.team1.some((p) => p.id === 8))
      p8Partner = matchWith8.team1.find((p) => p.id !== 8);
    else p8Partner = matchWith8.team2.find((p) => p.id !== 8);

    expect(p8Partner.id).toBe(6);
  });
});

import { describe, it, expect, beforeEach, vi } from "vitest";
import { generateMexicanoNextRound } from "../scoring/index.js";
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
    const round = generateMexicanoNextRound(players);

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

    const round = generateMexicanoNextRound(players);

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

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  generateAmericanoSchedule,
  generateTeamSchedule,
  generateMexicanoFirstRound,
  generateMexicanoNextRound,
  generateTeamMexicanoFirstRound,
  generateTeamMexicanoNextRound,
  updatePlayerStats,
  subtractPlayerStats,
} from "../scoring.js";
import { state } from "../state.js";

describe("Tournament Scoring Logic", () => {
  beforeEach(() => {
    // Reset state before each test
    state.players = [];
    state.schedule = [];
    state.leaderboard = [];
    state.courts = 2;
    state.pairingStrategy = "optimal";
    state.manualByes = [];
    state.currentRound = 0;
  });

  describe("Americano Generator", () => {
    it("should generate correct number of rounds for 4 players", () => {
      state.players = [
        { id: 1, name: "P1" },
        { id: 2, name: "P2" },
        { id: 3, name: "P3" },
        { id: 4, name: "P4" },
      ];
      const rounds = generateAmericanoSchedule();
      // Round robin for 4 players = 3 rounds
      expect(rounds.length).toBe(3);
      expect(rounds[0].matches.length).toBe(1);
    });

    it("should handle odd number of players (byes)", () => {
      state.players = [
        { id: 1, name: "P1" },
        { id: 2, name: "P2" },
        { id: 3, name: "P3" },
        { id: 4, name: "P4" },
        { id: 5, name: "P5" },
      ];
      const rounds = generateAmericanoSchedule();
      // Round robin for 5 players = 5 rounds (everyone sits out once)
      expect(rounds.length).toBe(5);

      // Each round should have 1 match (4 players) and 1 bye (plus the virtual bye)
      rounds.forEach((round) => {
        expect(round.byes.length).toBeGreaterThanOrEqual(1);
        expect(round.matches.length).toBe(1);
      });
    });

    it("should generate 2 matches for 8 players", () => {
      state.players = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        name: `P${i}`,
      }));
      const rounds = generateAmericanoSchedule();
      expect(rounds[0].matches.length).toBe(2);
    });
  });

  describe("Team Schedule Generator", () => {
    it("should generate correct rounds for Fixed Teams", () => {
      state.players = [
        { id: 1, name: "Team1" },
        { id: 2, name: "Team2" },
        { id: 3, name: "Team3" },
        { id: 4, name: "Team4" },
      ];
      const rounds = generateTeamSchedule();
      // 4 teams round robin = 3 rounds
      expect(rounds.length).toBe(3);
    });
  });

  describe("Mexicano Logic", () => {
    beforeEach(() => {
      // Setup 8 players for Mexicano (2 courts)
      state.players = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        name: `P${i + 1}`,
      }));
      state.courts = 2;

      // Mock leaderboard initialization
      state.leaderboard = state.players.map((p) => ({
        ...p,
        points: 0,
        played: 0,
        byeCount: 0,
        playedWith: [],
      }));
    });

    it("should generate first round random pairings", () => {
      const round1 = generateMexicanoFirstRound();
      expect(round1[0].matches.length).toBe(2);

      // Check fairness - no duplicate players in matches
      const allPlayersInMatches = round1[0].matches.flatMap((m) => [
        ...m.team1,
        ...m.team2,
      ]);
      const uniqueIds = new Set(allPlayersInMatches.map((p) => p.id));
      expect(uniqueIds.size).toBe(8);
    });

    it("should prioritize byes for players with fewer games", () => {
      // Setup scenario: 9 players, 2 courts (1 bye needed)
      const p9 = { id: 9, name: "P9" };
      state.players.push(p9);
      state.leaderboard.push({ ...p9, points: 0, played: 0, byeCount: 0 });

      // Mock that everyone except P9 has played 1 game
      state.leaderboard.forEach((p) => {
        if (p.id !== 9) p.played = 1;
      });

      // Next round logic looks at Leaderboard to decide who plays
      // generateMexicanoNextRound uses leaderboard as input? No, it uses 'state.leaderboard' internally but documentation says it takes it as param?
      // Let's check implementation. It takes 'leaderboard' as param.

      const nextRound = generateMexicanoNextRound(state.leaderboard);

      // P9 has played 0, others 1. P9 should definitely play.
      const matchPlayers = nextRound.matches.flatMap((m) => [
        ...m.team1,
        ...m.team2,
      ]);
      expect(matchPlayers.find((p) => p.id === 9)).toBeTruthy();
    });

    it("should match top players against each other in later rounds", () => {
      // Setup leaderboard with clear ranking
      state.leaderboard[0].points = 100; // P1
      state.leaderboard[1].points = 90; // P2
      state.leaderboard[2].points = 80; // P3
      state.leaderboard[3].points = 70; // P4
      // Others 0

      state.pairingStrategy = "oneTwo"; // Force 1&2 v 3&4 style groupings if that strategy was selected,
      // OR if 'optimal' it might still group them.
      // Mexicano 'standard' is 1&3 vs 2&4 usually (balanced)
      // or 1&2 vs 3&4 (unbalanced).

      // Let's testing pairing strategy "oneTwo" (1&2 vs 3&4)
      state.pairingStrategy = "oneTwo";

      const nextRound = generateMexicanoNextRound(state.leaderboard);
      const match1 = nextRound.matches[0];

      // Expect top 4 to be in the first match (if courts allow)
      // Note: Sort order might put them in different courts, but they should be grouped.

      const top4Ids = [1, 2, 3, 4];
      const match1Ids = [
        ...match1.team1.map((p) => p.id),
        ...match1.team2.map((p) => p.id),
      ];

      // We expect the top 4 players to be in match 1 because they have the most points
      expect(match1Ids.sort()).toEqual(top4Ids.sort());
    });
  });

  describe("Stats Updates", () => {
    it("should correct update player stats on win", () => {
      const player = { id: 1, name: "P1", points: 0, wins: 0, played: 0 };
      state.leaderboard = [player];

      updatePlayerStats(1, 24, 10, true, false, 2);

      expect(player.points).toBe(24);
      expect(player.played).toBe(1);
      expect(player.wins).toBe(1);
      expect(player.pointsLost).toBe(10);
      expect(player.playedWith).toContain(2);
    });

    it("should correctly subtract stats (undo)", () => {
      const player = {
        id: 1,
        name: "P1",
        points: 24,
        wins: 1,
        played: 1,
        pointsLost: 10,
      };
      state.leaderboard = [player];

      subtractPlayerStats(1, 24, 10, true, false);

      expect(player.points).toBe(0);
      expect(player.played).toBe(0);
      expect(player.wins).toBe(0);
      expect(player.pointsLost).toBe(0);
    });
  });
});

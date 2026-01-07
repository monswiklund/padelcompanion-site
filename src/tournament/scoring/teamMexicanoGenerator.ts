/**
 * Team Mexicano Schedule Generator
 * Dynamic pairing for Team Mexicano format with pairing strategies.
 */

import { shuffleArray } from "../../shared/utils";

interface Player {
  id: string | number;
  name: string;
  points?: number;
  playedAgainst?: (string | number)[];
}

interface Match {
  court: number;
  team1: Player[];
  team2: Player[];
}

interface Round {
  number: number;
  matches: Match[];
  byes: Player[];
}

/**
 * Generate Team Mexicano first round.
 */
export function generateTeamMexicanoFirstRound(
  players: Player[],
  courts: number
): Round[] {
  const teams: Player[] = [...players];
  shuffleArray(teams);

  const matches: Match[] = [];
  const playersInMatches = new Set<string | number>();

  for (let i = 0; i < teams.length - 1 && matches.length < courts; i += 2) {
    matches.push({
      court: matches.length + 1,
      team1: [teams[i]],
      team2: [teams[i + 1]],
    });
    playersInMatches.add(teams[i].id);
    playersInMatches.add(teams[i + 1].id);
  }

  const byes = teams.filter((t) => !playersInMatches.has(t.id));

  return [{ number: 1, matches, byes }];
}

export interface TeamMexicanoNextRoundConfig {
  leaderboard: Player[];
  manualByes: (string | number)[];
  courts: number;
  scheduleLength?: number;
  pairingStrategy?: "optimal" | "oneThree" | "oneTwo" | "oneFour";
  maxRepeats?: number;
}

/**
 * Get repeat count between two teams.
 */
function getRepeatCount(
  team1: Player,
  team2: Player,
  leaderboard: Player[]
): number {
  const t1 = leaderboard.find((t) => t.id === team1.id);
  if (!t1?.playedAgainst) return 0;
  return t1.playedAgainst.filter((id) => id === team2.id).length;
}

/**
 * Apply pairing strategy to sorted teams.
 * Returns pairs of [team1, team2] for matches.
 */
function applyPairingStrategy(
  sorted: Player[],
  strategy: string,
  maxRepeats: number,
  leaderboard: Player[]
): [Player, Player][] {
  const pairs: [Player, Player][] = [];
  const used = new Set<string | number>();

  // For 4 teams: indices would be 0,1,2,3
  // oneTwo: 0v1, 2v3 (top vs 2nd, 3rd vs 4th)
  // oneThree: 0v2, 1v3 (top vs 3rd, 2nd vs 4th)
  // oneFour: 0v3, 1v2 (top vs last, 2nd vs 3rd)
  // optimal: closest ranks that haven't played too often

  if (strategy === "optimal") {
    // Pair adjacent teams, respecting maxRepeats
    const available = [...sorted];

    while (available.length >= 2) {
      const t1 = available.shift()!;
      used.add(t1.id);

      // Find best opponent (closest rank, respecting maxRepeats)
      let bestIdx = 0;
      let bestScore = Infinity;

      for (let i = 0; i < available.length; i++) {
        const repeats = getRepeatCount(t1, available[i], leaderboard);
        const rankDiff = i; // Already sorted, so index = rank difference
        const score = repeats > maxRepeats ? 1000 + rankDiff : rankDiff;

        if (score < bestScore) {
          bestScore = score;
          bestIdx = i;
        }
      }

      const t2 = available.splice(bestIdx, 1)[0];
      used.add(t2.id);
      pairs.push([t1, t2]);
    }
  } else {
    // Fixed pattern pairing
    const available = sorted.filter((t) => !used.has(t.id));

    for (let i = 0; i < Math.floor(available.length / 4) * 4; i += 4) {
      const group = available.slice(i, i + 4);
      if (group.length < 4) break;

      let pair1: [Player, Player];
      let pair2: [Player, Player];

      switch (strategy) {
        case "oneTwo": // 1v2, 3v4
          pair1 = [group[0], group[1]];
          pair2 = [group[2], group[3]];
          break;
        case "oneThree": // 1v3, 2v4
          pair1 = [group[0], group[2]];
          pair2 = [group[1], group[3]];
          break;
        case "oneFour": // 1v4, 2v3
          pair1 = [group[0], group[3]];
          pair2 = [group[1], group[2]];
          break;
        default: // fallback to 1v2
          pair1 = [group[0], group[1]];
          pair2 = [group[2], group[3]];
      }

      pairs.push(pair1, pair2);
      group.forEach((t) => used.add(t.id));
    }

    // Handle remaining teams (2 or 3 left) with simple pairing
    const remaining = available.filter((t) => !used.has(t.id));
    for (let i = 0; i < remaining.length - 1; i += 2) {
      pairs.push([remaining[i], remaining[i + 1]]);
    }
  }

  return pairs;
}

/**
 * Generate Team Mexicano next round based on standings.
 */
export function generateTeamMexicanoNextRound(
  config: TeamMexicanoNextRoundConfig
): Round {
  const {
    leaderboard,
    manualByes,
    courts,
    scheduleLength = 0,
    pairingStrategy = "optimal",
    maxRepeats = 99,
  } = config;

  const sorted: Player[] = [...leaderboard].sort(
    (a: Player, b: Player) => (b.points || 0) - (a.points || 0)
  );

  const available = sorted.filter((t) => !manualByes.includes(t.id));
  const manualByePlayers = sorted.filter((t) => manualByes.includes(t.id));

  // Apply pairing strategy
  const pairs = applyPairingStrategy(
    available,
    pairingStrategy,
    maxRepeats,
    leaderboard
  );

  const matches: Match[] = [];
  const playersInMatches = new Set<string | number>();

  // Create matches from pairs (up to court limit)
  for (let i = 0; i < pairs.length && matches.length < courts; i++) {
    const [t1, t2] = pairs[i];
    matches.push({
      court: matches.length + 1,
      team1: [t1],
      team2: [t2],
    });
    playersInMatches.add(t1.id);
    playersInMatches.add(t2.id);
  }

  const byes = [
    ...manualByePlayers,
    ...available.filter((t) => !playersInMatches.has(t.id)),
  ];

  return { number: scheduleLength + 1, matches, byes };
}

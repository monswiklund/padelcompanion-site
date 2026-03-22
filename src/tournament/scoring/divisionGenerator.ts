/**
 * Division Schedule Generator
 * Round-Robin algorithm for division-based tournament play.
 * Each division runs independently with its own courts.
 */

interface Player {
  id: string | number;
  name: string;
  division?: string;
  [key: string]: any;
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
 * Generate round-robin pairings for a list of teams.
 * Uses the "circle method" algorithm to ensure all teams play each other exactly once.
 * Returns an array of rounds, each containing an array of match pairings.
 */
function generateRoundRobin(teams: Player[]): [Player, Player][][] {
  const n = teams.length;
  const logicalRounds: [Player, Player][][] = [];

  // If odd number of teams, add a BYE placeholder
  const teamList = [...teams];
  const hasOddTeams = n % 2 !== 0;
  if (hasOddTeams) {
    teamList.push({ id: "__bye__", name: "BYE", isBye: true });
  }

  const numTeams = teamList.length;

  // Custom Optimal 8-Team Schedule (User Requested)
  if (numTeams === 8 && !hasOddTeams) {
    // The user provided the optimal pairings sequence for 8 teams across 7 rounds (4 matches per round)
    // We map the incoming teams to this structure
    // Teams index 0-7 represents Lag 1-8
    const t = teamList;
    const customPairingsIndices = [
      // Round 1
      [[0, 7], [1, 6], [2, 5], [3, 4]],
      // Round 2
      [[0, 6], [7, 5], [1, 4], [2, 3]],
      // Round 3
      [[0, 5], [6, 4], [7, 3], [1, 2]],
      // Round 4
      [[0, 4], [5, 3], [6, 2], [7, 1]],
      // Round 5
      [[0, 3], [4, 2], [5, 1], [6, 7]],
      // Round 6
      [[0, 2], [3, 1], [4, 7], [5, 6]],
      // Round 7
      [[0, 1], [2, 7], [3, 6], [4, 5]]
    ];

    return customPairingsIndices.map(roundStr => 
      roundStr.map(pair => [t[pair[0]], t[pair[1]]] as [Player, Player])
    );
  }

  const numRounds = numTeams - 1;
  const half = numTeams / 2;

  // Fix first team, rotate the rest
  const fixed = teamList[0];
  const rotating = teamList.slice(1);

  for (let r = 0; r < numRounds; r++) {
    const roundPairings: [Player, Player][] = [];
    const current = [fixed, ...rotating];

    for (let i = 0; i < half; i++) {
      const home = current[i];
      const away = current[numTeams - 1 - i];

      // Skip matches involving the BYE
      if (home.id === "__bye__" || away.id === "__bye__") continue;

      roundPairings.push([home, away]);
    }

    logicalRounds.push(roundPairings);

    // Rotate: move last element to front of rotating array
    rotating.unshift(rotating.pop()!);
  }

  return logicalRounds;
}

import { DivisionConfig } from "../core/state";

export interface DivisionScheduleConfig {
  players: Player[];
  divisions: DivisionConfig[];
}

/**
 * Generate a complete division schedule.
 * Groups players by divisionId, generates round-robin within each division,
 * and merges rounds across divisions so they can run in parallel.
 * Courts are assigned sequentially across divisions based on division order.
 */
export function generateDivisionSchedule(
  config: DivisionScheduleConfig
): Round[] {
  const { players, divisions } = config;

  // Group players by divisionId
  const teamsByDivId = new Map<string, Player[]>();
  divisions.forEach(d => teamsByDivId.set(d.id, []));

  players.forEach((p) => {
    const divId = p.divisionId || divisions[0]?.id; // fallback to first division if empty
    if (divId && teamsByDivId.has(divId)) {
      teamsByDivId.get(divId)!.push(p);
    }
  });

  // Sort divisions by predefined order for deterministic court assignment
  const sortedDivisions = [...divisions].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Generate logical round-robin for each division. If a logical round has 
  // more matches than available courts, it is split into multiple sub-rounds.
  const divisionSubRounds = new Map<string, [Player, Player][][]>();
  let maxMergedRounds = 0;

  for (const div of sortedDivisions) {
    const teams = teamsByDivId.get(div.id)!;
    if (!teams || teams.length === 0) {
      divisionSubRounds.set(div.id, []);
      continue;
    }

    const logicalRounds = generateRoundRobin(teams);
    const subRounds: [Player, Player][][] = [];
    const courtsForThisDivision = Math.max(1, div.courts); // Ensure at least 1 court per division

    logicalRounds.forEach((roundPairings) => {
      for (let idx = 0; idx < roundPairings.length; idx += courtsForThisDivision) {
        subRounds.push(roundPairings.slice(idx, idx + courtsForThisDivision));
      }
    });

    divisionSubRounds.set(div.id, subRounds);
    maxMergedRounds = Math.max(maxMergedRounds, subRounds.length);
  }

  // Merge process: combine sub-rounds from all divisions into global Merged Rounds
  const mergedSchedule: Round[] = [];

  for (let r = 0; r < maxMergedRounds; r++) {
    const matches: Match[] = [];
    const byes: Player[] = [];

    let currentCourtOffset = 0;

    for (const div of sortedDivisions) {
      const subRounds = divisionSubRounds.get(div.id)!;
      const divTeams = teamsByDivId.get(div.id)!;
      const courtsForThisDivision = Math.max(1, div.courts);

      if (divTeams.length === 0) {
        currentCourtOffset += courtsForThisDivision;
        continue;
      }

      if (r < subRounds.length) {
        const roundPairings = subRounds[r];

        roundPairings.forEach((pair, mIdx) => {
          matches.push({
            court: currentCourtOffset + mIdx + 1,
            team1: [pair[0]],
            team2: [pair[1]],
          });
        });
      } else {
        // This division has no more rounds; all its teams are idle
        byes.push(...divTeams);
      }

      currentCourtOffset += courtsForThisDivision;
    }

    mergedSchedule.push({
      number: r + 1,
      matches,
      byes,
    });
  }

  return mergedSchedule;
}

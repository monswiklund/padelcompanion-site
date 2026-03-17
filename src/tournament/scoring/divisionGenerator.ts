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
  const rounds: [Player, Player][][] = [];

  // If odd number of teams, add a BYE placeholder
  const teamList = [...teams];
  const hasOddTeams = n % 2 !== 0;
  if (hasOddTeams) {
    teamList.push({ id: "__bye__", name: "BYE", isBye: true });
  }

  const numTeams = teamList.length;
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

    rounds.push(roundPairings);

    // Rotate: move last element to front of rotating array
    rotating.unshift(rotating.pop()!);
  }

  return rounds;
}

export interface DivisionScheduleConfig {
  players: Player[];
  courtsPerDivision: number;
}

/**
 * Generate a complete division schedule.
 * Groups players by division, generates round-robin within each division,
 * and merges rounds across divisions so they can run in parallel.
 */
export function generateDivisionSchedule(
  config: DivisionScheduleConfig
): Round[] {
  const { players, courtsPerDivision } = config;

  // Group players by division
  const divisions = new Map<string, Player[]>();
  players.forEach((p) => {
    const div = p.division || "A";
    if (!divisions.has(div)) divisions.set(div, []);
    divisions.get(div)!.push(p);
  });

  // Sort division names for deterministic court assignment
  const divNames = [...divisions.keys()].sort();

  // Generate round-robin for each division
  const divisionRounds = new Map<string, [Player, Player][][]>();
  let maxRounds = 0;

  for (const divName of divNames) {
    const teams = divisions.get(divName)!;
    const rounds = generateRoundRobin(teams);
    divisionRounds.set(divName, rounds);
    maxRounds = Math.max(maxRounds, rounds.length);
  }

  // Merge rounds: for each round number, combine matches from all divisions
  const schedule: Round[] = [];

  for (let r = 0; r < maxRounds; r++) {
    const matches: Match[] = [];
    const byes: Player[] = [];

    for (let dIdx = 0; dIdx < divNames.length; dIdx++) {
      const divName = divNames[dIdx];
      const divRounds = divisionRounds.get(divName)!;
      const divTeams = divisions.get(divName)!;
      const courtOffset = dIdx * courtsPerDivision;

      if (r < divRounds.length) {
        const roundPairings = divRounds[r];

        // Assign courts within the division's allocation
        // If more pairings than courts, split into sub-rounds (handled later)
        const pairingsForThisRound = roundPairings.slice(0, courtsPerDivision);
        const overflow = roundPairings.slice(courtsPerDivision);

        pairingsForThisRound.forEach((pair, mIdx) => {
          matches.push({
            court: courtOffset + mIdx + 1,
            team1: [pair[0]],
            team2: [pair[1]],
          });
        });

        // Players in overflow matches are effectively waiting (byes for this sub-round)
        overflow.forEach((pair) => {
          byes.push(pair[0], pair[1]);
        });

        // Players not in any match this round (when division finished earlier)
      } else {
        // This division has no more rounds; all its teams are idle
        byes.push(...divTeams);
      }
    }

    schedule.push({
      number: r + 1,
      matches,
      byes,
    });
  }

  return schedule;
}

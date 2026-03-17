import type {
  Match,
  Player,
  Round,
  TournamentState,
} from "@/context/TournamentContext";
import { sortLeaderboard } from "./playerStats";

/**
 * Generate Semifinal round for Division mode
 * 1st vs 4th, 2nd vs 3rd within each division
 */
export function generateSemifinals(state: TournamentState): Round {
  const { leaderboard, players, rankingCriteria, tiebreaker } = state;
  const divisions = Array.from(new Set(players.map((p: any) => p.division || "A"))).sort();
  const matches: Match[] = [];
  let courtCounter = 1;

  divisions.forEach((div) => {
    // Filter standings for this division
    const divPlayers = leaderboard.filter((p: any) => {
      const playerObj = players.find((pOrig) => pOrig.id === p.id);
      return (playerObj as any)?.division === div;
    });

    // 1. Sort using matchPoints (3, 1, 0)
    const sorted = sortLeaderboard(divPlayers, "matchPoints", tiebreaker);
    console.log(`[Playoff] Division ${div} standings:`, sorted.map(p => `${p.name} (${p.matchPoints}pts)`));

    if (sorted.length >= 4) {
      const topTeams = sorted.slice(0, 4);
      
      // Semifinal 1: 1st vs 4th
      matches.push({
        court: courtCounter++,
        team1: [players.find(p => p.id === topTeams[0].id)!],
        team2: [players.find(p => p.id === topTeams[3].id)!],
      });

      // Semifinal 2: 2nd vs 3rd
      matches.push({
        court: courtCounter++,
        team1: [players.find(p => p.id === topTeams[1].id)!],
        team2: [players.find(p => p.id === topTeams[2].id)!],
      });
    }
  });

  return {
    number: 0, // Will be set to next available number
    name: "Semifinal",
    matches,
    byes: [],
    completed: false
  };
}

/**
 * Generate Finals based on Semifinal results
 */
export function generateFinals(semifinalRound: Round, players: Player[]): Round {
  const matches: Match[] = [];
  let courtCounter = 1;

  // Assuming matches are ordered [DivA 1v4, DivA 2v3, DivB 1v4, DivB 2v3...]
  for (let i = 0; i < semifinalRound.matches.length; i += 2) {
    const match1 = semifinalRound.matches[i];
    const match2 = semifinalRound.matches[i + 1];

    if (match1 && match2) {
      const winner1 = (match1.score1 || 0) > (match1.score2 || 0) ? match1.team1 : match1.team2;
      const winner2 = (match2.score1 || 0) > (match2.score2 || 0) ? match2.team1 : match2.team2;

      matches.push({
        court: courtCounter++,
        team1: winner1,
        team2: winner2,
      });
    }
  }

  return {
    number: 0,
    name: "Final",
    matches,
    byes: [],
    completed: false
  };
}

/**
 * Bracket Generation Module
 * Handles single bracket generation and seeding.
 */

/**
 * Generate a single elimination bracket from teams.
 * @param {Array<{id: string, name: string}>} teams - Team list
 * @returns {Object} Bracket structure with rounds and matches
 */
export function generateBracket(teams) {
  const teamCount = teams.length;

  // Calculate bracket size (next power of 2)
  let bracketSize = 1;
  while (bracketSize < teamCount) {
    bracketSize *= 2;
  }

  // Seed teams
  const seeded = seedTeams(teams, bracketSize);

  // Calculate number of rounds
  const numRounds = Math.log2(bracketSize);

  // Create matches array
  const matches = [];
  let matchId = 1;

  // First round
  const firstRoundMatchCount = bracketSize / 2;
  for (let i = 0; i < firstRoundMatchCount; i++) {
    const team1 = seeded[i * 2];
    const team2 = seeded[i * 2 + 1];

    matches.push({
      id: matchId++,
      round: 1,
      position: i,
      team1Id: team1 ? team1.id : null,
      team2Id: team2 ? team2.id : null,
      team1Name: team1 ? team1.name : "BYE",
      team2Name: team2 ? team2.name : "BYE",
      score1: null,
      score2: null,
      winnerId: null,
      completed: false,
      nextMatchId: null,
      isBye: !team1 || !team2,
    });
  }

  // Subsequent rounds
  for (let round = 2; round <= numRounds; round++) {
    const matchesInRound = bracketSize / Math.pow(2, round);
    const prevRoundStart = matches.length - matchesInRound * 2;

    for (let i = 0; i < matchesInRound; i++) {
      const prevMatch1 = matches[prevRoundStart + i * 2];
      const prevMatch2 = matches[prevRoundStart + i * 2 + 1];

      const newMatch = {
        id: matchId++,
        round,
        position: i,
        team1Id: null,
        team2Id: null,
        team1Name: null,
        team2Name: null,
        score1: null,
        score2: null,
        winnerId: null,
        completed: false,
        nextMatchId: null,
        isBye: false,
        prevMatch1Id: prevMatch1.id,
        prevMatch2Id: prevMatch2.id,
      };

      // Link previous matches to this one
      prevMatch1.nextMatchId = newMatch.id;
      prevMatch2.nextMatchId = newMatch.id;

      matches.push(newMatch);
    }
  }

  // Auto-advance byes in first round
  matches
    .filter((m) => m.round === 1 && m.isBye)
    .forEach((m) => {
      if (m.team1Id && !m.team2Id) {
        m.winnerId = m.team1Id;
        m.completed = true;
        advanceWinner(matches, m, teams);
      } else if (m.team2Id && !m.team1Id) {
        m.winnerId = m.team2Id;
        m.completed = true;
        advanceWinner(matches, m, teams);
      }
    });

  return {
    teams,
    matches,
    numRounds,
    bracketSize,
  };
}

/**
 * Seed teams for bracket based on side assignments.
 * @param {Array} teams - Team list
 * @param {number} bracketSize - Bracket size
 * @returns {Array} Seeded teams
 */
export function seedTeams(teams, bracketSize) {
  const seeded = new Array(bracketSize).fill(null);

  // Separate by side
  const sideA = teams.filter((t) => t.side === "A");
  const sideB = teams.filter((t) => t.side === "B");
  const noSide = teams.filter(
    (t) => !t.side || (t.side !== "A" && t.side !== "B")
  );

  // Place Side A in top half
  const topHalf = [...sideA];
  // Place Side B in bottom half
  const bottomHalf = [...sideB];

  // Distribute no-side teams evenly
  noSide.forEach((t, i) => {
    if (i % 2 === 0) topHalf.push(t);
    else bottomHalf.push(t);
  });

  // Simple sequential placement
  const halfSize = bracketSize / 2;
  topHalf.forEach((t, i) => {
    if (i < halfSize) seeded[i] = t;
  });
  bottomHalf.forEach((t, i) => {
    if (i < halfSize) seeded[halfSize + i] = t;
  });

  return seeded;
}

/**
 * Get team by ID from teams array.
 * @param {Array} teams - Team list
 * @param {string} id - Team ID
 * @returns {Object|undefined} Team object
 */
export function getTeamById(teams, id) {
  return teams.find((t) => t.id === id);
}

/**
 * Advance winner to next match.
 * @param {Array} matches - All matches
 * @param {Object} match - Completed match
 * @param {Array} teams - All teams
 */
function advanceWinner(matches, match, teams) {
  if (!match.nextMatchId || !match.winnerId) return;

  const nextMatch = matches.find((m) => m.id === match.nextMatchId);
  if (!nextMatch) return;

  const winner = getTeamById(teams, match.winnerId);
  if (!winner) return;

  // Determine if this is team1 or team2 in next match
  if (nextMatch.prevMatch1Id === match.id) {
    nextMatch.team1Id = winner.id;
    nextMatch.team1Name = winner.name;
  } else {
    nextMatch.team2Id = winner.id;
    nextMatch.team2Name = winner.name;
  }
}

/**
 * Get round name (Final, Semi-final, etc.).
 * @param {number} round - Round number
 * @param {number} totalRounds - Total rounds
 * @returns {string} Round name
 */
export function getRoundName(round, totalRounds) {
  const fromEnd = totalRounds - round;
  if (fromEnd === 0) return "Final";
  if (fromEnd === 1) return "Semi-Finals";
  if (fromEnd === 2) return "Quarter-Finals";
  return `Round ${round}`;
}

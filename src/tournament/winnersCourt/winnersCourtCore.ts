/**
 * Pure Winners Court generation functions
 * No state mutation - returns data only
 */

// ============ TYPES ============

export interface WCPlayer {
  id: string;
  name: string;
  side: "A" | "B" | null;
}

export interface WCCourt {
  id: number;
  team1: WCPlayer[];
  team2: WCPlayer[];
  score1: number;
  score2: number;
  winner: 1 | 2 | null;
}

export interface WCSideState {
  courts: WCCourt[];
  queue: WCPlayer[];
  round: number;
  history: WCRoundHistory[];
}

export interface WCRoundHistory {
  round: number;
  courts: WCCourt[];
}

export interface WinnersCourtState {
  sides: Record<string, WCSideState>;
  twist: boolean;
}

export interface WCConfig {
  courtCountA: number;
  courtCountB: number;
  splitSides: boolean;
  twist: boolean;
}

// ============ HELPER FUNCTIONS ============

/**
 * Shuffle array using Fisher-Yates
 */
function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Create courts from a list of players
 */
function createCourts(
  players: WCPlayer[],
  courtCount: number
): { courts: WCCourt[]; queue: WCPlayer[] } {
  const courts: WCCourt[] = [];
  let playerIdx = 0;

  for (let c = 0; c < courtCount; c++) {
    if (playerIdx + 4 > players.length) break;

    courts.push({
      id: c + 1,
      team1: [players[playerIdx++], players[playerIdx++]],
      team2: [players[playerIdx++], players[playerIdx++]],
      score1: 0,
      score2: 0,
      winner: null,
    });
  }

  return {
    courts,
    queue: players.slice(playerIdx),
  };
}

// ============ MAIN GENERATION FUNCTIONS ============

/**
 * Generate Winners Court state from players
 */
export function generateWinnersCourt(
  players: WCPlayer[],
  config: WCConfig
): WinnersCourtState {
  const { courtCountA, courtCountB, splitSides, twist } = config;
  const sides: Record<string, WCSideState> = {};

  if (splitSides) {
    // Split mode - separate A and B sides
    const playersA = shuffleArray(players.filter((p) => p.side !== "B"));
    const playersB = shuffleArray(players.filter((p) => p.side === "B"));

    if (playersA.length >= 4 && courtCountA >= 1) {
      const { courts, queue } = createCourts(playersA, courtCountA);
      sides["A"] = { courts, queue, round: 1, history: [] };
    }

    if (playersB.length >= 4 && courtCountB >= 1) {
      const { courts, queue } = createCourts(playersB, courtCountB);
      sides["B"] = { courts, queue, round: 1, history: [] };
    }
  } else {
    // Single side mode - everyone is Side A
    const shuffled = shuffleArray(players);
    const { courts, queue } = createCourts(shuffled, courtCountA);

    if (courts.length > 0) {
      sides["A"] = { courts, queue, round: 1, history: [] };
    }
  }

  return { sides, twist };
}

/**
 * Record a court result (winner = 1 or 2).
 * Returns new state.
 */
export function recordCourtResult(
  state: WinnersCourtState,
  side: string,
  courtIndex: number,
  winner: 1 | 2
): WinnersCourtState {
  if (!state.sides[side]) return state;

  const newSides = { ...state.sides };
  const sideState = { ...newSides[side] };
  const courts = [...sideState.courts];

  if (!courts[courtIndex]) return state;

  courts[courtIndex] = { ...courts[courtIndex], winner };
  sideState.courts = courts;
  newSides[side] = sideState;

  return { ...state, sides: newSides };
}

/**
 * Check if all courts in a side have results.
 */
export function allCourtsComplete(
  state: WinnersCourtState,
  side: string
): boolean {
  if (!state.sides[side]) return false;
  return state.sides[side].courts.every((c) => c.winner !== null);
}

/**
 * Advance to the next round (winners move up, losers move down).
 * Returns new state or error.
 */
export function advanceRound(
  state: WinnersCourtState,
  side: string
): WinnersCourtState | { error: string } {
  if (!state.sides[side]) return { error: "Side not found" };

  const sideState = state.sides[side];

  // Check all courts complete
  if (!allCourtsComplete(state, side)) {
    return { error: "Not all courts have results" };
  }

  // Collect winners and losers
  const winners: WCPlayer[] = [];
  const losers: WCPlayer[] = [];

  sideState.courts.forEach((court) => {
    if (court.winner === 1) {
      winners.push(...court.team1);
      losers.push(...court.team2);
    } else {
      winners.push(...court.team2);
      losers.push(...court.team1);
    }
  });

  // Create new history entry
  const newHistory: WCRoundHistory[] = [
    ...sideState.history,
    {
      round: sideState.round,
      courts: JSON.parse(JSON.stringify(sideState.courts)),
    },
  ];

  // Promote winners to top court, demote losers
  let processingWinners = [...winners];
  let processingLosers = [...losers];

  if (state.twist) {
    // Twist logic: Split partners (assuming pairs are adjacent locally)
    // We take evens and odds to separate partners
    const twistList = (list: WCPlayer[]) => {
      if (list.length < 2) return list;
      const evens = list.filter((_, i) => i % 2 === 0);
      const odds = list.filter((_, i) => i % 2 === 1);
      return [...evens, ...odds];
    };

    processingWinners = twistList(processingWinners);
    processingLosers = twistList(processingLosers);
  }

  const allPlayers = [
    ...processingWinners,
    ...sideState.queue,
    ...processingLosers,
  ];
  const courtCount = sideState.courts.length;
  const { courts: newCourts, queue: newQueue } = createCourts(
    allPlayers,
    courtCount
  );

  const newSides = { ...state.sides };
  newSides[side] = {
    courts: newCourts,
    queue: newQueue,
    round: sideState.round + 1,
    history: newHistory,
  };

  return { ...state, sides: newSides };
}

/**
 * Clear a specific side from Winners Court state.
 */
export function clearSide(
  state: WinnersCourtState,
  side: string
): WinnersCourtState | null {
  if (!state.sides[side]) return state;

  const newSides = { ...state.sides };
  delete newSides[side];

  // If no sides left, return null to clear entirely
  if (Object.keys(newSides).length === 0) {
    return null;
  }

  return { ...state, sides: newSides };
}

/**
 * Clear Winners Court (return null)
 */
export function clearWinnersCourt(): null {
  return null;
}

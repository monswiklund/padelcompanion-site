import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { StorageService } from "@/shared/storage";
import {
  generateMexicanoNextRound,
  generateTeamMexicanoNextRound,
} from "@/tournament/scoring";
import {
  calculateUpdatedLeaderboard,
  sortLeaderboard,
  type LeaderboardPlayer,
} from "@/tournament/scoring/playerStats";
import {
  generateFinals,
  generateSemifinals,
} from "@/tournament/scoring/playoffGenerator";
import {
  WinnersCourtState,
  recordCourtResult,
  advanceRound,
  clearSide,
} from "@/tournament/winnersCourt/winnersCourtCore";
import { updateMatchResult } from "@/tournament/bracket/bracketCore";
import { normalizeTournamentState } from "@/tournament/core/normalization";

// --- Types ---
export interface Player {
  id: string;
  name: string;
  lockedCourt?: number | null;
  division?: string;
}

export interface PreferredPartner {
  id: string;
  player1Id: string;
  player2Id: string;
}

export interface Match {
  court: number;
  team1: Player[];
  team2: Player[];
  score1?: number;
  score2?: number;
  relaxedConstraint?: string;
}

export interface Round {
  number: number;
  name?: string;
  completed?: boolean;
  matches: Match[];
  byes?: Player[];
  durationSeconds?: number;
}

export interface TournamentState {
  version: number;
  players: Player[];
  format: "americano" | "mexicano" | "team" | "teamMexicano" | "division";
  courts: number;
  scoringMode: "total" | "race" | "time";
  pointsPerMatch: number;
  rankingCriteria: "points" | "wins" | "winRatio" | "pointRatio";
  courtFormat: "number" | "court" | "custom";
  customCourtNames: string[];
  divisionCourtNames: Record<string, string[]>;
  maxRepeats: number;
  pairingStrategy: "optimal" | "oneTwo" | "oneThree" | "oneFour";
  strictStrategy: boolean;
  preferredPartners: PreferredPartner[];
  manualByes: string[];
  hideLeaderboard: boolean;
  showPositionChanges: boolean;
  gridColumns: number;
  leaderboardColumns: number;
  textSize: number;
  bracketScale: number;
  isLocked: boolean;
  allowCourtChange: boolean;
  tournamentName: string;
  tournamentNotes: string;
  schedule: Round[];
  currentRound: number;
  roundStartedAt: number | null;
  sessionStartedAt: number | null;
  leaderboard: any[];
  allRounds: Round[] | null;
  historyData: any[];
  timer: {
    remainingSeconds: number;
    isRunning: boolean;
    duration: number;
    status: "idle" | "running" | "paused" | "completed";
  };
  winnersCourt: any | null;
  bracket: {
    format: string;
    teams: any[];
    matches: any[];
    standings: any[];
    meta: { name: string; notes: string; createdAt: string | null };
    matchesA?: any[];
    matchesB?: any[];
    grandFinal?: any | null;
    numRoundsA?: number;
    numRoundsB?: number;
    numRounds?: number;
    isDualBracket?: boolean;
    teamsA?: any[];
    teamsB?: any[];
  } | null;
  plannedStartTime: string;
  matchDuration: number;
  bracketConfig?: {
    scoreType: string;
    mode: "teams" | "players";
    bracketCount?: number;
  };
  ui: {
    currentRoute: string;
    selectedMatchId: string | null;
    activeBracketTab: string;
  };
  tiebreaker?: "difference" | "most_won" | "shared";
  divisionCourts?: number;
  [key: string]: any;
}

const DEFAULT_STATE: TournamentState = {
  version: 1,
  players: [],
  format: "americano",
  courts: 2,
  scoringMode: "total",
  pointsPerMatch: 24,
  rankingCriteria: "points",
  courtFormat: "court",
  customCourtNames: [],
  divisionCourtNames: {},
  maxRepeats: 99,
  pairingStrategy: "optimal",
  strictStrategy: false,
  preferredPartners: [],
  manualByes: [],
  hideLeaderboard: true,
  showPositionChanges: false,
  gridColumns: 0,
  leaderboardColumns: 1,
  textSize: 100,
  bracketScale: 100,
  isLocked: false,
  allowCourtChange: true,
  tournamentName: "",
  tournamentNotes: "",
  schedule: [],
  currentRound: 0,
  roundStartedAt: null,
  sessionStartedAt: null,
  leaderboard: [],
  allRounds: null,
  historyData: [],
  timer: {
    remainingSeconds: 720,
    isRunning: false,
    duration: 12,
    status: "idle",
  },
  winnersCourt: null,
  bracket: null,
  tiebreaker: "difference",
  divisionCourts: 2,
  ui: {
    currentRoute: "",
    selectedMatchId: null,
    activeBracketTab: "A",
  },
  plannedStartTime: "17:00",
  matchDuration: 15,
};

const STORAGE_KEY = "tournament-state";

function buildInitialLeaderboard(players: Player[]): LeaderboardPlayer[] {
  return players.map((player, index) => ({
    id: player.id,
    name: player.name,
    division: player.division,
    points: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    matchPoints: 0,
    played: 0,
    pointsLost: 0,
    byeCount: 0,
    playedWith: [],
    previousRank: index + 1,
  }));
}

function recalculateLeaderboard(
  players: Player[],
  completedRounds: Round[],
  rankingCriteria: TournamentState["rankingCriteria"],
): LeaderboardPlayer[] {
  let leaderboard = buildInitialLeaderboard(players);

  // Only include rounds that are NOT playoffs (league rounds usually don't have a name)
  const leagueRounds = completedRounds.filter(r => !r.name);

  leagueRounds.forEach((round) => {
    const sortedCurrent = sortLeaderboard(leaderboard, rankingCriteria);
    const currentRankMap = new Map<string | number, number>();
    sortedCurrent.forEach((player, idx) => currentRankMap.set(player.id, idx + 1));

    const leaderboardWithPrevRanks = leaderboard.map((player) => ({
      ...player,
      previousRank: currentRankMap.get(player.id) ?? player.previousRank,
    }));

    leaderboard = calculateUpdatedLeaderboard(
      leaderboardWithPrevRanks,
      round.matches,
      round.byes || [],
    );
  });

  return leaderboard;
}

// --- Context ---
interface TournamentContextType {
  state: TournamentState;
  dispatch: (action: StateAction) => void;
  save: () => void;
  reset: () => void;
  undo: () => void;
  canUndo: boolean;
  isLoaded: boolean;
}

type StateAction =
  | { type: "SET_STATE"; payload: Partial<TournamentState> }
  | { type: "UPDATE_FIELD"; key: keyof TournamentState; value: any }
  | { type: "ADD_PLAYER"; player: Player }
  | { type: "ADD_LATE_PLAYER"; player: Player }
  | { type: "REMOVE_PLAYER"; playerId: string }
  | { type: "CLEAR_PLAYERS" }
  | { type: "RESET_TOURNAMENT" }
  | { type: "COMPLETE_ROUND" }
  | { type: "EDIT_ROUND"; roundIndex: number; matchIndex?: number }
  | { type: "SET_BRACKET"; bracket: any; config?: any }
  | {
      type: "UPDATE_BRACKET_RESULT";
      matchId: number;
      score1: number;
      score2: number;
    }
  | { type: "CLEAR_BRACKET" }
  | { type: "UPDATE_BRACKET_SCALE"; scale: number }
  | { type: "SET_HISTORY"; history: any[] }
  | { type: "UPDATE_TIMER"; payload: Partial<TournamentState["timer"]> }
  // WinnersCourt Actions
  | { type: "SET_WINNERS_COURT"; winnersCourtState: WinnersCourtState | null }
  | {
      type: "UPDATE_WC_RESULT";
      side: string;
      courtIndex: number;
      winner: 1 | 2;
    }
  | { type: "ADVANCE_WC_ROUND"; side: string }
  | { type: "CLEAR_WC_SIDE"; side: string }
  | {
      type: "SWAP_MATCH_COURT";
      roundIndex: number;
      matchIndex: number;
      newCourt: number;
    }
  | { type: "ADD_ROUND"; round: Round };

const TournamentContext = createContext<TournamentContextType | undefined>(
  undefined
);

// --- Provider ---
export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<TournamentState>(DEFAULT_STATE);
  const [undoStack, setUndoStack] = useState<TournamentState[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state on mount
  useEffect(() => {
    const saved = StorageService.getItem(STORAGE_KEY);
    if (saved) {
      setState((prev) => {
        const merged = {
          ...prev,
          ...saved,
          divisionCourtNames:
            saved.divisionCourtNames &&
            typeof saved.divisionCourtNames === "object" &&
            !Array.isArray(saved.divisionCourtNames)
              ? saved.divisionCourtNames
              : prev.divisionCourtNames,
        };
        return normalizeTournamentState(merged as any);
      });
    }
    setIsLoaded(true);
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    if (isLoaded) {
      StorageService.setItem(STORAGE_KEY, state);
      (window as any).state = state;
    }
  }, [state, isLoaded]);

  const undo = useCallback(() => {
    setUndoStack((prevStack) => {
      if (prevStack.length === 0) return prevStack;
      const previousState = prevStack[prevStack.length - 1];
      const newStack = prevStack.slice(0, -1);
      setState(previousState);
      return newStack;
    });
  }, []);

  const dispatch = useCallback((action: StateAction) => {
    setState((prev) => {
      // Actions that should trigger an undo checkpoint
      const undoableActions = [
        "COMPLETE_ROUND",
        "EDIT_ROUND",
        "SWAP_MATCH_COURT",
        "ADD_LATE_PLAYER",
        "REMOVE_PLAYER",
        "RESET_TOURNAMENT",
      ];

      let shouldSnapshot = undoableActions.includes(action.type);

      // Special case for UPDATE_FIELD: only snapshot if it's a "data" field (like schedule)
      if (action.type === "UPDATE_FIELD") {
        const dataFields = ["schedule", "players", "leaderboard", "format", "allowCourtChange"];
        if (dataFields.includes(action.key as string)) {
          shouldSnapshot = true;
        }
      }

      if (shouldSnapshot) {
        setUndoStack((stack) => {
          const newStack = [...stack, prev];
          if (newStack.length > 20) newStack.shift();
          return newStack;
        });
      }

      switch (action.type) {
        case "SET_STATE":
          return { ...prev, ...action.payload };
        case "UPDATE_FIELD":
          return { ...prev, [action.key]: action.value };
        case "SET_BRACKET":
          return {
            ...prev,
            bracket: action.bracket,
            bracketConfig: action.config || prev.bracketConfig,
          };
        case "UPDATE_BRACKET_RESULT": {
          if (!prev.bracket) return prev;
          const updatedBracket = updateMatchResult(
            prev.bracket as any,
            action.matchId,
            action.score1,
            action.score2
          );
          return { ...prev, bracket: updatedBracket as any };
        }
        case "CLEAR_BRACKET":
          return { ...prev, bracket: null, bracketConfig: undefined };
        case "UPDATE_BRACKET_SCALE":
          return { ...prev, bracketScale: action.scale };
        case "SET_HISTORY":
          return { ...prev, historyData: action.history };
        case "UPDATE_TIMER":
          return { ...prev, timer: { ...prev.timer, ...action.payload } };
        // WinnersCourt handlers
        case "SET_WINNERS_COURT":
          return { ...prev, winnersCourt: action.winnersCourtState };
        case "UPDATE_WC_RESULT": {
          if (!prev.winnersCourt) return prev;
          const updated = recordCourtResult(
            prev.winnersCourt,
            action.side,
            action.courtIndex,
            action.winner
          );
          return { ...prev, winnersCourt: updated };
        }
        case "ADVANCE_WC_ROUND": {
          if (!prev.winnersCourt) return prev;
          const result = advanceRound(prev.winnersCourt, action.side);
          if ("error" in result) {
            console.error("[WC] Advance round error:", result.error);
            return prev;
          }
          return { ...prev, winnersCourt: result };
        }
        case "CLEAR_WC_SIDE": {
          if (!prev.winnersCourt) return prev;
          const cleared = clearSide(prev.winnersCourt, action.side);
          return { ...prev, winnersCourt: cleared };
        }
        case "SWAP_MATCH_COURT": {
          const { roundIndex, matchIndex, newCourt } = action;
          const newSchedule = [...prev.schedule];
          if (newSchedule[roundIndex] && newSchedule[roundIndex].matches[matchIndex]) {
            const newMatches = [...newSchedule[roundIndex].matches];
            newMatches[matchIndex] = { ...newMatches[matchIndex], court: newCourt };
            newSchedule[roundIndex] = { ...newSchedule[roundIndex], matches: newMatches };
          }
          return { ...prev, schedule: newSchedule };
        }
        case "ADD_PLAYER":
          return { ...prev, players: [...prev.players, action.player] };
        case "ADD_LATE_PLAYER": {
          const newPlayer = action.player;
          const leaderboardEntry = {
            id: newPlayer.id,
            name: newPlayer.name,
            points: 0,
            wins: 0,
            played: 0,
            pointsLost: 0,
            byeCount: 0,
            previousRank: prev.leaderboard.length + 1,
          };
          return {
            ...prev,
            players: [...prev.players, newPlayer],
            leaderboard: [...prev.leaderboard, leaderboardEntry],
          };
        }
        case "REMOVE_PLAYER":
          return {
            ...prev,
            players: prev.players.filter((p) => p.id !== action.playerId),
          };
        case "CLEAR_PLAYERS":
          return { ...prev, players: [] };
        case "RESET_TOURNAMENT":
          return {
            ...prev,
            schedule: [],
            currentRound: 0,
            leaderboard: [],
            isLocked: false,
            hideLeaderboard: true,
          };
        case "COMPLETE_ROUND": {
          const currentRoundIdx = prev.schedule.length - 1;
          const currentRound = prev.schedule[currentRoundIdx];
          if (!currentRound || currentRound.completed) return prev;
          const completedAt = Date.now();

          // 1. Snapshot previous ranks before updating
          const sortedCurrent = sortLeaderboard(prev.leaderboard, prev.rankingCriteria);
          const currentRankMap = new Map();
          sortedCurrent.forEach((p, idx) => currentRankMap.set(p.id, idx + 1));

          const leaderboardWithPrevRanks = prev.leaderboard.map(p => ({
            ...p,
            previousRank: currentRankMap.get(p.id)
          }));

          // 2. Update stats using pure utility (only if NOT a playoff round)
          const isPlayoff = !!currentRound.name;
          const newLeaderboard = isPlayoff 
            ? leaderboardWithPrevRanks 
            : calculateUpdatedLeaderboard(
                leaderboardWithPrevRanks,
                currentRound.matches,
                currentRound.byes || []
              );

          const newSchedule = [...prev.schedule];
          const duration = prev.roundStartedAt
            ? Math.round((completedAt - prev.roundStartedAt) / 1000)
            : 0;
          newSchedule[currentRoundIdx] = { ...currentRound, completed: true, durationSeconds: duration };

          // 3. Generate next round logic
          let nextRoundBase: Round | null = null;
          const nextRoundIndex = newSchedule.length;

          if (
            (prev.format === "americano" || prev.format === "team") &&
            prev.allRounds &&
            nextRoundIndex < prev.allRounds.length
          ) {
            nextRoundBase = { ...prev.allRounds[nextRoundIndex] };
          } else if (prev.format === "mexicano") {
            nextRoundBase = generateMexicanoNextRound({
              leaderboard: newLeaderboard,
              manualByes: prev.manualByes,
              courts: prev.courts,
              preferredPartners: prev.preferredPartners,
              pairingStrategy: prev.pairingStrategy,
              maxRepeats: prev.maxRepeats,
              strictStrategy: prev.strictStrategy,
              scheduleLength: newSchedule.length,
            }) as any;
          } else if (prev.format === "teamMexicano") {
            nextRoundBase = generateTeamMexicanoNextRound({
              leaderboard: newLeaderboard,
              manualByes: prev.manualByes,
              courts: prev.courts,
              scheduleLength: newSchedule.length,
              pairingStrategy: prev.pairingStrategy,
              maxRepeats: prev.maxRepeats,
            }) as any;
          } else if (prev.format === "division") {
            if (prev.allRounds && nextRoundIndex < prev.allRounds.length) {
              nextRoundBase = { ...prev.allRounds[nextRoundIndex] };
            } else if (!prev.schedule.some((round) => round.name === "Semifinal")) {
              nextRoundBase = generateSemifinals({
                ...prev,
                schedule: newSchedule,
                leaderboard: newLeaderboard,
              } as TournamentState);
            } else if (
              currentRound.name === "Semifinal" &&
              !prev.schedule.some((round) => round.name === "Final")
            ) {
              nextRoundBase = generateFinals(newSchedule[currentRoundIdx], prev.players);
            }
          }

          if (nextRoundBase && nextRoundBase.matches.length > 0) {
            newSchedule.push(nextRoundBase);
          } else {
            nextRoundBase = null;
          }

          return {
            ...prev,
            schedule: newSchedule,
            leaderboard: newLeaderboard,
            currentRound: nextRoundIndex,
            manualByes: [],
            roundStartedAt: nextRoundBase ? completedAt : null,
            ui: {
              ...prev.ui,
              selectedMatchId: null,
            },
          };
        }
        case "EDIT_ROUND": {
          const { roundIndex, matchIndex } = action;
          if (roundIndex < 0 || roundIndex >= prev.schedule.length) return prev;

          const newSchedule = prev.schedule.slice(0, roundIndex + 1);
          newSchedule[roundIndex] = {
            ...newSchedule[roundIndex],
            completed: false,
            durationSeconds: undefined,
          };

          const completedRounds = newSchedule.slice(0, roundIndex).filter((round) => round.completed);
          const recalculatedLeaderboard = recalculateLeaderboard(
            prev.players,
            completedRounds,
            prev.rankingCriteria,
          );

          return {
            ...prev,
            schedule: newSchedule,
            currentRound: roundIndex,
            leaderboard: recalculatedLeaderboard,
            manualByes: [],
            roundStartedAt: null,
            ui: {
              ...prev.ui,
              selectedMatchId:
                matchIndex != null ? `round-${roundIndex}-match-${matchIndex}` : null,
            },
          };
        }
        case "ADD_ROUND":
          return {
            ...prev,
            schedule: [...prev.schedule, { ...action.round, number: prev.schedule.length + 1 }],
            isLocked: true,
            hideLeaderboard: false,
          };
        default:
          return prev;
      }
    });
  }, []);

  const save = useCallback(() => {
    StorageService.setItem(STORAGE_KEY, state);
  }, [state]);

  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
    setUndoStack([]);
  }, []);

  return (
    <TournamentContext.Provider value={{ state, dispatch, save, reset, undo, canUndo: undoStack.length > 0, isLoaded }}>
      {children}
    </TournamentContext.Provider>
  );
};

// --- Hook ---
export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error("useTournament must be used within a TournamentProvider");
  }
  return context;
};

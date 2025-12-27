import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { StorageService } from "@/shared/storage";

// --- Types ---
export interface Player {
  id: string;
  name: string;
  lockedCourt?: number | null;
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
  completed: boolean;
  matches: Match[];
  byes?: Player[];
}

export interface TournamentState {
  version: number;
  players: Player[];
  format: "americano" | "mexicano" | "team" | "teamMexicano";
  courts: number;
  scoringMode: "total" | "race" | "time";
  pointsPerMatch: number;
  rankingCriteria: "points" | "wins" | "winRatio" | "pointRatio";
  courtFormat: "number" | "court" | "custom";
  customCourtNames: string[];
  maxRepeats: number;
  pairingStrategy: "optimal" | "oneTwo" | "oneThree" | "oneFour";
  strictStrategy: boolean;
  preferredPartners: PreferredPartner[];
  manualByes: string[];
  hideLeaderboard: boolean;
  showPositionChanges: boolean;
  gridColumns: number;
  textSize: number;
  bracketScale: number;
  isLocked: boolean;
  tournamentName: string;
  tournamentNotes: string;
  schedule: Round[];
  currentRound: number;
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
  ui: {
    currentRoute: string;
    selectedMatchId: string | null;
    activeBracketTab: string;
  };
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
  maxRepeats: 99,
  pairingStrategy: "optimal",
  strictStrategy: false,
  preferredPartners: [],
  manualByes: [],
  hideLeaderboard: true,
  showPositionChanges: true,
  gridColumns: 0,
  textSize: 100,
  bracketScale: 100,
  isLocked: false,
  tournamentName: "",
  tournamentNotes: "",
  schedule: [],
  currentRound: 0,
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
  ui: {
    currentRoute: "",
    selectedMatchId: null,
    activeBracketTab: "A",
  },
};

const STORAGE_KEY = "tournament-state";

// --- Context ---
interface TournamentContextType {
  state: TournamentState;
  dispatch: (action: StateAction) => void;
  save: () => void;
  reset: () => void;
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
  | { type: "EDIT_ROUND"; roundIndex: number }
  | {
      type: "UPDATE_BRACKET_RESULT";
      matchId: number;
      score1: number;
      score2: number;
    }
  | { type: "CLEAR_BRACKET" }
  | { type: "UPDATE_BRACKET_SCALE"; scale: number }
  | { type: "SET_HISTORY"; history: any[] }
  | { type: "UPDATE_TIMER"; payload: Partial<TournamentState["timer"]> };

const TournamentContext = createContext<TournamentContextType | undefined>(
  undefined
);

// --- Provider ---
export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<TournamentState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state on mount
  useEffect(() => {
    const saved = StorageService.getItem(STORAGE_KEY);
    if (saved) {
      setState((prev) => ({ ...prev, ...saved }));
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

  const dispatch = useCallback((action: StateAction) => {
    setState((prev) => {
      switch (action.type) {
        case "SET_STATE":
          return { ...prev, ...action.payload };
        case "UPDATE_FIELD":
          return { ...prev, [action.key]: action.value };
        case "UPDATE_BRACKET_RESULT":
          return state; // Placeholder, logic will be handled outside for now
        case "CLEAR_BRACKET":
          return { ...prev, bracket: null };
        case "UPDATE_BRACKET_SCALE":
          return { ...prev, bracketScale: action.scale };
        case "SET_HISTORY":
          return { ...prev, historyData: action.history };
        case "UPDATE_TIMER":
          return { ...prev, timer: { ...prev.timer, ...action.payload } };
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

          const newLeaderboard = [...prev.leaderboard];

          // 1. Snapshot previous ranks
          // (Simplified: in reactive view, sorted leaderboard calculates rank on the fly)
          newLeaderboard.forEach((p, idx) => {
            // We can calculate rank based on current sorted position if we want to store it
          });

          // 2. Update stats
          currentRound.matches.forEach((match) => {
            const s1 = match.score1 || 0;
            const s2 = match.score2 || 0;
            const t1Won = s1 > s2;
            const t2Won = s2 > s1;
            const isDraw = s1 === s2;

            const updatePlayer = (
              id: string,
              pFor: number,
              pAgainst: number,
              won: boolean,
              draw: boolean,
              pId?: string
            ) => {
              const pIdx = newLeaderboard.findIndex((p) => p.id === id);
              if (pIdx !== -1) {
                const p = { ...newLeaderboard[pIdx] };
                p.points = (p.points || 0) + pFor;
                p.pointsLost = (p.pointsLost || 0) + pAgainst;
                p.played = (p.played || 0) + 1;
                if (won) p.wins = (p.wins || 0) + 1;
                else if (!draw) p.losses = (p.losses || 0) + 1;
                if (pId) {
                  p.playedWith = [...(p.playedWith || []), pId];
                }
                newLeaderboard[pIdx] = p;
              }
            };

            match.team1.forEach((p) =>
              updatePlayer(
                p.id,
                s1,
                s2,
                t1Won,
                isDraw,
                match.team1.length > 1
                  ? match.team1.find((px) => px.id !== p.id)?.id
                  : undefined
              )
            );
            match.team2.forEach((p) =>
              updatePlayer(
                p.id,
                s2,
                s1,
                t2Won,
                isDraw,
                match.team2.length > 1
                  ? match.team2.find((px) => px.id !== p.id)?.id
                  : undefined
              )
            );
          });

          // 3. Update byes
          if (currentRound.byes) {
            currentRound.byes.forEach((bp) => {
              const pIdx = newLeaderboard.findIndex((p) => p.id === bp.id);
              if (pIdx !== -1) {
                newLeaderboard[pIdx] = {
                  ...newLeaderboard[pIdx],
                  byeCount: (newLeaderboard[pIdx].byeCount || 0) + 1,
                };
              }
            });
          }

          const newSchedule = [...prev.schedule];
          newSchedule[currentRoundIdx] = { ...currentRound, completed: true };

          // 4. Generate next round logic...
          let nextRoundBase: Round | null = null;
          const nextRoundNum = prev.currentRound + 1;

          if (
            (prev.format === "americano" || prev.format === "team") &&
            prev.allRounds &&
            nextRoundNum < prev.allRounds.length
          ) {
            nextRoundBase = { ...prev.allRounds[nextRoundNum] };
          } else if (
            prev.format === "mexicano" ||
            prev.format === "teamMexicano"
          ) {
            // For Mexicano, we'll need to call the complex generator functions.
            // For now, let's stick to Americano port or use window.generateNextRound if available
            const legacyGenerate = (window as any).generateNextRound;
            if (legacyGenerate) {
              // This is risky, but works if we synced window.state
            }
          }

          if (nextRoundBase) {
            newSchedule.push(nextRoundBase);
          }

          return {
            ...prev,
            schedule: newSchedule,
            leaderboard: newLeaderboard,
            currentRound: nextRoundNum,
            manualByes: [],
          };
        }
        case "EDIT_ROUND": {
          const { roundIndex } = action;
          if (roundIndex < 0 || roundIndex >= prev.schedule.length) return prev;

          // Reverting rounds subsequent to roundIndex is common in the legacy logic
          const newSchedule = prev.schedule.slice(0, roundIndex + 1);
          newSchedule[roundIndex] = {
            ...newSchedule[roundIndex],
            completed: false,
          };

          // Recalculating leaderboard from scratch is more robust for editing
          // But for now, let's just revert currentRound index
          return {
            ...prev,
            schedule: newSchedule,
            currentRound: roundIndex,
            // leaderboard would need full recalculation here to be safe
          };
        }
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
  }, []);

  return (
    <TournamentContext.Provider value={{ state, dispatch, save, reset }}>
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

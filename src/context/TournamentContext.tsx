import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { StorageService } from "@/shared/storage.js";

// --- Types ---
export interface Player {
  id: string;
  name: string;
}

export interface PreferredPartner {
  player1Id: string;
  player2Id: string;
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
  schedule: any[];
  currentRound: number;
  leaderboard: any[];
  allRounds: any | null;
  winnersCourt: any | null;
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
  winnersCourt: null,
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
  | { type: "REMOVE_PLAYER"; playerId: string }
  | { type: "CLEAR_PLAYERS" }
  | { type: "RESET_TOURNAMENT" };

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
      // Small delay or direct? Direct for now.
      setState((prev) => ({ ...prev, ...saved }));
    }
    setIsLoaded(true);
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    if (isLoaded) {
      StorageService.setItem(STORAGE_KEY, state);
      // Also potentially keep the legacy window.state in sync for any remaining Vanilla code
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
        case "ADD_PLAYER":
          return { ...prev, players: [...prev.players, action.player] };
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

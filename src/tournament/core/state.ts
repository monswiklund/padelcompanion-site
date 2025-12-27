// Tournament Generator - State Management
// Central state object with reactive updates

import { StorageService } from "../../shared/storage";

const STATE_VERSION = 1;

export interface Player {
  id: string | number;
  name: string;
  points?: number;
  wins?: number;
  losses?: number;
  pointsLost?: number;
  played?: number;
  byeCount?: number;
  playedWith?: (string | number)[];
  lockedCourt?: number;
  isBye?: boolean;
}

export interface PreferredPartner {
  id?: string | number;
  player1Id: string | number;
  player2Id: string | number;
}

export interface Match {
  court: number;
  team1: Player[];
  team2: Player[];
  score1?: number;
  score2?: number;
}

export interface Round {
  number: number;
  matches: Match[];
  byes: Player[];
}

export interface BracketMeta {
  name: string;
  notes: string;
  createdAt: string | null;
}

export interface BracketState {
  format: "single" | "double";
  teams: Player[];
  matches: any[];
  standings: any[];
  meta: BracketMeta;
}

export interface UIState {
  currentRoute: string;
  selectedMatchId: string | number | null;
  activeBracketTab: string;
}

export interface WinnersCourtState {
  players: Player[];
  courts: any[];
  courtCount: number;
  twist: boolean;
  round: number;
}

export interface TournamentState {
  version: number;
  players: Player[];
  format: string;
  courts: number;
  scoringMode: string;
  pointsPerMatch: number;
  rankingCriteria: string;
  courtFormat: string;
  customCourtNames: string[];
  maxRepeats: number;
  pairingStrategy: string;
  strictStrategy?: boolean;
  preferredPartners: PreferredPartner[];
  manualByes: (string | number)[];
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
  leaderboard: Player[];
  allRounds: Round[] | null;
  maxCourts: number;
  bracket: BracketState;
  winnersCourt: WinnersCourtState | null;
  ui: UIState;
}

export const state: TournamentState = {
  version: STATE_VERSION,
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
  maxCourts: 2,
  bracket: {
    format: "single",
    teams: [],
    matches: [],
    standings: [],
    meta: { name: "", notes: "", createdAt: null },
  },
  winnersCourt: null,
  ui: {
    currentRoute: "",
    selectedMatchId: null,
    activeBracketTab: "A",
  },
};

// Undo History
const historyStack: TournamentState[] = [];
const MAX_HISTORY = 20;

function updateUndoButton(): void {
  const undoBtn = document.getElementById("undoBtn");
  if (undoBtn) {
    (undoBtn as HTMLButtonElement).disabled = historyStack.length === 0;
  }
}

export function pushHistory(): void {
  const snapshot = JSON.parse(JSON.stringify(state)) as TournamentState;
  historyStack.push(snapshot);
  if (historyStack.length > MAX_HISTORY) {
    historyStack.shift();
  }
  updateUndoButton();
}

export function undoLastAction(): boolean {
  if (historyStack.length === 0) return false;
  const previousState = historyStack.pop()!;
  restoreState(previousState);
  updateUndoButton();
  return true;
}

export function canUndo(): boolean {
  return historyStack.length > 0;
}

const STORAGE_KEY = "tournament-state";

export function saveState(): void {
  StorageService.setItem(STORAGE_KEY, {
    version: state.version,
    players: state.players,
    format: state.format,
    courts: state.courts,
    scoringMode: state.scoringMode,
    pointsPerMatch: state.pointsPerMatch,
    rankingCriteria: state.rankingCriteria,
    courtFormat: state.courtFormat,
    customCourtNames: state.customCourtNames,
    maxRepeats: state.maxRepeats,
    pairingStrategy: state.pairingStrategy,
    preferredPartners: state.preferredPartners,
    tournamentName: state.tournamentName,
    tournamentNotes: state.tournamentNotes,
    schedule: state.schedule,
    currentRound: state.currentRound,
    leaderboard: state.leaderboard,
    allRounds: state.allRounds,
    isLocked: state.isLocked,
    hideLeaderboard: state.hideLeaderboard,
    manualByes: state.manualByes,
    gridColumns: state.gridColumns,
    textSize: state.textSize,
    bracket: state.bracket,
    ui: state.ui,
    winnersCourt: state.winnersCourt,
  });
}

export function loadState(): boolean {
  let data = StorageService.getItem<any>(STORAGE_KEY);
  if (!data) return false;

  try {
    data = migrateState(data);

    state.players = Array.isArray(data.players)
      ? data.players.slice(0, 200)
      : [];
    state.format = data.format || "americano";
    state.courts = Math.max(1, Math.min(50, data.courts || 2));
    state.scoringMode = data.scoringMode || "total";
    state.pointsPerMatch = Math.max(
      1,
      Math.min(999, data.pointsPerMatch || 24)
    );
    state.rankingCriteria = data.rankingCriteria || "points";
    state.courtFormat = data.courtFormat || "court";
    state.customCourtNames = Array.isArray(data.customCourtNames)
      ? data.customCourtNames.slice(0, 50)
      : [];
    state.maxRepeats = Math.max(
      0,
      Math.min(99, data.maxRepeats !== undefined ? data.maxRepeats : 99)
    );
    state.pairingStrategy = data.pairingStrategy || "optimal";
    state.preferredPartners = Array.isArray(data.preferredPartners)
      ? data.preferredPartners.slice(0, 100)
      : [];
    state.tournamentName = data.tournamentName || "";
    state.tournamentNotes = data.tournamentNotes || "";

    state.schedule = Array.isArray(data.schedule) ? data.schedule : [];
    state.currentRound = Math.max(0, Math.min(100, data.currentRound || 0));
    state.leaderboard = Array.isArray(data.leaderboard) ? data.leaderboard : [];
    state.allRounds = data.allRounds || null;
    state.isLocked = data.isLocked || false;
    state.hideLeaderboard =
      data.hideLeaderboard !== undefined ? data.hideLeaderboard : true;
    state.manualByes = Array.isArray(data.manualByes) ? data.manualByes : [];
    state.gridColumns = Math.max(0, Math.min(10, data.gridColumns || 0));
    state.textSize = Math.max(50, Math.min(200, data.textSize || 100));
    state.bracketScale = Math.max(50, Math.min(200, data.bracketScale || 100));

    if (data.bracket) {
      state.bracket = {
        format: data.bracket.format || "single",
        teams: data.bracket.teams || [],
        matches: data.bracket.matches || [],
        standings: data.bracket.standings || [],
        meta: data.bracket.meta || { name: "", notes: "", createdAt: null },
      };
    } else if (data.tournament) {
      state.bracket = data.tournament;
    }

    if (data.ui) {
      state.ui = {
        currentRoute: data.ui.currentRoute || "",
        selectedMatchId: data.ui.selectedMatchId || null,
        activeBracketTab: data.ui.activeBracketTab || "A",
      };
    }

    state.winnersCourt = data.winnersCourt || null;

    return true;
  } catch (e) {
    console.error("Failed to load tournament state:", e);
    return false;
  }
}

function migrateState(data: any): any {
  const savedVersion = data.version || 0;

  if (savedVersion < STATE_VERSION) {
    console.log(`[State] Migrating from v${savedVersion} to v${STATE_VERSION}`);

    if (savedVersion < 1) {
      data.bracket = data.bracket ||
        data.tournament || {
          format: "single",
          teams: [],
          matches: [],
          standings: [],
          meta: { name: "", notes: "", createdAt: null },
        };
      data.ui = data.ui || {
        currentRoute: "",
        selectedMatchId: null,
      };
    }

    data.version = STATE_VERSION;
  }

  return data;
}

export function resetTournamentState(): void {
  state.schedule = [];
  state.currentRound = 0;
  state.leaderboard = [];
  state.allRounds = null;
  state.isLocked = false;
  state.hideLeaderboard = true;
  state.manualByes = [];
}

export function initLeaderboard(): void {
  state.leaderboard = state.players.map((p) => ({
    ...p,
    points: 0,
    wins: 0,
    losses: 0,
    pointsLost: 0,
    played: 0,
    byeCount: 0,
    playedWith: [],
  }));
}

export function getStateSnapshot(): TournamentState {
  return JSON.parse(JSON.stringify(state));
}

export function restoreState(snapshot: Partial<TournamentState>): void {
  if (!snapshot) return;

  (Object.keys(state) as (keyof TournamentState)[]).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(snapshot, key)) {
      (state as any)[key] = (snapshot as any)[key];
    }
  });

  state.players = state.players || [];
  state.schedule = state.schedule || [];
  state.leaderboard = state.leaderboard || [];

  saveState();
}

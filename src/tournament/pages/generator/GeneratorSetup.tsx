import React, { useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PlayerList } from "@/components/tournament/PlayerList";
import { showToast, createId } from "@/shared/utils.js";
import {
  TournamentConfig,
  TournamentConfigState,
} from "@/components/tournament/TournamentConfig";
import { PreferredPartners } from "@/components/tournament/PreferredPartners";
import { useTournament } from "@/context/TournamentContext";
// Import legacy functions
import { generateSchedule } from "../../ui/setup/scheduleGeneration.js";
import { state as legacyState } from "../../core/state.js";

interface GeneratorPlayer {
  id: string;
  name: string;
  lockedCourt?: number | null;
}

interface GeneratorSetupProps {
  onGameActive: () => void;
}

export const GeneratorSetup: React.FC<GeneratorSetupProps> = ({
  onGameActive,
}) => {
  const { state, dispatch } = useTournament();
  const {
    players,
    preferredPartners: pairs,
    format,
    courts,
    scoringMode,
    pointsPerMatch,
    maxRepeats,
    pairingStrategy,
    strictStrategy,
  } = state;

  // Sync with legacy state for functions that still depend on it
  useEffect(() => {
    Object.assign(legacyState, state);
  }, [state]);

  const handleAddPlayer = (name: string) => {
    if (players.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      showToast("Player already exists", "error");
      return;
    }
    const newPlayer = { id: createId(), name, lockedCourt: null };
    dispatch({ type: "ADD_PLAYER", player: newPlayer });
    showToast(`${name} added`, "success");
  };

  const handleGenerate = () => {
    if (players.length < 4) {
      showToast("Need at least 4 players", "error");
      return;
    }

    try {
      // Ensure legacy state is up to date before calling legacy generator
      Object.assign(legacyState, state);

      generateSchedule();

      // Sync BACK after generation (which populates state.schedule, state.leaderboard, etc)
      dispatch({
        type: "SET_STATE",
        payload: {
          schedule: legacyState.schedule,
          leaderboard: legacyState.leaderboard,
          allRounds: legacyState.allRounds,
          currentRound: legacyState.currentRound,
          isLocked: legacyState.isLocked,
        },
      });

      if (legacyState.schedule && legacyState.schedule.length > 0) {
        onGameActive();
      }
    } catch (e: any) {
      showToast(e.message || "Generation failed", "error");
    }
  };

  const updateConfig = (key: keyof TournamentConfigState, value: any) => {
    dispatch({ type: "UPDATE_FIELD", key: key as any, value });
  };

  const renderPlayerItem = (p: GeneratorPlayer, i: number) => {
    return (
      <li
        key={p.id}
        className="player-item flex justify-between items-center p-2 rounded mb-2 bg-bg-tertiary"
      >
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <span className="text-text-muted text-xs w-6">{i + 1}.</span>
          <span className="font-medium truncate flex-1">{p.name}</span>

          {courts > 1 && (
            <select
              className="bg-black/20 text-xs p-1 rounded border border-white/10 outline-none w-20"
              value={p.lockedCourt || ""}
              onChange={(e) => {
                const val = e.target.value ? parseInt(e.target.value) : null;
                const newPlayers = [...players];
                newPlayers[i] = { ...newPlayers[i], lockedCourt: val };
                dispatch({
                  type: "SET_STATE",
                  payload: { players: newPlayers },
                });
              }}
              title="Lock to Court"
            >
              <option value="">Auto</option>
              {Array.from({ length: courts }, (_, c) => c + 1).map((c) => (
                <option key={c} value={c}>
                  Court {c}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          className="text-text-muted hover:text-red-400 px-2 font-bold ml-2"
          onClick={() => {
            dispatch({ type: "REMOVE_PLAYER", playerId: p.id });
          }}
        >
          ×
        </button>
      </li>
    );
  };

  return (
    <div className="tournament-setup-view container animate-fade-in py-8">
      <div className="page-intro-header text-center max-w-[600px] mx-auto mb-8 px-4">
        <h2 className="text-3xl mb-1 text-white">Americano Setup</h2>
        <p className="text-text-muted">
          Add players and configure your tournament settings.
        </p>
      </div>

      <div className="setup-grid">
        <div className="setup-main">
          <Card>
            <PlayerList
              items={players}
              onAdd={handleAddPlayer}
              onRemove={(idx) => {
                dispatch({ type: "REMOVE_PLAYER", playerId: players[idx].id });
              }}
              onClear={() => dispatch({ type: "CLEAR_PLAYERS" })}
              onImport={(text) => {
                const lines = text.split("\n");
                const addedPlayers: GeneratorPlayer[] = [];
                lines.forEach((l) => {
                  const name = l.trim();
                  if (
                    name &&
                    !players.some(
                      (p) => p.name.toLowerCase() === name.toLowerCase()
                    )
                  ) {
                    addedPlayers.push({
                      id: createId(),
                      name,
                      lockedCourt: null,
                    });
                  }
                });
                dispatch({
                  type: "SET_STATE",
                  payload: { players: [...players, ...addedPlayers] },
                });
                showToast(`Imported ${addedPlayers.length} players`, "success");
              }}
              renderItem={renderPlayerItem}
              hintText={
                <div className="text-center text-xs text-text-muted mt-2">
                  {players.length} ready | {courts} courts ({courts * 4}{" "}
                  playing).
                  {players.length % 4 !== 0 && (
                    <span className="text-orange-400 ml-1">Queue enabled.</span>
                  )}
                </div>
              }
            />
          </Card>
        </div>

        <div className="setup-sidebar">
          <TournamentConfig
            config={{
              format,
              courts,
              scoringMode,
              pointsPerMatch,
              maxRepeats,
              pairingStrategy,
              strictStrategy,
            }}
            playerCount={players.length}
            onChange={updateConfig}
          />

          {format.includes("mexicano") && (
            <Card className="mt-4">
              <PreferredPartners
                pairs={pairs}
                players={players}
                onAddPair={(p1Id, p2Id) => {
                  dispatch({
                    type: "UPDATE_FIELD",
                    key: "preferredPartners",
                    value: [
                      ...pairs,
                      { id: createId(), player1Id: p1Id, player2Id: p2Id },
                    ],
                  });
                }}
                onRemovePair={(id) => {
                  dispatch({
                    type: "UPDATE_FIELD",
                    key: "preferredPartners",
                    value: pairs.filter((p) => p.id !== id),
                  });
                }}
              />
            </Card>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-center pb-12">
        <Button
          size="lg"
          disabled={players.length < 4}
          onClick={handleGenerate}
        >
          Generate Schedule
        </Button>
      </div>
    </div>
  );
};

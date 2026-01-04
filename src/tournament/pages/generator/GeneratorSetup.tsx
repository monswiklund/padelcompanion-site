import React, { useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PlayerList } from "@/components/tournament/PlayerList";
import { showToast, createId } from "@/shared/utils";
import {
  TournamentConfig,
  TournamentConfigState,
} from "@/components/tournament/TournamentConfig";
import { PreferredPartners } from "@/components/tournament/PreferredPartners";
import { useTournament } from "@/context/TournamentContext";
// Import legacy functions
import { generateSchedule } from "../../ui/setup/scheduleGeneration";
import { state as legacyState } from "../../core/state";

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

  const handleGenerate = async () => {
    if (players.length < 4) {
      showToast("Need at least 4 players", "error");
      return;
    }

    try {
      // Ensure legacy state is up to date before calling legacy generator
      Object.assign(legacyState, state);

      console.log("[Generator] Pre-generation State:", {
        players: state.players.length,
        courts: state.courts,
        format: state.format,
        legacyCourts: legacyState.courts,
      });

      const result = await generateSchedule();

      if (!result) return;

      const generatedSchedule = result.schedule || [];
      const validSchedule = generatedSchedule.filter(
        (r: any) => r && r.matches && r.matches.length > 0
      );

      if (generatedSchedule.length > 0 && validSchedule.length === 0) {
        showToast("Error: Generated schedule has empty rounds.", "error");
        return;
      }

      // Sync BACK after generation
      dispatch({
        type: "SET_STATE",
        payload: {
          schedule: generatedSchedule.length > 0 ? [...generatedSchedule] : [],
          leaderboard: result.leaderboard ? [...result.leaderboard] : [],
          allRounds: result.allRounds ? [...result.allRounds] : null,
          currentRound: result.currentRound,
          isLocked: result.isLocked,
        },
      });

      if (validSchedule.length > 0) {
        onGameActive();
      }
    } catch (e: any) {
      showToast(e.message || "Generation failed", "error");
    }
  };

  const updateConfig = (key: keyof TournamentConfigState, value: any) => {
    dispatch({ type: "UPDATE_FIELD", key: key as any, value });
  };

  const getCourtName = (num: number) => {
    if (state.courtFormat === "custom" && state.customCourtNames[num - 1]) {
      return state.customCourtNames[num - 1];
    }
    if (state.courtFormat === "number") return num.toString();
    return `Court ${num}`;
  };

  const renderPlayerActions = (p: GeneratorPlayer, i: number) => {
    if (courts <= 1) return null;
    return (
      <select
        className="court-lock-select bg-black/20 text-xs p-1 rounded border border-white/10 outline-none"
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
            {getCourtName(c)}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="tournament-setup-view container animate-fade-in">
      <div className="page-intro-header">
        <h2>Americano Setup</h2>
        <p>Add players and configure your tournament settings.</p>
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
              renderActions={renderPlayerActions}
              onReorder={(from: number, to: number) => {
                const newPlayers = [...players];
                const [moved] = newPlayers.splice(from, 1);
                newPlayers.splice(to, 0, moved);
                dispatch({
                  type: "SET_STATE",
                  payload: { players: newPlayers },
                });
              }}
              hintText={
                <div className="text-xs text-text-muted mt-2 flex items-center gap-2">
                  <span className="text-brand-primary">✓</span>
                  <span>{players.length} ready</span>
                  <span className="opacity-50">|</span>
                  <span>
                    {courts} courts ({courts * 4} players ideal)
                  </span>
                  {players.length % 4 !== 0 && (
                    <span className="text-warning ml-1">(Queue enabled)</span>
                  )}
                </div>
              }
            />
          </Card>
        </div>

        <div className="setup-sidebar">
          <Card>
            <TournamentConfig
              config={{
                format: state.format,
                courts: state.courts,
                scoringMode: state.scoringMode,
                pointsPerMatch: state.pointsPerMatch,
                maxRepeats: state.maxRepeats,
                pairingStrategy: state.pairingStrategy,
                strictStrategy: state.strictStrategy,
                courtFormat: state.courtFormat,
                customCourtNames: state.customCourtNames,
              }}
              playerCount={players.length}
              onChange={updateConfig}
            />

            {/* Generate Button */}
            <Button
              size="lg"
              disabled={players.length < 4}
              onClick={handleGenerate}
              className="w-full mt-4"
            >
              Generate Schedule
            </Button>
          </Card>

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
    </div>
  );
};

import React, { useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { HelpButton, NoticeBar } from "@/components/ui/HelpNotice";
import { PlayerList } from "@/components/tournament/PlayerList";
import { showToast, createId } from "@/shared/utils";
import {
  TournamentConfig,
  TournamentConfigState,
} from "@/components/tournament/TournamentConfig";
import { PreferredPartners } from "@/components/tournament/PreferredPartners";
import { useTournament } from "@/context/TournamentContext";
import { generateSchedule } from "../../ui/setup/scheduleGeneration";
import { state as legacyState } from "../../core/state";
import { HELP_AMERICANO, HELP_MEXICANO } from "../../content/help";

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
  const { players, preferredPartners: pairs, format, courts } = state;

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
        className="bg-black/20 text-xs px-2 py-1 rounded-lg border border-theme text-secondary focus:outline-none focus:border-accent"
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
    <div className="max-w-6xl mx-auto px-4 py-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h2 className="text-3xl font-bold text-primary">
            {format === "americano"
              ? "Americano"
              : format === "mexicano"
              ? "Mexicano"
              : format === "team"
              ? "Team"
              : "Team Mexicano"}{" "}
            Setup
          </h2>
          <HelpButton
            title={
              format === "mexicano" || format === "teamMexicano"
                ? HELP_MEXICANO.title
                : HELP_AMERICANO.title
            }
            content={
              format === "mexicano" || format === "teamMexicano"
                ? HELP_MEXICANO.content
                : HELP_AMERICANO.content
            }
          />
        </div>
        <p className="text-secondary">
          Add players and configure your tournament settings.
        </p>
      </div>

      {/* Notices */}
      {players.length > 0 && players.length < 4 && (
        <NoticeBar type="warning" className="mb-4">
          Need at least 4 players to start a tournament.
        </NoticeBar>
      )}
      {players.length >= 4 && players.length % 4 !== 0 && (
        <NoticeBar type="info" className="mb-4">
          {4 - (players.length % 4)} more players needed for even teams, or
          queue rotation will be used.
        </NoticeBar>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Players Section */}
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
              let duplicateCount = 0;

              lines.forEach((l) => {
                const name = l.trim();
                if (name) {
                  // Check against current players AND players being added this batch
                  const isDuplicate =
                    players.some(
                      (p) => p.name.toLowerCase() === name.toLowerCase()
                    ) ||
                    addedPlayers.some(
                      (p) => p.name.toLowerCase() === name.toLowerCase()
                    );

                  if (!isDuplicate) {
                    addedPlayers.push({
                      id: createId(),
                      name,
                      lockedCourt: null,
                    });
                  } else {
                    duplicateCount++;
                  }
                }
              });

              if (addedPlayers.length > 0) {
                dispatch({
                  type: "SET_STATE",
                  payload: { players: [...players, ...addedPlayers] },
                });
                showToast(`Imported ${addedPlayers.length} players`, "success");
              }

              if (duplicateCount > 0) {
                showToast(`Skipped ${duplicateCount} duplicates`, "warning");
              }
            }}
            renderActions={renderPlayerActions}
            hintText={
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-success">✓</span>
                <span>{players.length} ready</span>
                <span className="opacity-50">|</span>
                <span>
                  {courts} courts ({courts * 4} players ideal)
                </span>
                {players.length % 4 !== 0 && (
                  <span className="text-warning">(Queue enabled)</span>
                )}
              </div>
            }
          />
        </Card>

        {/* Config Section */}
        <div className="space-y-6">
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

            <Button
              size="lg"
              disabled={players.length < 4}
              onClick={handleGenerate}
              fullWidth
              className="mt-6"
            >
              Generate Schedule
            </Button>
          </Card>

          {format.includes("mexicano") && (
            <Card>
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

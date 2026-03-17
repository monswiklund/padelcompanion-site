import React, { useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { HelpButton, NoticeBar } from "@/components/ui/HelpNotice";
import { PlayerList } from "@/components/tournament/PlayerList";
import { showToast, createId } from "@/shared/utils";
import { useTournament } from "@/context/TournamentContext";
import { generateSchedule } from "../../ui/setup/scheduleGeneration";
import { state as legacyState } from "../../core/state";

interface DivisionTeam {
  id: string;
  name: string;
  lockedCourt?: number | null;
  division?: string;
}

interface DivisionSetupProps {
  onGameActive: () => void;
}

const HELP_DIVISION = {
  title: "Division",
  content:
    "Round-robin league format. All teams in the same division play each other. Win = 3pts, Draw = 1pt, Loss = 0pts. Games (points scored) are tracked for tiebreakers.",
};

export const DivisionSetup: React.FC<DivisionSetupProps> = ({
  onGameActive,
}) => {
  const { state, dispatch } = useTournament();
  const { players, courts } = state;

  // Ensure format is set to division when this page mounts
  useEffect(() => {
    if (state.format !== "division") {
      dispatch({ type: "UPDATE_FIELD", key: "format", value: "division" });
    }
  }, []);

  useEffect(() => {
    Object.assign(legacyState, state);
  }, [state]);

  const handleAddTeam = (name: string) => {
    if (players.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      showToast("Team already exists", "error");
      return;
    }
    const newTeam: DivisionTeam = {
      id: createId(),
      name,
      lockedCourt: null,
      division: "A",
    };
    dispatch({ type: "ADD_PLAYER", player: newTeam });
    showToast(`${name} added`, "success");
  };

  const handleGenerate = async () => {
    // Count teams per division
    const divCounts = new Map<string, number>();
    players.forEach((p) => {
      const div = (p as any).division || "A";
      divCounts.set(div, (divCounts.get(div) || 0) + 1);
    });

    // Each division needs at least 2 teams
    for (const [div, count] of divCounts.entries()) {
      if (count < 2) {
        showToast(`Division ${div} needs at least 2 teams`, "error");
        return;
      }
    }

    if (players.length < 3) {
      showToast("Need at least 3 teams total", "error");
      return;
    }

    try {
      Object.assign(legacyState, state);
      legacyState.format = "division";

      const result = await generateSchedule();
      if (!result) return;

      const generatedSchedule = result.schedule || [];

      // Calculate total courts based on divisions
      const divisions = new Set(players.map((p) => (p as any).division || "A"));
      const totalCourts = divisions.size * (state.divisionCourts || 2);

      dispatch({
        type: "SET_STATE",
        payload: {
          format: "division",
          courts: totalCourts,
          schedule: generatedSchedule.length > 0 ? [...generatedSchedule] : [],
          leaderboard: result.leaderboard ? [...result.leaderboard] : [],
          allRounds: result.allRounds ? [...result.allRounds] : null,
          currentRound: result.currentRound,
          isLocked: result.isLocked,
          roundStartedAt: Date.now(),
          sessionStartedAt: Date.now(),
        },
      });

      if (generatedSchedule.length > 0) {
        onGameActive();
      }
    } catch (e: any) {
      showToast(e.message || "Generation failed", "error");
    }
  };

  const divisionCourts = state.divisionCourts || 2;
  const tiebreaker = state.tiebreaker || "difference";

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h2 className="text-3xl font-bold text-foreground">
            Division Setup
          </h2>
          <HelpButton
            title={HELP_DIVISION.title}
            content={HELP_DIVISION.content}
          />
        </div>
        <p className="text-muted-foreground">
          Add teams and assign them to divisions. All teams in the same division
          will play each other.
        </p>
      </div>

      {/* Notices */}
      {players.length > 0 && players.length < 3 && (
        <NoticeBar type="warning" className="mb-4">
          Need at least 3 teams to start a division tournament.
        </NoticeBar>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teams Section */}
        <GlassCard>
          <PlayerList
            items={players}
            onAdd={handleAddTeam}
            onRemove={(idx) => {
              dispatch({ type: "REMOVE_PLAYER", playerId: players[idx].id });
            }}
            onClear={() => dispatch({ type: "CLEAR_PLAYERS" })}
            onImport={(text) => {
              const lines = text.split("\n");
              const addedTeams: DivisionTeam[] = [];
              let duplicateCount = 0;

              lines.forEach((l) => {
                const name = l.trim();
                if (name) {
                  const isDuplicate =
                    players.some(
                      (p) => p.name.toLowerCase() === name.toLowerCase(),
                    ) ||
                    addedTeams.some(
                      (p) => p.name.toLowerCase() === name.toLowerCase(),
                    );

                  if (!isDuplicate) {
                    addedTeams.push({
                      id: createId(),
                      name,
                      lockedCourt: null,
                      division: "A",
                    });
                  } else {
                    duplicateCount++;
                  }
                }
              });

              if (addedTeams.length > 0) {
                dispatch({
                  type: "SET_STATE",
                  payload: { players: [...players, ...addedTeams] },
                });
                showToast(`Imported ${addedTeams.length} teams`, "success");
              }

              if (duplicateCount > 0) {
                showToast(`Skipped ${duplicateCount} duplicates`, "warning");
              }
            }}
            hintText={
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-success">✓</span>
                <span>{players.length} teams</span>
              </div>
            }
          />
        </GlassCard>

        {/* Config Section */}
        <div className="space-y-6">
          <GlassCard>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
              Division Settings
            </h4>
            <div className="divide-y divide-white/[0.06]">
              {/* Courts per Division */}
              <div className="flex items-center justify-between gap-3 py-3">
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground">Courts / Division</span>
                  <span className="text-xs text-muted-foreground ml-1.5">(Per division)</span>
                </div>
                <div className="flex items-center bg-popover rounded-xl border border-border overflow-hidden">
                  <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center text-lg font-bold text-accent hover:bg-accent/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    disabled={divisionCourts <= 1}
                    onClick={() => dispatch({ type: "UPDATE_FIELD", key: "divisionCourts", value: divisionCourts - 1 })}
                  >
                    −
                  </button>
                  <div className="w-10 text-center font-bold text-foreground">{divisionCourts}</div>
                  <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center text-lg font-bold text-accent hover:bg-accent/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    disabled={divisionCourts >= 10}
                    onClick={() => dispatch({ type: "UPDATE_FIELD", key: "divisionCourts", value: divisionCourts + 1 })}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Scoring Mode */}
              <div className="flex items-center justify-between gap-3 py-3">
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground">Scoring</span>
                  <span className="text-xs text-muted-foreground ml-1.5">(Win condition)</span>
                </div>
                <select
                  className="px-3 py-2.5 rounded-lg bg-popover border border-border text-foreground focus:outline-none focus:border-accent transition-colors text-sm"
                  value={state.scoringMode}
                  onChange={(e) => {
                    const mode = e.target.value;
                    dispatch({ type: "UPDATE_FIELD", key: "scoringMode", value: mode });
                    const presets: Record<string, number> = { total: 24, race: 14, time: 15 };
                    if (presets[mode]) {
                      dispatch({ type: "UPDATE_FIELD", key: "pointsPerMatch", value: presets[mode] });
                    }
                  }}
                >
                  <option value="total">Total Points</option>
                  <option value="race">Race to</option>
                  <option value="time">Timed</option>
                </select>
              </div>

              {/* Points/Time */}
              <div className="flex items-center justify-between gap-3 py-3">
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground">
                    {state.scoringMode === "time" ? "Minutes" : state.scoringMode === "race" ? "Race to" : "Total Points"}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1.5">
                    ({state.scoringMode === "time" ? "Duration" : "Target score"})
                  </span>
                </div>
                <div className="flex items-center bg-popover rounded-xl border border-border overflow-hidden">
                  <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center text-lg font-bold text-accent hover:bg-accent/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    disabled={state.pointsPerMatch <= 4}
                    onClick={() => dispatch({ type: "UPDATE_FIELD", key: "pointsPerMatch", value: state.pointsPerMatch - (state.scoringMode === "time" ? 1 : 2) })}
                  >
                    −
                  </button>
                  <div className="w-10 text-center font-bold text-foreground">{state.pointsPerMatch}</div>
                  <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center text-lg font-bold text-accent hover:bg-accent/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    disabled={state.pointsPerMatch >= 50}
                    onClick={() => dispatch({ type: "UPDATE_FIELD", key: "pointsPerMatch", value: state.pointsPerMatch + (state.scoringMode === "time" ? 1 : 2) })}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Tiebreaker */}
              <div className="flex items-center justify-between gap-3 py-3">
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground">Tiebreaker</span>
                  <span className="text-xs text-muted-foreground ml-1.5">(When points are equal)</span>
                </div>
                <select
                  className="px-3 py-2.5 rounded-lg bg-popover border border-border text-foreground focus:outline-none focus:border-accent transition-colors text-sm"
                  value={tiebreaker}
                  onChange={(e) => dispatch({ type: "UPDATE_FIELD", key: "tiebreaker", value: e.target.value })}
                >
                  <option value="difference">Game Difference</option>
                  <option value="most_won">Most Games Won</option>
                  <option value="shared">Shared (Equal)</option>
                </select>
              </div>
            </div>

            <Button
              size="lg"
              disabled={players.length < 3}
              onClick={handleGenerate}
              fullWidth
              className="mt-6"
            >
              Generate Schedule
            </Button>
          </GlassCard>

          {/* Division Assignment */}
          <GlassCard>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Division Assignment
            </h4>
            {players.length === 0 ? (
              <p className="text-xs text-muted-foreground/60 italic">
                Add teams to assign them to divisions.
              </p>
            ) : (
              <div className="space-y-4">
                {(() => {
                  const divColors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
                    A: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", badge: "bg-blue-500" },
                    B: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", badge: "bg-emerald-500" },
                    C: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", badge: "bg-orange-500" },
                  };
                  const allDivisions = ["A", "B", "C"];
                  const otherDivisions = (current: string) => allDivisions.filter(d => d !== current);

                  return allDivisions.map((divName) => {
                    const divPlayers = players
                      .map((p, idx) => ({ ...p, originalIndex: idx }))
                      .filter((p) => ((p as any).division || "A") === divName);
                    const colors = divColors[divName];

                    return (
                      <div
                        key={divName}
                        className={`rounded-xl border ${colors.border} ${colors.bg} p-3`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`w-6 h-6 rounded-full ${colors.badge} text-white text-xs font-bold flex items-center justify-center`}>
                              {divName}
                            </span>
                            <span className={`text-sm font-semibold ${colors.text}`}>
                              Division {divName}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {divPlayers.length} team{divPlayers.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        {divPlayers.length === 0 ? (
                          <p className="text-xs text-muted-foreground/50 italic py-1">
                            No teams assigned
                          </p>
                        ) : (
                          <div className="space-y-1">
                            {divPlayers.map((p) => (
                              <div
                                key={p.id}
                                className="flex items-center justify-between gap-2 py-1 px-2 rounded-lg hover:bg-white/5 transition-colors"
                              >
                                <span className="text-sm text-foreground truncate">
                                  {p.name}
                                </span>
                                <div className="flex gap-1 flex-shrink-0">
                                  {otherDivisions(divName).map((targetDiv) => (
                                    <button
                                      key={targetDiv}
                                      type="button"
                                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md border transition-colors ${
                                        divColors[targetDiv].border
                                      } ${divColors[targetDiv].text} hover:${divColors[targetDiv].bg} opacity-60 hover:opacity-100`}
                                      title={`Move to Division ${targetDiv}`}
                                      onClick={() => {
                                        const newPlayers = [...players];
                                        newPlayers[p.originalIndex] = {
                                          ...newPlayers[p.originalIndex],
                                          division: targetDiv,
                                        } as any;
                                        dispatch({
                                          type: "SET_STATE",
                                          payload: { players: newPlayers },
                                        });
                                      }}
                                    >
                                      → {targetDiv}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

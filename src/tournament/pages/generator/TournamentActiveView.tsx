import React, { useEffect } from "react";
import { useTournament } from "@/context/TournamentContext";
import Leaderboard from "@/tournament/ui/components/Leaderboard";
import Schedule from "@/tournament/ui/components/Schedule";
import { showConfirmModal, showInputModal } from "@/tournament/core/modals";
import { showToast, createId } from "@/shared/utils";
import { MatchTimer } from "@/tournament/ui/components/MatchTimer";
import { launchConfetti } from "@/tournament/confetti";
import { saveToHistory } from "@/tournament/history/repository";

const TournamentActiveView: React.FC = () => {
  const { state, dispatch, undo, canUndo } = useTournament();
  const { tournamentName, format, courts, scoringMode, pointsPerMatch } = state;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleReset = () => {
    showConfirmModal(
      "Reset Tournament",
      "This will clear all scores and rounds. Players will remain. Continue?",
      "Reset",
      () => {
        dispatch({ type: "RESET_TOURNAMENT" });
        showToast("Tournament reset");
      }
    );
  };

  const handleEnd = () => {
    showConfirmModal(
      "Finish Tournament",
      "Are you sure you want to finish the tournament? This will reveal the final standings and save it to history!",
      "Finish & Celebrate 🎉",
      () => {
        dispatch({
          type: "UPDATE_FIELD",
          key: "hideLeaderboard",
          value: false,
        });
        dispatch({
          type: "UPDATE_FIELD",
          key: "showPositionChanges",
          value: false,
        });

        saveToHistory(state);
        launchConfetti();

        const el = document.querySelector(".leaderboard-section");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });

        showToast("Tournament Finished & Saved! 🏆");
      }
    );
  };

  const handleUndo = () => {
    if (canUndo) {
      undo();
      showToast("Undo successful");
    }
  };

  const handleAddLatePlayer = () => {
    const isTeam = format.startsWith("team");
    const entityName = isTeam ? "team" : "player";

    showInputModal(
      isTeam ? "Add Late Team" : "Add Late Player",
      `Enter new ${entityName} name:`,
      (name) => {
        if (!name || !name.trim()) return;

        const proceed = () => {
          dispatch({
            type: "ADD_LATE_PLAYER",
            player: { id: createId(), name: name.trim(), lockedCourt: null },
          });
          showToast(`${name.trim()} added to tournament`);
        };

        if (format === "americano" || format === "team") {
          showConfirmModal(
            "Switch to Mexicano?",
            "Adding a player mid-tournament requires switching to Mexicano (Dynamic) logic. Continue?",
            "Switch & Add",
            () => {
              dispatch({
                type: "UPDATE_FIELD",
                key: "format",
                value: "mexicano",
              });
              dispatch({ type: "UPDATE_FIELD", key: "allRounds", value: null });
              proceed();
            }
          );
        } else {
          proceed();
        }
      },
      `They will join with 0 points and start playing from the next round.`
    );
  };

  const formatLabel =
    {
      americano: "Americano",
      mexicano: "Mexicano",
      team: "Team Americano",
      teamMexicano: "Team Mexicano",
    }[format] || "Tournament";

  const scoringLabel =
    {
      total: "Total Points",
      race: "Race to Points",
      time: "Time Based",
    }[scoringMode] || "Scoring";

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      {/* Header */}
      <header className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-3">
            {tournamentName || "Live Tournament"}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
              {formatLabel}
            </span>
            <span className="px-3 py-1 bg-card text-muted-foreground text-sm font-medium rounded-full border border-border">
              {courts} Courts
            </span>
            <span className="px-3 py-1 bg-card text-muted-foreground text-sm font-medium rounded-full border border-border">
              {scoringLabel}
            </span>
            <span className="px-3 py-1 bg-card text-muted-foreground text-sm font-medium rounded-full border border-border">
              {scoringMode === "time"
                ? `${pointsPerMatch} Mins`
                : `${pointsPerMatch} Pts`}
            </span>
          </div>
        </div>

        <MatchTimer />

        {/* Enhanced Sticky Toolbar */}
        <div className="sticky top-20 z-40 mb-8 mx-auto max-w-4xl">
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl p-2 md:p-3 transition-all duration-300">
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
              
              {/* Primary Actions Group */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-start">
                <button
                  className={`p-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                    canUndo
                      ? "bg-popover hover:bg-accent/10 text-foreground hover:text-accent border border-border hover:border-accent/30 shadow-sm"
                      : "opacity-40 cursor-not-allowed bg-popover/50 text-muted-foreground border border-transparent"
                  }`}
                  onClick={handleUndo}
                  disabled={!canUndo}
                  title="Undo last action"
                >
                  <span className="text-lg">↩</span>
                  <span className="hidden sm:inline text-sm font-medium">Undo</span>
                </button>

                <div className="w-px h-8 bg-border hidden sm:block mx-1" />

                <button
                  className="flex-1 sm:flex-none py-3 px-4 bg-accent hover:bg-accent-dark text-white rounded-xl font-bold shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                  onClick={handleAddLatePlayer}
                >
                  <span className="text-lg">+</span>
                  <span className="text-sm">Add Player</span>
                </button>
              </div>

              {/* Settings & Destructive Group */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end">
                
                {/* View Settings (Compact) */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-xl border border-white/5">
                    <span className="text-xs font-bold text-muted-foreground ml-1">GRID</span>
                    <input
                      type="range"
                      min="0"
                      max="4"
                      step="1"
                      className="w-16 accent-accent cursor-pointer"
                      value={state.gridColumns}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_FIELD",
                          key: "gridColumns",
                          value: parseInt(e.target.value),
                        })
                      }
                      title="Adjust Grid Columns"
                    />
                  </div>

                  <div className="flex items-center gap-2 bg-black/20 p-1.5 rounded-xl border border-white/5">
                    <span className="text-xs font-bold text-muted-foreground ml-1">SIZE</span>
                    <input
                      type="range"
                      min="50"
                      max="350"
                      step="10"
                      className="w-16 accent-accent cursor-pointer"
                      value={state.textSize}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_FIELD",
                          key: "textSize",
                          value: parseInt(e.target.value),
                        })
                      }
                      title="Adjust Text Size"
                    />
                  </div>
                </div>

                <div className="w-px h-8 bg-border hidden sm:block mx-1" />

                {state.schedule.some((r) => r.completed) && (
                  <button
                    className="py-2.5 px-4 bg-success/10 hover:bg-success/20 text-success border border-success/20 rounded-xl font-bold transition-all hover:scale-105 flex items-center gap-2"
                    onClick={handleEnd}
                    title="Finish & Save"
                  >
                    🏆 <span className="hidden sm:inline">Finish</span>
                  </button>
                )}

                <button
                  className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors flex items-center gap-2"
                  onClick={handleReset}
                  title="Reset Tournament"
                >
                  <span>🔄</span>
                  <span className="hidden sm:inline text-sm font-medium">Reset</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Schedule */}
      <div className="mb-16">
        <Schedule />
      </div>

      {/* Leaderboard */}
      <div className="mb-24 leaderboard-section">
        <Leaderboard />
      </div>
    </div>
  );
};

export default TournamentActiveView;

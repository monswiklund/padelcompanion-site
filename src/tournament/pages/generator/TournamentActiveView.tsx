import React, { useEffect, useState } from "react";
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
  const [showSettings, setShowSettings] = useState(false);

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
      division: "Division",
    }[format] || "Tournament";

  const scoringLabel =
    {
      total: "Total Points",
      race: "Race to Points",
      time: "Time Based",
    }[scoringMode] || "Scoring";

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-32 animate-fade-in">
      {/* Header */}
      <header className="mb-12">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-3 tracking-tight">
            {tournamentName || "Live Tournament"}
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-full border border-accent/20 uppercase tracking-widest">
              {formatLabel}
            </span>
            <span className="px-3 py-1 bg-card text-muted-foreground text-xs font-bold rounded-full border border-border uppercase tracking-widest">
              {courts} Courts
            </span>
            <span className="px-3 py-1 bg-card text-muted-foreground text-xs font-bold rounded-full border border-border uppercase tracking-widest">
              {scoringLabel}
            </span>
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

      {/* Sticky Bottom Toolbar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
        <div className="bg-card/90 backdrop-blur-xl border border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.4)] rounded-3xl p-2 md:p-3 max-w-5xl mx-auto pointer-events-auto transition-all duration-300">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left Actions */}
            <div className="flex items-center gap-2">
              <button
                className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl transition-all flex items-center justify-center border ${
                  canUndo
                    ? "bg-popover hover:bg-accent/10 text-foreground hover:text-accent border-border hover:border-accent/30 shadow-sm"
                    : "opacity-30 cursor-not-allowed bg-popover/50 text-muted-foreground border-transparent"
                }`}
                onClick={handleUndo}
                disabled={!canUndo}
                title="Undo last action"
              >
                <span className="text-lg md:text-xl">↩</span>
              </button>

              <button
                className="h-10 md:h-12 px-4 md:px-6 bg-accent hover:bg-accent-dark text-white rounded-2xl font-black shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
                onClick={handleAddLatePlayer}
              >
                <span className="text-xl">+</span>
                <span className="hidden sm:inline text-xs uppercase tracking-tighter font-black">Add Player</span>
              </button>
            </div>

            {/* Center: Timer */}
            <div className="flex-shrink-0">
              <MatchTimer />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              
              {/* Settings Popover */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl transition-all flex items-center justify-center border ${
                    showSettings 
                      ? "bg-accent text-white border-accent shadow-glow" 
                      : "bg-popover hover:bg-white/5 text-muted-foreground border-border"
                  }`}
                  title="View Settings"
                >
                  <span className="text-lg md:text-xl">⚙️</span>
                </button>

                {showSettings && (
                  <div className="absolute right-0 bottom-full mb-4 w-56 bg-popover/95 backdrop-blur-xl border border-border shadow-2xl rounded-3xl p-5 animate-fade-in-up z-[60]">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">View Settings</h4>
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-foreground uppercase">Grid Layout</span>
                          <span className="text-[10px] font-mono text-accent font-bold">{state.gridColumns || 'Auto'}</span>
                        </div>
                        <input
                          type="range" min="0" max="4" step="1"
                          className="w-full accent-accent cursor-pointer"
                          value={state.gridColumns}
                          onChange={(e) => dispatch({ type: "UPDATE_FIELD", key: "gridColumns", value: parseInt(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-foreground uppercase">Zoom Level</span>
                          <span className="text-[10px] font-mono text-accent font-bold">{state.textSize}%</span>
                        </div>
                        <input
                          type="range" min="50" max="350" step="10"
                          className="w-full accent-accent cursor-pointer"
                          value={state.textSize}
                          onChange={(e) => dispatch({ type: "UPDATE_FIELD", key: "textSize", value: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-px h-8 bg-white/10 mx-1 hidden sm:block" />

              {state.schedule.some((r) => r.completed) && (
                <button
                  className="h-10 md:h-12 px-4 md:px-6 bg-success text-white rounded-2xl font-black shadow-lg shadow-success/20 hover:shadow-success/40 transition-all flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
                  onClick={handleEnd}
                >
                  🏆 <span className="hidden md:inline text-xs uppercase tracking-tighter font-black">Finish</span>
                </button>
              )}

              <button
                className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-2xl transition-colors flex items-center justify-center"
                onClick={handleReset}
                title="Reset Tournament"
              >
                <span className="text-lg md:text-xl">🔄</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentActiveView;
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
  const { state, dispatch } = useTournament();
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
    console.log("Undo not implemented yet in React");
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
          <h2 className="text-3xl font-bold text-primary mb-3">
            {tournamentName || "Live Tournament"}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
              {formatLabel}
            </span>
            <span className="px-3 py-1 bg-card text-secondary text-sm font-medium rounded-full border border-theme">
              {courts} Courts
            </span>
            <span className="px-3 py-1 bg-card text-secondary text-sm font-medium rounded-full border border-theme">
              {scoringLabel}
            </span>
            <span className="px-3 py-1 bg-card text-secondary text-sm font-medium rounded-full border border-theme">
              {scoringMode === "time"
                ? `${pointsPerMatch} Mins`
                : `${pointsPerMatch} Pts`}
            </span>
          </div>
        </div>

        <MatchTimer />

        {/* Tool Panel */}
        <div className="bg-card/50 backdrop-blur-md border border-theme rounded-2xl p-4 max-w-4xl mx-auto">
          {/* Actions Row */}
          <div className="flex flex-wrap gap-3 justify-center items-center mb-4">
            <button
              className="px-3 py-1.5 text-sm font-medium text-secondary hover:text-primary hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
              onClick={handleUndo}
              title="Undo last action"
            >
              <span>↩</span> Undo
            </button>

            <div className="w-px h-6 bg-theme hidden sm:block" />

            <button
              className="px-4 py-2 text-sm font-medium bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors flex items-center gap-2 shadow-md"
              onClick={handleAddLatePlayer}
            >
              <span className="text-lg">+</span> Add Player
            </button>

            <div className="flex-1" />

            <button
              className="px-3 py-1.5 text-sm font-medium text-success hover:bg-success/10 rounded-lg transition-colors flex items-center gap-2"
              onClick={handleEnd}
            >
              <span>🏆</span> Finish Tournament
            </button>

            <button
              className="px-3 py-1.5 text-sm font-medium text-muted hover:text-primary hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
              onClick={handleReset}
            >
              <span>🔄</span> Reset
            </button>
          </div>

          <div className="h-px bg-theme w-full mb-4" />

          {/* Settings Row */}
          <div className="flex flex-wrap gap-6 justify-center items-center text-sm">
            <div className="flex items-center gap-3 bg-elevated/50 px-3 py-2 rounded-lg border border-theme">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">
                Grid
              </span>
              <input
                type="range"
                min="0"
                max="4"
                step="1"
                className="w-24 accent-accent"
                value={state.gridColumns}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    key: "gridColumns",
                    value: parseInt(e.target.value),
                  })
                }
              />
              <span className="w-8 text-center font-mono text-xs bg-black/20 rounded px-1 text-secondary">
                {state.gridColumns || "Auto"}
              </span>
            </div>

            <div className="flex items-center gap-3 bg-elevated/50 px-3 py-2 rounded-lg border border-theme">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">
                Text Size
              </span>
              <input
                type="range"
                min="50"
                max="350"
                step="10"
                className="w-32 accent-accent"
                value={state.textSize}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    key: "textSize",
                    value: parseInt(e.target.value),
                  })
                }
              />
              <span className="w-10 text-center font-mono text-xs bg-black/20 rounded px-1 text-secondary">
                {state.textSize}%
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Schedule */}
      <div className="mb-16">
        <Schedule />
      </div>

      {/* Leaderboard */}
      <div className="mb-24">
        <Leaderboard />
      </div>
    </div>
  );
};

export default TournamentActiveView;

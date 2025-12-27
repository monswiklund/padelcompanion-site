import React, { useEffect } from "react";
import { useTournament } from "@/context/TournamentContext";
import Leaderboard from "@/tournament/ui/components/Leaderboard";
import Schedule from "@/tournament/ui/components/Schedule";
import { showConfirmModal, showInputModal } from "@/tournament/core/modals";
import { showToast, createId } from "@/shared/utils";
import { MatchTimer } from "@/tournament/ui/components/MatchTimer";

const TournamentActiveView: React.FC = () => {
  const { state, dispatch } = useTournament();
  const { tournamentName, format, courts, scoringMode, pointsPerMatch } = state;

  useEffect(() => {
    // Scroll to top when entering active view
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
      "End Tournament",
      "Are you sure you want to end this tournament and return to setup?",
      "End Tournament",
      () => {
        dispatch({ type: "RESET_TOURNAMENT" });
        showToast("Tournament ended");
      }
    );
  };

  const handleUndo = () => {
    // TODO: Implement undo in state
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
    <div className="tournament-active-view container animate-fade-in">
      <header className="tournament-active-header">
        <div className="header-top">
          <div className="tournament-title-area">
            <h2>{tournamentName || "Live Tournament"}</h2>
            <div className="game-details" id="gameDetails">
              <div className="game-detail-item">
                <span className="detail-label">{formatLabel}</span>
              </div>
              <div className="game-detail-item">
                <span className="detail-label">{courts} Courts</span>
              </div>
              <div className="game-detail-item">
                <span className="detail-label">{scoringLabel}</span>
              </div>
              <div className="game-detail-item">
                <span className="detail-label">
                  {scoringMode === "time"
                    ? `${pointsPerMatch} Mins`
                    : `${pointsPerMatch} Pts`}
                </span>
              </div>
            </div>
          </div>

          <MatchTimer />

          {/* Unified Tool Panel */}
          <div className="bg-base-300/50 backdrop-blur-md border border-white/10 rounded-2xl p-4 mb-6 shadow-xl max-w-4xl mx-auto w-full">
            {/* Top Row: Actions */}
            <div className="flex flex-wrap gap-3 justify-center items-center mb-4">
              <button
                className="btn btn-sm btn-ghost gap-2 normal-case"
                onClick={handleUndo}
                title="Undo last action"
              >
                <span className="icon">↩</span> Undo
              </button>
              <div className="w-px h-6 bg-white/10 mx-2 hidden sm:block"></div>
              <button
                className="btn btn-sm btn-primary gap-2 normal-case shadow-lg shadow-primary/20"
                onClick={handleAddLatePlayer}
              >
                <span className="icon text-lg">+</span> Add Player
              </button>
              <div className="flex-1"></div>{" "}
              {/* Spacer to push dangerous actions right on desktop */}
              <button
                className="btn btn-sm btn-ghost text-error/80 hover:bg-error/10 hover:text-error gap-2 normal-case"
                onClick={handleEnd}
              >
                <span className="icon">✖</span> End
              </button>
              <button
                className="btn btn-sm btn-ghost hover:bg-white/5 gap-2 normal-case opacity-70 hover:opacity-100"
                onClick={handleReset}
              >
                <span className="icon">🔄</span> Reset
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/5 w-full mb-4"></div>

            {/* Bottom Row: View Settings */}
            <div className="flex flex-wrap gap-8 justify-center items-center text-sm">
              <div className="flex items-center gap-3 bg-base-100/30 px-3 py-2 rounded-lg border border-white/5">
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                  Grid
                </span>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="1"
                  className="range range-xs range-secondary w-24"
                  value={state.gridColumns}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_FIELD",
                      key: "gridColumns",
                      value: parseInt(e.target.value),
                    })
                  }
                />
                <span className="w-8 text-center font-mono text-xs bg-black/20 rounded px-1">
                  {state.gridColumns || "Auto"}
                </span>
              </div>

              <div className="flex items-center gap-3 bg-base-100/30 px-3 py-2 rounded-lg border border-white/5">
                <span className="text-xs font-bold uppercase tracking-wider opacity-60">
                  Text Size
                </span>
                <input
                  type="range"
                  min="50"
                  max="350"
                  step="10"
                  className="range range-xs range-secondary w-32"
                  value={state.textSize}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_FIELD",
                      key: "textSize",
                      value: parseInt(e.target.value),
                    })
                  }
                />
                <span className="w-10 text-center font-mono text-xs bg-black/20 rounded px-1">
                  {state.textSize}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="tournament-grid">
        <div className="tournament-main">
          <Schedule />
        </div>
        <aside className="tournament-sidebar">
          <Leaderboard />
        </aside>
      </div>

      <div className="tournament-footer-actions">
        <button className="btn btn-primary" onClick={() => window.print()}>
          Print Results
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: "Tournament Results",
                text: `Check out our ${formatLabel} tournament!`,
                url: window.location.href,
              });
            } else {
              showToast("Sharing not supported on this browser");
            }
          }}
        >
          Share Standings
        </button>
      </div>
    </div>
  );
};

export default TournamentActiveView;

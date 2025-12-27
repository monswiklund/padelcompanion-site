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

          <div className="tournament-toolbar">
            <button
              className="btn btn-secondary toolbar-btn"
              onClick={handleUndo}
              title="Undo last action"
            >
              <span className="icon">↩</span> Undo
            </button>
            <button
              className="btn btn-secondary toolbar-btn"
              onClick={handleAddLatePlayer}
              title="Add a player to active tournament"
            >
              <span className="icon">👤+</span> Add Player
            </button>
            <button
              className="btn btn-secondary toolbar-btn"
              onClick={handleReset}
              title="Reset all scores"
            >
              <span className="icon">🔄</span> Reset
            </button>
            <button
              className="btn btn-error toolbar-btn"
              onClick={handleEnd}
              title="End tournament"
            >
              <span className="icon">✖</span> End
            </button>
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

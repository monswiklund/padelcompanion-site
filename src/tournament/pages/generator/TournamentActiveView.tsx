import React, { useEffect, useState } from "react";
import { useTournament } from "@/context/TournamentContext";
import Leaderboard from "@/tournament/ui/components/Leaderboard";
import Schedule from "@/tournament/ui/components/Schedule";
import { showConfirmModal, showInputModal } from "@/tournament/core/modals";
import { showToast, createId } from "@/shared/utils";
import { MatchTimer } from "@/tournament/ui/components/MatchTimer";
import { launchConfetti } from "@/tournament/confetti";
import { saveToHistory } from "@/tournament/history/repository";
import { CloudService } from "@/tournament/sync/cloud";
import { saveTournamentCloudLink, getTournamentCloudLink } from "@/tournament/sync/sessionLink";
import { buildTournamentShareUrl } from "@/tournament/navigation";
import PlayoffStandings from "@/tournament/ui/components/PlayoffStandings";
import { SettingsIcon, CloudIcon, TrophyIcon, RefreshIcon, EditIcon } from "@/components/ui/Icons";
import {
  formatEstimatedRoundStart,
  getEstimatedRoundStartRelativeLabel,
} from "@/tournament/ui/components/scheduleTiming";

const TournamentActiveView: React.FC = () => {
  const { state, dispatch, undo, canUndo } = useTournament();
  const { tournamentName, format, courts, scoringMode, pointsPerMatch } = state;
  const [showSettings, setShowSettings] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

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
      "Finish & Celebrate",
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

        showToast("Tournament Finished & Saved!");
      }
    );
  };

  const handleUndo = () => {
    if (canUndo) {
      undo();
      showToast("Undo successful");
    }
  };

  const handleRename = () => {
    showInputModal(
      "Rename Tournament",
      "Enter new tournament name:",
      (newName) => {
        if (newName) {
          dispatch({ type: "UPDATE_FIELD", key: "tournamentName", value: newName.trim() });
          showToast("Tournament renamed");
        }
      },
      "",
      tournamentName || "Unnamed Tournament"
    );
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

  const handleCloudSync = async () => {
    if (!CloudService.isConfigured()) {
      showToast("Cloud sync API is not configured", "error");
      return;
    }

    if (!state.players.length) {
      showToast("Add players before sharing a tournament", "warning");
      return;
    }

    setIsSyncing(true);
    try {
      const existingLink = getTournamentCloudLink(state.tournamentName || "");
      const summary = existingLink
        ? await CloudService.updateSession(
            existingLink.sessionId,
            existingLink.editToken || "",
            state,
          )
        : await CloudService.createSession(state);

      saveTournamentCloudLink(state.tournamentName || "Untitled Tournament", summary);

      const shareUrl = buildTournamentShareUrl(summary.shareCode);
      try {
        await navigator.clipboard.writeText(shareUrl);
        showToast(`Cloud sync updated. Link copied for code: ${summary.shareCode}`, "success");
      } catch {
        showToast(`Cloud sync updated. Share link ready for code: ${summary.shareCode}`, "success");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to sync tournament";
      showToast(message, "error");
    } finally {
      setIsSyncing(false);
    }
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

  const isDivision = format === "division";
  const currentRound = state.schedule[state.schedule.length - 1] || null;
  const currentRoundLabel = currentRound
    ? currentRound.name || `Round ${currentRound.number}`
    : "No Active Round";
  const reportedMatches = currentRound
    ? currentRound.matches.filter(
        (match) => match.score1 != null && match.score2 != null,
      ).length
    : 0;
  const totalMatches = currentRound?.matches.length || 0;

  const upcomingRound =
    state.allRounds && state.schedule.length < state.allRounds.length
      ? state.allRounds[state.schedule.length]
      : null;

  const upcomingLabel = upcomingRound
    ? upcomingRound.name || `Round ${upcomingRound.number}`
    : currentRound?.name === "Semifinal"
      ? "Final auto-generates on completion"
      : !state.schedule.some((round) => round.name === "Semifinal") &&
          state.allRounds &&
          state.schedule.length === state.allRounds.length
        ? "Semis auto-generate on completion"
        : "Next stage appears automatically";

  const currentRoundStatus = !currentRound
    ? "Idle"
    : currentRound.completed
      ? "Completed"
      : state.roundStartedAt
        ? "Ongoing"
        : "Ready";

  const nextStartLabel = upcomingRound
    ? formatEstimatedRoundStart(state, upcomingRound.number - 1)
    : null;
  const nextStartRelative = upcomingRound
    ? getEstimatedRoundStartRelativeLabel(state, upcomingRound.number - 1)
    : null;

  return (
    <div className={`mx-auto px-4 py-6 pb-32 animate-fade-in ${
      isDivision ? "max-w-[1600px]" : "max-w-7xl"
    }`}>
      {/* Header */}
      <header className="mb-12">
        <div className="text-center mb-6">
          <div 
            className="group cursor-pointer inline-flex items-center justify-center gap-3 mb-3"
            onClick={handleRename}
          >
            <h2 className="text-3xl font-bold text-foreground tracking-tight group-hover:text-accent transition-colors">
              {tournamentName || "Live Tournament"}
            </h2>
            <EditIcon size={18} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0" />
          </div>
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
      <div className="mb-6">
        <Schedule />
      </div>

      {/* Toolbar (Under Schedule) */}
      <div className="mb-16 flex justify-center w-full relative z-10">
        <div className="relative bg-glass-background backdrop-blur-xl border border-glass-border shadow-xl rounded-3xl p-3 w-full mx-auto max-w-5xl">
          <div className="flex items-center justify-between gap-1 sm:gap-4 overflow-x-auto hide-scrollbar-mobile">
            <div className="flex items-center gap-2 shrink-0">
              <button
                className={`w-10 h-10 md:w-11 md:h-11 rounded-2xl transition-all flex items-center justify-center border ${
                  canUndo
                    ? "bg-popover hover:bg-accent/10 text-foreground hover:text-accent border-border hover:border-accent/30 shadow-sm"
                    : "opacity-30 cursor-not-allowed bg-popover/50 text-muted-foreground border-transparent"
                }`}
                onClick={handleUndo}
                disabled={!canUndo}
                title="Undo last action"
              >
                <span className="text-lg">↩</span>
              </button>

              <button
                className="h-10 md:h-11 px-3 md:px-4 bg-popover hover:bg-accent/10 text-foreground border border-border rounded-2xl font-black shadow-sm transition-all flex items-center gap-1.5 active:translate-y-0"
                onClick={handleAddLatePlayer}
              >
                <span className="text-lg md:text-xl leading-none -mt-0.5">+</span>
                <span className="hidden sm:inline text-[10px] md:text-xs uppercase tracking-widest">
                  {format.startsWith("team") || isDivision ? "Add Team" : "Add Player"}
                </span>
              </button>
            </div>

            <div className="flex-shrink-0 flex items-center justify-center px-1">
              <MatchTimer />
            </div>

            <div className="flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`w-10 h-10 md:w-11 md:h-11 rounded-2xl transition-all flex items-center justify-center border ${
                  showSettings 
                    ? "bg-accent text-white border-accent shadow-glow" 
                    : "bg-popover hover:bg-surface-hover text-muted-foreground border-border"
                }`}
                title="View Settings"
              >
                <SettingsIcon size={18} />
              </button>

              <div className="w-px h-6 bg-border mx-0.5 hidden sm:block" />

              <button
                className="h-10 md:h-11 px-3 md:px-4 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-black shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 transition-all flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleCloudSync}
                disabled={isSyncing}
                title="Save tournament to cloud and copy share code"
              >
                <CloudIcon size={18} />
                <span className="hidden md:inline text-[10px] md:text-xs uppercase tracking-widest font-black">
                  {isSyncing ? "Syncing" : "Share"}
                </span>
              </button>

              {(!isDivision && state.schedule.some((r) => r.completed)) && (
                <button
                  className="h-10 md:h-11 px-3 md:px-4 bg-success text-white rounded-2xl font-black shadow-lg shadow-success/20 hover:shadow-success/40 transition-all flex items-center gap-1.5"
                  onClick={handleEnd}
                >
                  <TrophyIcon size={16} />
                  <span className="hidden lg:inline text-[10px] md:text-xs uppercase tracking-widest font-black">Finish</span>
                </button>
              )}

              <button
                className="w-10 h-10 md:w-11 md:h-11 text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-border bg-popover rounded-2xl transition-colors flex items-center justify-center"
                onClick={handleReset}
                title="Reset Tournament"
              >
                <RefreshIcon size={18} />
              </button>
            </div>
          </div>

          {showSettings && (
            <div className="absolute right-4 sm:right-8 bottom-[calc(100%+8px)] w-56 bg-popover/95 backdrop-blur-xl border border-border shadow-2xl rounded-3xl p-5 animate-fade-in-up z-[60]">
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">View Settings</h4>
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-foreground uppercase">Grid Layout</span>
                  </div>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() => dispatch({ type: "UPDATE_FIELD", key: "gridColumns", value: num })}
                        className={`flex-1 h-8 rounded-lg text-[10px] font-bold transition-all border ${
                          state.gridColumns === num
                            ? "bg-accent text-white border-accent shadow-sm"
                            : "bg-popover text-muted-foreground border-border hover:border-accent/30 hover:text-foreground"
                        }`}
                      >
                        {num === 0 ? "Auto" : num}
                      </button>
                    ))}
                  </div>
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
      </div>

      {/* Playoff Standings */}
      <PlayoffStandings />

      {/* Leaderboard */}
      <div className="mb-8 leaderboard-section">
        <Leaderboard />
      </div>
    </div>
  );
};

export default TournamentActiveView;

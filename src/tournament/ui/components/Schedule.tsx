import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  useTournament,
  Player,
  Round,
  Match,
} from "@/context/TournamentContext";
import { showConfirmModal } from "@/tournament/core/modals";
import { showToast } from "@/shared/utils";
import { launchConfetti } from "@/tournament/confetti";
import {
  formatEstimatedRoundStart,
  getEstimatedRoundStartRelativeLabel,
} from "./scheduleTiming";
import { getCourtDisplayName } from "../courtNames";
import { getDivisionColor, DIVISION_COLORS } from "../../core/constants";
const getDivisionStyles = (division: string, divisions: any[]) => {
  const colors = getDivisionColor(divisions, division);
  return `${colors.bg} ${colors.text} ${colors.border}`;
};

const NextRoundPreviewCard: React.FC<{
  nextRoundPreview: Round;
  getCourtName: (courtNum: number, division?: string | null) => string;
  className?: string;
}> = ({
  nextRoundPreview,
  getCourtName,
  className = "",
}) => {
  const { state } = useTournament();

  if (!nextRoundPreview.matches.length) return null;

  return (
    <div className={`rounded-2xl border border-accent/20 bg-accent/5 p-4 ${className}`}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-accent">
            Nästa Runda
          </h4>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
            <p className="text-sm text-muted-foreground">
              Lag som väntar på Runda {nextRoundPreview.number}.
            </p>
            <span className="text-sm font-bold text-foreground">
              Est. start: {formatEstimatedRoundStart(state, nextRoundPreview.number - 1)}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-background/70 border border-accent/15 text-[10px] font-black uppercase tracking-wider text-accent">
              {getEstimatedRoundStartRelativeLabel(state, nextRoundPreview.number - 1)}
            </span>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-accent text-white text-[10px] font-black uppercase tracking-wider">
          Runda {nextRoundPreview.number}
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
        {nextRoundPreview.matches.map((match, idx) => {
          const matchDivision =
            state.format === "division"
              ? (match.team1[0] as any)?.division ||
                (match.team1[0] as any)?.divisionId ||
                (match.team2[0] as any)?.division ||
                (match.team2[0] as any)?.divisionId ||
                "A"
              : null;

          return (
            <div
              key={`${nextRoundPreview.number}-${idx}`}
              className="rounded-2xl border border-border bg-card/80 px-4 py-3"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {getCourtName(match.court, matchDivision)}
                </div>
                {matchDivision && (
                  <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${getDivisionStyles(matchDivision, state.divisions || [])}`}>
                    Division {matchDivision}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="flex-1 font-semibold text-foreground truncate">
                  {match.team1.map((player) => player.name).join(" / ")}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                  vs
                </div>
                <div className="flex-1 text-right font-semibold text-foreground truncate">
                  {match.team2.map((player) => player.name).join(" / ")}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const UpcomingRoundsSidebar: React.FC<{
  rounds: Round[];
  getCourtName: (courtNum: number, division?: string | null) => string;
}> = ({ rounds, getCourtName }) => {
  const { state } = useTournament();

  if (!rounds.length) return null;

  return (
    <div className="rounded-3xl border border-accent/15 bg-card/95 p-4 shadow-xl">
      <div className="mb-4">
        <h3 className="text-xs font-black uppercase tracking-[0.22em] text-accent">
          Kommande Matcher
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Alla återstående rundor i schemat.
        </p>
      </div>

      <div className="h-[70vh] overflow-hidden rounded-2xl border border-border/70 bg-background/50">
        <div className="h-full space-y-4 overflow-y-auto p-3 pr-2 custom-scrollbar">
        {rounds.map((round) => (
          <section
            key={`${round.number}-${round.name || "round"}`}
            className="rounded-2xl border border-border bg-background/70 p-3"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <div className="text-sm font-black text-foreground">
                  {round.name || `Runda ${round.number}`}
                </div>
                <div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Start: {formatEstimatedRoundStart(state, round.number - 1)}
                </div>
              </div>
              <span className="rounded-full border border-accent/15 bg-accent/8 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-accent">
                {getEstimatedRoundStartRelativeLabel(state, round.number - 1)}
              </span>
            </div>

            <div className="space-y-2">
              {round.matches.map((match, idx) => {
                const matchDivision =
                  state.format === "division"
                    ? (match.team1[0] as any)?.divisionId ||
                      (match.team1[0] as any)?.division ||
                      (match.team2[0] as any)?.divisionId ||
                      (match.team2[0] as any)?.division ||
                      "A"
                    : null;

                return (
                  <div
                    key={`${round.number}-${idx}`}
                    className="rounded-xl border border-border bg-card/80 px-3 py-2"
                  >
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {getCourtName(match.court, matchDivision)}
                      </span>
                      {matchDivision && (
                        <span className={`px-1.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${getDivisionStyles(matchDivision, state.divisions || [])}`}>
                          {matchDivision}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
                      <div className="truncate font-semibold text-foreground">
                        {match.team1.map((player) => player.name).join(" / ")}
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                        vs
                      </div>
                      <div className="truncate text-right font-semibold text-foreground">
                        {match.team2.map((player) => player.name).join(" / ")}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
        </div>
      </div>
    </div>
  );
};

const RoundCard: React.FC<{
  round: Round;
  roundIndex: number;
  isLast: boolean;
  onComplete: () => void;
  onEdit: (matchIndex: number) => void;
  onScoreChange: (matchIndex: number, team: 1 | 2, val: number) => void;
  onToggleBye: (playerId: string) => void;
  nextRoundPreview?: Round | null;
}> = ({
  round,
  roundIndex,
  isLast,
  onComplete,
  onEdit,
  onScoreChange,
  onToggleBye,
  nextRoundPreview,
}) => {
  const { state, dispatch } = useTournament();
  const [isCollapsed, setIsCollapsed] = useState(round.completed && !isLast);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (round.completed) return;

    const selectedMatchId = state.ui.selectedMatchId;
    if (!selectedMatchId?.startsWith(`round-${roundIndex}-match-`)) return;

    const matchEl = document.getElementById(selectedMatchId);
    if (!matchEl) return;

    matchEl.scrollIntoView({ behavior: "smooth", block: "center" });
    const firstInput = matchEl.querySelector("input");
    if (firstInput instanceof HTMLInputElement) {
      firstInput.focus();
      firstInput.select();
    }

    dispatch({
      type: "UPDATE_FIELD",
      key: "ui",
      value: { ...state.ui, selectedMatchId: null },
    });
  }, [dispatch, round.completed, roundIndex, state.ui]);

  // Live timer for active round
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (!round.completed && state.roundStartedAt) {
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - state.roundStartedAt!) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [round.completed, state.roundStartedAt]);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const getCourtName = (courtNum: number, division?: string | null) => {
    return getCourtDisplayName(state, courtNum, division);
  };

  const getConstraintLabel = (constraint?: string) => {
    if (constraint === "repeats") return "Repeat allowed (Priority: Pattern)";
    if (constraint === "pattern") return "Pattern override (Priority: Repeats)";
    return "Constraint relaxed (Best effort)";
  };

  const getRoundCompletionStatus = () => {
    let completedCount = 0;
    const missing: string[] = [];

    round.matches.forEach((m) => {
      const hasScores =
        m.score1 !== undefined &&
        m.score1 !== null &&
        m.score2 !== undefined &&
        m.score2 !== null;
      if (hasScores) {
        completedCount++;
      } else {
        const matchDivision =
          state.format === "division"
            ? (m.team1[0] as any)?.division ||
              (m.team1[0] as any)?.divisionId ||
              (m.team2[0] as any)?.division ||
              (m.team2[0] as any)?.divisionId ||
              "A"
            : null;
        missing.push(getCourtName(m.court, matchDivision));
      }
    });

    if (completedCount === 0) return { status: "empty", missing };
    if (completedCount === round.matches.length)
      return { status: "complete", missing: [] };
    return { status: "partial", missing };
  };

  const { status, missing } = getRoundCompletionStatus();

  const handleCompleteClick = () => {
    if (status === "complete") {
      onComplete();
    } else if (status === "partial") {
      const msg = `Missing scores for:\n${missing
        .map((c) => "• " + c)
        .join("\n")}\n\nContinue anyway?`;
      showConfirmModal("Incomplete Round", msg, "Continue Anyway", onComplete);
    } else {
      showConfirmModal(
        "No Scores Entered",
        "You haven't entered any scores for this round. Are you sure you want to complete it as all 0-0?",
        "Complete w/ Zeros",
        onComplete,
      );
    }
  };

  const getCompleteButtonLabel = () => {
    if (round.name === "Final") return "Finish Tournament";
    if (nextRoundPreview?.name === "Semifinal") {
      return `Complete Round ${round.number} & Generate Semis`;
    }
    if (round.name === "Semifinal" || nextRoundPreview?.name === "Final") {
      return "Complete Semifinal & Generate Final";
    }
    return `Complete Round ${round.number}`;
  };

  return (
    <GlassCard
      padding="none"
      className={`overflow-hidden mb-6 transition-all scroll-mt-24 ${
        round.completed ? "opacity-80" : ""
      }`}
      id={`round-${roundIndex}`}
    >
      {/* Round Header */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b border-border cursor-pointer ${
          round.completed ? "bg-popover/50" : "bg-accent/5"
        }`}
        onClick={() => round.completed && setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-foreground">
            {round.name || `Round ${round.number}`}
          </span>
          {!round.completed && !state.roundStartedAt ? (
            /* Timer not started yet — show Start button */
            <button
              className="flex items-center gap-1.5 px-3 py-1 text-sm font-semibold bg-success hover:bg-success/80 text-primary-foreground rounded-lg transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: "UPDATE_FIELD", key: "roundStartedAt", value: Date.now() });
              }}
            >
              ▶ Start
            </button>
          ) : (
            <span className="text-sm font-mono bg-surface-hover px-2 py-0.5 rounded border border-border text-muted-foreground">
              {round.completed 
                ? formatDuration(round.durationSeconds || 0) 
                : formatDuration(elapsed)}
            </span>
          )}
          {round.completed ? (
            <span className="px-2 py-0.5 text-xs font-medium bg-success/20 text-success rounded-full">
              ✓ Completed
            </span>
          ) : state.roundStartedAt ? (
            <span className="px-2 py-0.5 text-xs font-medium bg-accent/20 text-accent rounded-full animate-pulse">
              ● Ongoing
            </span>
          ) : (
            <span className="px-2 py-0.5 text-xs font-medium bg-warning/20 text-warning rounded-full">
              ⏸ Ready
            </span>
          )}
        </div>
        {round.completed && isCollapsed && (
          <span className="text-sm text-muted-foreground">
            {round.matches.map((m) => `${m.score1}-${m.score2}`).join(" · ")}
          </span>
        )}
        {round.completed && (
          <span className="text-muted-foreground text-sm">
            {isCollapsed ? "▶" : "▼"}
          </span>
        )}
      </div>

      {/* Round Content */}
      {!isCollapsed && (
        <div className="p-4">
          {/* Matches Grid */}
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns:
                state.gridColumns > 0
                  ? `repeat(${state.gridColumns}, minmax(0, 1fr))`
                  : "repeat(auto-fit, minmax(280px, 1fr))",
              fontSize: `${state.textSize}%`,
            }}
          >
            {round.matches.map((match, mIdx) => {
              const matchCardId = `round-${roundIndex}-match-${mIdx}`;
              const isSelectedMatch = state.ui.selectedMatchId === matchCardId;
              // Determine division from players in this match
              const matchDivision = state.format === "division"
                ? (match.team1[0] as any)?.division ||
                  (match.team1[0] as any)?.divisionId ||
                  (match.team2[0] as any)?.division ||
                  (match.team2[0] as any)?.divisionId ||
                  "A"
                : null;
              const matchDivisionId =
                state.format === "division" ? matchDivision : null;
              
              const divColorEntry = matchDivisionId ? getDivisionColor(state.divisions || [], matchDivisionId) : null;
              const divStyle = divColorEntry ? { border: divColorEntry.border, badge: divColorEntry.badge, glow: divColorEntry.glow } : null;

              return (
              <div
                id={matchCardId}
                key={mIdx}
                className={`bg-popover rounded-xl border overflow-hidden relative group ${
                  isSelectedMatch
                    ? "border-accent ring-2 ring-accent/40 shadow-lg shadow-accent/20"
                    : divStyle
                      ? `${divStyle.border} shadow-lg ${divStyle.glow}`
                      : "border-border"
                }`}
              >
                {/* Court Background */}
                <div 
                  className="absolute inset-0 opacity-100 pointer-events-none bg-center bg-no-repeat bg-cover z-0"
                  style={{ backgroundImage: "url('/assets/court-bg.svg')" }}
                />
                
                <div className="relative z-10 flex flex-col h-full">
                  {/* Match Header */}
                  <div className="flex items-center justify-between px-3 py-2 bg-black/40 backdrop-blur-sm border-b border-white/10">
                    <div className="flex items-center gap-2">
                      {matchDivision && divStyle && (
                        <span className={`px-1.5 py-0.5 text-[10px] font-black rounded ${divStyle.badge} text-white uppercase tracking-wider`}>
                          {matchDivision}
                        </span>
                      )}
                      <span className="text-sm font-bold text-white drop-shadow-md">
                        {getCourtName(match.court, matchDivision)}
                      </span>
                    </div>
                    <span className="text-xs text-white/80 font-medium">
                      {state.scoringMode === "total"
                        ? `Total ${state.pointsPerMatch}`
                        : state.scoringMode === "race"
                          ? `Race to ${state.pointsPerMatch}`
                          : `${state.pointsPerMatch} mins`}
                    </span>
                    {match.relaxedConstraint && (
                      <span
                        className="w-5 h-5 flex items-center justify-center text-xs bg-warning/40 text-white border border-white/20 rounded-full cursor-help"
                        title={getConstraintLabel(match.relaxedConstraint)}
                      >
                        i
                      </span>
                    )}
                  </div>

                  {/* Teams */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-4 relative">
                      {/* Team 1 */}
                      <div className="flex-1 text-center">
                        {match.team1.map((p) => {
                          const names = p.name.includes("/") ? p.name.split("/") : [p.name];
                          return names.map((name, ni) => (
                            <div
                              key={`${p.id}-${ni}`}
                              className="font-bold drop-shadow-md truncate text-white"
                            >
                              {name.trim()}
                            </div>
                          ));
                        })}
                      </div>

                      <div className="text-white/60 font-black px-3 text-sm italic shrink-0">
                        VS
                      </div>

                      {/* Team 2 */}
                      <div className="flex-1 text-center">
                        {match.team2.map((p) => {
                          const names = p.name.includes("/") ? p.name.split("/") : [p.name];
                          return names.map((name, ni) => (
                            <div
                              key={`${p.id}-${ni}`}
                              className="font-bold drop-shadow-md truncate text-white"
                            >
                              {name.trim()}
                            </div>
                          ));
                        })}
                      </div>
                    </div>

                    {/* Score Input/Display */}
                    <div className="flex items-center justify-center gap-3">
                      {!round.completed ? (
                        <>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className={`w-16 h-12 text-center text-2xl font-black bg-black/50 border border-white/20 rounded-lg placeholder:text-white/40 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all shadow-inner [appearance:textfield] ${
                              (match.score1 ?? 0) > (match.score2 ?? 0) ? "text-green-400" : (match.score1 ?? 0) < (match.score2 ?? 0) ? "text-red-400" : (match.score1 !== 0 || match.score2 !== 0) ? "text-orange-400" : "text-white"
                            }`}
                            placeholder="0"
                            value={match.score1 != null ? match.score1 : ""}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => {
                              const val = e.target.value === "" ? 0 : parseInt(e.target.value);
                              if (!isNaN(val)) onScoreChange(mIdx, 1, val);
                            }}
                          />
                          <span className="text-2xl text-white/50 font-black">
                            -
                          </span>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className={`w-16 h-12 text-center text-2xl font-black bg-black/50 border border-white/20 rounded-lg placeholder:text-white/40 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all shadow-inner [appearance:textfield] ${
                              (match.score2 ?? 0) > (match.score1 ?? 0) ? "text-green-400" : (match.score2 ?? 0) < (match.score1 ?? 0) ? "text-red-400" : (match.score2 !== 0 || match.score1 !== 0) ? "text-orange-400" : "text-white"
                            }`}
                            placeholder="0"
                            value={match.score2 != null ? match.score2 : ""}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => {
                              const val = e.target.value === "" ? 0 : parseInt(e.target.value);
                              if (!isNaN(val)) onScoreChange(mIdx, 2, val);
                            }}
                          />
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2 w-full">
                          <div className="flex items-center gap-4">
                            <span className={`text-4xl font-black drop-shadow-xl ${
                              (match.score1 ?? 0) > (match.score2 ?? 0) ? "text-green-400" : (match.score1 ?? 0) < (match.score2 ?? 0) ? "text-red-400" : "text-orange-400"
                            }`}>
                              {match.score1}
                            </span>
                            <span className="text-2xl text-white/40 font-black">-</span>
                            <span className={`text-4xl font-black drop-shadow-xl ${
                              (match.score2 ?? 0) > (match.score1 ?? 0) ? "text-green-400" : (match.score2 ?? 0) < (match.score1 ?? 0) ? "text-red-400" : "text-orange-400"
                            }`}>
                              {match.score2}
                            </span>
                          </div>
                          <button
                            className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white bg-surface-hover hover:bg-white/10 rounded-full border border-border transition-all"
                            onClick={() => onEdit(mIdx)}
                          >
                            Edit Result
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Completed Checkmark Overlay */}
                {(match.score1 != null && match.score2 != null) && !round.completed && (
                  <div className="absolute top-2 right-2 z-20 w-5 h-5 bg-success rounded-full flex items-center justify-center shadow-lg border border-white/20 animate-in zoom-in duration-300">
                    <span className="text-[10px] text-white font-bold">✓</span>
                  </div>
                )}
              </div>
              );
            })}
          </div>

          {/* Byes */}
          {round.byes && round.byes.length > 0 && (
            <div className="mt-4 px-4 py-2 bg-warning/10 rounded-lg border border-warning/20 text-center">
              <span className="text-xs font-semibold text-warning uppercase mr-2">
                Resting:
              </span>
              <span className="text-sm text-muted-foreground">
                {round.byes.map((p) => p.name).join(", ")}
              </span>
            </div>
          )}

          {nextRoundPreview && (
            <NextRoundPreviewCard
              nextRoundPreview={nextRoundPreview}
              getCourtName={getCourtName}
              className="mt-6 xl:hidden"
            />
          )}

          {/* Bye Selector & Complete Button */}
          {!round.completed && isLast && (
            <div className="mt-6 space-y-4">
              {/* Bye Selector - Hidden in division format since schedule is predetermined */}
              {state.format !== "division" && (
                <div className="bg-popover rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      Toggle who rests next round:
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({state.manualByes.length} selected)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {state.leaderboard.map((p) => (
                      <button
                        key={p.id}
                        className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                          state.manualByes.includes(p.id)
                            ? "bg-warning/20 border-warning text-warning"
                            : "bg-card border-border text-muted-foreground hover:text-foreground"
                        }`}
                        onClick={() => onToggleBye(p.id)}
                      >
                        {p.name}
                        <span className="text-xs ml-1 opacity-60">
                          ({p.byeCount || 0})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Complete Button */}
              <button
                className={`w-full py-3 font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95 ${
                  status === "complete"
                    ? "bg-success hover:bg-success/80 text-primary-foreground shadow-success/20"
                    : "bg-popover hover:bg-card border border-border text-muted-foreground"
                }`}
                onClick={handleCompleteClick}
              >
                {getCompleteButtonLabel()}
              </button>
            </div>
          )}
        </div>
      )}
    </GlassCard>
  );
};

import FullScheduleModal from "./FullScheduleModal";

const Schedule: React.FC = () => {
  const { state, dispatch } = useTournament();
  const { schedule } = state;

  // Auto-scroll to the new round when schedule length increases
  useEffect(() => {
    if (schedule.length > 0) {
      const lastRoundIdx = schedule.length - 1;
      const el = document.getElementById(`round-${lastRoundIdx}`);
      if (el) {
        // Small delay to ensure render is complete and layout is settled
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [schedule.length]);

  const getCourtName = (courtNum: number, division?: string | null) => {
    return getCourtDisplayName(state, courtNum, division);
  };

  const nextRoundPreview =
    state.format === "division" &&
    state.allRounds &&
    schedule.length < state.allRounds.length
      ? state.allRounds[schedule.length]
      : null;

  const mergedRounds = (state.allRounds || []).map((round, index) =>
    schedule[index] ? schedule[index] : round
  );
  const upcomingRounds = mergedRounds.slice(schedule.length);

  const [isFullScheduleOpen, setIsFullScheduleOpen] = useState(false);

  const handleScoreChange = (
    rIdx: number,
    mIdx: number,
    team: 1 | 2,
    val: number,
  ) => {
    const newSchedule = [...schedule];
    const match = { ...newSchedule[rIdx].matches[mIdx] };
    if (team === 1) match.score1 = val;
    else match.score2 = val;

    if (state.scoringMode === "total") {
      if (team === 1) match.score2 = state.pointsPerMatch - val;
      else match.score1 = state.pointsPerMatch - val;
    } else if (state.scoringMode === "race") {
      // If entered score is less than target, other team must have won (reached target)
      // If entered score IS target, other team can be anything < target (we don't auto-fill)
      if (val < state.pointsPerMatch) {
        if (team === 1) match.score2 = state.pointsPerMatch;
        else match.score1 = state.pointsPerMatch;
      }
    }

    newSchedule[rIdx].matches[mIdx] = match;
    dispatch({ type: "UPDATE_FIELD", key: "schedule", value: newSchedule });
  };

  const handleCompleteRound = (rIdx: number) => {
    if (schedule[rIdx]?.name === "Final") {
      launchConfetti();
    }
    dispatch({ type: "COMPLETE_ROUND" });
    showToast(`Round ${rIdx + 1} Completed!`, "success");
  };

  const handleEditRound = (rIdx: number, mIdx: number) => {
    dispatch({ type: "EDIT_ROUND", roundIndex: rIdx, matchIndex: mIdx });
    showToast(`Round ${rIdx + 1} re-opened. Match ${mIdx + 1} is ready to edit`, "info");
  };

  const handleToggleBye = (playerId: string) => {
    const newByes = state.manualByes.includes(playerId)
      ? state.manualByes.filter((id) => id !== playerId)
      : [...state.manualByes, playerId];
    dispatch({ type: "UPDATE_FIELD", key: "manualByes", value: newByes });
  };

  const getRoundMetaLabel = (round: Round, idx: number) => {
    if (!round.completed) {
      return `Est. Start: ${formatEstimatedRoundStart(state, idx)}`;
    }

    if (round.durationSeconds == null) {
      return "Finished";
    }

    return `Finished · ${Math.round(round.durationSeconds / 60)} min`;
  };

  const hasDesktopPreview = upcomingRounds.some((round) => round.matches.length > 0);

  return (
    <div>
      <div className={`items-start gap-8 xl:grid ${hasDesktopPreview ? "xl:grid-cols-[minmax(0,1.25fr)_30rem]" : ""}`}>
        <div className="min-w-0">
          {schedule.map((round, idx) => (
            <div key={idx} id={`round-${idx}`} className="relative">
              <div className="absolute -top-4 left-6 z-10">
                <span className="px-3 py-1 rounded-full bg-background border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground shadow-sm">
                  {getRoundMetaLabel(round, idx)}
                </span>
              </div>
              <RoundCard
                round={round}
                roundIndex={idx}
                isLast={idx === schedule.length - 1}
                onComplete={() => handleCompleteRound(idx)}
                onEdit={(matchIndex) => handleEditRound(idx, matchIndex)}
                onScoreChange={(mIdx, team, val) =>
                  handleScoreChange(idx, mIdx, team, val)
                }
                onToggleBye={handleToggleBye}
                nextRoundPreview={idx === schedule.length - 1 ? nextRoundPreview : null}
              />
            </div>
          ))}
        </div>

        {hasDesktopPreview && (
          <aside className="hidden xl:block xl:sticky xl:top-24">
            <UpcomingRoundsSidebar
              rounds={upcomingRounds}
              getCourtName={getCourtName}
            />
          </aside>
        )}
      </div>

      {/* Full Schedule Access Button */}
      {state.format === "division" && state.allRounds && state.allRounds.length > 0 && (
        <div className="mt-8 text-center pb-8">
          <button
            onClick={() => setIsFullScheduleOpen(true)}
            className="inline-flex items-center px-6 py-3 rounded-xl bg-popover hover:bg-card border border-border text-foreground hover:text-accent font-bold transition-all shadow-lg"
          >
            Visa hela spelschemat
          </button>
        </div>
      )}

      <FullScheduleModal
        isOpen={isFullScheduleOpen}
        onClose={() => setIsFullScheduleOpen(false)}
      />
    </div>
  );
};

export default Schedule;
export { RoundCard };

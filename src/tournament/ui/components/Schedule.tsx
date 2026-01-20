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

const RoundCard: React.FC<{
  round: Round;
  roundIndex: number;
  isLast: boolean;
  onComplete: () => void;
  onEdit: () => void;
  onScoreChange: (matchIndex: number, team: 1 | 2, val: number) => void;
  onToggleBye: (playerId: string) => void;
  onSwapCourt?: (matchIndex: number, newCourt: number) => void;
}> = ({
  round,
  roundIndex,
  isLast,
  onComplete,
  onEdit,
  onScoreChange,
  onToggleBye,
  onSwapCourt,
}) => {
  const { state } = useTournament();
  const [isCollapsed, setIsCollapsed] = useState(round.completed && !isLast);
  const [swappingMatchIdx, setSwappingMatchIdx] = useState<number | null>(null);

  const getCourtName = (courtNum: number) => {
    if (
      state.courtFormat === "custom" &&
      state.customCourtNames[courtNum - 1]
    ) {
      return state.customCourtNames[courtNum - 1];
    }
    return `Court ${courtNum}`;
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
        missing.push(getCourtName(m.court));
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
            Round {round.number}
          </span>
          {round.completed ? (
            <span className="px-2 py-0.5 text-xs font-medium bg-success/20 text-success rounded-full">
              ✓ Completed
            </span>
          ) : (
            <span className="px-2 py-0.5 text-xs font-medium bg-accent/20 text-accent rounded-full animate-pulse">
              ● Ongoing
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
            {round.matches.map((match, mIdx) => (
              <div
                key={mIdx}
                className="bg-popover rounded-xl border border-border overflow-hidden relative group"
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
                      <span className="text-sm font-bold text-white drop-shadow-md">
                        {getCourtName(match.court)}
                      </span>
                      {!round.completed && state.allowCourtChange && (
                        <div className="relative">
                          <button
                            className="w-5 h-5 flex items-center justify-center text-[10px] bg-white/20 hover:bg-white/30 text-white rounded transition-colors border border-white/20"
                            onClick={() =>
                              setSwappingMatchIdx(
                                swappingMatchIdx === mIdx ? null : mIdx,
                              )
                            }
                            title="Change Court"
                          >
                            ⇄
                          </button>
                          {swappingMatchIdx === mIdx && (
                            <div className="absolute top-full left-0 mt-1 z-50 bg-popover border border-border rounded-lg shadow-xl p-1 min-w-[100px] grid grid-cols-2 gap-1 animate-fade-in">
                              {Array.from(
                                { length: state.courts },
                                (_, i) => i + 1,
                              ).map((c) => (
                                <button
                                  key={c}
                                  className={`px-2 py-1 text-xs rounded hover:bg-accent/10 ${
                                    match.court === c
                                      ? "bg-accent/20 text-accent font-bold"
                                      : "text-muted-foreground"
                                  }`}
                                  onClick={() => {
                                    onSwapCourt?.(mIdx, c);
                                    setSwappingMatchIdx(null);
                                  }}
                                >
                                  {c}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
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
                    <div className="flex justify-between items-center mb-4">
                                          <div className="flex-1 text-center">
                                            {match.team1.map((p) => {
                                              // Support splitting team names like "John/Jane" into two lines
                                              const names = p.name.includes("/") ? p.name.split("/") : [p.name];
                                              return names.map((name, ni) => (
                                                <div
                                                  key={`${p.id}-${ni}`}
                                                  className="font-bold text-white drop-shadow-md truncate"
                                                >
                                                  {name.trim()}
                                                </div>
                                              ));
                                            })}
                                          </div>
                                          <div className="text-white/60 font-black px-3 text-sm italic">
                                            VS
                                          </div>
                                          <div className="flex-1 text-center">
                                            {match.team2.map((p) => {
                                              // Support splitting team names like "John/Jane" into two lines
                                              const names = p.name.includes("/") ? p.name.split("/") : [p.name];
                                              return names.map((name, ni) => (
                                                <div
                                                  key={`${p.id}-${ni}`}
                                                  className="font-bold text-white drop-shadow-md truncate"
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
                            type="number"
                            className="w-16 h-12 text-center text-2xl font-black bg-black/50 border border-white/20 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all shadow-inner"
                            placeholder="0"
                            value={match.score1 ?? ""}
                            onChange={(e) =>
                              onScoreChange(
                                mIdx,
                                1,
                                parseInt(e.target.value) || 0,
                              )
                            }
                          />
                          <span className="text-2xl text-white/50 font-black">
                            -
                          </span>
                          <input
                            type="number"
                            className="w-16 h-12 text-center text-2xl font-black bg-black/50 border border-white/20 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all shadow-inner"
                            placeholder="0"
                            value={match.score2 ?? ""}
                            onChange={(e) =>
                              onScoreChange(
                                mIdx,
                                2,
                                parseInt(e.target.value) || 0,
                              )
                            }
                          />
                        </>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="text-3xl font-black text-white drop-shadow-lg">
                            {match.score1} - {match.score2}
                          </span>
                          <button
                            className="px-2 py-1 text-xs text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded border border-white/10 transition-colors"
                            onClick={onEdit}
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
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

          {/* Bye Selector & Complete Button */}
          {!round.completed && isLast && (
            <div className="mt-6 space-y-4">
              {/* Bye Selector */}
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

              {/* Complete Button */}
              <button
                className={`w-full py-3 font-semibold rounded-xl transition-colors ${
                  status === "complete"
                    ? "bg-success hover:bg-success/80 text-white"
                    : "bg-popover hover:bg-card border border-border text-muted-foreground"
                }`}
                onClick={handleCompleteClick}
              >
                Complete Round {round.number}
              </button>
            </div>
          )}
        </div>
      )}
    </GlassCard>
  );
};

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
    dispatch({ type: "COMPLETE_ROUND" });
    showToast(`Round ${rIdx + 1} Completed!`, "success");
  };

  const handleEditRound = (rIdx: number) => {
    dispatch({ type: "EDIT_ROUND", roundIndex: rIdx });
    showToast(`Round ${rIdx + 1} re-opened for editing`, "info");
  };

  const handleToggleBye = (playerId: string) => {
    const newByes = state.manualByes.includes(playerId)
      ? state.manualByes.filter((id) => id !== playerId)
      : [...state.manualByes, playerId];
    dispatch({ type: "UPDATE_FIELD", key: "manualByes", value: newByes });
  };

  const handleSwapCourt = (rIdx: number, mIdx: number, newCourt: number) => {
    dispatch({
      type: "SWAP_MATCH_COURT",
      roundIndex: rIdx,
      matchIndex: mIdx,
      newCourt,
    });
    showToast(`Match moved to court ${newCourt}`, "info");
  };

  return (
    <div>
      {schedule.map((round, idx) => (
        <RoundCard
          key={idx}
          round={round}
          roundIndex={idx}
          isLast={idx === schedule.length - 1}
          onComplete={() => handleCompleteRound(idx)}
          onEdit={() => handleEditRound(idx)}
          onScoreChange={(mIdx, team, val) =>
            handleScoreChange(idx, mIdx, team, val)
          }
          onToggleBye={handleToggleBye}
          onSwapCourt={(mIdx, newCourt) => handleSwapCourt(idx, mIdx, newCourt)}
        />
      ))}
    </div>
  );
};

export default Schedule;
export { RoundCard };

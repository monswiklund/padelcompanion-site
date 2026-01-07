import React, { useState } from "react";
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
}> = ({
  round,
  roundIndex,
  isLast,
  onComplete,
  onEdit,
  onScoreChange,
  onToggleBye,
}) => {
  const { state } = useTournament();
  const [isCollapsed, setIsCollapsed] = useState(round.completed && !isLast);

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
        onComplete
      );
    }
  };

  return (
    <div
      className={`bg-card border border-theme rounded-2xl overflow-hidden mb-6 transition-all ${
        round.completed ? "opacity-80" : ""
      }`}
      id={`round-${roundIndex}`}
    >
      {/* Round Header */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b border-theme cursor-pointer ${
          round.completed ? "bg-elevated/50" : "bg-accent/5"
        }`}
        onClick={() => round.completed && setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-primary">
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
          <span className="text-sm text-muted">
            {round.matches.map((m) => `${m.score1}-${m.score2}`).join(" · ")}
          </span>
        )}
        {round.completed && (
          <span className="text-muted text-sm">{isCollapsed ? "▶" : "▼"}</span>
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
                className="bg-elevated rounded-xl border border-theme overflow-hidden"
              >
                {/* Match Header */}
                <div className="flex items-center justify-between px-3 py-2 bg-black/20 border-b border-theme">
                  <span className="text-sm font-semibold text-accent">
                    {getCourtName(match.court)}
                  </span>
                  <span className="text-xs text-muted">
                    {state.scoringMode === "total"
                      ? `Total ${state.pointsPerMatch}`
                      : state.scoringMode === "race"
                      ? `Race to ${state.pointsPerMatch}`
                      : `${state.pointsPerMatch} mins`}
                  </span>
                  {match.relaxedConstraint && (
                    <span
                      className="w-5 h-5 flex items-center justify-center text-xs bg-warning/20 text-warning rounded-full cursor-help"
                      title={getConstraintLabel(match.relaxedConstraint)}
                    >
                      i
                    </span>
                  )}
                </div>

                {/* Teams */}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex-1 text-center">
                      {match.team1.map((p) => (
                        <div
                          key={p.id}
                          className="font-medium text-primary truncate"
                        >
                          {p.name}
                        </div>
                      ))}
                    </div>
                    <div className="text-muted font-bold px-3">vs</div>
                    <div className="flex-1 text-center">
                      {match.team2.map((p) => (
                        <div
                          key={p.id}
                          className="font-medium text-primary truncate"
                        >
                          {p.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Score Input/Display */}
                  <div className="flex items-center justify-center gap-3">
                    {!round.completed ? (
                      <>
                        <input
                          type="number"
                          className="w-16 h-12 text-center text-2xl font-bold bg-black/20 border border-theme rounded-lg text-primary focus:outline-none focus:border-accent"
                          placeholder="0"
                          value={match.score1 ?? ""}
                          onChange={(e) =>
                            onScoreChange(
                              mIdx,
                              1,
                              parseInt(e.target.value) || 0
                            )
                          }
                        />
                        <span className="text-2xl text-muted font-bold">-</span>
                        <input
                          type="number"
                          className="w-16 h-12 text-center text-2xl font-bold bg-black/20 border border-theme rounded-lg text-primary focus:outline-none focus:border-accent"
                          placeholder="0"
                          value={match.score2 ?? ""}
                          onChange={(e) =>
                            onScoreChange(
                              mIdx,
                              2,
                              parseInt(e.target.value) || 0
                            )
                          }
                        />
                      </>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-primary">
                          {match.score1} - {match.score2}
                        </span>
                        <button
                          className="px-2 py-1 text-xs text-muted hover:text-primary transition-colors"
                          onClick={onEdit}
                        >
                          Edit
                        </button>
                      </div>
                    )}
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
              <span className="text-sm text-secondary">
                {round.byes.map((p) => p.name).join(", ")}
              </span>
            </div>
          )}

          {/* Bye Selector & Complete Button */}
          {!round.completed && isLast && (
            <div className="mt-6 space-y-4">
              {/* Bye Selector */}
              <div className="bg-elevated rounded-xl p-4 border border-theme">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-muted">
                    Toggle who rests next round:
                  </span>
                  <span className="text-xs text-muted">
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
                          : "bg-card border-theme text-secondary hover:text-primary"
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
                    : "bg-elevated hover:bg-card border border-theme text-secondary"
                }`}
                onClick={handleCompleteClick}
              >
                Complete Round {round.number}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Schedule: React.FC = () => {
  const { state, dispatch } = useTournament();
  const { schedule } = state;

  const handleScoreChange = (
    rIdx: number,
    mIdx: number,
    team: 1 | 2,
    val: number
  ) => {
    const newSchedule = [...schedule];
    const match = { ...newSchedule[rIdx].matches[mIdx] };
    if (team === 1) match.score1 = val;
    else match.score2 = val;

    if (state.scoringMode === "total") {
      if (team === 1) match.score2 = state.pointsPerMatch - val;
      else match.score1 = state.pointsPerMatch - val;
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
        />
      ))}
    </div>
  );
};

export default Schedule;
export { RoundCard };

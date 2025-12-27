import React, { useState } from "react";
import { useTournament, Player } from "@/context/TournamentContext";

interface Match {
  court: number;
  team1: Player[];
  team2: Player[];
  score1?: number;
  score2?: number;
  relaxedConstraint?: string;
}

interface Round {
  number: number;
  completed: boolean;
  matches: Match[];
  byes?: Player[];
}

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

  return (
    <div
      className={`round ${round.completed ? "completed" : "ongoing"} ${
        isCollapsed ? "collapsed" : ""
      }`}
      id={`round-${roundIndex}`}
    >
      <div
        className="round-header"
        onClick={() => round.completed && setIsCollapsed(!isCollapsed)}
      >
        <span className="round-title">
          Round {round.number}
          {round.completed ? (
            <span className="round-status completed">✓ Completed</span>
          ) : (
            <span className="round-status ongoing">● Ongoing</span>
          )}
        </span>
        {round.completed && isCollapsed && (
          <span className="round-summary">
            {round.matches.map((m) => `${m.score1}-${m.score2}`).join(" · ")}
          </span>
        )}
        {round.completed && (
          <span className="collapse-icon">{isCollapsed ? "▶" : "▼"}</span>
        )}
      </div>

      <div className="round-content">
        <div className="matches-grid">
          {round.matches.map((match, mIdx) => (
            <div key={mIdx} className="match-card-wrapper">
              <div className="match-card-header">
                <span className="court-label">{getCourtName(match.court)}</span>
                <span className="match-info-sub">
                  {state.scoringMode === "total"
                    ? `Total ${state.pointsPerMatch}`
                    : state.scoringMode === "race"
                    ? `Race to ${state.pointsPerMatch}`
                    : `${state.pointsPerMatch} mins`}
                </span>
                {match.relaxedConstraint && (
                  <span
                    className="constraint-badge"
                    title={getConstraintLabel(match.relaxedConstraint)}
                  >
                    i
                  </span>
                )}
              </div>

              <div className="match-card">
                <div className="match-teams">
                  <div className="team">
                    {match.team1.map((p) => (
                      <span key={p.id}>{p.name}</span>
                    ))}
                  </div>
                  <div className="team">
                    {match.team2.map((p) => (
                      <span key={p.id}>{p.name}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="match-card-footer">
                {!round.completed ? (
                  <div className="score-input-row">
                    <input
                      type="number"
                      className="score-input"
                      placeholder="0"
                      value={match.score1 ?? ""}
                      onChange={(e) =>
                        onScoreChange(mIdx, 1, parseInt(e.target.value) || 0)
                      }
                    />
                    <span className="score-separator">-</span>
                    <input
                      type="number"
                      className="score-input"
                      placeholder="0"
                      value={match.score2 ?? ""}
                      onChange={(e) =>
                        onScoreChange(mIdx, 2, parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                ) : (
                  <div className="score-input-row">
                    <span className="score-display">
                      {match.score1} - {match.score2}
                    </span>
                    <button
                      className="btn btn-sm btn-ghost edit-score-btn"
                      onClick={onEdit}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {round.byes && round.byes.length > 0 && (
          <div className="waiting-players">
            <span className="waiting-label">Resting:</span>
            <span className="waiting-names">
              {round.byes.map((p) => p.name).join(", ")}
            </span>
          </div>
        )}

        {!round.completed && isLast && (
          <>
            <div className="bye-selector">
              <div className="bye-selector-header">
                <span className="bye-selector-label">
                  Toggle who rests next round:
                </span>
                <small className="bye-hint">
                  ({state.manualByes.length} selected)
                </small>
              </div>
              <div className="bye-chips">
                {state.leaderboard.map((p) => (
                  <button
                    key={p.id}
                    className={`bye-chip ${
                      state.manualByes.includes(p.id) ? "selected" : ""
                    }`}
                    onClick={() => onToggleBye(p.id)}
                  >
                    {p.name}
                    <span className="bye-count">({p.byeCount || 0})</span>
                  </button>
                ))}
              </div>
            </div>
            <button
              className="btn btn-success complete-round-btn"
              onClick={onComplete}
            >
              Complete Round {round.number}
            </button>
          </>
        )}
      </div>
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

    // Optional: Port autoFillScore logic here if needed
    if (state.scoringMode === "total") {
      if (team === 1) match.score2 = state.pointsPerMatch - val;
      else match.score1 = state.pointsPerMatch - val;
    }

    newSchedule[rIdx].matches[mIdx] = match;
    dispatch({ type: "UPDATE_FIELD", key: "schedule", value: newSchedule });
  };

  const handleCompleteRound = (rIdx: number) => {
    dispatch({ type: "COMPLETE_ROUND" });
  };

  const handleEditRound = (rIdx: number) => {
    dispatch({ type: "EDIT_ROUND", roundIndex: rIdx });
  };

  const handleToggleBye = (playerId: string) => {
    const newByes = state.manualByes.includes(playerId)
      ? state.manualByes.filter((id) => id !== playerId)
      : [...state.manualByes, playerId];
    dispatch({ type: "UPDATE_FIELD", key: "manualByes", value: newByes });
  };

  return (
    <div className="rounds-container" id="roundsContainer">
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

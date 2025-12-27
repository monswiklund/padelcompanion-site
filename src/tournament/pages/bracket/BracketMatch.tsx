import React from "react";

interface team {
  id: string;
  name: string;
  side?: string;
}

interface Match {
  id: number;
  team1Id: string | null;
  team2Id: string | null;
  team1Name: string | null;
  team2Name: string | null;
  score1: number | null;
  score2: number | null;
  winnerId: string | null;
  completed: boolean;
  isBye: boolean;
  team1?: team;
  team2?: team;
}

interface BracketMatchProps {
  match: Match;
  onClick?: (matchId: number) => void;
}

export const BracketMatch: React.FC<BracketMatchProps> = ({
  match,
  onClick,
}) => {
  const isComplete = match.completed;
  const canEdit = match.team1Id && match.team2Id && !match.isBye;

  const team1IsWinner = isComplete && match.winnerId === match.team1Id;
  const team2IsWinner = isComplete && match.winnerId === match.team2Id;

  const team1Class = team1IsWinner ? "winner" : isComplete ? "loser" : "";
  const team2Class = team2IsWinner ? "winner" : isComplete ? "loser" : "";

  const renderSideBadge = (team?: team) => {
    if (!team || !team.side) return null;
    const color = team.side === "A" ? "var(--accent)" : "var(--warning)";
    return (
      <span
        style={{
          background: color,
          color: "white",
          fontSize: "0.6rem",
          padding: "1px 4px",
          borderRadius: "3px",
          marginRight: "4px",
          fontWeight: "bold",
        }}
      >
        {team.side}
      </span>
    );
  };

  return (
    <div
      className={`bracket-match ${match.isBye ? "bye" : ""} ${
        isComplete ? "complete" : ""
      } ${canEdit ? "editable" : ""}`}
      onClick={() => canEdit && onClick?.(match.id)}
      data-match-id={match.id}
    >
      <div className={`match-team ${team1Class}`}>
        {renderSideBadge(match.team1)}
        <span className="team-name">{match.team1Name || "TBD"}</span>
        <span className="team-score">{match.score1 ?? "-"}</span>
      </div>
      <div className={`match-team ${team2Class}`}>
        {renderSideBadge(match.team2)}
        <span className="team-name">{match.team2Name || "TBD"}</span>
        <span className="team-score">{match.score2 ?? "-"}</span>
      </div>
      {match.isBye && <div className="bye-label">BYE</div>}
    </div>
  );
};

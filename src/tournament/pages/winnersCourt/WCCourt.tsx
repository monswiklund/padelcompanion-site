import React from "react";

interface WCCourtProps {
  court: {
    id: number;
    team1: { name: string }[];
    team2: { name: string }[];
    winner: 1 | 2 | null;
  };
  twist: boolean;
  round: number;
  onSelectWinner?: (winner: 1 | 2) => void;
  readOnly?: boolean;
}

export const WCCourt: React.FC<WCCourtProps> = ({
  court,
  twist,
  round,
  onSelectWinner,
  readOnly = false,
}) => {
  const isComplete = court.winner != null; // Keeping for display style
  const canSelect = !readOnly; // Allow changing selection

  return (
    <div
      className={`wc-court ${isComplete ? "complete" : ""} ${
        canSelect ? "interactive" : ""
      }`}
    >
      <div className="wc-court-header">Court {court.id}</div>
      <div className="wc-court-body-horizontal">
        <div
          className={`wc-team-horizontal wc-team1 ${
            court.winner === 1 ? "winner" : court.winner === 2 ? "loser" : ""
          }`}
          onClick={() => canSelect && onSelectWinner?.(1)}
        >
          <div className="wc-player-name">{court.team1[0]?.name || "?"}</div>
          <div className="wc-player-name">{court.team1[1]?.name || "?"}</div>
        </div>
        <div className="wc-vs-horizontal">VS</div>
        <div
          className={`wc-team-horizontal wc-team2 ${
            court.winner === 2 ? "winner" : court.winner === 1 ? "loser" : ""
          }`}
          onClick={() => canSelect && onSelectWinner?.(2)}
        >
          <div className="wc-player-name">{court.team2[0]?.name || "?"}</div>
          <div className="wc-player-name">{court.team2[1]?.name || "?"}</div>
        </div>
      </div>
    </div>
  );
};

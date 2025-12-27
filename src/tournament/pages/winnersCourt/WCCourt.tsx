import React from "react";
import { createTeams } from "./logic.js";

interface WCCourtProps {
  court: any;
  twist: boolean;
  round: number;
  onSelectWinner?: (winner: number) => void;
  readOnly?: boolean;
}

export const WCCourt: React.FC<WCCourtProps> = ({
  court,
  twist,
  round,
  onSelectWinner,
  readOnly = false,
}) => {
  const teams = createTeams(court.players, twist, round);
  const isComplete = court.winner != null;
  const canSelect = !readOnly && !isComplete;

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
          <div className="wc-player-name">{teams?.team1[0]?.name || "?"}</div>
          <div className="wc-player-name">{teams?.team1[1]?.name || "?"}</div>
        </div>
        <div className="wc-vs-horizontal">VS</div>
        <div
          className={`wc-team-horizontal wc-team2 ${
            court.winner === 2 ? "winner" : court.winner === 1 ? "loser" : ""
          }`}
          onClick={() => canSelect && onSelectWinner?.(2)}
        >
          <div className="wc-player-name">{teams?.team2[0]?.name || "?"}</div>
          <div className="wc-player-name">{teams?.team2[1]?.name || "?"}</div>
        </div>
      </div>
      {court.players.length > 4 && (
        <div className="wc-bench">
          <strong>Bench:</strong>{" "}
          {court.players
            .slice(4)
            .map((p: any) => p.name)
            .join(", ")}
        </div>
      )}
    </div>
  );
};

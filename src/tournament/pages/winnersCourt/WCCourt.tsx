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
  const isComplete = court.winner != null;
  const canSelect = !readOnly;

  const getTeamClasses = (teamNum: 1 | 2) => {
    const isWinner = court.winner === teamNum;
    const isLoser = court.winner !== null && court.winner !== teamNum;

    return `flex-1 p-3 rounded-lg text-center transition-all ${
      canSelect ? "cursor-pointer hover:bg-white/5" : ""
    } ${
      isWinner
        ? "bg-success/20 border-2 border-success"
        : isLoser
        ? "opacity-50 bg-black/20"
        : "bg-elevated border border-theme"
    }`;
  };

  return (
    <div
      className={`bg-card rounded-xl border border-theme overflow-hidden ${
        isComplete ? "opacity-90" : ""
      }`}
    >
      <div className="px-3 py-2 bg-elevated/50 border-b border-theme text-sm font-semibold text-accent">
        Court {court.id}
      </div>
      <div className="p-3 flex items-center gap-3">
        <div
          className={getTeamClasses(1)}
          onClick={() => canSelect && onSelectWinner?.(1)}
        >
          <div className="text-sm font-medium text-primary">
            {court.team1[0]?.name || "?"}
          </div>
          <div className="text-sm font-medium text-primary">
            {court.team1[1]?.name || "?"}
          </div>
        </div>
        <div className="text-xs font-bold text-muted">VS</div>
        <div
          className={getTeamClasses(2)}
          onClick={() => canSelect && onSelectWinner?.(2)}
        >
          <div className="text-sm font-medium text-primary">
            {court.team2[0]?.name || "?"}
          </div>
          <div className="text-sm font-medium text-primary">
            {court.team2[1]?.name || "?"}
          </div>
        </div>
      </div>
    </div>
  );
};

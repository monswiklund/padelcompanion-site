import React from "react";
import { useLeaderboard } from "@/tournament/ui/hooks/useLeaderboard";

const Leaderboard: React.FC = () => {
  const {
    sortedLeaderboard,
    rankingCriteria,
    hideLeaderboard,
    showPositionChanges,
    toggleVisibility,
    toggleRanks,
    setCriteria,
  } = useLeaderboard();

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

  const getRankClass = (rank: number) => {
    if (rank === 1) return "rank-1";
    if (rank === 2) return "rank-2";
    if (rank === 3) return "rank-3";
    return "";
  };

  return (
    <div className="leaderboard-section">
      {/* Header & Controls */}
      <div className="leaderboard-header flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-xl">🏆</span>
          <h3 className="text-lg font-bold text-white tracking-wide">
            Standings
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {/* Criteria Tabs */}
          <div className="leaderboard-controls-group">
            {[
              { id: "points", label: "Points" },
              { id: "wins", label: "Wins" },
              { id: "winRatio", label: "Win %" },
              { id: "pointRatio", label: "Pts %" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`leaderboard-tab ${
                  rankingCriteria === tab.id ? "active" : ""
                }`}
                onClick={() => setCriteria(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Toggles */}
          <div className="leaderboard-actions">
            <button
              className={`leaderboard-action-btn ${
                !hideLeaderboard ? "active" : ""
              }`}
              onClick={toggleVisibility}
              title="Toggle Scores"
            >
              Scores
            </button>
            <button
              className={`leaderboard-action-btn ${
                showPositionChanges ? "active" : ""
              }`}
              onClick={toggleRanks}
              title="Toggle Rank Changes"
            >
              Ranks
            </button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto w-full">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th className="w-[60px] text-center">Rank</th>
              <th>Player</th>
              <th className="w-[15%] text-center">Pts</th>
              <th className="w-[10%] text-center">W</th>
              <th className="w-[10%] text-center hidden sm:table-cell">+/-</th>
              <th className="w-[10%] text-center">Matches</th>
            </tr>
          </thead>
          <tbody>
            {sortedLeaderboard.map((player, index) => {
              const rank = index + 1;
              const prevRank = player.previousRank || rank;
              const rankChange = prevRank - rank;
              const diff = player.points - (player.pointsLost || 0);
              const rankClass = getRankClass(rank);

              return (
                <tr key={player.id} className={rankClass}>
                  {/* Rank Column */}
                  <td className="rank-cell">
                    <div className="rank-badge">
                      {!hideLeaderboard ? rank : "-"}
                    </div>
                    {showPositionChanges &&
                      !hideLeaderboard &&
                      rankChange !== 0 && (
                        <div
                          className={`trend-indicator ${
                            rankChange > 0 ? "trend-up" : "trend-down"
                          }`}
                        >
                          {rankChange > 0 ? "▲" : "▼"} {Math.abs(rankChange)}
                        </div>
                      )}
                  </td>

                  {/* Player Column */}
                  <td>
                    <div className="player-info">
                      <div className="player-avatar">
                        {getInitials(player.name)}
                      </div>
                      <span className="player-name truncate max-w-[120px] sm:max-w-xs">
                        {player.name}
                      </span>
                    </div>
                  </td>

                  {/* Points */}
                  <td className="text-center">
                    <span className="stat-value text-lg">
                      {!hideLeaderboard ? player.points : "-"}
                    </span>
                  </td>

                  {/* Wins */}
                  <td className="text-center">
                    <span className="stat-value dim">
                      {!hideLeaderboard ? player.wins : "-"}
                    </span>
                  </td>

                  {/* Diff */}
                  <td className="text-center hidden sm:table-cell">
                    {!hideLeaderboard ? (
                      <span
                        className={`diff-badge ${
                          diff > 0
                            ? "diff-plus"
                            : diff < 0
                            ? "diff-minus"
                            : "diff-zero"
                        }`}
                      >
                        {diff > 0 ? "+" : ""}
                        {diff}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* Matches Played */}
                  <td className="text-center">
                    <span className="stat-value dim text-xs">
                      {!hideLeaderboard || showPositionChanges
                        ? player.played
                        : "-"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/5 flex justify-end gap-2 bg-black/10">
        <button className="btn btn-xs btn-outline btn-ghost opacity-60 hover:opacity-100">
          Share Results
        </button>
        <button className="btn btn-xs btn-primary">Print</button>
      </div>
    </div>
  );
};

export default Leaderboard;

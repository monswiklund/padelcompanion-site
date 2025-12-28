import React from "react";
import { useLeaderboard } from "@/tournament/ui/hooks/useLeaderboard";

const Leaderboard: React.FC = () => {
  const {
    sortedLeaderboard,
    rankingCriteria,
    hideLeaderboard,
    showPositionChanges,
    leaderboardColumns,
    searchQuery,
    setSearchQuery,
    isExpanded,
    setIsExpanded,
    totalCount,
    toggleVisibility,
    toggleRanks,
    setCriteria,
    setLeaderboardColumns,
  } = useLeaderboard();

  // Helper to split leaderboard into columns
  const getColumnData = () => {
    const cols = Math.max(1, leaderboardColumns || 1);
    if (cols === 1) return [sortedLeaderboard];

    // For search, we always use 1 column to keep it simple
    if (searchQuery) return [sortedLeaderboard];

    const perCol = Math.ceil(sortedLeaderboard.length / cols);
    const result = [];
    for (let i = 0; i < cols; i++) {
      result.push(sortedLeaderboard.slice(i * perCol, (i + 1) * perCol));
    }
    return result;
  };

  const columnData = getColumnData();
  const effectiveCols = columnData.length;

  const getRankClass = (rank: number) => {
    if (hideLeaderboard) return "";
    if (rank === 1) return "rank-1";
    if (rank === 2) return "rank-2";
    if (rank === 3) return "rank-3";
    return "";
  };

  return (
    <div
      className={`leaderboard-section ${effectiveCols > 1 ? "is-grid" : ""}`}
    >
      {/* Header & Controls */}
      <div className="leaderboard-header flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-xl">🏆</span>
            <h3 className="text-lg font-bold text-white tracking-wide">
              Standings
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            {/* Grid Selector */}
            <div className="leaderboard-controls-group leaderboard-grid-selector flex">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  className={`leaderboard-tab ${
                    leaderboardColumns === num ||
                    (num === 1 && !leaderboardColumns)
                      ? "active"
                      : ""
                  }`}
                  onClick={() => setLeaderboardColumns(num)}
                  title={`${num} Column${num > 1 ? "s" : ""}`}
                >
                  {num} col
                </button>
              ))}
            </div>

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
                  onClick={() => setCriteria(tab.id as any)}
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

        {/* Search Bar */}
        <div className="leaderboard-search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="leaderboard-search-input"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery("")}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Table Content - Grid Layout */}
      <div
        className="leaderboard-grid-container"
        style={{ "--cols": effectiveCols } as React.CSSProperties}
      >
        {columnData.map((dataSlice, colIdx) => (
          <div key={colIdx} className="leaderboard-column">
            <div className="overflow-x-auto w-full">
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th className="w-[80px] text-center sticky-col">Rank</th>
                    <th className="sticky-col">Player</th>
                    <th className="w-[15%] text-center">Pts</th>
                    <th className="w-[10%] text-center">W</th>
                    <th className="w-[10%] text-center hidden sm:table-cell">
                      +/-
                    </th>
                    <th className="w-[10%] text-center">Matches</th>
                  </tr>
                </thead>
                <tbody>
                  {dataSlice.map((player) => {
                    const rank = player.currentRank;
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
                          {showPositionChanges && (
                            <div
                              className={`trend-indicator ${
                                rankChange > 0
                                  ? "trend-up"
                                  : rankChange < 0
                                  ? "trend-down"
                                  : "trend-neutral"
                              }`}
                            >
                              {rankChange > 0
                                ? "▲"
                                : rankChange < 0
                                ? "▼"
                                : "-"}
                              {rankChange !== 0 && Math.abs(rankChange)}
                            </div>
                          )}
                        </td>

                        {/* Player Column */}
                        <td>
                          <div className="player-info">
                            <span className="player-name truncate max-w-[120px] lg:max-w-xs">
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
          </div>
        ))}
      </div>

      {/* Pagination / Expand */}
      {!searchQuery && totalCount > 10 && effectiveCols === 1 && (
        <div className="p-2 border-t border-white/5 bg-black/5 text-center">
          <button
            className="btn btn-ghost btn-xs opacity-70 hover:opacity-100 normal-case gap-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <span>▲</span> Show Less
              </>
            ) : (
              <>
                <span>▼</span> Show more ({totalCount - 10} more players)
              </>
            )}
          </button>
        </div>
      )}

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/5 flex justify-between items-center bg-black/10">
        <span className="text-[10px] uppercase tracking-widest opacity-30 font-bold ml-2">
          {totalCount} Players
        </span>
        <div className="flex gap-2">
          <button className="btn btn-xs btn-outline btn-ghost opacity-60 hover:opacity-100">
            Share Results
          </button>
          <button className="btn btn-xs btn-primary">Print</button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

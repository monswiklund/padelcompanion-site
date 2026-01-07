import React from "react";
import { useLeaderboard } from "@/tournament/ui/hooks/useLeaderboard";
import { copyLeaderboardToClipboard } from "@/tournament/ui/setup/exportShare";
import { showToast } from "@/shared/utils";

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

  const getColumnData = () => {
    const cols = Math.max(1, leaderboardColumns || 1);
    if (cols === 1) return [sortedLeaderboard];
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
    if (rank === 1) return "bg-gradient-to-r from-yellow-500/20 to-transparent";
    if (rank === 2) return "bg-gradient-to-r from-gray-400/10 to-transparent";
    if (rank === 3) return "bg-gradient-to-r from-orange-600/10 to-transparent";
    return "";
  };

  const handleShare = async () => {
    const success = await copyLeaderboardToClipboard();
    if (success) {
      showToast("Leaderboard copied to clipboard!", "success");
    } else {
      showToast("Failed to copy leaderboard", "error");
    }
  };

  return (
    <div className="leaderboard-section bg-card border border-theme rounded-2xl overflow-hidden">
      {/* Header & Controls */}
      <div className="p-4 border-b border-theme">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center w-full mb-4">
          <h3 className="text-2xl font-bold text-primary tracking-wide">
            Leaderboard
          </h3>

          <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
            {/* Criteria Tabs */}
            <div className="flex bg-elevated rounded-lg p-1 w-full sm:w-auto">
              {[
                { id: "points", label: "Points" },
                { id: "wins", label: "Wins" },
                { id: "winRatio", label: "Win %" },
                { id: "pointRatio", label: "Pts %" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    rankingCriteria === tab.id
                      ? "bg-accent text-white"
                      : "text-muted hover:text-primary"
                  }`}
                  onClick={() => setCriteria(tab.id as any)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex gap-3 items-center w-full sm:w-auto justify-center">
              {/* Grid Selector */}
              <div className="flex bg-elevated rounded-lg p-1">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                      leaderboardColumns === num ||
                      (num === 1 && !leaderboardColumns)
                        ? "bg-accent text-white"
                        : "text-muted hover:text-primary"
                    }`}
                    onClick={() => setLeaderboardColumns(num)}
                    title={`${num} Column${num > 1 ? "s" : ""}`}
                  >
                    {num} col
                  </button>
                ))}
              </div>

              {/* Toggles */}
              <div className="flex gap-1">
                <button
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    !hideLeaderboard
                      ? "bg-accent text-white"
                      : "bg-elevated text-muted hover:text-primary"
                  }`}
                  onClick={toggleVisibility}
                  title="Toggle Scores"
                >
                  Scores
                </button>
                <button
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    showPositionChanges
                      ? "bg-accent text-white"
                      : "bg-elevated text-muted hover:text-primary"
                  }`}
                  onClick={toggleRanks}
                  title="Toggle Rank Changes"
                >
                  Ranks
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            🔍
          </span>
          <input
            type="text"
            className="w-full pl-10 pr-10 py-2 rounded-lg bg-elevated border border-theme text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
              onClick={() => setSearchQuery("")}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Table Content - Grid Layout */}
      <div
        className={`grid gap-4 p-4 ${
          effectiveCols === 1
            ? ""
            : effectiveCols === 2
            ? "grid-cols-2"
            : "grid-cols-3"
        }`}
      >
        {columnData.map((dataSlice, colIdx) => (
          <div key={colIdx} className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-theme">
                  <th className="w-16 py-2 text-center text-xs font-semibold text-muted uppercase">
                    Rank
                  </th>
                  <th className="py-2 text-left text-xs font-semibold text-muted uppercase">
                    Player
                  </th>
                  <th className="w-14 py-2 text-center text-xs font-semibold text-muted uppercase">
                    Pts
                  </th>
                  <th className="w-12 py-2 text-center text-xs font-semibold text-muted uppercase">
                    W
                  </th>
                  <th className="w-14 py-2 text-center text-xs font-semibold text-muted uppercase">
                    Win%
                  </th>
                  <th className="w-14 py-2 text-center text-xs font-semibold text-muted uppercase">
                    Pts%
                  </th>
                  <th className="w-10 py-2 text-center text-xs font-semibold text-muted uppercase">
                    M
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataSlice.map((player) => {
                  const rank = player.currentRank;
                  const prevRank = player.previousRank || rank;
                  const rankChange = prevRank - rank;
                  const rankClass = getRankClass(rank);

                  return (
                    <tr
                      key={player.id}
                      className={`border-b border-theme/50 hover:bg-elevated/50 transition-colors ${rankClass}`}
                    >
                      {/* Rank Column */}
                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                              rank === 1
                                ? "bg-yellow-500 text-black"
                                : rank === 2
                                ? "bg-gray-400 text-black"
                                : rank === 3
                                ? "bg-orange-600 text-white"
                                : "bg-elevated text-secondary"
                            }`}
                          >
                            {!hideLeaderboard ? rank : "-"}
                          </span>
                          {showPositionChanges && (
                            <span
                              className={`text-xs font-medium ${
                                rankChange > 0
                                  ? "text-success"
                                  : rankChange < 0
                                  ? "text-error"
                                  : "text-muted"
                              }`}
                            >
                              {rankChange > 0
                                ? `▲${rankChange}`
                                : rankChange < 0
                                ? `▼${Math.abs(rankChange)}`
                                : "-"}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Player Column */}
                      <td className="py-3">
                        <span className="font-medium text-primary truncate block max-w-[120px] lg:max-w-xs">
                          {player.name}
                        </span>
                      </td>

                      {/* Points */}
                      <td className="py-3 text-center">
                        <span className="font-semibold text-lg text-primary">
                          {!hideLeaderboard ? player.points : "-"}
                        </span>
                      </td>

                      {/* Wins */}
                      <td className="py-3 text-center text-secondary">
                        {!hideLeaderboard ? player.wins : "-"}
                      </td>

                      {/* Win % */}
                      <td className="py-3 text-center text-secondary">
                        {!hideLeaderboard && player.played > 0
                          ? `${Math.round(
                              (player.wins / player.played) * 100
                            )}%`
                          : "-"}
                      </td>

                      {/* Pts % */}
                      <td className="py-3 text-center text-secondary">
                        {!hideLeaderboard &&
                        player.points + (player.pointsLost || 0) > 0
                          ? `${Math.round(
                              (player.points /
                                (player.points + (player.pointsLost || 0))) *
                                100
                            )}%`
                          : "-"}
                      </td>

                      {/* Matches Played */}
                      <td className="py-3 text-center text-muted text-xs">
                        {!hideLeaderboard || showPositionChanges
                          ? player.played
                          : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Pagination / Expand */}
      {!searchQuery && totalCount > 10 && effectiveCols === 1 && (
        <div className="p-3 border-t border-theme text-center">
          <button
            className="text-sm text-muted hover:text-primary transition-colors flex items-center gap-2 mx-auto"
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
      <div className="px-4 py-3 border-t border-theme flex justify-between items-center bg-elevated/30">
        <span className="text-xs uppercase tracking-widest text-muted font-medium">
          {totalCount} Players
        </span>
        <div className="flex gap-2">
          <button
            className="px-3 py-1.5 text-xs font-medium text-muted hover:text-primary border border-theme rounded-lg transition-colors"
            onClick={handleShare}
          >
            Share Results
          </button>
          <button className="px-3 py-1.5 text-xs font-medium bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors">
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

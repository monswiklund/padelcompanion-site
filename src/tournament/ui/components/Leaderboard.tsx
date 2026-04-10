import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useLeaderboard } from "@/tournament/ui/hooks/useLeaderboard";
import { useTournament } from "@/context/TournamentContext";
import { copyLeaderboardToClipboard } from "@/tournament/ui/setup/exportShare";
import { showToast } from "@/shared/utils";
import { SearchIcon, XIcon } from "@/components/ui/Icons";
import PlayerMatchHistory from "./PlayerMatchHistory";

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
    isDivision,
  } = useLeaderboard();

  // Match History Modal State
  const [historyPlayer, setHistoryPlayer] = React.useState<{ id: string, name: string } | null>(null);

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

  // Determine if we are in playoff mode (any round has a name)
  const { state } = useTournament();
  const isPlayoffs = sortedLeaderboard.length > 0 && state.schedule.some(r => !!r.name);

  return (
    <GlassCard padding="none" className="leaderboard-section overflow-hidden">
      {/* Match History Modal */}
      {historyPlayer && (
        <PlayerMatchHistory
          playerId={historyPlayer.id}
          playerName={historyPlayer.name}
          isOpen={!!historyPlayer}
          onClose={() => setHistoryPlayer(null)}
        />
      )}
      {/* Header & Controls */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center w-full mb-4">
          <h3 className="text-2xl font-bold text-foreground tracking-wide">
            {isPlayoffs ? "Group Stage (Final Standings)" : "Leaderboard"}
          </h3>

          <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
            {/* Criteria Tabs */}
            <div className="flex border-b border-border w-full sm:w-auto">
              {[
                { id: "points", label: "Points" },
                { id: "wins", label: "Wins" },
                { id: "winRatio", label: "Win %" },
                { id: "pointRatio", label: "Pts %" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`flex-1 sm:flex-initial px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 -mb-px ${
                    rankingCriteria === tab.id
                      ? "border-accent text-accent"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setCriteria(tab.id as any)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex gap-3 items-center w-full sm:w-auto justify-center">
              {/* Grid Selector */}
              <div className="flex bg-popover rounded-lg p-1">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                      leaderboardColumns === num ||
                      (num === 1 && !leaderboardColumns)
                        ? "bg-accent text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
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
                      ? "bg-accent text-primary-foreground"
                      : "bg-popover text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={toggleVisibility}
                  title="Toggle Scores"
                >
                  Scores
                </button>
                <button
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    showPositionChanges
                      ? "bg-accent text-primary-foreground"
                      : "bg-popover text-muted-foreground hover:text-foreground"
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
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <SearchIcon size={16} />
          </span>
          <input
            type="text"
            className="w-full pl-10 pr-10 py-2 rounded-lg bg-popover border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchQuery("")}
            >
              <XIcon size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      {isDivision ? (
        /* Division grouped tables */
        <div
          className={`p-4 ${
            effectiveCols === 1
              ? "space-y-6"
              : `grid gap-6 ${effectiveCols === 2 ? "grid-cols-2" : "grid-cols-3"}`
          }`}
        >
          {(() => {
            const divGroups = new Map<string, typeof sortedLeaderboard>();
            sortedLeaderboard.forEach((p) => {
              const div = (p as any).division || "A";
              if (!divGroups.has(div)) divGroups.set(div, []);
              divGroups.get(div)!.push(p);
            });
            const divNames = [...divGroups.keys()].sort();
            return divNames.map((divName) => {
              const players = divGroups.get(divName)!;
              return (
                <div key={divName}>
                  <h4 className="text-sm font-bold text-accent uppercase tracking-widest mb-2">
                    Division {divName}
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="w-10 py-2 text-center text-xs font-semibold text-muted-foreground uppercase">#</th>
                          <th className="py-2 text-left text-xs font-semibold text-muted-foreground uppercase">Team</th>
                          <th className="w-8 py-2 text-center text-xs font-semibold text-muted-foreground uppercase">P</th>
                          <th className="w-8 py-2 text-center text-xs font-semibold text-muted-foreground uppercase" title="Wins (3 pts)">W</th>
                          <th className="w-8 py-2 text-center text-xs font-semibold text-muted-foreground uppercase" title="Draws (1 pt)">D</th>
                          <th className="w-8 py-2 text-center text-xs font-semibold text-muted-foreground uppercase" title="Losses (0 pts)">L</th>
                          <th className="w-10 py-2 text-center text-xs font-semibold text-muted-foreground uppercase" title="Games Won">GW</th>
                          <th className="w-10 py-2 text-center text-xs font-semibold text-muted-foreground uppercase" title="Games Lost">GL</th>
                          <th className="w-10 py-2 text-center text-xs font-semibold text-muted-foreground uppercase" title="Game Difference">GD</th>
                          <th className="w-10 py-2 text-center text-xs font-semibold text-accent uppercase font-bold" title="Total Points (W=3, D=1, L=0)">Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {players.map((player, idx) => {
                          const mp = (player as any).matchPoints || 0;
                          const draws = (player as any).draws || 0;
                          const gf = player.points || 0;
                          const ga = player.pointsLost || 0;
                          const gd = gf - ga;
                          const rank = idx + 1;
                          const rankClass = rank === 1
                            ? "bg-gradient-to-r from-yellow-500/20 to-transparent"
                            : rank === 2
                              ? "bg-gradient-to-r from-gray-400/10 to-transparent"
                              : rank === 3
                                ? "bg-gradient-to-r from-orange-600/10 to-transparent"
                                : "";
                          return (
                            <tr 
                              key={player.id} 
                              className={`border-b border-border/50 hover:bg-popover transition-colors cursor-pointer group/row ${rankClass}`}
                              onClick={() => setHistoryPlayer({ id: player.id, name: player.name })}
                            >
                              <td className="py-2.5 text-center">
                                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs ${
                                  rank === 1 ? "bg-yellow-500 text-black"
                                    : rank === 2 ? "bg-gray-400 text-black"
                                      : rank === 3 ? "bg-orange-600 text-white"
                                        : "bg-popover text-muted-foreground"
                                }`}>
                                  {!hideLeaderboard ? rank : "-"}
                                </span>
                              </td>
                              <td className="py-2.5">
                                <span className="font-bold text-foreground truncate block max-w-[140px] lg:max-w-xs group-hover/row:text-accent transition-colors">{player.name}</span>
                              </td>
                              <td className="py-2.5 text-center text-muted-foreground">{!hideLeaderboard ? player.played : "-"}</td>
                              <td className="py-2.5 text-center text-success font-medium">{!hideLeaderboard ? player.wins : "-"}</td>
                              <td className="py-2.5 text-center text-muted-foreground">{!hideLeaderboard ? draws : "-"}</td>
                              <td className="py-2.5 text-center text-error font-medium">{!hideLeaderboard ? player.losses : "-"}</td>
                              <td className="py-2.5 text-center text-muted-foreground">{!hideLeaderboard ? gf : "-"}</td>
                              <td className="py-2.5 text-center text-muted-foreground">{!hideLeaderboard ? ga : "-"}</td>
                              <td className={`py-2.5 text-center font-medium ${gd > 0 ? "text-success" : gd < 0 ? "text-error" : "text-muted-foreground"}`}>
                                {!hideLeaderboard ? (gd > 0 ? `+${gd}` : gd) : "-"}
                              </td>
                              <td className="py-2.5 text-center">
                                <span className="font-bold text-lg text-accent">{!hideLeaderboard ? mp : "-"}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      ) : (
        /* Standard table layout */
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
                  <tr className="border-b border-border">
                    <th className="w-16 py-2 text-center text-xs font-semibold text-muted-foreground uppercase">
                      Rank
                    </th>
                    <th className="py-2 text-left text-xs font-semibold text-muted-foreground uppercase">
                      Player
                    </th>
                    <th className="w-14 py-2 text-center text-xs font-semibold text-muted-foreground uppercase">
                      Pts
                    </th>
                    <th className="w-12 py-2 text-center text-xs font-semibold text-muted-foreground uppercase">
                      W
                    </th>
                    <th className="w-14 py-2 text-center text-xs font-semibold text-muted-foreground uppercase">
                      Win%
                    </th>
                    <th className="w-14 py-2 text-center text-xs font-semibold text-muted-foreground uppercase">
                      Pts%
                    </th>
                    <th className="w-10 py-2 text-center text-xs font-semibold text-muted-foreground uppercase">
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
                        className={`border-b border-border/50 hover:bg-popover transition-colors cursor-pointer group/row ${rankClass}`}
                        onClick={() => setHistoryPlayer({ id: player.id, name: player.name })}
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
                                      : "bg-popover text-muted-foreground"
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
                                      : "text-muted-foreground"
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
                          <span className="font-bold text-foreground truncate block max-w-[120px] lg:max-w-xs group-hover/row:text-accent transition-colors">
                            {player.name}
                          </span>
                        </td>

                        {/* Points */}
                        <td className="py-3 text-center">
                          <span className="font-semibold text-lg text-foreground">
                            {!hideLeaderboard ? player.points : "-"}
                          </span>
                        </td>

                        {/* Wins */}
                        <td className="py-3 text-center text-muted-foreground">
                          {!hideLeaderboard ? player.wins : "-"}
                        </td>

                        {/* Win % */}
                        <td className="py-3 text-center text-muted-foreground">
                          {!hideLeaderboard && player.played > 0
                            ? `${Math.round(
                                (player.wins / player.played) * 100,
                              )}%`
                            : "-"}
                        </td>

                        {/* Pts % */}
                        <td className="py-3 text-center text-muted-foreground">
                          {!hideLeaderboard &&
                          player.points + (player.pointsLost || 0) > 0
                            ? `${Math.round(
                                (player.points /
                                  (player.points + (player.pointsLost || 0))) *
                                  100,
                              )}%`
                            : "-"}
                        </td>

                        {/* Matches Played */}
                        <td className="py-3 text-center text-muted-foreground text-xs">
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
      )}

      {/* Pagination / Expand */}
      {!searchQuery && totalCount > 10 && effectiveCols === 1 && (
        <div className="p-3 border-t border-border text-center">
          <button
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 mx-auto"
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
      <div className="px-4 py-3 border-t border-border flex justify-between items-center bg-popover/30">
        <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
          {totalCount} Players
        </span>
        <div className="flex gap-2">
          <button
            className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors"
            onClick={handleShare}
          >
            Share Results
          </button>
          <button className="px-3 py-1.5 text-xs font-medium bg-accent hover:bg-accent-dark text-primary-foreground rounded-lg transition-colors">
            Print
          </button>
        </div>
      </div>
    </GlassCard>
  );
};

export default Leaderboard;

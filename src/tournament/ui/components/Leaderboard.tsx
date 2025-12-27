import React, { useMemo } from "react";
import { useTournament } from "@/context/TournamentContext";

const Leaderboard: React.FC = () => {
  const { state, dispatch } = useTournament();
  const { leaderboard, rankingCriteria, hideLeaderboard, showPositionChanges } =
    state;

  const sortedLeaderboard = useMemo(() => {
    return [...leaderboard].sort((a, b) => {
      switch (rankingCriteria) {
        case "wins":
          if (b.wins !== a.wins) return b.wins - a.wins;
          if (b.points !== a.points) return b.points - a.points;
          return (
            b.points - (b.pointsLost || 0) - (a.points - (a.pointsLost || 0))
          );

        case "winRatio":
          const aRate = a.played > 0 ? a.wins / a.played : 0;
          const bRate = b.played > 0 ? b.wins / b.played : 0;
          if (Math.abs(bRate - aRate) > 0.001) return bRate - aRate;
          if (b.wins !== a.wins) return b.wins - a.wins;
          return b.points - a.points;

        case "pointRatio":
          const aTotal = a.points + (a.pointsLost || 0);
          const bTotal = b.points + (b.pointsLost || 0);
          const aPRate = aTotal > 0 ? a.points / aTotal : 0;
          const bPRate = bTotal > 0 ? b.points / bTotal : 0;
          if (Math.abs(bPRate - aPRate) > 0.001) return bPRate - aPRate;
          return b.points - a.points;

        case "points":
        default:
          if (b.points !== a.points) return b.points - a.points;
          if (b.wins !== a.wins) return b.wins - a.wins;
          return (
            b.points - (b.pointsLost || 0) - (a.points - (a.pointsLost || 0))
          );
      }
    });
  }, [leaderboard, rankingCriteria]);

  const toggleVisibility = () => {
    dispatch({
      type: "UPDATE_FIELD",
      key: "hideLeaderboard",
      value: !hideLeaderboard,
    });
  };

  const toggleRanks = () => {
    dispatch({
      type: "UPDATE_FIELD",
      key: "showPositionChanges",
      value: !showPositionChanges,
    });
  };

  const setCriteria = (criteria: any) => {
    dispatch({ type: "UPDATE_FIELD", key: "rankingCriteria", value: criteria });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return { color: "#FFD700", label: "🥇" }; // Gold
    if (rank === 2) return { color: "#C0C0C0", label: "🥈" }; // Silver
    if (rank === 3) return { color: "#CD7F32", label: "🥉" }; // Bronze
    return { color: "inherit", label: `#${rank}` };
  };

  return (
    /* Use 'round' class to match Schedule aesthetics exactly */
    <div
      className="round h-full w-full mx-auto"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-lg)",
      }}
    >
      {/* Header matching Round Header */}
      <div className="round-header flex flex-col gap-3 p-0 mb-4 cursor-default">
        <div className="flex items-center justify-between w-full">
          <span className="round-title flex items-center gap-2">
            🏆 Standings
          </span>

          <select
            className="select select-bordered select-xs w-auto min-w-[100px]"
            value={rankingCriteria}
            onChange={(e) => setCriteria(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          >
            <option value="points">Points</option>
            <option value="wins">Wins</option>
            <option value="winRatio">Win %</option>
            <option value="pointRatio">Point %</option>
          </select>
        </div>

        {/* Controls - Normal Flex Row (Not Grid) */}
        <div className="flex justify-center w-full">
          <div className="join shadow-sm">
            <button
              className={`join-item btn btn-xs px-4 ${
                !hideLeaderboard ? "btn-primary" : "btn-neutral"
              }`}
              onClick={toggleVisibility}
            >
              Scores
            </button>
            <button
              className={`join-item btn btn-xs px-4 ${
                showPositionChanges ? "btn-primary" : "btn-neutral"
              }`}
              onClick={toggleRanks}
            >
              Ranks
            </button>
          </div>
        </div>
      </div>

      <div className="round-content p-0">
        {/* Table logic remains the same but clean */}
        <div className="overflow-x-auto custom-scrollbar w-full relative rounded-lg border border-white/5">
          <table className="table table-sm min-w-full w-full">
            <thead className="bg-base-200 text-xs uppercase tracking-wider text-base-content/60 font-bold">
              <tr>
                <th className="w-[15%] text-center p-2">#</th>
                <th className="text-left p-2">Player</th>
                <th className="w-[15%] text-center p-2">Pts</th>
                <th className="w-[10%] text-center p-2">W</th>
                <th className="w-[10%] text-center hidden sm:table-cell p-2">
                  +/-
                </th>
                <th className="w-[10%] text-center p-2">P</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {sortedLeaderboard.map((player, index) => {
                const rank = index + 1;
                const prevRank = player.previousRank || rank;
                const rankChange = prevRank - rank;
                const { color: rankColor, label: rankLabel } =
                  getRankStyle(rank);
                const diff = player.points - (player.pointsLost || 0);

                return (
                  <tr
                    key={player.id}
                    className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                  >
                    <td className="text-center font-bold relative group p-1 align-middle">
                      <span
                        style={{
                          color: !hideLeaderboard ? rankColor : undefined,
                          fontSize: "1.2em",
                        }}
                      >
                        {!hideLeaderboard ? rankLabel : "-"}
                      </span>
                      {showPositionChanges &&
                        !hideLeaderboard &&
                        player.played > 0 &&
                        rankChange !== 0 && (
                          <div
                            className={`absolute top-0 right-1 text-[9px] font-bold ${
                              rankChange > 0 ? "text-success" : "text-error"
                            }`}
                          >
                            {rankChange > 0 ? "▲" : "▼"}
                          </div>
                        )}
                    </td>
                    <td className="p-2 align-middle">
                      <div className="flex items-center gap-2">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-7 h-7 flex items-center justify-center text-[10px] font-bold border border-white/10">
                            {getInitials(player.name)}
                          </div>
                        </div>
                        <span className="font-semibold truncate max-w-[100px] sm:max-w-[140px] text-sm">
                          {player.name}
                        </span>
                      </div>
                    </td>
                    <td className="text-center font-bold text-base p-1 align-middle">
                      {!hideLeaderboard ? player.points : "-"}
                    </td>
                    <td className="text-center opacity-80 p-1 align-middle">
                      {!hideLeaderboard ? player.wins : "-"}
                    </td>
                    <td className="text-center hidden sm:table-cell p-1 align-middle">
                      {!hideLeaderboard ? (
                        <span
                          className={`badge badge-ghost badge-xs font-mono h-5 px-1 ${
                            diff > 0
                              ? "text-success"
                              : diff < 0
                              ? "text-error"
                              : ""
                          }`}
                        >
                          {diff > 0 ? "+" : ""}
                          {diff}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="text-center opacity-60 p-1 text-xs align-middle">
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

        <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-white/5">
          <button className="btn btn-xs btn-primary">Print Results</button>
          <button className="btn btn-xs btn-neutral">Share</button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

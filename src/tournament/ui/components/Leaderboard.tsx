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

  const isMystery = !hideLeaderboard && !showPositionChanges; // Wait, logic in legacy was different
  // Let's stick to simple logic: hideLeaderboard hides values. showPositionChanges shows arrows.

  return (
    <div className="leaderboard-container card animate-fade-in">
      <div className="leaderboard-header">
        <h3>Live Leaderboard</h3>
        <div className="leaderboard-controls">
          <button
            className={`btn-sm ${hideLeaderboard ? "toggle-off" : "toggle-on"}`}
            onClick={toggleVisibility}
            title="Toggle scores visibility"
          >
            Scores
          </button>
          <button
            className={`btn-sm ${
              showPositionChanges ? "toggle-on" : "toggle-off"
            }`}
            onClick={toggleRanks}
            title="Toggle rank change indicators"
          >
            Ranks
          </button>

          <select
            className="criteria-select"
            value={rankingCriteria}
            onChange={(e) => setCriteria(e.target.value)}
          >
            <option value="points">By Points</option>
            <option value="wins">By Wins</option>
            <option value="winRatio">Win Ratio</option>
            <option value="pointRatio">Point Ratio</option>
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>Rank</th>
              <th>Player</th>
              <th>Pts</th>
              <th>W</th>
              <th>Diff</th>
              <th>Win%</th>
              <th>P</th>
            </tr>
          </thead>
          <tbody>
            {sortedLeaderboard.map((player, index) => {
              const rank = index + 1;
              const prevRank = player.previousRank || rank;
              const rankChange = prevRank - rank;

              const diff = player.points - (player.pointsLost || 0);
              const winRate =
                player.played > 0
                  ? Math.round((player.wins / player.played) * 100) + "%"
                  : "0%";

              return (
                <tr
                  key={player.id}
                  className={player.isNewRank ? "rank-highlight" : ""}
                >
                  <td>
                    <div className="rank-cell">
                      <span className="rank-number">
                        {!hideLeaderboard ? rank : "-"}
                      </span>
                      {showPositionChanges &&
                        !hideLeaderboard &&
                        player.played > 0 && (
                          <span
                            className={`rank-arrow ${
                              rankChange > 0
                                ? "up"
                                : rankChange < 0
                                ? "down"
                                : "same"
                            }`}
                          >
                            {rankChange > 0 ? "▲" : rankChange < 0 ? "▼" : "-"}
                          </span>
                        )}
                    </div>
                  </td>
                  <td className="player-name-cell">{player.name}</td>
                  <td className="font-bold">
                    {!hideLeaderboard ? player.points : "-"}
                  </td>
                  <td>{!hideLeaderboard ? player.wins : "-"}</td>
                  <td>
                    {!hideLeaderboard ? (
                      <span
                        className={
                          diff > 0
                            ? "text-success"
                            : diff < 0
                            ? "text-error"
                            : ""
                        }
                      >
                        {diff > 0 ? "+" : ""}
                        {diff}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>{!hideLeaderboard ? winRate : "-"}</td>
                  <td>
                    {!hideLeaderboard || showPositionChanges
                      ? player.played
                      : "-"}
                  </td>
                </tr>
              );
            })}
            {sortedLeaderboard.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center">
                  No players yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;

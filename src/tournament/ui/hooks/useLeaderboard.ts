import { useMemo } from "react";
import { useTournament } from "@/context/TournamentContext";

export const useLeaderboard = () => {
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

  const setCriteria = (criteria: string) => {
    dispatch({ type: "UPDATE_FIELD", key: "rankingCriteria", value: criteria });
  };

  return {
    sortedLeaderboard,
    rankingCriteria,
    hideLeaderboard,
    showPositionChanges,
    toggleVisibility,
    toggleRanks,
    setCriteria,
  };
};

import { useMemo, useState, useEffect } from "react";
import { useTournament } from "@/context/TournamentContext";

export const useLeaderboard = () => {
  const { state, dispatch } = useTournament();
  const {
    leaderboard,
    rankingCriteria,
    hideLeaderboard,
    showPositionChanges,
    leaderboardColumns,
  } = state;

  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(
    typeof window !== "undefined" ? window.innerWidth < 800 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 800);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Effective columns considering screen size
  const effectiveColumns = isSmallScreen ? 1 : leaderboardColumns || 1;

  const processedLeaderboard = useMemo(() => {
    // 1. Calculate actual standings first (to get real ranks)
    const standings = [...leaderboard].sort((a, b) => {
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

    // Attach real rank to each player
    const withRanks = standings.map((p, idx) => ({
      ...p,
      currentRank: idx + 1,
    }));

    // 2. If hidden, scramble the list by ID
    let list = withRanks;
    if (hideLeaderboard) {
      list = [...withRanks].sort((a, b) =>
        String(a.id).localeCompare(String(b.id))
      );
    }

    // 3. Filter by search query if any
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter((p) => p.name.toLowerCase().includes(query));
    }

    return list;
  }, [leaderboard, rankingCriteria, hideLeaderboard, searchQuery]);

  const visibleLeaderboard = useMemo(() => {
    // If we have grid columns, we usually show everything or a larger chunk
    if (
      isExpanded ||
      searchQuery.trim() ||
      processedLeaderboard.length <= 12 ||
      effectiveColumns > 1
    ) {
      return processedLeaderboard;
    }
    return processedLeaderboard.slice(0, 10);
  }, [processedLeaderboard, isExpanded, searchQuery, effectiveColumns]);

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

  const setLeaderboardColumns = (cols: number) => {
    dispatch({ type: "UPDATE_FIELD", key: "leaderboardColumns", value: cols });
  };

  return {
    sortedLeaderboard: visibleLeaderboard,
    totalCount: processedLeaderboard.length,
    fullCount:
      hideLeaderboard && !searchQuery
        ? leaderboard.length
        : processedLeaderboard.length,
    rankingCriteria,
    hideLeaderboard,
    showPositionChanges,
    leaderboardColumns: effectiveColumns, // Use effective columns for UI
    searchQuery,
    setSearchQuery,
    isExpanded,
    setIsExpanded,
    toggleVisibility,
    toggleRanks,
    setCriteria,
    setLeaderboardColumns,
    isSmallScreen,
  };
};

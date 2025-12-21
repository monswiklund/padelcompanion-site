// Leaderboard Module
// Leaderboard rendering and visibility controls

import { state } from "../state.js";
import { getElements } from "./elements.js";

/**
 * Render the leaderboard
 */
export function renderLeaderboard() {
  const els = getElements();

  // Sync toggle buttons state with clear ON/OFF visual indicators
  const visBtn = document.getElementById("toggleVisibilityBtn");
  if (visBtn) {
    if (state.hideLeaderboard) {
      visBtn.innerHTML = "Scores";
      visBtn.classList.add("toggle-off");
      visBtn.classList.remove("toggle-on");
    } else {
      visBtn.innerHTML = "Scores";
      visBtn.classList.add("toggle-on");
      visBtn.classList.remove("toggle-off");
    }
    visBtn.title = "Click to toggle score visibility";
  }

  const posBtn = document.getElementById("togglePositionBtn");
  if (posBtn) {
    if (state.showPositionChanges) {
      posBtn.innerHTML = "Ranks";
      posBtn.classList.add("toggle-on");
      posBtn.classList.remove("toggle-off");
    } else {
      posBtn.innerHTML = "Ranks";
      posBtn.classList.add("toggle-off");
      posBtn.classList.remove("toggle-on");
    }
    posBtn.title = "Click to toggle rank change indicators";
  }

  if (!state.leaderboard || state.leaderboard.length === 0) {
    els.leaderboardBody.innerHTML =
      '<tr><td colspan="7" class="text-center">No players yet</td></tr>';
    return;
  }

  // Sort Logic
  const sorted = [...state.leaderboard].sort((a, b) => {
    switch (state.rankingCriteria) {
      case "wins":
        if (b.wins !== a.wins) return b.wins - a.wins;
        if (b.points !== a.points) return b.points - a.points;
        return b.points - b.pointsLost - (a.points - a.pointsLost);

      case "winRatio":
        const aRate = a.played > 0 ? a.wins / a.played : 0;
        const bRate = b.played > 0 ? b.wins / b.played : 0;
        if (Math.abs(bRate - aRate) > 0.001) return bRate - aRate;
        if (b.wins !== a.wins) return b.wins - a.wins;
        return b.points - a.points;

      case "pointRatio":
        const aTotal = a.points + a.pointsLost;
        const bTotal = b.points + b.pointsLost;
        const aPRate = aTotal > 0 ? a.points / aTotal : 0;
        const bPRate = bTotal > 0 ? b.points / bTotal : 0;
        if (Math.abs(bPRate - aPRate) > 0.001) return bPRate - aPRate;
        return b.points - a.points;

      case "points":
      default:
        if (b.points !== a.points) return b.points - a.points;
        if (b.wins !== a.wins) return b.wins - a.wins;
        return b.points - b.pointsLost - (a.points - a.pointsLost);
    }
  });

  if (state.hideLeaderboard) {
    const shuffled = [...sorted].sort(() => Math.random() - 0.5);
    els.leaderboardBody.innerHTML = shuffled
      .map(
        (player) => `
    <tr>
      <td>-</td>
      <td>${player.name}</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>${player.played}</td>
    </tr>
  `
      )
      .join("");
  } else {
    // Calculate position changes
    sorted.forEach((player, index) => {
      const currentRank = index + 1;
      const prevRank = player.previousRank || currentRank;
      player.rankChange = prevRank - currentRank;
      player.previousRank = currentRank;
    });

    els.leaderboardBody.innerHTML = sorted
      .map((player, index) => {
        let changeIndicator = "";
        if (state.showPositionChanges && player.played > 0) {
          if (player.rankChange > 0) {
            changeIndicator = '<span class="rank-up">▲</span>';
          } else if (player.rankChange < 0) {
            changeIndicator = '<span class="rank-down">▼</span>';
          } else {
            changeIndicator = '<span class="rank-same">●</span>';
          }
        }

        const diff = player.points - (player.pointsLost || 0);
        const winRate =
          player.played > 0
            ? Math.round(((player.wins || 0) / player.played) * 100)
            : 0;
        const diffSign = diff > 0 ? "+" : "";

        return `
    <tr>
      <td>${index + 1} ${changeIndicator}</td>
      <td class="player-name-cell">${player.name}</td>
      <td class="font-bold">${player.points}</td>
      <td>${player.wins || 0}</td>
      <td class="${
        diff > 0 ? "text-success" : diff < 0 ? "text-error" : ""
      }">${diffSign}${diff}</td>
      <td>${winRate}%</td>
      <td>${player.played}</td>
    </tr>
  `;
      })
      .join("");
  }
}

/**
 * Toggle leaderboard visibility
 */
export function toggleLeaderboardVisibility() {
  state.hideLeaderboard = !state.hideLeaderboard;
  renderLeaderboard();
}

/**
 * Toggle position changes display
 */
export function togglePositionChanges() {
  state.showPositionChanges = !state.showPositionChanges;
  renderLeaderboard();
}

/**
 * Update ranking criteria
 * @param {string} criteria - Ranking criteria
 */
export function updateRankingCriteria(criteria) {
  state.rankingCriteria = criteria;
  renderLeaderboard();
}

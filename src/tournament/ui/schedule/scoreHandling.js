/**
 * Score Handling Module
 * Handles score input, validation, and auto-fill logic.
 */

import { state } from "../../state.js";

/**
 * Auto-fill score for total points mode.
 * @param {number} roundIndex - Round index
 * @param {number} matchIndex - Match index
 * @param {number|string} team - Team number (1 or 2)
 * @param {string} value - Input value
 */
export function autoFillScore(roundIndex, matchIndex, team, value) {
  // Trigger validation after the value settles
  setTimeout(() => validateRoundState(), 0);

  let parsed = parseInt(value);
  if (isNaN(parsed) || parsed < 0) return;

  const maxPoints = parseInt(state.pointsPerMatch);
  if (isNaN(maxPoints) || maxPoints <= 0) return;

  if (state.scoringMode === "total") {
    // Total Points: scores must sum to maxPoints
    if (parsed > maxPoints) {
      parsed = maxPoints;
      const currentInput = document.getElementById(
        `score-${roundIndex}-${matchIndex}-${team}`
      );
      if (currentInput) currentInput.value = parsed;
    }

    const otherTeam = team === 1 || team === "1" ? 2 : 1;
    const otherScore = maxPoints - parsed;
    const otherInput = document.getElementById(
      `score-${roundIndex}-${matchIndex}-${otherTeam}`
    );

    if (otherInput && otherScore >= 0) {
      otherInput.value = otherScore;
    }
  } else if (state.scoringMode === "race") {
    // Race Mode: If one team scores < Max, other MUST be Max
    if (parsed < maxPoints) {
      const otherTeam = team === 1 || team === "1" ? 2 : 1;
      const otherInput = document.getElementById(
        `score-${roundIndex}-${matchIndex}-${otherTeam}`
      );

      if (otherInput) {
        otherInput.value = maxPoints;
      }
    } else if (parsed === maxPoints) {
      const otherTeam = team === 1 || team === "1" ? 2 : 1;
      const otherInput = document.getElementById(
        `score-${roundIndex}-${matchIndex}-${otherTeam}`
      );

      if (otherInput && otherInput.value === "") {
        otherInput.value = 0;
      }
    }
  }
}

/**
 * Validate current round scores and toggle complete button state.
 */
export function validateRoundState() {
  const currentRoundIndex = state.schedule.findIndex((r) => !r.completed);
  if (currentRoundIndex === -1) return;

  const currentRound = state.schedule[currentRoundIndex];
  const btn = document.querySelector(".complete-round-btn");
  if (!btn) return;

  let isValid = true;
  const maxPoints = parseInt(state.pointsPerMatch);

  for (let i = 0; i < currentRound.matches.length; i++) {
    const s1Input = document.getElementById(
      `score-${currentRoundIndex}-${i}-1`
    );
    const s2Input = document.getElementById(
      `score-${currentRoundIndex}-${i}-2`
    );

    if (!s1Input || !s2Input) continue;

    const s1Val = s1Input.value;
    const s2Val = s2Input.value;

    if (s1Val === "" || s2Val === "") {
      isValid = false;
      break;
    }

    const s1 = parseInt(s1Val);
    const s2 = parseInt(s2Val);

    if (state.scoringMode === "total") {
      if (s1 + s2 !== maxPoints) {
        isValid = false;
        break;
      }
    } else {
      if (s1 < 0 || s2 < 0) {
        isValid = false;
        break;
      }
    }
  }

  // Never disable completely, just warn
  btn.disabled = false;

  if (!isValid) {
    btn.classList.add("btn-warning");
    btn.classList.remove("btn-success");
    btn.textContent = "Complete Anyway";
  } else {
    btn.classList.remove("btn-warning");
    btn.classList.add("btn-success");
    btn.textContent = `Complete Round ${currentRound.number}`;
  }
}

/**
 * Validate all match scores in a round.
 * @param {Object} round - Round object
 * @param {number} roundIndex - Round index
 * @returns {{ isValid: boolean, invalidCourts: string[] }}
 */
export function validateRoundScores(round, roundIndex, getCourtName) {
  let allScoresValid = true;
  const invalidCourts = [];

  round.matches.forEach((match, matchIndex) => {
    const score1Input = document.getElementById(
      `score-${roundIndex}-${matchIndex}-1`
    );
    const score2Input = document.getElementById(
      `score-${roundIndex}-${matchIndex}-2`
    );

    const score1Value = score1Input?.value;
    const score2Value = score2Input?.value;

    let isMatchValid = true;

    // Check for empty inputs
    if (score1Value === "" || score2Value === "") {
      isMatchValid = false;
      if (score1Value === "") score1Input?.classList.add("error");
      if (score2Value === "") score2Input?.classList.add("error");
    }

    const score1 = parseInt(score1Value) || 0;
    const score2 = parseInt(score2Value) || 0;

    if (state.scoringMode === "total") {
      const maxPoints = parseInt(state.pointsPerMatch, 10);
      if (score1 + score2 !== maxPoints) {
        isMatchValid = false;
        score1Input?.classList.add("error");
        score2Input?.classList.add("error");
      } else if (score1Value !== "" && score2Value !== "") {
        score1Input?.classList.remove("error");
        score2Input?.classList.remove("error");
      }
    } else {
      if (score1 < 0 || score2 < 0) {
        isMatchValid = false;
        score1Input?.classList.add("error");
        score2Input?.classList.add("error");
      } else if (score1Value !== "" && score2Value !== "") {
        score1Input?.classList.remove("error");
        score2Input?.classList.remove("error");
      }
    }

    if (!isMatchValid) {
      allScoresValid = false;
      invalidCourts.push(getCourtName(match.court));
    }
  });

  return { isValid: allScoresValid, invalidCourts };
}

/**
 * Check for race mode incomplete scores.
 * @param {Object} round - Round object
 * @param {number} roundIndex - Round index
 * @returns {string[]} List of courts with incomplete race scores
 */
export function checkRaceScores(round, roundIndex, getCourtName) {
  const incompleteRaceCourts = [];
  const targetScore = state.pointsPerMatch;

  round.matches.forEach((match, matchIndex) => {
    const score1Input = document.getElementById(
      `score-${roundIndex}-${matchIndex}-1`
    );
    const score2Input = document.getElementById(
      `score-${roundIndex}-${matchIndex}-2`
    );
    const s1 = parseInt(score1Input?.value) || 0;
    const s2 = parseInt(score2Input?.value) || 0;

    if (s1 < targetScore && s2 < targetScore) {
      incompleteRaceCourts.push(getCourtName(match.court));
    }
  });

  return incompleteRaceCourts;
}

/**
 * Read scores from DOM for a match.
 * @param {number} roundIndex - Round index
 * @param {number} matchIndex - Match index
 * @returns {{ score1: number, score2: number }}
 */
export function readMatchScores(roundIndex, matchIndex) {
  const score1Input = document.getElementById(
    `score-${roundIndex}-${matchIndex}-1`
  );
  const score2Input = document.getElementById(
    `score-${roundIndex}-${matchIndex}-2`
  );

  return {
    score1: parseInt(score1Input?.value) || 0,
    score2: parseInt(score2Input?.value) || 0,
  };
}

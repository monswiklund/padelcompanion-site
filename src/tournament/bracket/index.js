/**
 * Bracket Logic Module
 * Barrel export for bracket sub-modules.
 */

// Generation
export {
  generateBracket,
  seedTeams,
  getTeamById,
  getRoundName,
} from "./bracketGeneration.js";

// Match Progression
export {
  updateMatchResult,
  resetDownstreamMatches,
  getBracketRounds,
  isBracketComplete,
  getFinalStandings,
} from "./matchProgression.js";

// Dual Bracket
export {
  generateDualBracket,
  initBracketTournament,
  initDualBracketTournament,
  clearBracket,
} from "./dualBracket.js";

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
} from "./bracketGeneration";

// Match Progression
export {
  updateMatchResult,
  resetDownstreamMatches,
  getBracketRounds,
  isBracketComplete,
  getFinalStandings,
} from "./matchProgression";

// Dual Bracket
export {
  generateDualBracket,
  initBracketTournament,
  initDualBracketTournament,
  clearBracket,
} from "./dualBracket";

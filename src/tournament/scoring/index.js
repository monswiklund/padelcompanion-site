/**
 * Scoring Module
 * Main export for all scoring algorithms and player stats.
 */

// Player Stats
export { updatePlayerStats, subtractPlayerStats } from "./playerStats.js";

// Americano Generators
export {
  generateAmericanoSchedule,
  generateTeamSchedule,
} from "./americanoGenerator.js";

// Team Mexicano Generators
export {
  generateTeamMexicanoFirstRound,
  generateTeamMexicanoNextRound,
} from "./teamMexicanoGenerator.js";

// Mexicano Generators
export {
  generateMexicanoFirstRound,
  generateMexicanoNextRound,
} from "./mexicanoGenerator.js";

import { state as legacyState } from "./tournament/core/state";
import { generateSchedule } from "./tournament/ui/setup/scheduleGeneration";

// Mock React Context State
const mockContextState = {
  players: Array.from({ length: 12 }, (_, i) => ({
    id: `p${i}`,
    name: `Player ${i}`,
  })),
  format: "americano",
  courts: 3,
  scoringMode: "total",
  pointsPerMatch: 24,
  maxRepeats: 10,
  pairingStrategy: "optimal",
};

console.log("Initial Legacy State Players:", legacyState.players.length);

// Simulate GeneratorSetup logic
console.log("Syncing state...");
Object.assign(legacyState, mockContextState as any);

console.log("Legacy State Players after sync:", legacyState.players.length);
console.log("Legacy State Format:", legacyState.format);
console.log("Legacy State Courts:", legacyState.courts);

// Generate
console.log("Generating Schedule...");
generateSchedule();

// Check result
console.log("Schedule length:", legacyState.schedule.length);
if (legacyState.schedule.length > 0) {
  console.log("Round 1 Matches:", legacyState.schedule[0].matches.length);
  console.log("Round 1 Byes:", legacyState.schedule[0].byes.length);
  console.log(
    "Matches details:",
    JSON.stringify(legacyState.schedule[0].matches, null, 2)
  );
} else {
  console.error("Schedule is empty!");
}

import { tournament } from "$lib/stores/tournament.svelte";
import { showToast } from "$lib/shared/utils";
import {
  showConfirmModal,
  showAlertModal,
  showCountdown,
} from "../../core/modals";
import { saveToHistory } from "../../history/repository";
import {
  generateAmericanoSchedule,
  generateTeamSchedule,
  generateMexicanoFirstRound,
  generateTeamMexicanoFirstRound,
  generateDivisionSchedule,
} from "../../scoring";

/**
 * Generate tournament schedule.
 * Updates global tournament store and triggers count.
 */
export async function generateSchedule(): Promise<any> {
  const state = tournament.state;
  const isTeam = state.format === "team" || state.format === "teamMexicano";
  const minPlayers = isTeam ? 2 : 4;

  if (state.players.length < minPlayers) {
    showToast(
      `Not enough ${isTeam ? "teams" : "players"} (min ${minPlayers})`,
      "error"
    );
    return null;
  }

  const playersNeededPerCourt =
    state.format === "team" || state.format === "teamMexicano" || state.format === "division" ? 2 : 4;

  let effectiveCourts = state.courts;
  if (state.format === "division") {
    effectiveCourts = state.divisions
      ? state.divisions.reduce((sum: number, div: any) => sum + Math.max(1, div.courts ?? 0), 0)
      : 2;
  }

  const maxPossibleCourts = Math.floor(
    state.players.length / playersNeededPerCourt
  );

  if (effectiveCourts > maxPossibleCourts) {
    if (maxPossibleCourts === 0) {
      showAlertModal(
        "Not Enough Players",
        `You need at least ${playersNeededPerCourt} players/teams to start!`
      );
      return null;
    }

    if (state.format !== "division") {
      const oldCourts = state.courts;
      tournament.updateField("courts", maxPossibleCourts);
      showToast(`Adjusted courts: ${oldCourts} → ${maxPossibleCourts}`);
    } else {
      showToast(`Warning: Limited teams means some courts may be empty!`, "warning");
    }
  }

  await showCountdown();

  // Pre-generation setup
  tournament.snapshot();
  tournament.updateField("currentRound", 1);
  tournament.updateField(
    "leaderboard",
    state.players.map((p: any, index: number) => ({
      id: p.id,
      name: p.name,
      division: p.division,
      divisionId: p.divisionId,
      points: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      matchPoints: 0,
      played: 0,
      pointsLost: 0,
      byeCount: 0,
      playedWith: [],
      previousRank: index + 1,
    }))
  );

  let generatedSchedule: any[] = [];
  let generatedAllRounds: any[] | null = null;

  if (state.format === "americano") {
    generatedAllRounds = generateAmericanoSchedule({
      players: state.players,
      courts: state.courts,
    });
    generatedSchedule = [generatedAllRounds[0]];
  } else if (state.format === "team") {
    generatedAllRounds = generateTeamSchedule({
      players: state.players,
      courts: state.courts,
    });
    generatedSchedule = [generatedAllRounds[0]];
  } else if (state.format === "division") {
    generatedAllRounds = generateDivisionSchedule({
      players: state.players,
      divisions: state.divisions || [],
    });
    generatedSchedule = [generatedAllRounds[0]];
  } else if (state.format === "teamMexicano") {
    generatedSchedule = generateTeamMexicanoFirstRound(
      state.players,
      state.courts
    ) as any[];
    generatedAllRounds = null;
  } else {
    generatedSchedule = generateMexicanoFirstRound(
      state.players as any[],
      state.courts,
      state.preferredPartners as any[]
    ) as any[];
    generatedAllRounds = null;
  }

  tournament.updateField("schedule", generatedSchedule);
  tournament.updateField("allRounds", generatedAllRounds);
  tournament.updateField("isLocked", true);
  tournament.updateField("roundStartedAt", Date.now());
  tournament.updateField("sessionStartedAt", Date.now());
  tournament.save();

  showToast(`🎾 Tournament started! Round 1 ready`, "success");

  return {
    schedule: generatedSchedule,
    allRounds: generatedAllRounds,
    leaderboard: tournament.state.leaderboard,
    currentRound: 1,
    isLocked: true,
  };
}

/**
 * Reset tournament schedule (confirmation modal).
 */
export function resetSchedule(): void {
  showConfirmModal(
    "Reset Tournament?",
    "This will clear all rounds and scores.",
    "Reset",
    () => {
      tournament.snapshot();
      tournament.updateField("schedule", []);
      tournament.updateField("currentRound", 0);
      tournament.updateField("leaderboard", []);
      tournament.updateField("allRounds", null);
      tournament.updateField("isLocked", false);
      tournament.updateField("hideLeaderboard", true);
      tournament.updateField("manualByes", []);
      tournament.save();
      showToast("Tournament reset", "success");
    },
    true
  );
}

/**
 * End tournament and show final standings.
 */
export function endTournament(
  showFinalStandingsCallback?: (standings: any[]) => void
): void {
  showConfirmModal(
    "End Tournament?",
    "This will show final standings. This action cannot be undone.",
    "End Tournament",
    () => {
      tournament.snapshot();
      tournament.updateField("isLocked", false);
      tournament.updateField("hideLeaderboard", false);

      const sorted = [...tournament.state.leaderboard].sort(
        (a: any, b: any) => b.points - a.points
      );

      saveToHistory(tournament.state as any);
      showToast("Tournament saved to history", "success");

      if (showFinalStandingsCallback) {
        showFinalStandingsCallback(sorted);
      }

      tournament.save();
    },
    true
  );
}

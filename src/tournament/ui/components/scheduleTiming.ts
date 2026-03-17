import type { Round, TournamentState } from "@/context/TournamentContext";

const DEFAULT_START_TIME = "17:00";
const DEFAULT_MATCH_DURATION_MINUTES = 15;
const EARLY_ROUND_BUFFER_MINUTES = 2;
const EARLY_ROUND_BUFFER_ROUNDS = 2;

function getPlannedStartTimestamp(plannedStartTime?: string): number {
  const [hours, minutes] = (plannedStartTime || DEFAULT_START_TIME)
    .split(":")
    .map(Number);
  const date = new Date();
  date.setHours(hours || 0, minutes || 0, 0, 0);
  return date.getTime();
}

function getScheduleAnchorTimestamp(state: TournamentState): number {
  const hasPlayedRounds = state.schedule.some((round) => round.completed);

  if (state.roundStartedAt) return state.roundStartedAt;
  if (hasPlayedRounds && state.sessionStartedAt) return state.sessionStartedAt;

  return getPlannedStartTimestamp(state.plannedStartTime);
}

function getEstimatedRoundDurationSeconds(
  state: TournamentState,
  roundIdx: number,
): number {
  const baseDurationMinutes =
    state.matchDuration || DEFAULT_MATCH_DURATION_MINUTES;
  const shouldIncludeWarmupBuffer =
    state.format === "division" && roundIdx < EARLY_ROUND_BUFFER_ROUNDS;

  return (
    (baseDurationMinutes +
      (shouldIncludeWarmupBuffer ? EARLY_ROUND_BUFFER_MINUTES : 0)) *
    60
  );
}

export function getEstimatedRoundStartDate(
  state: TournamentState,
  roundIdx: number,
): Date {
  const { schedule } = state;
  const currentRoundIdx = schedule.length - 1;
  const hasActiveRound =
    currentRoundIdx >= 0 && schedule[currentRoundIdx] && !schedule[currentRoundIdx].completed;
  const activeElapsedSeconds = state.roundStartedAt
    ? Math.max(0, Math.round((Date.now() - state.roundStartedAt) / 1000))
    : 0;

  let cursor = getScheduleAnchorTimestamp(state);

  for (let idx = 0; idx < roundIdx; idx++) {
    const round = schedule[idx];
    const isActiveRound = hasActiveRound && idx === currentRoundIdx;

    if (isActiveRound && state.roundStartedAt) {
      cursor = state.roundStartedAt;
    }

    if (round?.completed) {
      cursor += (
        (round.durationSeconds || getEstimatedRoundDurationSeconds(state, idx)) *
        1000
      );
      continue;
    }

    if (isActiveRound) {
      cursor +=
        Math.max(
          getEstimatedRoundDurationSeconds(state, idx),
          activeElapsedSeconds,
        ) * 1000;
      continue;
    }

    cursor += getEstimatedRoundDurationSeconds(state, idx) * 1000;
  }

  if (hasActiveRound && roundIdx === currentRoundIdx && state.roundStartedAt) {
    return new Date(state.roundStartedAt);
  }

  return new Date(cursor);
}

export function formatEstimatedRoundStart(
  state: TournamentState,
  roundIdx: number,
): string {
  return getEstimatedRoundStartDate(state, roundIdx).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getEstimatedRoundStartRelativeLabel(
  state: TournamentState,
  roundIdx: number,
): string {
  const diffMs = getEstimatedRoundStartDate(state, roundIdx).getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes <= 1) return "snart";
  if (diffMinutes < 60) return `om ${diffMinutes} min`;

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  if (minutes === 0) return `om ${hours} h`;
  return `om ${hours} h ${minutes} min`;
}

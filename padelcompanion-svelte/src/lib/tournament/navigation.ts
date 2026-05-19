import type { TournamentState } from "./core/state";

type RoutedTournamentState = Partial<
  Pick<TournamentState, "format" | "winnersCourt" | "bracket">
>;

const LAST_TOURNAMENT_ROUTE_KEY = "last-tournament-route";

const TOURNAMENT_ROUTES = new Set([
  "/tournament/generator",
  "/tournament/division",
  "/tournament/bracket",
  "/tournament/winners-court",
]);

export function getTournamentRoute(state: RoutedTournamentState): string {
  if (state.winnersCourt) {
    return "/tournament/winners-court";
  }

  if (state.bracket) {
    return "/tournament/bracket";
  }

  if (state.format === "division") {
    return "/tournament/division";
  }

  return "/tournament/generator";
}

export function buildTournamentShareUrl(shareCode: string): string {
  const normalizedCode = shareCode.trim().toUpperCase();
  if (!normalizedCode) return "";

  if (typeof window === "undefined") {
    return `/tournament/session/${encodeURIComponent(normalizedCode)}`;
  }

  return `${window.location.origin}/tournament/session/${encodeURIComponent(normalizedCode)}`;
}

export function isRememberedTournamentRoute(pathname: string): boolean {
  return TOURNAMENT_ROUTES.has(pathname);
}

export function rememberTournamentRoute(pathname: string): void {
  if (typeof window === "undefined" || !isRememberedTournamentRoute(pathname)) {
    return;
  }

  window.localStorage.setItem(LAST_TOURNAMENT_ROUTE_KEY, pathname);
}

export function getLastTournamentRoute(): string {
  if (typeof window === "undefined") {
    return "/tournament/generator";
  }

  const storedRoute = window.localStorage.getItem(LAST_TOURNAMENT_ROUTE_KEY);
  return storedRoute && isRememberedTournamentRoute(storedRoute)
    ? storedRoute
    : "/tournament/generator";
}

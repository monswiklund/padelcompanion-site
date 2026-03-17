import { StorageService } from "@/shared/storage";

const SESSION_LINKS_KEY = "tournament-cloud-links";

export interface TournamentCloudLink {
  sessionId: string;
  shareCode: string;
  editToken?: string;
  updatedAt: string;
}

type SessionLinkMap = Record<string, TournamentCloudLink>;

function readLinks(): SessionLinkMap {
  return StorageService.getItem<SessionLinkMap>(SESSION_LINKS_KEY, {}) || {};
}

export function getTournamentCloudLink(tournamentName: string): TournamentCloudLink | null {
  if (!tournamentName.trim()) return null;
  const links = readLinks();
  return links[tournamentName.trim()] || null;
}

export function saveTournamentCloudLink(
  tournamentName: string,
  link: TournamentCloudLink,
): void {
  if (!tournamentName.trim()) return;
  const links = readLinks();
  links[tournamentName.trim()] = link;
  StorageService.setItem(SESSION_LINKS_KEY, links);
}

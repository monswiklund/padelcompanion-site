import { StorageService } from '$lib/shared/storage';

const SESSION_LINKS_KEY = 'tournament-cloud-links';
const ACTIVE_LINK_KEY = '__active';

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
	const links = readLinks();
	return links[tournamentName.trim()] || links[ACTIVE_LINK_KEY] || null;
}

export function saveTournamentCloudLink(tournamentName: string, link: TournamentCloudLink): void {
	const links = readLinks();
	if (tournamentName.trim()) links[tournamentName.trim()] = link;
	links[ACTIVE_LINK_KEY] = link;
	StorageService.setItem(SESSION_LINKS_KEY, links);
}

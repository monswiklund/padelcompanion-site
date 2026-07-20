import type { TournamentState } from '../../core/state';
import { state as globalState } from '../../core/state';
import {
	createTournamentSnapshot,
	parseTournamentSnapshot,
	restoreTournamentStateFromSnapshot
} from '../../sync/snapshot';

/**
 * Export tournament data as JSON.
 */
export function exportTournamentData(
	stateOverride?: TournamentState | Partial<TournamentState>
): string {
	const sourceState = (stateOverride || globalState) as TournamentState;
	return JSON.stringify(createTournamentSnapshot(sourceState), null, 2);
}

export function importTournamentData(data: string) {
	const snapshot = parseTournamentSnapshot(data);
	return restoreTournamentStateFromSnapshot(snapshot);
}

/**
 * Download tournament data as a file.
 */
export function downloadTournamentData(
	filename?: string,
	stateOverride?: TournamentState | Partial<TournamentState>
): void {
	const data = exportTournamentData(stateOverride);
	const blob = new Blob([data], { type: 'application/json' });
	const url = URL.createObjectURL(blob);

	const a = document.createElement('a');
	a.href = url;
	a.download = filename || `tournament-${Date.now()}.json`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

function escapeHtml(value: unknown): string {
	return String(value ?? '')
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

function formatTeam(players: Array<{ name: string }>): string {
	return players.map((player) => player.name).join(' / ');
}

export function buildSchedulePrintHtml(
	stateOverride?: TournamentState | Partial<TournamentState>
): string {
	const sourceState = (stateOverride || globalState) as TournamentState;
	const title = sourceState.tournamentName || 'Tournament schedule';
	const generatedAt = new Date().toLocaleString();
	const rows = (sourceState.allRounds || sourceState.schedule || [])
		.map((round: any) => {
			const matches = (round.matches || [])
				.map(
					(match: any) => `
						<tr>
							<td>${escapeHtml(match.court)}</td>
							<td>${escapeHtml(formatTeam(match.team1 || []))}</td>
							<td>${match.score1 == null || match.score2 == null ? 'vs' : `${escapeHtml(match.score1)} - ${escapeHtml(match.score2)}`}</td>
							<td>${escapeHtml(formatTeam(match.team2 || []))}</td>
						</tr>`
				)
				.join('');

			return `
				<section>
					<h2>${escapeHtml(round.name || `Round ${round.number}`)}</h2>
					<table>
						<thead>
							<tr><th>Court</th><th>Team 1</th><th>Score</th><th>Team 2</th></tr>
						</thead>
						<tbody>${matches}</tbody>
					</table>
				</section>`;
		})
		.join('');

	return `<!doctype html>
		<html>
			<head>
				<meta charset="utf-8" />
				<title>${escapeHtml(title)}</title>
				<style>
					body { font-family: system-ui, sans-serif; color: #111; margin: 32px; }
					header { margin-bottom: 28px; }
					h1 { margin: 0 0 6px; font-size: 28px; }
					p { margin: 0; color: #555; }
					section { break-inside: avoid; margin: 0 0 24px; }
					h2 { font-size: 18px; margin: 0 0 10px; }
					table { width: 100%; border-collapse: collapse; font-size: 12px; }
					th, td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: top; }
					th { background: #f5f5f5; font-size: 10px; text-transform: uppercase; letter-spacing: .04em; }
					td:nth-child(1), td:nth-child(3) { width: 72px; text-align: center; white-space: nowrap; }
				</style>
			</head>
			<body>
				<header>
					<h1>${escapeHtml(title)}</h1>
					<p>${escapeHtml(sourceState.format)} · ${escapeHtml(sourceState.players?.length || 0)} players · Generated ${escapeHtml(generatedAt)}</p>
				</header>
				${rows || '<p>No schedule generated.</p>'}
			</body>
		</html>`;
}

export function printTournamentSchedule(
	stateOverride?: TournamentState | Partial<TournamentState>
): void {
	const popup = window.open('', '_blank');
	if (!popup) return;

	popup.document.open();
	popup.document.write(buildSchedulePrintHtml(stateOverride));
	popup.document.close();
	popup.focus();
	popup.print();
}

/**
 * Share tournament data via Web Share API.
 */
export async function shareTournamentData(): Promise<boolean> {
	if (!navigator.share) {
		return false;
	}

	try {
		await navigator.share({
			title: globalState.tournamentName || 'Tournament Results',
			text: `Tournament: ${globalState.format}\nPlayers: ${globalState.players.length}`
		});
		return true;
	} catch {
		return false;
	}
}

/**
 * Copy leaderboard to clipboard.
 */
export async function copyLeaderboardToClipboard(): Promise<boolean> {
	const lines = globalState.leaderboard.map((p, i) => `${i + 1}. ${p.name}: ${p.points || 0} pts`);

	const text = `${globalState.tournamentName || 'Tournament'}\n${'='.repeat(
		20
	)}\n${lines.join('\n')}`;

	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		return false;
	}
}

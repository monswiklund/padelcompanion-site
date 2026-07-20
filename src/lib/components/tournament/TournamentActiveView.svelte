<script lang="ts">
	import { Popover, Slider } from 'bits-ui';
	import Schedule from './Schedule.svelte';
	import Leaderboard from './Leaderboard.svelte';
	import PlayoffStandings from './PlayoffStandings.svelte';
	import BracketView from './BracketView.svelte';
	import WinnersCourtView from './WinnersCourtView.svelte';
	import MatchTimer from './MatchTimer.svelte';
	import Icons from '$lib/components/Icons.svelte';
	import PlayerMatchHistory from './PlayerMatchHistory.svelte';

	import { tournament } from '$lib/stores/tournament.svelte';
	import { showConfirmModal, showInputModal } from '$lib/tournament/core/modals';
	import { showToast, cn } from '$lib/shared/utils';
	import { launchConfetti } from '$lib/tournament/confetti';
	import { saveToHistory } from '$lib/tournament/history/repository';
	import { CloudService } from '$lib/tournament/sync/cloud';
	import {
		saveTournamentCloudLink,
		getTournamentCloudLink
	} from '$lib/tournament/sync/sessionLink';
	import { buildTournamentShareUrl } from '$lib/tournament/navigation';
	import { createId } from '$lib/shared/utils';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { getEstimatedRoundStartRelativeLabel } from '$lib/tournament/ui/components/scheduleTiming';
	import { getCourtDisplayName } from '$lib/tournament/courtNames';

	const ts = $derived(tournament.state);
	const canUndo = $derived(tournament.canUndo);
	const tournamentName = $derived(ts.tournamentName);
	const format = $derived(ts.format);
	const courts = $derived(
		ts.format === 'division'
			? (ts.divisions || []).reduce((sum, division) => sum + Math.max(1, division.courts ?? 0), 0)
			: ts.courts
	);
	const scoringMode = $derived(ts.scoringMode);

	let showSettings = $state(false);
	let isSyncing = $state(false);
	let isAutoSyncing = $state(false);
	let lastAutoSyncPayload = '';
	let historyPlayer = $state<{ id: string; name: string } | null>(null);

	onMount(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	});

	// Derivations for the Live Sidebar
	const activeRound = $derived(ts.schedule[ts.schedule.length - 1]);
	const activeByes = $derived(activeRound?.byes || []);

	const allRounds = $derived(ts.allRounds);
	const mergedRounds = $derived.by(() => {
		const rounds = (allRounds || []).map((round, index) =>
			ts.schedule[index] ? ts.schedule[index] : round
		);
		return rounds;
	});

	const upcomingRounds = $derived(mergedRounds.slice(ts.schedule.length));
	const hasDesktopPreview = $derived(upcomingRounds.some((round) => round.matches.length > 0));

	function getCourtName(courtNum: number, division?: string | null) {
		return getCourtDisplayName(ts, courtNum, division);
	}

	const compactLeaderboard = $derived.by(() => {
		return [...ts.leaderboard]
			.sort((a, b) => {
				if (b.points !== a.points) return b.points - a.points;
				if (b.wins !== a.wins) return b.wins - a.wins;
				return b.points - (b.pointsLost || 0) - (a.points - (a.pointsLost || 0));
			})
			.map((p, idx) => ({
				...p,
				rank: idx + 1
			}));
	});

	function handleReset() {
		showConfirmModal(
			'Reset Tournament',
			'This will clear all scores and rounds. Players will remain. Continue?',
			'Reset',
			() => {
				tournament.snapshot();
				tournament.updateField('schedule', []);
				tournament.updateField('currentRound', 0);
				tournament.updateField('leaderboard', []);
				tournament.updateField('allRounds', null);
				tournament.updateField('isLocked', false);
				tournament.updateField('hideLeaderboard', true);
				tournament.updateField('manualByes', []);
				tournament.updateField('winnersCourt', null);
				tournament.updateField('bracket', null);
				tournament.save();
				showToast('Tournament reset');
			}
		);
	}

	function handleEnd() {
		showConfirmModal(
			'Finish Tournament',
			'Are you sure you want to finish the tournament? This will reveal the final standings and save it to history!',
			'Finish & Celebrate',
			() => {
				tournament.snapshot();
				tournament.updateField('hideLeaderboard', false);
				tournament.updateField('showPositionChanges', false);

				saveToHistory(ts as any);
				launchConfetti();

				const el = document.querySelector('.leaderboard-section');
				if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });

				showToast('Tournament Finished & Saved!');
			}
		);
	}

	function handleUndo() {
		if (canUndo) {
			tournament.undo();
			showToast('Undo successful');
		}
	}

	function handleRename() {
		showInputModal(
			'Rename Tournament',
			'Enter new tournament name:',
			(newName) => {
				if (newName && newName.trim()) {
					tournament.updateField('tournamentName', newName.trim());
					showToast('Tournament renamed');
				}
			},
			tournamentName || 'Unnamed Tournament'
		);
	}

	function getCloudLinkName() {
		return ts.tournamentName || 'Untitled Tournament';
	}

	const autoSyncPayload = $derived(
		JSON.stringify({
			players: ts.players,
			schedule: ts.schedule,
			leaderboard: ts.leaderboard,
			currentRound: ts.currentRound,
			roundStartedAt: ts.roundStartedAt,
			timer: ts.timer,
			winnersCourt: ts.winnersCourt,
			bracket: ts.bracket,
			tournamentName: ts.tournamentName,
			tournamentNotes: ts.tournamentNotes,
			format: ts.format
		})
	);

	$effect(() => {
		const existingLink = getTournamentCloudLink(getCloudLinkName());
		if (!existingLink?.editToken || !ts.players.length || isSyncing) return;

		if (!lastAutoSyncPayload) {
			lastAutoSyncPayload = autoSyncPayload;
			return;
		}
		if (autoSyncPayload === lastAutoSyncPayload) return;

		isAutoSyncing = true;
		const timeout = window.setTimeout(async () => {
			try {
				const summary = await CloudService.updateSession(
					existingLink.sessionId,
					existingLink.editToken || '',
					ts as any
				);
				saveTournamentCloudLink(getCloudLinkName(), summary as any);
				lastAutoSyncPayload = autoSyncPayload;
			} catch {
				showToast('Cloud auto-sync failed', 'error');
			} finally {
				isAutoSyncing = false;
			}
		}, 1200);

		return () => window.clearTimeout(timeout);
	});

	function handleAddLatePlayer() {
		const isTeamMode = format.startsWith('team');
		const entityName = isTeamMode ? 'team' : 'player';

		showInputModal(
			isTeamMode ? 'Add Late Team' : 'Add Late Player',
			`Enter new ${entityName} name:`,
			(name) => {
				if (!name || !name.trim()) return;

				const proceed = () => {
					tournament.addLatePlayer({ id: createId(), name: name.trim(), lockedCourt: null });
					showToast(`${name.trim()} added to tournament`);
				};

				if (format === 'americano' || format === 'team') {
					showConfirmModal(
						'Switch to Mexicano?',
						'Adding a player mid-tournament requires switching to Mexicano (Dynamic) pairings. Continue?',
						'Switch & Add',
						() => {
							tournament.updateField('format', 'mexicano');
							tournament.updateField('allRounds', null);
							proceed();
						}
					);
				} else {
					proceed();
				}
			},
			`They will join with 0 points and start playing from the next round.`
		);
	}

	async function handleCloudSync() {
		if (!CloudService.isConfigured()) {
			showToast('Cloud sync API is not configured', 'error');
			return;
		}

		if (!ts.players.length) {
			showToast('Add players before sharing a tournament', 'warning');
			return;
		}

		isSyncing = true;
		try {
			const existingLink = getTournamentCloudLink(getCloudLinkName());
			const summary = existingLink
				? await CloudService.updateSession(
						existingLink.sessionId,
						existingLink.editToken || '',
						ts as any
					)
				: await CloudService.createSession(ts as any);

			saveTournamentCloudLink(getCloudLinkName(), summary as any);
			lastAutoSyncPayload = autoSyncPayload;

			const shareUrl = buildTournamentShareUrl(summary.shareCode);
			try {
				await navigator.clipboard.writeText(shareUrl);
				showToast(`Cloud sync updated. Link copied for code: ${summary.shareCode}`, 'success');
			} catch {
				showToast(`Cloud sync updated. Share link ready for code: ${summary.shareCode}`, 'success');
			}
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to sync tournament';
			showToast(message, 'error');
		} finally {
			isSyncing = false;
		}
	}

	const formatLabels: Record<string, string> = {
		americano: 'Americano',
		mexicano: 'Mexicano',
		team: 'Team Americano',
		teamMexicano: 'Team Mexicano',
		division: 'Division',
		bracket: 'Bracket',
		'winners-court': 'Winners Court'
	};

	const scoringLabels: Record<string, string> = {
		total: 'Total Points',
		race: 'Race to Points',
		time: 'Time Based'
	};

	const formatLabel = $derived(formatLabels[format] || 'Tournament');
	const scoringLabel = $derived(scoringLabels[scoringMode] || 'Scoring');

	const isDivision = $derived(format === 'division');
</script>

<div
	class="mx-auto animate-fade-in px-2 py-8 pb-36 sm:px-6 {isDivision
		? 'max-w-[1920px]'
		: 'max-w-[1400px]'} noise font-sans select-none"
>
	{#if historyPlayer}
		<PlayerMatchHistory
			playerId={historyPlayer.id}
			playerName={historyPlayer.name}
			isOpen={!!historyPlayer}
			onClose={() => (historyPlayer = null)}
		/>
	{/if}

	<!-- Active Header -->
	<header class="relative mb-10 pt-4 text-center">
		<!-- Live Status Badge -->
		<div
			class="mb-6 inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2 text-xs font-black tracking-wider text-background uppercase ring-1 ring-border"
		>
			<div class="relative">
				<div class="relative z-10 h-2.5 w-2.5 rounded-full bg-accent"></div>
			</div>
			Live
		</div>

		<!-- Tournament Title -->
		<button
			type="button"
			class="group mb-6 inline-flex w-full cursor-pointer flex-col items-center gap-3 border-none bg-transparent outline-none"
			onclick={handleRename}
		>
			<h1
				class="font-display text-4xl leading-tight font-black tracking-normal text-foreground transition-colors duration-200 group-hover:text-accent md:text-5xl lg:text-6xl"
			>
				{tournamentName || 'ARENA SESSION'}
			</h1>
		</button>

		<!-- Quick Stats -->
		<div class="flex flex-wrap justify-center gap-3">
			<div
				class="flex items-center gap-2 rounded-xl border border-border bg-foreground/[0.04] px-4 py-2 text-xs font-black tracking-wider text-foreground/60 uppercase"
			>
				<span class="text-foreground/30">MODE</span>
				<span class="text-foreground">{formatLabel}</span>
			</div>
			<div
				class="flex items-center gap-2 rounded-xl border border-border bg-foreground/[0.04] px-4 py-2 text-xs font-black tracking-wider text-foreground/60 uppercase"
			>
				<span class="text-foreground/30">ARENAS</span> <span class="text-foreground">{courts}</span>
			</div>
			<div
				class="flex items-center gap-2 rounded-xl border border-border bg-foreground/[0.04] px-4 py-2 text-xs font-black tracking-wider text-foreground/60 uppercase"
			>
				<span class="text-foreground/30">SYSTEM</span>
				<span class="text-foreground">{scoringLabel}</span>
			</div>
		</div>
	</header>

	<!-- Main View Area -->
	<div class="space-y-16 md:space-y-24">
		{#if format === 'bracket'}
			<div transition:fade={{ duration: 600 }}>
				<BracketView />
			</div>
		{:else if format === 'winners-court'}
			<div transition:fade={{ duration: 600 }}>
				<WinnersCourtView />
			</div>
		{:else}
			<!-- Widescreen Live Cockpit Layout Grid -->
			<div
				class={cn(
					'grid grid-cols-1 items-start gap-8',
					isDivision
						? 'lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)] xl:grid-cols-[minmax(0,1.8fr)_minmax(340px,1.2fr)]'
						: 'w-full'
				)}
			>
				<!-- Main Stage (Left Column) -->
				<div class="w-full min-w-0 space-y-12">
					<!-- Schedule Section -->
					<div class="relative w-full" in:fade={{ duration: 800 }}>
						<Schedule />
					</div>

					<!-- Playoff Standings (Horizontal bar if active) -->
					{#if !isDivision}
						<div class="w-full pt-8">
							<PlayoffStandings />
						</div>
					{/if}
				</div>

				{#if isDivision}
					<!-- Live Dashboard Sidebar (Right Column) -->
					<aside class="h-fit w-full space-y-8 lg:sticky lg:top-8">
						<!-- Section 1: Resting Players Indicator -->
						{#if activeByes.length > 0}
							<div
								class="flex flex-col gap-3 rounded-xl border border-border/10 bg-foreground/[0.02] p-5"
							>
								<div class="flex items-center gap-2">
									<Icons name="history" size={14} class="text-accent" />
									<span class="text-xs font-black tracking-wider text-foreground/45 uppercase"
										>Resting Players</span
									>
								</div>
								<div
									class="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold tracking-normal text-foreground"
								>
									{#each activeByes as p, bIdx}
										{#if bIdx > 0}
											<span class="text-foreground/15 select-none">•</span>
										{/if}
										<span class="rounded border border-border/5 bg-foreground/[0.04] px-2.5 py-1"
											>{p.name}</span
										>
									{/each}
								</div>
							</div>
						{/if}

						<!-- Section 2: Compact Live Standings -->
						<div
							class="flex flex-col gap-5 rounded-xl border border-border/10 bg-foreground/[0.02] p-6"
						>
							<div class="flex items-center justify-between border-b border-border/10 pb-3">
								<div class="space-y-0.5">
									<h3 class="text-sm font-black tracking-normal text-foreground">Live Standings</h3>
									<p class="text-[10px] font-black tracking-wider text-foreground/35 uppercase">
										Real-time rank & score updates
									</p>
								</div>
								<Icons name="trophy" size={16} class="text-accent" />
							</div>

							<div class="overflow-x-auto pr-1">
								<table class="w-full">
									<thead>
										<tr
											class="border-b border-border/5 text-left text-[10px] font-black tracking-wider text-foreground/40 uppercase"
										>
											<th class="w-12 py-2 text-center">Rank</th>
											<th class="py-2">Player / Team</th>
											<th class="w-16 py-2 text-right text-accent">Points</th>
											<th class="w-12 py-2 text-right">Wins</th>
										</tr>
									</thead>
									<tbody>
										{#each compactLeaderboard.slice(0, 8) as player}
											<tr
												class="group/row cursor-pointer border-b border-border/5 transition-all last:border-b-0 hover:bg-foreground/[0.04]"
												onclick={() => (historyPlayer = { id: player.id, name: player.name })}
											>
												<td class="py-3 text-center">
													<span
														class={cn(
															'inline-flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-black',
															player.rank === 1
																? 'bg-foreground text-background shadow-sm shadow-foreground/5'
																: player.rank === 2
																	? 'bg-foreground/20 text-foreground'
																	: player.rank === 3
																		? 'bg-foreground/10 text-foreground/60'
																		: 'bg-foreground/[0.03] text-foreground/45'
														)}
													>
														{player.rank}
													</span>
												</td>
												<td
													class="max-w-[180px] py-3 text-[11px] font-black tracking-normal break-words text-foreground transition-colors group-hover/row:text-accent"
												>
													{player.name}
												</td>
												<td class="py-3 text-right text-[11px] font-black text-accent tabular-nums">
													{player.points}
												</td>
												<td
													class="py-3 text-right text-[11px] font-black text-foreground/50 tabular-nums"
												>
													{player.wins}
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>

							<div
								class="flex items-center justify-between border-t border-border/10 pt-3 text-[9px] font-black tracking-wider uppercase"
							>
								<span class="text-foreground/25">{compactLeaderboard.length} Players Active</span>
								<a
									href="#leaderboard-full"
									class="cursor-pointer text-accent transition-colors hover:text-foreground"
									onclick={(e) => {
										e.preventDefault();
										const el = document.querySelector('.leaderboard-section');
										if (el) el.scrollIntoView({ behavior: 'smooth' });
									}}
								>
									View Full Standings →
								</a>
							</div>
						</div>

						<!-- Section 3: Upcoming Timeline -->
						{#if hasDesktopPreview}
							<div
								class="flex flex-col gap-5 rounded-xl border border-border/10 bg-foreground/[0.02] p-6"
							>
								<div class="space-y-0.5 border-b border-border/10 pb-3">
									<h3 class="text-sm font-black tracking-normal text-foreground">
										Upcoming Schedule
									</h3>
									<p class="text-[10px] font-black tracking-wider text-foreground/35 uppercase">
										Estimated Start times
									</p>
								</div>

								<div class="custom-scrollbar max-h-[460px] space-y-6 overflow-y-auto pr-1">
									{#each upcomingRounds as round}
										<div class="space-y-2">
											<div class="flex items-center justify-between border-b border-border/5 pb-1">
												<span class="text-xs font-black tracking-wider text-foreground/60 uppercase"
													>{round.name || `Round ${round.number}`}</span
												>
												<span class="text-[10px] font-black tracking-wider text-accent uppercase">
													{getEstimatedRoundStartRelativeLabel(ts, round.number - 1)}
												</span>
											</div>

											<div class="space-y-0 divide-y divide-border/5">
												{#each round.matches as match}
													{@const matchDivision =
														format === 'division' ? (match.team1[0] as any)?.division || 'A' : null}
													<div class="flex items-center justify-between gap-3 py-2.5">
														<div
															class="flex min-w-[70px] shrink-0 items-center gap-1.5 text-[10px] font-black tracking-wider text-foreground/40 uppercase"
														>
															<span>{getCourtName(match.court, matchDivision)}</span>
															{#if matchDivision}
																<span class="text-accent/60">({matchDivision})</span>
															{/if}
														</div>

														<div
															class="grid min-w-0 flex-1 grid-cols-[1fr_auto_1fr] items-center gap-2 text-[11px] font-bold tracking-normal text-foreground/75"
														>
															<span class="text-right break-words"
																>{match.team1.map((p) => p.name).join(' / ')}</span
															>
															<span
																class="px-0.5 text-[10px] font-normal text-foreground/15 select-none"
																>VS</span
															>
															<span class="text-left break-words"
																>{match.team2.map((p) => p.name).join(' / ')}</span
															>
														</div>
													</div>
												{/each}
											</div>
										</div>
									{/each}
								</div>
							</div>
						{/if}
					</aside>
				{/if}
			</div>

			<!-- Full Leaderboard Section (Anchored below) -->
			<div id="leaderboard-full" class="leaderboard-section mt-24">
				<Leaderboard />
			</div>
		{/if}
	</div>

	<!-- CONTROL CENTER (Static flow element below content) -->
	<div class="mt-12 mb-16 flex justify-center w-full px-4">
		<div
			class="rounded-full border border-border bg-popover/90 p-2 shadow-2xl ring-1 ring-foreground/5 backdrop-blur-md"
		>
			<div class="flex items-center gap-1 md:gap-3">
				<!-- Action Group (Left) -->
				<div class="flex items-center gap-2">
					<button
						type="button"
						class={cn(
							'flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full border transition-all',
							canUndo
								? 'border-border bg-foreground/[0.05] text-foreground hover:bg-foreground/[0.1]'
								: 'cursor-not-allowed border-border text-foreground/50 opacity-20'
						)}
						onclick={handleUndo}
						disabled={!canUndo}
						title="Rollback Action"
						aria-label="Undo last action"
					>
						<span class="sr-only">Undo last action</span>
						<Icons name="undo" size={20} />
					</button>

					<button
						type="button"
						class="flex h-[44px] w-[44px] shrink-0 cursor-pointer items-center justify-center gap-3 rounded-full border border-border bg-foreground/[0.05] text-[11px] font-black tracking-wider text-foreground uppercase transition-all duration-200 hover:bg-foreground hover:text-background md:w-auto md:px-5"
						onclick={handleAddLatePlayer}
					>
						<span class="text-2xl leading-none font-light">+</span>
						<span class="hidden md:inline">Late Entrant</span>
					</button>
				</div>

				<!-- System Timer (Center) -->
				<div class="shrink-0">
					<MatchTimer />
				</div>

				<!-- System Controls (Right) -->
				<div class="flex items-center gap-2">
					<Popover.Root bind:open={showSettings}>
						<Popover.Trigger
							class="flex h-[44px] w-[44px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-foreground/[0.05] text-foreground transition-all hover:bg-foreground/[0.1] data-[state=open]:bg-foreground data-[state=open]:text-background"
							title="Display Preferences"
							aria-label="Display preferences"
						>
							<Icons name="settings" size={20} />
						</Popover.Trigger>
						<Popover.Portal>
							<Popover.Content
								side="top"
								align="end"
								sideOffset={20}
								class="animate-in fade-in zoom-in-95 slide-in-from-bottom-6 z-[500] w-80 rounded-card border border-border bg-popover/95 p-6 shadow-lg ring-1 ring-foreground/10 backdrop-blur-md duration-200"
							>
								<div class="space-y-10">
									<div class="space-y-6">
										<h4 class="text-[11px] font-black tracking-wider text-foreground/40 uppercase">
											Grid Configuration
										</h4>
										<div
											class="grid grid-cols-5 gap-2 rounded-2xl border border-border bg-foreground/[0.03] p-2"
										>
											{#each [0, 1, 2, 3, 4] as num}
												<button
													type="button"
													onclick={() => tournament.updateField('gridColumns', num)}
													class={cn(
														'h-[48px] cursor-pointer rounded-xl text-[11px] font-black transition-all',
														ts.gridColumns === num
															? 'bg-foreground text-background shadow-xl'
															: 'text-foreground/40 hover:text-foreground'
													)}
												>
													{num === 0 ? 'AUTO' : num}
												</button>
											{/each}
										</div>
									</div>

									<div class="space-y-6">
										<div class="flex items-center justify-between">
											<h4
												class="text-[11px] font-black tracking-wider text-foreground/40 uppercase"
											>
												Display Scale
											</h4>
											<span class="text-[11px] font-black tracking-wider text-foreground uppercase"
												>{ts.textSize}%</span
											>
										</div>
										<Slider.Root
											type="single"
											value={ts.textSize}
											onValueChange={(v) => tournament.updateField('textSize', v)}
											min={50}
											max={350}
											step={10}
											class="relative flex w-full touch-none items-center py-2 select-none"
										>
											<span
												class="relative h-1.5 w-full grow overflow-hidden rounded-full bg-foreground/10"
											>
												<Slider.Range class="absolute h-full bg-foreground" />
											</span>
											<Slider.Thumb
												index={0}
												class="block h-6 w-6 cursor-pointer rounded-full bg-foreground shadow-sm transition-transform outline-none active:scale-95"
											/>
										</Slider.Root>
									</div>
								</div>
							</Popover.Content>
						</Popover.Portal>
					</Popover.Root>

					<button
						type="button"
						onclick={handleCloudSync}
						disabled={isSyncing}
						class="flex h-[44px] w-[44px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-foreground text-[11px] font-black tracking-wider text-background uppercase shadow-sm transition-all duration-200 active:scale-95 disabled:opacity-50 md:w-auto md:px-6"
						title="Share link"
						aria-label="Share link"
					>
						<Icons name="cloud" size={18} class="md:hidden" />
						<span class="hidden md:inline"
							>{isSyncing ? 'SYNCING...' : isAutoSyncing ? 'SAVING...' : 'SHARE LINK'}</span
						>
					</button>

					{#if !isDivision && ts.schedule.some((r) => r.completed)}
						<button
							type="button"
							class="flex h-[44px] w-[44px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#34C759] bg-[#34C759] text-white shadow-sm transition-all active:scale-95"
							onclick={handleEnd}
							title="Finalize Tournament"
							aria-label="Finish tournament"
						>
							<span class="sr-only">Finish tournament</span>
							<Icons name="trophy" size={24} />
						</button>
					{/if}

					<button
						type="button"
						class="hidden h-[48px] w-[48px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-foreground/[0.02] text-foreground/30 transition-all hover:bg-[#FF3B30]/10 hover:text-[#FF3B30] md:flex"
						onclick={handleReset}
						title="System Reset"
						aria-label="Reset tournament"
					>
						<span class="sr-only">Reset tournament</span>
						<Icons name="refresh" size={20} />
					</button>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* Custom scrollbar styling for high-density containers */
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
		height: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: var(--border, rgba(255, 255, 255, 0.1));
		border-radius: 10px;
	}
</style>

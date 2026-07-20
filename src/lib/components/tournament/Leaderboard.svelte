<script lang="ts">
	import Icons from '$lib/components/Icons.svelte';
	import PlayerMatchHistory from './PlayerMatchHistory.svelte';
	import { tournament } from '$lib/stores/tournament.svelte';
	import { copyLeaderboardToClipboard } from '$lib/tournament/ui/setup/exportShare';
	import { showToast, cn } from '$lib/shared/utils';

	const ts = $derived(tournament.state);
	const leaderboard = $derived(ts.leaderboard);
	const rankingCriteria = $derived(ts.rankingCriteria);
	const hideLeaderboard = $derived(ts.hideLeaderboard);
	const showPositionChanges = $derived(ts.showPositionChanges);
	const leaderboardColumns = $derived(ts.leaderboardColumns);
	const format = $derived(ts.format);
	const tiebreaker = $derived(ts.tiebreaker);

	const isDivision = $derived(format === 'division');
	const isPlayoffs = $derived(leaderboard.length > 0 && ts.schedule.some((r) => !!r.name));

	let searchQuery = $state('');
	let isExpanded = $state(false);
	let isSmallScreen = $state(false);

	// Match History Modal State
	let historyPlayer = $state<{ id: string; name: string } | null>(null);

	// Resize Listener
	import { onMount, onDestroy } from 'svelte';
	function handleResize() {
		isSmallScreen = window.innerWidth < 800;
	}
	onMount(() => {
		handleResize();
		window.addEventListener('resize', handleResize);
	});
	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', handleResize);
		}
	});

	// Effective columns considering screen size
	const effectiveColumns = $derived(isSmallScreen ? 1 : leaderboardColumns || 1);

	// Sort and process standings
	const processedLeaderboard = $derived.by(() => {
		const standings = [...leaderboard].sort((a, b) => {
			if (isDivision) {
				const mpA = (a as any).matchPoints || 0;
				const mpB = (b as any).matchPoints || 0;
				if (mpB !== mpA) return mpB - mpA;
				if (tiebreaker === 'difference') {
					const diffA = (a.points || 0) - (a.pointsLost || 0);
					const diffB = (b.points || 0) - (b.pointsLost || 0);
					if (diffB !== diffA) return diffB - diffA;
				} else if (tiebreaker === 'most_won') {
					if ((b.points || 0) !== (a.points || 0)) return (b.points || 0) - (a.points || 0);
				}
				return (b.wins || 0) - (a.wins || 0);
			}

			switch (rankingCriteria) {
				case 'wins':
					if (b.wins !== a.wins) return b.wins - a.wins;
					if (b.points !== a.points) return b.points - a.points;
					return b.points - (b.pointsLost || 0) - (a.points - (a.pointsLost || 0));
				case 'winRatio': {
					const aRate = a.played > 0 ? a.wins / a.played : 0;
					const bRate = b.played > 0 ? b.wins / b.played : 0;
					if (Math.abs(bRate - aRate) > 0.001) return bRate - aRate;
					return b.points - a.points;
				}
				case 'pointRatio': {
					const aTotal = a.points + (a.pointsLost || 0);
					const bTotal = b.points + (b.pointsLost || 0);
					const aPRate = aTotal > 0 ? a.points / aTotal : 0;
					const bPRate = bTotal > 0 ? b.points / bTotal : 0;
					if (Math.abs(bPRate - aPRate) > 0.001) return bPRate - aPRate;
					return b.points - a.points;
				}
				case 'points':
				default:
					if (b.points !== a.points) return b.points - a.points;
					if (b.wins !== a.wins) return b.wins - a.wins;
					return b.points - (b.pointsLost || 0) - (a.points - (a.pointsLost || 0));
			}
		});

		const withRanks = standings.map((p, idx) => ({
			...p,
			currentRank: idx + 1
		}));

		let list = withRanks;
		if (hideLeaderboard) {
			list = [...withRanks].sort((a, b) => String(a.id).localeCompare(String(b.id)));
		}

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			list = list.filter((p) => p.name.toLowerCase().includes(query));
		}

		return list;
	});

	const visibleLeaderboard = $derived.by(() => {
		if (
			isExpanded ||
			searchQuery.trim() ||
			processedLeaderboard.length <= 12 ||
			effectiveColumns > 1
		) {
			return processedLeaderboard;
		}
		return processedLeaderboard.slice(0, 10);
	});

	const totalCount = $derived(processedLeaderboard.length);

	function getColumnData() {
		const cols = Math.max(1, effectiveColumns);
		if (cols === 1 || searchQuery) return [visibleLeaderboard];

		const perCol = Math.ceil(visibleLeaderboard.length / cols);
		const result = [];
		for (let i = 0; i < cols; i++) {
			result.push(visibleLeaderboard.slice(i * perCol, (i + 1) * perCol));
		}
		return result;
	}

	const columnData = $derived(getColumnData());

	function getRankClass(rank: number) {
		if (hideLeaderboard) return '';
		if (rank === 1) return 'bg-gradient-to-r from-[#FFD700]/5 to-transparent';
		if (rank === 2) return 'bg-gradient-to-r from-foreground/5 to-transparent';
		if (rank === 3) return 'bg-gradient-to-r from-[#FF9500]/5 to-transparent';
		return '';
	}

	async function handleShare() {
		const success = await copyLeaderboardToClipboard();
		if (success) {
			showToast('Leaderboard copied to clipboard!', 'success');
		} else {
			showToast('Failed to copy leaderboard', 'error');
		}
	}

	function handlePrint() {
		window.print();
	}
</script>

<div class="leaderboard-section relative z-10 rounded-card border border-border bg-card/40">
	{#if historyPlayer}
		<PlayerMatchHistory
			playerId={historyPlayer.id}
			playerName={historyPlayer.name}
			isOpen={!!historyPlayer}
			onClose={() => (historyPlayer = null)}
		/>
	{/if}

	<div class="overflow-hidden rounded-card">
		<!-- Header with controls -->
		<div class="space-y-8 border-b border-border p-6 md:p-8">
			<div class="flex flex-col items-end justify-between gap-6 xl:flex-row">
				<div class="space-y-2">
					<h3
						class="font-display text-3xl leading-none font-black tracking-normal text-foreground md:text-4xl"
					>
						{isPlayoffs ? 'Group Stage Standings' : 'Live Standings'}
					</h3>
					<div class="flex items-center gap-4">
						<div class="h-px w-10 bg-border"></div>
						<p class="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
							Live Data
						</p>
					</div>
				</div>

				<div class="flex w-full flex-col items-center gap-6 sm:flex-row xl:w-auto">
					<!-- Ranking Criteria -->
					<div class="flex w-full rounded-xl border border-border bg-secondary p-1 sm:w-auto">
						{#each [{ id: 'points', label: 'Points' }, { id: 'wins', label: 'Wins' }, { id: 'winRatio', label: 'Win%' }, { id: 'pointRatio', label: 'Pts%' }] as tab}
							<button
								type="button"
								onclick={() => tournament.updateField('rankingCriteria', tab.id)}
								style="min-width: 44px;"
								class={cn(
									'min-h-[44px] flex-1 rounded-lg px-5 py-2.5 text-xs font-black tracking-wider uppercase transition-all',
									rankingCriteria === tab.id
										? 'bg-foreground text-background shadow-sm shadow-foreground/5'
										: 'text-muted-foreground hover:text-foreground'
								)}
							>
								{tab.label}
							</button>
						{/each}
					</div>

					<!-- Toggles -->
					<div class="flex shrink-0 rounded-xl border border-border bg-foreground/5 p-1">
						<button
							type="button"
							class={cn(
								'flex h-[44px] w-[44px] items-center justify-center rounded-lg p-3 transition-all',
								!hideLeaderboard
									? 'bg-accent text-accent-foreground'
									: 'text-foreground/20 hover:text-foreground'
							)}
							onclick={() => tournament.updateField('hideLeaderboard', !hideLeaderboard)}
							title="Toggle Scores"
							aria-label="Toggle scores"
						>
							<Icons name="eye" size={16} />
						</button>
						<button
							type="button"
							class={cn(
								'flex h-[44px] w-[44px] items-center justify-center rounded-lg p-3 transition-all',
								showPositionChanges
									? 'bg-accent text-accent-foreground'
									: 'text-foreground/20 hover:text-foreground'
							)}
							onclick={() => tournament.updateField('showPositionChanges', !showPositionChanges)}
							title="Toggle Rank History"
							aria-label="Toggle rank history"
						>
							<Icons name="history" size={16} />
						</button>
					</div>
				</div>
			</div>

			<!-- Search Bar -->
			<div class="group relative">
				<div
					class="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-foreground"
				>
					<Icons name="search" size={20} />
				</div>
				<input
					type="search"
					enterkeyhint="search"
					class="w-full rounded-xl border border-border bg-secondary py-3.5 pr-12 pl-12 text-sm font-semibold tracking-wider text-foreground transition-all placeholder:text-muted-foreground focus:border-accent focus:bg-secondary/80 focus:outline-none"
					placeholder="Search players..."
					bind:value={searchQuery}
				/>
				{#if searchQuery}
					<button
						type="button"
						class="absolute top-1/2 right-2 flex h-[44px] w-[44px] -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground"
						onclick={() => (searchQuery = '')}
					>
						<Icons name="x" size={18} />
					</button>
				{/if}
			</div>
		</div>

		<!-- Table Body -->
		{#if isDivision}
			<!-- Division Layout -->
			<div
				class="p-4 md:p-8 {effectiveColumns === 1
					? 'space-y-12'
					: `grid gap-8 ${effectiveColumns === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}"
			>
				{#each (() => {
					const divGroups = new Map<string, typeof visibleLeaderboard>();
					visibleLeaderboard.forEach((p) => {
						const div = (p as any).division || 'A';
						if (!divGroups.has(div)) divGroups.set(div, []);
						divGroups.get(div)!.push(p);
					});
					return [...divGroups.keys()]
						.sort()
						.map((divName) => ({ name: divName, players: divGroups.get(divName)! }));
				})() as division}
					<div class="space-y-6">
						<h4
							class="pl-2 font-display text-sm font-black tracking-wider text-foreground uppercase"
						>
							Division {division.name}
						</h4>
						<div class="overflow-hidden rounded-card border border-border bg-foreground/[0.02]">
							<table class="w-full">
								<thead>
									<tr class="border-b border-border bg-foreground/[0.03]">
										<th
											class="w-16 py-5 text-center text-[11px] font-black tracking-wider text-muted-foreground uppercase"
											>Rank</th
										>
										<th
											class="py-5 text-left text-[11px] font-black tracking-wider text-muted-foreground uppercase"
											>Team</th
										>
										<th
											class="w-12 py-5 text-center text-[11px] font-black tracking-wider text-muted-foreground uppercase"
											>P</th
										>
										<th
											class="w-12 py-5 text-center text-[11px] font-black tracking-wider text-muted-foreground uppercase"
											>W</th
										>
										<th
											class="w-12 py-5 text-center text-[11px] font-black tracking-wider text-accent uppercase"
											>MP</th
										>
									</tr>
								</thead>
								<tbody>
									{#each division.players as player, idx}
										{@const mp = (player as any).matchPoints || 0}
										{@const rank = idx + 1}
										<tr
											class="group/row cursor-pointer border-b border-border transition-all last:border-b-0 hover:bg-foreground/[0.05]"
											onclick={() => (historyPlayer = { id: player.id, name: player.name })}
										>
											<td class="py-5 text-center">
												<span
													class={cn(
														'inline-flex h-8 w-8 items-center justify-center rounded-xl text-[11px] font-black transition-all',
														rank === 1
															? 'bg-foreground text-background shadow-sm shadow-foreground/5'
															: 'bg-secondary text-muted-foreground'
													)}
												>
													{rank}
												</span>
											</td>
											<td class="py-5">
												<span
													class="text-[11px] font-black tracking-wider text-foreground transition-all group-hover/row:text-accent"
												>
													{player.name}
												</span>
											</td>
											<td class="py-5 text-center text-[11px] font-black text-foreground/40"
												>{player.played}</td
											>
											<td class="py-5 text-center text-[11px] font-black text-foreground/40"
												>{player.wins}</td
											>
											<td class="py-5 text-center text-[11px] font-black text-accent">{mp}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<!-- Standard Layout -->
			<div
				class="grid gap-0 p-0 {effectiveColumns === 1
					? 'grid-cols-1'
					: effectiveColumns === 2
						? 'grid-cols-2'
						: 'grid-cols-3'}"
			>
				{#each columnData as dataSlice}
					<div class="border-r border-border last:border-r-0">
						<table class="w-full">
							<thead>
								<tr class="border-b border-border bg-foreground/[0.03]">
									<th
										class="w-24 py-5 text-center text-[11px] font-black tracking-wider text-muted-foreground uppercase"
										>Rank</th
									>
									<th
										class="py-5 text-left text-[11px] font-black tracking-wider text-muted-foreground uppercase"
										>Player</th
									>
									<th
										class="w-20 py-5 text-center text-[11px] font-black tracking-wider text-accent uppercase"
										>Points</th
									>
									<th
										class="w-16 py-5 text-center text-[11px] font-black tracking-wider text-muted-foreground uppercase"
										>Wins</th
									>
									<th
										class="w-20 py-5 text-center text-[11px] font-black tracking-wider text-muted-foreground uppercase"
										>Win%</th
									>
									<th
										class="w-16 py-5 text-center text-[11px] font-black tracking-wider text-muted-foreground uppercase"
										>Played</th
									>
								</tr>
							</thead>
							<tbody>
								{#each dataSlice as player}
									{@const rank = player.currentRank}
									{@const prevRank = player.previousRank || rank}
									{@const rankChange = prevRank - rank}
									{@const rankClass = getRankClass(rank)}

									<tr
										class={cn(
											'group/row relative cursor-pointer overflow-hidden border-b border-border transition-all last:border-b-0 hover:bg-foreground/[0.06]',
											rankClass
										)}
										onclick={() => (historyPlayer = { id: player.id, name: player.name })}
									>
										<td class="py-4 text-center">
											<div class="flex items-center justify-center gap-3">
												<span
													class={cn(
														'inline-flex h-10 w-10 items-center justify-center rounded-lg text-[13px] font-black transition-all',
														rank === 1
															? 'bg-foreground text-background shadow-sm'
															: rank === 2
																? 'bg-foreground/20 text-foreground'
																: rank === 3
																	? 'bg-foreground/10 text-foreground/60'
																	: 'bg-secondary text-muted-foreground'
													)}
												>
													{!hideLeaderboard ? rank : '-'}
												</span>
												{#if showPositionChanges && rankChange !== 0}
													<span
														class={cn(
															'text-[11px] font-black',
															rankChange > 0 ? 'text-[#34C759]' : 'text-[#FF3B30]'
														)}
													>
														{rankChange > 0 ? `▲${rankChange}` : `▼${Math.abs(rankChange)}`}
													</span>
												{/if}
											</div>
										</td>
										<td class="py-6">
											<span
												class="block max-w-[280px] text-xs font-black tracking-normal break-words text-foreground transition-colors group-hover/row:text-accent"
											>
												{player.name}
											</span>
										</td>
										<td class="py-4 text-center text-[13px] font-black text-foreground"
											>{!hideLeaderboard ? player.points : '-'}</td
										>
										<td class="py-4 text-center text-[13px] font-black text-foreground/40"
											>{!hideLeaderboard ? player.wins : '-'}</td
										>
										<td class="py-4 text-center text-[13px] font-black text-foreground/40">
											{!hideLeaderboard && player.played > 0
												? `${Math.round((player.wins / player.played) * 100)}%`
												: '-'}
										</td>
										<td class="py-4 text-center text-[13px] font-black text-foreground/40"
											>{player.played}</td
										>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Footer -->
		<div
			class="flex flex-col items-center justify-between gap-10 border-t border-border bg-foreground/[0.02] p-10 sm:flex-row"
		>
			<div class="flex items-center gap-10">
				<div class="flex flex-col gap-1">
					<span class="text-xs font-black tracking-wider text-foreground/30 uppercase"
						>Pool Population</span
					>
					<span class="font-display text-2xl leading-none font-black text-foreground"
						>{totalCount} Active</span
					>
				</div>
				{#if !isExpanded && totalCount > 10 && effectiveColumns === 1}
					<button
						type="button"
						class="min-h-[44px] rounded-xl border border-border bg-foreground/5 px-5 py-3 text-xs font-black tracking-wider text-foreground uppercase transition-all hover:bg-foreground/10 active:scale-95"
						onclick={() => (isExpanded = true)}
					>
						Show All (+{totalCount - 10})
					</button>
				{/if}
			</div>

			<div class="flex gap-6">
				<button
					type="button"
					class="min-h-[44px] px-8 py-4 text-xs font-black tracking-wider text-foreground/45 uppercase transition-all hover:text-foreground"
					onclick={handleShare}
				>
					Share Results
				</button>
				<button
					type="button"
					class="min-h-[44px] rounded-xl bg-foreground px-8 py-4 text-xs font-black tracking-wider text-background uppercase shadow-sm transition-all active:scale-95"
					onclick={handlePrint}
				>
					Print Data
				</button>
			</div>
		</div>
	</div>
</div>

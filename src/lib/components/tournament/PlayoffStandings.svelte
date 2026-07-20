<script lang="ts">
	import { tournament } from '$lib/stores/tournament.svelte';
	import GlassCard from '../ui/GlassCard.svelte';
	import { fade } from 'svelte/transition';
	import { cn } from '$lib/shared/utils';

	const ts = $derived(tournament.state);
	const schedule = $derived(ts.schedule);
	const format = $derived(ts.format);
	const players = $derived(ts.players);

	const semiRound = $derived(schedule.find((r) => r.name === 'Semifinal'));
	const finalRound = $derived(schedule.find((r) => r.name === 'Final'));

	// Group by division
	const divisionsList = $derived(
		Array.from(
			new Map(players.map((p: any) => [p.division || 'A', p.division || 'A'])).values()
		).sort()
	);

	function getWinner(m: any) {
		return (m.score1 || 0) > (m.score2 || 0) ? m.team1 : m.team2;
	}

	function getLoser(m: any) {
		return (m.score1 || 0) > (m.score2 || 0) ? m.team2 : m.team1;
	}

	function isCompleted(m: any) {
		return m.score1 != null || m.score2 != null;
	}

	const divColors: Record<string, string> = {
		A: 'border-accent/25',
		B: 'border-success/25',
		C: 'border-[#FF9500]/25'
	};
</script>

{#if format === 'division' && semiRound}
	<div class="mb-24 animate-fade-in space-y-12 font-sans select-none">
		<div class="flex flex-col items-center gap-2 px-2 text-center">
			<h3 class="font-display text-3xl font-black tracking-normal text-foreground">
				Champions arena
			</h3>
			<p class="text-[10px] font-black tracking-wider text-foreground/35 uppercase">
				Final placements & podium
			</p>
		</div>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each divisionsList as div}
				{@const divSemis = semiRound.matches.filter((m) => {
					const p1 = players.find((p) => p.id === m.team1[0].id);
					return (p1 as any)?.division === div;
				})}

				{@const divFinal = finalRound?.matches.find((m) => {
					const p1 = players.find((p) => p.id === m.team1[0].id);
					return (p1 as any)?.division === div;
				})}

				{@const gold = divFinal && isCompleted(divFinal) ? getWinner(divFinal) : null}
				{@const silver = divFinal && isCompleted(divFinal) ? getLoser(divFinal) : null}

				{@const semiLosers = divSemis.filter(isCompleted).map(getLoser)}
				{@const playoffPlacements = (() => {
					let third = null;
					let fourth = null;
					if (semiLosers.length > 0) {
						const sortedByLeague = [...semiLosers].sort((a, b) => {
							const rankA = ts.leaderboard.find((p) => p.id === a[0].id)?.currentRank || 999;
							const rankB = ts.leaderboard.find((p) => p.id === b[0].id)?.currentRank || 999;
							return rankA - rankB;
						});
						third = sortedByLeague[0];
						fourth = sortedByLeague[1];
					}
					return { third, fourth };
				})()}

				<GlassCard
					variant="premium"
					padding="none"
					class={cn('overflow-hidden ring-1 ring-border', divColors[div])}
				>
					<div
						class="flex items-center justify-between border-b border-border bg-foreground/5 p-6 font-display"
					>
						<span class="text-[10px] font-black tracking-wider text-foreground/45 uppercase"
							>DIVISION {div}</span
						>
						{#if divFinal && isCompleted(divFinal)}
							<span
								class="rounded-lg border border-success/20 bg-success/10 px-3 py-1 text-[9px] font-black tracking-wider text-success uppercase"
							>
								FINALIZED
							</span>
						{/if}
					</div>

					<div class="space-y-8 p-8">
						<!-- Gold -->
						<div class="flex items-center gap-6" in:fade={{ delay: 100 }}>
							<div class="relative">
								<div
									class="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-[#FFD700]/30 bg-[#FFD700]/15"
								>
									<span class="text-3xl">🥇</span>
								</div>
								<div
									class="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-lg border-4 border-background bg-[#FFD700]"
								>
									<span class="text-[8px] font-black text-black">1</span>
								</div>
							</div>
							<div class="min-w-0 font-display">
								<p
									class="mb-2 text-[9px] leading-none font-black tracking-wider text-[#FFD700]/70 uppercase"
								>
									CHAMPION
								</p>
								<h4
									class={cn(
										'truncate text-xl font-black tracking-normal text-foreground',
										!gold && 'text-foreground/10'
									)}
								>
									{gold ? gold.map((p: any) => p.name).join(' / ') : 'TBD'}
								</h4>
							</div>
						</div>

						<!-- Silver -->
						<div class="flex items-center gap-6" in:fade={{ delay: 200 }}>
							<div class="relative">
								<div
									class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-foreground/20 bg-foreground/10"
								>
									<span class="text-2xl">🥈</span>
								</div>
								<div
									class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-md border-2 border-background bg-foreground"
								>
									<span class="text-[8px] font-black text-black">2</span>
								</div>
							</div>
							<div class="min-w-0 font-display">
								<p
									class="mb-1 text-[9px] leading-none font-black tracking-wider text-foreground/45 uppercase"
								>
									RUNNER UP
								</p>
								<h4
									class={cn(
										'truncate text-base font-black tracking-normal text-foreground/90',
										!silver && 'text-foreground/10'
									)}
								>
									{silver ? silver.map((p: any) => p.name).join(' / ') : 'TBD'}
								</h4>
							</div>
						</div>

						<!-- Third Place -->
						<div class="flex items-center gap-6" in:fade={{ delay: 300 }}>
							<div class="relative">
								<div
									class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#FF9500]/25 bg-[#FF9500]/10"
								>
									<span class="text-2xl">🥉</span>
								</div>
								<div
									class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-md border-2 border-background bg-[#FF9500]"
								>
									<span class="text-[8px] font-black text-black">3</span>
								</div>
							</div>
							<div class="min-w-0 font-display">
								<p
									class="mb-1 text-[9px] leading-none font-black tracking-wider text-[#FF9500]/70 uppercase"
								>
									THIRD PLACE
								</p>
								<h4
									class={cn(
										'truncate text-base font-black tracking-normal text-foreground/80',
										!playoffPlacements.third && 'text-foreground/10'
									)}
								>
									{playoffPlacements.third
										? playoffPlacements.third.map((p: any) => p.name).join(' / ')
										: 'TBD'}
								</h4>
							</div>
						</div>

						<!-- Fourth Place -->
						<div class="flex items-center gap-6 opacity-40 grayscale" in:fade={{ delay: 400 }}>
							<div
								class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-foreground/5"
							>
								<span class="text-xs font-black text-foreground/20">4</span>
							</div>
							<div class="min-w-0 font-display">
								<p
									class="mb-1 text-[9px] leading-none font-black tracking-wider text-foreground/25 uppercase"
								>
									FOURTH PLACE
								</p>
								<h4 class="truncate text-sm font-black tracking-normal text-foreground/60">
									{playoffPlacements.fourth
										? playoffPlacements.fourth.map((p: any) => p.name).join(' / ')
										: 'TBD'}
								</h4>
							</div>
						</div>
					</div>
				</GlassCard>
			{/each}
		</div>
	</div>
{/if}

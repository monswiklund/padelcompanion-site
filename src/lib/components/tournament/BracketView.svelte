<script lang="ts">
	import { tournament } from '$lib/stores/tournament.svelte';
	import { cn } from '$lib/shared/utils';
	import { fade } from 'svelte/transition';
	import { getRoundName } from '$lib/tournament/bracket/bracketGeneration';

	const ts = $derived(tournament.state);
	const bracket = $derived(ts.bracket);
	const matches = $derived(bracket?.matches || []);
	const numRounds = $derived(bracket?.numRounds || 0);

	const rounds = $derived.by(() => {
		const r = [];
		for (let i = 1; i <= numRounds; i++) {
			r.push({
				number: i,
				name: getRoundName(i, numRounds),
				matches: matches.filter((m) => m.round === i)
			});
		}
		return r;
	});

	function handleResult(matchId: number, score1: number, score2: number) {
		tournament.updateBracketResult(matchId, score1, score2);
	}

	function getMatchWinner(match: any) {
		if (match.score1 == null || match.score2 == null) return null;
		return match.score1 > match.score2 ? 1 : 2;
	}
</script>

<div class="custom-scrollbar animate-fade-in overflow-x-auto pb-24 font-sans select-none">
	<div class="inline-flex min-w-full items-stretch gap-8 p-4">
		{#each rounds as round, rIdx}
			<div
				class="flex w-64 shrink-0 flex-col gap-6"
				transition:fade={{ duration: 250, delay: rIdx * 60 }}
			>
				<!-- Round Header -->
				<div class="flex flex-col items-center gap-2">
					<h3 class="font-display text-xl leading-none font-black tracking-normal text-foreground uppercase">
						{round.name}
					</h3>
					<div
						class="h-0.5 w-8 rounded-full bg-foreground/20 transition-colors group-hover:bg-accent"
					></div>
				</div>

				<!-- Matches Column with vertical alignment centering -->
				<div class="flex flex-1 flex-col justify-around gap-5 py-4">
					{#each round.matches as match, mIdx (match.id)}
						{@const winner = getMatchWinner(match)}
						<div class="group relative">
							<div
								class={cn(
									'overflow-hidden rounded-xl border transition-all duration-200 relative z-30',
									match.completed
										? 'border-white/5 bg-white/[0.01] opacity-50'
										: 'border-white/10 bg-[#161b22]/90 group-hover:border-white/20'
								)}
							>
								<!-- Team 1 -->
								<div
									class={cn(
										'flex items-center justify-between gap-4 border-b border-white/5 p-3.5 px-4.5 transition-all',
										winner === 1 ? 'bg-white/5' : 'bg-transparent'
									)}
								>
									<div class="flex min-w-0 items-center gap-3">
										<span class="text-[9px] font-black tracking-wider text-white/25 uppercase"
											>S1</span
										>
										<span
											class={cn(
												'text-sm leading-snug font-bold tracking-normal break-words',
												winner === 1 ? 'text-[#007AFF]' : 'text-white'
											)}
										>
											{match.team1Name || 'TBD'}
										</span>
									</div>
									<input
										type="number"
										inputmode="numeric"
										min="0"
										enterkeyhint="done"
										class="h-9 w-11 [appearance:textfield] rounded-md border border-white/10 bg-black/40 text-center text-base font-black text-white transition-all outline-none focus:border-[#007AFF] focus:bg-[#007AFF]/5 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
										value={match.score1 ?? ''}
										oninput={(e) => {
											const s1 = parseInt((e.target as HTMLInputElement).value);
											const s2 = match.score2 || 0;
											if (!isNaN(s1)) handleResult(match.id, s1, s2);
										}}
									/>
								</div>

								<!-- Team 2 -->
								<div
									class={cn(
										'flex items-center justify-between gap-4 p-3.5 px-4.5 transition-all',
										winner === 2 ? 'bg-white/5' : 'bg-transparent'
									)}
								>
									<div class="flex min-w-0 items-center gap-3">
										<span class="text-[9px] font-black tracking-wider text-white/25 uppercase"
											>S2</span
										>
										<span
											class={cn(
												'text-sm leading-snug font-bold tracking-normal break-words',
												winner === 2 ? 'text-[#007AFF]' : 'text-white'
											)}
										>
											{match.team2Name || 'TBD'}
										</span>
									</div>
									<input
										type="number"
										inputmode="numeric"
										min="0"
										enterkeyhint="done"
										class="h-9 w-11 [appearance:textfield] rounded-md border border-white/10 bg-black/40 text-center text-base font-black text-white transition-all outline-none focus:border-[#007AFF] focus:bg-[#007AFF]/5 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
										value={match.score2 ?? ''}
										oninput={(e) => {
											const s2 = parseInt((e.target as HTMLInputElement).value);
											const s1 = match.score1 || 0;
											if (!isNaN(s2)) handleResult(match.id, s1, s2);
										}}
									/>
								</div>
							</div>

							<!-- Tree Connector Bracket Lines -->
							{#if rIdx < rounds.length - 1}
								{@const verticalHeight = Math.pow(2, rIdx) * 62}
								<!-- Horizontal exit line -->
								<div
									class="absolute top-1/2 -right-4 h-[2px] w-4 bg-white/10 transition-colors group-hover:bg-[#007AFF]/30 z-10"
								></div>

								<!-- Vertical connecting branch -->
								<div
									class={cn(
										'absolute w-[2px] bg-white/10 transition-colors group-hover:bg-[#007AFF]/30 -right-4 z-10',
										mIdx % 2 === 0 ? 'top-1/2' : 'bottom-1/2'
									)}
									style="height: {verticalHeight}px;"
								></div>

								<!-- Midpoint horizontal merge line (only drawn on top card of each pair) -->
								{#if mIdx % 2 === 0}
									<div
										class="absolute h-[2px] w-4 bg-white/10 transition-colors group-hover:bg-[#007AFF]/30 -right-8 z-10"
										style="top: calc(50% + {verticalHeight}px);"
									></div>
								{/if}
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		height: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: var(--border, rgba(255, 255, 255, 0.12));
		border-radius: 10px;
	}
</style>

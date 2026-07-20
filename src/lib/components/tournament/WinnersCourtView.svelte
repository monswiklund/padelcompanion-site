<script lang="ts">
	import { tournament } from '$lib/stores/tournament.svelte';
	import { cn } from '$lib/shared/utils';
	import { fade, scale } from 'svelte/transition';

	const ts = $derived(tournament.state);
	const winnersCourt = $derived(ts.winnersCourt);
	const sides = $derived(winnersCourt?.sides || {});
	const poolIds = $derived(Object.keys(sides).sort());

	function handleResult(side: string, courtIdx: number, winner: 1 | 2) {
		tournament.updateWinnersCourtResult(side, courtIdx, winner);
	}

	function handleAdvance(side: string) {
		tournament.advanceWinnersCourt(side);
	}

	function isSideComplete(side: string) {
		return sides[side]?.courts.every((c: any) => c.winner !== null);
	}
</script>

<div class="animate-fade-in space-y-10 pb-20 font-sans select-none md:space-y-12">
	{#each poolIds as side}
		{@const sideState = sides[side]}
		<div class="space-y-6" transition:fade={{ duration: 250 }}>
			<!-- Pool Header -->
			<div class="flex items-center justify-between border-b border-border/40 pb-4">
				<div class="flex items-center gap-4">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-md bg-foreground text-xl font-black text-background shadow-sm"
					>
						{side}
					</div>
					<div class="space-y-0.5">
						<h3 class="font-display text-lg leading-none font-black tracking-normal text-foreground md:text-xl">
							Round {sideState.round}
						</h3>
						<p class="text-[10px] font-black tracking-wider text-foreground/35 uppercase">
							Winners move up, losers move down
						</p>
					</div>
				</div>

				{#if isSideComplete(side)}
					<div in:scale={{ duration: 250 }}>
						<button
							type="button"
							class="cursor-pointer rounded-md bg-foreground px-4 py-2 font-display text-xs font-black tracking-wider text-background uppercase shadow-sm transition-all active:scale-95"
							onclick={() => handleAdvance(side)}
						>
							ADVANCE TO ROUND {sideState.round + 1}
						</button>
					</div>
				{/if}
			</div>

			<!-- Courts Grid -->
			<div class="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
				{#each sideState.courts as court, cIdx}
					<div class="flex flex-col space-y-2 py-4">
						<div
							class="flex items-center justify-between px-1 text-[10px] font-black tracking-wider text-foreground/35 uppercase"
						>
							<span>ARENA {court.id}</span>
							{#if court.winner}
								<span class="flex items-center gap-1.5 tracking-wider text-[#34C759] uppercase">
									<div class="h-1 w-1 rounded-full bg-[#34C759]"></div>
									SET
								</span>
							{/if}
						</div>

						<div class="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
							<!-- Team 1 -->
							<button
								class={cn(
									'group/team relative flex w-full cursor-pointer flex-col justify-center overflow-hidden rounded-md border p-3 text-right transition-all',
									court.winner === 1
										? 'border-foreground bg-foreground text-background shadow-sm'
										: 'border-border bg-foreground/[0.03] text-foreground/75 hover:border-foreground/25 hover:bg-foreground/[0.06]'
								)}
								onclick={() => handleResult(side, cIdx, 1)}
							>
								<span
									class={cn(
										'mb-1 text-[10px] font-black tracking-wider uppercase',
										court.winner === 1 ? 'text-background/40' : 'text-foreground/25'
									)}>ALPHA</span
								>
								<span class="block w-full text-sm font-bold tracking-normal break-words">
									{court.team1.map((p: any) => p.name).join(' / ')}
								</span>
							</button>

							<!-- VS Divider (Middle) -->
							<div class="flex items-center justify-center px-1">
								<span
									class="text-[10px] font-black tracking-wider text-foreground/20 uppercase"
									>VS</span
								>
							</div>

							<!-- Team 2 -->
							<button
								class={cn(
									'group/team relative flex w-full cursor-pointer flex-col justify-center overflow-hidden rounded-md border p-3 text-left transition-all',
									court.winner === 2
										? 'border-foreground bg-foreground text-background shadow-sm'
										: 'border-border bg-foreground/[0.03] text-foreground/75 hover:border-foreground/25 hover:bg-foreground/[0.06]'
								)}
								onclick={() => handleResult(side, cIdx, 2)}
							>
								<span
									class={cn(
										'mb-1 text-[10px] font-black tracking-wider uppercase',
										court.winner === 2 ? 'text-background/40' : 'text-foreground/25'
									)}>BRAVO</span
								>
								<span
									class="block w-full text-left text-sm font-bold tracking-normal break-words"
								>
									{court.team2.map((p: any) => p.name).join(' / ')}
								</span>
							</button>
						</div>
					</div>
				{/each}

				<!-- Queue Section -->
				{#if sideState.queue.length > 0}
					<div class="flex flex-col items-center justify-center space-y-3 py-6 text-center">
						<div class="space-y-0.5">
							<h4 class="text-xs font-black tracking-wider text-foreground/30 uppercase">
								STANDBY POOL
							</h4>
							<p class="text-[10px] tracking-wider text-foreground/20 uppercase">
								Next round rotation
							</p>
						</div>
						<div
							class="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-bold tracking-normal text-foreground/55"
						>
							{#each sideState.queue as p, qIdx}
								{#if qIdx > 0}
									<span class="text-foreground/15">•</span>
								{/if}
								<span>{p.name}</span>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>

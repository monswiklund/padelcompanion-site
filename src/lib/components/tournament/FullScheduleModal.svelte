<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { Dialog } from 'bits-ui';
	import { tournament } from '$lib/stores/tournament.svelte';
	import { formatEstimatedRoundStart } from '$lib/tournament/ui/components/scheduleTiming';
	import { getCourtDisplayName } from '$lib/tournament/courtNames';
	import { getDivisionColor } from '$lib/tournament/core/constants';
	import { tick } from 'svelte';
	import { cn } from '$lib/shared/utils';
	import GlassCard from '../ui/GlassCard.svelte';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
	}

	const { isOpen, onClose }: Props = $props();

	const ts = $derived(tournament.state);
	const schedule = $derived(ts.schedule);
	const allRounds = $derived(ts.allRounds);

	let containerEl: HTMLDivElement | null = $state(null);
	let liveRowEl: HTMLDivElement | null = $state(null);

	const fullSchedule = $derived.by(() => {
		const mergedRounds = schedule.map((round) => ({ ...round }));
		if (!allRounds) return mergedRounds;

		allRounds.forEach((round, index) => {
			if (!mergedRounds[index]) {
				mergedRounds[index] = { ...round };
			}
		});

		return mergedRounds;
	});

	$effect(() => {
		if (isOpen) {
			tick().then(() => {
				setTimeout(() => {
					if (liveRowEl && containerEl) {
						liveRowEl.scrollIntoView({
							behavior: 'smooth',
							block: 'center'
						});
					}
				}, 120);
			});
		}
	});

	function getCourtName(courtNum: number, division?: string | null) {
		return getCourtDisplayName(ts, courtNum, division);
	}

	function getDivisionStyles(division: string) {
		const colors = getDivisionColor(ts.divisions || [], division);
		return `${colors.bg} ${colors.text} ${colors.border}`;
	}

	// Svelte action to capture live-round element refs
	function refLiveRow(node: HTMLDivElement, isCur: boolean) {
		if (isCur) liveRowEl = node;
		return {
			update(newIsCur: boolean) {
				if (newIsCur) liveRowEl = node;
			}
		};
	}
</script>

<Dialog.Root open={isOpen} onOpenChange={(v) => !v && onClose()}>
	<Dialog.Portal>
		<Dialog.Overlay forceMount>
			{#snippet child({ props, open: isModalOpen })}
				{#if isModalOpen}
					<div
						{...props}
						transition:fade={{ duration: 200 }}
						class="fixed inset-0 z-[900] bg-background/80 backdrop-blur-md"
					></div>
				{/if}
			{/snippet}
		</Dialog.Overlay>

		<Dialog.Content forceMount>
			{#snippet child({ props, open: isModalOpen })}
				{#if isModalOpen}
					<div
						{...props}
						transition:scale={{ duration: 220, start: 0.97, opacity: 0 }}
						class="fixed top-1/2 left-1/2 z-[901] w-full max-w-[90vw] -translate-x-1/2 -translate-y-1/2 px-4 lg:max-w-7xl"
					>
						<GlassCard
							variant="premium"
							padding="none"
							class="flex max-h-[90dvh] flex-col overflow-hidden shadow-lg ring-1 ring-border"
						>
							<!-- Header -->
							<div class="flex shrink-0 items-center justify-between border-b border-border p-6">
								<div class="space-y-1">
									<Dialog.Title
										class="m-0 font-display text-2xl font-black tracking-normal text-foreground"
									>
										Tournament schedule
									</Dialog.Title>
									<p class="text-[10px] font-black tracking-wider text-accent uppercase">
										Full event timeline
									</p>
								</div>
								<Dialog.Close
									class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-foreground/5 text-foreground/40 transition-all hover:bg-foreground/10 hover:text-foreground"
								>
									<span class="text-lg">✕</span>
								</Dialog.Close>
							</div>

							<!-- Content -->
							<div
								bind:this={containerEl}
								class="custom-scrollbar flex-1 space-y-5 overflow-y-auto p-6"
							>
								{#each fullSchedule as round, rIdx}
									{@const isPlayed = rIdx < schedule.length}
									{@const currentScheduleRound = schedule[rIdx]}
									{@const isCurrent =
										!!currentScheduleRound &&
										rIdx === schedule.length - 1 &&
										!currentScheduleRound.completed}
									{@const activeRound = isPlayed ? schedule[rIdx] : null}

									<div
										use:refLiveRow={isCurrent}
										class={cn(
											'rounded-card border p-5 transition-all duration-200',
											isCurrent
												? 'border-accent bg-accent/[0.03] ring-1 ring-accent/15'
												: isPlayed
													? 'border-border bg-foreground/[0.01]'
													: 'border-border bg-foreground/[0.01] opacity-30 grayscale'
										)}
									>
										<div class="mb-5 flex items-center justify-between gap-4">
											<div class="flex items-center gap-6">
												<span
													class={cn(
														'font-display text-xl font-black tracking-normal',
														isCurrent ? 'text-accent' : 'text-foreground'
													)}
												>
													{round.name || `Round ${round.number}`}
												</span>
												<div class="flex items-center gap-2">
													<span class="h-1.5 w-1.5 rounded-full bg-foreground/20"></span>
													<span
														class="text-[10px] font-black tracking-wider text-foreground/45 uppercase"
													>
														{isPlayed && activeRound?.durationSeconds
															? `${Math.round(activeRound.durationSeconds / 60)} MIN`
															: `EST: ${formatEstimatedRoundStart(ts, rIdx)}`}
													</span>
												</div>
											</div>

											<div class="flex items-center gap-4">
												{#if isCurrent}
													<div
														class="flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/10 px-3 py-1.5"
													>
														<div class="h-1.5 w-1.5 rounded-full bg-accent"></div>
														<span
															class="text-[10px] font-black tracking-wider text-accent uppercase"
															>LIVE NOW</span
														>
													</div>
												{:else if isPlayed}
													<span
														class="rounded-lg border border-success/10 bg-success/10 px-3 py-1.5 text-[10px] font-black tracking-wider text-success uppercase"
													>
														COMPLETED
													</span>
												{:else}
													<span
														class="rounded-lg border border-border bg-foreground/5 px-3 py-1.5 text-[10px] font-black tracking-wider text-foreground/25 uppercase"
													>
														UPCOMING
													</span>
												{/if}
											</div>
										</div>

										<!-- Matches Grid -->
										<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
											{#each round.matches as match, mIdx}
												{@const playedMatch = activeRound?.matches[mIdx]}
												{@const hasScores =
													playedMatch?.score1 != null && playedMatch?.score2 != null}
												{@const matchDivision = (match.team1[0] as any)?.division || 'A'}

												<div
													class="group rounded-xl border border-border bg-card/60 p-4 transition-all hover:bg-foreground/5"
												>
													<div class="mb-4 flex items-center justify-between">
														<span
															class="text-[9px] font-black tracking-wider text-foreground/25 uppercase transition-colors group-hover:text-foreground/45"
														>
															{getCourtName(match.court, matchDivision)}
														</span>
														{#if ts.format === 'division'}
															<span
																class={cn(
																	'rounded-md border px-2 py-0.5 text-[8px] font-black tracking-wider uppercase',
																	getDivisionStyles(matchDivision)
																)}
															>
																DIV {matchDivision}
															</span>
														{/if}
													</div>

													<div class="flex items-center justify-between gap-4 font-display">
														<div class="min-w-0 flex-1 text-center">
															<span
																class="block truncate text-[11px] font-bold tracking-normal text-foreground"
															>
																{match.team1.map((p) => p.name).join(' / ')}
															</span>
														</div>

														<div class="shrink-0">
															{#if hasScores}
																<div
																	class="flex items-center gap-2 rounded-xl border border-border bg-foreground/5 px-3 py-1"
																>
																	<span
																		class={cn(
																			'text-xs font-black tabular-nums',
																			playedMatch.score1! > playedMatch.score2!
																				? 'text-success'
																				: playedMatch.score1! < playedMatch.score2!
																					? 'text-[#FF3B30]'
																					: 'text-foreground/40'
																		)}>{playedMatch.score1}</span
																	>
																	<span class="text-[10px] font-black text-foreground/20">-</span>
																	<span
																		class={cn(
																			'text-xs font-black tabular-nums',
																			playedMatch.score2! > playedMatch.score1!
																				? 'text-success'
																				: playedMatch.score2! < playedMatch.score1!
																					? 'text-[#FF3B30]'
																					: 'text-foreground/40'
																		)}>{playedMatch.score2}</span
																	>
																</div>
															{:else}
																<span
																	class="text-[10px] font-black tracking-wider text-foreground/20 uppercase"
																	>VS</span
																>
															{/if}
														</div>

														<div class="min-w-0 flex-1 text-center">
															<span
																class="block truncate text-[11px] font-bold tracking-normal text-foreground/45 transition-colors group-hover:text-foreground/65"
															>
																{match.team2.map((p) => p.name).join(' / ')}
															</span>
														</div>
													</div>
												</div>
											{/each}
										</div>
									</div>
								{/each}
							</div>

							<!-- Footer -->
							<div
								class="flex shrink-0 justify-center border-t border-border bg-foreground/[0.01] p-5"
							>
								<Dialog.Close>
									<button
										class="text-[10px] font-black tracking-wider text-foreground/35 uppercase transition-colors hover:text-foreground"
									>
										CLOSE SCHEDULE
									</button>
								</Dialog.Close>
							</div>
						</GlassCard>
					</div>
				{/if}
			{/snippet}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 2px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: var(--border, rgba(0, 0, 0, 0.1));
		border-radius: 10px;
	}
</style>

<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { Dialog } from 'bits-ui';
	import { tournament } from '$lib/stores/tournament.svelte';
	import { getCourtDisplayName } from '$lib/tournament/courtNames';
	import { cn } from '$lib/shared/utils';
	import GlassCard from '../ui/GlassCard.svelte';

	interface Props {
		playerId: string;
		playerName: string;
		isOpen: boolean;
		onClose: () => void;
	}

	const { playerId, playerName, isOpen, onClose }: Props = $props();

	const ts = $derived(tournament.state);
	const schedule = $derived(ts.schedule);

	// Find all matches for this player
	const playerMatches = $derived(
		schedule.flatMap((round, roundIdx) =>
			round.matches
				.map((match, matchIdx) => ({
					...match,
					roundName: round.name || `Round ${round.number}`,
					roundIdx,
					matchIdx
				}))
				.filter(
					(match) =>
						match.team1.some((p) => p.id === playerId) || match.team2.some((p) => p.id === playerId)
				)
		)
	);

	function getMatchResult(match: any) {
		if (match.score1 == null || match.score2 == null) return 'upcoming';

		const isTeam1 = match.team1.some((p: any) => p.id === playerId);
		const playerScore = isTeam1 ? match.score1 : match.score2;
		const opponentScore = isTeam1 ? match.score2 : match.score1;

		if (playerScore > opponentScore) return 'win';
		if (playerScore < opponentScore) return 'loss';
		return 'draw';
	}

	const resultColors = {
		win: 'bg-success/10 text-success border-success/20',
		loss: 'bg-[#FF3B30]/10 text-[#FF3B30] border-[#FF3B30]/20',
		draw: 'bg-[#FF9500]/10 text-[#FF9500] border-[#FF9500]/20',
		upcoming: 'bg-foreground/5 text-foreground/30 border-border'
	};

	const resultLabels = {
		win: 'WIN',
		loss: 'LOSS',
		draw: 'DRAW',
		upcoming: 'UPCOMING'
	};
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
						class="fixed top-1/2 left-1/2 z-[901] w-full max-w-xl -translate-x-1/2 -translate-y-1/2 px-4"
					>
						<GlassCard
							variant="premium"
							padding="none"
							class="overflow-hidden shadow-lg ring-1 ring-border"
						>
							<!-- Header -->
							<div class="flex items-center justify-between border-b border-border p-6">
								<div class="space-y-1">
									<Dialog.Title
										class="m-0 font-display text-2xl font-black tracking-normal text-foreground"
									>
										Match history
									</Dialog.Title>
									<p class="text-[10px] font-black tracking-wider text-accent uppercase">
										{playerName}
									</p>
								</div>
								<Dialog.Close
									class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-foreground/5 text-foreground/40 transition-all hover:bg-foreground/10 hover:text-foreground"
								>
									<span class="text-lg">✕</span>
								</Dialog.Close>
							</div>

							<!-- List -->
							<div class="custom-scrollbar max-h-[60dvh] space-y-4 overflow-y-auto p-6">
								{#if playerMatches.length === 0}
									<div class="py-20 text-center">
										<p
											class="text-[10px] font-black tracking-wider text-muted-foreground uppercase"
										>
											No battle data recorded
										</p>
									</div>
								{:else}
									{#each playerMatches as match}
										{@const result = getMatchResult(match)}
										{@const isTeam1 = match.team1.some((p) => p.id === playerId)}
										{@const opponent = isTeam1 ? match.team2 : match.team1}
										{@const playerScore = isTeam1 ? match.score1 : match.score2}
										{@const opponentScore = isTeam1 ? match.score2 : match.score1}
										{@const matchDivision =
											ts.format === 'division' ? (match.team1[0] as any)?.division || 'A' : null}

										<div
											class="group space-y-4 rounded-xl border border-border bg-card/60 p-5 transition-all hover:bg-foreground/5"
										>
											<div class="flex items-center justify-between">
												<span
													class="text-[9px] font-black tracking-wider text-foreground/35 uppercase transition-colors group-hover:text-foreground/55"
												>
													{match.roundName} · {getCourtDisplayName(ts, match.court, matchDivision)}
												</span>
												<span
													class={cn(
														'rounded-lg border px-3 py-1 text-[8px] font-black tracking-wider uppercase transition-all',
														resultColors[result]
													)}
												>
													{resultLabels[result]}
												</span>
											</div>

											<div class="flex items-center justify-between gap-6">
												<div class="flex-1 text-center font-display">
													<p class="text-xs font-black tracking-normal text-foreground">
														{playerName}
													</p>
												</div>

												<div class="flex shrink-0 items-center gap-4">
													{#if playerScore != null && opponentScore != null}
														<div
															class="flex items-center gap-4 rounded-xl border border-border bg-foreground/5 px-5 py-2"
														>
															<span
																class={cn(
																	'text-xl font-black tabular-nums',
																	playerScore > opponentScore
																		? 'text-success'
																		: playerScore < opponentScore
																			? 'text-[#FF3B30]'
																			: 'text-foreground/40'
																)}>{playerScore}</span
															>
															<span class="font-black text-foreground/20">-</span>
															<span
																class={cn(
																	'text-xl font-black tabular-nums',
																	opponentScore > playerScore
																		? 'text-success'
																		: opponentScore < playerScore
																			? 'text-[#FF3B30]'
																			: 'text-foreground/40'
																)}>{opponentScore}</span
															>
														</div>
													{:else}
														<span
															class="text-[10px] font-black tracking-wider text-foreground/25 uppercase"
															>WAITING</span
														>
													{/if}
												</div>

												<div class="flex-1 text-center font-display">
													<p
														class="truncate text-xs font-black tracking-normal text-foreground/45 transition-colors group-hover:text-foreground/65"
													>
														{opponent.map((p) => p.name).join(' / ')}
													</p>
												</div>
											</div>
										</div>
									{/each}
								{/if}
							</div>

							<!-- Footer -->
							<div class="flex justify-center border-t border-border bg-foreground/[0.01] p-5">
								<Dialog.Close>
									<button
										class="text-[10px] font-black tracking-wider text-foreground/35 uppercase transition-colors hover:text-foreground"
									>
										CLOSE RECORD
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
		background: rgba(255, 255, 255, 0.1);
		border-radius: 10px;
	}
</style>

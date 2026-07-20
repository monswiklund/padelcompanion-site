<script lang="ts">
	import TournamentNav from '$lib/components/tournament/TournamentNav.svelte';
	import TournamentIdentity from '$lib/components/tournament/TournamentIdentity.svelte';
	import PlayerList from '$lib/components/tournament/PlayerList.svelte';
	import TournamentActiveView from '$lib/components/tournament/TournamentActiveView.svelte';
	import HistorySection from '$lib/components/tournament/HistorySection.svelte';
	import GlassCard from '$lib/components/ui/GlassCard.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Icons from '$lib/components/Icons.svelte';

	import { tournament } from '$lib/stores/tournament.svelte';
	import { generateSchedule } from '$lib/tournament/ui/setup/scheduleGeneration';
	import { createId } from '$lib/shared/utils';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	const tsState = $derived(tournament.state);
	const isLocked = $derived(tsState.isLocked);
	const playerCount = $derived(tsState.players.length);
	const isReadyToGenerate = $derived(playerCount >= 4);

	let activeStep = $state<1 | 2 | 3>(1);

	$effect(() => {
		if (isLocked) {
			activeStep = 3;
		} else if (activeStep === 3) {
			activeStep = 1;
		}
	});

	function handleAddPlayer(name: string) {
		tournament.addPlayer({ id: createId(), name, lockedCourt: null });
	}

	function handleRemovePlayer(index: number) {
		const player = tsState.players[index];
		if (player) tournament.removePlayer(player.id);
	}

	function handleClearPlayers() {
		tournament.clearPlayers();
	}

	function handleImportPlayers(text: string) {
		const names = text
			.split('\n')
			.map((n) => n.trim())
			.filter(Boolean);
		names.forEach((name) => {
			tournament.addPlayer({ id: createId(), name, lockedCourt: null });
		});
	}

	function handleSliderChange(val: number) {
		const currentCount = tsState.players.length;
		if (val > currentCount) {
			const diff = val - currentCount;
			for (let i = 0; i < diff; i++) {
				const nextNum = currentCount + i + 1;
				tournament.addPlayer({
					id: createId(),
					name: `Player ${nextNum}`,
					lockedCourt: null
				});
			}
		} else if (val < currentCount) {
			const diff = currentCount - val;
			for (let i = 0; i < diff; i++) {
				const lastPlayer = tsState.players[tsState.players.length - 1];
				if (lastPlayer) {
					tournament.removePlayer(lastPlayer.id);
				}
			}
		}
	}

	async function handleGenerate() {
		await generateSchedule();
	}

	onMount(() => {
		tournament.initForFormat('bracket');
		window.scrollTo({ top: 0, behavior: 'instant' });
	});
</script>

<svelte:head>
	<title>Bracket Tournament | Padel Companion</title>
	<meta
		name="description"
		content="Create padel bracket tournaments with seeded matches, live scoring, and standings."
	/>
	<link rel="canonical" href="https://padelcompanion.se/tournament/bracket/" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://padelcompanion.se/tournament/bracket/" />
	<meta property="og:title" content="Bracket Tournament | Padel Companion" />
	<meta property="og:description" content="Create padel bracket tournaments." />
	<meta property="og:image" content="https://padelcompanion.se/assets/app-icon.jpeg" />
</svelte:head>

<div class="noise relative min-h-dvh overflow-x-clip bg-background pb-12 font-sans text-foreground">
	<TournamentNav />

	<div class="relative z-10 container mx-auto max-w-[1280px] px-3 pt-2 sm:px-4 2xl:max-w-[1380px]">
		{#if isLocked}
			<div transition:fade={{ duration: 180 }}>
				<TournamentActiveView />
			</div>
		{:else}
			<!-- Setup Mode: beautiful unified tabbed card matching mockup design -->
			<div transition:fade={{ duration: 250 }} class="mx-auto max-w-2xl space-y-4 pt-6">
				<!-- Header section -->
				<div class="mb-6 text-center">
					<span
						class="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#007AFF]/20 bg-[#007AFF]/5 px-3 py-1 text-[10px] font-black tracking-wider text-[#007AFF] uppercase"
					>
						<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-[#007AFF]"></span>
						Tournament Setup
					</span>
					<h1 class="font-display text-3xl font-black tracking-tight text-white uppercase">
						{tsState.tournamentName || 'BRACKET SETUP'}
					</h1>
					{#if tsState.tournamentNotes}
						<p class="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
							{tsState.tournamentNotes}
						</p>
					{/if}
				</div>

				<GlassCard
					variant="premium"
					padding="none"
					class="relative w-full overflow-hidden border border-white/10 shadow-2xl"
				>
					<!-- Background accent glow -->
					<div
						class="pointer-events-none absolute -top-20 -right-20 -z-10 h-64 w-64 rounded-full bg-[#007AFF]/5 blur-[80px]"
					></div>

					<!-- Tabs Header -->
					<div class="flex border-b border-white/5 bg-white/[0.01]">
						<button
							type="button"
							onclick={() => (activeStep = 1)}
							class="flex-1 cursor-pointer border-b-2 py-4 text-center text-xs font-black tracking-wider uppercase transition-all select-none
								{activeStep === 1
								? 'border-[#007AFF] bg-white/[0.02] text-[#007AFF]'
								: 'border-transparent text-[#a7b0b8] hover:text-[#f5f7f8]'}"
						>
							<span class="mr-1.5 opacity-50">1.</span>
							Settings
						</button>
						<button
							type="button"
							onclick={() => (activeStep = 2)}
							class="flex-1 cursor-pointer border-b-2 py-4 text-center text-xs font-black tracking-wider uppercase transition-all select-none
								{activeStep === 2
								? 'border-[#007AFF] bg-white/[0.02] text-[#007AFF]'
								: 'border-transparent text-[#a7b0b8] hover:text-[#f5f7f8]'}"
						>
							<span class="mr-1.5 opacity-50">2.</span>
							Players
						</button>
						<button
							type="button"
							disabled
							class="flex-1 cursor-not-allowed border-b-2 border-transparent py-4 text-center text-xs font-black tracking-wider text-[#a7b0b8]/30 uppercase transition-all select-none"
						>
							<span class="mr-1.5 opacity-30">3.</span>
							Match Schedule
						</button>
					</div>

					<!-- Tab Content area -->
					<div class="flex min-h-[380px] flex-col justify-between gap-8 p-6 md:p-8">
						{#if activeStep === 1}
							<div in:fade={{ duration: 180 }} class="space-y-6 text-left">
								<!-- Tournament Name Field -->
								<div class="flex flex-col gap-2">
									<label
										for="t-name"
										class="text-[10px] font-black tracking-wider text-muted-foreground uppercase"
										>Tournament Name</label
									>
									<input
										type="text"
										id="t-name"
										value={tsState.tournamentName || 'Pro Cup'}
										oninput={(e) =>
											tournament.updateField(
												'tournamentName',
												(e.target as HTMLInputElement).value
											)}
										class="min-h-[48px] w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-base text-[#f5f7f8] transition-colors placeholder:text-white/20 focus:border-[#007AFF] focus:outline-none"
										placeholder="Enter tournament name..."
									/>
								</div>

								<!-- Settings Grid -->
								<div class="grid grid-cols-1 gap-4">
									<!-- Bracket Size -->
									<div class="flex flex-col gap-2">
										<span
											class="text-[10px] font-black tracking-wider text-muted-foreground uppercase"
											>Bracket Size</span
										>
										<div
											class="flex min-h-[48px] items-center justify-between rounded-xl border border-white/10 bg-black/30 px-2 py-2.5"
										>
											<span class="text-xs font-bold text-[#f5f7f8]">Grid Slots</span>
											<span class="text-xs font-black text-[#007AFF]">
												{Math.pow(2, Math.ceil(Math.log2(playerCount || 4)))} Slots
											</span>
										</div>
									</div>
								</div>

								<!-- Number of Players Slider -->
								<div class="flex flex-col gap-2 pt-2">
									<div
										class="flex items-center justify-between text-[10px] font-black tracking-wider text-muted-foreground uppercase"
									>
										<span>Number of Players</span>
										<div class="flex items-center gap-1.5">
											<input
												type="number"
												min="4"
												max="128"
												value={playerCount}
												oninput={(e) => {
													const val = parseInt((e.target as HTMLInputElement).value) || 4;
													const clamped = Math.min(128, Math.max(4, val));
													handleSliderChange(clamped);
												}}
												class="h-[48px] w-14 [appearance:textfield] rounded-lg border border-white/10 bg-black/40 py-0.5 text-center text-base font-black text-[#007AFF] focus:border-[#007AFF] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
											/>
											<span class="text-xs font-black text-[#007AFF]">Players</span>
										</div>
									</div>
									<input
										type="range"
										min="4"
										max="64"
										step="1"
										value={playerCount}
										oninput={(e) => {
											const val = parseInt((e.target as HTMLInputElement).value);
											handleSliderChange(val);
										}}
										class="h-[48px] w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-[#007AFF]"
										style="background: linear-gradient(to right, #007AFF 0%, #007AFF {Math.min(
											100,
											((playerCount - 4) / 60) * 100
										)}%, rgba(255,255,255,0.1) {Math.min(
											100,
											((playerCount - 4) / 60) * 100
										)}%, rgba(255,255,255,0.1) 100%)"
									/>
									<div class="flex justify-between text-[10px] font-bold text-white/40 uppercase">
										<span>4</span>
										<span>16</span>
										<span>32</span>
										<span>48</span>
										<span>64</span>
									</div>
								</div>

								<!-- Advanced Settings -->
								<div class="mt-6 border-t border-white/5 pt-6">
									<h4
										class="mb-4 text-left text-xs font-black tracking-wider text-muted-foreground uppercase"
									>
										Advanced Settings
									</h4>

									<div class="grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
										<!-- Court Labels -->
										<div class="flex flex-col gap-2 sm:col-span-2">
											<span
												class="text-[10px] font-black tracking-wider text-muted-foreground uppercase"
												>Court Labels</span
											>
											<div class="relative">
												<select
													value={tsState.courtFormat || 'court'}
													onchange={(e) =>
														tournament.updateField(
															'courtFormat',
															(e.target as HTMLSelectElement).value
														)}
													class="min-h-[48px] w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-base text-[#f5f7f8] focus:border-[#007AFF] focus:outline-none"
												>
													<option value="number">Numbered (1)</option>
													<option value="court">Court Label (Court 1)</option>
													<option value="custom">Custom Names</option>
												</select>
												<div
													class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[9px] text-muted-foreground/60"
												>
													▼
												</div>
											</div>
										</div>
									</div>

									<!-- Custom Court Names (Conditional) -->
									{#if tsState.courtFormat === 'custom'}
										<div
											class="mt-4 space-y-3 rounded-xl border border-white/5 bg-black/20 p-4 text-left"
										>
											<span
												class="text-[9px] font-black tracking-wider text-muted-foreground uppercase"
												>Custom Court Names</span
											>
											<div class="grid grid-cols-2 gap-2">
												{#each Array.from({ length: Math.max(1, Math.floor(playerCount / 4)) }, (_, i) => i) as i}
													<input
														type="text"
														enterkeyhint="done"
														class="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white transition-colors focus:border-[#007AFF] focus:outline-none"
														placeholder={`Court ${i + 1}`}
														value={tsState.customCourtNames?.[i] || ''}
														oninput={(e) => {
															const newNames = [...(tsState.customCourtNames || [])];
															newNames[i] = (e.target as HTMLInputElement).value;
															tournament.updateField('customCourtNames', newNames);
														}}
													/>
												{/each}
											</div>
										</div>
									{/if}
								</div>

								<!-- Info Card banner -->
								<div
									class="flex gap-3 rounded-xl border border-[#007AFF]/20 bg-[#007AFF]/5 p-4 text-[#007AFF]"
								>
									<Icons name="info" class="mt-0.5 h-4 w-4 shrink-0" />
									<p class="text-xs leading-relaxed font-bold tracking-wider uppercase">
										The bracket will automatically generate seeds based on the player list. Players
										will be paired in a single-elimination format.
									</p>
								</div>
							</div>
						{:else if activeStep === 2}
							<div in:fade={{ duration: 180 }} class="space-y-6">
								<PlayerList
									items={tsState.players}
									onAdd={handleAddPlayer}
									onRemove={handleRemovePlayer}
									onClear={handleClearPlayers}
									onImport={handleImportPlayers}
									title="Players"
									singularTitle="Player"
								/>
							</div>
						{/if}

						<!-- Large Action button at the bottom of the card content -->
						<div class="mt-4 w-full space-y-3">
							<Button
								variant={isReadyToGenerate ? 'shiny' : 'accent'}
								size="lg"
								onclick={handleGenerate}
								disabled={!isReadyToGenerate}
								fullWidth
								class="bg-[#007AFF] py-3.5 text-xs font-black tracking-wider text-[#020607] uppercase shadow-[0_4px_25px_rgba(0,122,255,0.15)] hover:bg-[#007AFF] disabled:cursor-not-allowed disabled:opacity-50"
							>
								Generate Bracket
							</Button>

							{#if !isReadyToGenerate}
								<div
									in:fade
									class="flex items-center justify-center gap-2 rounded-xl border border-warning/20 bg-warning/5 px-3 py-2"
								>
									<Icons name="warning" class="h-3.5 w-3.5 shrink-0 text-warning" />
									<p class="text-[11px] font-black tracking-wider text-warning uppercase">
										Need at least 4 players to start (current: {playerCount})
									</p>
								</div>
							{/if}
						</div>
					</div>
				</GlassCard>

				<!-- History log outside setup card -->
				<div class="mx-auto w-full max-w-4xl pt-16">
					<HistorySection />
				</div>
			</div>
		{/if}
	</div>
</div>

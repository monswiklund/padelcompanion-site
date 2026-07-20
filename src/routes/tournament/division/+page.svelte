<script lang="ts">
	import TournamentNav from '$lib/components/tournament/TournamentNav.svelte';
	import TournamentIdentity from '$lib/components/tournament/TournamentIdentity.svelte';
	import HistorySection from '$lib/components/tournament/HistorySection.svelte';
	import PlayerList from '$lib/components/tournament/PlayerList.svelte';
	import TournamentActiveView from '$lib/components/tournament/TournamentActiveView.svelte';
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

	// Division specific logic
	const divisions = $derived(tsState.divisions || []);

	let activeStep = $state<1 | 2 | 3>(1);
	let showAdvanced = $state(false);

	$effect(() => {
		if (isLocked) {
			activeStep = 3;
		} else if (activeStep === 3) {
			activeStep = 1;
		}
	});

	function handleAddDivision() {
		const newDivs = [...divisions];
		const letter = String.fromCharCode(65 + newDivs.length);
		newDivs.push({
			id: createId(),
			name: letter,
			courts: 1,
			order: newDivs.length
		});
		tournament.updateField('divisions', newDivs);
	}

	function handleRemoveDivision(id: string) {
		tournament.updateField(
			'divisions',
			divisions.filter((d) => d.id !== id)
		);
	}

	function updateDivision(id: string, key: string, value: any) {
		const newDivs = divisions.map((d) => (d.id === id ? { ...d, [key]: value } : d));
		tournament.updateField('divisions', newDivs);
	}

	function getDivisionColorClass(name: string) {
		const norm = (name || '').trim().toUpperCase();
		if (norm.startsWith('A')) return 'bg-[#FF3B30]/10 border-[#FF3B30]/30 text-[#FF3B30]';
		if (norm.startsWith('B')) return 'bg-[#42A5F5]/10 border-[#42A5F5]/30 text-[#42A5F5]';
		if (norm.startsWith('C')) return 'bg-[#34C759]/10 border-[#34C759]/30 text-[#34C759]';
		if (norm.startsWith('D')) return 'bg-[#FFD700]/10 border-[#FFD700]/30 text-[#FFD700]';
		if (norm.startsWith('E')) return 'bg-[#AF52DE]/10 border-[#AF52DE]/30 text-[#AF52DE]';

		const colors = [
			'bg-[#FF3B30]/10 border-[#FF3B30]/30 text-[#FF3B30]',
			'bg-[#42A5F5]/10 border-[#42A5F5]/30 text-[#42A5F5]',
			'bg-[#34C759]/10 border-[#34C759]/30 text-[#34C759]',
			'bg-[#FFD700]/10 border-[#FFD700]/30 text-[#FFD700]',
			'bg-[#AF52DE]/10 border-[#AF52DE]/30 text-[#AF52DE]'
		];
		const code = norm.charCodeAt(0) || 65;
		return colors[code % colors.length];
	}

	function getDivisionTextColorClass(name: string) {
		const norm = (name || '').trim().toUpperCase();
		if (norm.startsWith('A')) return 'text-[#FF3B30]';
		if (norm.startsWith('B')) return 'text-[#42A5F5]';
		if (norm.startsWith('C')) return 'text-[#34C759]';
		if (norm.startsWith('D')) return 'text-[#FFD700]';
		if (norm.startsWith('E')) return 'text-[#AF52DE]';
		return 'text-[#007AFF]';
	}

	function getDefaultDivision() {
		return divisions[0] || { id: 'div-A', name: 'A' };
	}

	function handleCycleDivision(player: any, index: number) {
		if (divisions.length <= 1) return;

		const currentIndex = divisions.findIndex(
			(d) => d.id === player.divisionId || d.name === (player.division || 'A')
		);
		const nextIndex = ((currentIndex >= 0 ? currentIndex : 0) + 1) % divisions.length;
		const nextDivision = divisions[nextIndex];

		const newPlayers = [...tsState.players];
		newPlayers[index] = {
			...newPlayers[index],
			divisionId: nextDivision.id,
			division: nextDivision.name
		};
		tournament.updateField('players', newPlayers);
	}

	// PlayerList callbacks
	function handleAddPlayer(name: string) {
		const defaultDivision = getDefaultDivision();
		tournament.addPlayer({
			id: createId(),
			name,
			lockedCourt: null,
			divisionId: defaultDivision.id,
			division: defaultDivision.name
		});
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
			const defaultDivision = getDefaultDivision();
			tournament.addPlayer({
				id: createId(),
				name,
				lockedCourt: null,
				divisionId: defaultDivision.id,
				division: defaultDivision.name
			});
		});
	}

	function handleSliderChange(val: number) {
		const currentCount = tsState.players.length;
		if (val > currentCount) {
			const diff = val - currentCount;
			for (let i = 0; i < diff; i++) {
				const nextNum = currentCount + i + 1;
				const defaultDivision = getDefaultDivision();
				tournament.addPlayer({
					id: createId(),
					name: `Player ${nextNum}`,
					lockedCourt: null,
					divisionId: defaultDivision.id,
					division: defaultDivision.name
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
		tournament.initForFormat('division');
		// Safeguard to ensure at least one division exists
		if (divisions.length === 0) {
			handleAddDivision();
		}
		window.scrollTo({ top: 0, behavior: 'instant' });
	});
</script>

<svelte:head>
	<title>Division Tournament | Padel Companion</title>
	<meta
		name="description"
		content="Create division-based padel tournaments with court groups, schedules, and live standings."
	/>
	<link rel="canonical" href="https://padelcompanion.se/tournament/division/" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://padelcompanion.se/tournament/division/" />
	<meta property="og:title" content="Division Tournament | Padel Companion" />
	<meta property="og:description" content="Create division-based padel tournaments." />
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
						{tsState.tournamentName || 'DIVISION SETUP'}
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
										value={tsState.tournamentName || 'Division League'}
										oninput={(e) =>
											tournament.updateField(
												'tournamentName',
												(e.target as HTMLInputElement).value
											)}
										class="min-h-[48px] w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-base text-[#f5f7f8] transition-colors placeholder:text-white/20 focus:border-[#007AFF] focus:outline-none"
										placeholder="Enter tournament name..."
									/>
								</div>

								<!-- Divisions list -->
								<div class="space-y-3">
									<div class="flex items-center justify-between">
										<span
											class="text-[10px] font-black tracking-wider text-muted-foreground uppercase"
											>Division List</span
										>
										<button
											type="button"
											onclick={handleAddDivision}
											class="min-h-[44px] cursor-pointer rounded-lg border border-[#007AFF]/20 bg-[#007AFF]/5 px-3 text-[9px] font-black text-[#007AFF] uppercase transition-all hover:bg-[#007AFF]/10"
										>
											+ Add Division
										</button>
									</div>

									<div class="grid gap-2.5">
										{#each divisions as div (div.id)}
											<div
												class="flex flex-col gap-3 rounded-xl border border-white/5 bg-black/30 p-3 sm:flex-row sm:items-center sm:justify-between"
											>
												<div class="flex min-w-0 flex-1 items-center gap-3">
													<div
														class="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-lg border text-xs font-black {getDivisionColorClass(
															div.name
														)}"
													>
														{div.name}
													</div>
													<input
														type="text"
														enterkeyhint="done"
														class="min-h-[48px] flex-1 border-none bg-transparent py-1 text-base font-black text-white uppercase focus:ring-0 focus:outline-none"
														value={div.name}
														oninput={(e) =>
															updateDivision(
																div.id,
																'name',
																(e.target as HTMLInputElement).value.toUpperCase()
															)}
													/>
												</div>

												<div class="flex items-center gap-3">
													<div class="flex flex-col items-end">
														<span
															class="mb-1 text-[7px] font-black tracking-wider text-muted-foreground uppercase"
															>COURTS</span
														>
														<div
														class="flex min-h-[48px] items-center overflow-hidden rounded-lg border border-white/10 bg-black/40"
														>
															<button
																type="button"
																class="flex h-[48px] w-[44px] cursor-pointer items-center justify-center border-r border-white/5 text-[10px] font-black text-muted-foreground transition-all select-none hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
																disabled={div.courts <= 1}
																onclick={() =>
																	updateDivision(div.id, 'courts', Math.max(1, div.courts - 1))}
															>
																−
															</button>
															<span class="w-8 text-center text-[9px] font-black text-white"
																>{div.courts}</span
															>
															<button
																type="button"
																class="flex h-[48px] w-[44px] cursor-pointer items-center justify-center border-l border-white/5 text-[10px] font-black text-muted-foreground transition-all select-none hover:bg-white/5 hover:text-white"
																onclick={() => updateDivision(div.id, 'courts', div.courts + 1)}
															>
																+
															</button>
														</div>
													</div>
													<button
														type="button"
														class="flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-lg border border-white/5 bg-black/20 text-muted-foreground transition-all hover:border-[#FF3B30]/20 hover:bg-[#FF3B30]/10 hover:text-[#FF3B30]"
														onclick={() => handleRemoveDivision(div.id)}
													>
														<Icons name="trash" class="h-3.5 w-3.5" />
													</button>
												</div>
											</div>
										{/each}
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

									<!-- Advanced Settings -->
									<div class="mt-6 border-t border-white/5 pt-6">
										<h4
											class="mb-4 text-left text-xs font-black tracking-wider text-muted-foreground uppercase"
										>
											Advanced Settings
										</h4>

										<div class="grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
											<!-- Scoring Mode -->
											<div class="flex flex-col gap-2">
												<span
													class="text-[10px] font-black tracking-wider text-muted-foreground uppercase"
													>Scoring Mode</span
												>
												<div class="relative">
													<select
														value={tsState.scoringMode || 'total'}
														onchange={(e) =>
															tournament.updateField(
																'scoringMode',
																(e.target as HTMLSelectElement).value
															)}
														class="min-h-[48px] w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-base text-[#f5f7f8] focus:border-[#007AFF] focus:outline-none"
													>
														<option value="total">Total Points</option>
														<option value="race">Race to</option>
														<option value="time">Timed</option>
													</select>
													<div
														class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[9px] text-muted-foreground/60"
													>
														▼
													</div>
												</div>
											</div>

											<!-- Points / Minutes -->
											<div class="flex flex-col gap-2">
												<span
													class="text-[10px] font-black tracking-wider text-muted-foreground uppercase"
												>
													{tsState.scoringMode === 'time'
														? 'Minutes'
														: tsState.scoringMode === 'race'
															? 'Race to'
															: 'Total Points'}
												</span>
												<div
													class="flex min-h-[48px] items-center justify-between rounded-xl border border-white/10 bg-black/30 px-2 py-1.5"
												>
													<button
														type="button"
														class="flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm font-black text-white hover:bg-white/10 disabled:opacity-50"
														disabled={(tsState.pointsPerMatch ?? 24) <= 4}
														onclick={() =>
															tournament.updateField(
																'pointsPerMatch',
																(tsState.pointsPerMatch ?? 24) -
																	(tsState.scoringMode === 'time' ? 1 : 2)
															)}
													>
														−
													</button>
													<span class="text-xs font-black text-[#f5f7f8]"
														>{tsState.pointsPerMatch ?? 24}</span
													>
													<button
														type="button"
														class="flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm font-black text-white hover:bg-white/10 disabled:opacity-50"
														disabled={(tsState.pointsPerMatch ?? 24) >= 50}
														onclick={() =>
															tournament.updateField(
																'pointsPerMatch',
																(tsState.pointsPerMatch ?? 24) +
																	(tsState.scoringMode === 'time' ? 1 : 2)
															)}
													>
														+
													</button>
												</div>
											</div>

											<!-- Tiebreaker -->
											<div class="flex flex-col gap-2 sm:col-span-2">
												<span
													class="text-[10px] font-black tracking-wider text-muted-foreground uppercase"
													>Tiebreaker</span
												>
												<div class="relative">
													<select
														value={tsState.tiebreaker || 'difference'}
														onchange={(e) =>
															tournament.updateField(
																'tiebreaker',
																(e.target as HTMLSelectElement).value
															)}
														class="min-h-[48px] w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-base text-[#f5f7f8] focus:border-[#007AFF] focus:outline-none"
													>
														<option value="difference">Game Difference</option>
														<option value="most_won">Most Games Won</option>
														<option value="shared">Shared (Equal)</option>
													</select>
													<div
														class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[9px] text-muted-foreground/60"
													>
														▼
													</div>
												</div>
											</div>
										</div>
									</div>
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
									showDivisions={true}
									onCycleDivision={handleCycleDivision}
								/>

								<!-- Division Group Summary Grid -->
								<div class="mt-6 border-t border-white/5 pt-6">
									<h4
										class="mb-4 text-left text-xs font-black tracking-wider text-muted-foreground uppercase"
									>
										Division Group Summary
									</h4>

									<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
										{#each divisions as d}
											{@const divPlayers = tsState.players.filter(
												(p) =>
													p.divisionId === d.id || (!p.divisionId && (p.division || 'A') === d.name)
											)}
											<div
												class="flex flex-col space-y-3 rounded-xl border border-white/5 bg-black/20 p-4 text-left"
											>
												<!-- Division Badge Header -->
												<div class="flex items-center justify-between border-b border-white/5 pb-2">
													<span
														class="inline-flex h-6 items-center justify-center rounded-lg border px-2.5 text-xs font-black uppercase {getDivisionColorClass(
															d.name
														)}"
													>
														Division {d.name}
													</span>
													<span class="text-[10px] font-black text-muted-foreground uppercase">
														{divPlayers.length}
														{divPlayers.length === 1 ? 'Player' : 'Players'}
													</span>
												</div>

												<!-- Player Names -->
												<ul
													class="custom-scrollbar max-h-[160px] flex-1 space-y-1.5 overflow-y-auto pr-1"
												>
													{#each divPlayers as p, pIdx}
														<li
															class="flex items-center gap-2 truncate text-xs font-bold text-[#f5f7f8]"
														>
															<span class="text-[9px] font-black text-white/20"
																>{(pIdx + 1).toString().padStart(2, '0')}</span
															>
															<span class="truncate">{p.name}</span>
														</li>
													{:else}
														<li class="text-[10px] font-bold text-white/20 italic">
															No players assigned
														</li>
													{/each}
												</ul>
											</div>
										{/each}
									</div>
								</div>
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
								Generate Division Schedule
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

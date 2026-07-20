<script lang="ts">
	import FullScheduleModal from './FullScheduleModal.svelte';
	import { tournament } from '$lib/stores/tournament.svelte';
	import { showToast, cn } from '$lib/shared/utils';
	import { launchConfetti } from '$lib/tournament/confetti';
	import { formatEstimatedRoundStart } from '$lib/tournament/ui/components/scheduleTiming';
	import { printTournamentSchedule } from '$lib/tournament/ui/setup/exportShare';
	import { getCourtDisplayName } from '$lib/tournament/courtNames';
	import { parseScoreInput, validateRoundScores } from '$lib/tournament/scoring/scoreValidation';
	import { fade, scale } from 'svelte/transition';

	const ts = $derived(tournament.state);
	const schedule = $derived(ts.schedule);
	const format = $derived(ts.format);
	const showCourtSvg = $derived(format !== 'division');
	const allRounds = $derived(ts.allRounds);
	const roundStartedAt = $derived(ts.roundStartedAt);

	let isFullScheduleOpen = $state(false);
	let selectedRoundIdx = $state(0);
	let activeScoreSelector = $state<{ rIdx: number; mIdx: number; team: 1 | 2 } | null>(null);

	// Sync selected round when a new round is generated or active round updates
	$effect(() => {
		if (schedule.length > 0) {
			selectedRoundIdx = schedule.length - 1;
		}
	});

	function getCourtName(courtNum: number, division?: string | null) {
		return getCourtDisplayName(ts, courtNum, division);
	}

	const nextRoundPreview = $derived(
		format === 'division' && allRounds && schedule.length < allRounds.length
			? allRounds[schedule.length]
			: null
	);

	function handleScoreChange(rIdx: number, mIdx: number, team: 1 | 2, val: number | null) {
		const newSchedule = [...schedule];
		const match = { ...newSchedule[rIdx].matches[mIdx] };

		if (val == null) {
			if (team === 1) match.score1 = undefined;
			else match.score2 = undefined;
			newSchedule[rIdx].matches[mIdx] = match;
			tournament.updateField('schedule', newSchedule);
			return;
		}

		if (team === 1) match.score1 = val;
		else match.score2 = val;

		if (ts.scoringMode === 'total') {
			if (team === 1) match.score2 = ts.pointsPerMatch - val;
			else match.score1 = ts.pointsPerMatch - val;
		} else if (ts.scoringMode === 'race') {
			if (val < ts.pointsPerMatch) {
				if (team === 1) match.score2 = ts.pointsPerMatch;
				else match.score1 = ts.pointsPerMatch;
			}
		}

		newSchedule[rIdx].matches[mIdx] = match;
		tournament.updateField('schedule', newSchedule);
	}

	function handleCompleteRound(rIdx: number) {
		const round = schedule[rIdx];
		const errors = validateRoundScores(round, {
			scoringMode: ts.scoringMode,
			pointsPerMatch: ts.pointsPerMatch
		});
		if (errors.length > 0) {
			showToast(errors[0], 'error');
			return;
		}
		if (round?.name === 'Final') {
			launchConfetti();
		}
		const result = tournament.completeRound();
		if (!result.ok) {
			showToast(result.errors?.[0] || 'Invalid round', 'error');
			return;
		}
		showToast(`Round ${rIdx + 1} Completed!`, 'success');
	}

	function handleEditRound(rIdx: number, mIdx: number) {
		tournament.editRound(rIdx, mIdx);
		showToast(`Round ${rIdx + 1} re-opened. Match ${mIdx + 1} is ready to edit`, 'info');
	}

	function handleToggleBye(playerId: string) {
		const newByes = ts.manualByes.includes(playerId)
			? ts.manualByes.filter((id) => id !== playerId)
			: [...ts.manualByes, playerId];
		tournament.updateField('manualByes', newByes);
	}

	function getRoundMetaLabel(round: any, idx: number) {
		if (!round.completed) {
			return `EST. START: ${formatEstimatedRoundStart(ts, idx)}`;
		}
		if (round.durationSeconds == null) {
			return 'FINISHED';
		}
		return `FINISHED · ${Math.round(round.durationSeconds / 60)} MIN`;
	}

	function getMatchWinner(match: any) {
		if (match.score1 == null || match.score2 == null) return null;
		return match.score1 > match.score2 ? 1 : 2;
	}

	function handlePrintSchedule() {
		printTournamentSchedule(ts as any);
	}
</script>

<div class="relative z-10 w-full font-sans select-none">
	<!-- Round Switcher Tabs (Minimal & Borderless) -->
	<div
		class="mb-8 flex scrollbar-none items-center gap-2 overflow-x-auto border-b border-border/10 pb-4"
	>
		{#each schedule as round, idx}
			{@const isActiveRound = idx === schedule.length - 1}
			{@const isSelected = idx === selectedRoundIdx}
			<button
				type="button"
				onclick={() => (selectedRoundIdx = idx)}
				class={cn(
					'flex min-h-[44px] shrink-0 cursor-pointer items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-black tracking-wider uppercase transition-all duration-200',
					isSelected
						? 'bg-foreground text-background shadow-sm shadow-foreground/5'
						: 'border border-border/10 bg-foreground/[0.02] text-foreground/45 hover:bg-foreground/[0.05] hover:text-foreground'
				)}
			>
				{round.name || `Round ${round.number}`}
				{#if isActiveRound && !round.completed}
					<span class="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent"></span>
				{:else if round.completed}
					<span class="inline-block text-[10px] font-bold text-[#34C759]">✓</span>
				{/if}
			</button>
		{/each}
		{#if schedule.length > 0}
			<button
				type="button"
				onclick={handlePrintSchedule}
				class="ml-auto min-h-[44px] shrink-0 cursor-pointer rounded-lg border border-border/10 bg-foreground/[0.02] px-4 py-2.5 text-xs font-black tracking-wider text-foreground/45 uppercase transition-all duration-200 hover:bg-foreground/[0.05] hover:text-foreground"
			>
				Print schedule
			</button>
		{/if}
	</div>

	{#if schedule[selectedRoundIdx]}
		{@const round = schedule[selectedRoundIdx]}
		{@const idx = selectedRoundIdx}
		{@const isActiveRound = idx === schedule.length - 1}

		<div class="animate-fade-in space-y-8" transition:fade={{ duration: 250 }}>
			<!-- Round Info Banner -->
			<div
				class="flex flex-col items-start justify-between gap-4 border-b border-border/20 pb-4 sm:flex-row sm:items-center"
			>
				<div class="space-y-1">
					<div class="flex items-center gap-3">
						<h3
							class="font-display text-3xl leading-none font-black tracking-normal text-foreground"
						>
							{round.name || `Round ${round.number}`}
						</h3>

						{#if !round.completed && !roundStartedAt && isActiveRound}
							<button
								type="button"
								class="flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-[11px] font-black tracking-wider text-background uppercase shadow-sm transition-all active:scale-95"
								onclick={(e) => {
									e.stopPropagation();
									tournament.updateField('roundStartedAt', Date.now());
								}}
							>
								▶ START ROUND
							</button>
						{/if}
					</div>
					<p
						class="text-[11px] leading-none font-black tracking-wider text-foreground/35 uppercase"
					>
						{getRoundMetaLabel(round, idx)}
					</p>
				</div>

				<div class="flex items-center gap-2">
					{#if round.completed}
						<span
							class="flex items-center gap-2 rounded-md border border-[#34C759]/10 bg-[#34C759]/5 px-3 py-1.5 text-xs font-black tracking-wider text-[#34C759] uppercase"
						>
							<div class="h-1.5 w-1.5 rounded-full bg-[#34C759]"></div>
							COMPLETED
						</span>
					{:else if roundStartedAt && isActiveRound}
						<span
							class="flex items-center gap-2 rounded-md border border-accent/15 bg-accent/5 px-3 py-1.5 text-xs font-black tracking-wider text-accent uppercase"
						>
							<div class="h-1.5 w-1.5 rounded-full bg-accent"></div>
							LIVE NOW
						</span>
					{:else}
						<span
							class="flex items-center gap-2 rounded-md border border-border/10 bg-foreground/[0.02] px-3 py-1.5 text-xs font-black tracking-wider text-foreground/40 uppercase"
						>
							<div class="h-1.5 w-1.5 rounded-full bg-foreground/20"></div>
							STANDBY
						</span>
					{/if}
				</div>
			</div>

			<!-- Resting Players (if any) -->
			{#if showCourtSvg && round.byes && round.byes.length > 0}
				<div class="flex flex-wrap items-center gap-2 rounded-xl border border-border/10 bg-foreground/[0.02] p-4 text-xs">
					<span class="font-black tracking-wider text-foreground/45 uppercase mr-2 flex items-center gap-1.5">
						Resting Players:
					</span>
					<div class="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
						{#each round.byes as p, bIdx}
							{#if bIdx > 0}
								<span class="text-foreground/15 select-none">•</span>
							{/if}
							<span class="rounded border border-border/5 bg-foreground/[0.04] px-2 py-0.5 font-semibold text-foreground">
								{p.name}
							</span>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Active Matches Display (Television Scoreboard Grid) -->
			<div
				class={cn('grid', showCourtSvg ? 'gap-6' : 'gap-3')}
				style="grid-template-columns: {ts.gridColumns > 0
					? `repeat(${ts.gridColumns}, minmax(0, 1fr))`
					: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))'}; font-size: {ts.textSize}%;"
			>
				{#each round.matches as match, mIdx}
					{@const isSelectedMatch = ts.ui.selectedMatchId === `round-${idx}-match-${mIdx}`}
					{@const matchDivision =
						format === 'division' ? (match.team1[0] as any)?.division || 'A' : null}
					{@const winner = getMatchWinner(match)}

					{#if showCourtSvg}
						<div class="flex flex-col">
							<!-- Court Header Outside (Only for Court SVG mode) -->
							<div class="mb-2 flex items-center justify-between text-xs font-black tracking-wider text-foreground/50 uppercase">
								<div class="flex items-center gap-2">
									{#if matchDivision}
										<span class="text-accent">DIV {matchDivision}</span>
										<span class="text-foreground/15">•</span>
									{/if}
									<span class="text-foreground/90 font-black text-sm tracking-normal">{getCourtName(match.court, matchDivision)}</span>
								</div>
							</div>

							<!-- Court SVG Card -->
							<div
								class={cn(
									'relative overflow-hidden rounded-xl border border-border/10 p-6 shadow-lg shadow-black/10 bg-[#3888FF]',
									isSelectedMatch && 'z-10 ring-2 ring-accent/60 shadow-xl'
								)}
							>
								<!-- Court Background SVG (Inlined for reliability) -->
								<div class="absolute inset-0 pointer-events-none z-0">
									<svg class="h-full w-full" viewBox="0 0 720 360" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
										<rect width="720" height="360" fill="#3888FF"/>
										<rect x="4" y="4" width="712" height="352" stroke="white" stroke-width="3" fill="none" stroke-opacity="0.9"/>
										<line x1="110" y1="4" x2="110" y2="356" stroke="white" stroke-width="2.5" stroke-opacity="0.85"/>
										<line x1="610" y1="4" x2="610" y2="356" stroke="white" stroke-width="2.5" stroke-opacity="0.85"/>
										<line x1="110" y1="180" x2="610" y2="180" stroke="white" stroke-width="2.5" stroke-opacity="0.85"/>
										<line x1="360" y1="0" x2="360" y2="360" stroke="white" stroke-width="3" stroke-opacity="0.6"/>
										<line x1="360" y1="0" x2="360" y2="360" stroke="#007AFF" stroke-width="1.5" stroke-dasharray="3 3" stroke-opacity="0.4"/>
									</svg>
								</div>
								<div class="absolute inset-0 bg-black/20 pointer-events-none z-0"></div>

								<div class="relative z-10 flex flex-col h-full items-center justify-center">
									<!-- Symmetrical Court Layout -->
									<div class="grid grid-cols-[1fr_48px_1fr] items-center w-full py-8 text-center">
										<!-- Team 1 (Left Half) -->
										<div class="flex flex-col text-center items-center justify-center">
											{#each match.team1 as p}
												<span
													class="text-sm font-black tracking-wide break-words text-white sm:text-base"
													style="text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;"
												>
													{p.name}
												</span>
											{/each}
										</div>

										<!-- Middle net area VS -->
										<div class="flex items-center justify-center">
											<span
												class="px-1 text-[11px] font-black tracking-wider uppercase select-none text-white/65"
												style="text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;"
											>
												VS
											</span>
										</div>

										<!-- Team 2 (Right Half) -->
										<div class="flex flex-col text-center items-center justify-center">
											{#each match.team2 as p}
												<span
													class="text-sm font-black tracking-wide break-words text-white sm:text-base"
													style="text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;"
												>
													{p.name}
												</span>
											{/each}
										</div>
									</div>
								</div>

								{#if match.score1 != null && match.score2 != null && !round.completed}
									<div class="absolute top-4 right-4 z-20 animate-fade-in" in:scale={{ duration: 400 }}>
										<div class="h-1.5 w-1.5 rounded-full bg-accent"></div>
									</div>
								{/if}
							</div>

							<!-- Score Entry Row (Below Card) -->
							<div class="mt-3 flex items-center justify-center gap-2 relative">
								{#if !round.completed}
									<input
										type="text"
										inputmode="numeric"
										pattern="[0-9]*"
										enterkeyhint="done"
										aria-label={`${round.name || `Round ${round.number}`} match ${mIdx + 1} team 1 score`}
										class="h-[52px] w-14 cursor-pointer rounded-lg text-center text-lg font-black transition-all outline-none border border-border/10 bg-[#0d1117] text-foreground focus:border-[#007AFF] focus:bg-[#007AFF]/5"
										placeholder="0"
										value={match.score1 != null ? match.score1 : ''}
										onfocus={(e) => {
											(e.target as HTMLInputElement).select();
											activeScoreSelector = { rIdx: idx, mIdx: mIdx, team: 1 };
										}}
										onclick={() => {
											activeScoreSelector = { rIdx: idx, mIdx: mIdx, team: 1 };
										}}
										oninput={(e) => {
											const el = e.target as HTMLInputElement;
											const val = parseScoreInput(el.value, ts.pointsPerMatch);
											if (val == null && el.value.trim() !== '') {
												el.value = match.score1 != null ? String(match.score1) : '';
												showToast('Scores must be whole numbers', 'error');
												return;
											}
											handleScoreChange(idx, mIdx, 1, val);
										}}
									/>
									<span class="text-foreground/25 font-bold">-</span>
									<input
										type="text"
										inputmode="numeric"
										pattern="[0-9]*"
										enterkeyhint="done"
										aria-label={`${round.name || `Round ${round.number}`} match ${mIdx + 1} team 2 score`}
										class="h-[52px] w-14 cursor-pointer rounded-lg text-center text-lg font-black transition-all outline-none border border-border/10 bg-[#0d1117] text-foreground focus:border-[#007AFF] focus:bg-[#007AFF]/5"
										placeholder="0"
										value={match.score2 != null ? match.score2 : ''}
										onfocus={(e) => {
											(e.target as HTMLInputElement).select();
											activeScoreSelector = { rIdx: idx, mIdx: mIdx, team: 2 };
										}}
										onclick={() => {
											activeScoreSelector = { rIdx: idx, mIdx: mIdx, team: 2 };
										}}
										oninput={(e) => {
											const el = e.target as HTMLInputElement;
											const val = parseScoreInput(el.value, ts.pointsPerMatch);
											if (val == null && el.value.trim() !== '') {
												el.value = match.score2 != null ? String(match.score2) : '';
												showToast('Scores must be whole numbers', 'error');
												return;
											}
											handleScoreChange(idx, mIdx, 2, val);
										}}
									/>

									{#if activeScoreSelector && activeScoreSelector.rIdx === idx && activeScoreSelector.mIdx === mIdx}
										{@const selectedTeam = activeScoreSelector.team}
										<!-- Backdrop to close -->
										<button
											type="button"
											aria-label="Close score picker"
											class="fixed inset-0 z-40 bg-transparent"
											onclick={() => (activeScoreSelector = null)}
										></button>
										<!-- Popover Selector -->
										<div
											class="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-[#0d1117] border border-border/20 rounded-xl p-3 shadow-2xl backdrop-blur-md w-[240px]"
										>
											<div class="mb-2 text-center text-[9px] font-black tracking-wider text-foreground/40 uppercase">
												Select Score for Team {selectedTeam}
											</div>
											<div class="grid grid-cols-4 gap-2 max-h-[208px] overflow-y-auto pr-0.5 custom-scrollbar">
												{#each Array.from({ length: (ts.pointsPerMatch || 24) + 1 }, (_, i) => i) as val}
													<button
														type="button"
														class="h-[44px] w-[44px] flex items-center justify-center text-xs font-black rounded-md border border-border/10 bg-foreground/[0.02] text-foreground hover:bg-[#007AFF] hover:border-[#007AFF] hover:text-white transition-all cursor-pointer"
														onclick={() => {
															handleScoreChange(idx, mIdx, selectedTeam, val);
															activeScoreSelector = null;
														}}
													>
														{val}
													</button>
												{/each}
											</div>
										</div>
									{/if}
								{:else}
									<div class="flex items-center gap-3 rounded-lg border border-border/10 bg-foreground/[0.02] px-4 py-2 text-sm font-black select-none">
										<span class={winner === 1 ? 'text-foreground' : 'text-foreground/35'}>
											{match.score1}
										</span>
										<span class="text-foreground/20">-</span>
										<span class={winner === 2 ? 'text-foreground' : 'text-foreground/35'}>
											{match.score2}
										</span>
									</div>
								{/if}
							</div>

							<!-- Complete/Edit Controls -->
							{#if round.completed}
								<div class="mt-2 flex justify-center">
									<button
										type="button"
										class="min-h-[44px] cursor-pointer px-3 text-[9px] font-black tracking-wider uppercase transition-colors text-foreground/40 hover:text-foreground"
										onclick={() => handleEditRound(idx, mIdx)}
									>
										Edit Result
									</button>
								</div>
							{/if}
						</div>
					{:else}
						<div
							class={cn(
								'group relative overflow-hidden border-b border-border/10 pt-5 pb-5 transition-all duration-200 first:pt-1 last:border-0 -mx-4 px-4',
								isSelectedMatch && 'z-10 scale-[1.005] rounded-r-md border-l-2 border-l-accent bg-foreground/[0.02]'
							)}
						>
							<!-- Match Header (Court Info) -->
							<div
								class="mb-2.5 flex items-center justify-between py-1 text-[10px] font-black tracking-wider text-foreground/40 uppercase"
							>
								<div class="flex items-center gap-2">
									{#if matchDivision}
										<span class="text-accent">DIV {matchDivision}</span>
										<span class="text-foreground/15">•</span>
									{/if}
									<span>{getCourtName(match.court, matchDivision)}</span>
								</div>
								<span>
									{ts.scoringMode === 'total'
										? 'Symmetric'
										: ts.scoringMode === 'race'
											? 'Race'
											: 'Timed'}
								</span>
							</div>

							<!-- Scoreboard Grid Row -->
							<div class="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-2.5">
								<!-- Team 1 (Left) -->
								<div class="flex min-w-0 flex-col text-right">
									{#each match.team1 as p}
										<span class="text-xs font-black tracking-wide break-words text-foreground sm:text-sm">
											{p.name}
										</span>
									{/each}
								</div>

								<!-- Digital Scoreboard Center -->
								<div class="flex items-center gap-2">
									{#if !round.completed}
										<input
											type="text"
											inputmode="numeric"
											pattern="[0-9]*"
											enterkeyhint="done"
											aria-label={`${round.name || `Round ${round.number}`} match ${mIdx + 1} team 1 score`}
											class="h-12 w-12 cursor-pointer rounded-lg border border-white/10 bg-[#0d1117] text-center text-xl font-bold text-foreground transition-all outline-none placeholder:text-foreground/20 focus:border-[#007AFF] focus:bg-[#007AFF]/5"
											placeholder="0"
											value={match.score1 != null ? match.score1 : ''}
											onfocus={(e) => (e.target as HTMLInputElement).select()}
											oninput={(e) => {
												const el = e.target as HTMLInputElement;
												const val = parseScoreInput(el.value, ts.pointsPerMatch);
												if (val == null && el.value.trim() !== '') {
													el.value = match.score1 != null ? String(match.score1) : '';
													showToast('Scores must be whole numbers', 'error');
													return;
												}
												handleScoreChange(idx, mIdx, 1, val);
											}}
										/>
									{:else}
										<span
											class={cn(
												'w-12 text-center text-2xl font-black tabular-nums select-none',
												winner === 1 ? 'text-foreground' : 'text-foreground/20'
											)}
										>
											{match.score1}
										</span>
									{/if}

									<span class="px-1 text-[11px] font-black tracking-wider text-foreground/20 uppercase select-none">VS</span>

									{#if !round.completed}
										<input
											type="text"
											inputmode="numeric"
											pattern="[0-9]*"
											enterkeyhint="done"
											aria-label={`${round.name || `Round ${round.number}`} match ${mIdx + 1} team 2 score`}
											class="h-12 w-12 cursor-pointer rounded-lg border border-white/10 bg-[#0d1117] text-center text-xl font-bold text-foreground transition-all outline-none placeholder:text-foreground/20 focus:border-[#007AFF] focus:bg-[#007AFF]/5"
											placeholder="0"
											value={match.score2 != null ? match.score2 : ''}
											onfocus={(e) => (e.target as HTMLInputElement).select()}
											oninput={(e) => {
												const el = e.target as HTMLInputElement;
												const val = parseScoreInput(el.value, ts.pointsPerMatch);
												if (val == null && el.value.trim() !== '') {
													el.value = match.score2 != null ? String(match.score2) : '';
													showToast('Scores must be whole numbers', 'error');
													return;
												}
												handleScoreChange(idx, mIdx, 2, val);
											}}
										/>
									{:else}
										<span
											class={cn(
												'w-12 text-center text-2xl font-black tabular-nums select-none',
												winner === 2 ? 'text-foreground' : 'text-foreground/20'
											)}
										>
											{match.score2}
										</span>
									{/if}
								</div>

								<!-- Team 2 (Right) -->
								<div class="flex min-w-0 flex-col text-left">
									{#each match.team2 as p}
										<span class="text-xs font-black tracking-wide break-words text-foreground sm:text-sm">
											{p.name}
										</span>
									{/each}
								</div>
							</div>

							<!-- Complete/Edit Controls -->
							{#if round.completed}
								<div class="mt-1 flex justify-center pt-2">
									<button
										type="button"
										class="min-h-[44px] cursor-pointer px-3 text-[9px] font-black tracking-wider text-foreground/40 uppercase transition-colors hover:text-foreground"
										onclick={() => handleEditRound(idx, mIdx)}
									>
										Edit Result
									</button>
								</div>
							{/if}

							{#if match.score1 != null && match.score2 != null && !round.completed}
								<div class="absolute top-4 right-4 z-20 animate-fade-in" in:scale={{ duration: 400 }}>
									<div class="h-1.5 w-1.5 rounded-full bg-accent"></div>
								</div>
							{/if}
						</div>
					{/if}
				{/each}
			</div>

			<!-- Rest Rotation (Manual Byes) & Completion Panel (Only for Active Round) -->
			{#if !round.completed && isActiveRound}
				<div class="space-y-8 border-t border-border/10 pt-8">
					{#if format !== 'division'}
						<div class="space-y-4">
							<div class="flex items-center justify-between">
								<div class="space-y-0.5">
									<h4 class="text-[10px] font-black tracking-wider text-foreground uppercase">
										Rest Rotation
									</h4>
									<p class="text-[8px] tracking-wider text-foreground/35 uppercase">
										Select manually for next round bypass
									</p>
								</div>
								<span class="text-[10px] font-black tracking-wider text-accent uppercase">
									{ts.manualByes.length} SELECTED
								</span>
							</div>

							<div class="flex flex-wrap gap-2">
								{#each ts.leaderboard as p}
									<button
										type="button"
										class={cn(
											'min-h-[48px] cursor-pointer rounded-md border px-4 py-2.5 text-[9px] font-black tracking-wider uppercase transition-all',
											ts.manualByes.includes(p.id)
												? 'border-foreground bg-foreground text-background shadow-sm'
												: 'border-border/10 bg-foreground/[0.02] text-foreground/45 hover:bg-foreground/[0.06] hover:text-foreground'
										)}
										onclick={() => handleToggleBye(p.id)}
									>
										{p.name}
										<span
											class={cn(
												'ml-1.5 text-[8px] font-normal',
												ts.manualByes.includes(p.id) ? 'text-background/55' : 'opacity-45'
											)}>({p.byeCount || 0})</span
										>
									</button>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Complete Button -->
					<button
						type="button"
						class="w-full cursor-pointer rounded-xl border-0 bg-foreground py-4 font-display text-base font-black tracking-wider text-background uppercase shadow-sm shadow-foreground/5 transition-all duration-200 active:scale-[0.99]"
						onclick={() => {
							const errors = validateRoundScores(round, {
								scoringMode: ts.scoringMode,
								pointsPerMatch: ts.pointsPerMatch
							});
							if (errors.length === 0) {
								handleCompleteRound(idx);
							} else {
								showToast(errors[0], 'error');
							}
						}}
					>
						{#if round.name === 'Final'}
							FINISH TOURNAMENT
						{:else if nextRoundPreview?.name === 'Semifinal'}
							GENERATING SEMIS
						{:else if round.name === 'Semifinal' || nextRoundPreview?.name === 'Final'}
							GENERATING FINAL
						{:else}
							FINISH ROUND {round.number}
						{/if}
					</button>
				</div>
			{/if}
		</div>
	{/if}

	<!-- View Full Schedule Matrix Link (Division Only) -->
	{#if format === 'division' && allRounds && allRounds.length > 0}
		<div class="mt-16 text-center">
			<button
				type="button"
				onclick={() => (isFullScheduleOpen = true)}
				class="min-h-[44px] cursor-pointer border-0 border-b border-border/10 bg-transparent px-3 pb-1 text-[10px] font-black tracking-wider text-foreground/40 uppercase transition-all hover:text-foreground"
			>
				View Full Schedule Matrix
			</button>
		</div>
	{/if}

	<FullScheduleModal isOpen={isFullScheduleOpen} onClose={() => (isFullScheduleOpen = false)} />
</div>

<style>
	/* Hide scrollbar for Chrome, Safari and Opera */
	.scrollbar-none::-webkit-scrollbar {
		display: none;
	}
	/* Hide scrollbar for IE, Edge and Firefox */
	.scrollbar-none {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
</style>

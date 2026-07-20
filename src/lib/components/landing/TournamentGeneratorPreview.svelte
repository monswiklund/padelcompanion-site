<script lang="ts">
	import { fade, slide, scale } from 'svelte/transition';
	import GlassCard from '$lib/components/ui/GlassCard.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Icons from '$lib/components/Icons.svelte';

	let activeStep = $state<1 | 2 | 3>(1);
	let tournamentName = $state('Friday Padel Club');
	let format = $state<'americano' | 'mexicano' | 'winners' | 'group'>('americano');
	let playersCount = $state(8);
	let duration = $state('24 points');
	let skillLevel = $state('Intermediate (3-5)');

	// Simulating adding players
	let newPlayerName = $state('');
	let players = $state<string[]>([
		'Mans',
		'Marcus',
		'Anna',
		'David',
		'Emma',
		'Johan',
		'Sofia',
		'Kalle'
	]);

	function addPlayer() {
		if (newPlayerName.trim()) {
			players = [...players, newPlayerName.trim()];
			playersCount = players.length;
			newPlayerName = '';
		}
	}

	function removePlayer(idx: number) {
		players = players.filter((_, i) => i !== idx);
		playersCount = players.length;
	}

	// Trigger generation simulation
	let generating = $state(false);
	function generate() {
		generating = true;
		setTimeout(() => {
			generating = false;
			activeStep = 3;
		}, 1200);
	}
</script>

<GlassCard variant="premium" padding="none" class="relative w-full shadow-2xl border border-white/10 overflow-hidden">
	<!-- Background accent spotlight -->
	<div class="pointer-events-none absolute -right-20 -top-20 -z-10 h-64 w-64 rounded-full bg-[#007AFF]/10 blur-[80px]"></div>
	
	<!-- Header Tabs -->
	<div class="flex border-b border-white/5 bg-white/[0.01]">
		{#each [1, 2, 3] as step}
			<button
				onclick={() => (activeStep = step as 1 | 2 | 3)}
				class="flex-1 py-4 text-center text-xs font-black tracking-wider uppercase transition-all border-b-2 cursor-pointer select-none
					{activeStep === step 
						? 'border-[#007AFF] text-[#007AFF] bg-white/[0.02]' 
						: 'border-transparent text-[#a7b0b8] hover:text-[#f5f7f8] hover:bg-white/[0.01]'}"
			>
				<span class="mr-1.5 opacity-50">{step}.</span>
				{step === 1 ? 'Settings' : step === 2 ? 'Players' : 'Match Schedule'}
			</button>
		{/each}
	</div>

	<!-- Step Content -->
	<div class="p-6 md:p-8 min-h-[360px] flex flex-col justify-between">
		{#if activeStep === 1}
			<div in:fade={{ duration: 200 }} class="space-y-5">
				<!-- Tournament Name -->
				<div class="flex flex-col gap-2">
					<label for="t-name" class="text-[10px] font-black tracking-wider text-muted-foreground uppercase">Tournament Name</label>
					<input
						type="text"
						id="t-name"
						bind:value={tournamentName}
						class="min-h-[48px] w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-base text-[#f5f7f8] transition-colors focus:border-[#007AFF] focus:outline-none placeholder:text-white/20"
						placeholder="Enter tournament name..."
					/>
				</div>

				<!-- Grid configuration -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<!-- Format Selection -->
					<div class="flex flex-col gap-2">
						<span class="text-[10px] font-black tracking-wider text-muted-foreground uppercase">Format</span>
						<div class="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/5">
							<button 
								onclick={() => format = 'americano'}
								class="min-h-[44px] py-2 text-[10px] font-bold rounded-lg uppercase cursor-pointer transition-all {format === 'americano' ? 'bg-[#007AFF] text-black' : 'text-muted-foreground hover:text-white'}"
							>
								Americano
							</button>
							<button 
								onclick={() => format = 'mexicano'}
								class="min-h-[44px] py-2 text-[10px] font-bold rounded-lg uppercase cursor-pointer transition-all {format === 'mexicano' ? 'bg-[#007AFF] text-black' : 'text-muted-foreground hover:text-white'}"
							>
								Mexicano
							</button>
						</div>
					</div>

					<!-- Skill Level -->
					<div class="flex flex-col gap-2">
						<label for="t-level" class="text-[10px] font-black tracking-wider text-muted-foreground uppercase">Level</label>
						<select
							id="t-level"
							bind:value={skillLevel}
							class="min-h-[48px] w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-base text-[#f5f7f8] transition-colors focus:border-[#007AFF] focus:outline-none cursor-pointer"
						>
							<option>Beginner (1-2)</option>
							<option>Intermediate (3-5)</option>
							<option>Advanced (6-8)</option>
						</select>
					</div>
				</div>

				<!-- Slider for Players count -->
				<div class="flex flex-col gap-2 pt-2">
					<div class="flex justify-between items-center text-[10px] font-black tracking-wider text-muted-foreground uppercase">
						<span>Number of players</span>
						<span class="text-[#007AFF] text-xs font-black">{playersCount} players</span>
					</div>
					<input
						type="range"
						min="4"
						max="16"
						step="4"
						bind:value={playersCount}
						class="h-[48px] w-full accent-[#007AFF] cursor-pointer"
					/>
					<div class="flex justify-between text-[8px] font-bold text-white/40 uppercase">
						<span>4</span>
						<span>8</span>
						<span>12</span>
						<span>16</span>
					</div>
				</div>
			</div>

			<!-- Generate CTA Button -->
			<div class="mt-8">
				<Button
					variant="primary"
					fullWidth
					onclick={generate}
					disabled={generating}
					class="py-3.5 text-xs font-black tracking-wider shadow-[0_4px_20px_rgba(0,122,255,0.15)]"
				>
					{#if generating}
						<div class="flex items-center justify-center gap-2">
							<span class="h-3 w-3 animate-spin rounded-full border-2 border-black border-t-transparent"></span>
							<span>Generating schedule...</span>
						</div>
					{:else}
						<span>Generate match schedule</span>
					{/if}
				</Button>
			</div>

		{:else if activeStep === 2}
			<div in:fade={{ duration: 200 }} class="space-y-4 flex-1 flex flex-col justify-between">
				<div>
					<span class="text-[10px] font-black tracking-wider text-muted-foreground uppercase mb-2 block">Participant List ({players.length} players)</span>
					
					<!-- Players grid -->
					<div class="grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1.5 custom-scrollbar">
						{#each players as player, idx}
							<div class="flex items-center justify-between rounded-xl border border-white/5 bg-black/30 p-2.5">
								<span class="text-xs font-bold text-[#f5f7f8] truncate">{player}</span>
								<button 
									onclick={() => removePlayer(idx)}
									class="text-xs text-white/30 hover:text-[#FF3B30] p-0.5 cursor-pointer"
								>
									&times;
								</button>
							</div>
						{/each}
					</div>
				</div>

				<!-- Add player row -->
				<div class="flex gap-2 mt-4">
					<input
						type="text"
						bind:value={newPlayerName}
						class="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs text-[#f5f7f8] transition-colors focus:border-[#007AFF] focus:outline-none placeholder:text-white/20"
						placeholder="Enter player name..."
						onkeydown={(e) => e.key === 'Enter' && addPlayer()}
					/>
					<Button variant="secondary" onclick={addPlayer} size="sm" class="py-2.5">
						Add
					</Button>
				</div>
			</div>

		{:else if activeStep === 3}
			<div in:fade={{ duration: 200 }} class="space-y-4">
				<div class="flex items-center justify-between">
					<span class="text-[10px] font-black tracking-wider text-muted-foreground uppercase">Match Schedule - Americano</span>
					<span class="flex items-center gap-1.5 text-[9px] font-black tracking-wider text-[#007AFF] bg-[#007AFF]/10 px-2 py-1 rounded border border-[#007AFF]/20 uppercase">
						<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-[#007AFF]"></span>
						Live Tournament
					</span>
				</div>

				<!-- Match rounds display -->
				<div class="space-y-3 max-h-[360px] overflow-y-auto pr-1.5 custom-scrollbar">
					<!-- Round 1 -->
					<div class="rounded-xl border border-white/5 bg-black/20 p-3">
						<div class="mb-2 flex items-center justify-between border-b border-white/5 pb-1">
							<span class="text-[9px] font-black tracking-wider text-muted-foreground uppercase">Round 1 of 4</span>
							<span class="text-[8px] font-bold text-white/40">Completed</span>
						</div>
						<div class="space-y-2">
							<div class="flex items-center justify-between text-xs">
								<div class="flex flex-col gap-0.5">
									<span class="font-bold text-white">Mans & Marcus</span>
									<span class="text-[9px] text-muted-foreground">vs Anna & David</span>
								</div>
								<span class="font-black text-[#007AFF]">14 - 10</span>
							</div>
						</div>
					</div>

					<!-- Round 2 -->
					<div class="rounded-xl border border-white/5 bg-black/20 p-3">
						<div class="mb-2 flex items-center justify-between border-b border-white/5 pb-1">
							<span class="text-[9px] font-black tracking-wider text-muted-foreground uppercase">Round 2 of 4</span>
							<span class="text-[8px] font-bold text-white/40">Completed</span>
						</div>
						<div class="space-y-2">
							<div class="flex items-center justify-between text-xs">
								<div class="flex flex-col gap-0.5">
									<span class="font-bold text-white">Mans & Anna</span>
									<span class="text-[9px] text-muted-foreground">vs Marcus & David</span>
								</div>
								<span class="font-black text-[#007AFF]">11 - 13</span>
							</div>
						</div>
					</div>

					<!-- Round 3 / Live match -->
					<div class="rounded-xl border border-[#007AFF]/20 bg-[#007AFF]/5 p-3 shadow-[0_0_15px_rgba(0,122,255,0.05)]">
						<div class="mb-2 flex items-center justify-between border-b border-[#007AFF]/10 pb-1">
							<span class="text-[9px] font-black tracking-wider text-[#007AFF] uppercase">Round 3 of 4 (Active)</span>
							<span class="text-[8px] font-black text-[#007AFF] animate-pulse">LIVE</span>
						</div>
						<div class="space-y-2">
							<div class="flex items-center justify-between text-xs">
								<div class="flex flex-col gap-0.5">
									<span class="font-bold text-white">Marcus & Sofia</span>
									<span class="text-[9px] text-[#a7b0b8]">vs Johan & Kalle</span>
								</div>
								<div class="flex items-center gap-1.5">
									<span class="font-black text-[#f5f7f8] bg-black/40 px-2 py-0.5 rounded">16</span>
									<span class="text-white/30">-</span>
									<span class="font-black text-[#f5f7f8] bg-black/40 px-2 py-0.5 rounded">12</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Round 4 / Final match simulation -->
					<div class="rounded-xl border border-white/5 bg-black/20 p-3 opacity-60">
						<div class="mb-2 flex items-center justify-between border-b border-white/5 pb-1">
							<div class="flex items-center gap-1">
								<span class="text-[9px] font-black tracking-wider text-muted-foreground uppercase">Round 4 - Center Court</span>
								<Icons name="award" class="h-3 w-3 text-[#007AFF]" />
							</div>
							<span class="text-[8px] font-bold text-white/40">Upcoming</span>
						</div>
						<div class="space-y-2">
							<div class="flex items-center justify-between text-xs">
								<div class="flex flex-col gap-0.5">
									<span class="font-bold text-white">Top 1 & 3</span>
									<span class="text-[9px] text-muted-foreground">vs Top 2 & 4</span>
								</div>
								<span class="font-black text-muted-foreground">-</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</GlassCard>

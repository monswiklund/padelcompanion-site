<script lang="ts">
	import Icons from '$lib/components/Icons.svelte';
	import { fade } from 'svelte/transition';

	let activeTab = $state<'home' | 'history' | 'players' | 'insights'>('home');

	const playersList = [
		{ name: 'Mans', avatar: 'M', stat: 'Level 6.5 · 512 Wins' },
		{ name: 'Marcus', avatar: 'M', stat: 'Level 5.0 · 412 Wins' },
		{ name: 'Anna', avatar: 'A', stat: 'Level 4.5 · 285 Wins' },
		{ name: 'David', avatar: 'D', stat: 'Level 4.0 · 156 Wins' }
	];
</script>

<div
	class="relative z-10 flex h-[480px] w-[240px] flex-col rounded-[32px] border-[4px] border-[#1f2427] bg-[#0d1117] shadow-[0_0_0_2px_#071014,0_20px_50px_rgba(0,0,0,0.8),0_0_60px_rgba(0,122,255,0.15)] md:h-[600px] md:w-[300px] md:rounded-[40px] md:border-5"
>
	<!-- Side Buttons -->
	<div
		class="absolute top-[100px] -right-[6px] -z-10 h-[60px] w-[3px] rounded-r-[2px] bg-[#1f2427]"
	></div>
	<div class="absolute top-[90px] -left-[6px] -z-10">
		<div class="mb-[10px] h-[40px] w-[3px] rounded-l-[2px] bg-[#1f2427]"></div>
		<div class="h-[40px] w-[3px] rounded-l-[2px] bg-[#1f2427]"></div>
	</div>

	<div
		class="relative flex h-full w-full flex-col overflow-hidden rounded-[28px] bg-black md:rounded-[36px]"
	>
		<!-- Dynamic Island -->
		<div
			class="absolute top-[10px] left-1/2 z-[100] h-[22px] w-[80px] -translate-x-1/2 rounded-[20px] border border-white/5 bg-[#0d1117] shadow-md"
		></div>

		<!-- Status Bar -->
		<div
			class="z-10 flex justify-between px-6 pt-[14px] text-[10px] font-bold text-white opacity-85 select-none"
		>
			<span>09:41</span>
			<div class="flex items-center gap-1">
				<Icons name="globe" class="h-3 w-3 opacity-70" />
				<div class="h-2 w-3 rounded-[2px] bg-white/80"></div>
			</div>
		</div>

		<!-- Screen Content Area -->
		<div class="flex-1 overflow-y-auto px-5 pt-4 pb-20 custom-scrollbar select-none">
			{#key activeTab}
				<div in:fade={{ duration: 150 }} class="space-y-4 pt-1">
					{#if activeTab === 'home'}
						<div class="flex items-center justify-between">
							<div class="text-left">
								<span class="text-[9px] font-black text-[#007AFF] tracking-widest uppercase">Padel Companion</span>
								<h3 class="text-base font-black text-white leading-tight">Hey Mans! 👋</h3>
							</div>
							<div class="h-8 w-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-xs font-black text-[#007AFF]">
								M
							</div>
						</div>

						<!-- Banner card for Americano -->
						<div class="flex flex-col gap-2">
							<span class="text-[9px] font-black tracking-wider text-muted-foreground uppercase text-left">Recommended Format</span>
							<button
								class="relative flex flex-col gap-2.5 overflow-hidden rounded-2xl border border-[#007AFF]/30 bg-gradient-to-br from-[#161b22] to-[#0d1117] p-4 text-left shadow-[0_4px_20px_rgba(0,122,255,0.1)] transition-all hover:border-[#007AFF]/50 active:scale-95 cursor-pointer"
							>
								<div class="absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-[#007AFF]/5 blur-xl"></div>
								<div class="flex items-center justify-between w-full">
									<span class="rounded bg-[#007AFF]/10 border border-[#007AFF]/20 px-2 py-0.5 text-[8px] font-black text-[#007AFF] tracking-wider uppercase">Popular</span>
									<Icons name="trophy" class="h-4.5 w-4.5 text-[#007AFF]" />
								</div>
								<div>
									<h4 class="text-sm font-black text-white">Americano</h4>
									<p class="text-[9px] text-[#a7b0b8] mt-0.5">Play with rotating partners and count every point. A fair and exciting matchmaking system.</p>
								</div>
								<div class="flex items-center gap-1.5 mt-1 text-[9px] font-bold text-[#007AFF]">
									<span>Start tournament now</span>
									<span>→</span>
								</div>
							</button>
						</div>

						<!-- More Formats list -->
						<div class="flex flex-col gap-2">
							<span class="text-[9px] font-black tracking-wider text-muted-foreground uppercase text-left">More Formats</span>
							
							<!-- Mexicano -->
							<button class="flex items-center justify-between rounded-xl border border-white/5 bg-[#161b22] p-3 text-left hover:bg-white/[0.03] transition-all cursor-pointer">
								<div class="flex items-center gap-3">
									<div class="h-7 w-7 rounded-lg bg-[#FF9500]/10 border border-[#FF9500]/20 flex items-center justify-center text-[#FF9500]">
										<Icons name="users" class="h-4 w-4" />
									</div>
									<div class="flex flex-col">
										<span class="text-xs font-bold text-white">Mexicano</span>
										<span class="text-[9px] text-muted-foreground">Matchmaking based on standings</span>
									</div>
								</div>
								<span class="text-xs text-muted-foreground">›</span>
							</button>

							<!-- Winners Court -->
							<button class="flex items-center justify-between rounded-xl border border-white/5 bg-[#161b22] p-3 text-left hover:bg-white/[0.03] transition-all cursor-pointer">
								<div class="flex items-center gap-3">
									<div class="h-7 w-7 rounded-lg bg-[#AF52DE]/10 border border-[#AF52DE]/20 flex items-center justify-center text-[#AF52DE]">
										<Icons name="crown" class="h-4 w-4" />
									</div>
									<div class="flex flex-col">
										<span class="text-xs font-bold text-white">Winner's Court</span>
										<span class="text-[9px] text-muted-foreground">Climb your way to center court</span>
									</div>
								</div>
								<span class="text-xs text-muted-foreground">›</span>
							</button>
						</div>

					{:else if activeTab === 'history'}
						<h4 class="text-xs font-black text-white uppercase tracking-wider mb-1 text-left">Match History</h4>
						
						<div class="flex flex-col gap-2 rounded-xl border border-white/5 bg-[#161b22] p-3 shadow-md text-left">
							<div class="flex items-center justify-between text-[9px] text-[#a7b0b8]">
								<span>Yesterday, 18:30</span>
								<span class="rounded bg-[#34C759]/10 border border-[#34C759]/20 px-1.5 py-0.5 text-[8px] font-black text-[#34C759]">WIN</span>
							</div>
							<div class="flex items-baseline gap-1 text-lg font-black text-white leading-none">
								24 - 16
								<span class="text-[9px] font-normal text-muted-foreground">pts</span>
							</div>
							<div class="text-[9px] text-muted-foreground">Played as Americano</div>
						</div>

						<div class="flex flex-col gap-2 rounded-xl border border-white/5 bg-[#161b22] p-3 shadow-md text-left">
							<div class="flex items-center justify-between text-[9px] text-[#a7b0b8]">
								<span>Jul 2, 19:45</span>
								<span class="rounded bg-[#FFD700]/10 border border-[#FFD700]/20 px-1.5 py-0.5 text-[8px] font-black text-[#FFD700]">DRAW</span>
							</div>
							<div class="flex items-baseline gap-1 text-lg font-black text-white leading-none">
								12 - 12
								<span class="text-[9px] font-normal text-muted-foreground">pts</span>
							</div>
							<div class="text-[9px] text-muted-foreground">Played as Mexicano</div>
						</div>

					{:else if activeTab === 'players'}
						<h4 class="text-xs font-black text-white uppercase tracking-wider mb-1 text-left">Nearby Players</h4>
						<div class="flex flex-col gap-2 text-left">
							{#each playersList as player}
								<div class="flex items-center gap-3 rounded-xl border border-white/5 bg-[#161b22] p-2.5 shadow-sm">
									<div class="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#007AFF] to-[#007AFF] text-[10px] font-black text-black">
										{player.avatar}
									</div>
									<div class="flex flex-col">
										<span class="text-xs font-bold text-white">{player.name}</span>
										<span class="text-[9px] text-muted-foreground leading-none">{player.stat}</span>
									</div>
								</div>
							{/each}
						</div>

					{:else if activeTab === 'insights'}
						<h4 class="text-xs font-black text-white uppercase tracking-wider mb-1 text-left">Stats & Insights</h4>
						<div class="grid grid-cols-2 gap-2 text-left">
							<div class="rounded-xl border border-white/5 bg-[#161b22] p-2.5 text-center">
								<span class="block text-base font-black text-[#007AFF]">67%</span>
								<span class="text-[8px] font-bold text-muted-foreground uppercase">Wins</span>
							</div>
							<div class="rounded-xl border border-white/5 bg-[#161b22] p-2.5 text-center">
								<span class="block text-base font-black text-[#007AFF]">#24</span>
								<span class="text-[8px] font-bold text-muted-foreground uppercase">Ranking</span>
							</div>
						</div>
						
						<!-- Miniature chart -->
						<div class="mt-1 rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-left">
							<span class="text-[8px] font-black text-muted-foreground uppercase mb-2 block">Form Trend</span>
							<div class="flex h-14 items-end justify-between gap-1">
								{#each [35, 60, 48, 85, 67, 95] as h}
									<div
										style="height: {h}%"
										class="flex-1 rounded-t-[2px] bg-gradient-to-t from-[#007AFF] to-[#007AFF] shadow-[0_0_10px_rgba(0,122,255,0.2)]"
									></div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{/key}
		</div>

		<!-- Bottom Navigation Bar -->
		<div
			class="z-10 flex h-[50px] items-center justify-around border-t border-white/10 bg-[#161b22] px-1 pb-1 select-none"
		>
			<button
				onclick={() => (activeTab = 'home')}
				class="flex h-[44px] w-[44px] flex-col items-center justify-center gap-1 py-1 text-[8px] font-black uppercase transition-colors cursor-pointer
					{activeTab === 'home' ? 'text-[#007AFF]' : 'text-muted-foreground hover:text-white'}"
			>
				<Icons name="home" class="h-4.5 w-4.5" />
				Home
			</button>
			<button
				onclick={() => (activeTab = 'history')}
				class="flex h-[44px] w-[44px] flex-col items-center justify-center gap-1 py-1 text-[8px] font-black uppercase transition-colors cursor-pointer
					{activeTab === 'history' ? 'text-[#007AFF]' : 'text-muted-foreground hover:text-white'}"
			>
				<Icons name="history" class="h-4.5 w-4.5" />
				History
			</button>
			<button
				onclick={() => (activeTab = 'players')}
				class="flex h-[44px] w-[44px] flex-col items-center justify-center gap-1 py-1 text-[8px] font-black uppercase transition-colors cursor-pointer
					{activeTab === 'players' ? 'text-[#007AFF]' : 'text-muted-foreground hover:text-white'}"
			>
				<Icons name="users" class="h-4.5 w-4.5" />
				Players
			</button>
			<button
				onclick={() => (activeTab = 'insights')}
				class="flex h-[44px] w-[44px] flex-col items-center justify-center gap-1 py-1 text-[8px] font-black uppercase transition-colors cursor-pointer
					{activeTab === 'insights' ? 'text-[#007AFF]' : 'text-muted-foreground hover:text-white'}"
			>
				<Icons name="barchart" class="h-4.5 w-4.5" />
				Stats
			</button>
		</div>
	</div>
</div>

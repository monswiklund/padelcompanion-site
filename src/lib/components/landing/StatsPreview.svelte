<script lang="ts">
	import GlassCard from '$lib/components/ui/GlassCard.svelte';
	import Icons from '$lib/components/Icons.svelte';
</script>

<div class="relative w-full max-w-sm mx-auto">
	<!-- Spotlight glow behind the stats preview -->
	<div class="pointer-events-none absolute inset-0 -z-10 h-72 w-72 rounded-full bg-[#007AFF]/5 blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>

	<!-- Main Smartphone Stats Container -->
	<div class="relative rounded-[32px] border-4 border-[#1f2427] bg-[#0d1117] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(0,122,255,0.1)]">
		
		<!-- Screen Header -->
		<div class="mb-5 flex items-center justify-between border-b border-white/5 pb-3">
			<div class="flex items-center gap-2">
				<div class="h-6 w-6 rounded-full bg-[#007AFF]/10 border border-[#007AFF]/30 flex items-center justify-center text-[10px] font-black text-[#007AFF]">
					M
				</div>
				<span class="text-xs font-black tracking-tight text-white">Stats & Progress</span>
			</div>
			<span class="text-[9px] font-black text-muted-foreground uppercase tracking-wider">All Season</span>
		</div>

		<!-- Metrics Grid -->
		<div class="grid grid-cols-3 gap-2.5 mb-5">
			<div class="rounded-2xl border border-white/5 bg-white/[0.01] p-3 text-center transition-all hover:border-[#007AFF]/20">
				<span class="block text-xl font-black text-[#007AFF] tracking-tight">56</span>
				<span class="text-[8px] font-black tracking-wider text-muted-foreground uppercase">Matches</span>
			</div>
			<div class="rounded-2xl border border-white/5 bg-white/[0.01] p-3 text-center transition-all hover:border-[#007AFF]/20">
				<span class="block text-xl font-black text-[#007AFF] tracking-tight">67%</span>
				<span class="text-[8px] font-black tracking-wider text-muted-foreground uppercase">Wins</span>
			</div>
			<div class="rounded-2xl border border-white/5 bg-white/[0.01] p-3 text-center transition-all hover:border-[#007AFF]/20">
				<span class="block text-xl font-black text-[#007AFF] tracking-tight">#24</span>
				<span class="text-[8px] font-black tracking-wider text-muted-foreground uppercase">Ranking</span>
			</div>
		</div>

		<!-- Progress Chart -->
		<div class="mb-5 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
			<div class="mb-4 flex items-center justify-between">
				<span class="text-[9px] font-black tracking-wider text-muted-foreground uppercase">Form Trend (Winrate %)</span>
				<span class="text-[9px] font-black text-[#007AFF]">+12% this month</span>
			</div>
			<div class="flex h-24 items-end justify-between gap-2.5">
				{#each [40, 52, 45, 68, 58, 75, 67] as h, i}
					<div class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
						<div
							style="height: {h}%"
							class="w-full rounded-t-[3px] bg-gradient-to-t from-[#007AFF] via-[#007AFF] to-[#007AFF] shadow-[0_0_12px_rgba(0,122,255,0.2)] transition-all duration-700"
						></div>
						<span class="text-[8px] font-bold text-white/30 uppercase">W.{18 + i}</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- Two Sub Cards: Utmaningar & Achievements -->
		<div class="space-y-2.5">
			<!-- Utmaningar -->
			<div class="flex items-center gap-3.5 rounded-2xl border border-white/5 bg-[#161b22] p-3">
				<div class="h-9 w-9 rounded-xl bg-[#FF9500]/10 border border-[#FF9500]/20 flex items-center justify-center text-[#FF9500] shrink-0">
					<Icons name="calendar" class="h-5 w-5" />
				</div>
				<div class="flex-1 min-w-0">
					<div class="flex items-center justify-between">
						<span class="text-xs font-black text-white leading-tight">Weekly Challenge</span>
						<span class="text-[9px] font-bold text-[#FF9500]">2 / 3</span>
					</div>
					<p class="text-[9px] text-[#a7b0b8] truncate mt-0.5">Play three matches in a tournament.</p>
				</div>
			</div>

			<!-- Achievements -->
			<div class="flex items-center gap-3.5 rounded-2xl border border-white/5 bg-[#161b22] p-3">
				<div class="h-9 w-9 rounded-xl bg-[#AF52DE]/10 border border-[#AF52DE]/20 flex items-center justify-center text-[#AF52DE] shrink-0">
					<Icons name="crown" class="h-5 w-5" />
				</div>
				<div class="flex-1 min-w-0">
					<div class="flex items-center justify-between">
						<span class="text-xs font-black text-white leading-tight">Achievements</span>
						<span class="text-[8px] font-black text-[#AF52DE] bg-[#AF52DE]/10 border border-[#AF52DE]/20 px-1 rounded uppercase">9/12</span>
					</div>
					<p class="text-[9px] text-[#a7b0b8] truncate mt-0.5">Win 5 Winners Court matches in a row.</p>
				</div>
			</div>
		</div>
	</div>
</div>

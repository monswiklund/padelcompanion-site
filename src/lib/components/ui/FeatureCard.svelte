<script lang="ts">
	import Icons from '$lib/components/Icons.svelte';

	interface Props {
		icon: 'calendar' | 'users' | 'trophy' | 'trending-up' | 'barchart' | 'globe' | 'smartphone';
		title: string;
		description: string;
	}

	const { icon, title, description }: Props = $props();
</script>

<div class="group relative flex flex-col items-center text-center p-6 transition-all duration-300">
	<!-- Subtle background glow on hover -->
	<div class="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-white/[0.01] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

	<!-- Icon container with spotlight glow -->
	<div class="relative mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-white/[0.02] border border-white/5 shadow-inner transition-transform duration-300 group-hover:scale-105 group-hover:border-[#007AFF]/25">
		<div class="absolute inset-0 rounded-xl bg-[#007AFF]/0 blur-md transition-colors duration-300 group-hover:bg-[#007AFF]/5"></div>
		<Icons name={icon} class="h-6 w-6 text-[#007AFF] transition-colors duration-300" />
	</div>

	<!-- Content -->
	<h3 class="mb-3 font-display text-xl font-black text-[#f5f7f8] tracking-tight">
		{title}
	</h3>
	
	<p class="max-w-[260px] text-sm leading-relaxed text-[#a7b0b8]">
		{description}
	</p>
</div>

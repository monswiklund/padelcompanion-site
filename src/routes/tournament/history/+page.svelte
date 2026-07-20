<script lang="ts">
	import TournamentNav from '$lib/components/tournament/TournamentNav.svelte';
	import HistorySection from '$lib/components/tournament/HistorySection.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	onMount(() => {
		window.scrollTo({ top: 0, behavior: 'instant' });
	});
</script>

<svelte:head>
	<title>Tournament History | Padel Companion</title>
	<meta
		name="description"
		content="View and manage your past padel tournaments. Load local history or sync from cloud."
	/>
	<link rel="canonical" href="https://padelcompanion.se/tournament/history/" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://padelcompanion.se/tournament/history/" />
	<meta property="og:title" content="Tournament History | Padel Companion" />
	<meta property="og:description" content="View and manage your past padel tournaments." />
	<meta property="og:image" content="https://padelcompanion.se/assets/app-icon.jpeg" />
</svelte:head>

<div
	class="noise relative min-h-dvh overflow-x-clip bg-background pb-32 font-sans text-foreground"
>
	<TournamentNav />

	<div
		class="relative z-10 container mx-auto max-w-[1250px] px-4 pt-12 sm:px-6"
		in:fade={{ duration: 400 }}
	>
		<div class="mx-auto max-w-5xl">
			<HistorySection />
		</div>
	</div>
</div>

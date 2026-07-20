<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		goto('/tournament/generator/', { replaceState: true });
	});
</script>

<svelte:head>
	<title>Padel Tournament Engine | Padel Companion</title>
	<meta
		name="description"
		content="Create Americano, Mexicano, bracket, division, and Winners Court padel tournaments."
	/>
	<link rel="canonical" href="https://padelcompanion.se/tournament/" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://padelcompanion.se/tournament/" />
	<meta property="og:title" content="Padel Tournament Engine | Padel Companion" />
	<meta
		property="og:description"
		content="Create and run padel tournaments directly in your browser."
	/>
	<meta property="og:image" content="https://padelcompanion.se/assets/app-icon.jpeg" />
</svelte:head>

<main class="min-h-dvh bg-background px-6 py-32 text-foreground">
	<section class="mx-auto max-w-3xl text-center">
		<p class="mb-4 text-[10px] font-black tracking-wider text-accent uppercase">
			Padel Companion
		</p>
		<h1 class="font-display text-4xl font-black tracking-tight uppercase md:text-6xl">
			Padel Tournament Engine
		</h1>
		<p class="mx-auto mt-6 max-w-xl text-muted-foreground">
			Create Americano, Mexicano, bracket, division, and Winners Court tournaments.
		</p>
		<a
			href="/tournament/generator/"
			class="mt-10 inline-flex min-h-11 items-center rounded-full bg-foreground px-6 py-3 text-sm font-black tracking-wider text-background uppercase"
		>
			Open Tournament Generator
		</a>
	</section>
</main>

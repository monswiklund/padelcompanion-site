<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/shared/utils';
	import { initTheme, toggleTheme } from '$lib/shared/theme';
	import Icons from '$lib/components/Icons.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { fade } from 'svelte/transition';
	import {
		getLastTournamentRoute,
		isRememberedTournamentRoute,
		rememberTournamentRoute
	} from '$lib/tournament/navigation';

	let isNavOpen = $state(false);
	let theme = $state('dark');
	let scrolled = $state(false);
	let tournamentLink = $state('/tournament/generator');
	const pathname = $derived(
		$page.url.pathname.endsWith('/') ? $page.url.pathname : `${$page.url.pathname}/`
	);

	$effect(() => {
		theme = initTheme();
		tournamentLink = getLastTournamentRoute();

		const handleScroll = () => {
			scrolled = window.scrollY > 20;
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	// Keep tournamentLink in sync with routing history
	$effect(() => {
		const pathname = $page.url.pathname;
		if (isRememberedTournamentRoute(pathname)) {
			rememberTournamentRoute(pathname);
			tournamentLink = pathname;
		}
	});

	function handleToggleTheme() {
		theme = toggleTheme();
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
		}
	}

	function closeNav() {
		isNavOpen = false;
	}
</script>

<header
	class={cn(
		'fixed top-0 right-0 left-0 z-[500] transition-all duration-500',
		scrolled
			? 'border-b border-border bg-background/90 py-3 shadow-sm backdrop-blur-md'
			: 'bg-background/70 py-4 backdrop-blur-md'
	)}
>
	<div class="container mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">
		<!-- LOGO -->
		<a href="/" class="group relative z-50 flex min-h-[44px] w-[44px] items-center gap-3 sm:w-auto" onclick={closeNav}>
			<div class="relative">
				<img
					src="/assets/app-icon.jpeg"
					alt="Logo"
					width="40"
					height="40"
					class="h-10 w-10 rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
				/>
				<div
					class="pointer-events-none absolute inset-0 rounded-xl bg-accent/20 opacity-0 transition-opacity group-hover:opacity-100"
				></div>
			</div>
			<span class="hidden font-display text-xl font-black tracking-normal sm:block">
				PADEL<span class="text-accent">COMPANION</span>
			</span>
		</a>

		<!-- DESKTOP NAVIGATION -->
		<nav class="glass hidden items-center gap-1 rounded-xl border border-border p-1 md:flex">
			<a
				href="/#hero"
				onclick={closeNav}
				class="text-foreground-70 hover:bg-secondary hover:text-foreground rounded-lg px-5 py-2.5 font-display text-[10px] font-black tracking-wider uppercase transition-all"
			>
				Home
			</a>

			<a
				href="/#features"
				onclick={closeNav}
				class="text-foreground-70 hover:bg-secondary hover:text-foreground rounded-lg px-5 py-2.5 font-display text-[10px] font-black tracking-wider uppercase transition-all"
			>
				Features
			</a>

			<a
				href="/#tournament-generator"
				onclick={closeNav}
				class="text-foreground-70 hover:bg-secondary hover:text-foreground rounded-lg px-5 py-2.5 font-display text-[10px] font-black tracking-wider uppercase transition-all"
			>
				Tournaments
			</a>

			<a
				href="/#app"
				onclick={closeNav}
				class="text-foreground-70 hover:bg-secondary hover:text-foreground rounded-lg px-5 py-2.5 font-display text-[10px] font-black tracking-wider uppercase transition-all"
			>
				About
			</a>

			<a
				href="/#footer"
				onclick={closeNav}
				class="text-foreground-70 hover:bg-secondary hover:text-foreground rounded-lg px-5 py-2.5 font-display text-[10px] font-black tracking-wider uppercase transition-all"
			>
				Contact
			</a>
		</nav>

		<!-- ACTIONS -->
		<div class="relative z-50 flex items-center gap-4">
			<button
				type="button"
				class="flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-xl border border-border bg-secondary text-foreground transition-all hover:bg-secondary/80"
				onclick={handleToggleTheme}
				title="Toggle theme"
				aria-label="Toggle theme"
			>
				{#if theme === 'dark'}
					<Icons name="moon" size={18} />
				{:else}
					<Icons name="sun" size={18} />
				{/if}
			</button>

			<Button href="/#download" variant="primary" size="sm" class="hidden md:inline-flex">
				Get the App
			</Button>

			<!-- Hamburger Menu (Mobile) -->
			<button
				type="button"
				class="flex h-[44px] w-[44px] cursor-pointer flex-col items-center justify-center gap-1 rounded-xl bg-foreground p-2 text-background transition-all active:scale-95 md:hidden"
				onclick={() => (isNavOpen = !isNavOpen)}
				aria-label="Toggle menu"
			>
				<span
					class={cn(
						'block h-0.5 w-5 rounded-full bg-current transition-all duration-300',
						isNavOpen && 'translate-y-1.5 rotate-45'
					)}
				></span>
				<span
					class={cn(
						'block h-0.5 w-5 rounded-full bg-current transition-all duration-300',
						isNavOpen && 'opacity-0'
					)}
				></span>
				<span
					class={cn(
						'block h-0.5 w-5 rounded-full bg-current transition-all duration-300',
						isNavOpen && '-translate-y-1.5 -rotate-45'
					)}
				></span>
			</button>
		</div>
	</div>

	<!-- MOBILE NAVIGATION OVERLAY -->
	{#if isNavOpen}
		<div
			transition:fade={{ duration: 300 }}
			class="fixed inset-0 z-[400] flex flex-col items-center justify-center gap-8 bg-background/95 backdrop-blur-md md:hidden"
		>
			<a
				href="/#hero"
				class="font-display text-4xl font-black tracking-normal uppercase text-foreground opacity-50 hover:opacity-100"
				onclick={closeNav}
			>
				Home
			</a>

			<a
				href="/#features"
				class="font-display text-4xl font-black tracking-normal uppercase text-foreground opacity-50 hover:opacity-100"
				onclick={closeNav}
			>
				Features
			</a>

			<a
				href="/#tournament-generator"
				class="font-display text-4xl font-black tracking-normal uppercase text-foreground opacity-50 hover:opacity-100"
				onclick={closeNav}
			>
				Tournaments
			</a>

			<a
				href="/#app"
				class="font-display text-4xl font-black tracking-normal uppercase text-foreground opacity-50 hover:opacity-100"
				onclick={closeNav}
			>
				About
			</a>

			<a
				href="/#footer"
				class="font-display text-4xl font-black tracking-normal uppercase text-foreground opacity-50 hover:opacity-100"
				onclick={closeNav}
			>
				Contact
			</a>

			<Button href="/#download" variant="primary" size="lg" onclick={closeNav} class="mt-4">
				Get the App
			</Button>

			<!-- Close button for mobile -->
			<button
				type="button"
				onclick={closeNav}
				aria-label="Close menu"
				class="mt-12 flex h-16 w-16 items-center justify-center rounded-full bg-foreground text-3xl font-light text-background transition-transform hover:scale-110"
			>
				&times;
			</button>
		</div>
	{/if}
</header>

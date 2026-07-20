<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, slide, scale } from 'svelte/transition';
	import { cn } from '$lib/shared/utils';
	import Icons from '$lib/components/Icons.svelte';
	import PhoneMockup from '$lib/components/landing/PhoneMockup.svelte';
	import TournamentGeneratorPreview from '$lib/components/landing/TournamentGeneratorPreview.svelte';
	import StatsPreview from '$lib/components/landing/StatsPreview.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import GlassCard from '$lib/components/ui/GlassCard.svelte';
	import FeatureCard from '$lib/components/ui/FeatureCard.svelte';

	// Scroll tracker for subtle parallax
	let scrollY = $state(0);
	let innerHeight = $state(0);

	const heroOpacity = $derived(Math.max(1 - scrollY / 600, 0.4));
	const heroScale = $derived(1 - Math.min(scrollY / 2000, 0.05));
	const courtParallaxY = $derived(scrollY * 0.15);

	// Cookie banner
	let showCookieBanner = $state(false);

	onMount(() => {
		if (!localStorage.getItem('padelcompanion-cookies')) {
			const bannerTimeout = setTimeout(() => {
				showCookieBanner = true;
			}, 2000);
			return () => clearTimeout(bannerTimeout);
		}
		window.scrollTo({ top: 0, behavior: 'instant' });
	});
</script>

<svelte:head>
	<title>Padel Companion | Free Web Padel Tournament Engine & Live Scoring</title>
	<meta
		name="description"
		content="Run padel tournaments like Americano, Mexicano, and Winners Court in seconds. Real-time live scoring and sync to players' phones."
	/>
	<link rel="canonical" href="https://padelcompanion.se/" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://padelcompanion.se/" />
	<meta property="og:title" content="Padel Companion" />
	<meta
		property="og:description"
		content="Run tournaments in your browser and track scores live on your mobile or smartwatch."
	/>
	<meta property="og:image" content="https://padelcompanion.se/assets/app-icon.jpeg" />
</svelte:head>

<svelte:window bind:scrollY bind:innerHeight />

<div class="noise min-h-dvh overflow-x-clip bg-[#0d1117] selection:bg-[#007AFF] selection:text-black">
	
	<!-- ============================================
       1. HERO SECTION
       ============================================ -->
	<section
		class="relative flex min-h-[calc(100dvh-5rem)] flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16 md:pt-32 md:pb-28"
		id="hero"
	>
		<!-- Ambient Spotlights -->
		<div class="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 bg-[#007AFF]/5 blur-[130px] rounded-full"></div>
		<div class="pointer-events-none absolute top-1/3 -left-40 -z-10 h-[400px] w-[400px] bg-[#64B5F6]/5 blur-[120px] rounded-full"></div>

		<!-- Padel Court Graphic Overlay -->
		<div 
			class="pointer-events-none absolute inset-x-0 bottom-0 -z-20 h-[350px] opacity-15 border-t border-white/5 bg-gradient-to-t from-white/[0.02] to-transparent"
			style="transform: translateY({courtParallaxY}px)"
		>
			<!-- Court lines representation -->
			<div class="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[1000px] h-full border-x border-dashed border-white/10">
				<!-- Service Line -->
				<div class="absolute bottom-1/2 left-0 w-full border-t border-dashed border-white/10"></div>
				<!-- Center service line -->
				<div class="absolute top-0 bottom-0 left-1/2 border-l border-dashed border-white/10"></div>
			</div>
		</div>

		<div class="relative z-10 container mx-auto max-w-[1200px]">
			<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
				
				<!-- Left Text Column -->
				<div 
					class="text-left lg:col-span-7 flex flex-col items-start"
					style="opacity: {heroOpacity}; transform: scale({heroScale})"
				>
					<span class="mb-4 inline-flex items-center gap-2 rounded-full border border-[#007AFF]/20 bg-[#007AFF]/5 px-3 py-1.5 text-[9px] font-black tracking-widest text-[#007AFF] uppercase">
						<span class="h-1.5 w-1.5 rounded-full bg-[#007AFF] animate-pulse"></span>
						The Ultimate Tournament Assistant
					</span>

					<h1 class="mb-6 font-display text-5xl leading-[0.95] font-black tracking-tight text-[#f5f7f8] sm:text-6xl md:text-8xl">
						Play. Sync.<br />
						<span class="bg-gradient-to-r from-[#007AFF] via-[#3888FF] to-[#007AFF] bg-clip-text text-transparent">
							Dominate.
						</span>
					</h1>

					<p class="mb-8 max-w-lg text-base leading-relaxed text-[#a7b0b8] md:text-lg">
						Run padel tournaments in your browser with zero setup. Share active session codes to sync scoreboards and standings live on your players' devices.
					</p>

					<!-- Buttons -->
					<div class="mb-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
						<Button href="/tournament/generator" variant="primary" size="lg" class="w-full sm:w-auto shadow-[0_4px_20px_rgba(0,122,255,0.2)]">
							Launch Engine
						</Button>
						<Button href="#download" variant="glass" size="lg" class="w-full sm:w-auto">
							Get the App
						</Button>
					</div>

					<!-- Badges -->
					<div class="flex items-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
						<!-- App Store Badge -->
						<a href="https://apps.apple.com/se/app/padel-companion/id6755152442" target="_blank" rel="noopener" class="h-[44px] transition-transform hover:scale-102">
							<svg viewBox="0 0 135 40" class="h-full rounded-lg bg-black border border-white/10 px-3 py-1.5 fill-white">
								<path d="M19.1 12.8c0-2.8 2.3-4.2 2.4-4.2-1.3-1.9-3.3-2.1-4-2.2-1.7-.2-3.4 1-4.3 1-.9 0-2.3-1-3.7-.9-1.9 0-3.6 1.1-4.5 2.8-2 3.4-.5 8.5 1.4 11.2.9 1.3 2 2.8 3.5 2.7 1.4-.1 1.9-.9 3.6-.9s2.1.9 3.6.9c1.5 0 2.5-1.3 3.4-2.7 1.1-1.6 1.5-3.1 1.5-3.2 0 0-3-1.1-3-4.5zM16.1 4.7c.8-1 1.3-2.3 1.1-3.7-1.2.1-2.7.8-3.5 1.8-.8.9-1.4 2.3-1.2 3.6 1.3.1 2.7-.7 3.6-1.7z" />
								<text x="32" y="18" font-size="7" font-weight="bold" font-family="sans-serif" fill="#a7b0b8">Download on the</text>
								<text x="32" y="30" font-size="11" font-weight="900" font-family="sans-serif">App Store</text>
							</svg>
						</a>
						
						<!-- Google Play Badge -->
						<a href="mailto:wiklund.labs@gmail.com?subject=Android%20Beta%20Access" class="h-[44px] transition-transform hover:scale-102">
							<svg viewBox="0 0 135 40" class="h-full rounded-lg bg-black border border-white/10 px-3 py-1.5 fill-white">
								<path d="M8 5v30l13-15z" fill="#42A5F5" />
								<path d="M21 20l5 5 4-7z" fill="#FFB300" />
								<path d="M8 5l18 10 4-2z" fill="#FF3B30" />
								<path d="M8 35l18-10 4 2z" fill="#AF52DE" />
								<text x="36" y="18" font-size="7" font-weight="bold" font-family="sans-serif" fill="#a7b0b8">Get it on</text>
								<text x="36" y="30" font-size="11" font-weight="900" font-family="sans-serif">Google Play</text>
							</svg>
						</a>
					</div>
				</div>

				<!-- Right Phone Mockup Column -->
				<div class="lg:col-span-5 flex justify-center relative">
					<!-- Visual Glow Spotlight -->
					<div class="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-[#007AFF]/10 blur-[90px]"></div>
					
					<!-- 3D Perspective Wrapper -->
					<div style="perspective: 1000px">
						<div class="transition-transform duration-700 hover:rotate-y-6 hover:rotate-x-2 cursor-grab active:cursor-grabbing">
							<PhoneMockup />
						</div>
					</div>
				</div>

			</div>
		</div>
	</section>

	<!-- ============================================
       2. FEATURE ROW
       ============================================ -->
	<section class="relative px-6 py-24 border-t border-white/5 bg-gradient-to-b from-[#0d1117] to-[#161b22]" id="features">
		<div class="container mx-auto max-w-[1200px]">
			<!-- Header -->
			<div class="mx-auto mb-20 max-w-2xl text-center">
				<span class="mb-4 inline-block text-[9px] font-black tracking-widest text-[#007AFF] uppercase">Features</span>
				<h2 class="font-display text-4xl font-black text-[#f5f7f8] sm:text-5xl">
					Powering your padel events
				</h2>
			</div>

			<!-- Grid -->
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
				<FeatureCard
					icon="trophy"
					title="Instant Tournaments"
					description="Run Americano, Mexicano, Winners Court, Division leagues, and Cup Brackets in seconds."
				/>
				<FeatureCard
					icon="globe"
					title="Live Cloud Sync"
					description="Generate a share code. All players sync live standings, courts, and score sheets on their devices."
				/>
				<FeatureCard
					icon="smartphone"
					title="Smartwatch Scoring"
					description="Score matches directly from your wrist using our Apple Watch and Wear OS applications."
				/>
				<FeatureCard
					icon="barchart"
					title="Analytics & History"
					description="Log completed tournament records, partner win-rates, streaks, and achievements."
				/>
			</div>
		</div>
	</section>

	<!-- ============================================
       3. TOURNAMENT GENERATOR SECTION
       ============================================ -->
	<section class="relative px-6 py-32 border-t border-white/5 bg-[#161b22]" id="tournament-generator">
		<!-- Backdrop Glow -->
		<div class="pointer-events-none absolute right-0 top-1/4 -z-10 h-[500px] w-[500px] bg-[#007AFF]/3 blur-[120px] rounded-full"></div>
		
		<div class="container mx-auto max-w-[1200px]">
			<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
				
				<!-- Left Text Column -->
				<div class="lg:col-span-6 flex flex-col items-start">
					<span class="mb-4 inline-flex items-center gap-2 rounded-full border border-[#007AFF]/20 bg-[#007AFF]/5 px-3 py-1.5 text-[9px] font-black tracking-widest text-[#007AFF] uppercase">
						Browser Tournament Engine
					</span>
					<h2 class="mb-6 font-display text-4xl leading-tight font-black text-[#f5f7f8] sm:text-5xl">
						Run your tournament with zero friction
					</h2>
					<p class="mb-8 text-base leading-relaxed text-[#a7b0b8]">
						Our powerful browser engine handles player rotations, court pairings, byes, and live standings automatically. 100% free with no account setup.
					</p>

					<!-- Checklist -->
					<ul class="mb-8 space-y-3.5 p-0 list-none">
						{#each [
							'Supports Americano, Mexicano, Winners Court, Division Round Robin, & Cup Brackets',
							'Multiplayer real-time cloud sync for live spectators',
							'Fair matchmaking rotations preventing immediate partner repeats',
							'Export summaries, save local history, or print PDF schedules'
						] as point}
							<li class="flex items-start gap-3 text-sm text-[#f5f7f8]">
								<span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#007AFF]/10 border border-[#007AFF]/30 text-[#007AFF]">
									<Icons name="check" class="h-3 w-3" />
								</span>
								<span>{point}</span>
							</li>
						{/each}
					</ul>

					<Button href="/tournament/generator" variant="primary" size="lg">
						Launch Web Engine
					</Button>
				</div>

				<!-- Right Generator Preview Column -->
				<div class="lg:col-span-6">
					<TournamentGeneratorPreview />
				</div>

			</div>
		</div>
	</section>

	<!-- ============================================
       4. STATISTIK / PROGRESS SECTION
       ============================================ -->
	<section class="relative px-6 py-32 border-t border-white/5 bg-gradient-to-b from-[#161b22] to-[#0d1117]" id="app">
		<!-- Backdrop Glow -->
		<div class="pointer-events-none absolute left-0 bottom-1/4 -z-10 h-[500px] w-[500px] bg-[#64B5F6]/3 blur-[120px] rounded-full"></div>

		<div class="container mx-auto max-w-[1200px]">
			<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
				
				<!-- Left Stats Preview Column -->
				<div class="lg:col-span-5 order-2 lg:order-1">
					<StatsPreview />
				</div>

				<!-- Right Text Column -->
				<div class="lg:col-span-7 order-1 lg:order-2 flex flex-col items-start">
					<span class="mb-4 inline-flex items-center gap-2 rounded-full border border-[#64B5F6]/20 bg-[#64B5F6]/5 px-3 py-1.5 text-[9px] font-black tracking-widest text-[#64B5F6] uppercase">
						Mobile App Companion
					</span>
					<h2 class="mb-6 font-display text-4xl leading-tight font-black text-[#f5f7f8] sm:text-5xl">
						Track your personal progress
					</h2>
					<p class="mb-8 text-base leading-relaxed text-[#a7b0b8]">
						Download the app to sync directly with active web engine sessions, log tournament achievements, track partner compatibility ratings, and watch your form improve.
					</p>

					<!-- Metric Highlight Row -->
					<div class="grid grid-cols-2 gap-4 w-full mb-8">
						<GlassCard variant="hover" padding="sm" class="flex flex-col gap-2">
							<div class="flex items-center justify-between">
								<h4 class="text-xs font-black text-white">Challenges</h4>
								<Icons name="calendar" class="h-4 w-4 text-[#007AFF]" />
							</div>
							<p class="text-xs text-muted-foreground leading-relaxed">Anta utmaningar, slutför veckans mål med kompisar och tjäna XP.</p>
						</GlassCard>

						<GlassCard variant="hover" padding="sm" class="flex flex-col gap-2">
							<div class="flex items-center justify-between">
								<h4 class="text-xs font-black text-white">Achievements</h4>
								<Icons name="crown" class="h-4 w-4 text-[#AF52DE]" />
							</div>
							<p class="text-xs text-muted-foreground leading-relaxed">Unlock profile badges as you rack up win streaks and final court placements.</p>
						</GlassCard>
					</div>
				</div>

			</div>
		</div>
	</section>

	<!-- ============================================
       5. FINAL CTA
       ============================================ -->
	<section class="relative px-6 py-28 border-t border-white/5" id="download">
		<div class="container mx-auto max-w-[1100px]">
			<!-- Glowing horizontal card -->
			<GlassCard variant="premium" padding="lg" class="relative overflow-hidden w-full border border-[#007AFF]/20 shadow-[0_15px_60px_rgba(0,122,255,0.06)]">
				
				<!-- Ambient internal glows -->
				<div class="pointer-events-none absolute -right-24 top-1/2 -translate-y-1/2 -z-10 h-96 w-96 rounded-full bg-[#007AFF]/10 blur-[90px]"></div>
				
				<div class="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
					
					<!-- Left Info -->
					<div class="lg:col-span-8 text-left flex flex-col items-start">
						<h2 class="mb-4 font-display text-3xl leading-[1.05] font-black text-[#f5f7f8] sm:text-5xl">
							Ready to run your next<br />padel tournament?
						</h2>
						<p class="mb-8 max-w-lg text-sm text-[#a7b0b8] leading-relaxed">
							Launch the free web generator in your browser right now, or download the mobile app to sync matches and track your personal history.
						</p>

						<!-- Download Buttons -->
						<div class="flex flex-wrap items-center gap-4">
							<Button href="/tournament/generator" variant="primary" size="md">
								Launch Engine
							</Button>
							
							<div class="flex items-center gap-3">
								<svg viewBox="0 0 135 40" class="h-9 rounded-lg bg-black border border-white/10 px-3 py-1 fill-white opacity-80 hover:opacity-100 transition-opacity">
									<path d="M19.1 12.8c0-2.8 2.3-4.2 2.4-4.2-1.3-1.9-3.3-2.1-4-2.2-1.7-.2-3.4 1-4.3 1-.9 0-2.3-1-3.7-.9-1.9 0-3.6 1.1-4.5 2.8-2 3.4-.5 8.5 1.4 11.2.9 1.3 2 2.8 3.5 2.7 1.4-.1 1.9-.9 3.6-.9s2.1.9 3.6.9c1.5 0 2.5-1.3 3.4-2.7 1.1-1.6 1.5-3.1 1.5-3.2 0 0-3-1.1-3-4.5zM16.1 4.7c.8-1 1.3-2.3 1.1-3.7-1.2.1-2.7.8-3.5 1.8-.8.9-1.4 2.3-1.2 3.6 1.3.1 2.7-.7 3.6-1.7z" />
									<text x="32" y="18" font-size="7" font-weight="bold" font-family="sans-serif" fill="#a7b0b8">Download on the</text>
									<text x="32" y="30" font-size="11" font-weight="900" font-family="sans-serif">App Store</text>
								</svg>

								<svg viewBox="0 0 135 40" class="h-9 rounded-lg bg-black border border-white/10 px-3 py-1 fill-white opacity-80 hover:opacity-100 transition-opacity">
									<path d="M8 5v30l13-15z" fill="#42A5F5" />
									<path d="M21 20l5 5 4-7z" fill="#FFB300" />
									<path d="M8 5l18 10 4-2z" fill="#FF3B30" />
									<path d="M8 35l18-10 4 2z" fill="#AF52DE" />
									<text x="36" y="18" font-size="7" font-weight="bold" font-family="sans-serif" fill="#a7b0b8">Get it on</text>
									<text x="36" y="30" font-size="11" font-weight="900" font-family="sans-serif">Google Play</text>
								</svg>
							</div>
						</div>
					</div>

					<!-- Right Padel Ball Graphic -->
					<div class="lg:col-span-4 flex justify-center lg:justify-end relative">
						<!-- Padel Ball -->
						<div class="relative h-28 w-28 rounded-full bg-[#007AFF] shadow-[0_0_50px_rgba(0,122,255,0.5)] flex items-center justify-center overflow-hidden border border-white/10">
							<!-- Padel ball curved line overlay -->
							<div class="absolute inset-0 border-2 border-dashed border-white/40 rounded-full scale-[0.8] rotate-12"></div>
							<div class="absolute inset-0 border border-white/30 rounded-full scale-[0.6] -rotate-45"></div>
							<!-- Inner core texture -->
							<div class="h-24 w-24 rounded-full border border-black/5"></div>
						</div>
						<!-- Dynamic air/speed dust lines -->
						<div class="absolute -left-6 top-1/2 h-0.5 w-16 bg-gradient-to-r from-transparent to-[#007AFF]/40 rounded-full"></div>
						<div class="absolute -left-12 top-1/3 h-0.5 w-16 bg-gradient-to-r from-transparent to-[#007AFF]/20 rounded-full"></div>
						<div class="absolute -left-8 bottom-1/3 h-0.5 w-16 bg-gradient-to-r from-transparent to-[#007AFF]/30 rounded-full"></div>
					</div>

				</div>
			</GlassCard>
		</div>
	</section>

	<!-- ============================================
       6. PARTNERS SECTION
       ============================================ -->
	<section class="border-t border-white/5 px-6 py-20" id="partners">
		<div class="container mx-auto max-w-[1200px]">
			<div class="mx-auto mb-12 max-w-2xl text-center">
				<p class="mb-2 text-[9px] font-black tracking-widest text-[#a7b0b8] uppercase">Partnerships</p>
				<h3 class="font-display text-2xl font-black text-white tracking-tight">
					Grow with us
				</h3>
			</div>
			
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto opacity-50 hover:opacity-85 transition-opacity duration-500">
				{#each Array(3)}
					<a
						href="mailto:wiklund.labs@gmail.com"
						class="flex h-24 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01] px-6 text-center transition-all select-none hover:scale-[1.01] hover:border-[#007AFF]/20 hover:bg-white/[0.02]"
					>
						<span class="font-display text-xs font-black tracking-wider text-[#f5f7f8] uppercase">LAUNCH PARTNER</span>
						<span class="mt-1 text-[8px] font-black tracking-wider text-muted-foreground uppercase">Join the ecosystem</span>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- ============================================
       7. COOKIE CONSENT BANNER
       ============================================ -->
	{#if showCookieBanner}
		<div
			transition:slide={{ duration: 400 }}
			class="fixed bottom-4 right-4 z-[900] w-[320px] select-none"
		>
			<GlassCard variant="premium" class="p-4 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
				<h4 class="mb-1 font-display text-sm font-black text-white">Cookies & Privacy</h4>
				<p class="mb-4 text-xs leading-relaxed text-muted-foreground">
					We use local storage for your preferences and privacy-friendly analytics. No cross-site tracking.
				</p>
				<div class="flex justify-end gap-3">
					<Button
						variant="primary"
						size="sm"
						onclick={() => {
							localStorage.setItem('padelcompanion-cookies', 'accepted');
							showCookieBanner = false;
						}}
					>
						Got it
					</Button>
				</div>
			</GlassCard>
		</div>
	{/if}

</div>

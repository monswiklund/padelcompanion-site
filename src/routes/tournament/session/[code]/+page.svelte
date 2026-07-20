<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { tournament } from '$lib/stores/tournament.svelte';
	import { CloudService } from '$lib/tournament/sync/cloud';
	import { getTournamentRoute } from '$lib/tournament/navigation';
	import { getCourtDisplayName } from '$lib/tournament/courtNames';
	import Button from '$lib/components/ui/Button.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	const POLL_MS = 4000;
	const shareCode = $derived($page.params.code);

	let status = $state<'loading' | 'ready' | 'error'>('loading');
	let errorMessage = $state('');
	let liveState = $state<any>(null);
	let lastUpdated = $state('');
	let pollId: number | null = null;

	const activeRound = $derived(liveState?.schedule?.[liveState.schedule.length - 1] ?? null);
	const upcomingRounds = $derived(
		(liveState?.allRounds ?? []).slice(liveState?.schedule?.length ?? 0)
	);
	const standings = $derived(
		[...(liveState?.leaderboard ?? [])].sort((a, b) => {
			if ((b.points ?? 0) !== (a.points ?? 0)) return (b.points ?? 0) - (a.points ?? 0);
			if ((b.wins ?? 0) !== (a.wins ?? 0)) return (b.wins ?? 0) - (a.wins ?? 0);
			return (b.points ?? 0) - (b.pointsLost ?? 0) - ((a.points ?? 0) - (a.pointsLost ?? 0));
		})
	);

	onMount(() => {
		loadLiveSnapshot(false);
		pollId = window.setInterval(() => loadLiveSnapshot(true), POLL_MS);
	});

	onDestroy(() => {
		if (pollId) window.clearInterval(pollId);
	});

	async function loadLiveSnapshot(silent: boolean) {
		const code = shareCode?.trim().toUpperCase();
		if (!code) {
			status = 'error';
			errorMessage = 'Missing tournament code.';
			return;
		}

		try {
			const snapshot = await CloudService.getSession(code);
			liveState = CloudService.restoreState(snapshot);
			lastUpdated = new Date(snapshot.exportedAt || Date.now()).toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit'
			});
			status = 'ready';
			errorMessage = '';
		} catch (error) {
			if (!silent) status = 'error';
			errorMessage = error instanceof Error ? error.message : 'Failed to load tournament';
		}
	}

	function getCourtName(court: number, division?: string | null) {
		return getCourtDisplayName(liveState, court, division);
	}

	function formatTeam(players: Array<{ name: string }> = []) {
		return players.map((player) => player.name).join(' / ');
	}

	function openEditableCopy() {
		if (!liveState) return;
		tournament.setState(liveState);
		goto(getTournamentRoute(liveState));
	}
</script>

<svelte:head>
	<title>Live Tournament | Padel Companion</title>
</svelte:head>

<div class="noise min-h-dvh bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
	<div class="mx-auto max-w-6xl" in:fade>
		{#if status === 'loading'}
			<div class="flex min-h-[70dvh] items-center justify-center">
				<div class="space-y-5 text-center">
					<div
						class="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-white/10 border-t-accent"
					></div>
					<div class="space-y-1">
						<h1 class="font-display text-3xl font-black tracking-normal text-white">
							Live session
						</h1>
						<p class="text-[10px] font-black tracking-wider text-muted-foreground uppercase">
							Fetching {shareCode?.toUpperCase()}
						</p>
					</div>
				</div>
			</div>
		{:else if status === 'error'}
			<div class="flex min-h-[70dvh] items-center justify-center">
				<div class="w-full max-w-md rounded-card border border-border bg-card/80 p-8 text-center">
					<div class="space-y-2">
						<h1 class="font-display text-2xl font-black tracking-normal text-white">Sync failed</h1>
						<p class="text-xs font-black tracking-wider text-[#FF3B30] uppercase">
							{errorMessage}
						</p>
					</div>
					<div class="mt-8">
						<Button variant="secondary" onclick={() => goto('/tournament/history')} fullWidth>
							Back to history
						</Button>
					</div>
				</div>
			</div>
		{:else if liveState}
			<header
				class="mb-8 flex flex-col gap-5 border-b border-border pb-6 md:flex-row md:items-end md:justify-between"
			>
				<div class="space-y-2">
					<div
						class="inline-flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/10 px-3 py-1.5 text-[10px] font-black tracking-wider text-accent uppercase"
					>
						<span class="h-2 w-2 animate-pulse rounded-full bg-accent"></span>
						Live spectator
					</div>
					<h1 class="font-display text-4xl leading-tight font-black tracking-normal text-white">
						{liveState.tournamentName || 'Arena session'}
					</h1>
					<p class="text-[11px] font-black tracking-wider text-muted-foreground uppercase">
						Code {shareCode?.toUpperCase()} · Updated {lastUpdated}
					</p>
				</div>
				<button
					type="button"
					class="rounded-xl border border-border bg-foreground/[0.04] px-5 py-3 text-[10px] font-black tracking-wider text-foreground/60 uppercase transition hover:bg-foreground/10 hover:text-foreground"
					onclick={openEditableCopy}
				>
					Open editable copy
				</button>
			</header>

			<div class="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.8fr)]">
				<main class="space-y-8">
					<section class="rounded-card border border-border bg-card/50">
						<div class="border-b border-border p-5">
							<h2 class="font-display text-2xl font-black tracking-normal text-white">
								{activeRound?.name || `Round ${activeRound?.number ?? 1}`}
							</h2>
							<p class="text-[10px] font-black tracking-wider text-muted-foreground uppercase">
								{activeRound?.completed ? 'Completed' : 'Now playing'}
							</p>
						</div>
						<div class="divide-y divide-border">
							{#each activeRound?.matches ?? [] as match}
								{@const matchDivision =
									liveState.format === 'division' ? (match.team1[0] as any)?.division || 'A' : null}
								<div class="grid gap-3 p-5 sm:grid-cols-[110px_1fr_auto_1fr] sm:items-center">
									<div
										class="text-[10px] font-black tracking-wider text-muted-foreground uppercase"
									>
										{getCourtName(match.court, matchDivision)}
									</div>
									<div class="text-sm font-black tracking-normal text-white sm:text-right">
										{formatTeam(match.team1)}
									</div>
									<div
										class="justify-self-start rounded-lg border border-border bg-foreground/5 px-3 py-1 font-display text-lg font-black tabular-nums sm:justify-self-center"
									>
										{match.score1 ?? '-'} - {match.score2 ?? '-'}
									</div>
									<div class="text-sm font-black tracking-normal text-white/70">
										{formatTeam(match.team2)}
									</div>
								</div>
							{/each}
							{#if !activeRound?.matches?.length}
								<div
									class="p-8 text-center text-xs font-black tracking-wider text-muted-foreground uppercase"
								>
									No active round yet
								</div>
							{/if}
						</div>
					</section>

					{#if upcomingRounds.length}
						<section class="rounded-card border border-border bg-card/30 p-5">
							<h2
								class="mb-4 text-[11px] font-black tracking-wider text-muted-foreground uppercase"
							>
								Upcoming
							</h2>
							<div class="grid gap-3 md:grid-cols-2">
								{#each upcomingRounds.slice(0, 4) as round}
									<div class="rounded-xl border border-border bg-foreground/[0.02] p-4">
										<div class="mb-2 text-sm font-black text-white">
											{round.name || `Round ${round.number}`}
										</div>
										<div class="text-[10px] font-semibold text-muted-foreground">
											{round.matches.length} matches
										</div>
									</div>
								{/each}
							</div>
						</section>
					{/if}
				</main>

				<aside class="h-fit rounded-card border border-border bg-card/50">
					<div class="border-b border-border p-5">
						<h2 class="font-display text-xl font-black tracking-normal text-white">Standings</h2>
						<p class="text-[10px] font-black tracking-wider text-muted-foreground uppercase">
							{standings.length} active
						</p>
					</div>
					<div class="divide-y divide-border">
						{#each standings.slice(0, 12) as player, index}
							<div class="grid grid-cols-[44px_1fr_auto] items-center gap-3 p-4">
								<span
									class="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-xs font-black text-background"
									>{index + 1}</span
								>
								<span class="min-w-0 text-xs font-black break-words text-white">
									{player.name}
								</span>
								<span class="text-sm font-black text-accent tabular-nums">
									{player.points ?? 0}
								</span>
							</div>
						{/each}
					</div>
				</aside>
			</div>
		{/if}
	</div>
</div>

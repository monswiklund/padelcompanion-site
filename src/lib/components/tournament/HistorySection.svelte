<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { getHistory, deleteFromHistory } from '$lib/tournament/history/repository';
	import {
		importTournamentData,
		downloadTournamentData
	} from '$lib/tournament/ui/setup/exportShare';
	import { showToast } from '$lib/shared/utils';
	import { showConfirmModal } from '$lib/tournament/core/modals';
	import { CloudService } from '$lib/tournament/sync/cloud';
	import { getTournamentRoute } from '$lib/tournament/navigation';
	import { tournament } from '$lib/stores/tournament.svelte';
	import Icons from '../Icons.svelte';
	import { fade, scale } from 'svelte/transition';
	import { Dialog } from 'bits-ui';
	import GlassCard from '../ui/GlassCard.svelte';
	import Button from '../ui/Button.svelte';

	interface HistoryItem {
		id: string;
		savedAt: string;
		summary: {
			name: string;
			notes: string;
			format: string;
			winner: string;
			playerCount: number;
			roundCount: number;
		};
		data: any;
	}

	let history = $state<HistoryItem[]>([]);
	let search = $state('');
	let isOpenByCode = $state(false);
	let shareCode = $state('');
	let isLoadingCode = $state(false);

	onMount(() => {
		loadHistory();
	});

	function loadHistory() {
		history = getHistory() as HistoryItem[];
	}

	function handleLoad(item: HistoryItem) {
		showConfirmModal(
			'Restore Tournament',
			`Switch to "${item.summary.name || 'Untitled'}"? Current progress will be overwritten.`,
			'Restore',
			() => {
				tournament.setState(item.data);
				showToast('Tournament restored', 'success');
				const targetRoute = getTournamentRoute(item.data);
				goto(targetRoute);
			}
		);
	}

	function applyImportedState(data: any, successMessage: string) {
		tournament.setState(data);
		showToast(successMessage, 'success');
		goto(getTournamentRoute(data));
	}

	async function handleLoadByCode() {
		const code = shareCode.trim();
		if (!code) {
			showToast('Enter a share code', 'warning');
			return;
		}

		isLoadingCode = true;
		try {
			const snapshot = await CloudService.getSession(code);
			const restoredState = CloudService.restoreState(snapshot);
			applyImportedState(restoredState, 'Tournament synced from cloud');
			isOpenByCode = false;
			shareCode = '';
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to load tournament';
			showToast(message, 'error');
		} finally {
			isLoadingCode = false;
		}
	}

	async function handleImportFile(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		target.value = '';
		if (!file) return;

		try {
			const text = await file.text();
			const restoredState = importTournamentData(text);
			applyImportedState(restoredState, 'Tournament imported');
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Failed to import tournament';
			showToast(message, 'error');
		}
	}

	function handleDelete(id: string, name: string) {
		showConfirmModal(
			'Delete entry',
			`Permanently remove "${name || 'this tournament'}" from history?`,
			'Delete Permanently',
			() => {
				deleteFromHistory(id);
				loadHistory();
				showToast('Removed from history', 'success');
			},
			true
		);
	}

	const filteredHistory = $derived(
		history.filter((item) => {
			const query = search.toLowerCase();
			return (
				(item.summary.name || '').toLowerCase().includes(query) ||
				(item.summary.winner || '').toLowerCase().includes(query) ||
				(item.summary.format || '').toLowerCase().includes(query)
			);
		})
	);
</script>

<section class="relative z-20 animate-fade-in text-left">
	<!-- Header -->
	<div
		class="mb-10 flex flex-col justify-between gap-6 border-b border-white/5 pb-8 sm:flex-row sm:items-end"
	>
		<div class="space-y-1">
			<h3 class="font-display text-3xl font-black tracking-normal text-white">
				Tournament History
			</h3>
			<p class="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
				Manage your past {history.length} sessions
			</p>
		</div>

		<div class="group relative w-full sm:w-80">
			<div
				class="absolute top-1/2 left-4 flex -translate-y-1/2 items-center justify-center text-muted-foreground/50 transition-colors group-focus-within:text-[#007AFF]"
			>
				<Icons name="search" size={18} />
			</div>
			<input
				type="search"
				enterkeyhint="search"
				placeholder="Search sessions..."
				class="w-full rounded-xl border border-white/10 bg-black/40 py-3.5 pr-4 pl-12 text-sm font-semibold tracking-wider text-white transition-colors placeholder:text-muted-foreground focus:border-[#007AFF] focus:outline-none"
				bind:value={search}
			/>
		</div>
	</div>

	<!-- Cloud & Import Row -->
	<div class="mb-10 flex flex-wrap gap-4">
		<Button variant="primary" size="sm" onclick={() => (isOpenByCode = true)} class="px-6 py-2.5 bg-[#007AFF] text-[#020607] hover:bg-[#007AFF] font-black uppercase tracking-wider text-xs">
			<div class="flex items-center gap-2">
				<Icons name="cloud" size={14} />
				SYNC FROM CLOUD
			</div>
		</Button>

		<label class="inline-flex cursor-pointer">
			<input type="file" accept="application/json" class="sr-only" onchange={handleImportFile} />
			<span
				class="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/40 px-6 py-2.5 text-[10px] font-black tracking-wider text-white hover:bg-black/60 uppercase transition-all select-none"
			>
				<Icons name="upload" size={14} />
				IMPORT JSON
			</span>
		</label>
	</div>

	{#if history.length === 0}
		<GlassCard variant="premium" padding="lg" class="py-20 text-center border border-white/10 relative overflow-hidden">
			<div class="pointer-events-none absolute -right-20 -top-20 -z-10 h-64 w-64 rounded-full bg-[#007AFF]/5 blur-[80px]"></div>
			<div class="mb-6 flex justify-center opacity-25">
				<Icons name="history" size={48} class="text-[#007AFF]" />
			</div>
			<p
				class="mx-auto max-w-sm text-sm leading-relaxed font-semibold tracking-wider text-muted-foreground uppercase"
			>
				No local history detected. Sync from cloud or import a backup to get started.
			</p>
		</GlassCard>
	{:else}
		<!-- Table Container inside GlassCard -->
		<GlassCard variant="premium" padding="none" class="overflow-hidden border border-white/10">
			<div class="overflow-x-auto">
				<table class="w-full border-collapse">
					<thead>
						<tr class="border-b border-white/5 bg-white/[0.01]">
							<th
								class="px-6 py-4 text-left text-[9px] font-black tracking-wider text-muted-foreground uppercase"
							>
								Date
							</th>
							<th
								class="px-6 py-4 text-left text-[9px] font-black tracking-wider text-muted-foreground uppercase"
							>
								Tournament
							</th>
							<th
								class="hidden px-6 py-4 text-left text-[9px] font-black tracking-wider text-muted-foreground uppercase sm:table-cell"
							>
								Format
							</th>
							<th
								class="hidden px-6 py-4 text-left text-[9px] font-black tracking-wider text-muted-foreground uppercase md:table-cell"
							>
								Winner
							</th>
							<th
								class="px-6 py-4 text-right text-[9px] font-black tracking-wider text-muted-foreground uppercase"
							>
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{#each filteredHistory as item (item.id)}
							<tr
								class="group/row border-b border-white/5 transition-all last:border-b-0 hover:bg-white/[0.02]"
							>
								<td
									class="px-6 py-5 text-[10px] font-black tracking-wider text-muted-foreground uppercase"
								>
									{new Date(item.savedAt).toLocaleDateString()}
								</td>
								<td class="px-6 py-5">
									<div class="text-xs font-black tracking-wider text-white uppercase">
										{item.summary.name || 'UNTITLED SESSION'}
									</div>
									<div class="mt-1 text-[9px] tracking-wider text-muted-foreground uppercase">
										{item.summary.playerCount} Players · {item.summary.roundCount} Rounds
									</div>
								</td>
								<td class="hidden px-6 py-5 sm:table-cell">
									<span
										class="rounded-lg border border-[#007AFF]/20 bg-[#007AFF]/5 px-2.5 py-1 text-[8px] font-black tracking-wider text-[#007AFF] uppercase"
									>
										{item.summary.format === 'winners-court' ? 'Winners Court' : item.summary.format}
									</span>
								</td>
								<td class="hidden px-6 py-5 md:table-cell">
									{#if item.summary.winner}
										<div
											class="flex items-center gap-2 text-[10px] font-black tracking-wider text-[#007AFF] uppercase"
										>
											<Icons name="award" size={14} />
											{item.summary.winner}
										</div>
									{:else}
										<span
											class="text-[10px] font-black tracking-wider text-muted-foreground uppercase"
											>Ongoing</span
										>
									{/if}
								</td>
								<td class="px-6 py-5 text-right">
									<div class="flex items-center justify-end gap-2">
										<button
											onclick={() => handleLoad(item)}
											class="min-h-[44px] rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-[10px] font-black tracking-wider text-white uppercase transition-all hover:bg-[#007AFF] hover:text-black hover:border-transparent cursor-pointer"
										>
											Restore
										</button>
										<button
											onclick={() =>
												downloadTournamentData(
													`${item.summary.name || 'tournament'}.json`,
													item.data
												)}
											class="min-h-[44px] min-w-[44px] rounded-xl border border-white/10 bg-black/40 p-2.5 text-muted-foreground transition-all hover:bg-white/10 hover:text-white cursor-pointer"
											title="Download JSON"
										>
											<Icons name="download" size={12} />
										</button>
										<button
											onclick={() => handleDelete(item.id, item.summary.name)}
											class="min-h-[44px] min-w-[44px] rounded-xl border border-white/10 bg-black/40 p-2.5 text-muted-foreground transition-all hover:bg-[#FF3B30]/10 hover:text-[#FF3B30] hover:border-[#FF3B30]/20 cursor-pointer"
											title="Delete"
										>
											<Icons name="trash" size={12} />
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			{#if filteredHistory.length === 0}
				<div
					class="py-16 text-center text-[10px] font-black tracking-wider text-muted-foreground uppercase"
				>
					No results found for "{search}"
				</div>
			{/if}
		</GlassCard>
	{/if}
</section>

<!-- Open with Code Modal -->
<Dialog.Root
	open={isOpenByCode}
	onOpenChange={(v) => !v && !isLoadingCode && (isOpenByCode = false)}
>
	<Dialog.Portal>
		<Dialog.Overlay forceMount>
			{#snippet child({ props, open: isModalOpen })}
				{#if isModalOpen}
					<div
						{...props}
						transition:fade={{ duration: 250 }}
						class="fixed inset-0 z-[800] bg-black/60 backdrop-blur-sm"
					></div>
				{/if}
			{/snippet}
		</Dialog.Overlay>
		<Dialog.Content forceMount>
			{#snippet child({ props, open: isModalOpen })}
				{#if isModalOpen}
					<div
						{...props}
						transition:scale={{ duration: 300, start: 0.95, opacity: 0 }}
						class="fixed top-1/2 left-1/2 z-[801] max-h-[90dvh] w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-[#161b22] p-6 shadow-2xl text-left"
					>
						<Dialog.Title
							class="mb-1 font-display text-xl font-black tracking-normal text-white uppercase"
						>
							Cloud Sync
						</Dialog.Title>
						<p class="mb-6 text-[9px] font-black tracking-wider text-muted-foreground uppercase">
							Restore Session via Code
						</p>

						<div class="mb-8 space-y-4">
							<p class="text-xs leading-relaxed font-semibold text-muted-foreground">
								Enter the unique share code from your other device to continue the session here.
							</p>
							<div class="group relative">
								<input
									type="text"
									enterkeyhint="done"
									placeholder="Code..."
									class="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-4 text-center text-xl font-black tracking-wider text-[#007AFF] uppercase transition-colors placeholder:text-white/20 focus:border-[#007AFF] focus:outline-none"
									bind:value={shareCode}
									oninput={() => (shareCode = shareCode.toUpperCase())}
								/>
							</div>
						</div>

						<div class="flex items-center gap-3">
							<button
								disabled={isLoadingCode}
								onclick={() => (isOpenByCode = false)}
								class="min-h-[44px] flex-1 py-3 text-[10px] font-black tracking-wider text-muted-foreground uppercase transition-colors hover:text-white cursor-pointer"
							>
								Cancel
							</button>
							<Button
								variant="primary"
								size="md"
								onclick={handleLoadByCode}
								disabled={isLoadingCode || !shareCode.trim()}
								class="flex-[2] py-3 bg-[#007AFF] text-[#020607] hover:bg-[#007AFF]"
							>
								{isLoadingCode ? 'Syncing...' : 'Restore Session'}
							</Button>
						</div>
					</div>
				{/if}
			{/snippet}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

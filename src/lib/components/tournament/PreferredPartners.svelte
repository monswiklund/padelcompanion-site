<script lang="ts">
	import { Select } from 'bits-ui';
	import { showToast } from '$lib/shared/utils';

	interface Pair {
		id: string;
		player1Id: string | number;
		player2Id: string | number;
	}

	interface Player {
		id: string | number;
		name: string;
	}

	interface Props {
		pairs: Pair[];
		players: Player[];
		onAddPair: (p1Id: string | number, p2Id: string | number) => void;
		onRemovePair: (pairId: string) => void;
	}

	const { pairs, players, onAddPair, onRemovePair }: Props = $props();

	let isAdding = $state(false);
	let p1 = $state<string | number>('');
	let p2 = $state<string | number>('');

	function getAvailablePlayers(currentSelection: string | number | null) {
		const pairedIds = new Set<string | number>();
		pairs.forEach((p) => {
			pairedIds.add(p.player1Id);
			pairedIds.add(p.player2Id);
		});

		return players.filter((p) => !pairedIds.has(p.id) || p.id === currentSelection);
	}

	function handleAdd() {
		if (p1 && p2 && p1 !== p2) {
			onAddPair(p1, p2);
			showToast('Partner pair added', 'success');
			p1 = '';
			p2 = '';
			isAdding = false;
		}
	}

	function getPlayerName(id: string | number) {
		return players.find((p) => p.id === id)?.name || 'Unknown';
	}
</script>

<div class="mt-4 border-t border-border pt-4 font-sans select-none">
	{#if !isAdding && pairs.length === 0}
		<div class="text-center">
			<button
				type="button"
				onclick={() => (isAdding = true)}
				class="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-foreground/5 px-4 py-2 text-xs font-black tracking-wider text-foreground uppercase transition-all duration-200 hover:border-accent hover:text-accent"
			>
				+ Add Fixed Pair
			</button>
		</div>
	{/if}

	{#if isAdding || pairs.length > 0}
		<div class="rounded-xl border border-border bg-card/40 p-4 shadow-sm">
			<div class="mb-4 flex items-center justify-between">
				<h4 class="text-[10px] font-black tracking-wider text-muted-foreground uppercase">
					Fixed Pairs
				</h4>
				{#if !isAdding}
					<button
						type="button"
						onclick={() => (isAdding = true)}
						class="hover:text-accent-hover rounded-xl border border-accent/10 bg-accent/5 px-3.5 py-1.5 text-xs font-bold text-accent transition-all hover:border-accent/20 hover:bg-accent/10"
					>
						Add Pair
					</button>
				{/if}
			</div>

			<!-- List -->
			{#if pairs.length > 0}
				<ul class="mb-4 space-y-2">
					{#each pairs as pair (pair.id)}
						<li
							class="flex items-center justify-between rounded-xl border border-border bg-background/40 p-2.5 px-4"
						>
							<span class="font-display text-sm font-bold text-accent">
								{getPlayerName(pair.player1Id)} & {getPlayerName(pair.player2Id)}
							</span>
							<button
								type="button"
								class="flex h-6 w-6 items-center justify-center text-lg font-bold text-muted-foreground transition-colors hover:text-[#FF3B30]"
								onclick={() => {
									onRemovePair(pair.id);
									showToast('Partner pair removed', 'info');
								}}
							>
								×
							</button>
						</li>
					{/each}
				</ul>
			{/if}

			<!-- Add Form -->
			{#if isAdding}
				<div class="animate-fade-in space-y-3 rounded-xl border border-border bg-background/40 p-4">
					<div class="flex flex-col items-center gap-2 sm:flex-row">
						<Select.Root type="single" value={p1?.toString()} onValueChange={(v) => (p1 = v)}>
							<Select.Trigger
								class="flex w-full cursor-pointer items-center justify-between rounded-xl border border-border bg-background/60 p-3.5 font-sans text-xs font-bold text-foreground outline-none focus:border-accent focus:outline-none sm:flex-1"
							>
								{p1 ? getPlayerName(p1) : 'Select Player 1...'}
								<span class="ml-2 text-[10px] text-foreground/50">▼</span>
							</Select.Trigger>
							<Select.Portal>
								<Select.Content
									class="z-[1001] min-w-[200px] rounded-xl border border-border bg-popover p-1 font-sans text-sm shadow-md"
									sideOffset={4}
								>
									<Select.Viewport>
										{#each getAvailablePlayers(p1).filter((p) => p.id !== p2) as p}
											<Select.Item
												value={p.id.toString()}
												label={p.name}
												class="cursor-pointer rounded-lg px-3 py-2 text-foreground transition-colors outline-none data-[highlighted]:bg-foreground/10"
											>
												{p.name}
											</Select.Item>
										{/each}
									</Select.Viewport>
								</Select.Content>
							</Select.Portal>
						</Select.Root>
						<span class="font-display font-black text-muted-foreground">&</span>
						<Select.Root type="single" value={p2?.toString()} onValueChange={(v) => (p2 = v)}>
							<Select.Trigger
								class="flex w-full cursor-pointer items-center justify-between rounded-xl border border-border bg-background/60 p-3.5 font-sans text-xs font-bold text-foreground outline-none focus:border-accent focus:outline-none sm:flex-1"
							>
								{p2 ? getPlayerName(p2) : 'Select Player 2...'}
								<span class="ml-2 text-[10px] text-foreground/50">▼</span>
							</Select.Trigger>
							<Select.Portal>
								<Select.Content
									class="z-[1001] min-w-[200px] rounded-xl border border-border bg-popover p-1 font-sans text-sm shadow-md"
									sideOffset={4}
								>
									<Select.Viewport>
										{#each getAvailablePlayers(p2).filter((p) => p.id !== p1) as p}
											<Select.Item
												value={p.id.toString()}
												label={p.name}
												class="cursor-pointer rounded-lg px-3 py-2 text-foreground transition-colors outline-none data-[highlighted]:bg-foreground/10"
											>
												{p.name}
											</Select.Item>
										{/each}
									</Select.Viewport>
								</Select.Content>
							</Select.Portal>
						</Select.Root>
					</div>
					<div class="flex justify-end gap-2.5 pt-2">
						<button
							type="button"
							onclick={() => (isAdding = false)}
							class="px-4 py-2 text-xs font-black tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
						>
							Cancel
						</button>
						<button
							type="button"
							disabled={!p1 || !p2}
							onclick={handleAdd}
							class="hover:bg-accent-hover rounded-xl bg-accent px-4 py-2.5 text-xs font-black tracking-wider text-white uppercase shadow-md shadow-accent/15 transition-all disabled:pointer-events-none disabled:opacity-50"
						>
							Confirm Pair
						</button>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

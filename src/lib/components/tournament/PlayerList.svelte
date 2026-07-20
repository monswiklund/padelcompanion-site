<script lang="ts">
	import { Dialog } from 'bits-ui';
	import { onMount, type Snippet } from 'svelte';
	import { StorageService } from '$lib/shared/storage';
	import { cn } from '$lib/shared/utils';
	import Icons from '../Icons.svelte';
	import { fade, slide, scale } from 'svelte/transition';
	import { showConfirmModal } from '$lib/tournament/core/modals';
	import Button from '../ui/Button.svelte';

	export type ViewMode = 'list' | 'grid';

	interface Props {
		title?: string;
		singularTitle?: string;
		items: any[];
		onAdd: (name: string) => void;
		onRemove: (index: number) => void;
		onClear?: () => void;
		onImport?: (text: string) => void;
		importTitle?: string;
		importPlaceholder?: string;
		onReorder?: (fromIndex: number, toIndex: number) => void;
		renderActions?: Snippet<[any, number]>;
		hintText?: Snippet;
		maxItems?: number;
		showViewToggle?: boolean;
		defaultView?: ViewMode;
		showDivisions?: boolean;
		onCycleDivision?: (item: any, index: number) => void;
	}

	const {
		title = 'Players',
		singularTitle = 'Player',
		items,
		onAdd,
		onRemove,
		onClear,
		onImport,
		importTitle = 'Import names',
		importPlaceholder = 'Anna\nLisa\nMaja',
		onReorder,
		renderActions,
		hintText,
		maxItems = 100,
		showViewToggle = true,
		defaultView = 'list',
		showDivisions = false,
		onCycleDivision
	}: Props = $props();

	let inputValue = $state('');
	// svelte-ignore state_referenced_locally
	let viewMode = $state<ViewMode>(defaultView);
	let showAll = $state(false);
	let dragIndex = $state<number | null>(null);
	let isImportOpen = $state(false);
	let importValue = $state('');

	onMount(() => {
		viewMode = (StorageService.getItem('player_list_view', defaultView) as ViewMode) || defaultView;
	});

	function handleAdd() {
		const name = inputValue.trim();
		if (!name) return;
		if (items.length >= maxItems) return;
		onAdd(name);
		inputValue = '';
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleAdd();
		}
	}

	function toggleView(mode: ViewMode) {
		viewMode = mode;
		StorageService.setItem('player_list_view', mode);
	}

	function submitImport() {
		const text = importValue.trim();
		if (!text || !onImport) return;
		onImport(text);
		importValue = '';
		isImportOpen = false;
	}

	function closeImport() {
		isImportOpen = false;
		importValue = '';
	}

	// Drag and drop handlers
	function handleDragStart(index: number) {
		dragIndex = index;
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
	}

	function handleDrop(index: number) {
		if (dragIndex === null || dragIndex === index) return;
		if (onReorder) onReorder(dragIndex, index);
		dragIndex = null;
	}

	function handleDragEnd() {
		dragIndex = null;
	}

	const DIVISION_CLASSES: Record<string, string> = {
		A: 'text-[#FF3B30] bg-[#FF3B30]/10 border-[#FF3B30]/20',
		B: 'text-[#42A5F5] bg-[#42A5F5]/10 border-[#42A5F5]/20',
		C: 'text-[#34C759] bg-[#34C759]/10 border-[#34C759]/20',
		D: 'text-[#FFD700] bg-[#FFD700]/10 border-[#FFD700]/20',
		E: 'text-[#AF52DE] bg-[#AF52DE]/10 border-[#AF52DE]/20'
	};

	const displayItems = $derived(showAll ? items : items.slice(0, 16));
	const hasMore = $derived(items.length > 16);
</script>

<div class="relative z-10 space-y-4 font-sans select-none">
	<!-- Header -->
	<div class="flex items-center justify-between border-b border-border pb-3">
		<div class="flex items-center gap-3">
			<h3 class="font-display text-sm font-black tracking-tight text-foreground uppercase">
				{title}
			</h3>
			<div class="group relative">
				<span
					class="rounded-md border border-border bg-foreground/10 px-2 py-0.5 text-[8px] font-black tracking-wider text-foreground uppercase transition-all group-hover:border-accent group-hover:bg-accent"
				>
					{items.length} ACTIVE
				</span>
			</div>
		</div>

		<div class="flex items-center gap-2">
			{#if onImport}
				<button
					type="button"
					class="min-h-[44px] cursor-pointer rounded-lg border border-border bg-foreground/5 px-3 text-[8px] font-black tracking-wider text-foreground/50 uppercase transition-all hover:bg-foreground/10 hover:text-foreground"
					onclick={() => (isImportOpen = true)}
				>
					Import
				</button>
			{/if}
			{#if onClear && items.length > 0}
				<button
					type="button"
					class="min-h-[44px] cursor-pointer rounded-lg border border-[#FF3B30]/10 bg-[#FF3B30]/5 px-3 text-[8px] font-black tracking-wider text-[#FF3B30]/50 uppercase transition-all hover:bg-[#FF3B30]/10 hover:text-[#FF3B30]"
					onclick={() => {
						showConfirmModal(
							'Clear Session',
							'Remove all players from this session?',
							'Clear All',
							() => {
								if (onClear) onClear();
							},
							true
						);
					}}
				>
					Clear
				</button>
			{/if}
		</div>
	</div>

	<!-- Input Row -->
	<div class="group relative">
		<input
			type="text"
			enterkeyhint="done"
			class="min-h-[48px] w-full rounded-xl border border-border bg-foreground/5 py-3 pr-16 pl-4 text-base font-semibold tracking-wider text-foreground shadow-sm transition-all placeholder:text-foreground/30 focus:border-foreground/40 focus:bg-foreground/10 focus:outline-none"
			placeholder={`ADD ${singularTitle.toUpperCase()} NAME...`}
			bind:value={inputValue}
			onkeydown={handleKeyDown}
			disabled={items.length >= maxItems}
		/>
		<div class="absolute top-1 right-1 bottom-1">
			<Button
				variant="shiny"
				size="sm"
				onclick={handleAdd}
				disabled={!inputValue.trim() || items.length >= maxItems}
				class="h-full rounded-lg px-3.5 text-[9px] tracking-wider"
			>
				ADD
			</Button>
		</div>
	</div>

	<!-- View Toggle -->
	{#if showViewToggle && items.length > 0}
		<div class="flex items-center justify-end gap-2">
			<span class="text-[8px] font-black tracking-wider text-foreground/20 uppercase"
				>Display Mode</span
			>
			<div class="flex rounded-lg border border-border bg-foreground/5 p-0.5">
				<button
					type="button"
					aria-label="List View"
					class={cn(
						'flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-md p-1 transition-all',
						viewMode === 'list'
							? 'bg-foreground text-background'
							: 'text-foreground/20 hover:text-foreground'
					)}
					onclick={() => toggleView('list')}
				>
					<svg
						width="11"
						height="11"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="3"
						stroke-linecap="round"
					>
						<line x1="8" y1="6" x2="21" y2="6"></line>
						<line x1="8" y1="12" x2="21" y2="12"></line>
						<line x1="8" y1="18" x2="21" y2="18"></line>
						<circle cx="3" cy="6" r="1"></circle>
						<circle cx="3" cy="12" r="1"></circle>
						<circle cx="3" cy="18" r="1"></circle>
					</svg>
				</button>
				<button
					type="button"
					aria-label="Grid View"
					class={cn(
						'flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-md p-1 transition-all',
						viewMode === 'grid'
							? 'bg-foreground text-background'
							: 'text-foreground/20 hover:text-foreground'
					)}
					onclick={() => toggleView('grid')}
				>
					<svg
						width="11"
						height="11"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="3"
						stroke-linecap="round"
					>
						<rect x="3" y="3" width="7" height="7"></rect>
						<rect x="14" y="3" width="7" height="7"></rect>
						<rect x="14" y="14" width="7" height="7"></rect>
						<rect x="3" y="14" width="7" height="7"></rect>
					</svg>
				</button>
			</div>
		</div>
	{/if}

	<!-- Items List -->
	<ul
		class={cn(
			'w-full overflow-hidden transition-all duration-300',
			viewMode === 'grid'
				? 'grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3'
				: 'flex flex-col divide-y divide-border/60 rounded-xl border border-border bg-card/30'
		)}
	>
		{#each displayItems as item, idx (item.id || idx)}
			<li
				transition:slide={{ duration: 300 }}
				class={cn(
					'group/item relative flex items-center gap-2 overflow-hidden transition-all duration-300',
					viewMode === 'grid'
						? 'rounded-lg border border-border bg-card/40 px-3 py-1.5 hover:translate-y-0.5 hover:scale-[1.005] hover:border-foreground/20 hover:bg-foreground/10 hover:shadow-lg'
						: 'bg-transparent pl-3.5 pr-4 py-2.5 hover:bg-foreground/5 border-l-2 border-transparent hover:border-l-accent',
					dragIndex === idx
						? viewMode === 'grid'
							? 'border-accent opacity-30'
							: 'bg-accent/10 opacity-30'
						: ''
				)}
				draggable={!!onReorder}
				ondragstart={() => handleDragStart(idx)}
				ondragover={handleDragOver}
				ondrop={() => handleDrop(idx)}
				ondragend={handleDragEnd}
			>
				{#if onReorder}
					<span
						class="cursor-move text-[9px] font-black tracking-wider text-foreground/10 transition-colors select-none group-hover/item:text-accent"
					>
						::
					</span>
				{/if}

				<span
					class="w-4 text-[9px] font-black text-foreground/30 transition-colors group-hover/item:text-foreground/60"
				>
					{(idx + 1).toString().padStart(2, '0')}
				</span>

				<div class="mr-2 flex-1 flex items-center gap-2 min-w-0">
					<span class="text-xs font-black tracking-wider break-words text-foreground truncate">
						{item.name}
					</span>
					{#if showDivisions}
						<button
							type="button"
							onclick={() => onCycleDivision && onCycleDivision(item, idx)}
							class="inline-flex h-[44px] min-w-[44px] shrink-0 cursor-pointer items-center justify-center rounded border px-1.5 text-[8px] font-black uppercase transition-all hover:scale-105 active:scale-95 {DIVISION_CLASSES[item.division || 'A'] || 'text-foreground/60 bg-foreground/5 border-white/5'}"
							title="Click to cycle division"
							aria-label="Cycle division"
						>
							{item.division || 'A'}
						</button>
					{/if}
				</div>

				{#if renderActions}
					<div
						class="flex scale-95 items-center gap-1.5 opacity-0 transition-all group-hover/item:scale-100 group-hover/item:opacity-100"
					>
						{@render renderActions(item, idx)}
					</div>
				{/if}

				<button
					type="button"
					class="flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-md border border-transparent text-foreground/40 transition-all hover:border-destructive/10 hover:bg-destructive/10 hover:text-destructive"
					onclick={() => onRemove(idx)}
				>
					<Icons name="trash" size={11} />
				</button>

				<div
					class="pointer-events-none absolute inset-0 bg-gradient-to-r from-foreground/[0.01] to-transparent opacity-0 transition-opacity group-hover/item:opacity-100"
				></div>
			</li>
		{/each}
	</ul>

	<!-- Show More/Less -->
	{#if hasMore}
		<button
			type="button"
			class="mt-3 min-h-[44px] w-full cursor-pointer rounded-lg border border-border bg-foreground/5 py-2.5 text-center text-[9px] font-black tracking-wider text-foreground/50 uppercase transition-all hover:bg-foreground/10 hover:text-foreground"
			onclick={() => (showAll = !showAll)}
		>
			{showAll ? 'COLLAPSE PLAYER LIST' : `EXPAND LIST (+${items.length - 16} MORE)`}
		</button>
	{/if}

	<!-- Hint -->
	{#if hintText}
		<div class="mt-4 rounded-xl border border-border bg-foreground/5 p-3">
			<div class="mb-1 text-[8px] font-black tracking-wider text-accent uppercase">Pro Tip</div>
			<div class="text-[10px] leading-relaxed text-muted-foreground">
				{@render hintText()}
			</div>
		</div>
	{/if}
</div>

<!-- Batch Import Modal -->
<Dialog.Root open={isImportOpen} onOpenChange={(v) => !v && closeImport()}>
	<Dialog.Portal>
		<Dialog.Overlay forceMount>
			{#snippet child({ props, open: isModalOpen })}
				{#if isModalOpen}
					<div
						{...props}
						transition:fade={{ duration: 200 }}
						class="fixed inset-0 z-[800] bg-background/80 backdrop-blur-md"
					></div>
				{/if}
			{/snippet}
		</Dialog.Overlay>
		<Dialog.Content forceMount>
			{#snippet child({ props, open: isModalOpen })}
				{#if isModalOpen}
					<div
						{...props}
						transition:scale={{ duration: 220, start: 0.97, opacity: 0 }}
						class="fixed top-1/2 left-1/2 z-[801] max-h-[90dvh] w-full max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-card border border-border bg-popover p-6 shadow-lg md:p-8"
					>
						<Dialog.Title
							class="mb-2 font-display text-2xl font-black tracking-normal text-foreground"
						>
							{importTitle}
						</Dialog.Title>
						<p class="mb-6 text-xs font-black tracking-wider text-muted-foreground uppercase">
							Fast batch entry
						</p>

						<div class="mb-6 space-y-4">
							<textarea
								enterkeyhint="done"
								class="min-h-[300px] w-full resize-none rounded-xl border border-border bg-foreground/[0.03] p-5 text-sm font-semibold tracking-normal text-foreground transition-all placeholder:text-foreground/25 focus:border-accent focus:outline-none md:p-6"
								placeholder={importPlaceholder}
								bind:value={importValue}
							></textarea>
							<p class="text-center text-[10px] tracking-wider text-muted-foreground">
								Tip: Paste from WhatsApp, Excel or Notes. One name per line.
							</p>
						</div>

						<div class="flex items-center gap-4">
							<Button variant="ghost" size="lg" onclick={closeImport} class="flex-1">Cancel</Button>
							<Button
								variant="shiny"
								size="lg"
								onclick={submitImport}
								disabled={!importValue.trim()}
								class="flex-[2]"
							>
								START IMPORT
							</Button>
						</div>
					</div>
				{/if}
			{/snippet}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

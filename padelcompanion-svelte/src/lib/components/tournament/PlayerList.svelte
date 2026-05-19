<script lang="ts">
  import { ToggleGroup, Dialog } from "bits-ui";
  import { onMount, type Snippet } from "svelte";
  import { StorageService } from "$lib/shared/storage";
  import { cn } from "$lib/shared/utils";
  import Icons from "../Icons.svelte";
  import { fade, slide, scale } from "svelte/transition";
  import { showConfirmModal } from "$lib/tournament/core/modals";

  export type ViewMode = "list" | "grid";

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
  }

  let {
    title = "Players",
    singularTitle = "Player",
    items,
    onAdd,
    onRemove,
    onClear,
    onImport,
    importTitle = "Import names",
    importPlaceholder = "Anna\nLisa\nMaja",
    onReorder,
    renderActions,
    hintText,
    maxItems = 100,
    showViewToggle = true,
    defaultView = "list"
  }: Props = $props();

  let inputValue = $state("");
  // svelte-ignore state_referenced_locally
  let viewMode = $state<ViewMode>(defaultView);
  let showAll = $state(false);
  let dragIndex = $state<number | null>(null);
  let isImportOpen = $state(false);
  let importValue = $state("");

  onMount(() => {
    viewMode = (StorageService.getItem("player_list_view", defaultView) as ViewMode) || defaultView;
  });

  function handleAdd() {
    const name = inputValue.trim();
    if (!name) return;
    if (items.length >= maxItems) return;
    onAdd(name);
    inputValue = "";
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  }

  function toggleView(mode: ViewMode) {
    viewMode = mode;
    StorageService.setItem("player_list_view", mode);
  }

  function submitImport() {
    const text = importValue.trim();
    if (!text || !onImport) return;
    onImport(text);
    importValue = "";
    isImportOpen = false;
  }

  function closeImport() {
    isImportOpen = false;
    importValue = "";
  }

  // Drag and drop handlers
  function handleDragStart(index: number) {
    dragIndex = index;
  }

  function handleDragOver(e: DragEvent, index: number) {
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

  let displayItems = $derived(showAll ? items : items.slice(0, 10));
  let hasMore = $derived(items.length > 10);
</script>

<div class="space-y-4 select-none font-sans relative z-10">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <h3 class="text-lg font-black text-white font-display tracking-tight flex items-center">
      {title}
      <span class="text-xs text-muted-foreground font-normal bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-full ml-2">
        {items.length}/{maxItems}
      </span>
    </h3>
    <div class="flex items-center gap-2">
      {#if onImport}
        <button
          type="button"
          class="px-3.5 py-1.5 text-xs font-bold text-muted-foreground hover:text-white bg-white/[0.03] border border-white/5 rounded-xl transition-all"
          onclick={() => (isImportOpen = true)}
        >
          Import
        </button>
      {/if}
      {#if onClear && items.length > 0}
        <button
          type="button"
          class="px-3.5 py-1.5 text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-xl transition-all"
          onclick={() => {
            showConfirmModal(
              "Clear Players",
              "Are you sure you want to remove all players?",
              "Clear",
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
  <div class="relative">
    <input
      type="text"
      class="w-full pl-4 pr-20 py-3.5 rounded-2xl bg-black/35 border border-white/10 text-white placeholder:text-muted-foreground/30 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-sans text-sm"
      placeholder={`Add ${singularTitle.toLowerCase()}...`}
      bind:value={inputValue}
      onkeydown={handleKeyDown}
      disabled={items.length >= maxItems}
    />
    <button
      type="button"
      class="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-accent hover:bg-accent-hover text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md shadow-accent/15 transition-all disabled:opacity-0 disabled:pointer-events-none"
      onclick={handleAdd}
      disabled={!inputValue.trim() || items.length >= maxItems}
    >
      Add
    </button>
  </div>

  <!-- View Toggle -->
  {#if showViewToggle && items.length > 0}
    <div class="flex justify-end gap-1.5">
      <ToggleGroup.Root
        type="single"
        value={viewMode}
        onValueChange={(v) => { if (v) toggleView(v as ViewMode); }}
        class="flex gap-1.5"
      >
        <ToggleGroup.Item
          value="list"
          title="List"
          class="p-2 rounded-xl transition-colors data-[state=on]:bg-accent/10 data-[state=on]:border data-[state=on]:border-accent/20 data-[state=on]:text-accent data-[state=off]:text-muted-foreground data-[state=off]:hover:text-white data-[state=off]:bg-white/[0.02] outline-none cursor-pointer"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-[15px] h-[15px]">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        </ToggleGroup.Item>
        <ToggleGroup.Item
          value="grid"
          title="Grid"
          class="p-2 rounded-xl transition-colors data-[state=on]:bg-accent/10 data-[state=on]:border data-[state=on]:border-accent/20 data-[state=on]:text-accent data-[state=off]:text-muted-foreground data-[state=off]:hover:text-white data-[state=off]:bg-white/[0.02] outline-none cursor-pointer"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-[15px] h-[15px]">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        </ToggleGroup.Item>
      </ToggleGroup.Root>
    </div>
  {/if}

  <!-- Items List -->
  <ul
    class={cn(
      "space-y-2",
      viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-2 space-y-0" : ""
    )}
  >
    {#each displayItems as item, idx (item.id || idx)}
      <li
        transition:slide={{ duration: 200 }}
        class={cn(
          "flex items-center gap-2 py-2.5 px-4.5 transition-all rounded-xl border",
          "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10",
          dragIndex === idx ? "opacity-50 ring-2 ring-accent border-accent" : ""
        )}
        draggable={!!onReorder}
        ondragstart={() => handleDragStart(idx)}
        ondragover={(e) => handleDragOver(e, idx)}
        ondrop={() => handleDrop(idx)}
        ondragend={handleDragEnd}
      >
        {#if onReorder}
          <span
            class="cursor-move text-muted-foreground hover:text-white text-xs p-1 select-none pr-2 font-black tracking-widest"
            title="Drag to reorder"
          >
            ⋮⋮
          </span>
        {/if}

        <span class="text-xs font-mono font-bold text-muted-foreground w-6 text-right pr-2">
          {idx + 1}.
        </span>

        <span class="flex-1 font-bold text-white truncate text-sm tracking-tight">
          {item.name}
        </span>

        {#if renderActions}
          <div class="flex items-center gap-1.5">
            {@render renderActions(item, idx)}
          </div>
        {/if}

        <button
          type="button"
          class="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all text-lg font-bold"
          onclick={() => onRemove(idx)}
          title={`Remove ${item.name}`}
        >
          ×
        </button>
      </li>
    {/each}
  </ul>

  <!-- Show More/Less -->
  {#if hasMore}
    <button
      type="button"
      class="w-full py-2.5 text-center text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-accent transition-colors font-display"
      onclick={() => (showAll = !showAll)}
    >
      {showAll ? "Show Less" : `Show All (${items.length})`}
    </button>
  {/if}

  <!-- Hint -->
  {#if hintText}
    <div class="mt-2 text-sm text-center bg-accent/5 border border-accent/10 rounded-2xl py-3 px-4 font-sans text-muted-foreground">
      {@render hintText()}
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
            transition:fade={{ duration: 150 }}
            class="fixed inset-0 bg-black/70 backdrop-blur-md z-[800]"
          ></div>
        {/if}
      {/snippet}
    </Dialog.Overlay>
    <Dialog.Content forceMount>
      {#snippet child({ props, open: isModalOpen })}
        {#if isModalOpen}
          <div
            {...props}
            transition:scale={{ duration: 200, start: 0.95 }}
            class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1c1c1e] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl z-[801] select-none overflow-hidden"
          >
            <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent via-warning to-success"></div>

            <Dialog.Title class="text-2xl font-black text-white mb-3 tracking-tight font-display mt-2">
              {importTitle}
            </Dialog.Title>

            <div class="space-y-4 py-2 font-sans mb-6">
              <div class="text-sm text-muted-foreground">Paste one name per line. Duplicate entries will be ignored.</div>
              <textarea
                class="min-h-56 w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3.5 text-white placeholder:text-muted-foreground/35 focus:outline-none focus:border-accent transition-all shadow-sm resize-y"
                placeholder={importPlaceholder}
                bind:value={importValue}
              ></textarea>
            </div>

            <div class="flex items-center justify-end gap-3 border-t border-white/5 pt-4">
              <Dialog.Close
                class="px-4 py-2 text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-white transition-colors"
              >
                Cancel
              </Dialog.Close>
              <button
                type="button"
                onclick={submitImport}
                disabled={!importValue.trim()}
                class="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-black uppercase tracking-wider shadow-md shadow-accent/15 transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                Import
              </button>
            </div>
          </div>
        {/if}
      {/snippet}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

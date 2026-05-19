<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { getHistory, deleteFromHistory } from "$lib/tournament/history/repository";
  import { importTournamentData, downloadTournamentData } from "$lib/tournament/ui/setup/exportShare";
  import { showToast } from "$lib/shared/utils";
  import { showConfirmModal } from "$lib/tournament/core/modals";
  import { CloudService } from "$lib/tournament/sync/cloud";
  import { getTournamentRoute } from "$lib/tournament/navigation";
  import { state as globalState, restoreState } from "$lib/tournament/core/state";
  import Icons from "../Icons.svelte";
  import { fade, scale } from "svelte/transition";

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
  let search = $state("");
  let isOpenByCode = $state(false);
  let shareCode = $state("");
  let isLoadingCode = $state(false);

  onMount(() => {
    loadHistory();
  });

  function loadHistory() {
    history = getHistory() as HistoryItem[];
  }

  function handleLoad(item: HistoryItem) {
    showConfirmModal(
      "Load Tournament",
      `This will overwrite your current progress with "${item.summary.name || "Untitled"}". Continue?`,
      "Load",
      () => {
        restoreState(item.data);
        showToast("Tournament loaded", "success");
        const targetRoute = getTournamentRoute(item.data);
        goto(targetRoute);
      }
    );
  }

  function applyImportedState(data: any, successMessage: string) {
    restoreState(data);
    showToast(successMessage, "success");
    goto(getTournamentRoute(data));
  }

  async function handleLoadByCode() {
    const code = shareCode.trim();
    if (!code) {
      showToast("Enter a share code", "warning");
      return;
    }

    isLoadingCode = true;
    try {
      const snapshot = await CloudService.getSession(code);
      const restoredState = CloudService.restoreState(snapshot);
      applyImportedState(restoredState, "Tournament loaded from cloud");
      isOpenByCode = false;
      shareCode = "";
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load tournament";
      showToast(message, "error");
    } finally {
      isLoadingCode = false;
    }
  }

  async function handleImportFile(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    target.value = "";
    if (!file) return;

    try {
      const text = await file.text();
      const restoredState = importTournamentData(text);
      applyImportedState(restoredState, "Tournament imported");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to import tournament";
      showToast(message, "error");
    }
  }

  function handleDelete(id: string, name: string) {
    showConfirmModal(
      "Delete History",
      `Are you sure you want to delete "${name || "this tournament"}"?`,
      "Delete",
      () => {
        deleteFromHistory(id);
        loadHistory();
        showToast("Item deleted", "success");
      },
      true
    );
  }

  let filteredHistory = $derived(
    history.filter((item) => {
      const query = search.toLowerCase();
      return (
        (item.summary.name || "").toLowerCase().includes(query) ||
        (item.summary.winner || "").toLowerCase().includes(query) ||
        (item.summary.format || "").toLowerCase().includes(query)
      );
    })
  );
</script>

<section class="px-4 animate-fade-in relative z-20">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
    <div>
      <h3 class="text-xl font-bold text-white mb-1 font-display">
        Tournament History
      </h3>
      <p class="text-sm text-muted-foreground font-sans">
        Your past {history.length} tournaments
      </p>
    </div>

    <div class="relative w-full sm:w-72 group">
      <div class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors flex items-center justify-center">
        <Icons name="search" class="w-[18px] h-[18px]" />
      </div>
      <input
        type="text"
        placeholder="Search history..."
        class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card/60 backdrop-blur-md border border-white/5 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all font-sans"
        bind:value={search}
      />
    </div>
  </div>

  <div class="flex flex-wrap gap-3 mb-8">
    <button
      onclick={() => (isOpenByCode = true)}
      class="px-4 py-2 text-[11px] rounded-xl font-black uppercase tracking-wider transition-all duration-200 inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white shadow-md shadow-accent/15"
    >
      <Icons name="cloud" class="w-4 h-4" />
      Open with code
    </button>
    <label class="inline-flex cursor-pointer">
      <input
        type="file"
        accept="application/json"
        class="sr-only"
        onchange={handleImportFile}
      />
      <span class="px-4 py-2 text-[11px] rounded-xl font-black uppercase tracking-wider transition-all duration-200 inline-flex items-center justify-center gap-2 bg-card hover:bg-popover border border-white/5 text-white hover:border-accent hover:text-accent shadow-sm">
        <Icons name="upload" class="w-4 h-4" />
        Import JSON
      </span>
    </label>
  </div>

  {#if history.length === 0}
    <div class="bg-card/30 backdrop-blur-md border border-white/5 rounded-2xl px-6 py-10 text-center text-muted-foreground font-sans">
      No saved local history yet. You can still open a tournament with a share code or import a JSON backup.
    </div>
  {:else}
    <!-- Table -->
    <div class="bg-card/30 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
      <div class="overflow-x-auto">
        <table class="w-full font-sans">
          <thead>
            <tr class="border-b border-white/5 bg-white/[0.02]">
              <th class="text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] px-6 py-4">
                Date
              </th>
              <th class="text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] px-6 py-4">
                Tournament
              </th>
              <th class="text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] px-6 py-4 hidden sm:table-cell">
                Format
              </th>
              <th class="text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] px-6 py-4 hidden md:table-cell">
                Winner
              </th>
              <th class="text-left text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] px-6 py-4 hidden lg:table-cell">
                Stats
              </th>
              <th class="text-right text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] px-6 py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {#each filteredHistory as item (item.id)}
              <tr class="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors">
                <td class="px-6 py-4 text-sm text-muted-foreground">
                  {new Date(item.savedAt).toLocaleDateString()}
                </td>
                <td class="px-6 py-4">
                  <span class="font-bold text-white">
                    {item.summary.name || "Untitled Tournament"}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-muted-foreground capitalize hidden sm:table-cell">
                  {item.summary.format}
                </td>
                <td class="px-6 py-4 hidden md:table-cell">
                  <span class="text-accent font-bold flex items-center gap-1.5 font-display">
                    <Icons name="award" class="w-4 h-4 shrink-0" /> {item.summary.winner || "N/A"}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-muted-foreground hidden lg:table-cell">
                  {item.summary.playerCount} players · {item.summary.roundCount} rounds
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      onclick={() => handleLoad(item)}
                      class="px-3 py-1.5 text-xs font-bold text-white hover:text-accent bg-white/[0.04] hover:bg-accent/10 border border-white/5 hover:border-accent/20 rounded-lg transition-all"
                    >
                      Load
                    </button>
                    <button
                      onclick={() => downloadTournamentData(`${item.summary.name || "tournament"}.json`, item.data)}
                      class="p-2 text-muted-foreground hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 rounded-lg transition-all"
                      title="Download"
                    >
                      <Icons name="download" class="w-4 h-4" />
                    </button>
                    <button
                      onclick={() => handleDelete(item.id, item.summary.name)}
                      class="p-2 text-muted-foreground hover:text-red-500 bg-white/[0.04] hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Icons name="trash" class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      {#if filteredHistory.length === 0}
        <div class="py-12 text-center text-muted-foreground font-sans">
          No history found matching "{search}"
        </div>
      {/if}
    </div>
  {/if}
</section>

<!-- Custom Open with Code Modal -->
{#if isOpenByCode}
  <!-- Backdrop -->
  <div
    transition:fade={{ duration: 200 }}
    class="fixed inset-0 bg-black/70 backdrop-blur-md z-[800] flex items-center justify-center p-6"
    onclick={() => !isLoadingCode && (isOpenByCode = false)}
    onkeydown={(e) => e.key === "Escape" && !isLoadingCode && (isOpenByCode = false)}
    role="button"
    tabindex="0"
  >
    <!-- Modal container -->
    <div
      transition:scale={{ duration: 250, start: 0.95 }}
      class="bg-[#1c1c1e] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl relative z-10 select-none overflow-hidden"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="dialog"
    >
      <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent via-warning to-success"></div>

      <!-- Title -->
      <h3 class="text-2xl font-black text-white mb-3 tracking-tight font-display">
        Open Tournament
      </h3>

      <div class="space-y-4 py-2 font-sans mb-6">
        <p class="text-sm text-muted-foreground leading-relaxed">
          Enter the share code from another device to restore the tournament here.
        </p>
        <div class="relative group">
          <div class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent flex items-center justify-center">
            <Icons name="cloud" class="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="ABC123"
            class="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-black/30 border border-white/10 text-white placeholder:text-muted-foreground/30 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all uppercase tracking-[0.25em] font-black text-lg"
            bind:value={shareCode}
            oninput={() => (shareCode = shareCode.toUpperCase())}
          />
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="flex items-center justify-end gap-3 border-t border-white/5 pt-4">
        <button
          onclick={() => (isOpenByCode = false)}
          disabled={isLoadingCode}
          class="px-4 py-2 text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          onclick={handleLoadByCode}
          disabled={isLoadingCode}
          class="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-black uppercase tracking-wider shadow-md shadow-accent/15 transition-all"
        >
          {isLoadingCode ? "Loading..." : "Open"}
        </button>
      </div>
    </div>
  </div>
{/if}

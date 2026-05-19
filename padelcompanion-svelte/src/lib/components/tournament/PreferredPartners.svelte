<script lang="ts">
  import { Select } from "bits-ui";
  import { showToast } from "$lib/shared/utils";

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

  let { pairs, players, onAddPair, onRemovePair }: Props = $props();

  let isAdding = $state(false);
  let p1 = $state<string | number>("");
  let p2 = $state<string | number>("");

  function getAvailablePlayers(currentSelection: string | number | null) {
    const pairedIds = new Set<string | number>();
    pairs.forEach((p) => {
      pairedIds.add(p.player1Id);
      pairedIds.add(p.player2Id);
    });

    return players.filter(
      (p) => !pairedIds.has(p.id) || p.id === currentSelection
    );
  }

  function handleAdd() {
    if (p1 && p2 && p1 !== p2) {
      onAddPair(p1, p2);
      showToast("Partner pair added", "success");
      p1 = "";
      p2 = "";
      isAdding = false;
    }
  }

  function getPlayerName(id: string | number) {
    return players.find((p) => p.id === id)?.name || "Unknown";
  }
</script>

<div class="mt-4 pt-4 border-t border-white/5 font-sans select-none">
  {#if !isAdding && pairs.length === 0}
    <div class="text-center">
      <button
        type="button"
        onclick={() => (isAdding = true)}
        class="px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-200 inline-flex items-center justify-center gap-2 bg-white/[0.04] border border-white/5 text-white hover:border-accent hover:text-accent rounded-xl"
      >
        + Add Fixed Pair
      </button>
    </div>
  {/if}

  {#if isAdding || pairs.length > 0}
    <div class="bg-black/20 rounded-2xl p-4 border border-white/5 shadow-xl">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
          Fixed Pairs
        </h4>
        {#if !isAdding}
          <button
            type="button"
            onclick={() => (isAdding = true)}
            class="px-3.5 py-1.5 text-xs font-bold text-accent hover:text-accent-hover bg-accent/5 hover:bg-accent/10 border border-accent/10 hover:border-accent/20 rounded-xl transition-all"
          >
            Add Pair
          </button>
        {/if}
      </div>

      <!-- List -->
      {#if pairs.length > 0}
        <ul class="mb-4 space-y-2">
          {#each pairs as pair (pair.id)}
            <li class="flex items-center justify-between bg-black/25 p-2.5 px-4 rounded-xl border border-white/5">
              <span class="text-sm font-bold text-accent font-display">
                {getPlayerName(pair.player1Id)} & {getPlayerName(pair.player2Id)}
              </span>
              <button
                type="button"
                class="text-muted-foreground hover:text-red-500 font-bold transition-colors w-6 h-6 flex items-center justify-center text-lg"
                onclick={() => {
                  onRemovePair(pair.id);
                  showToast("Partner pair removed", "info");
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
        <div class="bg-black/20 p-4 rounded-xl border border-white/5 animate-fade-in space-y-3">
          <div class="flex flex-col sm:flex-row items-center gap-2">
            <Select.Root
              type="single"
              value={p1?.toString()}
              onValueChange={(v) => p1 = v}
            >
              <Select.Trigger class="w-full sm:flex-1 bg-black/35 text-xs p-3.5 rounded-xl border border-white/10 text-white focus:outline-none focus:border-accent font-sans font-bold flex items-center justify-between outline-none cursor-pointer">
                {p1 ? getPlayerName(p1) : "Select Player 1..."}
                <span class="text-white/50 text-[10px] ml-2">▼</span>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content class="z-[1001] bg-[#1c1c1e] border border-white/10 rounded-xl shadow-2xl p-1 font-sans text-sm min-w-[200px]" sideOffset={4}>
                  <Select.Viewport>
                    {#each getAvailablePlayers(p1).filter((p) => p.id !== p2) as p}
                      <Select.Item value={p.id.toString()} label={p.name} class="px-3 py-2 text-white data-[highlighted]:bg-white/10 rounded-lg cursor-pointer outline-none transition-colors">
                        {p.name}
                      </Select.Item>
                    {/each}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
            <span class="text-muted-foreground font-black font-display">&</span>
            <Select.Root
              type="single"
              value={p2?.toString()}
              onValueChange={(v) => p2 = v}
            >
              <Select.Trigger class="w-full sm:flex-1 bg-black/35 text-xs p-3.5 rounded-xl border border-white/10 text-white focus:outline-none focus:border-accent font-sans font-bold flex items-center justify-between outline-none cursor-pointer">
                {p2 ? getPlayerName(p2) : "Select Player 2..."}
                <span class="text-white/50 text-[10px] ml-2">▼</span>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content class="z-[1001] bg-[#1c1c1e] border border-white/10 rounded-xl shadow-2xl p-1 font-sans text-sm min-w-[200px]" sideOffset={4}>
                  <Select.Viewport>
                    {#each getAvailablePlayers(p2).filter((p) => p.id !== p1) as p}
                      <Select.Item value={p.id.toString()} label={p.name} class="px-3 py-2 text-white data-[highlighted]:bg-white/10 rounded-lg cursor-pointer outline-none transition-colors">
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
              class="px-4 py-2 text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!p1 || !p2}
              onclick={handleAdd}
              class="px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-black uppercase tracking-wider shadow-md shadow-accent/15 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              Confirm Pair
            </button>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

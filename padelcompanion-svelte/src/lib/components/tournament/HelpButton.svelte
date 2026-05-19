<script lang="ts">
  import { fade, scale } from "svelte/transition";

  interface Props {
    title: string;
    content: string;
  }

  let { title, content }: Props = $props();

  let isOpen = $state(false);

  function renderContent(text: string) {
    return text.split("\n").map((line) => {
      let processed = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      if (processed.startsWith("• ") || processed.startsWith("- ")) {
        processed = `<li class="ml-4 list-disc">${processed.slice(2)}</li>`;
      }
      return processed || "&nbsp;";
    });
  }

  let lines = $derived(renderContent(content));
</script>

<button
  type="button"
  onclick={() => (isOpen = true)}
  class="w-5 h-5 rounded-full bg-white/10 hover:bg-accent/20 text-muted-foreground hover:text-accent text-xs font-bold transition-colors flex items-center justify-center font-display"
  title={title}
>
  ?
</button>

{#if isOpen}
  <!-- Backdrop -->
  <div
    transition:fade={{ duration: 150 }}
    class="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    onclick={() => (isOpen = false)}
    onkeydown={(e) => e.key === "Escape" && (isOpen = false)}
    role="button"
    tabindex="0"
  >
    <!-- Card container -->
    <div
      transition:scale={{ duration: 200, start: 0.95 }}
      class="bg-[#1c1c1e] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl text-left relative z-10 select-none overflow-hidden"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="dialog"
    >
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-warning to-success"></div>

      <div class="flex items-center justify-between mb-4 mt-2">
        <h3 class="text-lg font-black text-white font-display tracking-tight">{title}</h3>
        <button
          onclick={() => (isOpen = false)}
          class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-muted-foreground hover:text-white flex items-center justify-center transition-colors font-display text-xl font-bold"
        >
          ×
        </button>
      </div>

      <div class="text-sm text-muted-foreground leading-relaxed font-sans space-y-2 max-h-[350px] overflow-y-auto pr-1">
        {#each lines as line}
          <span class="block">{@html line}</span>
        {/each}
      </div>
    </div>
  </div>
{/if}

<script lang="ts">
  import { fade, scale } from "svelte/transition";
  import { Dialog, Tooltip } from "bits-ui";

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

<Dialog.Root bind:open={isOpen}>
  <Tooltip.Provider>
    <Tooltip.Root>
      <Tooltip.Trigger>
        {#snippet child({ props: tooltipProps })}
          <Dialog.Trigger>
            {#snippet child({ props: dialogProps })}
              <button
                {...tooltipProps}
                {...dialogProps}
                class="w-5 h-5 rounded-full bg-white/10 hover:bg-accent/20 text-muted-foreground hover:text-accent text-xs font-bold transition-colors flex items-center justify-center font-display border-0 cursor-pointer"
              >
                ?
              </button>
            {/snippet}
          </Dialog.Trigger>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content sideOffset={4} class="z-[2000] px-2.5 py-1.5 bg-[#18181b] border border-white/10 text-white rounded-lg shadow-xl text-[10px] font-black uppercase tracking-wider font-display animate-fade-in">
          {title}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
  
  <Dialog.Portal>
    <Dialog.Overlay forceMount>
      {#snippet child({ props, open: isModalOpen })}
        {#if isModalOpen}
          <div
            {...props}
            transition:fade={{ duration: 150 }}
            class="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm"
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
            class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1c1c1e] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl text-left z-[1001] select-none overflow-hidden"
          >
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-warning to-success"></div>

            <div class="flex items-center justify-between mb-4 mt-2">
              <Dialog.Title class="text-lg font-black text-white font-display tracking-tight m-0">{title}</Dialog.Title>
              <Dialog.Close
                class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-muted-foreground hover:text-white flex items-center justify-center transition-colors font-display text-xl font-bold border-0 cursor-pointer"
              >
                ×
              </Dialog.Close>
            </div>

            <Dialog.Description class="text-sm text-muted-foreground leading-relaxed font-sans space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {#each lines as line}
                <span class="block">{@html line}</span>
              {/each}
            </Dialog.Description>
          </div>
        {/if}
      {/snippet}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

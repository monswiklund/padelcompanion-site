<script lang="ts">
  import './layout.css';
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import SmoothScroll from "$lib/components/SmoothScroll.svelte";
  import { activeModal } from "$lib/tournament/core/modals";
  import { fade, scale } from "svelte/transition";
  import { Dialog } from "bits-ui";

  let { children } = $props();
  let modalVal = $state("");

  let open = $state(false);

  // Keep a local copy of modal state to react to changes smoothly
  let modal = $state<any>(null);
  activeModal.subscribe((val) => {
    modal = val;
    open = !!(val && val.isOpen);
    if (val && val.type === "input") {
      modalVal = "";
    }
  });

  function handleOpenChange(v: boolean) {
    open = v;
    if (!v && modal?.onDismiss) {
      modal.onDismiss();
    }
  }

  function handleConfirm() {
    if (modal.onConfirm) {
      if (modal.type === "input") {
        modal.onConfirm(modalVal);
      } else {
        modal.onConfirm();
      }
    }
  }

  function focusOnMount(node: HTMLInputElement) {
    queueMicrotask(() => node.focus());
  }
</script>

<SmoothScroll>
  <div class="min-h-screen flex flex-col bg-background text-foreground selection:bg-accent selection:text-white">
    <Header />
    <main class="flex-1 pt-20">
      {@render children()}
    </main>
    <Footer />
  </div>
</SmoothScroll>

<Dialog.Root {open} onOpenChange={handleOpenChange}>
  <Dialog.Portal>
    <Dialog.Overlay forceMount>
      {#snippet child({ props, open: isOpen })}
        {#if isOpen}
          <div
            {...props}
            transition:fade={{ duration: 200 }}
            class="fixed inset-0 bg-black/60 backdrop-blur-md z-[800]"
          ></div>
        {/if}
      {/snippet}
    </Dialog.Overlay>
    
    <Dialog.Content forceMount>
      {#snippet child({ props, open: isOpen })}
        {#if isOpen}
          <div
            {...props}
            transition:scale={{ duration: 250, start: 0.95 }}
            class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1c1c1e] border border-white/10 rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl z-[801] select-none overflow-hidden"
          >
            <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent via-warning to-success"></div>

            <!-- Title -->
            <Dialog.Title class="text-2xl font-black text-white mb-3 tracking-tight font-display">
              {modal?.title}
            </Dialog.Title>

            <!-- Description / Message -->
            {#if modal?.description}
              <Dialog.Description class="text-sm text-muted-foreground mb-4 leading-relaxed font-sans">
                {modal.description}
              </Dialog.Description>
            {/if}

            {#if modal?.message}
              <div class="text-[0.95rem] text-muted-foreground/90 leading-relaxed mb-6 space-y-2">
                {@html modal.message}
              </div>
            {/if}

            <!-- Input modal field -->
            {#if modal?.type === "input"}
              <div class="mb-6">
                <input
                  type="text"
                  bind:value={modalVal}
                  placeholder={modal.placeholder || "Enter value..."}
                  class="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
                  onkeydown={(e) => e.key === "Enter" && handleConfirm()}
                  use:focusOnMount
                />
              </div>
            {/if}

            <!-- Standings list for complete tournament -->
            {#if modal?.type === "standings" && modal.standings}
              <div class="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-1">
                {#each modal.standings as p, i}
                  <div
                    class="flex items-center p-3.5 rounded-xl transition-all {i < 3 ? 'bg-accent/10 border border-accent/20' : 'bg-white/[0.02] border border-white/5'}"
                  >
                    <div class="w-8 text-xl text-center mr-3 font-display">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}
                    </div>
                    <div class="flex-1 font-bold text-lg text-white font-display">{p.name}</div>
                    <div class="text-sm text-muted-foreground font-semibold">
                      {p.points} pts · {p.played} games
                    </div>
                  </div>
                {/each}
              </div>
            {/if}

            <!-- Footer Buttons -->
            <div class="flex justify-end gap-3 border-t border-white/5 pt-5 mt-2">
              {#if modal?.type === "confirm"}
                {#if modal.secondaryText && modal.onSecondary}
                  <button
                    class="bg-transparent hover:bg-white/5 text-white/70 hover:text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all border-0 cursor-pointer font-display"
                    onclick={() => modal.onSecondary && modal.onSecondary()}
                  >
                    {modal.secondaryText}
                  </button>
                {/if}
                <Dialog.Close
                  class="bg-transparent hover:bg-white/5 text-muted-foreground hover:text-foreground px-6 py-2.5 rounded-full text-sm font-bold transition-all border-0 cursor-pointer font-display"
                >
                  Cancel
                </Dialog.Close>
                <button
                  class="px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md hover-glow cursor-pointer border-0 font-display {modal.isDanger ? 'bg-destructive text-white hover:bg-destructive/90' : 'bg-accent text-white hover:bg-accent/90'}"
                  onclick={handleConfirm}
                >
                  {modal.confirmText || "Confirm"}
                </button>
              {:else if modal?.type === "input"}
                <Dialog.Close
                  class="bg-transparent hover:bg-white/5 text-muted-foreground hover:text-foreground px-6 py-2.5 rounded-full text-sm font-bold transition-all border-0 cursor-pointer font-display"
                >
                  Cancel
                </Dialog.Close>
                <button
                  class="bg-accent text-white hover:bg-accent/90 px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md hover-glow cursor-pointer border-0 font-display"
                  onclick={handleConfirm}
                >
                  Add
                </button>
              {:else if modal?.type === "alert" || modal?.type === "info" || modal?.type === "standings"}
                <Dialog.Close
                  class="bg-accent text-white hover:bg-accent/90 px-8 py-2.5 rounded-full text-sm font-bold transition-all shadow-md hover-glow cursor-pointer border-0 font-display"
                >
                  {modal.type === "standings" ? "Done" : "OK"}
                </Dialog.Close>
              {/if}
            </div>
          </div>
        {/if}
      {/snippet}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>


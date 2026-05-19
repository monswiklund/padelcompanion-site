<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    type?: "info" | "warning" | "success";
    children: Snippet;
    class?: string;
  }

  let {
    type = "info",
    children,
    class: className = ""
  }: Props = $props();

  const styles = {
    info: "bg-white/5 border-white/10 text-white",
    warning: "bg-warning/10 border-warning/30 text-warning",
    success: "bg-success/10 border-success/30 text-success"
  };
</script>

<div class="flex items-start gap-2.5 px-4 py-3 rounded-xl border text-sm font-sans {styles[type]} {className}">
  {#if type === "info"}
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  {:else}
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  {/if}
  <div class="flex-1">
    {@render children()}
  </div>
</div>

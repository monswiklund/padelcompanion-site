<script lang="ts">
  import { onMount } from "svelte";

  interface Props {
    format: string;
    initialName: string;
    initialNotes: string;
    onUpdate: (key: "name" | "notes", value: string) => void;
    className?: string;
  }

  let {
    format,
    initialName,
    initialNotes,
    onUpdate,
    className = ""
  }: Props = $props();

  // svelte-ignore state_referenced_locally
  let localName = $state(initialName || "");
  // svelte-ignore state_referenced_locally
  let localNotes = $state(initialNotes || "");

  $effect(() => {
    localName = initialName || "";
  });

  $effect(() => {
    localNotes = initialNotes || "";
  });

  function handleBlur(key: "name" | "notes", value: string) {
    onUpdate(key, value.trim());
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      (e.target as HTMLElement).blur();
    }
  }
</script>

<div class="max-w-xl mx-auto mb-10 text-center {className} relative z-15 select-none">
  <input
    type="text"
    placeholder="Unnamed Tournament"
    class="w-full text-center text-4xl font-black text-white bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground/30 mb-2 truncate font-display tracking-tight"
    bind:value={localName}
    onblur={() => handleBlur("name", localName)}
    onkeydown={handleKeyDown}
  />
  <input
    type="text"
    placeholder="Add a short description or location..."
    class="w-full text-center text-sm text-muted-foreground bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground/30 italic font-sans"
    bind:value={localNotes}
    onblur={() => handleBlur("notes", localNotes)}
    onkeydown={handleKeyDown}
  />
</div>

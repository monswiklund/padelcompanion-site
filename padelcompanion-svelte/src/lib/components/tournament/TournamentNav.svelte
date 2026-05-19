<script lang="ts">
  import { page } from "$app/stores";
  import { cn } from "$lib/shared/utils";

  const linkBaseClasses = "px-4 py-2 text-sm font-medium rounded-lg transition-colors font-display";
  const activeClasses = "bg-accent text-white font-bold shadow-md shadow-accent/10";
  const inactiveClasses = "text-muted-foreground hover:text-foreground hover:bg-card/60";

  let pathname = $derived($page.url.pathname as string);
</script>

<nav class="flex flex-wrap justify-center gap-2 p-4 animate-fade-in relative z-20">
  <a
    href="/tournament/generator"
    class={cn(
      linkBaseClasses,
      pathname === "/tournament/generator" ? activeClasses : inactiveClasses
    )}
  >
    Americano / Mexicano
  </a>
  <a
    href="/tournament/division"
    class={cn(
      linkBaseClasses,
      pathname === "/tournament/division" ? activeClasses : inactiveClasses
    )}
  >
    Division
  </a>
  <a
    href="/tournament/bracket"
    class={cn(
      linkBaseClasses,
      pathname === "/tournament/bracket" ? activeClasses : inactiveClasses
    )}
  >
    Bracket
  </a>
  <a
    href="/tournament/winners-court"
    class={cn(
      linkBaseClasses,
      pathname === "/tournament/winners-court" ? activeClasses : inactiveClasses
    )}
  >
    Winner's Court
  </a>
</nav>

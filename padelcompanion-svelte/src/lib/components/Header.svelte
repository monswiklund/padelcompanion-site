<script lang="ts">
  import { page } from "$app/stores";
  import { cn } from "$lib/shared/utils";
  import { initTheme, toggleTheme } from "$lib/shared/theme";
  import Icons from "$lib/components/Icons.svelte";
  import {
    getLastTournamentRoute,
    isRememberedTournamentRoute,
    rememberTournamentRoute,
  } from "$lib/tournament/navigation";

  let isNavOpen = $state(false);
  let theme = $state("dark");
  let scrolled = $state(false);
  let tournamentLink = $state("/tournament/generator");

  $effect(() => {
    theme = initTheme();
    tournamentLink = getLastTournamentRoute();

    const handleScroll = () => {
      scrolled = window.scrollY > 20;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  // Keep tournamentLink in sync with routing history
  $effect(() => {
    const pathname = $page.url.pathname;
    if (isRememberedTournamentRoute(pathname)) {
      rememberTournamentRoute(pathname);
      tournamentLink = pathname;
    }
  });

  function handleToggleTheme() {
    theme = toggleTheme();
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("themeChanged", { detail: { theme } })
      );
    }
  }

  function closeNav() {
    isNavOpen = false;
  }
</script>

<header
  class={cn(
    "fixed top-0 left-0 right-0 z-[500] transition-all duration-300",
    scrolled
      ? "bg-background/95 backdrop-blur-md border-b border-border py-3"
      : "bg-transparent py-5"
  )}
>
  <div class="container max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
    <!-- LOGO -->
    <a
      href="/"
      class="flex items-center gap-2 text-xl font-bold text-foreground z-50 relative font-display"
      onclick={closeNav}
    >
      <img
        src="/assets/app-icon.jpeg"
        alt="Padel Companion Logo"
        width="36"
        height="36"
        class="w-9 h-9 rounded-lg"
      />
      <span>Padel Companion</span>
    </a>

    <!-- DESKTOP NAVIGATION -->
    <nav class="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
      <!-- Home Link -->
      <a
        href="/"
        onclick={closeNav}
        class={cn(
          "text-sm font-medium transition-colors font-display",
          $page.url.pathname === "/"
            ? "text-accent font-semibold"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Home
      </a>

      <!-- History Link -->
      <a
        href="/tournament/history"
        onclick={closeNav}
        class={cn(
          "text-sm font-medium transition-colors font-display",
          ($page.url.pathname as string) === "/tournament/history"
            ? "text-accent font-semibold"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        History
      </a>

      <!-- Tournament Link -->
      <a
        href={tournamentLink}
        onclick={closeNav}
        class={cn(
          "text-sm font-medium transition-colors font-display",
          ($page.url.pathname as string).startsWith("/tournament") && !($page.url.pathname as string).startsWith("/tournament/history")
            ? "text-accent font-semibold"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Tournament
      </a>

      <!-- Support Link -->
      <a
        href="/support"
        onclick={closeNav}
        class={cn(
          "text-sm font-medium transition-colors font-display",
          $page.url.pathname === "/support"
            ? "text-accent font-semibold"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Support
      </a>
    </nav>

    <!-- ACTIONS & MOBILE TOGGLE -->
    <div class="flex items-center gap-3 z-50 relative">
      <button
        class="w-9 h-9 flex items-center justify-center rounded-full bg-card hover:bg-popover transition-colors text-foreground cursor-pointer"
        onclick={handleToggleTheme}
        title="Toggle theme"
      >
        <span class="flex items-center text-foreground">
          {#if theme === "dark"}
            <Icons name="moon" size={18} />
          {:else}
            <Icons name="sun" size={18} />
          {/if}
        </span>
      </button>

      <!-- Hamburger Menu (Mobile) -->
      <button
        class="md:hidden flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full bg-card/80 p-2 text-foreground backdrop-blur-sm cursor-pointer"
        onclick={() => (isNavOpen = !isNavOpen)}
        aria-label="Toggle menu"
        aria-expanded={isNavOpen}
        aria-controls="mobile-navigation"
      >
        <span
          class={cn(
            "block h-0.5 w-6 rounded-full bg-foreground transition-all duration-300",
            isNavOpen && "rotate-45 translate-y-2"
          )}
        ></span>
        <span
          class={cn(
            "block h-0.5 w-6 rounded-full bg-foreground transition-all duration-300",
            isNavOpen && "opacity-0"
          )}
        ></span>
        <span
          class={cn(
            "block h-0.5 w-6 rounded-full bg-foreground transition-all duration-300",
            isNavOpen && "-rotate-45 -translate-y-2"
          )}
        ></span>
      </button>
    </div>
  </div>

  <!-- MOBILE NAVIGATION OVERLAY -->
  <div
    id="mobile-navigation"
    class={cn(
      "fixed inset-0 bg-background z-[400] flex flex-col items-center justify-center gap-8 transition-transform duration-300 md:hidden",
      isNavOpen ? "translate-x-0" : "translate-x-full"
    )}
  >
    <button
      type="button"
      onclick={closeNav}
      aria-label="Close menu"
      class="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-card/80 text-foreground backdrop-blur-sm cursor-pointer"
    >
      <span class="text-2xl leading-none">&times;</span>
    </button>
    
    <a
      href="/"
      class={cn(
        "text-2xl font-medium transition-colors font-display",
        $page.url.pathname === "/" ? "text-accent font-bold" : "text-foreground"
      )}
      onclick={closeNav}
    >
      Home
    </a>
    
    <a
      href="/tournament/history"
      class={cn(
        "text-2xl font-medium transition-colors font-display",
        ($page.url.pathname as string) === "/tournament/history" ? "text-accent font-bold" : "text-foreground"
      )}
      onclick={closeNav}
    >
      History
    </a>
    
    <a
      href={tournamentLink}
      class={cn(
        "text-2xl font-medium transition-colors font-display",
        ($page.url.pathname as string).startsWith("/tournament") && !($page.url.pathname as string).startsWith("/tournament/history")
          ? "text-accent font-bold"
          : "text-foreground"
      )}
      onclick={closeNav}
    >
      Tournament
    </a>
    
    <a
      href="/support"
      class={cn(
        "text-2xl font-medium transition-colors font-display",
        $page.url.pathname === "/support" ? "text-accent font-bold" : "text-foreground"
      )}
      onclick={closeNav}
    >
      Support
    </a>
  </div>
</header>

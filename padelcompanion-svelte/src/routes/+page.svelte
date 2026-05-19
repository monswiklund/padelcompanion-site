<script lang="ts">
  import { onMount } from "svelte";
  import { fade, slide, scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { cn } from "$lib/shared/utils";
  import Icons from "$lib/components/Icons.svelte";
  import PhoneMockup from "$lib/components/landing/PhoneMockup.svelte";
  import WatchMockup from "$lib/components/landing/WatchMockup.svelte";
  import Button from "$lib/components/ui/Button.svelte";

  // --- Scroll Spy Navigation Configuration ---
  const SECTIONS = [
    { id: "hero", label: "Start", icon: "home" },
    { id: "engine", label: "Web Engine", icon: "trophy" },
    { id: "app", label: "The App", icon: "smartphone" },
    { id: "download", label: "Get Access", icon: "rocket" },
  ];

  let activeSection = $state("hero");
  let spyLockedUntil = 0;
  let scrollHistory: number[] = [];
  let candidate: string | null = null;
  let candidateFrames = 0;

  function handleNavClick(sectionId: string) {
    activeSection = sectionId;
    spyLockedUntil = Date.now() + 800;
    candidate = null;
    candidateFrames = 0;
    scrollHistory = [];
    
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleScroll() {
    if (Date.now() < spyLockedUntil) return;

    const scrollY = window.scrollY;
    const vh = window.innerHeight;

    // Edge: top
    if (scrollY <= 10) {
      activeSection = "hero";
      return;
    }

    // Edge: bottom
    const maxScroll = document.documentElement.scrollHeight - vh;
    if (scrollY >= maxScroll - 10) {
      activeSection = SECTIONS[SECTIONS.length - 1].id;
      return;
    }

    // Smooth direction detection
    scrollHistory.push(scrollY);
    if (scrollHistory.length > 5) scrollHistory.shift();
    
    let dir: "down" | "up" | "idle" = "idle";
    if (scrollHistory.length >= 2) {
      const diff = scrollHistory[scrollHistory.length - 1] - scrollHistory[0];
      if (Math.abs(diff) >= 3) {
        dir = diff > 0 ? "down" : "up";
      }
    }

    const triggerLine = dir === "down" ? vh * 0.30 : vh * 0.60;

    let newActive = SECTIONS[0].id;
    for (let i = SECTIONS.length - 1; i >= 0; i--) {
      const el = document.getElementById(SECTIONS[i].id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerLine) {
          newActive = SECTIONS[i].id;
          break;
        }
      }
    }

    // Debounce candidate
    if (newActive !== activeSection) {
      if (newActive === candidate) {
        candidateFrames++;
        if (candidateFrames >= 3) {
          activeSection = newActive;
          candidate = null;
          candidateFrames = 0;
        }
      } else {
        candidate = newActive;
        candidateFrames = 1;
      }
    } else {
      candidate = null;
      candidateFrames = 0;
    }
  }

  // --- Word Rotator ---
  const ROTATING_WORDS = [
    "Tournaments",
    "Americanos",
    "Mexicanos",
    "Divisions",
    "Brackets",
    "Winner's Courts"
  ];
  let wordIndex = $state(0);

  // --- Live Leaderboard Bento Demo ---
  interface LeaderboardPlayer {
    name: string;
    pts: number;
    trend: "up" | "down" | "same";
  }

  let players = $state<LeaderboardPlayer[]>([
    { name: "John", pts: 145, trend: "same" },
    { name: "Jane", pts: 141, trend: "same" },
    { name: "Alice", pts: 137, trend: "same" },
    { name: "Bob", pts: 130, trend: "same" },
    { name: "Emma", pts: 125, trend: "same" },
    { name: "Liam", pts: 120, trend: "same" },
    { name: "Olivia", pts: 115, trend: "same" },
    { name: "Noah", pts: 110, trend: "same" }
  ]);
  let round = $state(4);
  let demoPhase = $state<"leaderboard" | "match">("leaderboard");
  let currentMatches = $state<Array<{court: number, t1: string[], t2: string[], s1: number, s2: number}>>([]);

  // --- Cookie Banner ---
  let showCookieBanner = $state(false);

  onMount(() => {
    // Scroll spy
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Word rotation
    const rotatorInterval = setInterval(() => {
      wordIndex = (wordIndex + 1) % ROTATING_WORDS.length;
    }, 1500);

    // Live leaderboard demo loop
    let tick = 0;
    const demoInterval = setInterval(() => {
      tick++;
      if (tick % 2 !== 0) {
        // Phase: MATCH - Simulerar match pågår
        const sorted = [...players].sort((a, b) => b.pts - a.pts);
        const m1Points = Math.floor(Math.random() * 9) + 8;
        const m2Points = Math.floor(Math.random() * 9) + 8;
        currentMatches = [
          {
            court: 1,
            t1: [sorted[0].name, sorted[2].name],
            t2: [sorted[1].name, sorted[3].name],
            s1: m1Points,
            s2: 24 - m1Points
          },
          {
            court: 2,
            t1: [sorted[4].name, sorted[6].name],
            t2: [sorted[5].name, sorted[7].name],
            s1: m2Points,
            s2: 24 - m2Points
          }
        ];
        demoPhase = "match";
      } else {
        // Phase: LEADERBOARD - Lägger till poäng och sorterar
        let s1 = 12, s2 = 12, s3 = 12, s4 = 12;
        if (currentMatches.length === 2) {
          s1 = currentMatches[0].s1;
          s2 = currentMatches[0].s2;
          s3 = currentMatches[1].s1;
          s4 = currentMatches[1].s2;
        }

        const sorted = [...players].sort((a, b) => b.pts - a.pts);
        const updated = sorted.map((p, i) => {
          let gained = 0;
          if (i === 0 || i === 2) gained = s1;
          if (i === 1 || i === 3) gained = s2;
          if (i === 4 || i === 6) gained = s3;
          if (i === 5 || i === 7) gained = s4;
          return { ...p, pts: p.pts + gained };
        });

        const reSorted = [...updated].sort((a, b) => b.pts - a.pts);
        players = reSorted.map((p, i) => {
          const oldIdx = players.findIndex(op => op.name === p.name);
          return { ...p, trend: oldIdx > i ? "up" : oldIdx < i ? "down" : "same" };
        });

        demoPhase = "leaderboard";
        round = round >= 6 ? 1 : round + 1;
      }
    }, 4000);

    // Cookie Banner Delay
    if (!localStorage.getItem("padelcompanion-cookies")) {
      const bannerTimeout = setTimeout(() => {
        showCookieBanner = true;
      }, 2000);
      return () => clearTimeout(bannerTimeout);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(rotatorInterval);
      clearInterval(demoInterval);
    };
  });
</script>

<div class="min-h-screen bg-background overflow-x-hidden selection:bg-accent selection:text-white">
  
  <!-- ============================================
       HERO SECTION
       ============================================ -->
  <section
    class="min-h-screen flex flex-col items-center justify-start relative overflow-hidden px-6 pt-32 md:pt-40 pb-20"
    id="hero"
  >
    <!-- Background glow/gradients -->
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-background to-background"></div>
    <div class="absolute top-1/4 left-0 w-full h-[500px] bg-gradient-to-b from-transparent via-primary/5 to-transparent -rotate-12 blur-3xl -z-10 pointer-events-none"></div>

    <div class="container max-w-[1200px] mx-auto text-center relative z-10">
      <div class="max-w-4xl mx-auto animate-fade-in-up">
        <span class="inline-block py-1 px-4 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold tracking-widest uppercase mb-8">
          Padel Companion
        </span>

        <h1 class="text-5xl md:text-8xl font-black tracking-tight leading-[1.05] mb-8 font-display">
          Play. Track.<br />
          <span class="inline-block relative">
            <span class="absolute inset-0 bg-accent/15 blur-2xl -z-10"></span>
            <span class="text-accent">Dominate.</span>
          </span>
        </h1>

        <p class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12 font-medium">
          The ultimate tournament planner, score tracker, and statistics analyzer built for padel lovers. Organise, play, and follow matches in real-time straight from your pocket or wrist.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
          <Button href="/tournament/generator" variant="primary" size="lg" class="w-full sm:w-auto">
            Start Web Engine
          </Button>
          <Button onclick={() => handleNavClick("download")} variant="secondary" size="lg" class="w-full sm:w-auto">
            Get Mobile Access
          </Button>
        </div>

        <!-- Words rotator header -->
        <h3 class="text-2xl md:text-3xl font-bold tracking-tight text-muted-foreground/60 mb-16 select-none font-display">
          Manage your own
          <span class="relative inline-flex flex-col justify-center font-bold text-foreground">
            <!-- Hidden placeholder to maintain box width -->
            <span class="opacity-0 invisible pointer-events-none px-1 whitespace-nowrap" aria-hidden="true">
              Winner's Courts
            </span>
            {#key wordIndex}
              <span
                in:scale={{ duration: 300, start: 0.9 }}
                out:fade={{ duration: 150 }}
                class="absolute inset-0 flex items-center justify-center px-1 whitespace-nowrap text-accent"
              >
                {ROTATING_WORDS[wordIndex]}
              </span>
            {/key}
          </span>
        </h3>
      </div>

      <!-- Device Mockups Section -->
      <div class="relative w-full max-w-4xl mx-auto mt-12 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16">
        <div class="animate-float">
          <PhoneMockup />
        </div>
        <div class="animate-float animation-delay-300">
          <WatchMockup />
        </div>
      </div>
    </div>
  </section>

  <!-- ============================================
       WEB ENGINE SECTION
       ============================================ -->
  <section class="py-32 border-t border-white/5 relative" id="engine">
    <div class="container max-w-[1200px] mx-auto px-6">
      
      <!-- Section Header -->
      <div class="mb-20 text-center max-w-3xl mx-auto">
        <span class="inline-block py-1 px-3 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold tracking-widest uppercase mb-6">
          Web Engine
        </span>
        <h2 class="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] mb-6 font-display">
          Zero setup. Just play.
        </h2>
        <p class="text-xl text-muted-foreground leading-relaxed">
          Create tournaments instantly in your browser with zero logins. Stream standings live to players' phones or project the bracket directly on a TV screen.
        </p>
      </div>

      <!-- Bento Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(320px,auto)]">
        
        <!-- Leaderboard Demo Bento Card -->
        <div class="md:col-span-2 bg-card/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 md:p-12 flex flex-col lg:flex-row items-center gap-12 overflow-hidden relative group">
          <div class="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          
          <div class="relative z-20 flex-1">
            <div class="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 border border-accent/20">
              <Icons name="trophy" class="w-6 h-6 text-accent" />
            </div>
            <h3 class="text-3xl font-black mb-4 tracking-tight font-display">Real-Time Standings</h3>
            <p class="text-muted-foreground leading-relaxed text-lg">
              Watch cards slide and sorter changes recalculate in real-time as match results are entered. Play, submit scores, and dominate the ranking list instantaneously.
            </p>
          </div>

          <!-- Dynamic Leaderboard Simulator -->
          <div class="relative z-10 flex-1 w-full flex items-center justify-center">
            <div class="bg-background/90 backdrop-blur-md border border-white/5 rounded-2xl p-5 shadow-2xl w-full max-w-sm mx-auto relative overflow-hidden">
              <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-warning to-success"></div>
              <div class="flex justify-between items-center mb-5 border-b border-white/5 pb-3">
                <span class="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  {demoPhase === 'leaderboard' ? 'Live Standings' : 'Live Match'}
                </span>
                <span class="text-[10px] font-bold text-muted-foreground/50">Round {round}/6</span>
              </div>

              <div class="relative h-[385px]">
                {#if demoPhase === "match" && currentMatches.length > 0}
                  <div
                    in:scale={{ duration: 250, start: 0.95 }}
                    out:fade={{ duration: 150 }}
                    class="flex flex-col items-center justify-center h-full gap-4 pb-0"
                  >
                    {#each currentMatches as match, idx}
                      <div class="w-full bg-white/[0.02] p-4 rounded-xl border border-white/5 flex shadow-inner gap-4 items-center justify-between">
                        <div class="flex-1">
                          <span class="text-[10px] uppercase tracking-widest text-muted-foreground/70 font-black mb-1.5 block">Court {match.court}</span>
                          <div class="flex flex-col gap-1.5">
                            <div class="text-xs font-bold text-foreground flex items-center gap-1.5">
                              <span class="opacity-50 text-[10px]">#{idx * 4 + 1}</span> {match.t1[0]} <span class="opacity-30">&</span> {match.t1[1]} <span class="opacity-50 text-[10px]">#{idx * 4 + 3}</span>
                            </div>
                            <div class="text-[10px] text-muted-foreground/50 font-black pl-1">VS</div>
                            <div class="text-xs font-bold text-foreground flex items-center gap-1.5">
                              <span class="opacity-50 text-[10px]">#{idx * 4 + 2}</span> {match.t2[0]} <span class="opacity-30">&</span> {match.t2[1]} <span class="opacity-50 text-[10px]">#{idx * 4 + 4}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div class="flex items-center gap-3 text-2xl font-black shrink-0">
                          <div class="flex flex-col items-center">
                            <span class="text-foreground">{match.s1}</span>
                            <span class="text-[9px] text-success uppercase tracking-widest mt-0.5">+ {match.s1}</span>
                          </div>
                          <span class="text-muted-foreground/30 mb-4">-</span>
                          <div class="flex flex-col items-center">
                            <span class="text-foreground">{match.s2}</span>
                            <span class="text-[9px] text-success uppercase tracking-widest mt-0.5">+ {match.s2}</span>
                          </div>
                        </div>
                      </div>
                    {/each}
                  </div>
                {:else}
                  <div
                    in:fade={{ duration: 250 }}
                    class="absolute inset-0 w-full h-full"
                  >
                    {#each players as p, i (p.name)}
                      <div
                        animate:flip={{ duration: 400 }}
                        class="flex justify-between items-center bg-white/[0.02] p-2.5 rounded-xl border border-white/5 absolute w-full"
                        style="top: {i * 48}px"
                      >
                        <div class="flex items-center gap-3">
                          <span class="text-xs font-black text-muted-foreground/50 w-3">{i + 1}</span>
                          <span class="text-sm font-bold text-foreground font-display">{p.name}</span>
                        </div>
                        <div class="flex items-center gap-3">
                          <span class="text-[10px] font-bold opacity-60">
                            {#if p.trend === "up"}
                              <span class="text-success">▲</span>
                            {:else if p.trend === "down"}
                              <span class="text-destructive">▼</span>
                            {:else}
                              <span class="text-muted-foreground">-</span>
                            {/if}
                          </span>
                          <span class="text-sm font-black text-accent">{p.pts}</span>
                        </div>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>

        <!-- Custom Rules Bento Card -->
        <div class="bg-card/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between overflow-hidden relative group">
          <div class="absolute inset-0 bg-gradient-to-b from-warning/5 to-transparent z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          <div class="w-12 h-12 bg-warning/10 rounded-2xl flex items-center justify-center mb-6 border border-warning/20">
            <Icons name="settings" class="w-6 h-6 text-warning" />
          </div>
          <div class="mt-auto relative z-10">
            <h3 class="text-2xl font-black mb-3 tracking-tight font-display">Extreme Customization</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">
              Adjust parameters seamlessly. Control match durations, points per match, manual byes, preferred partners, and lock strategies to match your exact padel format.
            </p>
          </div>
        </div>

        <!-- Game Formats Bento Card -->
        <div class="bg-card/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between overflow-hidden relative group">
          <div class="absolute inset-0 bg-gradient-to-b from-success/5 to-transparent z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          <div class="w-12 h-12 bg-success/10 rounded-2xl flex items-center justify-center mb-6 border border-success/20">
            <Icons name="crown" class="w-6 h-6 text-success" />
          </div>
          <div class="mt-auto relative z-10">
            <h3 class="text-2xl font-black mb-3 tracking-tight font-display">Flexible Game Formats</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">
              Full support for Americano, Mexicano, Team games, and Divisions. Perfect for friendly social play or competitive club tournaments.
            </p>
          </div>
        </div>

        <!-- Live Sync Bento Card -->
        <div class="md:col-span-2 bg-card/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative group">
          <div class="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          <div class="relative z-20 flex-1">
            <div class="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 border border-accent/20">
              <Icons name="refresh" class="w-6 h-6 text-accent" />
            </div>
            <h3 class="text-3xl font-black mb-4 tracking-tight font-display">Instant Sync & Projection</h3>
            <p class="text-muted-foreground leading-relaxed text-lg">
              Broadcast live results to all players' devices. Let players view their court placements, upcoming matches, and overall standing updates straight from their mobile phones.
            </p>
          </div>
          <div class="flex-1 w-full h-full min-h-[160px] flex items-center justify-center text-accent/20">
            <Icons name="cloud" size={100} class="animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============================================
       THE APP SECTION
       ============================================ -->
  <section class="py-32 border-t border-white/5 relative" id="app">
    <div class="container max-w-[1200px] mx-auto">
      
      <!-- Section Header -->
      <div class="mb-20 text-center max-w-3xl mx-auto px-6 animate-fade-in-up">
        <div class="flex justify-center mb-8">
          <img src="/assets/app-icon.jpeg" alt="Padel Companion App Icon" class="w-24 h-24 md:w-28 md:h-28 rounded-[1.8rem] shadow-[0_15px_40px_rgba(59,130,246,0.25)] border border-white/10" />
        </div>
        <span class="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-6">
          For the Player
        </span>
        <h2 class="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] mb-6 font-display">
          The Companion App
        </h2>
        <p class="text-xl text-muted-foreground leading-relaxed">
          Available on iOS and Android. Keep track of your daily matches, analyze your personal performance, and score instantly from your smartwatch.
        </p>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)] px-6">
        
        <!-- Deep Analytics Card -->
        <div class="md:col-span-3 bg-card/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative group">
          <div class="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          <div class="relative z-20 flex-1">
            <Icons name="trending-up" class="w-10 h-10 mb-6 text-primary drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]" />
            <h3 class="text-3xl md:text-4xl font-black mb-4 tracking-tight font-display">Deep Personal Analytics</h3>
            <p class="text-muted-foreground leading-relaxed text-lg">
              Understand your game. Track win ratios, analyze your form over time, and see who your best partner really is. Find out exactly where you need to improve.
            </p>
          </div>
          <!-- Animated bar chart -->
          <div class="relative z-10 flex-1 w-full h-full min-h-[200px] flex items-end justify-center gap-3 select-none">
            {#each [40, 70, 45, 90, 65, 100, 85] as h}
              <div
                style="height: {h}%"
                class="w-12 bg-gradient-to-t from-primary/20 to-primary/80 rounded-t-lg shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-1000"
              ></div>
            {/each}
          </div>
        </div>

        <!-- Standalone Smartwatch Card -->
        <div class="md:col-span-2 bg-card/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 overflow-hidden relative group">
          <div class="relative z-20 flex-1 max-w-sm">
            <h3 class="text-3xl font-black mb-4 tracking-tight font-display">Watch First</h3>
            <p class="text-muted-foreground leading-relaxed text-lg">
              Standalone Apple Watch and Wear OS support. Leave your phone in the bag. Start matches and score points effortlessly straight from your wrist without breaking a sweat.
            </p>
          </div>
          <!-- Dynamic Watch Demo -->
          <div class="relative z-10 flex-1 flex justify-center items-center drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
            <WatchMockup />
          </div>
        </div>

        <!-- Sync Card -->
        <div class="bg-card/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between overflow-hidden relative group">
          <div class="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:-rotate-12 duration-500 text-white">
            <div class="w-24 h-24 flex items-center justify-center">
              <Icons name="globe" class="w-full h-full stroke-1" />
            </div>
          </div>
          <div class="mt-auto relative z-10">
            <h3 class="text-2xl font-black mb-3 tracking-tight font-display">Always in Sync</h3>
            <p class="text-sm text-muted-foreground leading-relaxed font-sans">
              Your match history, analytics, and active tournaments are backed up in the cloud and instantly synchronized across all your devices in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============================================
       DOWNLOAD SECTION
       ============================================ -->
  <section class="py-32 relative overflow-hidden" id="download">
    <!-- Glow backdrops -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
    
    <div class="container max-w-[1200px] mx-auto px-6">
      <div class="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
        <h2 class="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-[1.1] font-display">
          Get the App
        </h2>
        <p class="text-muted-foreground text-xl font-medium">
          Join the future of padel tracking today.
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <!-- iOS Card -->
        <div class="bg-card/40 backdrop-blur-md p-10 border border-white/5 rounded-[2.5rem] shadow-2xl flex flex-col justify-between h-full group hover:border-primary/20 transition-colors">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="w-10 h-10 mb-6 fill-current text-foreground drop-shadow-[0_4px_12px_rgba(255,255,255,0.1)]"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
            <p class="text-xs uppercase tracking-[0.2em] text-accent-light font-bold mb-4">
              iPhone, iPad & WatchOS
            </p>
            <h3 class="text-3xl font-black text-foreground mb-4 tracking-tight font-display">
              Available Now
            </h3>
            <p class="text-muted-foreground mb-10 text-lg leading-relaxed">
              Beautiful score tracking, deep match analytics, and the best standalone Apple Watch padel app on the market.
            </p>
          </div>
          <a
            href="https://apps.apple.com/se/app/padel-companion/id6755152442"
            target="_blank"
            rel="noreferrer"
            class="w-full inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-full text-lg font-bold transition-all shadow-lg select-none hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Download on App Store
          </a>
        </div>

        <!-- Android Card -->
        <div class="bg-card/40 backdrop-blur-md p-10 border border-white/5 rounded-[2.5rem] shadow-2xl flex flex-col justify-between h-full group hover:border-primary/20 transition-colors">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-10 h-10 mb-6 fill-current text-[#3DDC84] drop-shadow-[0_4px_12px_rgba(61,220,132,0.3)]"><path d="M260.5 46.1l39.1-39.1c4.5-4.5 11.9-4.5 16.4 0s4.5 11.9 0 16.4l-38.3 38.3C328.7 83 368.5 125 376.1 176H71.9c7.6-51 47.4-93 98.5-114.3L132 23.4c-4.5-4.5-4.5-11.9 0-16.4s11.9-4.5 16.4 0l39.1 39.1A196 196 0 0 1 260.4 46.1zM140 120a20 20 0 1 0 0-40 20 20 0 0 0 0 40zm168 0a20 20 0 1 0 0-40 20 20 0 0 0 0 40zM48 200h352v184c0 26.5-21.5 48-48 48H96c-26.5 0-48-21.5-48-48V200zm-8 16H8c-4.4 0-8 3.6-8 8v160c0 4.4 3.6 8 8 8h32v-176zm408 0v176h32c4.4 0 8-3.6 8-8V224c0-4.4-3.6-8-8-8h-32zM128 448h80v48c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16v-48zm112 0h80v48c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16v-48z"/></svg>
            <p class="text-xs uppercase tracking-[0.2em] text-accent-light font-bold mb-4">
              Android & Wear OS
            </p>
            <h3 class="text-3xl font-black text-foreground mb-4 tracking-tight font-display">
              Private Beta
            </h3>
            <p class="text-muted-foreground mb-10 text-lg leading-relaxed">
              We're actively developing the Android and Wear OS versions. Leave your email to get early access and shape the app.
            </p>
          </div>
          <a
            href="mailto:wiklund.labs@gmail.com?subject=Android%20Beta%20Access"
            class="w-full inline-flex items-center justify-center bg-foreground text-background hover:bg-foreground/90 px-8 py-4 rounded-full text-lg font-bold transition-all shadow-lg select-none hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Become a Tester
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- ============================================
       SPONSORS SECTION
       ============================================ -->
  <section class="py-24 border-t border-white/5" id="partners">
    <div class="container max-w-[1200px] mx-auto px-6">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <p class="text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold mb-3">
          Sponsors
        </p>
        <h2 class="text-3xl md:text-4xl font-black tracking-tight mb-4 font-display">
          Partner with us
        </h2>
        <p class="text-muted-foreground">
          Reach committed padel players and clubs as Padel Companion grows across iOS and Android.
        </p>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-6 opacity-60 hover:opacity-100 transition-opacity duration-500">
        {#each Array(3) as _}
          <a
            href="mailto:wiklund.labs@gmail.com"
            class="h-[100px] bg-white/[0.02] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center px-4 hover:text-muted-foreground hover:border-white/20 transition-all select-none hover:scale-[1.01] active:scale-[0.99]"
          >
            <span class="text-sm font-bold text-foreground/80 font-display">Become a launch partner</span>
            <span class="mt-1 text-xs text-muted-foreground/60">
              Sponsor Padel Companion
            </span>
          </a>
        {/each}
      </div>
    </div>
  </section>

  <!-- ============================================
       FLOATING SCROLL NAV BAR
       ============================================ -->
  <div 
    class="fixed bottom-8 left-1/2 z-[600] hidden md:flex items-center p-1.5 bg-background/80 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] -translate-x-1/2 select-none"
  >
    {#each SECTIONS as sec}
      <button
        onclick={() => handleNavClick(sec.id)}
        class={cn(
          "relative px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 select-none cursor-pointer border-0 bg-transparent font-display",
          activeSection === sec.id ? "text-background font-black" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
        )}
      >
        {#if activeSection === sec.id}
          <div
            in:scale={{ duration: 250 }}
            class="absolute inset-0 bg-foreground rounded-full -z-10"
          ></div>
        {/if}
        <span class="relative z-10 flex items-center">
          <Icons name={sec.icon as any} size={14} />
        </span>
        <span class="relative z-10">{sec.label}</span>
      </button>
    {/each}
  </div>

  <!-- ============================================
       COOKIE CONSENT BANNER
       ============================================ -->
  {#if showCookieBanner}
    <div
      transition:slide={{ duration: 400 }}
      class="fixed bottom-6 left-6 right-6 md:left-auto md:w-[420px] z-[900] select-none"
    >
      <div class="bg-[#1c1c1e]/95 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl">
        <h4 class="text-lg font-black mb-2 tracking-tight text-white font-display">🍪 Cookies & Privacy</h4>
        <p class="text-muted-foreground text-sm mb-6 leading-relaxed">
          We use local storage for your preferences and privacy-friendly analytics. No cross-site tracking.
        </p>
        <div class="flex justify-end gap-3">
          <button
            class="bg-foreground text-background hover:bg-foreground/90 px-6 py-2.5 rounded-full text-sm font-bold transition-colors cursor-pointer border-0"
            onclick={() => {
              localStorage.setItem("padelcompanion-cookies", "accepted");
              showCookieBanner = false;
            }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  {/if}

</div>

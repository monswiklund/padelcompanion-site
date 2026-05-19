<script lang="ts">
  import { fade, scale } from "svelte/transition";
  import { cn } from "$lib/shared/utils";
  import Icons from "$lib/components/Icons.svelte";

  let activeTab = $state<"home" | "history" | "players" | "insights">("home");

  // Helper for sub-cards in the Players tab
  const playersList = [
    { name: "Marcus", avatar: "M", stat: "Level 5.0 · 412 Wins" },
    { name: "Anna", avatar: "A", stat: "Level 4.5 · 285 Wins" },
    { name: "David", avatar: "D", stat: "Level 4.0 · 156 Wins" },
  ];
</script>

<div
  class="relative w-[180px] h-[360px] md:w-[300px] md:h-[600px] bg-black rounded-[28px] md:rounded-[40px] border-[3px] md:border-4 border-[#3a3a3a] shadow-[0_0_0_2px_#111,0_20px_50px_rgba(0,0,0,0.6),0_0_80px_rgba(59,130,246,0.2)] flex flex-col z-10"
>
  <!-- Side Buttons -->
  <div class="absolute -right-[6px] top-[100px] w-[3px] h-[60px] bg-[#2a2a2a] rounded-r-[2px] -z-10"></div>
  <div class="absolute -left-[6px] top-[90px] -z-10">
    <div class="w-[3px] h-[40px] bg-[#2a2a2a] rounded-l-[2px] mb-[10px]"></div>
    <div class="w-[3px] h-[40px] bg-[#2a2a2a] rounded-l-[2px]"></div>
  </div>

  <div class="w-full h-full bg-black flex flex-col relative rounded-[24px] md:rounded-[36px] overflow-hidden">
    <!-- Dynamic Island -->
    <div class="absolute top-[10px] left-1/2 -translate-x-1/2 w-[80px] h-[22px] bg-black rounded-[20px] z-[100] shadow-md border border-white/5"></div>

    <!-- Status Bar -->
    <div class="pt-[14px] px-6 flex justify-between text-[11px] font-bold text-white z-10 opacity-80 select-none">
      <span>9:41</span>
      <div class="flex gap-1 items-center">
        <div class="w-4 h-2 rounded-sm border border-white/30"></div>
      </div>
    </div>

    <!-- App Header -->
    <div class="p-5 pb-2.5 flex justify-between items-end bg-gradient-to-b from-black via-black to-transparent select-none">
      <span class="text-xl font-black text-white leading-[1.1] max-w-[75%] tracking-tight">
        Padel Companion
      </span>
    </div>

    <!-- Content Area with Animation -->
    <div class="flex-1 px-4 overflow-hidden relative">
      {#key activeTab}
        <div
          in:scale={{ duration: 250, start: 0.98 }}
          out:fade={{ duration: 150 }}
          class="h-full flex flex-col gap-3 py-1"
        >
          {#if activeTab === "home"}
            <h4 class="text-[0.9rem] font-bold text-white mb-1">
              Add New Match
            </h4>
            
            <button
              class="w-full text-left bg-gradient-to-br from-[#007aff] to-[#0056b3] rounded-[18px] p-3.5 flex items-center gap-3 text-white relative overflow-hidden transition-all hover:brightness-110 active:scale-95 min-h-[72px] shadow-lg border-0 cursor-pointer"
            >
              <div class="text-[1.6rem] w-8 text-center drop-shadow-md flex justify-center">
                <Icons name="ball" class="w-6 h-6" />
              </div>
              <div class="flex-1 flex flex-col justify-center overflow-hidden">
                <span class="text-base font-bold leading-[1.2] whitespace-nowrap">
                  Match
                </span>
                <span class="text-[0.7rem] opacity-90 whitespace-nowrap overflow-hidden text-ellipsis">
                  Standard match with sets
                </span>
              </div>
              <div class="text-xl opacity-60">›</div>
            </button>

            <button
              class="w-full text-left bg-gradient-to-br from-[#ff9500] to-[#e08200] rounded-[18px] p-3.5 flex items-center gap-3 text-white relative overflow-hidden transition-all hover:brightness-110 active:scale-95 min-h-[72px] shadow-lg border-0 cursor-pointer"
            >
              <div class="text-[1.6rem] w-8 text-center drop-shadow-md flex justify-center">
                <Icons name="users" class="w-6 h-6" />
              </div>
              <div class="flex-1 flex flex-col justify-center overflow-hidden">
                <span class="text-base font-bold leading-[1.2] whitespace-nowrap">
                  Mexicano
                </span>
                <span class="text-[0.7rem] opacity-90 whitespace-nowrap overflow-hidden text-ellipsis">
                  Rotating partners format
                </span>
              </div>
              <div class="text-xl opacity-60">›</div>
            </button>

            <button
              class="w-full text-left bg-gradient-to-br from-[#af52de] to-[#8e2db2] rounded-[18px] p-3.5 flex items-center gap-3 text-white relative overflow-hidden transition-all hover:brightness-110 active:scale-95 min-h-[72px] shadow-lg border-0 cursor-pointer"
            >
              <div class="text-[1.6rem] w-8 text-center drop-shadow-md flex justify-center">
                <Icons name="trophy" class="w-6 h-6" />
              </div>
              <div class="flex-1 flex flex-col justify-center overflow-hidden">
                <span class="text-base font-bold leading-[1.2] whitespace-nowrap">
                  Winner's Court
                </span>
                <span class="text-[0.7rem] opacity-90 whitespace-nowrap overflow-hidden text-ellipsis">
                  King of the hill format
                </span>
              </div>
              <div class="text-xl opacity-60">›</div>
            </button>

            <div class="grid grid-cols-2 gap-2.5 mt-1 select-none">
              <div class="bg-[#1c1c1e] rounded-[14px] p-2.5 flex flex-col gap-0.5 border border-white/5">
                <span class="text-[0.65rem] text-[#8e8e93] uppercase tracking-wider font-bold">
                  Activity
                </span>
                <span class="text-[1.4rem] font-black text-white leading-none">
                  4
                </span>
              </div>
              <div class="bg-[#1c1c1e] rounded-[14px] p-2.5 flex flex-col gap-0.5 border border-white/5">
                <span class="text-[0.65rem] text-[#8e8e93] uppercase tracking-wider font-bold">
                  Streak
                </span>
                <span class="text-[1.4rem] font-black text-white leading-none">
                  -
                </span>
              </div>
            </div>
          {:else if activeTab === "history"}
            <h4 class="text-[0.9rem] font-bold text-white mb-1">
              Recent Matches
            </h4>
            <div class="bg-[#1c1c1e] rounded-2xl p-4 flex flex-col gap-2 border border-white/5 border-l-4 border-l-yellow-500/50 shadow-md">
              <div class="flex justify-between items-center">
                <span class="text-xs text-[#8e8e93]">18:56</span>
                <span class="text-[0.7rem] font-bold px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-500 border border-yellow-500/10">
                  DRAW
                </span>
              </div>
              <div class="text-2xl font-black text-white flex items-baseline gap-1.5">
                12-12
                <span class="text-[0.9rem] text-[#8e8e93] font-normal">
                  pts
                </span>
              </div>
              <div class="flex gap-2">
                <span class="bg-white/5 px-2 py-0.5 rounded-full text-[10px] text-white/70 border border-white/5">
                  Mexicano
                </span>
              </div>
            </div>
            
            <div class="bg-[#1c1c1e] rounded-2xl p-4 flex flex-col gap-2 border border-white/5 border-l-4 border-l-emerald-500 shadow-md">
              <div class="flex justify-between items-center">
                <span class="text-xs text-[#8e8e93]">17:30</span>
                <span class="text-[0.7rem] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-500 border border-emerald-500/10">
                  WIN
                </span>
              </div>
              <div class="text-2xl font-black text-white flex items-baseline gap-1.5">
                2-1
                <span class="text-[0.9rem] text-[#8e8e93] font-normal">
                  sets
                </span>
              </div>
              <div class="flex gap-2">
                <span class="bg-white/5 px-2 py-0.5 rounded-full text-[10px] text-white/70 border border-white/5">
                  Match
                </span>
              </div>
            </div>
          {:else if activeTab === "players"}
            <h4 class="text-[0.9rem] font-bold text-white mb-1">
              Your Friends
            </h4>
            {#each playersList as player}
              <div class="bg-[#1c1c1e] rounded-[14px] p-2.5 px-3.5 flex items-center gap-3 border border-white/5 mb-2 shadow-sm">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-[0.8rem] font-bold text-white shadow-inner">
                  {player.avatar}
                </div>
                <div class="flex flex-col">
                  <span class="text-[0.9rem] font-semibold text-white">{player.name}</span>
                  <span class="text-[0.7rem] text-[#8e8e93] leading-none">{player.stat}</span>
                </div>
              </div>
            {/each}
          {:else if activeTab === "insights"}
            <h4 class="text-[0.9rem] font-bold text-white mb-1">
              Insights
            </h4>
            <div class="grid grid-cols-2 gap-2.5">
              <div class="bg-[#1c1c1e] rounded-[14px] p-3 text-center border border-white/5">
                <span class="block text-xl font-black text-blue-400">
                  72%
                </span>
                <span class="text-[0.65rem] text-[#8e8e93] uppercase tracking-wider font-bold">
                  Win Rate
                </span>
              </div>
              <div class="bg-[#1c1c1e] rounded-[14px] p-3 text-center border border-white/5">
                <span class="block text-xl font-black text-blue-400">
                  14
                </span>
                <span class="text-[0.65rem] text-[#8e8e93] uppercase tracking-wider font-bold">
                  Matches
                </span>
              </div>
            </div>
            <div class="h-20 flex items-end justify-between gap-1.5 p-2.5 bg-white/[0.03] rounded-[14px] mt-2 border border-white/5">
              {#each [40, 70, 55, 90, 65] as h}
                <div
                  style="height: {h}%"
                  class="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm transition-all duration-500"
                ></div>
              {/each}
            </div>
          {/if}
        </div>
      {/key}
    </div>

    <!-- Bottom Nav -->
    <div class="h-[60px] bg-[#1c1c1e]/95 backdrop-blur-xl flex justify-around items-center border-t border-white/10 pb-1 z-10 px-2 select-none">
      <button
        onclick={() => (activeTab = "home")}
        class={cn(
          "flex flex-col items-center justify-center w-full h-full cursor-pointer transition-all duration-300 border-0 bg-transparent",
          activeTab === "home"
            ? "opacity-100 text-[#007aff] scale-110"
            : "opacity-50 text-[#8e8e93] hover:opacity-80 hover:scale-105"
        )}
      >
        <span class="text-[1.1rem] mb-0.5"><Icons name="home" size={18} /></span>
        <span class="text-[0.6rem] font-medium leading-none">Home</span>
      </button>

      <button
        onclick={() => (activeTab = "history")}
        class={cn(
          "flex flex-col items-center justify-center w-full h-full cursor-pointer transition-all duration-300 border-0 bg-transparent",
          activeTab === "history"
            ? "opacity-100 text-[#007aff] scale-110"
            : "opacity-50 text-[#8e8e93] hover:opacity-80 hover:scale-105"
        )}
      >
        <span class="text-[1.1rem] mb-0.5"><Icons name="calendar" size={18} /></span>
        <span class="text-[0.6rem] font-medium leading-none">History</span>
      </button>

      <button
        onclick={() => (activeTab = "players")}
        class={cn(
          "flex flex-col items-center justify-center w-full h-full cursor-pointer transition-all duration-300 border-0 bg-transparent",
          activeTab === "players"
            ? "opacity-100 text-[#007aff] scale-110"
            : "opacity-50 text-[#8e8e93] hover:opacity-80 hover:scale-105"
        )}
      >
        <span class="text-[1.1rem] mb-0.5"><Icons name="users" size={18} /></span>
        <span class="text-[0.6rem] font-medium leading-none">Players</span>
      </button>

      <button
        onclick={() => (activeTab = "insights")}
        class={cn(
          "flex flex-col items-center justify-center w-full h-full cursor-pointer transition-all duration-300 border-0 bg-transparent",
          activeTab === "insights"
            ? "opacity-100 text-[#007aff] scale-110"
            : "opacity-50 text-[#8e8e93] hover:opacity-80 hover:scale-105"
        )}
      >
        <span class="text-[1.1rem] mb-0.5"><Icons name="trending-up" size={18} /></span>
        <span class="text-[0.6rem] font-medium leading-none">Insights</span>
      </button>
    </div>
  </div>
</div>

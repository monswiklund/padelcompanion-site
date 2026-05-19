<script lang="ts">
  import { fade, scale } from "svelte/transition";
  import { cn } from "$lib/shared/utils";

  let orangeScore = $state<string | number>("0");
  let blueScore = $state<string | number>("0");
  let gameWinners = $state<(string | null)[]>(Array(5).fill(null));

  const POINTS = ["0", "15", "30", "40"];

  function handleScore(team: "orange" | "blue") {
    if (team === "orange") {
      const nextIdx = POINTS.indexOf(orangeScore.toString()) + 1;
      if (nextIdx >= POINTS.length) {
        orangeScore = "0";
        blueScore = "0";
        const emptyIdx = gameWinners.indexOf(null);
        if (emptyIdx !== -1) {
          gameWinners[emptyIdx] = "orange";
        } else {
          gameWinners.fill(null);
          gameWinners[0] = "orange";
        }
      } else {
        orangeScore = POINTS[nextIdx];
      }
    } else {
      const nextIdx = POINTS.indexOf(blueScore.toString()) + 1;
      if (nextIdx >= POINTS.length) {
        orangeScore = "0";
        blueScore = "0";
        const emptyIdx = gameWinners.indexOf(null);
        if (emptyIdx !== -1) {
          gameWinners[emptyIdx] = "blue";
        } else {
          gameWinners.fill(null);
          gameWinners[0] = "blue";
        }
      } else {
        blueScore = POINTS[nextIdx];
      }
    }
  }
</script>

<div
  class="hidden md:flex w-[180px] h-[220px] lg:w-[230px] lg:h-[280px] bg-[#1a1a1a] rounded-[44px] lg:rounded-[56px] border-[3px] lg:border-4 border-[#3a3a3a] shadow-[0_0_0_2px_#111,0_10px_40px_rgba(0,0,0,0.5),0_0_40px_rgba(59,130,246,0.1)] flex-col self-center relative z-10 select-none"
>
  <!-- Crown -->
  <div class="absolute -right-[10px] lg:-right-[12px] top-[45px] lg:top-[58px] w-[11px] lg:w-[14px] h-[35px] lg:h-[44px] bg-gradient-to-r from-[#2a2a2a] via-[#444] to-[#2a2a2a] rounded-[4px_6px_6px_4px] lg:rounded-[5px_7px_7px_5px] border border-[#111] shadow-sm -z-10 bg-[repeating-linear-gradient(to_bottom,transparent,transparent_2px,rgba(0,0,0,0.3)_2px,rgba(0,0,0,0.3)_4px)]"></div>

  <!-- Button -->
  <div class="absolute -right-[7px] lg:-right-[9px] top-[95px] lg:top-[120px] w-[7px] lg:w-[10px] h-[50px] lg:h-[64px] bg-[#2a2a2a] rounded-[2px_4px_4px_2px] lg:rounded-[3px_5px_5px_3px] border border-[#111] shadow-sm -z-10"></div>

  <!-- Screen -->
  <div class="flex-1 flex flex-col overflow-hidden rounded-[38px] lg:rounded-[48px] m-[4px] lg:m-[5px] bg-black relative shadow-inner">
    <div class="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-10"></div>

    <!-- Orange Score Area -->
    <button
      class="flex-1 w-full border-0 flex items-center justify-center relative p-2 cursor-pointer transition-all active:brightness-90 bg-gradient-to-br from-[#e85d04] to-[#dc2f02] hover:brightness-110 overflow-hidden"
      onclick={() => handleScore("orange")}
    >
      <div class="absolute top-2 right-4 text-[0.7rem] font-bold text-white/80">
        9:41
      </div>

      {#key orangeScore}
        <div
          in:scale={{ duration: 200, start: 0.8 }}
          out:fade={{ duration: 100 }}
          class="text-[2.2rem] lg:text-[2.8rem] font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] tracking-tighter"
        >
          {orangeScore}
        </div>
      {/key}

      <div class="absolute left-3 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-[0.8rem] font-black text-white border border-white/10">
        R
      </div>
    </button>

    <!-- Center bar -->
    <div class="flex justify-between items-center px-3 py-1.5 bg-gradient-to-r from-[#dc2f02] to-[#0077b6] z-[20] shadow-md border-y border-white/5">
      <div class="text-[0.6rem] font-black text-white bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
        00:42:15
      </div>
      <div class="flex items-center gap-[4px]">
        {#each gameWinners as winner}
          <span
            class={cn(
              "w-2 h-2 rounded-full transition-colors border border-white/10 shadow-sm",
              winner === "orange"
                ? "bg-[#e85d04] scale-110"
                : winner === "blue"
                  ? "bg-[#0096c7] scale-110"
                  : "bg-white/20"
            )}
          ></span>
        {/each}
      </div>
    </div>

    <!-- Blue Score Area -->
    <button
      class="flex-1 w-full border-0 flex items-center justify-center relative p-2 cursor-pointer transition-all active:brightness-90 bg-gradient-to-br from-[#0077b6] to-[#0096c7] hover:brightness-110 overflow-hidden"
      onclick={() => handleScore("blue")}
    >
      {#key blueScore}
        <div
          in:scale={{ duration: 200, start: 0.8 }}
          out:fade={{ duration: 100 }}
          class="text-[2.2rem] lg:text-[2.8rem] font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] tracking-tighter"
        >
          {blueScore}
        </div>
      {/key}
      
      <div class="absolute left-3 w-8 h-8 bg-black/30 rounded-full flex items-center justify-center text-[0.8rem] font-black text-white border border-white/10">
        ↩
      </div>
    </button>
  </div>
</div>

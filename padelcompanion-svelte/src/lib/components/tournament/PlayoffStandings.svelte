<script lang="ts">
  import { tournament } from "$lib/stores/tournament.svelte";

  let ts = $derived(tournament.state);
  let schedule = $derived(ts.schedule);
  let format = $derived(ts.format);
  let players = $derived(ts.players);

  let semiRound = $derived(schedule.find((r) => r.name === "Semifinal"));
  let finalRound = $derived(schedule.find((r) => r.name === "Final"));

  // Group by division
  let divisions = $derived(
    Array.from(new Map(players.map((p: any) => [p.division || "A", p.division || "A"])).values()).sort()
  );

  function getWinner(m: any) {
    return (m.score1 || 0) > (m.score2 || 0) ? m.team1 : m.team2;
  }

  function getLoser(m: any) {
    return (m.score1 || 0) > (m.score2 || 0) ? m.team2 : m.team1;
  }

  function isCompleted(m: any) {
    return m.score1 != null || m.score2 != null;
  }

  const divColors: Record<string, string> = {
    A: "from-blue-500/10 to-indigo-500/5 border-blue-500/20",
    B: "from-emerald-500/10 to-teal-500/5 border-emerald-500/20",
    C: "from-orange-500/10 to-amber-500/5 border-orange-500/20",
  };
</script>

{#if format === "division" && semiRound}
  <div class="space-y-6 mb-12 animate-fade-in font-sans select-none">
    <div class="flex items-center gap-3 px-2">
      <h3 class="text-xl font-black text-white uppercase tracking-wider">Playoff Results</h3>
      <div class="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each divisions as div}
        {@const divSemis = semiRound.matches.filter((m) => {
          const p1 = players.find((p) => p.id === m.team1[0].id);
          return (p1 as any)?.division === div;
        })}

        {@const divFinal = finalRound?.matches.find((m) => {
          const p1 = players.find((p) => p.id === m.team1[0].id);
          return (p1 as any)?.division === div;
        })}

        {@const gold = divFinal && isCompleted(divFinal) ? getWinner(divFinal) : null}
        {@const silver = divFinal && isCompleted(divFinal) ? getLoser(divFinal) : null}

        {@const semiLosers = divSemis.filter(isCompleted).map(getLoser)}
        {@const playoffPlacements = (() => {
          let third = null;
          let fourth = null;
          if (semiLosers.length > 0) {
            const sortedByLeague = [...semiLosers].sort((a, b) => {
              const rankA = ts.leaderboard.find((p) => p.id === a[0].id)?.currentRank || 999;
              const rankB = ts.leaderboard.find((p) => p.id === b[0].id)?.currentRank || 999;
              return rankA - rankB;
            });
            third = sortedByLeague[0];
            fourth = sortedByLeague[1];
          }
          return { third, fourth };
        })()}

        <div class="relative overflow-hidden border border-white/10 rounded-[2rem] bg-gradient-to-br {divColors[div] || 'from-white/[0.04] to-transparent'} shadow-xl">
          <div class="p-4 px-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center font-display">
            <span class="font-black text-xs uppercase tracking-widest text-white">Division {div}</span>
            {#if divFinal && isCompleted(divFinal)}
              <span class="text-[9px] bg-success/15 text-success px-2 py-0.5 rounded-full font-black uppercase tracking-wider border border-success/20">
                Finished
              </span>
            {/if}
          </div>

          <div class="p-6 space-y-5">
            <!-- Gold -->
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20 shrink-0">
                <span class="text-2xl">🥇</span>
              </div>
              <div class="min-w-0 font-display">
                <p class="text-[9px] font-black text-yellow-500 uppercase tracking-widest leading-none mb-1">1st Place</p>
                <h4 class="text-base font-bold text-white truncate">
                  {gold ? gold.map((p: any) => p.name).join(" / ") : "TBD"}
                </h4>
              </div>
            </div>

            <!-- Silver -->
            <div class="flex items-center gap-4 opacity-90">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center shadow-md shadow-gray-400/10 shrink-0">
                <span class="text-lg">🥈</span>
              </div>
              <div class="min-w-0 font-display">
                <p class="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">2nd Place</p>
                <h4 class="text-sm font-bold text-white/90 truncate">
                  {silver ? silver.map((p: any) => p.name).join(" / ") : "TBD"}
                </h4>
              </div>
            </div>

            <!-- Third Place -->
            <div class="flex items-center gap-4 opacity-80">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-700 flex items-center justify-center shadow-md shadow-orange-600/10 shrink-0">
                <span class="text-lg">🥉</span>
              </div>
              <div class="min-w-0 font-display">
                <p class="text-[9px] font-black text-orange-400 uppercase tracking-widest leading-none mb-1">3rd Place</p>
                <h4 class="text-sm font-bold text-white/80 truncate">
                  {playoffPlacements.third ? playoffPlacements.third.map((p: any) => p.name).join(" / ") : "TBD"}
                </h4>
              </div>
            </div>

            <!-- Fourth Place -->
            <div class="flex items-center gap-4 opacity-70">
              <div class="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center shrink-0">
                <span class="text-xs font-black text-muted-foreground">4</span>
              </div>
              <div class="min-w-0 font-display">
                <p class="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">4th Place</p>
                <h4 class="text-sm font-bold text-white/60 truncate">
                  {playoffPlacements.fourth ? playoffPlacements.fourth.map((p: any) => p.name).join(" / ") : "TBD"}
                </h4>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}

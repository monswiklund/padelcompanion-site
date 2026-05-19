<script lang="ts">
  import Icons from "$lib/components/Icons.svelte";
  import PlayerMatchHistory from "./PlayerMatchHistory.svelte";
  import { tournament } from "$lib/stores/tournament.svelte";
  import { copyLeaderboardToClipboard } from "$lib/tournament/ui/setup/exportShare";
  import { showToast } from "$lib/shared/utils";

  let ts = $derived(tournament.state);
  let leaderboard = $derived(ts.leaderboard);
  let rankingCriteria = $derived(ts.rankingCriteria);
  let hideLeaderboard = $derived(ts.hideLeaderboard);
  let showPositionChanges = $derived(ts.showPositionChanges);
  let leaderboardColumns = $derived(ts.leaderboardColumns);
  let format = $derived(ts.format);
  let tiebreaker = $derived(ts.tiebreaker);

  let isDivision = $derived(format === "division");
  let isPlayoffs = $derived(leaderboard.length > 0 && ts.schedule.some((r) => !!r.name));

  let searchQuery = $state("");
  let isExpanded = $state(false);
  let isSmallScreen = $state(false);

  // Match History Modal State
  let historyPlayer = $state<{ id: string; name: string } | null>(null);

  // Resize Listener
  import { onMount, onDestroy } from "svelte";
  function handleResize() {
    isSmallScreen = window.innerWidth < 800;
  }
  onMount(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
  });
  onDestroy(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", handleResize);
    }
  });

  // Effective columns considering screen size
  let effectiveColumns = $derived(isSmallScreen ? 1 : leaderboardColumns || 1);

  // Sort and process standings
  let processedLeaderboard = $derived.by(() => {
    const standings = [...leaderboard].sort((a, b) => {
      if (isDivision) {
        const mpA = (a as any).matchPoints || 0;
        const mpB = (b as any).matchPoints || 0;
        if (mpB !== mpA) return mpB - mpA;
        if (tiebreaker === "difference") {
          const diffA = (a.points || 0) - (a.pointsLost || 0);
          const diffB = (b.points || 0) - (b.pointsLost || 0);
          if (diffB !== diffA) return diffB - diffA;
        } else if (tiebreaker === "most_won") {
          if ((b.points || 0) !== (a.points || 0)) return (b.points || 0) - (a.points || 0);
        }
        return (b.wins || 0) - (a.wins || 0);
      }

      switch (rankingCriteria) {
        case "wins":
          if (b.wins !== a.wins) return b.wins - a.wins;
          if (b.points !== a.points) return b.points - a.points;
          return b.points - (b.pointsLost || 0) - (a.points - (a.pointsLost || 0));
        case "winRatio":
          const aRate = a.played > 0 ? a.wins / a.played : 0;
          const bRate = b.played > 0 ? b.wins / b.played : 0;
          if (Math.abs(bRate - aRate) > 0.001) return bRate - aRate;
          return b.points - a.points;
        case "pointRatio":
          const aTotal = a.points + (a.pointsLost || 0);
          const bTotal = b.points + (b.pointsLost || 0);
          const aPRate = aTotal > 0 ? a.points / aTotal : 0;
          const bPRate = bTotal > 0 ? b.points / bTotal : 0;
          if (Math.abs(bPRate - aPRate) > 0.001) return bPRate - aPRate;
          return b.points - a.points;
        case "points":
        default:
          if (b.points !== a.points) return b.points - a.points;
          if (b.wins !== a.wins) return b.wins - a.wins;
          return b.points - (b.pointsLost || 0) - (a.points - (a.pointsLost || 0));
      }
    });

    const withRanks = standings.map((p, idx) => ({
      ...p,
      currentRank: idx + 1,
    }));

    let list = withRanks;
    if (hideLeaderboard) {
      list = [...withRanks].sort((a, b) => String(a.id).localeCompare(String(b.id)));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter((p) => p.name.toLowerCase().includes(query));
    }

    return list;
  });

  let visibleLeaderboard = $derived.by(() => {
    if (isExpanded || searchQuery.trim() || processedLeaderboard.length <= 12 || effectiveColumns > 1) {
      return processedLeaderboard;
    }
    return processedLeaderboard.slice(0, 10);
  });

  let totalCount = $derived(processedLeaderboard.length);

  function getColumnData() {
    const cols = Math.max(1, effectiveColumns);
    if (cols === 1 || searchQuery) return [visibleLeaderboard];

    const perCol = Math.ceil(visibleLeaderboard.length / cols);
    const result = [];
    for (let i = 0; i < cols; i++) {
      result.push(visibleLeaderboard.slice(i * perCol, (i + 1) * perCol));
    }
    return result;
  }

  let columnData = $derived(getColumnData());

  function getRankClass(rank: number) {
    if (hideLeaderboard) return "";
    if (rank === 1) return "bg-gradient-to-r from-yellow-500/10 to-transparent";
    if (rank === 2) return "bg-gradient-to-r from-gray-400/5 to-transparent";
    if (rank === 3) return "bg-gradient-to-r from-orange-600/5 to-transparent";
    return "";
  }

  async function handleShare() {
    const success = await copyLeaderboardToClipboard();
    if (success) {
      showToast("Leaderboard copied to clipboard!", "success");
    } else {
      showToast("Failed to copy leaderboard", "error");
    }
  }

  function handlePrint() {
    window.print();
  }
</script>

<div class="leaderboard-section overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 shadow-2xl backdrop-blur-xl font-sans select-none relative z-10">
  <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent via-warning to-success"></div>

  {#if historyPlayer}
    <PlayerMatchHistory
      playerId={historyPlayer.id}
      playerName={historyPlayer.name}
      isOpen={!!historyPlayer}
      onClose={() => (historyPlayer = null)}
    />
  {/if}

  <!-- Header & Controls -->
  <div class="p-6 border-b border-white/5 space-y-4">
    <div class="flex flex-col xl:flex-row gap-4 justify-between items-center w-full">
      <h3 class="text-xl font-black text-white tracking-tight font-display">
        {isPlayoffs ? "Group Stage (Final Standings)" : "Leaderboard"}
      </h3>

      <div class="flex flex-col sm:flex-row gap-4 items-center w-full xl:w-auto">
        <!-- Criteria Tabs -->
        <div class="flex border-b border-white/5 w-full sm:w-auto">
          {#each [
            { id: "points", label: "Points" },
            { id: "wins", label: "Wins" },
            { id: "winRatio", label: "Win %" },
            { id: "pointRatio", label: "Pts %" }
          ] as tab}
            <button
              type="button"
              class="flex-1 sm:flex-initial px-4 py-2.5 text-[10px] font-black uppercase tracking-wider transition-all border-b-2 -mb-px {
                rankingCriteria === tab.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted-foreground hover:text-white'
              }"
              onclick={() => tournament.updateField("rankingCriteria", tab.id)}
            >
              {tab.label}
            </button>
          {/each}
        </div>

        <div class="flex gap-4 items-center w-full sm:w-auto justify-end">
          <!-- Column Selector -->
          <div class="flex bg-white/[0.03] border border-white/5 rounded-xl p-1 shrink-0">
            {#each [1, 2, 3] as num}
              <button
                type="button"
                class="px-3 py-1.5 text-[10px] font-black rounded-lg transition-colors uppercase tracking-wider {
                  leaderboardColumns === num || (num === 1 && !leaderboardColumns)
                    ? 'bg-accent text-white shadow-md'
                    : 'text-muted-foreground hover:text-white'
                }"
                onclick={() => tournament.updateField("leaderboardColumns", num)}
                title="{num} Column{num > 1 ? 's' : ''}"
              >
                {num} Col
              </button>
            {/each}
          </div>

          <!-- Toggles -->
          <div class="flex bg-white/[0.03] border border-white/5 rounded-xl p-1 shrink-0">
            <button
              type="button"
              class="px-3 py-1.5 text-[10px] font-black rounded-lg transition-colors uppercase tracking-wider {
                !hideLeaderboard
                  ? 'bg-accent text-white shadow-md'
                  : 'text-muted-foreground hover:text-white'
              }"
              onclick={() => tournament.updateField("hideLeaderboard", !hideLeaderboard)}
            >
              Scores
            </button>
            <button
              type="button"
              class="px-3 py-1.5 text-[10px] font-black rounded-lg transition-colors uppercase tracking-wider {
                showPositionChanges
                  ? 'bg-accent text-white shadow-md'
                  : 'text-muted-foreground hover:text-white'
              }"
              onclick={() => tournament.updateField("showPositionChanges", !showPositionChanges)}
            >
              Ranks
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="relative w-full">
      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 flex items-center justify-center">
        <Icons name="search" size="14" />
      </span>
      <input
        type="text"
        class="w-full pl-11 pr-11 py-3 rounded-xl bg-black/25 border border-white/10 text-white placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent transition-colors font-bold text-xs"
        placeholder="Search players..."
        bind:value={searchQuery}
      />
      {#if searchQuery}
        <button
          type="button"
          class="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
          onclick={() => (searchQuery = "")}
        >
          <Icons name="x" size="14" />
        </button>
      {/if}
    </div>
  </div>

  <!-- Table Content -->
  {#if isDivision}
    <!-- Division grouped tables -->
    <div class="p-6 {effectiveColumns === 1 ? 'space-y-8' : `grid gap-6 ${effectiveColumns === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}">
      {#each (() => {
        const divGroups = new Map<string, typeof visibleLeaderboard>();
        visibleLeaderboard.forEach((p) => {
          const div = (p as any).division || "A";
          if (!divGroups.has(div)) divGroups.set(div, []);
          divGroups.get(div)!.push(p);
        });
        return [...divGroups.keys()].sort().map((divName) => ({
          name: divName,
          players: divGroups.get(divName)!,
        }));
      })() as division}
        <div class="space-y-3">
          <h4 class="text-xs font-black text-accent uppercase tracking-widest pl-1 font-display">
            Division {division.name}
          </h4>
          <div class="overflow-x-auto rounded-2xl border border-white/5 bg-black/15 shadow-lg">
            <table class="w-full text-xs font-sans">
              <thead>
                <tr class="border-b border-white/5 bg-white/[0.01]">
                  <th class="w-12 py-3 text-center text-[9px] font-black text-muted-foreground uppercase tracking-wider">#</th>
                  <th class="py-3 text-left text-[9px] font-black text-muted-foreground uppercase tracking-wider">Team</th>
                  <th class="w-10 py-3 text-center text-[9px] font-black text-muted-foreground uppercase tracking-wider">P</th>
                  <th class="w-10 py-3 text-center text-[9px] font-black text-muted-foreground uppercase tracking-wider" title="Wins">W</th>
                  <th class="w-10 py-3 text-center text-[9px] font-black text-muted-foreground uppercase tracking-wider" title="Draws">D</th>
                  <th class="w-10 py-3 text-center text-[9px] font-black text-muted-foreground uppercase tracking-wider" title="Losses">L</th>
                  <th class="w-10 py-3 text-center text-[9px] font-black text-accent uppercase font-black tracking-wider" title="Total Points">Pts</th>
                </tr>
              </thead>
              <tbody>
                {#each division.players as player, idx}
                  {@const mp = (player as any).matchPoints || 0}
                  {@const draws = (player as any).draws || 0}
                  {@const rank = idx + 1}
                  {@const rankClass = getRankClass(rank)}
                  <!-- svelte-ignore a11y_click_events_have_key_events -->
                  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                  <tr
                    class="border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.03] transition-colors cursor-pointer group/row {rankClass}"
                    onclick={() => (historyPlayer = { id: player.id, name: player.name })}
                  >
                    <td class="py-3 text-center">
                      <span class="inline-flex items-center justify-center w-6 h-6 rounded-full font-black text-[10px] {
                        rank === 1 ? 'bg-yellow-500 text-black'
                          : rank === 2 ? 'bg-gray-400 text-black'
                            : rank === 3 ? 'bg-orange-600 text-white'
                              : 'bg-white/[0.04] text-muted-foreground'
                      }">
                        {!hideLeaderboard ? rank : "-"}
                      </span>
                    </td>
                    <td class="py-3 pr-2">
                      <span class="font-bold text-white truncate block max-w-[150px] group-hover/row:text-accent transition-colors font-display">
                        {player.name}
                      </span>
                    </td>
                    <td class="py-3 text-center text-muted-foreground font-bold">{!hideLeaderboard ? player.played : "-"}</td>
                    <td class="py-3 text-center text-success font-bold">{!hideLeaderboard ? player.wins : "-"}</td>
                    <td class="py-3 text-center text-muted-foreground/60 font-bold">{!hideLeaderboard ? draws : "-"}</td>
                    <td class="py-3 text-center text-red-500/80 font-bold">{!hideLeaderboard ? player.losses : "-"}</td>
                    <td class="py-3 text-center">
                      <span class="font-black text-sm text-accent font-display">{!hideLeaderboard ? mp : "-"}</span>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <!-- Standard table layout -->
    <div class="grid gap-6 p-6 {
      effectiveColumns === 1
        ? 'grid-cols-1'
        : effectiveColumns === 2
          ? 'grid-cols-2'
          : 'grid-cols-3'
    }">
      {#each columnData as dataSlice, colIdx}
        <div class="overflow-x-auto rounded-2xl border border-white/5 bg-black/15 shadow-lg">
          <table class="w-full text-xs font-sans">
            <thead>
              <tr class="border-b border-white/5 bg-white/[0.01]">
                <th class="w-16 py-3.5 text-center text-[9px] font-black text-muted-foreground uppercase tracking-wider">Rank</th>
                <th class="py-3.5 text-left text-[9px] font-black text-muted-foreground uppercase tracking-wider">Player</th>
                <th class="w-16 py-3.5 text-center text-[9px] font-black text-accent uppercase tracking-wider">Pts</th>
                <th class="w-12 py-3.5 text-center text-[9px] font-black text-muted-foreground uppercase tracking-wider">W</th>
                <th class="w-14 py-3.5 text-center text-[9px] font-black text-muted-foreground uppercase tracking-wider">Win%</th>
                <th class="w-14 py-3.5 text-center text-[9px] font-black text-muted-foreground uppercase tracking-wider">Pts%</th>
                <th class="w-12 py-3.5 text-center text-[9px] font-black text-muted-foreground uppercase tracking-wider">M</th>
              </tr>
            </thead>
            <tbody>
              {#each dataSlice as player}
                {@const rank = player.currentRank}
                {@const prevRank = player.previousRank || rank}
                {@const rankChange = prevRank - rank}
                {@const rankClass = getRankClass(rank)}

                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
                <tr
                  class="border-b border-white/[0.03] last:border-b-0 hover:bg-white/[0.03] transition-colors cursor-pointer group/row {rankClass}"
                  onclick={() => (historyPlayer = { id: player.id, name: player.name })}
                >
                  <!-- Rank Column -->
                  <td class="py-3 text-center">
                    <div class="flex items-center justify-center gap-1.5">
                      <span class="inline-flex items-center justify-center w-7 h-7 rounded-full font-black text-[10px] {
                        rank === 1
                          ? 'bg-yellow-500 text-black shadow-glow shadow-yellow-500/10'
                          : rank === 2
                            ? 'bg-gray-400 text-black shadow-glow shadow-gray-400/10'
                            : rank === 3
                              ? 'bg-orange-600 text-white shadow-glow shadow-orange-600/10'
                              : 'bg-white/[0.04] text-muted-foreground'
                      }">
                        {!hideLeaderboard ? rank : "-"}
                      </span>
                      {#if showPositionChanges}
                        <span class="text-[9px] font-bold {
                          rankChange > 0
                            ? 'text-success'
                            : rankChange < 0
                              ? 'text-red-500'
                              : 'text-muted-foreground/50'
                        }">
                          {rankChange > 0 ? `▲${rankChange}` : rankChange < 0 ? `▼${Math.abs(rankChange)}` : "-"}
                        </span>
                      {/if}
                    </div>
                  </td>

                  <!-- Player Column -->
                  <td class="py-3 pr-2">
                    <span class="font-bold text-white truncate block max-w-[120px] sm:max-w-[200px] group-hover/row:text-accent transition-colors font-display">
                      {player.name}
                    </span>
                  </td>

                  <!-- Points -->
                  <td class="py-3 text-center">
                    <span class="font-black text-sm text-white font-display">
                      {!hideLeaderboard ? player.points : "-"}
                    </span>
                  </td>

                  <!-- Wins -->
                  <td class="py-3 text-center text-muted-foreground/80 font-bold">
                    {!hideLeaderboard ? player.wins : "-"}
                  </td>

                  <!-- Win % -->
                  <td class="py-3 text-center text-muted-foreground/60 font-bold">
                    {!hideLeaderboard && player.played > 0
                      ? `${Math.round((player.wins / player.played) * 100)}%`
                      : "-"}
                  </td>

                  <!-- Pts % -->
                  <td class="py-3 text-center text-muted-foreground/60 font-bold">
                    {!hideLeaderboard && player.points + (player.pointsLost || 0) > 0
                      ? `${Math.round((player.points / (player.points + (player.pointsLost || 0))) * 100)}%`
                      : "-"}
                  </td>

                  <!-- Matches Played -->
                  <td class="py-3 text-center text-muted-foreground/60 font-bold">
                    {!hideLeaderboard || showPositionChanges ? player.played : "-"}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Pagination / Expand -->
  {#if !searchQuery && totalCount > 10 && effectiveColumns === 1}
    <div class="p-4 border-t border-white/5 text-center">
      <button
        type="button"
        class="text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-white transition-colors inline-flex items-center gap-1.5"
        onclick={() => (isExpanded = !isExpanded)}
      >
        <span>{isExpanded ? "▲" : "▼"}</span>
        <span>{isExpanded ? "Show Less" : `Show more (${totalCount - 10} more players)`}</span>
      </button>
    </div>
  {/if}

  <!-- Footer Actions -->
  <div class="px-6 py-4 border-t border-white/5 flex justify-between items-center bg-white/[0.01] shrink-0 font-display">
    <span class="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
      {totalCount} Players
    </span>
    <div class="flex gap-2">
      <button
        type="button"
        class="px-4 py-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:text-white border border-white/5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all"
        onclick={handleShare}
      >
        Share Results
      </button>
      <button
        type="button"
        class="px-4 py-2 text-[10px] font-black uppercase tracking-wider bg-accent hover:bg-accent-hover text-white rounded-xl shadow-md transition-all border-0"
        onclick={handlePrint}
      >
        Print
      </button>
    </div>
  </div>
</div>

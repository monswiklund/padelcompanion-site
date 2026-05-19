<script lang="ts">
  import { fade, scale } from "svelte/transition";
  import { tournament } from "$lib/stores/tournament.svelte";
  import { formatEstimatedRoundStart } from "$lib/tournament/ui/components/scheduleTiming";
  import { getCourtDisplayName } from "$lib/tournament/courtNames";
  import { getDivisionColor } from "$lib/tournament/core/constants";
  import { tick } from "svelte";

  interface Props {
    isOpen: boolean;
    onClose: () => void;
  }

  let { isOpen, onClose }: Props = $props();

  let ts = $derived(tournament.state);
  let schedule = $derived(ts.schedule);
  let allRounds = $derived(ts.allRounds);
  let roundStartedAt = $derived(ts.roundStartedAt);

  let containerEl: HTMLDivElement | null = $state(null);
  let liveRowEl: HTMLDivElement | null = $state(null);

  let activeRoundIndex = $derived(schedule.length > 0 ? schedule.length - 1 : -1);

  let fullSchedule = $derived.by(() => {
    const mergedRounds = schedule.map((round) => ({ ...round }));
    if (!allRounds) return mergedRounds;

    allRounds.forEach((round, index) => {
      if (!mergedRounds[index]) {
        mergedRounds[index] = { ...round };
      }
    });

    return mergedRounds;
  });

  $effect(() => {
    if (isOpen) {
      tick().then(() => {
        setTimeout(() => {
          if (liveRowEl && containerEl) {
            liveRowEl.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }, 120);
      });
    }
  });

  function getCourtName(courtNum: number, division?: string | null) {
    return getCourtDisplayName(ts, courtNum, division);
  }

  function getDivisionStyles(division: string) {
    const colors = getDivisionColor(ts.divisions || [], division);
    return `${colors.bg} ${colors.text} ${colors.border}`;
  }

  // Svelte action to capture live-round element refs
  function refLiveRow(node: HTMLDivElement, isCur: boolean) {
    if (isCur) liveRowEl = node;
    return {
      update(newIsCur: boolean) { if (newIsCur) liveRowEl = node; }
    };
  }
</script>

{#if isOpen}
  <!-- Backdrop -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
  <div
    transition:fade={{ duration: 150 }}
    class="fixed inset-0 bg-black/75 backdrop-blur-md z-[900] flex items-center justify-center p-4 sm:p-6"
    onclick={onClose}
    role="button"
    tabindex="0"
  >
    <!-- Modal Container -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      transition:scale={{ duration: 200, start: 0.97 }}
      class="bg-[#18181b] border border-white/10 rounded-[2rem] p-6 sm:p-8 w-full max-w-7xl shadow-2xl relative select-none overflow-hidden flex flex-col max-h-[90vh]"
      onclick={(e) => e.stopPropagation()}
    >
      <!-- Title -->
      <div class="flex items-center justify-between mb-6 pb-4 border-b border-white/5 shrink-0">
        <h3 class="text-xl font-black text-white flex items-center gap-2 tracking-tight font-display">
          <span class="text-accent">📅</span>
          <span>Full Tournament Schedule</span>
        </h3>
        <button
          type="button"
          onclick={onClose}
          class="w-8 h-8 rounded-full bg-white/[0.04] border border-white/5 text-muted-foreground hover:text-white transition-all flex items-center justify-center font-bold"
        >
          ✕
        </button>
      </div>

      <!-- Schedule Content -->
      <div
        bind:this={containerEl}
        class="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1 p-1"
      >
        {#each fullSchedule as round, rIdx}
          {@const isPlayed = rIdx < schedule.length}
          {@const currentScheduleRound = schedule[rIdx]}
          {@const isCurrent = !!currentScheduleRound && rIdx === schedule.length - 1 && !currentScheduleRound.completed}
          {@const activeRound = isPlayed ? schedule[rIdx] : null}

          <div
            use:refLiveRow={isCurrent}
            class="rounded-2xl border transition-all p-5 {
              isCurrent
                ? 'border-accent bg-accent/5 ring-1 ring-accent/15 shadow-glow'
                : isPlayed
                  ? 'border-white/5 bg-white/[0.01]'
                  : 'border-white/5 bg-white/[0.01] opacity-50'
            }"
          >
            <div class="flex items-center justify-between mb-4 font-display">
              <div class="flex items-center gap-3">
                <span class="text-base font-black {isCurrent ? 'text-accent' : 'text-white'}">
                  {round.name || `Round ${round.number}`}
                </span>
                <span class="text-[10px] font-black uppercase tracking-wider text-muted-foreground bg-white/[0.03] px-2 py-0.5 rounded border border-white/5">
                  {isPlayed && activeRound?.durationSeconds
                    ? `${Math.round(activeRound.durationSeconds / 60)} min`
                    : `Est: ${formatEstimatedRoundStart(ts, rIdx)}`}
                </span>
              </div>

              <div class="flex items-center gap-2">
                {#if isCurrent}
                  <span class="px-2.5 py-0.5 text-[9px] font-black bg-accent text-white rounded-full animate-pulse uppercase tracking-wider">
                    Live
                  </span>
                {:else if isPlayed}
                  <span class="px-2.5 py-0.5 text-[9px] font-black bg-success/10 text-success rounded-full border border-success/20 uppercase tracking-wider">
                    Done
                  </span>
                {:else}
                  <span class="px-2.5 py-0.5 text-[9px] font-black bg-white/[0.04] text-muted-foreground rounded-full border border-white/5 uppercase tracking-wider">
                    Upcoming
                  </span>
                {/if}
              </div>
            </div>

            <!-- Matches Grid -->
            <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {#each round.matches as match, mIdx}
                {@const playedMatch = activeRound?.matches[mIdx]}
                {@const hasScores = playedMatch?.score1 != null && playedMatch?.score2 != null}
                {@const matchDivisionId = ts.format === "division" ? (match.team1[0] as any)?.divisionId : null}
                {@const matchDivision = (match.team1[0] as any)?.division || "A"}

                <div class="rounded-xl border border-white/5 bg-black/25 p-3.5 shadow-md flex flex-col justify-between">
                  <div class="flex justify-between items-center mb-3">
                    <span class="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                      {getCourtName(match.court, matchDivision)}
                    </span>
                    {#if ts.format === "division"}
                      <span class="px-1.5 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-wider {getDivisionStyles(matchDivision)}">
                        Div {matchDivision}
                      </span>
                    {/if}
                  </div>

                  <div class="flex items-center justify-between gap-2 font-display">
                    <div class="flex-1 flex flex-col min-w-0">
                      <span class="text-xs font-bold truncate text-white">
                        {match.team1.map((p) => p.name).join(" / ")}
                      </span>
                    </div>

                    <div class="flex flex-col items-center px-1.5 shrink-0">
                      {#if hasScores}
                        <div class="flex items-center gap-1.5 bg-accent/5 border border-accent/10 px-2 py-0.5 rounded-lg">
                          <span class="text-xs font-black tabular-nums {playedMatch.score1! > playedMatch.score2! ? 'text-success' : playedMatch.score1! < playedMatch.score2! ? 'text-red-500' : 'text-orange-400'}">
                            {playedMatch.score1}
                          </span>
                          <span class="text-[9px] font-black text-muted-foreground/30">-</span>
                          <span class="text-xs font-black tabular-nums {playedMatch.score2! > playedMatch.score1! ? 'text-success' : playedMatch.score2! < playedMatch.score1! ? 'text-red-500' : 'text-orange-400'}">
                            {playedMatch.score2}
                          </span>
                        </div>
                      {:else}
                        <span class="text-[9px] font-black text-muted-foreground/50 uppercase tracking-tighter">VS</span>
                      {/if}
                    </div>

                    <div class="flex-1 flex flex-col min-w-0 text-right">
                      <span class="text-xs font-bold truncate text-white">
                        {match.team2.map((p) => p.name).join(" / ")}
                      </span>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}

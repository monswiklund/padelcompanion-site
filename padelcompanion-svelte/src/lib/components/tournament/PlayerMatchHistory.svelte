<script lang="ts">
  import { fade, scale } from "svelte/transition";
  import { tournament } from "$lib/stores/tournament.svelte";
  import { getCourtDisplayName } from "$lib/tournament/courtNames";

  interface Props {
    playerId: string;
    playerName: string;
    isOpen: boolean;
    onClose: () => void;
  }

  let { playerId, playerName, isOpen, onClose }: Props = $props();

  let ts = $derived(tournament.state);
  let schedule = $derived(ts.schedule);

  // Find all matches for this player
  let playerMatches = $derived(
    schedule.flatMap((round, roundIdx) =>
      round.matches
        .map((match, matchIdx) => ({
          ...match,
          roundName: round.name || `Round ${round.number}`,
          roundIdx,
          matchIdx,
        }))
        .filter(
          (match) =>
            match.team1.some((p) => p.id === playerId) ||
            match.team2.some((p) => p.id === playerId)
        )
    )
  );

  function getMatchResult(match: any) {
    if (match.score1 == null || match.score2 == null) return "upcoming";

    const isTeam1 = match.team1.some((p: any) => p.id === playerId);
    const playerScore = isTeam1 ? match.score1 : match.score2;
    const opponentScore = isTeam1 ? match.score2 : match.score1;

    if (playerScore > opponentScore) return "win";
    if (playerScore < opponentScore) return "loss";
    return "draw";
  }

  const resultColors = {
    win: "bg-success/15 border-success/20 text-success",
    loss: "bg-red-500/15 border-red-500/20 text-red-500",
    draw: "bg-warning/15 border-warning/20 text-warning",
    upcoming: "bg-white/[0.04] border-white/5 text-muted-foreground",
  };

  const resultLabels = {
    win: "Win",
    loss: "Loss",
    draw: "Draw",
    upcoming: "Upcoming",
  };
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
      transition:scale={{ duration: 200, start: 0.96 }}
      class="bg-[#18181b] border border-white/10 rounded-[2rem] p-6 sm:p-8 w-full max-w-lg shadow-2xl relative select-none overflow-hidden"
      onclick={(e) => e.stopPropagation()}
    >
      <!-- Title -->
      <div class="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
        <h3 class="text-xl font-black text-white flex items-center gap-2 tracking-tight font-display">
          <span class="text-accent">📊</span>
          <span>Match History: {playerName}</span>
        </h3>
        <button
          type="button"
          onclick={onClose}
          class="w-8 h-8 rounded-full bg-white/[0.04] border border-white/5 text-muted-foreground hover:text-white transition-all flex items-center justify-center font-bold"
        >
          ✕
        </button>
      </div>

      <!-- History List -->
      <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {#if playerMatches.length === 0}
          <div class="text-center py-12 text-muted-foreground italic font-sans text-sm">
            No matches found for this player yet.
          </div>
        {:else}
          {#each playerMatches as match, i}
            {@const result = getMatchResult(match)}
            {@const isTeam1 = match.team1.some((p) => p.id === playerId)}
            {@const opponent = isTeam1 ? match.team2 : match.team1}
            {@const playerScore = isTeam1 ? match.score1 : match.score2}
            {@const opponentScore = isTeam1 ? match.score2 : match.score1}
            {@const matchDivision = ts.format === "division" ? (match.team1[0] as any)?.division || "A" : null}

            <div class="flex flex-col p-4 rounded-2xl border bg-white/[0.02] border-white/5 transition-all hover:bg-white/[0.04]">
              <div class="flex justify-between items-center mb-3">
                <span class="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  {match.roundName} · {getCourtDisplayName(ts, match.court, matchDivision)}
                </span>
                <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border {resultColors[result]}">
                  {resultLabels[result]}
                </span>
              </div>

              <div class="flex items-center justify-between gap-4 font-display">
                <div class="flex-1 text-center min-w-0">
                  <p class="font-bold truncate text-white text-sm">
                    {playerName}
                  </p>
                </div>

                <div class="flex flex-col items-center shrink-0">
                  <div class="text-lg font-black tabular-nums text-accent bg-accent/5 border border-accent/10 px-3 py-1 rounded-xl">
                    {#if playerScore != null && opponentScore != null}
                      {playerScore} - {opponentScore}
                    {:else}
                      vs
                    {/if}
                  </div>
                </div>

                <div class="flex-1 text-center min-w-0">
                  <p class="font-bold truncate text-white text-sm">
                    {opponent.map((p) => p.name).join(" / ")}
                  </p>
                </div>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </div>
{/if}

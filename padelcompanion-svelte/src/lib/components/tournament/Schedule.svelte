<script lang="ts">
  import Icons from "$lib/components/Icons.svelte";
  import FullScheduleModal from "./FullScheduleModal.svelte";
  import { tournament } from "$lib/stores/tournament.svelte";
  import { showConfirmModal } from "$lib/tournament/core/modals";
  import { showToast } from "$lib/shared/utils";
  import { launchConfetti } from "$lib/tournament/confetti";
  import { formatEstimatedRoundStart, getEstimatedRoundStartRelativeLabel } from "$lib/tournament/ui/components/scheduleTiming";
  import { getCourtDisplayName } from "$lib/tournament/courtNames";
  import { getDivisionColor } from "$lib/tournament/core/constants";
  import { tick, onMount } from "svelte";

  let ts = $derived(tournament.state);
  let schedule = $derived(ts.schedule);
  let format = $derived(ts.format);
  let allRounds = $derived(ts.allRounds);
  let roundStartedAt = $derived(ts.roundStartedAt);
  let divisions = $derived(ts.divisions || []);

  let isFullScheduleOpen = $state(false);
  let elMap = new Map<number, HTMLDivElement>();

  // Auto-scroll to the new active round when schedule length increases
  $effect(() => {
    if (schedule.length > 0) {
      const lastRoundIdx = schedule.length - 1;
      tick().then(() => {
        setTimeout(() => {
          const el = elMap.get(lastRoundIdx);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 120);
      });
    }
  });

  function getCourtName(courtNum: number, division?: string | null) {
    return getCourtDisplayName(ts, courtNum, division);
  }

  function getDivisionStyles(division: string) {
    const colors = getDivisionColor(divisions, division);
    return `${colors.bg} ${colors.text} ${colors.border}`;
  }

  // Svelte action to assign round elements to a map
  function refRound(node: HTMLDivElement, idx: number) {
    elMap.set(idx, node);
    return { destroy() { elMap.delete(idx); } };
  }

  let nextRoundPreview = $derived(
    format === "division" && allRounds && schedule.length < allRounds.length
      ? allRounds[schedule.length]
      : null
  );

  let mergedRounds = $derived.by(() => {
    const rounds = (allRounds || []).map((round, index) =>
      schedule[index] ? schedule[index] : round
    );
    return rounds;
  });

  let upcomingRounds = $derived(mergedRounds.slice(schedule.length));

  function handleScoreChange(
    rIdx: number,
    mIdx: number,
    team: 1 | 2,
    val: number
  ) {
    const newSchedule = [...schedule];
    const match = { ...newSchedule[rIdx].matches[mIdx] };
    if (team === 1) match.score1 = val;
    else match.score2 = val;

    if (ts.scoringMode === "total") {
      if (team === 1) match.score2 = ts.pointsPerMatch - val;
      else match.score1 = ts.pointsPerMatch - val;
    } else if (ts.scoringMode === "race") {
      if (val < ts.pointsPerMatch) {
        if (team === 1) match.score2 = ts.pointsPerMatch;
        else match.score1 = ts.pointsPerMatch;
      }
    }

    newSchedule[rIdx].matches[mIdx] = match;
    tournament.updateField("schedule", newSchedule);
  }

  function handleCompleteRound(rIdx: number) {
    const round = schedule[rIdx];
    if (round?.name === "Final") {
      launchConfetti();
    }
    tournament.completeRound();
    showToast(`Round ${rIdx + 1} Completed!`, "success");
  }

  function handleEditRound(rIdx: number, mIdx: number) {
    tournament.editRound(rIdx, mIdx);
    showToast(`Round ${rIdx + 1} re-opened. Match ${mIdx + 1} is ready to edit`, "info");
  }

  function handleToggleBye(playerId: string) {
    const newByes = ts.manualByes.includes(playerId)
      ? ts.manualByes.filter((id) => id !== playerId)
      : [...ts.manualByes, playerId];
    tournament.updateField("manualByes", newByes);
  }

  function getRoundMetaLabel(round: any, idx: number) {
    if (!round.completed) {
      return `Est. Start: ${formatEstimatedRoundStart(ts, idx)}`;
    }
    if (round.durationSeconds == null) {
      return "Finished";
    }
    return `Finished · ${Math.round(round.durationSeconds / 60)} min`;
  }

  let hasDesktopPreview = $derived(upcomingRounds.some((round) => round.matches.length > 0));
</script>

<div class="font-sans select-none relative z-10">
  <div class="items-start gap-8 xl:grid {hasDesktopPreview ? 'xl:grid-cols-[minmax(0,1.25fr)_26rem]' : ''}">
    <div class="min-w-0 space-y-8">
      {#each schedule as round, idx (idx)}
        <div use:refRound={idx} class="relative pt-6">
          <div class="absolute top-2 left-6 z-20">
            <span class="px-3.5 py-1 rounded-full bg-[#18181b] border border-white/5 text-[9px] font-black uppercase tracking-widest text-muted-foreground shadow-lg">
              {getRoundMetaLabel(round, idx)}
            </span>
          </div>

          <!-- Round Card Implementation -->
          <div class="overflow-hidden rounded-[2rem] border border-white/10 bg-black/25 shadow-2xl backdrop-blur-xl transition-all {round.completed ? 'opacity-80' : ''}">
            <!-- Card Header -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class="flex items-center justify-between px-6 py-4 border-b border-white/5 cursor-pointer {round.completed ? 'bg-white/[0.01]' : 'bg-accent/5'}"
              onclick={() => {
                if (round.completed) {
                  // toggle local expand state if needed or show Toast
                }
              }}
            >
              <div class="flex items-center gap-3">
                <span class="text-base font-black text-white font-display">
                  {round.name || `Round ${round.number}`}
                </span>
                {#if !round.completed && !roundStartedAt}
                  <button
                    type="button"
                    class="flex items-center gap-1.5 px-3 py-1 text-xs font-black uppercase tracking-wider bg-success hover:bg-success/80 text-white rounded-xl transition-all border-0 shadow-sm shadow-success/15"
                    onclick={(e) => {
                      e.stopPropagation();
                      tournament.updateField("roundStartedAt", Date.now());
                    }}
                  >
                    ▶ Start
                  </button>
                {:else}
                  <!-- Elapsed clock placeholder -->
                {/if}

                {#if round.completed}
                  <span class="px-2 py-0.5 text-[9px] font-black bg-success/10 text-success rounded-full flex items-center gap-1 border border-success/20 uppercase tracking-wider">
                    <Icons name="check" size="10" /> Completed
                  </span>
                {:else if roundStartedAt}
                  <span class="px-2 py-0.5 text-[9px] font-black bg-accent/15 text-accent rounded-full animate-pulse border border-accent/20 uppercase tracking-wider">
                    ● Ongoing
                  </span>
                {:else}
                  <span class="px-2 py-0.5 text-[9px] font-black bg-warning/10 text-warning rounded-full border border-warning/20 uppercase tracking-wider">
                    ⏸ Ready
                  </span>
                {/if}
              </div>
            </div>

            <!-- Matches List inside Card -->
            <div class="p-6">
              <div
                class="grid gap-4"
                style="grid-template-columns: {
                  ts.gridColumns > 0
                    ? `repeat(${ts.gridColumns}, minmax(0, 1fr))`
                    : 'repeat(auto-fit, minmax(285px, 1fr))'
                }; font-size: {ts.textSize}%;"
              >
                {#each round.matches as match, mIdx}
                  {@const isSelectedMatch = ts.ui.selectedMatchId === `round-${idx}-match-${mIdx}`}
                  {@const matchDivision = format === "division" ? (match.team1[0] as any)?.division || "A" : null}
                  {@const divColorEntry = matchDivision ? getDivisionColor(divisions, matchDivision) : null}

                  <div
                    class="bg-[#1c1c1e] rounded-2xl border overflow-hidden relative group transition-all {
                      isSelectedMatch
                        ? 'border-accent ring-1 ring-accent/30 shadow-glow shadow-accent/15'
                        : divColorEntry
                          ? `${divColorEntry.border} shadow-lg ${divColorEntry.glow}`
                          : 'border-white/5'
                    }"
                  >
                    <div class="relative z-10 flex flex-col h-full">
                      <!-- Match Header bar -->
                      <div class="flex items-center justify-between px-3.5 py-2.5 bg-black/40 backdrop-blur-sm border-b border-white/5 font-display select-none">
                        <div class="flex items-center gap-2">
                          {#if matchDivision}
                            <span class="px-1.5 py-0.5 text-[9px] font-black rounded bg-accent text-white uppercase tracking-wider">
                              {matchDivision}
                            </span>
                          {/if}
                          <span class="text-xs font-bold text-white">
                            {getCourtName(match.court, matchDivision)}
                          </span>
                        </div>
                        <span class="text-[9px] text-white/50 font-black uppercase tracking-wider">
                          {ts.scoringMode === "total"
                            ? `Total ${ts.pointsPerMatch}`
                            : ts.scoringMode === "race"
                              ? `Race to ${ts.pointsPerMatch}`
                              : `${ts.pointsPerMatch} mins`}
                        </span>
                      </div>

                      <!-- Teams and inputs -->
                      <div class="p-5 flex-1 flex flex-col justify-between font-display">
                        <div class="flex justify-between items-center mb-4 relative">
                          <!-- Team 1 -->
                          <div class="flex-1 text-center min-w-0">
                            {#each match.team1 as p}
                              {@const names = p.name.includes("/") ? p.name.split("/") : [p.name]}
                              {#each names as name}
                                <div class="font-bold truncate text-white text-sm py-0.5">
                                  {name.trim()}
                                </div>
                              {/each}
                            {/each}
                          </div>

                          <div class="text-white/40 font-black px-3.5 text-[10px] italic shrink-0">
                            VS
                          </div>

                          <!-- Team 2 -->
                          <div class="flex-1 text-center min-w-0">
                            {#each match.team2 as p}
                              {@const names = p.name.includes("/") ? p.name.split("/") : [p.name]}
                              {#each names as name}
                                <div class="font-bold truncate text-white text-sm py-0.5">
                                  {name.trim()}
                                </div>
                              {/each}
                            {/each}
                          </div>
                        </div>

                        <!-- Score Box -->
                        <div class="flex items-center justify-center gap-3 select-none">
                          {#if !round.completed}
                            <input
                              type="text"
                              inputmode="numeric"
                              pattern="[0-9]*"
                              class="w-14 h-11 text-center text-xl font-black bg-black/45 border border-white/10 rounded-xl placeholder:text-white/20 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-white"
                              placeholder="0"
                              value={match.score1 != null ? match.score1 : ""}
                              onfocus={(e) => (e.target as HTMLInputElement).select()}
                              oninput={(e) => {
                                const el = e.target as HTMLInputElement;
                                const val = el.value === "" ? 0 : parseInt(el.value);
                                if (!isNaN(val)) handleScoreChange(idx, mIdx, 1, val);
                              }}
                            />
                            <span class="text-xl text-white/30 font-black">-</span>
                            <input
                              type="text"
                              inputmode="numeric"
                              pattern="[0-9]*"
                              class="w-14 h-11 text-center text-xl font-black bg-black/45 border border-white/10 rounded-xl placeholder:text-white/20 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-white"
                              placeholder="0"
                              value={match.score2 != null ? match.score2 : ""}
                              onfocus={(e) => (e.target as HTMLInputElement).select()}
                              oninput={(e) => {
                                const el = e.target as HTMLInputElement;
                                const val = el.value === "" ? 0 : parseInt(el.value);
                                if (!isNaN(val)) handleScoreChange(idx, mIdx, 2, val);
                              }}
                            />
                          {:else}
                            <div class="flex flex-col items-center gap-2.5 w-full">
                              <div class="flex items-center gap-3 bg-black/25 border border-white/5 px-4 py-1.5 rounded-2xl">
                                <span class="text-2xl font-black tabular-nums {
                                  (match.score1 ?? 0) > (match.score2 ?? 0) ? 'text-success' : (match.score1 ?? 0) < (match.score2 ?? 0) ? 'text-red-500' : 'text-orange-400'
                                }">
                                  {match.score1}
                                </span>
                                <span class="text-base text-white/25 font-black">-</span>
                                <span class="text-2xl font-black tabular-nums {
                                  (match.score2 ?? 0) > (match.score1 ?? 0) ? 'text-success' : (match.score2 ?? 0) < (match.score1 ?? 0) ? 'text-red-500' : 'text-orange-400'
                                }">
                                  {match.score2}
                                </span>
                              </div>
                              <button
                                type="button"
                                class="px-3 py-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-white bg-white/[0.03] hover:bg-white/[0.06] rounded-full border border-white/5 transition-all"
                                onclick={() => handleEditRound(idx, mIdx)}
                              >
                                Edit Result
                              </button>
                            </div>
                          {/if}
                        </div>
                      </div>
                    </div>

                    <!-- Completed check overlay -->
                    {#if (match.score1 != null && match.score2 != null) && !round.completed}
                      <div class="absolute top-2.5 right-2.5 z-20 w-4 h-4 bg-success rounded-full flex items-center justify-center border border-white/20 animate-in zoom-in duration-300">
                        <Icons name="check" size="10" class="text-white" />
                      </div>
                    {/if}
                  </div>
                {/each}
              </div>

              <!-- Byes / Resting -->
              {#if round.byes && round.byes.length > 0}
                <div class="mt-4 px-4 py-2.5 bg-warning/5 rounded-2xl border border-warning/15 text-center font-display">
                  <span class="text-[9px] font-black text-warning uppercase mr-2 tracking-wider">Resting:</span>
                  <span class="text-xs font-semibold text-muted-foreground">
                    {round.byes.map((p) => p.name).join(", ")}
                  </span>
                </div>
              {/if}

              <!-- Bottom controls for active/last round -->
              {#if !round.completed && idx === schedule.length - 1}
                <div class="mt-6 space-y-4">
                  <!-- Bye toggle selector -->
                  {#if format !== "division"}
                    <div class="bg-black/25 rounded-2xl p-4 border border-white/5 space-y-3 font-display">
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-bold text-muted-foreground">
                          Toggle who rests next round:
                        </span>
                        <span class="text-[9px] font-black text-muted-foreground bg-white/[0.04] px-2 py-0.5 rounded border border-white/5 uppercase tracking-wider">
                          {ts.manualByes.length} selected
                        </span>
                      </div>
                      <div class="flex flex-wrap gap-2 pt-1">
                        {#each ts.leaderboard as p}
                          <button
                            type="button"
                            class="px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all {
                              ts.manualByes.includes(p.id)
                                ? 'bg-warning/15 border-warning/30 text-warning'
                                : 'bg-white/[0.02] border-white/5 text-muted-foreground hover:text-white'
                            }"
                            onclick={() => handleToggleBye(p.id)}
                          >
                            {p.name}
                            <span class="text-[9px] font-black ml-1 opacity-60">({p.byeCount || 0})</span>
                          </button>
                        {/each}
                      </div>
                    </div>
                  {/if}

                  <!-- Complete round button -->
                  <button
                    type="button"
                    class="w-full py-3.5 font-black uppercase tracking-wider text-xs rounded-2xl transition-all shadow-lg active:scale-98 border-0 cursor-pointer {
                      (() => {
                        const allFilled = round.matches.every(m => m.score1 != null && m.score2 != null);
                        return allFilled
                          ? 'bg-success hover:bg-success/90 text-white'
                          : 'bg-white/[0.03] hover:bg-white/[0.06] text-muted-foreground border border-white/5';
                      })()
                    }"
                    onclick={() => {
                      const allFilled = round.matches.every(m => m.score1 != null && m.score2 != null);
                      if (allFilled) {
                        handleCompleteRound(idx);
                      } else {
                        const partialFilled = round.matches.some(m => m.score1 != null && m.score2 != null);
                        const msg = partialFilled
                          ? "Some matches are missing scores. Continue anyway?"
                          : "No scores entered. Complete round as all 0-0?";
                        showConfirmModal("Complete Round?", msg, "Complete", () => handleCompleteRound(idx));
                      }
                    }}
                  >
                    {#if round.name === "Final"}
                      Finish Tournament
                    {:else if nextRoundPreview?.name === "Semifinal"}
                      Complete Round & Generate Semis
                    {:else if round.name === "Semifinal" || nextRoundPreview?.name === "Final"}
                      Complete Semifinal & Generate Final
                    {:else}
                      Complete Round {round.number}
                    {/if}
                  </button>
                </div>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Desktop Upcoming Rounds Sidebar -->
    {#if hasDesktopPreview}
      <aside class="hidden xl:block xl:sticky xl:top-24 space-y-4">
        <div class="rounded-[2rem] border border-white/10 bg-black/20 p-5 shadow-2xl backdrop-blur-xl font-display">
          <div class="mb-4">
            <h3 class="text-xs font-black uppercase tracking-[0.2em] text-accent">Kommande Matcher</h3>
            <p class="mt-1 text-xs text-muted-foreground">All remaining scheduled rounds.</p>
          </div>

          <div class="h-[62vh] overflow-hidden rounded-2xl border border-white/5 bg-black/25">
            <div class="h-full space-y-4 overflow-y-auto p-3 pr-2 custom-scrollbar">
              {#each upcomingRounds as round}
                <section class="rounded-xl border border-white/5 bg-white/[0.01] p-3.5 space-y-3">
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <div class="text-sm font-black text-white">{round.name || `Runda ${round.number}`}</div>
                      <div class="mt-0.5 text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                        Start: {formatEstimatedRoundStart(ts, round.number - 1)}
                      </div>
                    </div>
                    <span class="rounded-full border border-accent/15 bg-accent/5 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-accent">
                      {getEstimatedRoundStartRelativeLabel(ts, round.number - 1)}
                    </span>
                  </div>

                  <div class="space-y-2">
                    {#each round.matches as match}
                      {@const matchDivision = format === "division" ? (match.team1[0] as any)?.division || "A" : null}
                      <div class="rounded-xl border border-white/5 bg-black/25 px-3 py-2.5">
                        <div class="mb-1.5 flex items-center justify-between gap-2">
                          <span class="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                            {getCourtName(match.court, matchDivision)}
                          </span>
                          {#if matchDivision}
                            <span class="px-1.5 py-0.5 rounded border border-accent/20 bg-accent/5 text-[8px] font-black uppercase tracking-wider text-accent">
                              Div {matchDivision}
                            </span>
                          {/if}
                        </div>
                        <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-xs font-sans">
                          <div class="truncate font-bold text-white">
                            {match.team1.map((p) => p.name).join(" / ")}
                          </div>
                          <div class="text-[8px] font-black uppercase tracking-widest text-muted-foreground/35">vs</div>
                          <div class="truncate text-right font-bold text-white">
                            {match.team2.map((p) => p.name).join(" / ")}
                          </div>
                        </div>
                      </div>
                    {/each}
                  </div>
                </section>
              {/each}
            </div>
          </div>
        </div>
      </aside>
    {/if}
  </div>

  <!-- Visa hela spelschemat button for division format -->
  {#if format === "division" && allRounds && allRounds.length > 0}
    <div class="mt-8 text-center pb-8 font-display">
      <button
        type="button"
        onclick={() => (isFullScheduleOpen = true)}
        class="inline-flex items-center px-6 py-3 rounded-2xl bg-black/25 hover:bg-black/35 border border-white/5 text-muted-foreground hover:text-accent font-black text-xs uppercase tracking-wider transition-all shadow-lg border-0 cursor-pointer"
      >
        Visa hela spelschemat
      </button>
    </div>
  {/if}

  <FullScheduleModal
    isOpen={isFullScheduleOpen}
    onClose={() => (isFullScheduleOpen = false)}
  />
</div>

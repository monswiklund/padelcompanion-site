<script lang="ts">
  import Schedule from "./Schedule.svelte";
  import Leaderboard from "./Leaderboard.svelte";
  import PlayoffStandings from "./PlayoffStandings.svelte";
  import MatchTimer from "./MatchTimer.svelte";
  import Icons from "$lib/components/Icons.svelte";

  import { tournament } from "$lib/stores/tournament.svelte";
  import { showConfirmModal, showInputModal } from "$lib/tournament/core/modals";
  import { showToast } from "$lib/shared/utils";
  import { launchConfetti } from "$lib/tournament/confetti";
  import { saveToHistory } from "$lib/tournament/history/repository";
  import { CloudService } from "$lib/tournament/sync/cloud";
  import { saveTournamentCloudLink, getTournamentCloudLink } from "$lib/tournament/sync/sessionLink";
  import { buildTournamentShareUrl } from "$lib/tournament/navigation";
  import { createId } from "$lib/shared/utils";
  import { onMount } from "svelte";

  let ts = $derived(tournament.state);
  let canUndo = $derived(tournament.canUndo);
  let tournamentName = $derived(ts.tournamentName);
  let format = $derived(ts.format);
  let courts = $derived(ts.courts);
  let scoringMode = $derived(ts.scoringMode);

  let showSettings = $state(false);
  let isSyncing = $state(false);

  onMount(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  function handleReset() {
    showConfirmModal(
      "Reset Tournament",
      "This will clear all scores and rounds. Players will remain. Continue?",
      "Reset",
      () => {
        tournament.snapshot();
        tournament.updateField("schedule", []);
        tournament.updateField("currentRound", 0);
        tournament.updateField("leaderboard", []);
        tournament.updateField("allRounds", null);
        tournament.updateField("isLocked", false);
        tournament.updateField("hideLeaderboard", true);
        tournament.updateField("manualByes", []);
        tournament.save();
        showToast("Tournament reset");
      }
    );
  }

  function handleEnd() {
    showConfirmModal(
      "Finish Tournament",
      "Are you sure you want to finish the tournament? This will reveal the final standings and save it to history!",
      "Finish & Celebrate",
      () => {
        tournament.snapshot();
        tournament.updateField("hideLeaderboard", false);
        tournament.updateField("showPositionChanges", false);

        saveToHistory(ts as any);
        launchConfetti();

        const el = document.querySelector(".leaderboard-section");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });

        showToast("Tournament Finished & Saved!");
      }
    );
  }

  function handleUndo() {
    if (canUndo) {
      tournament.undo();
      showToast("Undo successful");
    }
  }

  function handleRename() {
    showInputModal(
      "Rename Tournament",
      "Enter new tournament name:",
      (newName) => {
        if (newName && newName.trim()) {
          tournament.updateField("tournamentName", newName.trim());
          showToast("Tournament renamed");
        }
      },
      tournamentName || "Unnamed Tournament"
    );
  }

  function handleAddLatePlayer() {
    const isTeamMode = format.startsWith("team");
    const entityName = isTeamMode ? "team" : "player";

    showInputModal(
      isTeamMode ? "Add Late Team" : "Add Late Player",
      `Enter new ${entityName} name:`,
      (name) => {
        if (!name || !name.trim()) return;

        const proceed = () => {
          tournament.addLatePlayer({ id: createId(), name: name.trim(), lockedCourt: null });
          showToast(`${name.trim()} added to tournament`);
        };

        if (format === "americano" || format === "team") {
          showConfirmModal(
            "Switch to Mexicano?",
            "Adding a player mid-tournament requires switching to Mexicano (Dynamic) pairings. Continue?",
            "Switch & Add",
            () => {
              tournament.updateField("format", "mexicano");
              tournament.updateField("allRounds", null);
              proceed();
            }
          );
        } else {
          proceed();
        }
      },
      `They will join with 0 points and start playing from the next round.`
    );
  }

  async function handleCloudSync() {
    if (!CloudService.isConfigured()) {
      showToast("Cloud sync API is not configured", "error");
      return;
    }

    if (!ts.players.length) {
      showToast("Add players before sharing a tournament", "warning");
      return;
    }

    isSyncing = true;
    try {
      const existingLink = getTournamentCloudLink(ts.tournamentName || "");
      const summary = existingLink
        ? await CloudService.updateSession(
            existingLink.sessionId,
            existingLink.editToken || "",
            ts as any
          )
        : await CloudService.createSession(ts as any);

      saveTournamentCloudLink(ts.tournamentName || "Untitled Tournament", summary as any);

      const shareUrl = buildTournamentShareUrl(summary.shareCode);
      try {
        await navigator.clipboard.writeText(shareUrl);
        showToast(`Cloud sync updated. Link copied for code: ${summary.shareCode}`, "success");
      } catch {
        showToast(`Cloud sync updated. Share link ready for code: ${summary.shareCode}`, "success");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to sync tournament";
      showToast(message, "error");
    } finally {
      isSyncing = false;
    }
  }

  const formatLabels: Record<string, string> = {
    americano: "Americano",
    mexicano: "Mexicano",
    team: "Team Americano",
    teamMexicano: "Team Mexicano",
    division: "Division",
  };

  const scoringLabels: Record<string, string> = {
    total: "Total Points",
    race: "Race to Points",
    time: "Time Based",
  };

  let formatLabel = $derived(formatLabels[format] || "Tournament");
  let scoringLabel = $derived(scoringLabels[scoringMode] || "Scoring");

  let isDivision = $derived(format === "division");
</script>

<div class="mx-auto px-4 py-6 pb-32 animate-fade-in {isDivision ? 'max-w-[1600px]' : 'max-w-7xl'} select-none font-sans">
  
  <!-- Active Header -->
  <header class="mb-12">
    <div class="text-center mb-6">
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div 
        class="group cursor-pointer inline-flex items-center justify-center gap-3 mb-4"
        onclick={handleRename}
      >
        <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight group-hover:text-accent transition-colors font-display">
          {tournamentName || "Live Tournament"}
        </h2>
        <span class="text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity">
          <Icons name="edit" size="14" />
        </span>
      </div>

      <div class="flex flex-wrap justify-center gap-2 font-display">
        <span class="px-3.5 py-1 bg-accent/15 text-accent text-[9px] font-black rounded-full border border-accent/20 uppercase tracking-widest">
          {formatLabel}
        </span>
        <span class="px-3.5 py-1 bg-white/[0.03] text-white/70 text-[9px] font-black rounded-full border border-white/5 uppercase tracking-widest">
          {courts} Courts
        </span>
        <span class="px-3.5 py-1 bg-white/[0.03] text-white/70 text-[9px] font-black rounded-full border border-white/5 uppercase tracking-widest">
          {scoringLabel}
        </span>
      </div>
    </div>
  </header>

  <!-- Schedule view -->
  <div class="mb-8">
    <Schedule />
  </div>

  <!-- Bottom Toolbar overlay -->
  <div class="mb-16 flex justify-center w-full relative z-10 font-sans">
    <div class="relative bg-[#1c1c1e]/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-3 w-full mx-auto max-w-5xl">
      <div class="flex items-center justify-between gap-2 overflow-x-auto hide-scrollbar-mobile">
        
        <!-- Undo and Add late entrant -->
        <div class="flex items-center gap-2 shrink-0">
          <button
            type="button"
            class="w-10 h-10 md:w-11 md:h-11 rounded-xl transition-all flex items-center justify-center border border-0 cursor-pointer {
              canUndo
                ? 'bg-white/[0.03] hover:bg-accent/15 text-white hover:text-accent border border-white/5 hover:border-accent/20 shadow-md'
                : 'opacity-30 cursor-not-allowed bg-white/[0.01] text-muted-foreground border-transparent'
            }"
            onclick={handleUndo}
            disabled={!canUndo}
            title="Undo last action"
          >
            <span class="text-base">↩</span>
          </button>

          <button
            type="button"
            class="h-10 md:h-11 px-3.5 bg-white/[0.03] hover:bg-accent/15 text-white hover:text-accent border border-white/5 hover:border-accent/20 rounded-xl font-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer border-0"
            onclick={handleAddLatePlayer}
          >
            <span class="text-base leading-none -mt-0.5">+</span>
            <span class="hidden sm:inline text-[9px] uppercase tracking-widest">
              {format.startsWith("team") || isDivision ? "Add Team" : "Add Player"}
            </span>
          </button>
        </div>

        <!-- Timer -->
        <div class="flex-shrink-0 flex items-center justify-center px-1.5">
          <MatchTimer />
        </div>

        <!-- Right action tools -->
        <div class="flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onclick={() => (showSettings = !showSettings)}
            class="w-10 h-10 md:w-11 md:h-11 rounded-xl transition-all flex items-center justify-center border border-0 cursor-pointer {
              showSettings 
                ? 'bg-accent text-white shadow-glow' 
                : 'bg-white/[0.03] hover:bg-white/[0.06] text-muted-foreground border border-white/5'
            }"
            title="View Settings"
          >
            <Icons name="settings" size="16" />
          </button>

          <div class="w-px h-6 bg-white/5 mx-0.5 hidden sm:block" />

          <!-- Share / Sync -->
          <button
            type="button"
            class="h-10 md:h-11 px-3.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-black shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 transition-all flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border-0"
            onclick={handleCloudSync}
            disabled={isSyncing}
            title="Save tournament to cloud and copy share code"
          >
            <Icons name="cloud" size="16" />
            <span class="hidden md:inline text-[9px] uppercase tracking-widest font-black">
              {isSyncing ? "Syncing" : "Share"}
            </span>
          </button>

          <!-- End / Finish -->
          {#if !isDivision && ts.schedule.some((r) => r.completed)}
            <button
              type="button"
              class="h-10 md:h-11 px-3.5 bg-success hover:bg-success/90 text-white rounded-xl font-black shadow-lg shadow-success/20 hover:shadow-success/40 transition-all flex items-center gap-1.5 cursor-pointer border-0"
              onclick={handleEnd}
            >
              <Icons name="trophy" size="14" />
              <span class="hidden lg:inline text-[9px] uppercase tracking-widest font-black">Finish</span>
            </button>
          {/if}

          <!-- Reset -->
          <button
            type="button"
            class="w-10 h-10 md:w-11 md:h-11 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 border border-white/5 bg-white/[0.03] rounded-xl transition-colors flex items-center justify-center cursor-pointer border-0"
            onclick={handleReset}
            title="Reset Tournament"
          >
            <Icons name="refresh" size="16" />
          </button>
        </div>
      </div>

      <!-- Settings Dropdown Drawer -->
      {#if showSettings}
        <div class="absolute right-4 sm:right-8 bottom-[calc(100%+8px)] w-56 bg-[#18181b]/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-5 animate-fade-in-up z-[60]">
          <h4 class="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-4 font-display">View Settings</h4>
          <div class="space-y-5">
            <div class="space-y-2">
              <div class="flex justify-between items-center mb-1">
                <span class="text-[9px] font-black text-white uppercase tracking-wider">Grid Layout</span>
              </div>
              <div class="flex gap-1 bg-black/20 p-0.5 rounded-lg border border-white/5">
                {#each [0, 1, 2, 3, 4] as num}
                  <button
                    type="button"
                    onclick={() => tournament.updateField("gridColumns", num)}
                    class="flex-1 h-7 rounded text-[9px] font-black transition-all border-0 cursor-pointer {
                      ts.gridColumns === num
                        ? 'bg-accent text-white'
                        : 'bg-transparent text-muted-foreground hover:text-white'
                    }"
                  >
                    {num === 0 ? "Auto" : num}
                  </button>
                {/each}
              </div>
            </div>
            
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-[9px] font-black text-white uppercase tracking-wider">Zoom Level</span>
                <span class="text-[9px] font-mono text-accent font-black">{ts.textSize}%</span>
              </div>
              <input
                type="range" min="50" max="350" step="10"
                class="w-full accent-accent cursor-pointer h-1 rounded-full appearance-none bg-white/10"
                value={ts.textSize}
                oninput={(e) => tournament.updateField("textSize", parseInt((e.target as HTMLInputElement).value))}
              />
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Playoff Standings -->
  <PlayoffStandings />

  <!-- Leaderboard -->
  <div class="mb-8 leaderboard-section">
    <Leaderboard />
  </div>
</div>

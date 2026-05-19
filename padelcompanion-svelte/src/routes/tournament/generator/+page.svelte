<script lang="ts">
  import TournamentNav from "$lib/components/tournament/TournamentNav.svelte";
  import TournamentIdentity from "$lib/components/tournament/TournamentIdentity.svelte";
  import HistorySection from "$lib/components/tournament/HistorySection.svelte";
  import TournamentConfig from "$lib/components/tournament/TournamentConfig.svelte";
  import PlayerList from "$lib/components/tournament/PlayerList.svelte";
  import PreferredPartners from "$lib/components/tournament/PreferredPartners.svelte";
  import TournamentActiveView from "$lib/components/tournament/TournamentActiveView.svelte";

  import { tournament } from "$lib/stores/tournament.svelte";
  import { generateSchedule } from "$lib/tournament/ui/setup/scheduleGeneration";
  import { createId } from "$lib/shared/utils";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";

  let state = $derived(tournament.state);
  let isLocked = $derived(state.isLocked);
  let playerCount = $derived(state.players.length);
  let isTeam = $derived(state.format === "team" || state.format === "teamMexicano");
  let minPlayers = $derived(isTeam ? 2 : 4);
  let isReadyToGenerate = $derived(playerCount >= minPlayers);

  function handleConfigChange(key: any, value: any) {
    tournament.updateField(key, value);
  }

  // PlayerList callbacks
  function handleAddPlayer(name: string) {
    tournament.addPlayer({ id: createId(), name, lockedCourt: null });
  }

  function handleRemovePlayer(index: number) {
    const player = state.players[index];
    if (player) tournament.removePlayer(player.id);
  }

  function handleClearPlayers() {
    tournament.clearPlayers();
  }

  function handleImportPlayers(text: string) {
    const names = text
      .split("\n")
      .map((n) => n.trim())
      .filter(Boolean);
    const existingNames = new Set(state.players.map((p) => p.name.toLowerCase()));
    names.forEach((name) => {
      if (!existingNames.has(name.toLowerCase())) {
        tournament.addPlayer({ id: createId(), name, lockedCourt: null });
        existingNames.add(name.toLowerCase());
      }
    });
  }

  function handleReorderPlayers(from: number, to: number) {
    const players = [...state.players];
    const [moved] = players.splice(from, 1);
    players.splice(to, 0, moved);
    tournament.updateField("players", players);
  }

  // PreferredPartners callbacks
  function handleAddPair(p1Id: string | number, p2Id: string | number) {
    const pairs = [...state.preferredPartners, {
      id: createId(),
      player1Id: String(p1Id),
      player2Id: String(p2Id),
    }];
    tournament.updateField("preferredPartners", pairs);
  }

  function handleRemovePair(pairId: string) {
    const pairs = state.preferredPartners.filter((p) => p.id !== pairId);
    tournament.updateField("preferredPartners", pairs);
  }

  async function handleGenerate() {
    await generateSchedule();
  }

  onMount(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  });
</script>

<div class="min-h-screen bg-background text-foreground pb-24 font-sans relative overflow-hidden">
  <div class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-background to-background"></div>

  <TournamentNav />

  <div class="container max-w-[1250px] mx-auto px-4 sm:px-6 relative z-10 pt-8 animate-fade-in">
    {#if isLocked}
      <div transition:fade={{ duration: 180 }}>
        <TournamentActiveView />
      </div>
    {:else}
      <div transition:fade={{ duration: 180 }} class="space-y-12">

        <!-- Editable title -->
        <TournamentIdentity
          format={state.format}
          initialName={state.tournamentName}
          initialNotes={state.tournamentNotes}
          onUpdate={(key, value) => {
            if (key === "name") tournament.updateField("tournamentName", value);
            else tournament.updateField("tournamentNotes", value);
          }}
        />

        <!-- Config + Players grid -->
        <div class="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 items-start">

          <!-- Config panel -->
          <div class="space-y-8">
            <div class="overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
              <TournamentConfig
                config={{
                  format: state.format,
                  courts: state.courts,
                  scoringMode: state.scoringMode,
                  pointsPerMatch: state.pointsPerMatch,
                  maxRepeats: state.maxRepeats,
                  pairingStrategy: state.pairingStrategy,
                  strictStrategy: state.strictStrategy,
                  allowCourtChange: state.allowCourtChange,
                  courtFormat: state.courtFormat,
                  customCourtNames: state.customCourtNames,
                  plannedStartTime: state.plannedStartTime ?? "17:00",
                  matchDuration: state.matchDuration ?? 15,
                }}
                {playerCount}
                onChange={handleConfigChange}
              />
            </div>

            <!-- Fixed pairs for Mexicano -->
            {#if state.format === "mexicano"}
              <div class="overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
                <PreferredPartners
                  pairs={state.preferredPartners}
                  players={state.players}
                  onAddPair={handleAddPair}
                  onRemovePair={handleRemovePair}
                />
              </div>
            {/if}
          </div>

          <!-- Players panel -->
          <div class="overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
            <PlayerList
              items={state.players}
              onAdd={handleAddPlayer}
              onRemove={handleRemovePlayer}
              onClear={handleClearPlayers}
              onImport={handleImportPlayers}
              onReorder={handleReorderPlayers}
              title={isTeam ? "Teams" : "Players"}
              singularTitle={isTeam ? "Team" : "Player"}
            />
          </div>
        </div>

        <!-- Generate button -->
        <div class="flex flex-col items-center justify-center pt-4 max-w-xl mx-auto text-center space-y-4">
          <button
            type="button"
            onclick={handleGenerate}
            disabled={!isReadyToGenerate}
            class="w-full py-4 font-black uppercase tracking-widest text-sm rounded-full transition-all border-0 shadow-lg select-none cursor-pointer {
              isReadyToGenerate
                ? 'bg-gradient-to-r from-accent via-accent to-accent/90 text-white shadow-accent/20'
                : 'bg-white/[0.03] text-muted-foreground border border-white/5 cursor-not-allowed'
            }"
          >
            🎾 Generera Spelschema
          </button>

          {#if !isReadyToGenerate}
            <p class="text-[10px] uppercase font-black tracking-widest text-warning/70">
              Need at least {minPlayers} {isTeam ? 'teams' : 'players'} (current: {playerCount})
            </p>
          {/if}
        </div>

        <!-- History -->
        <HistorySection />

      </div>
    {/if}
  </div>
</div>

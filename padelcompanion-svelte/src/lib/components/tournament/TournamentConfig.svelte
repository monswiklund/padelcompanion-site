<script lang="ts">
  import HelpButton from "./HelpButton.svelte";
  import {
    HELP_AMERICANO,
    HELP_MEXICANO,
    HELP_TEAM,
    HELP_TEAM_MEXICANO
  } from "$lib/tournament/content/help";

  export interface TournamentConfigState {
    format: "americano" | "mexicano" | "team" | "teamMexicano" | "division";
    courts: number;
    scoringMode: "total" | "race" | "time";
    pointsPerMatch: number;
    maxRepeats: number;
    pairingStrategy: "optimal" | "oneTwo" | "oneThree" | "oneFour";
    strictStrategy: boolean;
    allowCourtChange: boolean;
    courtFormat: "number" | "court" | "custom";
    customCourtNames: string[];
    plannedStartTime: string;
    matchDuration: number;
  }

  interface Props {
    config: TournamentConfigState;
    playerCount: number;
    onChange: (key: keyof TournamentConfigState, value: any) => void;
  }

  let { config, playerCount, onChange }: Props = $props();

  const CONFIG_OPTIONS = {
    format: [
      {
        value: "americano",
        label: "Americano",
        desc: "Fixed rounds",
        help: HELP_AMERICANO,
      },
      {
        value: "mexicano",
        label: "Mexicano",
        desc: "Dynamic pairs",
        help: HELP_MEXICANO,
      },
      { value: "team", label: "Team", desc: "Fixed teams", help: HELP_TEAM },
      {
        value: "teamMexicano",
        label: "Team Mex",
        desc: "Dynamic teams",
        help: HELP_TEAM_MEXICANO,
      },
    ],
    scoringMode: [
      { value: "total", label: "Total Points" },
      { value: "race", label: "Race to" },
      { value: "time", label: "Timed" },
    ],
    maxRepeats: [
      { value: 0, label: "No repeats" },
      { value: 1, label: "Max 1x" },
      { value: 2, label: "Max 2x" },
      { value: 3, label: "Max 3x" },
      { value: 99, label: "Unlimited" },
    ],
    pairingStrategy: [
      { value: "optimal", label: "Optimal" },
      { value: "oneThree", label: "1&3 vs 2&4" },
      { value: "oneTwo", label: "1&2 vs 3&4" },
      { value: "oneFour", label: "1&4 vs 2&3" },
    ],
    courtFormat: [
      { value: "number", label: "Numbered (1)" },
      { value: "court", label: "Court Label (Court 1)" },
      { value: "custom", label: "Custom Names" },
    ],
  };

  let isTeamMex = $derived(config.format === "teamMexicano");
  let baseFormat = $derived(
    isTeamMex ? "mexicano" : (config.format === "team" ? "americano" : config.format)
  );
  let isMexicano = $derived(
    config.format === "mexicano" || config.format === "teamMexicano"
  );
  let effectiveMaxCourts = $derived(Math.max(1, Math.floor(playerCount / 4)));

  function handleFormatChange(f: any) {
    onChange("format", f);
  }

  function toggleTeamMexicano() {
    onChange("format", config.format === "mexicano" ? "teamMexicano" : "mexicano");
  }

  function handleNumberChange(
    key: keyof TournamentConfigState,
    val: number,
    min: number,
    max: number
  ) {
    const clamped = Math.min(max, Math.max(min, val));
    onChange(key, clamped);
  }

  function getPointsLabel() {
    if (config.scoringMode === "time") return "Minutes";
    if (config.scoringMode === "race") return "Race to";
    return "Total Points";
  }
</script>

<div class="space-y-6 select-none font-sans">
  <!-- Format Selector -->
  <div>
    <div class="flex items-center gap-2 mb-3">
      <h4 class="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
        Format
      </h4>
      <HelpButton
        title={CONFIG_OPTIONS.format.find((o) => o.value === config.format)?.help.title || "Format"}
        content={CONFIG_OPTIONS.format.find((o) => o.value === config.format)?.help.content || ""}
      />
    </div>

    <div class="grid grid-cols-2 gap-2.5">
      {#each ["americano", "mexicano"] as f}
        {@const opt = CONFIG_OPTIONS.format.find((o) => o.value === f)!}
        {@const isActive = baseFormat === f}
        <button
          type="button"
          class="py-3 px-4 rounded-2xl text-left border transition-all duration-300 relative overflow-hidden group {
            isActive
              ? 'bg-accent border-accent text-white shadow-lg shadow-accent/15'
              : 'bg-black/20 border-white/5 text-muted-foreground hover:text-white hover:border-white/10'
          }"
          onclick={() => handleFormatChange(f)}
        >
          <div class="font-bold text-sm font-display tracking-tight">{opt.label}</div>
          <div class="text-[11px] mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity font-sans">{opt.desc}</div>
        </button>
      {/each}
    </div>
  </div>

  <!-- Game Settings -->
  <div>
    <div class="flex items-center gap-2 mb-3">
      <h4 class="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
        Game Settings
      </h4>
    </div>

    <div class="bg-black/20 border border-white/5 rounded-2xl p-4 space-y-4 shadow-xl">
      {#if baseFormat === "mexicano"}
        <div class="flex items-center justify-between py-1 border-b border-white/5 pb-3">
          <div>
            <span class="text-sm font-bold text-white">Team Mode</span>
            <div class="text-[11px] text-muted-foreground">Fixed teams</div>
          </div>
          <button
            type="button"
            onclick={toggleTeamMexicano}
            class="relative w-12 h-6.5 rounded-full transition-colors border {
              isTeamMex ? 'bg-accent border-accent' : 'bg-white/[0.04] border-white/10'
            }"
          >
            <span
              class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-300 {
                isTeamMex ? 'translate-x-5.5' : ''
              }"
            ></span>
          </button>
        </div>
      {/if}

      <!-- Courts -->
      <div class="flex items-center justify-between py-1 border-b border-white/5 pb-3">
        <div>
          <span class="text-sm font-bold text-white">Courts</span>
          <div class="text-[11px] text-muted-foreground">Simultaneous courts ({playerCount} players ready)</div>
        </div>
        <div class="flex items-center bg-black/30 rounded-xl border border-white/5 overflow-hidden">
          <button
            type="button"
            class="w-9 h-9 flex items-center justify-center text-lg font-bold text-accent hover:bg-accent/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            disabled={config.courts <= 1}
            onclick={() => handleNumberChange("courts", config.courts - 1, 1, effectiveMaxCourts)}
          >
            −
          </button>
          <div class="w-9 text-center font-bold text-white font-display text-sm">{config.courts}</div>
          <button
            type="button"
            class="w-9 h-9 flex items-center justify-center text-lg font-bold text-accent hover:bg-accent/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            disabled={config.courts >= effectiveMaxCourts}
            onclick={() => handleNumberChange("courts", config.courts + 1, 1, effectiveMaxCourts)}
          >
            +
          </button>
        </div>
      </div>

      <!-- Scoring Mode -->
      <div class="flex items-center justify-between py-1 border-b border-white/5 pb-3">
        <div>
          <span class="text-sm font-bold text-white">Scoring</span>
          <div class="text-[11px] text-muted-foreground">Win condition</div>
        </div>
        <select
          class="bg-black/30 text-xs px-3 py-2 rounded-xl border border-white/10 text-white focus:outline-none focus:border-accent font-sans font-bold"
          value={config.scoringMode}
          onchange={(e) => {
            const mode = (e.target as HTMLSelectElement).value as any;
            onChange("scoringMode", mode);
            const presets: Record<string, number> = {
              total: 24,
              race: 14,
              time: 11,
            };
            if (presets[mode]) {
              onChange("pointsPerMatch", presets[mode]);
            }
          }}
        >
          {#each CONFIG_OPTIONS.scoringMode as o}
            <option value={o.value}>{o.label}</option>
          {/each}
        </select>
      </div>

      <!-- Points stepper -->
      <div class="flex items-center justify-between py-1">
        <div>
          <span class="text-sm font-bold text-white">{getPointsLabel()}</span>
          <div class="text-[11px] text-muted-foreground">
            {config.scoringMode === "time" ? "Duration (min)" : "Target score"}
          </div>
        </div>
        <div class="flex items-center bg-black/30 rounded-xl border border-white/5 overflow-hidden">
          <button
            type="button"
            class="w-9 h-9 flex items-center justify-center text-lg font-bold text-accent hover:bg-accent/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            disabled={config.pointsPerMatch <= 4}
            onclick={() => handleNumberChange(
              "pointsPerMatch",
              config.pointsPerMatch - (config.scoringMode === "time" ? 1 : 2),
              4,
              50
            )}
          >
            −
          </button>
          <div class="w-9 text-center font-bold text-white font-display text-sm">{config.pointsPerMatch}</div>
          <button
            type="button"
            class="w-9 h-9 flex items-center justify-center text-lg font-bold text-accent hover:bg-accent/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            disabled={config.pointsPerMatch >= 50}
            onclick={() => handleNumberChange(
              "pointsPerMatch",
              config.pointsPerMatch + (config.scoringMode === "time" ? 1 : 2),
              4,
              50
            )}
          >
            +
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Mexicano Settings -->
  {#if isMexicano}
    <div>
      <div class="flex items-center gap-2 mb-3">
        <h4 class="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
          Advanced Matchup Logic
        </h4>
      </div>

      <div class="bg-black/20 border border-white/5 rounded-2xl p-4 space-y-4 shadow-xl">
        <!-- Partner Repeats -->
        <div class="flex items-center justify-between py-1 border-b border-white/5 pb-3">
          <div>
            <span class="text-sm font-bold text-white">Partner Repeats</span>
            <div class="text-[11px] text-muted-foreground">Max same pair plays</div>
          </div>
          <select
            class="bg-black/30 text-xs px-3 py-2 rounded-xl border border-white/10 text-white focus:outline-none focus:border-accent font-sans font-bold"
            value={config.maxRepeats}
            onchange={(e) => onChange("maxRepeats", parseInt((e.target as HTMLSelectElement).value))}
          >
            {#each CONFIG_OPTIONS.maxRepeats as o}
              <option value={o.value}>{o.label}</option>
            {/each}
          </select>
        </div>

        <!-- Pairing Style -->
        <div class="flex items-center justify-between py-1 border-b border-white/5 pb-3">
          <div>
            <span class="text-sm font-bold text-white">Pairing Style</span>
            <div class="text-[11px] text-muted-foreground">Matchup logic</div>
          </div>
          <select
            class="bg-black/30 text-xs px-3 py-2 rounded-xl border border-white/10 text-white focus:outline-none focus:border-accent font-sans font-bold"
            value={config.pairingStrategy}
            onchange={(e) => onChange("pairingStrategy", (e.target as HTMLSelectElement).value)}
          >
            {#each CONFIG_OPTIONS.pairingStrategy as o}
              <option value={o.value}>{o.label}</option>
            {/each}
          </select>
        </div>

        <!-- Strict Pattern -->
        <div class="flex items-center justify-between py-1">
          <div>
            <span class="text-sm font-bold text-white">Strict Pattern</span>
            <div class="text-[11px] text-muted-foreground">Force pattern pairings</div>
          </div>
          <button
            type="button"
            disabled={config.pairingStrategy === "optimal"}
            onclick={() => {
              if (config.pairingStrategy !== "optimal") {
                onChange("strictStrategy", !config.strictStrategy);
              }
            }}
            class="relative w-12 h-6.5 rounded-full transition-colors border {
              config.pairingStrategy === "optimal"
                ? 'opacity-30 cursor-not-allowed bg-black/10 border-white/5'
                : config.strictStrategy
                  ? 'bg-accent border-accent'
                  : 'bg-white/[0.04] border-white/10'
            }"
          >
            <span
              class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-300 {
                config.strictStrategy && config.pairingStrategy !== "optimal" ? 'translate-x-5.5' : ''
              }"
            ></span>
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Court Display Settings -->
  <div>
    <div class="flex items-center gap-2 mb-3">
      <h4 class="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
        Display
      </h4>
    </div>

    <div class="bg-black/20 border border-white/5 rounded-2xl p-4 space-y-4 shadow-xl">
      <div class="flex items-center justify-between py-1 {config.courtFormat === 'custom' ? 'border-b border-white/5 pb-3' : ''}">
        <div>
          <span class="text-sm font-bold text-white">Court Names</span>
          <div class="text-[11px] text-muted-foreground">Label format</div>
        </div>
        <select
          class="bg-black/30 text-xs px-3 py-2 rounded-xl border border-white/10 text-white focus:outline-none focus:border-accent font-sans font-bold"
          value={config.courtFormat}
          onchange={(e) => onChange("courtFormat", (e.target as HTMLSelectElement).value as any)}
        >
          {#each CONFIG_OPTIONS.courtFormat as o}
            <option value={o.value}>{o.label}</option>
          {/each}
        </select>
      </div>

      {#if config.courtFormat === "custom"}
        <div class="grid grid-cols-2 gap-2 mt-2">
          {#each Array.from({ length: config.courts }) as _, i}
            <input
              type="text"
              class="px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/5 text-white placeholder:text-muted-foreground/30 focus:outline-none focus:border-accent transition-colors text-sm font-sans"
              placeholder={`Court ${i + 1}...`}
              value={config.customCourtNames[i] || ""}
              oninput={(e) => {
                const newNames = [...config.customCourtNames];
                newNames[i] = (e.target as HTMLInputElement).value;
                onChange("customCourtNames", newNames);
              }}
            />
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <!-- Timing Settings -->
  <div>
    <div class="flex items-center gap-2 mb-3">
      <h4 class="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
        Timing
      </h4>
    </div>

    <div class="bg-black/20 border border-white/5 rounded-2xl p-4 space-y-4 shadow-xl">
      <!-- Start Time -->
      <div class="flex items-center justify-between py-1 border-b border-white/5 pb-3">
        <div>
          <span class="text-sm font-bold text-white">Start Time</span>
          <div class="text-[11px] text-muted-foreground">Expected first round</div>
        </div>
        <input
          type="time"
          class="bg-black/30 text-xs px-3 py-2 rounded-xl border border-white/10 text-white focus:outline-none focus:border-accent font-sans font-bold w-24 text-center cursor-pointer"
          value={config.plannedStartTime || "17:00"}
          onchange={(e) => onChange("plannedStartTime" as any, (e.target as HTMLInputElement).value)}
        />
      </div>

      <!-- Match Duration -->
      <div class="flex items-center justify-between py-1">
        <div>
          <span class="text-sm font-bold text-white">Match Duration</span>
          <div class="text-[11px] text-muted-foreground">Minutes per round</div>
        </div>
        <div class="flex items-center bg-black/30 rounded-xl border border-white/5 overflow-hidden">
          <button
            type="button"
            class="w-9 h-9 flex items-center justify-center text-lg font-bold text-accent hover:bg-accent/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            disabled={config.matchDuration <= 5}
            onclick={() => handleNumberChange("matchDuration" as any, config.matchDuration - 5, 5, 120)}
          >
            −
          </button>
          <div class="w-9 text-center font-bold text-white font-display text-sm">{config.matchDuration || 15}</div>
          <button
            type="button"
            class="w-9 h-9 flex items-center justify-center text-lg font-bold text-accent hover:bg-accent/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            disabled={config.matchDuration >= 120}
            onclick={() => handleNumberChange("matchDuration" as any, config.matchDuration + 5, 5, 120)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

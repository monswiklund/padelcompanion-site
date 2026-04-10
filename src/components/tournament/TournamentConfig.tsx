import React from "react";
import { HelpButton } from "@/components/ui/HelpNotice";
import {
  HELP_AMERICANO,
  HELP_MEXICANO,
  HELP_TEAM,
  HELP_TEAM_MEXICANO,
  HELP_SCORING,
  HELP_COURTS,
} from "@/tournament/content/help";
import {
  ConfigSection,
  ConfigRow,
  ConfigStepper,
  ConfigToggle,
  ConfigSelect,
} from "@/components/ui/ConfigElements";

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
  tiebreaker?: "difference" | "most_won" | "shared";
  divisionCourts?: number;
  plannedStartTime: string;
  matchDuration: number;
}

interface TournamentConfigProps {
  config: TournamentConfigState;
  playerCount: number;
  onChange: (key: keyof TournamentConfigState, value: any) => void;
}

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

export const TournamentConfig: React.FC<TournamentConfigProps> = ({

  config,

  playerCount,

  onChange,

}) => {

  const isTeamMex = config.format === "teamMexicano";

  // If current format is teamMexicano, base is mexicano. Otherwise respect current format.

  // Note: 'team' format is effectively deprecated in UI but handled as 'americano' base if present.

  const baseFormat = isTeamMex ? "mexicano" : (config.format === "team" ? "americano" : config.format);



  const isMexicano =

    config.format === "mexicano" || config.format === "teamMexicano";

  const effectiveMaxCourts = Math.max(1, Math.floor(playerCount / 4));



  const handleFormatChange = (f: string) => {

    // When switching format, reset to individual version

    onChange("format", f);

  };



  const toggleTeamMexicano = () => {

    onChange("format", config.format === "mexicano" ? "teamMexicano" : "mexicano");

  };



  const handleNumberChange = (

    key: keyof TournamentConfigState,

    val: number,

    min: number,

    max: number,

  ) => {

    const clamped = Math.min(max, Math.max(min, val));

    onChange(key, clamped);

  };



  const getPointsLabel = () => {

    if (config.scoringMode === "time") return "Minutes";

    if (config.scoringMode === "race") return "Race to";

    return "Total Points";

  };



  return (

    <div className="space-y-6">
      {/* Format Selector */}
      <ConfigSection
        title="Format"
        help={
          CONFIG_OPTIONS.format.find((o) => o.value === config.format)?.help
        }
      >
        <div className="grid grid-cols-2 gap-2">
          {["americano", "mexicano"].map((f) => {
            const opt = CONFIG_OPTIONS.format.find((o) => o.value === f)!;
            const isActive = baseFormat === f;
            return (
              <button
                key={f}
                type="button"
                className={`py-3 px-3 rounded-xl text-left transition-all ${
                  isActive
                    ? "bg-accent text-white ring-2 ring-accent/30"
                    : "bg-popover border border-border text-muted-foreground hover:text-foreground hover:border-accent/50"
                }`}
                onClick={() => handleFormatChange(f)}
              >
                <div className="font-semibold text-sm">{opt.label}</div>
                <div
                  className={`text-xs ${
                    isActive ? "text-white/70" : "text-muted-foreground"
                  }`}
                >
                  {opt.desc}
                </div>
              </button>
            );
          })}
        </div>
      </ConfigSection>



      {/* Game Settings */}
      <ConfigSection title="Game Settings">
        <div className="divide-y divide-border">
          {baseFormat === "mexicano" && (
            <ConfigRow label="Team Mode" hint="Fixed teams">
              <ConfigToggle enabled={isTeamMex} onChange={toggleTeamMexicano} />
            </ConfigRow>
          )}



          <ConfigRow label="Courts" hint="Simultaneous courts">
            <ConfigStepper
              value={config.courts}
              min={1}
              max={effectiveMaxCourts}
              onChange={(v) =>
                handleNumberChange("courts", v, 1, effectiveMaxCourts)
              }
              disabledMax={config.courts >= effectiveMaxCourts}
            />
          </ConfigRow>



          
          <ConfigRow label="Scoring" hint="Win condition">
            <ConfigSelect
              value={config.scoringMode}
              onChange={(e) => {
                const mode = e.target.value;
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
              {CONFIG_OPTIONS.scoringMode.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </ConfigSelect>
          </ConfigRow>

          <ConfigRow
            label={getPointsLabel()}
            hint={
              config.scoringMode === "time" ? "Duration (min)" : "Target score"
            }
          >
            <ConfigStepper
              value={config.pointsPerMatch}
              min={4}
              max={50}
              step={config.scoringMode === "time" ? 1 : 2}
              onChange={(v) => handleNumberChange("pointsPerMatch", v, 4, 50)}
            />
          </ConfigRow>
        </div>
      </ConfigSection>

      {/* Mexicano Settings */}
      {isMexicano && (
        <ConfigSection title="Advanced">
          <div className="divide-y divide-border">
            <ConfigRow label="Partner Repeats" hint="Max same pair plays">
              <ConfigSelect
                value={config.maxRepeats}
                onChange={(e) =>
                  onChange("maxRepeats", parseInt(e.target.value))
                }
              >
                {CONFIG_OPTIONS.maxRepeats.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </ConfigSelect>
            </ConfigRow>

            <ConfigRow label="Pairing Style" hint="Matchup logic">
              <ConfigSelect
                value={config.pairingStrategy}
                onChange={(e) => onChange("pairingStrategy", e.target.value)}
              >
                {CONFIG_OPTIONS.pairingStrategy.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </ConfigSelect>
            </ConfigRow>

            <ConfigRow label="Strict Pattern" hint="Force pattern">
              <ConfigToggle
                enabled={config.strictStrategy}
                disabled={config.pairingStrategy === "optimal"}
                onChange={() => {
                  if (config.pairingStrategy !== "optimal") {
                    onChange("strictStrategy", !config.strictStrategy);
                  }
                }}
              />
            </ConfigRow>
          </div>
        </ConfigSection>
      )}

      {/* Court Settings */}
      <ConfigSection title="Display">
        <div className="divide-y divide-border">
          <ConfigRow label="Court Names" hint="Label format">
            <ConfigSelect
              value={config.courtFormat}
              onChange={(e) => onChange("courtFormat", e.target.value)}
            >
              {CONFIG_OPTIONS.courtFormat.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </ConfigSelect>
          </ConfigRow>
        </div>

        {config.courtFormat === "custom" && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            {Array.from({ length: config.courts }).map((_, i) => (
              <input
                key={i}
                type="text"
                className="px-3 py-2 rounded-lg bg-popover border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors text-sm"
                placeholder={`Court ${i + 1}...`}
                value={config.customCourtNames[i] || ""}
                onChange={(e) => {
                  const newNames = [...config.customCourtNames];
                  newNames[i] = e.target.value;
                  onChange("customCourtNames", newNames);
                }}
              />
            ))}
          </div>
        )}
      </ConfigSection>

      {/* Timing Settings */}
      <ConfigSection title="Timing">
        <div className="divide-y divide-border">
          <ConfigRow label="Start Time" hint="Expected first round">
            <input
              type="time"
              className="px-3 py-2 rounded-lg bg-popover border border-border text-foreground focus:outline-none focus:border-accent transition-colors text-sm w-full"
              value={config.plannedStartTime || "17:00"}
              onChange={(e) => onChange("plannedStartTime" as any, e.target.value)}
            />
          </ConfigRow>

          <ConfigRow label="Match Duration" hint="Minutes per round">
            <ConfigStepper
              value={config.matchDuration || 15}
              min={5}
              max={120}
              step={5}
              onChange={(v) => onChange("matchDuration" as any, v)}
            />
          </ConfigRow>
        </div>
      </ConfigSection>
    </div>
  );
};

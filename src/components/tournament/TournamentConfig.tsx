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

export interface TournamentConfigState {
  format: "americano" | "mexicano" | "team" | "teamMexicano";
  courts: number;
  scoringMode: "total" | "race" | "time";
  pointsPerMatch: number;
  maxRepeats: number;
  pairingStrategy: "optimal" | "oneThree" | "oneTwo" | "oneFour";
  strictStrategy: boolean;
  courtFormat: "number" | "court" | "custom";
  customCourtNames: string[];
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
  const isMexicano =
    config.format === "mexicano" || config.format === "teamMexicano";
  const effectiveMaxCourts = Math.max(1, Math.floor(playerCount / 4));

  const handleNumberChange = (
    key: keyof TournamentConfigState,
    val: number,
    min: number,
    max: number
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
      <Section
        title="Format"
        help={
          CONFIG_OPTIONS.format.find((o) => o.value === config.format)?.help
        }
      >
        <div className="grid grid-cols-2 gap-2">
          {CONFIG_OPTIONS.format.map((o) => (
            <button
              key={o.value}
              type="button"
              className={`py-3 px-3 rounded-xl text-left transition-all ${
                config.format === o.value
                  ? "bg-accent text-white ring-2 ring-accent/30"
                  : "bg-elevated border border-theme text-secondary hover:text-primary hover:border-accent/50"
              }`}
              onClick={() => onChange("format", o.value)}
            >
              <div className="font-semibold text-sm">{o.label}</div>
              <div
                className={`text-xs ${
                  config.format === o.value ? "text-white/70" : "text-muted"
                }`}
              >
                {o.desc}
              </div>
            </button>
          ))}
        </div>
      </Section>

      {/* Game Settings */}
      <Section title="Game Settings">
        <div className="divide-y divide-white/[0.06]">
          <ConfigRow label="Courts" hint="Simultaneous courts">
            <Stepper
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
            <select
              className="w-full px-3 py-2.5 rounded-lg bg-elevated border border-theme text-primary focus:outline-none focus:border-accent transition-colors text-sm"
              value={config.scoringMode}
              onChange={(e) => {
                const mode = e.target.value;
                onChange("scoringMode", mode);
                // Set preset points based on mode
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
            </select>
          </ConfigRow>

          <ConfigRow
            label={getPointsLabel()}
            hint={
              config.scoringMode === "time" ? "Duration (min)" : "Target score"
            }
          >
            <Stepper
              value={config.pointsPerMatch}
              min={4}
              max={50}
              step={config.scoringMode === "time" ? 1 : 2}
              onChange={(v) => handleNumberChange("pointsPerMatch", v, 4, 50)}
            />
          </ConfigRow>
        </div>
      </Section>

      {/* Mexicano Settings */}
      {isMexicano && (
        <Section title="Advanced">
          <div className="divide-y divide-white/[0.06]">
            <ConfigRow label="Partner Repeats" hint="Max same pair plays">
              <select
                className="w-full px-3 py-2.5 rounded-lg bg-elevated border border-theme text-primary focus:outline-none focus:border-accent transition-colors text-sm"
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
              </select>
            </ConfigRow>

            <ConfigRow label="Pairing Style" hint="Matchup logic">
              <select
                className="w-full px-3 py-2.5 rounded-lg bg-elevated border border-theme text-primary focus:outline-none focus:border-accent transition-colors text-sm"
                value={config.pairingStrategy}
                onChange={(e) => onChange("pairingStrategy", e.target.value)}
              >
                {CONFIG_OPTIONS.pairingStrategy.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </ConfigRow>

            <ConfigRow label="Strict Pattern" hint="Force pattern">
              <Toggle
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
        </Section>
      )}

      {/* Court Settings */}
      <Section title="Display">
        <div className="divide-y divide-white/[0.06]">
          <ConfigRow label="Court Names" hint="Label format">
            <select
              className="px-3 py-2 rounded-lg bg-elevated border border-theme text-primary focus:outline-none focus:border-accent transition-colors text-sm"
              value={config.courtFormat}
              onChange={(e) => onChange("courtFormat", e.target.value)}
            >
              {CONFIG_OPTIONS.courtFormat.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </ConfigRow>
        </div>

        {config.courtFormat === "custom" && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            {Array.from({ length: config.courts }).map((_, i) => (
              <input
                key={i}
                type="text"
                className="px-3 py-2 rounded-lg bg-elevated border border-theme text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors text-sm"
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
      </Section>
    </div>
  );
};

// Section Component
const Section: React.FC<{
  title: string;
  help?: { title: string; content: string };
  children: React.ReactNode;
}> = ({ title, help, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <h4 className="text-xs font-semibold text-muted uppercase tracking-wide">
        {title}
      </h4>
      {help && <HelpButton title={help.title} content={help.content} />}
    </div>
    {children}
  </div>
);

// Config Row Component - inline layout
const ConfigRow: React.FC<{
  label: string;
  hint?: string;
  children: React.ReactNode;
}> = ({ label, hint, children }) => (
  <div className="flex items-center justify-between gap-3 py-2">
    <div className="flex-1 min-w-0">
      <span className="text-sm font-medium text-primary">{label}</span>
      {hint && <span className="text-xs text-muted ml-1.5">({hint})</span>}
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);

// Stepper Component
const Stepper: React.FC<{
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  disabledMax?: boolean;
}> = ({ value, min, max, step = 1, onChange, disabledMax }) => (
  <div className="flex items-center bg-elevated rounded-xl border border-theme overflow-hidden">
    <button
      type="button"
      className="w-10 h-10 flex items-center justify-center text-lg font-bold text-accent hover:bg-accent/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      disabled={value <= min}
      onClick={() => onChange(value - step)}
    >
      −
    </button>
    <div className="w-10 text-center font-bold text-primary">{value}</div>
    <button
      type="button"
      className="w-10 h-10 flex items-center justify-center text-lg font-bold text-accent hover:bg-accent/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      disabled={disabledMax || value >= max}
      onClick={() => onChange(value + step)}
    >
      +
    </button>
  </div>
);

// Toggle Component
const Toggle: React.FC<{
  enabled: boolean;
  disabled?: boolean;
  onChange: () => void;
}> = ({ enabled, disabled, onChange }) => (
  <button
    type="button"
    onClick={disabled ? undefined : onChange}
    disabled={disabled}
    className={`relative w-12 h-7 rounded-full transition-colors ${
      disabled
        ? "opacity-40 cursor-not-allowed bg-white/10"
        : enabled
        ? "bg-accent"
        : "bg-white/20 hover:bg-white/30"
    }`}
  >
    <span
      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
        enabled ? "translate-x-5" : ""
      }`}
    />
  </button>
);

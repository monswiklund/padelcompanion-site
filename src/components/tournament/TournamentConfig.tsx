import React from "react";
import { Card } from "@/components/ui/Card";

export interface TournamentConfigState {
  format: "americano" | "mexicano" | "team" | "teamMexicano";
  courts: number;
  scoringMode: "total" | "race" | "time";
  pointsPerMatch: number;
  maxRepeats: number;
  pairingStrategy: "optimal" | "oneThree" | "oneTwo" | "oneFour";
  strictStrategy: boolean;
}

interface TournamentConfigProps {
  config: TournamentConfigState;
  playerCount: number;
  onChange: (key: keyof TournamentConfigState, value: any) => void;
}

const CONFIG_OPTIONS = {
  format: [
    { value: "americano", label: "Americano" },
    { value: "mexicano", label: "Mexicano" },
    { value: "team", label: "Team Americano" },
    { value: "teamMexicano", label: "Team Mexicano" },
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
};

export const TournamentConfig: React.FC<TournamentConfigProps> = ({
  config,
  playerCount,
  onChange,
}) => {
  const isMexicano =
    config.format === "mexicano" || config.format === "teamMexicano";
  const effectiveMaxCourts = Math.max(1, Math.floor(playerCount / 4));

  // Handlers
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
    <Card className="tournament-config p-4">
      <div className="grid gap-4">
        {/* Format */}
        <ConfigRow label="Format">
          <select
            className="w-full bg-black/20 text-white rounded p-2 border border-white/10 outline-none focus:border-blue-500"
            value={config.format}
            onChange={(e) => onChange("format", e.target.value)}
          >
            {CONFIG_OPTIONS.format.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </ConfigRow>

        {isMexicano && (
          <>
            <div className="h-px bg-white/5 my-2"></div>

            {/* Scoring */}
            <ConfigRow label="Scoring">
              <select
                className="w-full bg-black/20 text-white rounded p-2 border border-white/10 outline-none focus:border-blue-500"
                value={config.scoringMode}
                onChange={(e) => onChange("scoringMode", e.target.value)}
              >
                {CONFIG_OPTIONS.scoringMode.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </ConfigRow>

            {/* Points */}
            <ConfigRow label={getPointsLabel()}>
              <Stepper
                value={config.pointsPerMatch}
                min={4}
                max={50}
                step={config.scoringMode === "time" ? 1 : 2}
                onChange={(v) => handleNumberChange("pointsPerMatch", v, 4, 50)}
              />
            </ConfigRow>

            {/* Repeats */}
            <ConfigRow label="Repeats">
              <select
                className="w-full bg-black/20 text-white rounded p-2 border border-white/10 outline-none focus:border-blue-500"
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

            {/* Courts */}
            <ConfigRow label="Courts">
              <Stepper
                value={config.courts}
                min={1}
                max={effectiveMaxCourts}
                onChange={(v) =>
                  handleNumberChange("courts", v, 1, effectiveMaxCourts)
                }
                disabledMax={config.courts >= effectiveMaxCourts}
                maxTooltip={
                  config.courts >= effectiveMaxCourts
                    ? `Max courts for ${playerCount} players`
                    : undefined
                }
              />
            </ConfigRow>

            {/* Pairing */}
            <ConfigRow label="Pairing">
              <select
                className="w-full bg-black/20 text-white rounded p-2 border border-white/10 outline-none focus:border-blue-500"
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

            {/* Strict */}
            <ConfigRow label="Prioritize Pattern">
              <label className="flex items-center cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={config.strictStrategy}
                    disabled={config.pairingStrategy === "optimal"}
                    onChange={(e) =>
                      onChange("strictStrategy", e.target.checked)
                    }
                  />
                  <div
                    className={`block w-10 h-6 rounded-full transition-colors ${
                      config.strictStrategy ? "bg-blue-600" : "bg-white/20"
                    }`}
                  ></div>
                  <div
                    className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
                      config.strictStrategy ? "transform translate-x-4" : ""
                    }`}
                  ></div>
                </div>
              </label>
            </ConfigRow>
          </>
        )}

        {!isMexicano && (
          <>
            {/* Courts */}
            <ConfigRow label="Courts">
              <Stepper
                value={config.courts}
                min={1}
                max={effectiveMaxCourts}
                onChange={(v) =>
                  handleNumberChange("courts", v, 1, effectiveMaxCourts)
                }
                disabledMax={config.courts >= effectiveMaxCourts}
                maxTooltip={
                  config.courts >= effectiveMaxCourts
                    ? `Max courts for ${playerCount} players`
                    : undefined
                }
              />
            </ConfigRow>

            {/* Scoring */}
            <ConfigRow label="Scoring">
              <select
                className="w-full bg-black/20 text-white rounded p-2 border border-white/10 outline-none focus:border-blue-500"
                value={config.scoringMode}
                onChange={(e) => onChange("scoringMode", e.target.value)}
              >
                {CONFIG_OPTIONS.scoringMode.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </ConfigRow>

            {/* Points */}
            <ConfigRow label={getPointsLabel()}>
              <Stepper
                value={config.pointsPerMatch}
                min={4}
                max={50}
                step={config.scoringMode === "time" ? 1 : 2}
                onChange={(v) => handleNumberChange("pointsPerMatch", v, 4, 50)}
              />
            </ConfigRow>
          </>
        )}
      </div>
    </Card>
  );
};

const ConfigRow: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="flex justify-between items-center gap-4 min-h-[40px]">
    <label className="text-sm font-medium text-text-secondary w-1/3">
      {label}:
    </label>
    <div className="flex-1 text-right">{children}</div>
  </div>
);

const Stepper: React.FC<{
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  disabledMax?: boolean;
  maxTooltip?: string;
}> = ({ value, min, max, step = 1, onChange, disabledMax, maxTooltip }) => (
  <div className="flex bg-black/20 rounded border border-white/10 overflow-hidden w-fit ml-auto">
    <button
      className="px-3 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-lg leading-none"
      disabled={value <= min}
      onClick={() => onChange(value - step)}
    >
      −
    </button>
    <div className="w-12 text-center flex items-center justify-center font-mono border-x border-white/10">
      {value}
    </div>
    <button
      className="px-3 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-lg leading-none"
      disabled={disabledMax || value >= max}
      title={maxTooltip}
      onClick={() => onChange(value + step)}
    >
      +
    </button>
  </div>
);

import React from "react";

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
    { value: "americano", label: "Americano" },
    { value: "mexicano", label: "Mexicano" },
    { value: "team", label: "Team" },
    { value: "teamMexicano", label: "Team Mex" },
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
    <div className="config-grid">
      {/* Quick Change Format Selector */}
      <div
        className="config-full-width"
        style={{ marginBottom: "var(--space-sm)" }}
      >
        <label
          className="config-label"
          style={{ width: "100%", marginBottom: "8px", display: "block" }}
        >
          Tournament Format:
        </label>
        <div className="format-grid">
          {CONFIG_OPTIONS.format.map((o) => (
            <div
              key={o.value}
              className={`segmented-option ${
                config.format === o.value ? "selected" : ""
              }`}
              onClick={() => onChange("format", o.value)}
            >
              {o.label}
            </div>
          ))}
        </div>
      </div>

      <div
        className="config-spacer config-full-width"
        style={{
          borderBottom: "1px solid var(--border-color)",
          margin: "var(--space-sm) 0",
        }}
      ></div>

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
          className="form-select w-full"
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "var(--radius-md)",
            background: "var(--input-bg)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-color)",
          }}
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

      {isMexicano && (
        <>
          {/* Repeats */}
          <ConfigRow label="Repeats">
            <select
              className="form-select w-full"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "var(--radius-md)",
                background: "var(--input-bg)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
              }}
              value={config.maxRepeats}
              onChange={(e) => onChange("maxRepeats", parseInt(e.target.value))}
            >
              {CONFIG_OPTIONS.maxRepeats.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </ConfigRow>

          {/* Pairing */}
          <ConfigRow label="Pairing">
            <select
              className="form-select w-full"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "var(--radius-md)",
                background: "var(--input-bg)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
              }}
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
            <div
              className={`ui-toggle ${config.strictStrategy ? "active" : ""} ${
                config.pairingStrategy === "optimal" ? "disabled" : ""
              }`}
              onClick={() => {
                if (config.pairingStrategy !== "optimal") {
                  onChange("strictStrategy", !config.strictStrategy);
                }
              }}
            >
              <div className="toggle-track">
                <div className="toggle-thumb"></div>
              </div>
            </div>
          </ConfigRow>
        </>
      )}

      <div
        className="config-spacer config-full-width"
        style={{
          borderBottom: "1px solid var(--border-color)",
          margin: "var(--space-sm) 0",
        }}
      ></div>

      {/* Court Naming */}
      <ConfigRow label="Court Naming">
        <select
          className="form-select w-full"
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "var(--radius-md)",
            background: "var(--input-bg)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-color)",
          }}
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

      {config.courtFormat === "custom" && (
        <div className="config-full-width">
          <div className="custom-court-grid">
            {Array.from({ length: config.courts }).map((_, i) => (
              <input
                key={i}
                type="text"
                className="custom-court-input"
                placeholder={`Court ${i + 1} name...`}
                value={config.customCourtNames[i] || ""}
                onChange={(e) => {
                  const newNames = [...config.customCourtNames];
                  newNames[i] = e.target.value;
                  onChange("customCourtNames", newNames);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ConfigRow: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="config-row">
    <label className="config-label">{label}:</label>
    <div className="config-input-wrapper">{children}</div>
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
  <div className="ui-stepper">
    <button
      className="stepper-btn"
      disabled={value <= min}
      onClick={() => onChange(value - step)}
    >
      −
    </button>
    <div className="stepper-input">{value}</div>
    <button
      className="stepper-btn"
      disabled={disabledMax || value >= max}
      title={maxTooltip}
      onClick={() => onChange(value + step)}
    >
      +
    </button>
  </div>
);

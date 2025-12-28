import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useTournament } from "@/context/TournamentContext";
import { showToast } from "@/shared/utils";
import {
  generateSingleBracket,
  generateDualBracket,
  applyAssignment,
  BracketTeam,
  BracketConfig,
} from "@/tournament/bracket/bracketCore";

// ============ TYPES ============

interface SetupTeam {
  id: string;
  name: string;
  side?: "A" | "B";
}

type AssignStrategy = "random" | "alternate" | "half" | "manual";

// ============ COMPONENT ============

export const BracketSetup: React.FC = () => {
  const { dispatch } = useTournament();
  const navigate = useNavigate();

  // Local state for setup
  const [teams, setTeams] = useState<SetupTeam[]>([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [mode, setMode] = useState<"teams" | "players">("teams");
  const [scoreType, setScoreType] = useState<"points" | "games" | "sets">(
    "points"
  );
  const [isDualMode, setIsDualMode] = useState(false);
  const [sharedFinal, setSharedFinal] = useState(true);
  const [assignStrategy, setAssignStrategy] =
    useState<AssignStrategy>("alternate");

  // ============ TEAM MANAGEMENT ============

  const addTeam = useCallback(() => {
    const name = newTeamName.trim();
    if (!name) return;

    const newTeam: SetupTeam = {
      id: `team-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name,
      side: undefined,
    };

    setTeams((prev) => [...prev, newTeam]);
    setNewTeamName("");
  }, [newTeamName]);

  const removeTeam = useCallback((id: string) => {
    setTeams((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearTeams = useCallback(() => {
    setTeams([]);
  }, []);

  const toggleTeamSide = useCallback((id: string) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, side: t.side === "A" ? "B" : "A" } : t
      )
    );
    setAssignStrategy("manual");
  }, []);

  // ============ BRACKET GENERATION ============

  const handleCreateBracket = useCallback(() => {
    if (teams.length < 2) {
      showToast("Add at least 2 teams", "error");
      return;
    }

    try {
      const config: BracketConfig = { scoreType, mode };

      // Apply assignment strategy if in dual mode
      let finalTeams: BracketTeam[] = teams.map((t) => ({
        id: t.id,
        name: t.name,
        side: t.side,
      }));

      if (isDualMode) {
        // Apply the assignment strategy
        finalTeams = applyAssignment(finalTeams, assignStrategy);

        // Generate dual bracket
        const bracket = generateDualBracket(finalTeams, sharedFinal);
        dispatch({ type: "SET_BRACKET", bracket, config });
      } else {
        // Generate single bracket
        const bracket = generateSingleBracket(finalTeams);
        dispatch({ type: "SET_BRACKET", bracket, config });
      }

      showToast("Bracket created!", "success");
      navigate("/tournament/bracket");
    } catch (error: any) {
      console.error(error);
      showToast(`Error: ${error.message}`, "error");
    }
  }, [
    teams,
    isDualMode,
    assignStrategy,
    sharedFinal,
    scoreType,
    mode,
    dispatch,
    navigate,
  ]);

  // ============ HELPERS ============

  const getTeamHint = () => {
    const count = teams.length;
    if (count < 2) {
      return `Add at least ${2 - count} more team${2 - count > 1 ? "s" : ""}`;
    }
    const isPowerOf2 = (count & (count - 1)) === 0 && count >= 4;
    if (isPowerOf2) {
      return (
        <span style={{ color: "var(--success)" }}>
          ✓ {count} teams ready (perfect bracket)
        </span>
      );
    }
    const nextPow2 = Math.pow(2, Math.ceil(Math.log2(count)));
    const byes = nextPow2 - count;
    return (
      <span style={{ color: "var(--warning)" }}>
        ⚠ {count} teams will have {byes} bye{byes > 1 ? "s" : ""}
      </span>
    );
  };

  const getPoolStyle = (side?: "A" | "B") => {
    if (!side) {
      return {
        background: "rgba(255,255,255,0.1)",
        color: "var(--text-muted)",
        border: "1px solid var(--border-color)",
      };
    }
    if (side === "A") {
      return {
        background: "rgba(59, 130, 246, 0.2)",
        color: "var(--accent)",
        border: "1px solid var(--accent)",
      };
    }
    return {
      background: "rgba(245, 158, 11, 0.2)",
      color: "var(--warning)",
      border: "1px solid var(--warning)",
    };
  };

  // ============ RENDER ============

  return (
    <div className="tournament-setup-view container animate-fade-in py-8">
      <div className="page-intro-header">
        <h2>Create a Bracket</h2>
        <p>Set up a single elimination tournament bracket.</p>
      </div>

      <div
        className="bracket-setup-content"
        style={{
          display: "flex",
          gap: "32px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/* Teams List */}
        <Card className="flex-1 min-w-[300px] max-w-[400px] p-6">
          <h3 className="text-lg font-bold mb-4">
            {mode === "teams" ? "Teams" : "Players"} ({teams.length})
          </h3>

          {/* Add Team Input */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTeam()}
              placeholder={`Add ${mode === "teams" ? "team" : "player"} name`}
              className="player-list__input"
              style={{ flex: 1 }}
            />
            <Button onClick={addTeam} size="sm">
              Add
            </Button>
          </div>

          {/* Team List */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            {teams.map((team, index) => (
              <div
                key={team.id}
                className="player-card"
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                {isDualMode && (
                  <button
                    onClick={() => toggleTeamSide(team.id)}
                    style={{
                      ...getPoolStyle(team.side),
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {team.side ? `Pool ${team.side}` : "Assign"}
                  </button>
                )}
                <span className="player-card__number">{index + 1}.</span>
                <span className="player-card__name">{team.name}</span>
                <button
                  className="player-card__remove"
                  onClick={() => removeTeam(team.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Team Hint */}
          {teams.length > 0 && (
            <div className="player-list__hint" style={{ marginTop: "16px" }}>
              {getTeamHint()}
            </div>
          )}

          {/* Clear Button */}
          {teams.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={clearTeams}
              className="mt-4"
            >
              Clear All
            </Button>
          )}
        </Card>

        {/* Settings */}
        <Card className="flex-1 min-w-[300px] max-w-[400px] p-6">
          <h3 className="text-lg font-bold mb-4">Settings</h3>

          <div className="config-grid" style={{ display: "grid", gap: "16px" }}>
            {/* Type */}
            <div className="config-row">
              <label className="config-label">Type:</label>
              <div
                className="format-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                }}
              >
                {["teams", "players"].map((m) => (
                  <div
                    key={m}
                    className={`segmented-option ${
                      mode === m ? "selected" : ""
                    }`}
                    onClick={() => setMode(m as "teams" | "players")}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </div>
                ))}
              </div>
            </div>

            {/* Score Type */}
            <div className="config-row">
              <label className="config-label">Score:</label>
              <select
                className="form-select"
                value={scoreType}
                onChange={(e) => setScoreType(e.target.value as any)}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  background: "var(--input-bg)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <option value="points">Points</option>
                <option value="games">Games</option>
                <option value="sets">Sets</option>
              </select>
            </div>

            {/* Pool Play Toggle */}
            <div
              className="config-row"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <label className="config-label">Pool Play:</label>
              <div
                className={`ui-toggle ${isDualMode ? "active" : ""}`}
                onClick={() => setIsDualMode(!isDualMode)}
                role="switch"
                aria-checked={isDualMode}
              >
                <div className="toggle-track">
                  <div className="toggle-thumb" />
                </div>
              </div>
            </div>

            {/* Pool Play Options */}
            {isDualMode && (
              <>
                {/* Grand Final Toggle */}
                <div
                  className="config-row"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <label className="config-label">Grand Final:</label>
                  <div
                    className={`ui-toggle ${sharedFinal ? "active" : ""}`}
                    onClick={() => setSharedFinal(!sharedFinal)}
                    role="switch"
                  >
                    <div className="toggle-track">
                      <div className="toggle-thumb" />
                    </div>
                  </div>
                </div>

                {/* Assign Strategy */}
                <div className="config-row">
                  <label className="config-label">Assign to Pools:</label>
                  <div
                    className="format-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "8px",
                    }}
                  >
                    {[
                      { value: "random", label: "Random" },
                      { value: "alternate", label: "Alternate" },
                      { value: "half", label: "Split Half" },
                      { value: "manual", label: "Manual" },
                    ].map((opt) => (
                      <div
                        key={opt.value}
                        className={`segmented-option ${
                          assignStrategy === opt.value ? "selected" : ""
                        }`}
                        onClick={() =>
                          setAssignStrategy(opt.value as AssignStrategy)
                        }
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Create Button */}
      <div className="mt-8 flex justify-center pb-12">
        <Button
          size="lg"
          disabled={teams.length < 2}
          onClick={handleCreateBracket}
        >
          Create Bracket
        </Button>
      </div>
    </div>
  );
};

export default BracketSetup;

import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { HelpButton, NoticeBar } from "@/components/ui/HelpNotice";
import { useTournament } from "@/context/TournamentContext";
import { showToast } from "@/shared/utils";
import { HELP_BRACKET } from "@/tournament/content/help";
import {
  generateSingleBracket,
  generateDualBracket,
  applyAssignment,
  BracketTeam,
  BracketConfig,
} from "@/tournament/bracket/bracketCore";

interface SetupTeam {
  id: string;
  name: string;
  side?: "A" | "B";
}

type AssignStrategy = "random" | "alternate" | "half" | "manual";

export const BracketSetup: React.FC = () => {
  const { dispatch } = useTournament();
  const navigate = useNavigate();

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

  const addTeam = useCallback(() => {
    const name = newTeamName.trim();
    if (!name) return;

    if (teams.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
      showToast("Team/Player already exists", "error");
      return;
    }

    const newTeam: SetupTeam = {
      id: `team-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name,
      side: undefined,
    };

    setTeams((prev) => [...prev, newTeam]);
    setNewTeamName("");
  }, [newTeamName, teams]);

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

  const handleCreateBracket = useCallback(() => {
    if (teams.length < 2) {
      showToast("Add at least 2 teams", "error");
      return;
    }

    try {
      const config: BracketConfig = { scoreType, mode };

      let finalTeams: BracketTeam[] = teams.map((t) => ({
        id: t.id,
        name: t.name,
        side: t.side,
      }));

      if (isDualMode) {
        finalTeams = applyAssignment(finalTeams, assignStrategy);
        const bracket = generateDualBracket(finalTeams, sharedFinal);
        dispatch({ type: "SET_BRACKET", bracket, config });
      } else {
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

  const getTeamHint = () => {
    const count = teams.length;
    if (count < 2) {
      return `Add at least ${2 - count} more team${2 - count > 1 ? "s" : ""}`;
    }
    const isPowerOf2 = (count & (count - 1)) === 0 && count >= 4;
    if (isPowerOf2) {
      return (
        <span className="text-success">
          ✓ {count} teams ready (perfect bracket)
        </span>
      );
    }
    const nextPow2 = Math.pow(2, Math.ceil(Math.log2(count)));
    const byes = nextPow2 - count;
    return (
      <span className="text-warning">
        ⚠ {count} teams will have {byes} bye{byes > 1 ? "s" : ""}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h2 className="text-3xl font-bold text-primary">Create a Bracket</h2>
          <HelpButton
            title={HELP_BRACKET.title}
            content={HELP_BRACKET.content}
          />
        </div>
        <p className="text-secondary">
          Set up a single elimination tournament bracket.
        </p>
      </div>

      {/* Notices */}
      {teams.length > 0 && teams.length < 2 && (
        <NoticeBar type="warning" className="mb-4">
          Need at least 2 teams to create a bracket.
        </NoticeBar>
      )}
      {teams.length >= 2 && Math.log2(teams.length) % 1 !== 0 && (
        <NoticeBar type="info" className="mb-4">
          Best bracket sizes are powers of 2 (4, 8, 16...). Byes will be added
          for {teams.length} teams.
        </NoticeBar>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teams List */}
        <Card>
          <h3 className="text-lg font-bold text-primary mb-4">
            {mode === "teams" ? "Teams" : "Players"} ({teams.length})
          </h3>

          {/* Add Team Input */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTeam()}
              placeholder={`Add ${mode === "teams" ? "team" : "player"} name`}
              className="flex-1 px-4 py-2.5 rounded-xl bg-elevated border border-theme text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
            />
            <Button onClick={addTeam} size="sm">
              Add
            </Button>
          </div>

          {/* Team List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {teams.map((team, index) => (
              <div
                key={team.id}
                className="flex items-center gap-3 p-3 bg-elevated rounded-xl border border-theme"
              >
                {isDualMode && (
                  <button
                    onClick={() => toggleTeamSide(team.id)}
                    className={`text-xs font-semibold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                      team.side === "B"
                        ? "bg-warning/20 text-warning border border-warning"
                        : team.side === "A"
                        ? "bg-accent/20 text-accent border border-accent"
                        : "bg-white/10 text-muted border border-theme"
                    }`}
                  >
                    {team.side ? `Pool ${team.side}` : "Assign"}
                  </button>
                )}
                <span className="text-sm font-medium text-muted w-6">
                  {index + 1}.
                </span>
                <span className="flex-1 font-medium text-primary truncate">
                  {team.name}
                </span>
                <button
                  className="w-6 h-6 flex items-center justify-center text-muted hover:text-error rounded transition-colors"
                  onClick={() => removeTeam(team.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Team Hint */}
          {teams.length > 0 && (
            <div className="mt-4 text-sm">{getTeamHint()}</div>
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
        <Card>
          <h3 className="text-lg font-bold text-primary mb-4 pb-2 border-b border-theme">
            Settings
          </h3>

          <div className="space-y-6">
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                Type:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["teams", "players"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      mode === m
                        ? "bg-accent text-white"
                        : "bg-elevated border border-theme text-secondary hover:text-primary hover:border-accent/50"
                    }`}
                    onClick={() => setMode(m as "teams" | "players")}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Score Type */}
            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                Score:
              </label>
              <select
                className="w-full px-3 py-2 rounded-lg bg-elevated border border-theme text-primary focus:outline-none focus:border-accent transition-colors"
                value={scoreType}
                onChange={(e) => setScoreType(e.target.value as any)}
              >
                <option value="points">Points</option>
                <option value="games">Games</option>
                <option value="sets">Sets</option>
              </select>
            </div>

            {/* Pool Play Toggle */}
            <div className="bg-elevated p-4 rounded-xl border border-theme">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-primary">
                  Pool Play
                </label>
                <button
                  type="button"
                  onClick={() => setIsDualMode(!isDualMode)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    isDualMode ? "bg-accent" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      isDualMode ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-muted">
                Split teams into two pools with separate brackets.
              </p>
            </div>

            {/* Pool Play Options */}
            {isDualMode && (
              <div className="space-y-4 animate-fade-in">
                {/* Grand Final Toggle */}
                <div className="bg-elevated p-4 rounded-xl border border-theme">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium text-primary">
                      Grand Final
                    </label>
                    <button
                      type="button"
                      onClick={() => setSharedFinal(!sharedFinal)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        sharedFinal ? "bg-accent" : "bg-white/20"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          sharedFinal ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-muted">
                    Winners from each pool meet in the final.
                  </p>
                </div>

                {/* Assign Strategy */}
                <div>
                  <label className="block text-sm font-medium text-muted mb-2">
                    Assign to Pools:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "random", label: "Random" },
                      { value: "alternate", label: "Alternate" },
                      { value: "half", label: "Split Half" },
                      { value: "manual", label: "Manual" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          assignStrategy === opt.value
                            ? "bg-accent text-white"
                            : "bg-elevated border border-theme text-secondary hover:text-primary hover:border-accent/50"
                        }`}
                        onClick={() =>
                          setAssignStrategy(opt.value as AssignStrategy)
                        }
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Create Button */}
            <Button
              size="lg"
              disabled={teams.length < 2}
              onClick={handleCreateBracket}
              fullWidth
              className="mt-4"
            >
              Create Bracket
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BracketSetup;

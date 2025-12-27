import React, { useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PlayerList } from "@/components/tournament/PlayerList";
import { renderMultiBracketPreview } from "../../ui/bracket/index.js";
import {
  initBracketTournament,
  initDualBracketTournament,
} from "../../bracket/index.js";
import { showToast, createId } from "@/shared/utils.js";
import { useTournament } from "@/context/TournamentContext";
import { state as legacyState } from "../../core/state.js";

interface Team {
  name: string;
  side: string | null;
  id: string;
}

interface BracketSetupProps {
  onComplete?: () => void;
}

export const BracketSetup: React.FC<BracketSetupProps> = ({ onComplete }) => {
  const { state, dispatch } = useTournament();

  // Local state for setup-only toggles or use context?
  // Let's use context for global settings and local for transient setup choices
  // But wait, many of these were in localStorage. Let's move them to Context.

  const {
    bracketScale,
    ui: { activeBracketTab },
  } = state;

  // We'll need to add these fields to TournamentState or use local for now.
  // Actually, let's just use local state for the "Setup" values and sync to legacy state on Generate.
  const [teams, setTeams] = React.useState<Team[]>([]);
  const [mode, setMode] = React.useState<"teams" | "players">("teams");
  const [isDualMode, setIsDualMode] = React.useState(false);
  const [bracketCount, setBracketCount] = React.useState(2);
  const [sharedFinal, setSharedFinal] = React.useState(true);
  const [sideAssign, setSideAssign] = React.useState("random");
  const [scoreType, setScoreType] = React.useState("points");

  useEffect(() => {
    // Sync with legacy state for functions that still depend on it
    Object.assign(legacyState, state);
  }, [state]);

  const handleAddTeam = (name: string) => {
    if (teams.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
      showToast("Team already exists!", "error");
      return;
    }
    setTeams([...teams, { id: createId(), name, side: null }]);
    showToast(`${name} added`, "success");
  };

  const handleRemoveTeam = (index: number) => {
    const newTeams = [...teams];
    const removed = newTeams.splice(index, 1)[0];
    setTeams(newTeams);
    showToast(`${removed.name} removed`);
  };

  const handleSideToggle = (index: number) => {
    if (!isDualMode) return;
    const polls = ["A", "B", "C", "D", "E", "F"].slice(0, bracketCount);
    const newTeams = [...teams];
    const team = { ...newTeams[index] };
    if (team.side === null) {
      team.side = polls[0];
    } else {
      const idx = polls.indexOf(team.side);
      if (idx >= 0 && idx < polls.length - 1) {
        team.side = polls[idx + 1];
      } else {
        team.side = null;
      }
    }
    newTeams[index] = team;
    setTeams(newTeams);
  };

  const generateBracket = () => {
    if (teams.length < 2) {
      showToast("Need at least 2 teams", "error");
      return;
    }

    try {
      if (isDualMode) {
        initDualBracketTournament(teams, sharedFinal);
      } else {
        initBracketTournament(teams);
      }

      // Sync BACK to context
      dispatch({
        type: "SET_STATE",
        payload: {
          bracket: legacyState.bracket,
          bracketScale: legacyState.bracketScale || 100,
        },
      });

      if (onComplete) onComplete();
    } catch (e: any) {
      console.error(e);
      showToast("Error: " + e.message, "error");
    }
  };

  const renderTeamItem = (team: Team, index: number) => (
    <li
      key={team.id}
      className="player-item flex justify-between items-center p-2 bg-bg-tertiary rounded mb-2"
    >
      <div className="flex items-center gap-2">
        {isDualMode && (
          <button
            className="side-toggle text-xs px-2 py-1 rounded bg-black/20 hover:bg-black/40 text-text-muted"
            onClick={() => handleSideToggle(index)}
            title="Click to assign Pool"
          >
            {team.side ? `Pool ${team.side}` : "No Pool"}
          </button>
        )}
        <span>{team.name}</span>
      </div>
      <button
        className="text-text-muted hover:text-red-400 px-2 font-bold"
        onClick={() => handleRemoveTeam(index)}
      >
        ×
      </button>
    </li>
  );

  const previewHtml = React.useMemo(() => {
    if (teams.length < 2) return "";
    return renderMultiBracketPreview(
      teams.length,
      isDualMode ? bracketCount : 1,
      sharedFinal
    );
  }, [teams.length, isDualMode, bracketCount, sharedFinal]);

  return (
    <div className="tournament-setup-view container animate-fade-in py-8">
      <div className="page-intro-header text-center max-w-[600px] mx-auto mb-8 px-4">
        <h2 className="text-3xl mb-1 text-white">Create a Bracket</h2>
        <p className="text-text-muted">
          Set up a single elimination tournament bracket.
        </p>
      </div>

      <div className="setup-grid">
        <div className="setup-main">
          <Card>
            <PlayerList
              title={mode === "teams" ? "Teams" : "Players"}
              singularTitle={mode === "teams" ? "Team" : "Player"}
              items={teams}
              onAdd={handleAddTeam}
              onRemove={handleRemoveTeam}
              onClear={() => setTeams([])}
              onImport={(text) => {
                const lines = text.split("\n");
                let added = 0;
                const newTeams = [...teams];
                lines.forEach((l) => {
                  const n = l.trim();
                  if (
                    n &&
                    !newTeams.some(
                      (t) => t.name.toLowerCase() === n.toLowerCase()
                    ) &&
                    newTeams.length < 32
                  ) {
                    newTeams.push({ id: createId(), name: n, side: null });
                    added++;
                  }
                });
                setTeams(newTeams);
                showToast(`Imported ${added} ${mode}`, "success");
              }}
              maxItems={32}
              renderItem={renderTeamItem}
              hintText={
                <span
                  dangerouslySetInnerHTML={{
                    __html: getTeamsHint(teams.length),
                  }}
                />
              }
            />
          </Card>
        </div>

        <div className="setup-sidebar">
          <Card className="p-4">
            <div className="flex flex-col gap-4">
              {/* Mode Toggles */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Type:</span>
                <div className="flex gap-2 bg-black/20 p-1 rounded">
                  <button
                    className={`px-3 py-1 rounded text-xs ${
                      mode === "teams"
                        ? "bg-accent text-white"
                        : "text-text-muted hover:text-white"
                    }`}
                    onClick={() => setMode("teams")}
                  >
                    Teams
                  </button>
                  <button
                    className={`px-3 py-1 rounded text-xs ${
                      mode === "players"
                        ? "bg-accent text-white"
                        : "text-text-muted hover:text-white"
                    }`}
                    onClick={() => setMode("players")}
                  >
                    Players
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Pool Play:</span>
                <input
                  type="checkbox"
                  checked={isDualMode}
                  onChange={(e) => setIsDualMode(e.target.checked)}
                  className="w-5 h-5"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Score:</span>
                <select
                  className="p-1 px-2 text-sm bg-black/20 border border-white/10 rounded text-white outline-none"
                  value={scoreType}
                  onChange={(e) => setScoreType(e.target.value)}
                >
                  <option value="points">Points</option>
                  <option value="games">Games</option>
                  <option value="sets">Sets</option>
                </select>
              </div>

              {isDualMode && (
                <div className="mt-2 pt-4 border-t border-white/10">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">
                        Pools:
                      </span>
                      <select
                        className="p-1 px-2 text-sm bg-black/20 border border-white/10 rounded text-white outline-none"
                        value={bracketCount}
                        onChange={(e) =>
                          setBracketCount(parseInt(e.target.value))
                        }
                      >
                        {[2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>
                            {n} ({String.fromCharCode(65)}...
                            {String.fromCharCode(64 + n)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">
                        Pair Finals:
                      </span>
                      <input
                        type="checkbox"
                        checked={sharedFinal}
                        onChange={(e) => setSharedFinal(e.target.checked)}
                        className="w-5 h-5"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">
                        Assign:
                      </span>
                      <select
                        className="p-1 px-2 text-sm bg-black/20 border border-white/10 rounded text-white outline-none"
                        value={sideAssign}
                        onChange={(e) => setSideAssign(e.target.value)}
                      >
                        <option value="random">Random</option>
                        <option value="alternate">Alternate</option>
                        <option value="half">Split by Pool</option>
                        <option value="manual">Manual</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {teams.length >= 2 && (
            <div
              className="bracket-preview mt-4 p-4 bg-bg-tertiary rounded border border-white/10"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-center pb-12">
        <Button size="lg" disabled={teams.length < 2} onClick={generateBracket}>
          Create Bracket
        </Button>
      </div>
    </div>
  );
};

function getTeamsHint(count: number) {
  if (count < 2) {
    return `Add at least ${2 - count} more team${2 - count > 1 ? "s" : ""}`;
  }
  const isPowerOf2 = (count & (count - 1)) === 0 && count >= 4;
  if (isPowerOf2) {
    return `<span style="color: var(--success)">✓ ${count} teams ready (perfect bracket)</span>`;
  } else {
    const rounds = Math.ceil(Math.log2(count));
    const nextPowerOf2 = Math.pow(2, rounds);
    const byeCount = nextPowerOf2 - count;
    return `<span style="color: var(--warning)">${count} teams • ${byeCount} bye${
      byeCount > 1 ? "s" : ""
    } will be assigned</span>`;
  }
}

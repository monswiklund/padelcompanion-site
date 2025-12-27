import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PlayerList } from "@/components/tournament/PlayerList";
import { StorageService } from "@/shared/storage.js";
// We need to import these from the JS modules. Vite handles mixed imports fine.
import { renderMultiBracketPreview } from "../../ui/bracket/index.js";
import {
  initBracketTournament,
  initDualBracketTournament,
} from "../../bracket/index.js";
import { showToast } from "@/shared/utils.js";

interface Team {
  name: string;
  side: string | null; // "A", "B", etc.
  id?: string;
}

interface BracketSetupProps {
  onComplete?: () => void;
}

export const BracketSetup: React.FC<BracketSetupProps> = ({ onComplete }) => {
  // --- State ---
  const [teams, setTeams] = useState<Team[]>([]);
  const [mode, setMode] = useState<"teams" | "players">(
    (StorageService.getItem("bracket_mode") as "teams" | "players") || "teams"
  );

  // Pool / Dual Mode Settings
  const [isDualMode, setIsDualMode] = useState(
    StorageService.getItem("bracket_dual_mode") === "true"
  );
  const [bracketCount, setBracketCount] = useState(
    parseInt(StorageService.getItem("bracket_count") || "2")
  );
  const [sharedFinal, setSharedFinal] = useState(
    StorageService.getItem("bracket_shared_final") !== "false"
  );
  const [sideAssign, setSideAssign] = useState(
    StorageService.getItem("bracket_side_assign") || "random"
  );
  const [scoreType, setScoreType] = useState(
    StorageService.getItem("bracket_score_type") || "points"
  );

  // --- Effects (Persistence) ---
  useEffect(() => {
    // Load teams on mount
    const saved = StorageService.getItem("bracket_teams");
    if (saved && Array.isArray(saved)) {
      setTeams(
        saved.map((t: any) =>
          typeof t === "string" ? { name: t, side: null } : t
        )
      );
    }
  }, []);

  useEffect(() => {
    StorageService.setItem("bracket_teams", teams);
  }, [teams]);

  useEffect(() => {
    StorageService.setItem("bracket_mode", mode);
  }, [mode]);

  useEffect(() => {
    StorageService.setItem("bracket_dual_mode", String(isDualMode));
  }, [isDualMode]);

  useEffect(() => {
    StorageService.setItem("bracket_count", String(bracketCount));
  }, [bracketCount]);

  useEffect(() => {
    StorageService.setItem("bracket_shared_final", String(sharedFinal));
  }, [sharedFinal]);

  useEffect(() => {
    StorageService.setItem("bracket_side_assign", sideAssign);
  }, [sideAssign]);

  useEffect(() => {
    StorageService.setItem("bracket_score_type", scoreType);
  }, [scoreType]);

  // --- Handlers ---

  const handleAddTeam = (name: string) => {
    if (teams.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
      showToast("Team already exists!", "error");
      return;
    }
    setTeams([...teams, { name, side: null }]);
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
        // We typically invoke the legacy function
        initDualBracketTournament(teams, sharedFinal);
        showToast(`Dual bracket created with ${teams.length} teams`, "success");
      } else {
        initBracketTournament(teams);
        showToast(`Bracket created with ${teams.length} teams`, "success");
      }
      if (onComplete) onComplete();
    } catch (e: any) {
      console.error(e);
      showToast("Error: " + e.message, "error");
    }
  };

  // --- Render Helpers ---

  const renderTeamItem = (team: Team, index: number) => (
    <li
      key={index}
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
    <div className="tournament-setup-view">
      {/* 1. Page Header (We can replicate it here or import PageHeader logic if it was React) */}
      <div className="page-intro-header text-center max-w-[600px] mx-auto my-8 px-4">
        <h2 className="text-3xl mb-1 bg-gradient-to-br from-white to-purple-200 bg-clip-text text-transparent">
          Create a Bracket
        </h2>
        <p className="text-text-muted">
          Set up a single elimination tournament bracket.
        </p>
      </div>

      {/* 2. Player Manager */}
      <Card>
        <PlayerList<Team>
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
                newTeams.push({ name: n, side: null });
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

      {/* 3. Settings */}
      <Card className="mt-4">
        {/* Mode Toggles */}
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          {/* Teams vs Players */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span
              className={
                mode === "teams" ? "text-accent font-bold" : "text-text-muted"
              }
            >
              Teams
            </span>
            <div
              className="relative inline-block w-12 h-6"
              onClick={() => setMode(mode === "teams" ? "players" : "teams")}
            >
              <input
                type="checkbox"
                checked={mode === "players"}
                readOnly
                className="sr-only"
              />
              <span className="slider round"></span>
            </div>
            <span
              className={
                mode === "players" ? "text-accent font-bold" : "text-text-muted"
              }
            >
              Players
            </span>
          </label>

          {/* Pool Play Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-5 h-5 rounded bg-bg-tertiary border-border-color checked:bg-accent"
              checked={isDualMode}
              onChange={(e) => setIsDualMode(e.target.checked)}
            />
            <span>Pool Play</span>
          </label>

          {/* Score Type */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary">Score:</span>
            <select
              className="p-1 px-2 text-sm bg-black/20 border border-border-color rounded text-white outline-none"
              value={scoreType}
              onChange={(e) => setScoreType(e.target.value)}
            >
              <option value="points">Points</option>
              <option value="games">Games</option>
              <option value="sets">Sets</option>
            </select>
          </div>
        </div>

        {/* Dual Mode Settings */}
        {isDualMode && (
          <div className="flex flex-col gap-3 p-3 bg-bg-secondary rounded border border-border-color/50 animation-fade-in">
            <div className="text-xs text-text-muted font-bold uppercase tracking-wider">
              Pool Settings
            </div>
            <div className="flex flex-wrap gap-4 justify-center items-center">
              {/* Count */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">Pools:</span>
                <select
                  className="p-1 px-2 text-sm bg-black/20 border border-border-color rounded text-white outline-none"
                  value={bracketCount}
                  onChange={(e) => setBracketCount(parseInt(e.target.value))}
                >
                  {[2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} ({String.fromCharCode(65)}...
                      {String.fromCharCode(64 + n)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Pair Finals */}
              <label className="flex items-center gap-2 cursor-pointer select-none text-sm">
                <input
                  type="checkbox"
                  checked={sharedFinal}
                  onChange={(e) => setSharedFinal(e.target.checked)}
                />
                <span>Pair Finals 🏆</span>
              </label>

              {/* Assignment */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">Assign:</span>
                <select
                  className="p-1 px-2 text-sm bg-black/20 border border-border-color rounded text-white outline-none"
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
      </Card>

      {/* 4. Preview */}
      {teams.length >= 2 && (
        <div
          className="bracket-preview mt-5 p-4 bg-bg-tertiary rounded-lg border border-border-color"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      )}

      {/* 5. Action */}
      <div className="mt-8 flex justify-center">
        <Button size="lg" disabled={teams.length < 2} onClick={generateBracket}>
          Create Bracket
        </Button>
      </div>
    </div>
  );
};

// Utils ported locally to avoid dependency mess for now
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

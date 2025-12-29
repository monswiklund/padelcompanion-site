import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PlayerList } from "@/components/tournament/PlayerList";
import { StorageService } from "@/shared/storage";
import { showToast, createId } from "@/shared/utils";
import { useTournament } from "@/context/TournamentContext";
import {
  WCPlayer,
  WCConfig,
  generateWinnersCourt,
} from "@/tournament/winnersCourt/winnersCourtCore";

// ============ TYPES ============

interface SetupPlayer {
  id: string;
  name: string;
  skill: number;
  side: "A" | "B" | null;
}

type AssignStrategy = "random" | "skill" | "manual";

// ============ COMPONENT ============

export const WinnersCourtSetup: React.FC = () => {
  const { dispatch } = useTournament();
  const navigate = useNavigate();

  // Local state for setup
  const [players, setPlayers] = useState<SetupPlayer[]>([]);
  const [splitSides, setSplitSides] = useState(false);
  const [isTwist, setIsTwist] = useState(false);
  const [courtCountInput, setCourtCountInput] = useState<number | null>(null);
  const [assignStrategy, setAssignStrategy] = useState<AssignStrategy>("skill");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage for WC-specific player list (with skills)
  useEffect(() => {
    const saved = StorageService.getItem("wc_setup_players");
    if (saved && Array.isArray(saved)) {
      setPlayers(saved);
    }
    const savedSplit = StorageService.getItem("wc_split_sides", "false");
    setSplitSides(savedSplit === "true");
    setIsLoaded(true);
  }, []);

  // Save players to localStorage
  useEffect(() => {
    if (isLoaded) {
      StorageService.setItem("wc_setup_players", players);
    }
  }, [players, isLoaded]);

  useEffect(() => {
    StorageService.setItem("wc_split_sides", String(splitSides));
  }, [splitSides]);

  // ============ CALCULATED VALUES ============

  const maxCourts = Math.max(1, Math.floor(players.length / 4));
  const selectedCourts = courtCountInput || maxCourts;

  // ============ PLAYER MANAGEMENT ============

  const handleAddPlayer = useCallback(
    (name: string) => {
      if (players.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
        showToast("Player already exists!", "error");
        return;
      }
      const newPlayer: SetupPlayer = {
        id: createId(),
        name,
        skill: 0,
        side: splitSides ? "A" : null,
      };
      setPlayers((prev) => [...prev, newPlayer]);
      showToast(`${name} added`, "success");
    },
    [players, splitSides]
  );

  const handleRemovePlayer = useCallback((index: number) => {
    setPlayers((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleClearPlayers = useCallback(() => {
    setPlayers([]);
    showToast("Cleared all players");
  }, []);

  const handleImportPlayers = useCallback(
    (text: string) => {
      const lines = text.split("\n");
      let added = 0;
      const newPlayers = [...players];

      lines.forEach((l) => {
        const parts = l.split(":");
        const name = parts[0].trim();
        const skill = parts[1] ? parseInt(parts[1]) || 0 : 0;

        if (
          name &&
          !newPlayers.some((p) => p.name.toLowerCase() === name.toLowerCase())
        ) {
          newPlayers.push({
            id: createId(),
            name,
            skill,
            side: splitSides ? "A" : null,
          });
          added++;
        }
      });

      setPlayers(newPlayers);
      showToast(`Imported ${added} players`, "success");
    },
    [players, splitSides]
  );

  // ============ SIDE ASSIGNMENT ============

  const autoAssignSides = useCallback(() => {
    const newPlayers = [...players];

    if (assignStrategy === "skill") {
      // Skill-based: 5+ goes to A, below to B
      newPlayers.forEach((p) => {
        if (p.skill === 0) {
          p.side = Math.random() > 0.5 ? "A" : "B";
        } else {
          p.side = p.skill >= 5 ? "A" : "B";
        }
      });
    } else if (assignStrategy === "random") {
      // Shuffle and alternate
      const shuffled = [...newPlayers].sort(() => Math.random() - 0.5);
      shuffled.forEach((p, i) => {
        const original = newPlayers.find((o) => o.id === p.id);
        if (original) original.side = i % 2 === 0 ? "A" : "B";
      });
    }
    // manual - do nothing

    setPlayers(newPlayers);
    const countA = newPlayers.filter((p) => p.side !== "B").length;
    const countB = newPlayers.filter((p) => p.side === "B").length;
    showToast(`Assigned: A (${countA}) / B (${countB})`, "success");
  }, [players, assignStrategy]);

  const togglePlayerSide = useCallback((id: string) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, side: p.side === "B" ? "A" : "B" } : p
      )
    );
    setAssignStrategy("manual");
  }, []);

  const updatePlayerSkill = useCallback((id: string, skill: number) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, skill } : p)));
  }, []);

  // ============ GENERATION ============

  const handleGenerate = useCallback(() => {
    const sideA = players.filter((p) => p.side !== "B");
    const sideB = players.filter((p) => p.side === "B");

    const courtCountA = splitSides
      ? Math.floor(sideA.length / 4)
      : selectedCourts;
    const courtCountB = splitSides ? Math.floor(sideB.length / 4) : 0;

    if (courtCountA === 0 && courtCountB === 0) {
      showToast("Need at least 4 players to start", "error");
      return;
    }

    // Convert to WCPlayers (add id)
    const wcPlayers: WCPlayer[] = players.map((p) => ({
      id: p.id,
      name: p.name,
      skill: p.skill,
      side: p.side,
    }));

    const config: WCConfig = {
      courtCountA,
      courtCountB,
      splitSides,
      twist: isTwist,
    };

    try {
      const wcState = generateWinnersCourt(wcPlayers, config);
      dispatch({ type: "SET_WINNERS_COURT", winnersCourtState: wcState });

      const totalCourts = courtCountA + courtCountB;
      showToast(
        `Winners Court started with ${totalCourts} court(s)`,
        "success"
      );
      navigate("/tournament/winners-court");
    } catch (e: any) {
      showToast(e.message || "Generation failed", "error");
    }
  }, [players, splitSides, selectedCourts, isTwist, dispatch, navigate]);

  // ============ RENDER HELPERS ============

  const getPoolStyle = (side?: "A" | "B" | null) => {
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

  const renderPlayerPrefix = (p: SetupPlayer) => {
    if (!splitSides) return null;
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          togglePlayerSide(p.id);
        }}
        style={{
          ...getPoolStyle(p.side),
          fontSize: "0.7rem",
          fontWeight: 600,
          padding: "2px 8px",
          borderRadius: "4px",
          cursor: "pointer",
          marginRight: "8px",
        }}
      >
        {p.side === "B" ? "Pool B" : "Pool A"}
      </button>
    );
  };

  const renderPlayerActions = (p: SetupPlayer) => (
    <select
      className="compact-select bg-black/20 text-xs p-1 rounded border border-white/10 outline-none"
      value={p.skill}
      onChange={(e) => updatePlayerSkill(p.id, parseInt(e.target.value))}
    >
      <option value="0">Skill: -</option>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
        <option key={n} value={n}>
          {n}
        </option>
      ))}
    </select>
  );

  // Sort for display
  const sortedPlayers = splitSides
    ? [...players].sort((a, b) => {
        if (a.side === b.side) return 0;
        return a.side === "B" ? 1 : -1;
      })
    : players;

  const getPlayerHint = () => {
    const count = players.length;
    if (count < 4) {
      return `Add at least ${4 - count} more player${4 - count > 1 ? "s" : ""}`;
    }
    if (splitSides) {
      const countA = players.filter((p) => p.side !== "B").length;
      const countB = players.filter((p) => p.side === "B").length;
      return (
        <span style={{ color: "var(--success)" }}>
          ✓ {count} ready | A: {countA} | B: {countB}
        </span>
      );
    }
    return (
      <span style={{ color: "var(--success)" }}>
        ✓ {count} players ready ({selectedCourts} court
        {selectedCourts > 1 ? "s" : ""})
      </span>
    );
  };

  // ============ RENDER ============

  return (
    <div className="tournament-setup-view container animate-fade-in py-8">
      <div className="page-intro-header">
        <h2>Winners Court Setup</h2>
        <p>Skill-based court promotion. Win to move up, lose to move down.</p>
      </div>

      <div className="setup-layout">
        {/* Players List */}
        <Card className="setup-layout__main">
          <PlayerList
            items={sortedPlayers}
            onAdd={handleAddPlayer}
            onRemove={handleRemovePlayer}
            onClear={handleClearPlayers}
            onImport={handleImportPlayers}
            renderPrefix={splitSides ? renderPlayerPrefix : undefined}
            renderActions={renderPlayerActions}
            defaultView="grid"
            showViewToggle={true}
            hintText={
              <div className="text-xs text-text-muted mt-2 flex items-center gap-2">
                <span className="text-brand-primary">✓</span>
                {getPlayerHint()}
              </div>
            }
          />
        </Card>

        {/* Settings */}
        <Card className="setup-layout__sidebar">
          <h3 className="text-lg font-bold mb-4 border-b border-white/10 pb-2">
            Settings
          </h3>

          <div className="flex flex-col gap-6">
            {/* Courts */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-muted">
                Courts
              </label>
              <select
                className="form-select bg-black/20 border-white/10 rounded-lg p-2 text-sm"
                value={selectedCourts}
                onChange={(e) => setCourtCountInput(parseInt(e.target.value))}
              >
                <option value={maxCourts}>Auto ({maxCourts})</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((c) => (
                  <option key={c} value={c}>
                    {c} Courts
                  </option>
                ))}
              </select>
            </div>

            {/* Twist Mode Toggle */}
            <div className="bg-black/20 p-3 rounded-lg border border-white/5">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium">Twist Mode</label>
                <div
                  className={`ui-toggle scale-90 ${isTwist ? "active" : ""}`}
                  onClick={() => setIsTwist(!isTwist)}
                >
                  <div className="toggle-track">
                    <div className="toggle-thumb" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-text-muted">
                Partners swap after every round (Winners split, Losers split).
              </p>
            </div>

            {/* Split Sides Toggle */}
            <div className="bg-black/20 p-3 rounded-lg border border-white/5">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium">Split Pools</label>
                <div
                  className={`ui-toggle scale-90 ${splitSides ? "active" : ""}`}
                  onClick={() => setSplitSides(!splitSides)}
                >
                  <div className="toggle-track">
                    <div className="toggle-thumb" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-text-muted">
                Create separate A & B pools.
              </p>
            </div>

            {/* Pool Assignment Options (when split) */}
            {splitSides && (
              <div className="animate-fade-in flex flex-col gap-3 pt-2 border-t border-white/10">
                <label className="text-xs font-bold text-text-muted uppercase">
                  Pool Assignment
                </label>
                <div className="flex bg-black/30 p-1 rounded-lg">
                  {[
                    { value: "skill", label: "Skill" },
                    { value: "random", label: "Random" },
                    { value: "manual", label: "Manual" },
                  ].map((opt) => (
                    <div
                      key={opt.value}
                      className={`flex-1 text-center text-xs py-1.5 rounded cursor-pointer transition-colors ${
                        assignStrategy === opt.value
                          ? "bg-accent text-white shadow-sm"
                          : "text-text-muted hover:text-white"
                      }`}
                      onClick={() =>
                        setAssignStrategy(opt.value as AssignStrategy)
                      }
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={autoAssignSides}
                  className="w-full text-xs"
                >
                  Assign Pools
                </Button>
              </div>
            )}

            <Button
              size="lg"
              disabled={players.length < 4}
              onClick={handleGenerate}
              className="mt-2 w-full shadow-lg shadow-accent/20"
            >
              Start Session
            </Button>
          </div>
        </Card>
      </div>

      {/* Footer info (removed old generate button since moved to sidebar) */}
      <div className="mt-12 text-center text-xs text-text-muted opacity-50">
        Winners move towards Court 1. Losers move towards last court.
      </div>
    </div>
  );
};

export default WinnersCourtSetup;

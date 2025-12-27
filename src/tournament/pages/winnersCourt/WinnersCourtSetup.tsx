import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PlayerList } from "@/components/tournament/PlayerList";
import { StorageService } from "@/shared/storage";
import { showToast } from "@/shared/utils";
// Functions from logic.js (we'll import these)
import { initWinnersCourt, clearWinnersCourt } from "./logic";
import { HELP_SKILL_LEVELS, HELP_WINNERS_INTRO } from "../../content/help";
import {
  showInfoModal,
  showInputModal,
  showConfirmModal,
} from "../../core/modals";
import { useTournament } from "@/context/TournamentContext";
import { state as legacyState } from "../../core/state";

interface WCPlayer {
  name: string;
  skill: number;
  side: "A" | "B" | null;
}

interface WinnersCourtSetupProps {
  onGameActive: () => void; // call parent to refresh full page
}

export const WinnersCourtSetup: React.FC<WinnersCourtSetupProps> = ({
  onGameActive,
}) => {
  const { state, dispatch } = useTournament();
  // --- State ---
  const [players, setPlayers] = useState<WCPlayer[]>([]);
  const [splitSides, setSplitSides] = useState(
    StorageService.getItem("wc_split_sides", "false") === "true"
  );
  const [isTwist, setIsTwist] = useState(false); // Default to false, or load pref if we had one
  const [courtCountInput, setCourtCountInput] = useState<number | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  // --- Effects ---
  useEffect(() => {
    // Load setup players
    const saved = StorageService.getItem("wc_setup_players");
    if (saved && Array.isArray(saved)) {
      setPlayers(saved);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      StorageService.setItem("wc_setup_players", players);
    }
  }, [players, isLoaded]);

  useEffect(() => {
    StorageService.setItem("wc_split_sides", String(splitSides));
  }, [splitSides]);

  // --- Logic Helpers ---
  const maxCourts = Math.max(1, Math.floor(players.length / 4));
  const selectedCourts = courtCountInput || maxCourts;

  const handleAddPlayer = (name: string) => {
    if (players.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      showToast("Player already exists!", "error");
      return;
    }
    // Default Logic for new player
    // If we want to support adding with skill immediately, we need a custom form in PlayerList
    // But PlayerList by default just asks for name. The logic below "addPlayer" had custom input for skill.
    // We can just add with skill 0 and let them edit it.
    const newPlayer: WCPlayer = {
      name,
      skill: 0,
      side: splitSides ? "A" : null,
    }; // Default side?

    setPlayers([...players, newPlayer]);
    showToast(`${name} added`, "success");
  };

  // Custom "Add with Skill" is handled by PlayerList's custom render or we enhance PlayerList or we just let them edit after add.
  // The original UI had a skill dropdown NEXT to the add button.
  // We can replicate that if we control the input area, but PlayerList encapsulates it.
  // We will assume "Edit after Add" flow for simplicity OR simple 'Import' parsing.
  // Actually, let's stick to "Add then Edit" or Import for bulk skill.

  const autoAssign = () => {
    const newPlayers = [...players];
    const unknownIndices: number[] = [];

    // 1. Initial sorting / Unknown detection
    newPlayers.forEach((p, i) => {
      if (p.skill === 0) {
        unknownIndices.push(i);
        p.side = null;
      } else {
        p.side = p.skill >= 5 ? "A" : "B";
      }
    });

    let countA = newPlayers.filter((p) => p.side === "A").length;
    let countB = newPlayers.filter((p) => p.side === "B").length;

    // 2. Shuffle Unknowns
    for (let i = unknownIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [unknownIndices[i], unknownIndices[j]] = [
        unknownIndices[j],
        unknownIndices[i],
      ];
    }

    // 3. Distribute Unknowns to balance
    unknownIndices.forEach((idx) => {
      if (countA <= countB) {
        newPlayers[idx].side = "A";
        countA++;
      } else {
        newPlayers[idx].side = "B";
        countB++;
      }
    });

    setPlayers(newPlayers);
    showToast(
      `Auto-assigned: Side A (${countA}) / Side B (${countB})`,
      "success"
    );
  };

  const handleGenerate = () => {
    // Validation
    const sideA = players.filter((p) => p.side !== "B");
    const sideB = players.filter((p) => p.side === "B");

    // If not split sides, everyone is "Side A" effectively (default logic handled by initWinnersCourt?)
    // initWinnersCourt expects { A: [], B: [] }
    const playersBySide = splitSides
      ? { A: sideA, B: sideB }
      : { A: players, B: [] };

    // Courts
    const courtCountA = splitSides
      ? Math.floor(sideA.length / 4)
      : selectedCourts;
    const courtCountB = splitSides ? Math.floor(sideB.length / 4) : 0;

    const courtCountBySide = { A: courtCountA, B: courtCountB };

    if (courtCountA === 0 && courtCountB === 0) {
      showToast("Need at least 4 players to start", "error");
      return;
    }

    try {
      initWinnersCourt(playersBySide, courtCountBySide, isTwist);
      const total = courtCountA + courtCountB;
      showToast(`Winners Court created with ${total} courts`, "success");

      // Sync to Context
      dispatch({
        type: "SET_STATE",
        payload: { winnersCourt: legacyState.winnersCourt },
      });

      onGameActive();
      // We usually don't need to clear players from setup, they stay as "next game candidates"
    } catch (e: any) {
      showToast(e.message, "error");
    }
  };

  // --- Render Items ---
  // --- Render Items ---
  const renderPlayerPrefix = (p: WCPlayer, i: number) => {
    if (!splitSides) return null;
    return (
      <button
        className="text-xs px-2 py-1 rounded bg-black/20 hover:bg-black/40 text-text-muted font-bold w-8 mr-2"
        onClick={() => {
          // Find real index in original list is complex if sorted list is passed to list
          // But PlayerList renders items array passed to it.
          // We need original player update.
          const realIndex = players.indexOf(p);
          if (realIndex === -1) return;
          const newP = [...players];
          newP[realIndex].side = newP[realIndex].side === "B" ? "A" : "B";
          setPlayers(newP);
        }}
      >
        {p.side === "B" ? "B" : "A"}
      </button>
    );
  };

  const renderPlayerActions = (p: WCPlayer, i: number) => {
    return (
      <select
        className="compact-select bg-black/20 text-xs p-1 rounded border border-white/10 outline-none"
        value={p.skill}
        onChange={(e) => {
          const realIndex = players.indexOf(p);
          if (realIndex === -1) return;
          const newP = [...players];
          newP[realIndex].skill = parseInt(e.target.value);
          setPlayers(newP);
        }}
      >
        <option value="0">Skill: -</option>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    );
  };

  // Grouping for Split Sides display?
  // Maybe we just rely on the badges/colors in the flat list for now to keep implementation simple and reuse PlayerList.
  // BUT: split sides usually implies sorting. The old code rendered TWO lists (A vs B) inside the container.
  // PlayerList expects a simple array.
  // We can sort the array passed to PlayerList so A comes first, then B.
  const sortedPlayers = splitSides
    ? [...players].sort((a, b) => {
        if (a.side === b.side) return 0;
        return a.side === "B" ? 1 : -1;
      })
    : players;

  return (
    <div className="tournament-setup-view container animate-fade-in">
      <div className="page-intro-header">
        <h2>Winners Court Setup</h2>
        <p>Skill-based court promotion. Win to move up, lose to move down.</p>
      </div>

      <div className="setup-grid">
        <div className="setup-main">
          <Card>
            <PlayerList
              title="Players"
              singularTitle="Player"
              items={sortedPlayers}
              onAdd={handleAddPlayer}
              onRemove={(idx: number) => {
                const itemToRemove = sortedPlayers[idx];
                setPlayers(players.filter((p) => p !== itemToRemove));
              }}
              onClear={() => {
                setPlayers([]);
                showToast("Cleared all players");
              }}
              onImport={(text: string) => {
                const lines = text.split("\n");
                let added = 0;
                const newP = [...players];
                lines.forEach((l: string) => {
                  const parts = l.split(":");
                  const name = parts[0].trim();
                  let skill = 0;
                  if (parts[1]) skill = parseInt(parts[1]) || 0;

                  if (
                    name &&
                    !newP.some(
                      (p) => p.name.toLowerCase() === name.toLowerCase()
                    )
                  ) {
                    newP.push({ name, skill, side: splitSides ? "A" : null });
                    added++;
                  }
                });
                setPlayers(newP);
                showToast(`Imported ${added} players`, "success");
              }}
              renderPrefix={renderPlayerPrefix}
              renderActions={renderPlayerActions}
              hintText={
                <div className="text-xs text-text-muted mt-2 flex items-center gap-2">
                  <span className="text-brand-primary">✓</span>
                  <span>{players.length} players ready</span>
                  {splitSides && (
                    <>
                      <span className="opacity-50">|</span>
                      <span>
                        A: {players.filter((p) => p.side !== "B").length} / B:{" "}
                        {players.filter((p) => p.side === "B").length}
                      </span>
                    </>
                  )}
                </div>
              }
            />
          </Card>
        </div>

        <div className="setup-sidebar">
          <Card className="p-4">
            <h3 className="text-sm font-bold text-white mb-4">Settings</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Courts:</span>
                <select
                  className="p-1 px-2 text-sm bg-black/20 border border-white/10 rounded text-white outline-none"
                  value={selectedCourts}
                  onChange={(e) => setCourtCountInput(parseInt(e.target.value))}
                >
                  <option value={maxCourts}>Auto ({maxCourts})</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Twist Mode:</span>
                <input
                  type="checkbox"
                  checked={isTwist}
                  onChange={(e) => setIsTwist(e.target.checked)}
                  className="w-5 h-5"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">
                  Split Sides:
                </span>
                <input
                  type="checkbox"
                  checked={splitSides}
                  onChange={(e) => setSplitSides(e.target.checked)}
                  className="w-5 h-5"
                />
              </div>

              <div className="pt-2 text-xs text-text-muted">
                {splitSides && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={autoAssign}
                    className="w-full mb-2"
                  >
                    Auto-Assign
                  </Button>
                )}
                <p>Winners move towards Court 1.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-8 flex justify-center pb-12">
        <Button
          size="lg"
          disabled={players.length < 4}
          onClick={handleGenerate}
        >
          Start Session
        </Button>
      </div>
    </div>
  );
};

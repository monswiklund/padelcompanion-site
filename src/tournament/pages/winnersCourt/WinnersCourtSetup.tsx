import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PlayerList } from "@/components/tournament/PlayerList";
import { StorageService } from "@/shared/storage.js";
import { showToast } from "@/shared/utils.js";
// Functions from logic.js (we'll import these)
import { initWinnersCourt, clearWinnersCourt } from "./logic.js";
import { HELP_SKILL_LEVELS, HELP_WINNERS_INTRO } from "../../content/help.js";
import {
  showInfoModal,
  showInputModal,
  showConfirmModal,
} from "../../core/modals.js";
import { useTournament } from "@/context/TournamentContext";
import { state as legacyState } from "../../core/state.js";

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

  // --- Effects ---
  useEffect(() => {
    // Load setup players
    const saved = StorageService.getItem("wc_setup_players");
    if (saved && Array.isArray(saved)) {
      setPlayers(saved);
    }
  }, []);

  useEffect(() => {
    StorageService.setItem("wc_setup_players", players);
  }, [players]);

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
  const renderItem = (p: WCPlayer, i: number) => {
    // We want to show headers if split sides
    // But flat list rendering makes headers tricky inside the map unless we sort or group.
    // PlayerList just renders a list.
    // We can group them visually with colors or badges.

    const isSideB = p.side === "B";

    return (
      <li
        key={i}
        className={`player-item flex justify-between items-center p-2 rounded mb-2 ${
          isSideB && splitSides
            ? "bg-orange-500/10 border-l-2 border-orange-500"
            : "bg-bg-tertiary border-l-2 border-blue-500"
        }`}
      >
        <div className="flex items-center gap-3">
          {splitSides && (
            <button
              className="text-xs px-2 py-1 rounded bg-black/20 hover:bg-black/40 text-text-muted font-bold w-8"
              onClick={() => {
                const newP = [...players];
                newP[i].side = newP[i].side === "B" ? "A" : "B";
                setPlayers(newP);
              }}
            >
              {p.side === "B" ? "B" : "A"}
            </button>
          )}

          <span className="font-medium">{p.name}</span>

          {/* Skill Selector */}
          <select
            className="compact-select bg-black/20 text-xs p-1 rounded border border-white/10 outline-none"
            value={p.skill}
            onChange={(e) => {
              const newP = [...players];
              newP[i].skill = parseInt(e.target.value);
              setPlayers(newP);
            }}
          >
            <option value="0">-</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <button
          className="text-text-muted hover:text-red-400 px-2 font-bold"
          onClick={() => {
            const newP = [...players];
            newP.splice(i, 1);
            setPlayers(newP);
          }}
        >
          ×
        </button>
      </li>
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
    <div className="tournament-setup-view wc-setup">
      {/* 1. Header (Simplest to keep outside or replicate) */}
      {/* Let's rely on index.js for header or replicate it if we want full control */}
      {/* We'll assume index.js is cleared or we replace standard header */}
      <div className="page-intro-header text-center max-w-[600px] mx-auto my-8 px-4">
        <h2 className="text-3xl mb-1 bg-gradient-to-br from-blue-400 to-green-300 bg-clip-text text-transparent">
          Winners Court
        </h2>
        <p className="text-text-muted">Skill-based court promotion.</p>
      </div>

      {/* 2. Player Manager */}
      <Card>
        <PlayerList<WCPlayer>
          title="Players"
          items={sortedPlayers}
          onAdd={handleAddPlayer}
          onRemove={(idx) => {
            // If sorted, indices mismatch with original 'players' state?
            // Yes. We need to find the item in real state.
            const itemToRemove = sortedPlayers[idx];
            setPlayers(players.filter((p) => p !== itemToRemove));
          }}
          onClear={() => setPlayers([])}
          onImport={(text) => {
            const lines = text.split("\n");
            const newP = [...players];
            let added = 0;
            lines.forEach((l) => {
              const parts = l.split(":");
              const name = parts[0].trim();
              let skill = 0;
              if (parts[1]) skill = parseInt(parts[1]) || 0;

              if (
                name &&
                !newP.some((p) => p.name.toLowerCase() === name.toLowerCase())
              ) {
                newP.push({ name, skill, side: splitSides ? "A" : null });
                added++;
              }
            });
            setPlayers(newP);
            showToast(`Imported ${added} players`, "success");
          }}
          renderItem={(item) => {
            // We need to find the REAL index of 'item' in 'players' array to update it correctly
            const realIndex = players.indexOf(item);
            return renderItem(item, realIndex);
          }}
          hintText={
            <div className="flex justify-between text-xs text-text-muted mt-2">
              <span>Total: {players.length}</span>
              {splitSides && (
                <span>
                  Side A: {players.filter((p) => p.side !== "B").length} / Side
                  B: {players.filter((p) => p.side === "B").length}
                </span>
              )}
            </div>
          }
        />
      </Card>

      {/* 3. Settings */}
      <Card className="mt-4">
        <div className="flex justify-center flex-wrap gap-4 items-center">
          {/* Courts Selector (Only if NOT split sides) */}
          {!splitSides && maxCourts > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary">Courts:</span>
              <select
                className="p-1 px-2 text-sm bg-black/20 border border-border-color rounded text-white outline-none"
                value={selectedCourts}
                onChange={(e) => setCourtCountInput(parseInt(e.target.value))}
              >
                {Array.from({ length: maxCourts }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} ({n * 4} players)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Twist Mode */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isTwist}
              onChange={(e) => setIsTwist(e.target.checked)}
            />
            <span>Twist Mode</span>
          </label>

          {/* Split Sides */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={splitSides}
              onChange={(e) => setSplitSides(e.target.checked)}
            />
            <span>Split Sides</span>
          </label>

          {/* Auto Assign */}
          {splitSides && (
            <Button size="sm" variant="secondary" onClick={autoAssign}>
              Auto-Assign by Skill
            </Button>
          )}
        </div>
      </Card>

      {/* 4. Actions */}
      <div className="mt-8 flex justify-center">
        <Button
          size="lg"
          disabled={players.length < 4}
          onClick={handleGenerate}
        >
          Generate Winners Court
        </Button>
      </div>
    </div>
  );
};

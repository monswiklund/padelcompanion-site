import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PlayerList } from "@/components/tournament/PlayerList";
import { StorageService } from "@/shared/storage.js";
import { showToast, createId } from "@/shared/utils.js";
import {
  TournamentConfig,
  TournamentConfigState,
} from "@/components/tournament/TournamentConfig";
import { PreferredPartners } from "@/components/tournament/PreferredPartners";
// Import legacy functions
import { generateSchedule } from "../../ui/index.js"; // This function reads from global state...
import { state, saveState } from "../../core/state.js"; // Access global state to sync for legacy generator
import {
  addPlayer,
  removePlayer,
  removeAllPlayers,
  importPlayers,
} from "../../players.js"; // Use legacy player actions if possible, or replicate?
// Legacy player actions modify global state. If we use them, we get syncing for free?
// React Setup usually wants its own state.
// Hybrid approach: Local React state -> Sync to Global State -> Trigger Legacy

interface GeneratorPlayer {
  id: string;
  name: string;
  lockedCourt?: number | null;
}

interface GeneratorSetupProps {
  onGameActive: () => void;
}

export const GeneratorSetup: React.FC<GeneratorSetupProps> = ({
  onGameActive,
}) => {
  // --- State ---
  // We initialize from global state (which is loaded from storage on app start)
  const [players, setPlayers] = useState<GeneratorPlayer[]>(
    state.players || []
  );
  const [pairs, setPairs] = useState(state.preferredPartners || []);
  const [config, setConfig] = useState<TournamentConfigState>({
    format: state.format || "americano",
    courts: state.courts || 1,
    scoringMode: state.scoringMode || "total",
    pointsPerMatch: state.pointsPerMatch || 24,
    maxRepeats: state.maxRepeats || 0,
    pairingStrategy: state.pairingStrategy || "optimal",
    strictStrategy: state.strictStrategy || false,
  });

  // --- Effects: Sync React State to Global State ---
  useEffect(() => {
    state.players = players;
    state.preferredPartners = pairs;
    // Config
    state.format = config.format;
    state.courts = config.courts;
    state.scoringMode = config.scoringMode;
    state.pointsPerMatch = config.pointsPerMatch;
    state.maxRepeats = config.maxRepeats;
    state.pairingStrategy = config.pairingStrategy;
    state.strictStrategy = config.strictStrategy;

    saveState(); // Persist to localStorage via legacy storage mechanism
  }, [players, pairs, config]);

  // Also listen for external updates? (e.g. if legacy code modifies state?)
  // Probably not needed as we are the Setup view owner now.

  // --- Handlers ---
  const handleAddPlayer = (name: string) => {
    // Use logic similar to legacy addPlayer to get ID generation consistent if needed
    if (players.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      showToast("Player already exists", "error");
      return;
    }
    const newPlayer = { id: createId(), name, lockedCourt: null };
    setPlayers([...players, newPlayer]);
    showToast(`${name} added`, "success");
  };

  const handleGenerate = () => {
    // Validation
    if (players.length < 4) {
      showToast("Need at least 4 players", "error");
      return;
    }

    // We already synced state in useEffect.
    // Call legacy generate
    try {
      generateSchedule();
      if (state.schedule && state.schedule.length > 0) {
        onGameActive();
      }
    } catch (e: any) {
      showToast(e.message || "Generation failed", "error");
    }
  };

  const updateConfig = (key: keyof TournamentConfigState, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  // --- Render Item (Court Lock) ---
  const renderPlayerItem = (p: GeneratorPlayer, i: number) => {
    const courts = config.courts;

    return (
      <li
        key={p.id}
        className="player-item flex justify-between items-center p-2 rounded mb-2 bg-bg-tertiary"
      >
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <span className="text-text-muted text-xs w-6">{i + 1}.</span>
          <span className="font-medium truncate flex-1">{p.name}</span>

          {/* Court Lock */}
          {courts > 1 && (
            <select
              className="bg-black/20 text-xs p-1 rounded border border-white/10 outline-none w-20"
              value={p.lockedCourt || ""}
              onChange={(e) => {
                const val = e.target.value ? parseInt(e.target.value) : null;
                const newP = [...players];
                newP[i].lockedCourt = val;
                setPlayers(newP);
              }}
              title="Lock to Court"
            >
              <option value="">Auto</option>
              {Array.from({ length: courts }, (_, c) => c + 1).map((c) => (
                <option key={c} value={c}>
                  Court {c}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          className="text-text-muted hover:text-red-400 px-2 font-bold ml-2"
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

  return (
    <div className="tournament-setup-view generator-setup">
      {/* Header from index.js usually. If we want it here: */}
      {/* <div className="page-intro-header ..."></div> */}
      {/* We assume index.js handles header OR we replicate. 
            Legacy setup.js rendered header via PageHeader.
            So we should probably render header here to replace it fully.
        */}
      <div className="page-intro-header text-center max-w-[600px] mx-auto my-8 px-4">
        <h2 className="text-3xl mb-1 text-white">Americano Setup</h2>
        <p className="text-text-muted">
          Add players and configure your tournament settings.
        </p>
      </div>

      {/* Player Manager */}
      <Card>
        <PlayerList<GeneratorPlayer>
          items={players}
          onAdd={handleAddPlayer}
          onRemove={(idx) => {
            const newP = [...players];
            newP.splice(idx, 1);
            setPlayers(newP);
          }}
          onClear={() => setPlayers([])}
          onImport={(text) => {
            const lines = text.split("\n");
            const newP = [...players];
            let added = 0;
            lines.forEach((l) => {
              const name = l.trim();
              if (
                name &&
                !newP.some((p) => p.name.toLowerCase() === name.toLowerCase())
              ) {
                newP.push({ id: createId(), name, lockedCourt: null });
                added++;
              }
            });
            setPlayers(newP);
            showToast(`Imported ${added} players`, "success");
          }}
          renderItem={renderPlayerItem}
          hintText={
            <div className="text-center text-xs text-text-muted mt-2">
              {players.length} ready | {config.courts} courts (
              {config.courts * 4} playing).
              {players.length % 4 !== 0 && (
                <span className="text-orange-400 ml-1">Queue enabled.</span>
              )}
            </div>
          }
        />
      </Card>

      {/* Config */}
      <div className="mt-4">
        <TournamentConfig
          config={config}
          playerCount={players.length}
          onChange={updateConfig}
        />
      </div>

      {/* Pairs (If Mexicano) */}
      {config.format.includes("mexicano") && (
        <Card className="mt-4">
          <PreferredPartners
            pairs={pairs}
            players={players}
            onAddPair={(p1Id, p2Id) => {
              setPairs([
                ...pairs,
                { id: createId(), player1Id: p1Id, player2Id: p2Id },
              ]);
            }}
            onRemovePair={(id) => {
              setPairs(pairs.filter((p) => p.id !== id));
            }}
          />
        </Card>
      )}

      {/* Actions */}
      <div className="mt-8 flex justify-center pb-12">
        <Button
          size="lg"
          disabled={players.length < 4}
          onClick={handleGenerate}
        >
          Generate Schedule
        </Button>
      </div>
    </div>
  );
};

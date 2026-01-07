import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { HelpButton, NoticeBar } from "@/components/ui/HelpNotice";
import { PlayerList } from "@/components/tournament/PlayerList";
import { StorageService } from "@/shared/storage";
import { showToast, createId } from "@/shared/utils";
import { useTournament } from "@/context/TournamentContext";
import { HELP_WINNERS_INTRO } from "@/tournament/content/help";
import {
  WCPlayer,
  WCConfig,
  generateWinnersCourt,
} from "@/tournament/winnersCourt/winnersCourtCore";

interface SetupPlayer {
  id: string;
  name: string;
  skill: number;
  side: "A" | "B" | null;
}

type AssignStrategy = "random" | "manual";

export const WinnersCourtSetup: React.FC = () => {
  const { dispatch } = useTournament();
  const navigate = useNavigate();

  const [players, setPlayers] = useState<SetupPlayer[]>([]);
  const [splitSides, setSplitSides] = useState(false);
  const [isTwist, setIsTwist] = useState(false);
  const [courtCountInput, setCourtCountInput] = useState<number | null>(null);
  const [assignStrategy, setAssignStrategy] =
    useState<AssignStrategy>("random");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = StorageService.getItem("wc_setup_players");
    if (saved && Array.isArray(saved)) {
      setPlayers(saved);
    }
    const savedSplit = StorageService.getItem("wc_split_sides", "false");
    setSplitSides(savedSplit === "true");
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

  const maxCourts = Math.max(1, Math.floor(players.length / 4));
  const selectedCourts = courtCountInput || maxCourts;

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
      const addedPlayers: SetupPlayer[] = [];
      let duplicateCount = 0;

      lines.forEach((l) => {
        const parts = l.split(":");
        const name = parts[0].trim();
        const skill = parts[1] ? parseInt(parts[1]) || 0 : 0;

        if (name) {
          const isDuplicate =
            players.some((p) => p.name.toLowerCase() === name.toLowerCase()) ||
            addedPlayers.some(
              (p) => p.name.toLowerCase() === name.toLowerCase()
            );

          if (!isDuplicate) {
            addedPlayers.push({
              id: createId(),
              name,
              skill,
              side: splitSides ? "A" : null,
            });
          } else {
            duplicateCount++;
          }
        }
      });

      if (addedPlayers.length > 0) {
        setPlayers((prev) => [...prev, ...addedPlayers]);
        showToast(`Imported ${addedPlayers.length} players`, "success");
      }

      if (duplicateCount > 0) {
        showToast(`Skipped ${duplicateCount} duplicates`, "warning");
      }
    },
    [players, splitSides]
  );

  const autoAssignSides = useCallback(() => {
    const newPlayers = [...players];

    if (assignStrategy === "random") {
      const shuffled = [...newPlayers].sort(() => Math.random() - 0.5);
      shuffled.forEach((p, i) => {
        const original = newPlayers.find((o) => o.id === p.id);
        if (original) original.side = i % 2 === 0 ? "A" : "B";
      });
    }

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

  const renderPlayerPrefix = (p: SetupPlayer) => {
    if (!splitSides) return null;
    return (
      <button
        onClick={() => togglePlayerSide(p.id)}
        className={`text-xs font-semibold px-2 py-0.5 rounded cursor-pointer mr-2 transition-colors ${
          p.side === "B"
            ? "bg-warning/20 text-warning border border-warning"
            : "bg-accent/20 text-accent border border-accent"
        }`}
      >
        {p.side === "B" ? "Pool B" : "Pool A"}
      </button>
    );
  };

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
        <span className="text-success">
          ✓ {count} ready | A: {countA} | B: {countB}
        </span>
      );
    }
    return (
      <span className="text-success">
        ✓ {count} players ready ({selectedCourts} court
        {selectedCourts > 1 ? "s" : ""})
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h2 className="text-3xl font-bold text-primary">
            Winners Court Setup
          </h2>
          <HelpButton
            title={HELP_WINNERS_INTRO.title}
            content={HELP_WINNERS_INTRO.content}
          />
        </div>
        <p className="text-secondary">
          Skill-based court promotion. Win to move up, lose to move down.
        </p>
      </div>

      {/* Notices */}
      {players.length > 0 && players.length < 4 && (
        <NoticeBar type="warning" className="mb-4">
          Need at least 4 players to start Winners Court.
        </NoticeBar>
      )}
      {splitSides &&
        players.filter((p) => p.side !== "B").length < 4 &&
        players.length >= 4 && (
          <NoticeBar type="warning" className="mb-4">
            Pool A needs at least 4 players.
          </NoticeBar>
        )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Players List */}
        <Card>
          <PlayerList
            items={sortedPlayers}
            onAdd={handleAddPlayer}
            onRemove={handleRemovePlayer}
            onClear={handleClearPlayers}
            onImport={handleImportPlayers}
            renderPrefix={renderPlayerPrefix}
            defaultView="grid"
            showViewToggle={true}
            hintText={
              <div className="flex items-center gap-2">
                <span className="text-accent">✓</span>
                {getPlayerHint()}
              </div>
            }
          />
        </Card>

        {/* Settings */}
        <Card>
          <h3 className="text-lg font-bold text-primary mb-4 pb-2 border-b border-theme">
            Settings
          </h3>

          <div className="space-y-6">
            {/* Courts */}
            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                Courts
              </label>
              <select
                className="w-full px-3 py-2 rounded-lg bg-elevated border border-theme text-primary focus:outline-none focus:border-accent transition-colors"
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
            <div className="bg-elevated p-4 rounded-xl border border-theme">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-primary">
                  Twist Mode
                </label>
                <button
                  type="button"
                  onClick={() => setIsTwist(!isTwist)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    isTwist ? "bg-accent" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      isTwist ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-muted">
                Partners swap after every round (Winners split, Losers split).
              </p>
            </div>

            {/* Split Sides Toggle */}
            <div className="bg-elevated p-4 rounded-xl border border-theme">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-primary">
                  Split Pools
                </label>
                <button
                  type="button"
                  onClick={() => setSplitSides(!splitSides)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    splitSides ? "bg-accent" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      splitSides ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-muted">Create separate A & B pools.</p>
            </div>

            {/* Pool Assignment Options */}
            {splitSides && (
              <div className="animate-fade-in space-y-3 pt-4 border-t border-theme">
                <label className="block text-xs font-bold text-muted uppercase">
                  Pool Assignment
                </label>
                <div className="flex bg-elevated p-1 rounded-lg">
                  {[
                    { value: "random", label: "Random" },
                    { value: "manual", label: "Manual" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`flex-1 text-center text-xs py-2 rounded transition-colors ${
                        assignStrategy === opt.value
                          ? "bg-accent text-white"
                          : "text-muted hover:text-primary"
                      }`}
                      onClick={() =>
                        setAssignStrategy(opt.value as AssignStrategy)
                      }
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={autoAssignSides}
                  fullWidth
                >
                  Assign Pools
                </Button>
              </div>
            )}

            <Button
              size="lg"
              disabled={players.length < 4}
              onClick={handleGenerate}
              fullWidth
              className="mt-4"
            >
              Start Session
            </Button>
          </div>
        </Card>
      </div>

      {/* Footer info */}
      <div className="mt-12 text-center text-xs text-muted opacity-50">
        Winners move towards Court 1. Losers move towards last court.
      </div>
    </div>
  );
};

export default WinnersCourtSetup;

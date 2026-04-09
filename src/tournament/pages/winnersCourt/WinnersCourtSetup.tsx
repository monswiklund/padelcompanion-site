import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { HelpButton, NoticeBar } from "@/components/ui/HelpNotice";
import { PlayerList } from "@/components/tournament/PlayerList";
import { showToast, createId } from "@/shared/utils";
import { StorageService } from "@/shared/storage";
import { useTournament, type WinnersCourtSetupDraft } from "@/context/TournamentContext";
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
  poolId: string; // "A", "B", "C", etc.
}

type AssignStrategy = "random" | "manual";

function buildSetupDraft(
  players: SetupPlayer[],
  poolCount: number,
  isTwist: boolean,
  useSkillLevels: boolean,
  courtCountInput: number | null,
  assignStrategy: AssignStrategy,
): WinnersCourtSetupDraft | null {
  const hasMeaningfulState =
    players.length > 0 ||
    poolCount !== 1 ||
    isTwist ||
    useSkillLevels ||
    courtCountInput != null ||
    assignStrategy !== "random";

  if (!hasMeaningfulState) return null;

  return {
    players,
    poolCount,
    isTwist,
    useSkillLevels,
    courtCountInput,
    assignStrategy,
  };
}

export const WinnersCourtSetup: React.FC = () => {
  const { state, dispatch, isLoaded } = useTournament();
  const navigate = useNavigate();

  const [players, setPlayers] = useState<SetupPlayer[]>([]);
  const [poolCount, setPoolCount] = useState<number>(1);
  const [isTwist, setIsTwist] = useState(false);
  const [useSkillLevels, setUseSkillLevels] = useState(false);
  const [courtCountInput, setCourtCountInput] = useState<number | null>(null);
  const [assignStrategy, setAssignStrategy] =
    useState<AssignStrategy>("random");

  useEffect(() => {
    if (!isLoaded) return;

    const draft = state.winnersCourtSetup;
    if (!draft) {
      const savedPlayers = StorageService.getItem("wc_setup_players");
      const savedPools = StorageService.getItem("wc_pool_count", "1");
      const savedSkill = StorageService.getItem("wc_use_skills", "false");
      const savedTwist = StorageService.getItem("wc_twist", "false");

      if (
        !savedPlayers &&
        savedPools === "1" &&
        savedSkill === "false" &&
        savedTwist === "false"
      ) {
        return;
      }

      const migratedPlayers = Array.isArray(savedPlayers)
        ? savedPlayers.map((p: any) => ({
            ...p,
            poolId: p.poolId || p.side || "A",
            skill: p.skill || 5,
          }))
        : [];

      setPlayers(migratedPlayers);
      setPoolCount(parseInt(savedPools) || 1);
      setUseSkillLevels(savedSkill === "true");
      setIsTwist(savedTwist === "true");

      StorageService.removeItem("wc_setup_players");
      StorageService.removeItem("wc_pool_count");
      StorageService.removeItem("wc_use_skills");
      StorageService.removeItem("wc_twist");
      return;
    }

    setPlayers(draft.players);
    setPoolCount(draft.poolCount);
    setIsTwist(draft.isTwist);
    setUseSkillLevels(draft.useSkillLevels);
    setCourtCountInput(draft.courtCountInput);
    setAssignStrategy(draft.assignStrategy);
  }, [isLoaded, state.winnersCourtSetup]);

  useEffect(() => {
    if (!isLoaded) return;
    dispatch({
      type: "SET_WINNERS_COURT_SETUP",
      winnersCourtSetup: buildSetupDraft(
        players,
        poolCount,
        isTwist,
        useSkillLevels,
        courtCountInput,
        assignStrategy,
      ),
    });
  }, [
    assignStrategy,
    courtCountInput,
    dispatch,
    isLoaded,
    isTwist,
    poolCount,
    players,
    useSkillLevels,
  ]);

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
        skill: 5,
        poolId: "A",
      };
      setPlayers((prev) => [...prev, newPlayer]);
      showToast(`${name} added`, "success");
    },
    [players],
  );

  const handleRemovePlayer = useCallback((index: number) => {
    setPlayers((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleUpdateSkill = useCallback((id: string, skill: number) => {
    const clamped = Math.max(1, Math.min(10, skill));
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, skill: clamped } : p)),
    );
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
        const skill = parts[1] ? parseInt(parts[1]) || 5 : 5;

        if (name) {
          const isDuplicate =
            players.some((p) => p.name.toLowerCase() === name.toLowerCase()) ||
            addedPlayers.some(
              (p) => p.name.toLowerCase() === name.toLowerCase(),
            );

          if (!isDuplicate) {
            addedPlayers.push({
              id: createId(),
              name,
              skill,
              poolId: "A",
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
    [players],
  );

  const poolIds = ["A", "B", "C", "D", "E", "F"];

  const autoAssignSides = useCallback(() => {
    const newPlayers = [...players];

    if (assignStrategy === "random") {
      const shuffled = [...newPlayers].sort(() => Math.random() - 0.5);
      shuffled.forEach((p, i) => {
        const original = newPlayers.find((o) => o.id === p.id);
        if (original) {
          const poolIndex = i % poolCount;
          original.poolId = poolIds[poolIndex];
        }
      });
    }

    setPlayers(newPlayers);
    
    // Toast summary
    const counts = poolIds.slice(0, poolCount).map(pid => {
        const count = newPlayers.filter(p => p.poolId === pid).length;
        return `${pid}: ${count}`;
    });
    showToast(`Assigned: ${counts.join(" / ")}`, "success");
  }, [players, assignStrategy, poolCount]);

  const togglePlayerSide = useCallback((id: string) => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const currentIdx = poolIds.indexOf(p.poolId || "A");
        const nextIdx = (currentIdx + 1) % poolCount;
        return { ...p, poolId: poolIds[nextIdx] };
      }),
    );
    setAssignStrategy("manual");
  }, [poolCount]);

  const handleGenerate = useCallback(() => {
    // If skill levels enabled, sort players by skill (desc) before generating
    let sortedPlayers = [...players];
    if (useSkillLevels) {
      sortedPlayers.sort((a, b) => b.skill - a.skill);
    }

    // Validate player counts per pool
    const courtsPerPool: Record<string, number> = {};
    let totalPlayers = 0;

    for (let i = 0; i < poolCount; i++) {
        const pid = poolIds[i];
        const poolPlayers = sortedPlayers.filter(p => p.poolId === pid);
        const count = poolPlayers.length;
        totalPlayers += count;
        
        // Calculate courts for this pool
        // If poolCount > 1, auto-calc per pool. If poolCount=1, use selectedCourts or auto.
        let cCount = 0;
        if (poolCount > 1) {
            cCount = Math.floor(count / 4);
        } else {
            cCount = selectedCourts;
        }
        
        if (count < 4 && poolCount > 1) {
             showToast(`Pool ${pid} needs at least 4 players`, "error");
             return;
        }
        courtsPerPool[pid] = cCount;
    }

    if (totalPlayers < 4) {
      showToast("Need at least 4 players to start", "error");
      return;
    }

    const wcPlayers: WCPlayer[] = sortedPlayers.map((p) => ({
      id: p.id,
      name: p.name,
      skill: p.skill,
      side: p.poolId, // Map poolId to side
    }));

    const config: WCConfig = {
      poolCount,
      courtsPerPool,
      twist: isTwist,
    };

    try {
      const wcState = generateWinnersCourt(wcPlayers, config);
      dispatch({ type: "SET_WINNERS_COURT", winnersCourtState: wcState });
      dispatch({ type: "UPDATE_FIELD", key: "roundStartedAt", value: Date.now() });
      dispatch({ type: "UPDATE_FIELD", key: "sessionStartedAt", value: Date.now() });

      const totalCourts = Object.values(courtsPerPool).reduce((a, b) => a + b, 0);
      showToast(
        `Winners Court started with ${totalCourts} court(s)`,
        "success",
      );
      navigate("/tournament/winners-court");
    } catch (e: any) {
      showToast(e.message || "Generation failed", "error");
    }
  }, [players, poolCount, selectedCourts, isTwist, useSkillLevels, dispatch, navigate]);

  const renderPlayerPrefix = (p: SetupPlayer) => {
    if (poolCount <= 1) return null;
    return (
      <button
        onClick={() => togglePlayerSide(p.id)}
        className={`text-xs font-semibold px-2 py-0.5 rounded cursor-pointer mr-2 transition-colors border ${
          p.poolId === "A" ? "bg-accent/20 text-accent border-accent" :
          p.poolId === "B" ? "bg-warning/20 text-warning border-warning" :
          "bg-muted text-muted-foreground border-border"
        }`}
      >
        Pool {p.poolId}
      </button>
    );
  };

  const renderPlayerActions = useCallback((p: SetupPlayer) => {
    if (!useSkillLevels) return null;
    return (
      <div className="flex items-center gap-1 mr-2 bg-black/20 rounded-lg px-2 py-0.5 border border-white/5">
        <span className="text-[10px] text-muted-foreground font-bold uppercase">Lvl</span>
        <input
          type="number"
          min="1"
          max="10"
          value={p.skill}
          onChange={(e) =>
            handleUpdateSkill(p.id, parseInt(e.target.value) || 5)
          }
          className="w-10 h-8 bg-transparent text-sm text-center font-bold text-accent focus:outline-none"
        />
      </div>
    );
  }, [useSkillLevels, handleUpdateSkill]);

  const sortedPlayers = poolCount > 1
    ? [...players].sort((a, b) => a.poolId.localeCompare(b.poolId))
    : players;

  const getPlayerHint = () => {
    const count = players.length;
    if (count < 4) {
      return `Add at least ${4 - count} more player${4 - count > 1 ? "s" : ""}`;
    }
    if (poolCount > 1) {
      const counts = poolIds.slice(0, poolCount).map(pid => {
          const c = players.filter(p => p.poolId === pid).length;
          return `${pid}: ${c}`;
      });
      return (
        <span className="text-success">
          ✓ {count} ready | ${counts.join(" | ")}
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
          <h2 className="text-3xl font-bold text-foreground">
            Winners Court Setup
          </h2>
          <HelpButton
            title={HELP_WINNERS_INTRO.title}
            content={HELP_WINNERS_INTRO.content}
          />
        </div>
        <p className="text-muted-foreground">
          Skill-based court promotion. Win to move up, lose to move down.
        </p>
      </div>

      {/* Notices */}
      {players.length > 0 && players.length < 4 && (
        <NoticeBar type="warning" className="mb-4">
          Need at least 4 players to start Winners Court.
        </NoticeBar>
      )}
      {poolCount > 1 &&
        players.length >= 4 &&
        Array.from({ length: poolCount }).some((_, i) => {
          const pid = ["A", "B", "C", "D", "E", "F"][i];
          return players.filter((p) => p.poolId === pid).length < 4;
        }) && (
          <NoticeBar type="warning" className="mb-4">
            Each pool needs at least 4 players.
          </NoticeBar>
        )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Players List */}
        <GlassCard>
          <PlayerList
            items={sortedPlayers}
            onAdd={handleAddPlayer}
            onRemove={handleRemovePlayer}
            onClear={handleClearPlayers}
            onImport={handleImportPlayers}
            renderPrefix={renderPlayerPrefix}
            renderActions={renderPlayerActions}
            defaultView="grid"
            showViewToggle={true}
            hintText={
              <div className="flex items-center gap-2">
                <span className="text-accent">✓</span>
                {getPlayerHint()}
              </div>
            }
          />
        </GlassCard>

        {/* Settings */}
        <GlassCard>
          <h3 className="text-lg font-bold text-foreground mb-4 pb-2 border-b border-border">
            Settings
          </h3>

          <div className="space-y-6">
            {/* Courts */}
            <div className="max-w-[140px]">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Courts
              </label>
              <select
                className="w-full px-3 py-2 rounded-lg bg-popover border border-border text-foreground focus:outline-none focus:border-accent transition-colors"
                value={selectedCourts}
                onChange={(e) => setCourtCountInput(parseInt(e.target.value))}
              >
                <option value={maxCourts}>Auto ({maxCourts})</option>
                {Array.from({ length: maxCourts }, (_, i) => i + 1).map((c) => (
                  <option key={c} value={c}>
                    {c} {c === 1 ? "Court" : "Courts"}
                  </option>
                ))}
              </select>
              <p className="text-[10px] leading-tight text-muted-foreground mt-1">
                Active matches. Extras queue.
              </p>
            </div>

            {/* Use Skill Levels Toggle */}
            <div className="bg-popover p-4 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-foreground">
                  Use Skill Levels
                </label>
                <button
                  type="button"
                  onClick={() => setUseSkillLevels(!useSkillLevels)}
                  className={`relative w-12 h-6 rounded-full transition-colors border border-border ${
                    useSkillLevels ? "bg-accent border-accent" : "bg-muted/30"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      useSkillLevels ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Rank players (1-10) to seed courts (Higher skill = Court 1).
              </p>
            </div>

            {/* Twist Mode Toggle */}
            <div className="bg-popover p-4 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-foreground">
                  Twist Mode
                </label>
                <button
                  type="button"
                  onClick={() => setIsTwist(!isTwist)}
                  className={`relative w-12 h-6 rounded-full transition-colors border border-border ${
                    isTwist ? "bg-accent border-accent" : "bg-muted/30"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      isTwist ? "translate-x-6" : ""
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Partners swap after every round (Winners split, Losers split).
              </p>
            </div>

            {/* Pools Selector */}
            <div className="bg-popover p-4 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-foreground">
                  Pools
                </label>
                <select
                  className="bg-muted px-2 py-1 rounded-lg border border-border text-foreground focus:outline-none focus:border-accent"
                  value={poolCount}
                  onChange={(e) => setPoolCount(parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} Pool{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-muted-foreground">
                Split players into separate Winners Courts (A, B, etc.).
              </p>
            </div>

            {/* Pool Assignment Options */}
            {poolCount > 1 && (
              <div className="animate-fade-in space-y-3 pt-4 border-t border-border">
                <label className="block text-xs font-bold text-muted-foreground uppercase">
                  Pool Assignment
                </label>
                <div className="flex bg-popover p-1 rounded-lg">
                  {[
                    { value: "random", label: "Random" },
                    { value: "manual", label: "Manual" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`flex-1 text-center text-xs py-2 rounded transition-colors ${
                        assignStrategy === opt.value
                          ? "bg-accent text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
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

            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                disabled={players.length < 4}
                onClick={handleGenerate}
                className="px-12"
              >
                Start Session
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Footer info */}
      <div className="mt-12 text-center text-xs text-muted-foreground opacity-50">
        Winners move towards Court 1. Losers move towards last court.
      </div>
    </div>
  );
};

export default WinnersCourtSetup;

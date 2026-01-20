import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { HelpButton, NoticeBar } from "@/components/ui/HelpNotice";
import { useTournament } from "@/context/TournamentContext";
import { showToast, cn } from "@/shared/utils";
import { HELP_BRACKET } from "@/tournament/content/help";
import {
  generateSingleBracket,
  generateMultiPoolBracket,
  generateDoubleEliminationBracket,
  applyAssignment,
  BracketTeam,
  BracketConfig,
} from "@/tournament/bracket/bracketCore";

interface SetupTeam {
  id: string;
  name: string;
  side?: string;
}

type AssignStrategy = "random" | "alternate" | "half" | "manual";
type EliminationMode = "single" | "double" | "pools";

export const BracketSetup: React.FC = () => {
  const { dispatch } = useTournament();
  const navigate = useNavigate();

  const [teams, setTeams] = useState<SetupTeam[]>([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [mode, setMode] = useState<"teams" | "players">("teams");
  const [scoreType, setScoreType] = useState<"points" | "games" | "sets">(
    "points",
  );

  const [eliminationMode, setEliminationMode] =
    useState<EliminationMode>("single");
  const [poolCount, setPoolCount] = useState(2);
  const [sharedFinal, setSharedFinal] = useState(true);
  const [assignStrategy, setAssignStrategy] =
    useState<AssignStrategy>("alternate");

  const addTeam = useCallback(() => {
    const name = newTeamName.trim();
    if (!name) return;

    if (teams.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
      showToast("Already exists", "error");
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

  const toggleTeamSide = useCallback(
    (id: string) => {
      setTeams((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          const currentSide = t.side || "A";
          const currentIndex = currentSide.charCodeAt(0) - 65;
          const nextIndex = (currentIndex + 1) % poolCount;
          return { ...t, side: String.fromCharCode(65 + nextIndex) };
        }),
      );
      setAssignStrategy("manual");
    },
    [poolCount],
  );

  const handleCreateBracket = useCallback(() => {
    if (teams.length < 2) {
      showToast("Add at least 2 teams", "error");
      return;
    }

    try {
      const config: BracketConfig = {
        scoreType,
        mode,
        eliminationType: eliminationMode === "double" ? "double" : "single",
        poolCount: eliminationMode === "pools" ? poolCount : undefined,
      };

      let finalTeams = [...teams];

      if (eliminationMode === "pools") {
        finalTeams = applyAssignment(finalTeams, assignStrategy, poolCount);
        const bracket = generateMultiPoolBracket(
          finalTeams as BracketTeam[],
          poolCount,
          sharedFinal,
        );
        dispatch({ type: "SET_BRACKET", bracket, config });
      } else if (eliminationMode === "double") {
        const bracket = generateDoubleEliminationBracket(
          finalTeams as BracketTeam[],
        );
        dispatch({ type: "SET_BRACKET", bracket, config });
      } else {
        const bracket = generateSingleBracket(finalTeams as BracketTeam[]);
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
    eliminationMode,
    poolCount,
    assignStrategy,
    sharedFinal,
    scoreType,
    mode,
    dispatch,
    navigate,
  ]);

  const getTeamHint = () => {
    const count = teams.length;
    if (count < 2) return `Add ${2 - count} more`;

    // For pools, hint about distribution
    if (eliminationMode === "pools") {
      const perPool = Math.floor(count / poolCount);
      return `${count} teams (~${perPool} per pool)`;
    }

    const nextPow2 = Math.pow(2, Math.ceil(Math.log2(count)));
    const byes = nextPow2 - count;
    return byes > 0
      ? `${count} teams (${byes} byes)`
      : `Perfect bracket (${count} teams)`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <h2 className="text-4xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Bracket Setup
          </h2>
          <HelpButton
            title={HELP_BRACKET.title}
            content={HELP_BRACKET.content}
          />
        </div>
        <p className="text-muted-foreground font-medium">
          Configure your tournament structure
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Teams Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="h-full border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {mode === "teams" ? "Teams" : "Players"}
              </h3>
              <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-bold ring-1 ring-accent/30">
                {teams.length} total
              </span>
            </div>

            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTeam()}
                placeholder={`Add ${mode === "teams" ? "team" : "player"}...`}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/50 transition-all font-medium"
              />
              <Button onClick={addTeam} className="rounded-xl px-6">
                Add
              </Button>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence initial={false}>
                {teams.map((team, index) => (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors group"
                  >
                    {eliminationMode === "pools" && (
                      <button
                        onClick={() => toggleTeamSide(team.id)}
                        className={cn(
                          "w-12 h-8 flex items-center justify-center rounded-lg text-xs font-black transition-all border",
                          team.side
                            ? "bg-accent/20 border-accent text-accent"
                            : "bg-white/5 border-white/10 text-muted-foreground",
                        )}
                      >
                        {team.side || "???"}
                      </button>
                    )}
                    <span className="text-xs font-bold text-muted-foreground/50 w-4">
                      {index + 1}
                    </span>
                    <span className="flex-1 font-bold truncate">
                      {team.name}
                    </span>
                    <button
                      className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                      onClick={() => removeTeam(team.id)}
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-8 flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-sm font-bold text-muted-foreground">
                {getTeamHint()}
              </p>
              {teams.length > 0 && (
                <button
                  onClick={clearTeams}
                  className="text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-red-400 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Configuration Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="space-y-8 border-white/5">
            <div>
              <h3 className="text-xl font-bold mb-6">Tournament Settings</h3>

              <div className="space-y-6">
                {/* Mode Selector */}
                <div className="grid grid-cols-3 gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5">
                  {(["single", "double", "pools"] as EliminationMode[]).map(
                    (m) => (
                      <button
                        key={m}
                        onClick={() => setEliminationMode(m)}
                        className={cn(
                          "py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                          eliminationMode === m
                            ? "bg-accent text-white shadow-lg shadow-accent/20"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {m}
                      </button>
                    ),
                  )}
                </div>

                {/* Sub-config for Pools */}
                <AnimatePresence mode="wait">
                  {eliminationMode === "pools" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-6 overflow-hidden"
                    >
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-bold">
                            Number of Pools
                          </label>
                          <span className="text-accent font-black">
                            {poolCount}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="2"
                          max="8"
                          step="1"
                          value={poolCount}
                          onChange={(e) =>
                            setPoolCount(parseInt(e.target.value))
                          }
                          className="w-full accent-accent"
                        />
                        <div className="flex justify-between text-[10px] font-black text-muted-foreground uppercase opacity-50">
                          <span>2 Pools</span>
                          <span>8 Pools</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col gap-2">
                          <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">
                            Strategy
                          </label>
                          <select
                            className="bg-transparent text-sm font-bold outline-none cursor-pointer"
                            value={assignStrategy}
                            onChange={(e) =>
                              setAssignStrategy(e.target.value as any)
                            }
                          >
                            <option value="random">Random</option>
                            <option value="alternate">Alternate</option>
                            <option value="half">Split Half</option>
                            <option value="manual">Manual</option>
                          </select>
                        </div>
                        {poolCount === 2 && (
                          <button
                            onClick={() => setSharedFinal(!sharedFinal)}
                            className={cn(
                              "p-4 rounded-2xl border transition-all flex flex-col gap-2 text-left",
                              sharedFinal
                                ? "bg-accent/10 border-accent/30"
                                : "bg-white/5 border-white/5",
                            )}
                          >
                            <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">
                              Grand Final
                            </label>
                            <span className="text-sm font-bold">
                              {sharedFinal ? "Winners meet" : "Independent"}
                            </span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col gap-2">
                    <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">
                      Type
                    </label>
                    <select
                      className="bg-transparent text-sm font-bold outline-none cursor-pointer"
                      value={mode}
                      onChange={(e) => setMode(e.target.value as any)}
                    >
                      <option value="teams">Teams</option>
                      <option value="players">Players</option>
                    </select>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col gap-2">
                    <label className="text-xs font-black uppercase text-muted-foreground tracking-widest">
                      Score
                    </label>
                    <select
                      className="bg-transparent text-sm font-bold outline-none cursor-pointer"
                      value={scoreType}
                      onChange={(e) => setScoreType(e.target.value as any)}
                    >
                      <option value="points">Points</option>
                      <option value="games">Games</option>
                      <option value="sets">Sets</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              disabled={teams.length < 2}
              onClick={handleCreateBracket}
              fullWidth
              className="py-6 rounded-2xl text-lg font-black shadow-xl shadow-accent/20"
            >
              Start Tournament
            </Button>

            {eliminationMode === "double" && (
              <NoticeBar type="info">
                Double elimination creates a Winners and a Losers bracket. Teams
                are eliminated only after 2 losses.
              </NoticeBar>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default BracketSetup;

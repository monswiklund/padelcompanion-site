import React, { useState, useCallback, useMemo, useEffect } from "react";
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

export const BracketSetup: React.FC = () => {
  const { dispatch } = useTournament();
  const navigate = useNavigate();

  const [teams, setTeams] = useState<SetupTeam[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bracket-teams");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [newTeamName, setNewTeamName] = useState("");
  const [mode, setMode] = useState<"teams" | "players">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("bracket-mode") as "teams" | "players") || "teams";
    }
    return "teams";
  });
  const [scoreType, setScoreType] = useState<"points" | "games" | "sets">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("bracket-scoreType") as "points" | "games" | "sets") || "points";
    }
    return "points";
  });

  const [usePools, setUsePools] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("bracket-usePools") === "true";
    }
    return false;
  });
  const [useDoubleElimination, setUseDoubleElimination] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("bracket-useDoubleElimination") === "true";
    }
    return false;
  });
  const [poolCount, setPoolCount] = useState(() => {
    if (typeof window !== "undefined") {
      return Math.max(2, parseInt(localStorage.getItem("bracket-poolCount") || "2", 10));
    }
    return 2;
  });
  const [sharedFinal, setSharedFinal] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("bracket-sharedFinal") !== "false";
    }
    return true;
  });
  const [assignStrategy, setAssignStrategy] =
    useState<AssignStrategy>(() => {
      if (typeof window !== "undefined") {
        return (localStorage.getItem("bracket-assignStrategy") as AssignStrategy) || "alternate";
      }
      return "alternate";
    });
  const [sortedTeams, setSortedTeams] = useState<SetupTeam[]>([]);

  useEffect(() => {
    if (usePools) {
      if (sortedTeams.length === 0 && teams.length > 0) {
        setSortedTeams(teams);
      }
      if (poolCount < 2) {
        setPoolCount(2);
      }
    }
  }, [usePools, teams, sortedTeams.length]);

  useEffect(() => {
    if (!usePools) {
      setSortedTeams([]);
    }
  }, [usePools]);

  useEffect(() => {
    localStorage.setItem("bracket-teams", JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem("bracket-mode", mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem("bracket-scoreType", scoreType);
  }, [scoreType]);

  useEffect(() => {
    localStorage.setItem("bracket-usePools", usePools.toString());
  }, [usePools]);

  useEffect(() => {
    localStorage.setItem("bracket-useDoubleElimination", useDoubleElimination.toString());
  }, [useDoubleElimination]);

  useEffect(() => {
    localStorage.setItem("bracket-poolCount", poolCount.toString());
  }, [poolCount]);

  useEffect(() => {
    localStorage.setItem("bracket-sharedFinal", sharedFinal.toString());
  }, [sharedFinal]);

  useEffect(() => {
    localStorage.setItem("bracket-assignStrategy", assignStrategy);
  }, [assignStrategy]);

  const sortTeams = useCallback(() => {
    setSortedTeams(
      [...teams].sort((a, b) => {
        const sideA = a.side || "Z";
        const sideB = b.side || "Z";
        if (sideA !== sideB) return sideA.localeCompare(sideB);
        return 0;
      })
    );
  }, [teams]);

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
    if (usePools) {
      setSortedTeams((prev) => [...prev, newTeam]);
    }
    setNewTeamName("");
  }, [newTeamName, teams, usePools]);

  const removeTeam = useCallback((id: string) => {
    setTeams((prev) => prev.filter((t) => t.id !== id));
    setSortedTeams((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearTeams = useCallback(() => {
    setTeams([]);
    setSortedTeams([]);
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
      setSortedTeams((prev) =>
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
        eliminationType: useDoubleElimination ? "double" : "single",
        poolCount: usePools ? poolCount : undefined,
      };

      let finalTeams = [...teams];

      if (usePools && useDoubleElimination) {
        finalTeams = applyAssignment(finalTeams, assignStrategy, poolCount);
        const bracket = generateMultiPoolBracket(
          finalTeams as BracketTeam[],
          poolCount,
          sharedFinal,
          true,
        );
        dispatch({ type: "SET_BRACKET", bracket, config });
      } else if (usePools) {
        finalTeams = applyAssignment(finalTeams, assignStrategy, poolCount);
        const bracket = generateMultiPoolBracket(
          finalTeams as BracketTeam[],
          poolCount,
          sharedFinal,
          false,
        );
        dispatch({ type: "SET_BRACKET", bracket, config });
      } else if (useDoubleElimination) {
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
    usePools,
    useDoubleElimination,
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
    if (usePools) {
      const perPool = Math.floor(count / poolCount);
      return `${count} teams (~${perPool} per pool)`;
    }

    const nextPow2 = Math.pow(2, Math.ceil(Math.log2(count)));
    const byes = nextPow2 - count;
    return byes > 0
      ? `${count} teams (${byes} byes)`
      : `Perfect bracket (${count} teams)`;
  };

  const getPoolCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (let i = 0; i < poolCount; i++) {
      const label = String.fromCharCode(65 + i);
      counts[label] = teams.filter((t) => t.side === label).length;
    }
    return counts;
  }, [teams, poolCount]);

  const getPoolColor = (label: string) => {
    switch (label) {
      case "A":
        return "bg-black/40 border-pool-a text-pool-a";
      case "B":
        return "bg-black/40 border-pool-b text-pool-b";
      case "C":
        return "bg-black/40 border-pool-c text-pool-c";
      case "D":
        return "bg-black/40 border-pool-d text-pool-d";
      case "E":
        return "bg-black/40 border-pool-e text-pool-e";
      case "F":
        return "bg-black/40 border-pool-f text-pool-f";
      case "G":
        return "bg-black/40 border-pool-g text-pool-g";
      case "H":
        return "bg-black/40 border-pool-h text-pool-h";
      default:
        return "bg-white/5 border-white/10 text-muted-foreground";
    }
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
          <GlassCard className="border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                Teams
              </h3>
              <div className="flex items-center gap-3">
                {usePools && poolCount > 1 && (
                  <div className="flex gap-1">
                    {Array.from({ length: poolCount }, (_, i) => {
                      const label = String.fromCharCode(65 + i);
                      const count = getPoolCounts[label];
                      return (
                        <span
                          key={label}
                          className={cn(
                            "px-2 py-1 rounded text-xs font-black",
                            count > 0
                              ? getPoolColor(label)
                              : "bg-white/5 text-muted-foreground"
                          )}
                        >
                          {label}: {count}
                        </span>
                      );
                    })}
                  </div>
                )}
                <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-bold ring-1 ring-accent/30">
                  {teams.length} total
                </span>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTeam()}
                placeholder="Add team..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/50 transition-all font-medium"
              />
              <Button onClick={addTeam} className="rounded-xl px-6">
                Add
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 custom-scrollbar">
              <AnimatePresence initial={false}>
                {(usePools ? sortedTeams : teams).map((team, index) => (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center gap-2 px-2 py-1.5 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors group"
                  >
                    {usePools && poolCount > 1 && (
                      <button
                        type="button"
                        onClick={() => toggleTeamSide(team.id)}
                        className={cn(
                          "w-8 h-7 flex items-center justify-center rounded text-xs font-black transition-all border shrink-0 cursor-pointer",
                          team.side
                            ? getPoolColor(team.side)
                            : "bg-white/5 border-white/10 text-muted-foreground",
                        )}
                      >
                        {team.side || "?"}
                      </button>
                    )}
                    <span className="text-xs font-bold text-muted-foreground/50 w-3 shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium truncate">
                      {team.name}
                    </span>
                    <button
                      className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-red-400 hover:bg-red-400/10 rounded transition-all shrink-0 ml-auto"
                      onClick={() => removeTeam(team.id)}
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-4 flex justify-between items-center bg-white/5 px-3 py-2 rounded-xl border border-white/5">
              <p className="text-sm font-bold text-muted-foreground">
                {getTeamHint()}
              </p>
              {teams.length > 0 && (
                <div className="flex gap-3">
                  {usePools && poolCount > 1 && (
                    <button
                      onClick={sortTeams}
                      className="text-xs font-black uppercase tracking-wider text-accent hover:text-accent/70 transition-colors"
                    >
                      Sort
                    </button>
                  )}
                  <button
                    onClick={clearTeams}
                    className="text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-red-400 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
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
                {/* Settings Toggles */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setUsePools(!usePools)}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all flex flex-col gap-2 text-left",
                      usePools
                        ? "bg-accent/10 border-accent shadow-lg shadow-accent/20"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    )}
                  >
                    <span className="text-xs font-black uppercase text-muted-foreground tracking-widest">
                      Pools
                    </span>
                    <span className="text-sm font-bold">
                      {usePools ? "Enabled" : "Disabled"}
                    </span>
                  </button>
                  <button
                    onClick={() => setUseDoubleElimination(!useDoubleElimination)}
                    className={cn(
                      "p-4 rounded-2xl border-2 transition-all flex flex-col gap-2 text-left",
                      useDoubleElimination
                        ? "bg-error/10 border-error shadow-lg shadow-error/20"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    )}
                  >
                    <span className="text-xs font-black uppercase text-muted-foreground tracking-widest">
                      Losers Bracket
                    </span>
                    <span className="text-sm font-bold">
                      {useDoubleElimination ? "Enabled" : "Disabled"}
                    </span>
                  </button>
                </div>

                {/* Sub-config for Pools */}
                <AnimatePresence mode="wait">
                  {usePools && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-6 overflow-hidden"
                    >
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <label className="text-sm font-bold block mb-3">
                          Number of Pools
                        </label>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setPoolCount(Math.max(2, poolCount - 1))}
                            disabled={poolCount <= 2}
                            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-lg font-black hover:bg-accent/20 hover:border-accent/30 hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:border-white/10 disabled:hover:text-foreground transition-all"
                          >
                            -
                          </button>
                          <span className="text-accent font-black text-xl w-6 text-center">
                            {poolCount}
                          </span>
                          <button
                            onClick={() => setPoolCount(Math.min(8, poolCount + 1))}
                            disabled={poolCount >= 8}
                            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-lg font-black hover:bg-accent/20 hover:border-accent/30 hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:border-white/10 disabled:hover:text-foreground transition-all"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {poolCount > 1 && (
                          <div className={cn(
                            "bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col gap-2",
                            poolCount === 2 ? "col-span-2" : ""
                          )}>
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
                        )}
                        {poolCount >= 2 && poolCount > 1 && (
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
                              {sharedFinal ? "Shared" : "Independent"}
                            </span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 gap-4">
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

            {useDoubleElimination && (
              <NoticeBar type="info">
                Losers Bracket - Teams continue playing after losing and can still win the tournament!
              </NoticeBar>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default BracketSetup;

import React, { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { HelpButton, NoticeBar } from "@/components/ui/HelpNotice";
import { PlayerList } from "@/components/tournament/PlayerList";
import { showToast, createId } from "@/shared/utils";
import { useTournament } from "@/context/TournamentContext";
import { DIVISION_COLORS } from "../../core/constants";
import { generateDivisionSchedule } from "../../scoring/divisionGenerator";
import {
  getCourtDisplayName,
  syncDivisionCourtNames,
} from "../../ui/courtNames";

interface DivisionTeam {
  id: string;
  name: string;
  lockedCourt?: number | null;
  divisionId?: string;
}

interface DivisionSetupProps {
  onGameActive: () => void;
}

type DivisionEntryMode = "teamName" | "playerPair";

const HELP_DIVISION = {
  title: "Division",
  content:
    "Round-robin league format. All teams in the same division play each other. Win = 3pts, Draw = 1pt, Loss = 0pts. Games (points scored) are tracked for tiebreakers.",
};

export const DivisionSetup: React.FC<DivisionSetupProps> = ({
  onGameActive,
}) => {
  const { state, dispatch, isLoaded } = useTournament() as any;
  const { players, courts } = state;
  const [entryMode, setEntryMode] = useState<DivisionEntryMode>("teamName");
  const [teamNameInput, setTeamNameInput] = useState("");
  const [playerOneInput, setPlayerOneInput] = useState("");
  const [playerTwoInput, setPlayerTwoInput] = useState("");

  // Ensure format is set to division when this page mounts (but only after loaded)
  useEffect(() => {
    if (isLoaded && state.format !== "division") {
      dispatch({ type: "UPDATE_FIELD", key: "format", value: "division" });
    }
  }, [isLoaded]);

  useEffect(() => {
    const syncedNames = syncDivisionCourtNames(
      state.divisions || [],
      state.divisionCourtNames
    );

    if (
      JSON.stringify(syncedNames) !==
      JSON.stringify(state.divisionCourtNames || {})
    ) {
      dispatch({
        type: "UPDATE_FIELD",
        key: "divisionCourtNames",
        value: syncedNames,
      });
    }
  }, [dispatch, players, state.divisionCourtNames, state.divisions]);

  const buildTeamMembers = (name: string) =>
    name
      .split("/")
      .map((part) => part.trim())
      .filter(Boolean);

  const getTeamDuplicateKey = (name: string) => {
    const members = buildTeamMembers(name);
    if (members.length < 2) {
      return name.trim().toLowerCase();
    }

    return members
      .map((member) => member.toLowerCase())
      .sort((a, b) => a.localeCompare(b))
      .join("::");
  };

  const addDivisionTeam = (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return false;

    const existingTeamKeys = new Set(
      players.map((player: any) => getTeamDuplicateKey(player.name)),
    );

    if (existingTeamKeys.has(getTeamDuplicateKey(trimmedName))) {
      showToast("Team already exists", "error");
      return false;
    }

    const newTeam: DivisionTeam = {
      id: createId(),
      name: trimmedName,
      lockedCourt: null,
      divisionId: state.divisions?.[0]?.id || "default",
    };
    dispatch({ type: "ADD_PLAYER", player: newTeam });
    showToast(`${trimmedName} added`, "success");
    return true;
  };

  const handleAddTeam = (name: string) => {
    addDivisionTeam(name);
  };

  const handleAddPlayerPair = () => {
    const playerOne = playerOneInput.trim();
    const playerTwo = playerTwoInput.trim();

    if (!playerOne || !playerTwo) {
      showToast("Add both players to create a team", "warning");
      return;
    }

    const didAdd = addDivisionTeam(`${playerOne} / ${playerTwo}`);
    if (!didAdd) return;

    setPlayerOneInput("");
    setPlayerTwoInput("");
  };

  const parseImportedTeams = (text: string) => {
    const addedTeams: DivisionTeam[] = [];
    let duplicateCount = 0;
    let invalidCount = 0;
    let extraNameCount = 0;

    const queuedNames = new Set(
      players.map((player: any) => getTeamDuplicateKey(player.name)),
    );

    const queueTeam = (teamName: string) => {
      const normalized = getTeamDuplicateKey(teamName);
      if (queuedNames.has(normalized)) {
        duplicateCount++;
        return;
      }

      queuedNames.add(normalized);
      addedTeams.push({
        id: createId(),
        name: teamName,
        lockedCourt: null,
        divisionId: state.divisions?.[0]?.id || "default",
      });
    };

    if (entryMode === "teamName") {
      text.split("\n").forEach((line) => {
        const raw = line.trim();
        if (!raw) return;
        queueTeam(raw);
      });
    } else {
      const pendingSingles: string[] = [];

      text.split("\n").forEach((line) => {
        const raw = line.trim();
        if (!raw) return;

        const hasStructuredSeparators = /[\/,;&+|\t]/.test(raw);
        if (!hasStructuredSeparators) {
          pendingSingles.push(raw);
          return;
        }

        const members = raw
          .split(/\s*(?:\/|,|;|&|\||\t)\s*|\s+\+\s+/)
          .map((part) => part.trim())
          .filter(Boolean);

        if (members.length < 2) {
          invalidCount++;
          return;
        }

        for (let idx = 0; idx + 1 < members.length; idx += 2) {
          queueTeam(`${members[idx]} / ${members[idx + 1]}`);
        }

        if (members.length % 2 !== 0) {
          extraNameCount++;
        }
      });

      for (let idx = 0; idx + 1 < pendingSingles.length; idx += 2) {
        queueTeam(`${pendingSingles[idx]} / ${pendingSingles[idx + 1]}`);
      }

      if (pendingSingles.length % 2 !== 0) {
        invalidCount++;
      }
    }

    if (addedTeams.length > 0) {
      dispatch({
        type: "SET_STATE",
        payload: { players: [...players, ...addedTeams] },
      });
      showToast(`Imported ${addedTeams.length} teams`, "success");
    }

    if (duplicateCount > 0) {
      showToast(`Skipped ${duplicateCount} duplicates`, "warning");
    }

    if (invalidCount > 0) {
      showToast(
        `Skipped ${invalidCount} incomplete team rows`,
        "warning",
      );
    }

    if (extraNameCount > 0) {
      showToast(
        `Skipped ${extraNameCount} unpaired names from pasted rows`,
        "warning",
      );
    }
  };

  const handleGenerate = async () => {
    // Count teams per division
    const divCounts = new Map<string, number>();
    players.forEach((p: any) => {
      const div = (p as any).divisionId || state.divisions?.[0]?.id || "default";
      divCounts.set(div, (divCounts.get(div) || 0) + 1);
    });

    // Each division needs at least 2 teams
    for (const [div, count] of divCounts.entries()) {
      if (count < 2) {
        showToast(`Division ${div} needs at least 2 teams`, "error");
        return;
      }
    }

    if (players.length < 3) {
      showToast("Need at least 3 teams total", "error");
      return;
    }

    try {
      const generatedSchedule = generateDivisionSchedule({
        players,
        divisions: state.divisions || [],
      });

      const leaderboard = players.map((player: any, index: number) => ({
        id: player.id,
        name: player.name,
        division: player.division,
        divisionId: player.divisionId,
        points: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        matchPoints: 0,
        played: 0,
        pointsLost: 0,
        byeCount: 0,
        playedWith: [],
        previousRank: index + 1,
      }));

      // Calculate total courts based on divisions
      // Calculate total courts based on divisions
      const totalCourts = state.divisions ? state.divisions.reduce((sum: number, d: any) => sum + Math.max(1, d.courts), 0) : 2;

      dispatch({
        type: "SET_STATE",
        payload: {
          format: "division",
          courts: totalCourts,
          timer: {
            duration: state.pointsPerMatch,
            remainingSeconds: state.pointsPerMatch * 60,
            isRunning: false,
            status: "idle",
          },
          schedule: generatedSchedule.length > 0 ? [...generatedSchedule] : [],
          leaderboard,
          allRounds: generatedSchedule.length > 0 ? [...generatedSchedule] : null,
          currentRound: generatedSchedule.length > 0 ? 1 : 0,
          isLocked: generatedSchedule.length > 0,
          roundStartedAt: null,
          sessionStartedAt: Date.now(),
        },
      });

      if (generatedSchedule.length > 0) {
        onGameActive();
      }
    } catch (e: any) {
      showToast(e.message || "Generation failed", "error");
    }
  };

  const divisionCourts = state.divisionCourts || 2;
  const tiebreaker = state.tiebreaker || "difference";
  const divisionCourtNames = state.divisionCourtNames || {};
  // Use stable selectors for display order
  const activeDivisions = (state.divisions || []).sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)).map((d: any) => d.name);

  const [movingPlayerId, setMovingPlayerId] = useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h2 className="text-3xl font-bold text-foreground">
            Division Setup
          </h2>
          <HelpButton
            title={HELP_DIVISION.title}
            content={HELP_DIVISION.content}
          />
        </div>
        <p className="text-muted-foreground">
          Add teams and assign them to divisions. All teams in the same division
          will play each other.
        </p>
      </div>

      {/* Notices */}
      {players.length > 0 && players.length < 3 && (
        <NoticeBar type="warning" className="mb-4">
          Need at least 3 teams to start a division tournament.
        </NoticeBar>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teams Section */}
        <GlassCard>
          <PlayerList
            title="Teams"
            singularTitle="Team"
            items={players}
            onAdd={handleAddTeam}
            onRemove={(idx) => {
              dispatch({ type: "REMOVE_PLAYER", playerId: players[idx].id });
            }}
            onClear={() => dispatch({ type: "CLEAR_PLAYERS" })}
            onImport={parseImportedTeams}
            importTitle={
              entryMode === "teamName" ? "Import team names" : "Import player pairs"
            }
            importDescription={
              entryMode === "teamName" ? (
                <div className="space-y-1">
                  <p>Paste one team per line.</p>
                  <p className="text-xs">Example: <span className="text-foreground">Lag 1</span></p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p>Paste teams as either two names on one row or one player per line.</p>
                  <p className="text-xs">
                    Examples:
                    <span className="text-foreground"> Anna / Lisa</span>,
                    <span className="text-foreground"> Anna, Lisa</span>,
                    <span className="text-foreground"> Anna[TAB]Lisa</span>,
                    or lines like
                    <span className="text-foreground"> Anna</span> then
                    <span className="text-foreground"> Lisa</span>.
                  </p>
                </div>
              )
            }
            importPlaceholder={
              entryMode === "teamName"
                ? "Lag 1\nLag 2\nLag 3"
                : "Anna / Lisa\nMaja / Elin\n\nor:\nAnna\nLisa\nMaja\nElin"
            }
            renderInput={
              <div className="space-y-3">
                <div className="inline-flex rounded-xl border border-border bg-popover p-1">
                  {[
                    { id: "teamName", label: "Team Names" },
                    { id: "playerPair", label: "Players / Team" },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setEntryMode(option.id as DivisionEntryMode)}
                      className={`px-3 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-colors ${
                        entryMode === option.id
                          ? "bg-accent text-white"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {entryMode === "teamName" ? (
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-4 pr-20 py-3 rounded-xl bg-popover border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-sm"
                      placeholder="Add team name..."
                      value={teamNameInput}
                      onChange={(e) => setTeamNameInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const didAdd = addDivisionTeam(teamNameInput);
                          if (didAdd) setTeamNameInput("");
                        }
                      }}
                    />
                    <button
                      className="absolute right-1 top-1 bottom-1 px-4 bg-accent hover:bg-accent-dark text-white font-medium rounded-lg transition-colors disabled:opacity-0 disabled:pointer-events-none text-sm"
                      onClick={() => {
                        const didAdd = addDivisionTeam(teamNameInput);
                        if (didAdd) setTeamNameInput("");
                      }}
                      disabled={!teamNameInput.trim()}
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-popover border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-sm"
                      placeholder="Player 1"
                      value={playerOneInput}
                      onChange={(e) => setPlayerOneInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddPlayerPair();
                        }
                      }}
                    />
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-popover border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-sm"
                      placeholder="Player 2"
                      value={playerTwoInput}
                      onChange={(e) => setPlayerTwoInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddPlayerPair();
                        }
                      }}
                    />
                    <button
                      className="px-4 py-3 bg-accent hover:bg-accent-dark text-white font-medium rounded-xl transition-colors text-sm"
                      onClick={handleAddPlayerPair}
                      disabled={!playerOneInput.trim() || !playerTwoInput.trim()}
                    >
                      Add Team
                    </button>
                  </div>
                )}
              </div>
            }
            hintText={
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-success">✓</span>
                <span>
                  {players.length} teams
                  {entryMode === "playerPair" ? " (built from player pairs)" : ""}
                </span>
              </div>
            }
          />
        </GlassCard>

        {/* Config Section */}
        <div className="space-y-6">
          <GlassCard>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
              Division Settings
            </h4>
            <div className="divide-y divide-white/[0.06]">
              {/* Total Courts (Derived) */}
              <div className="flex items-center justify-between gap-3 py-3">
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground">Total Courts</span>
                  <span className="text-xs text-muted-foreground ml-1.5">(Derived from divisions)</span>
                </div>
                <div className="text-center font-bold text-foreground px-4 py-2 bg-popover rounded-xl border border-border">
                  {state.divisions ? state.divisions.reduce((acc: number, d: any) => acc + Math.max(1, d.courts), 0) : 2}
                </div>
              </div>

              {/* Scoring Mode */}
              <div className="flex items-center justify-between gap-3 py-3">
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground">Scoring</span>
                  <span className="text-xs text-muted-foreground ml-1.5">(Win condition)</span>
                </div>
                <select
                  className="px-3 py-2.5 rounded-lg bg-popover border border-border text-foreground focus:outline-none focus:border-accent transition-colors text-sm"
                  value={state.scoringMode}
                  onChange={(e) => {
                    const mode = e.target.value;
                    dispatch({ type: "UPDATE_FIELD", key: "scoringMode", value: mode });
                    const presets: Record<string, number> = { total: 24, race: 14, time: 15 };
                    if (presets[mode]) {
                      dispatch({ type: "UPDATE_FIELD", key: "pointsPerMatch", value: presets[mode] });
                    }
                  }}
                >
                  <option value="total">Total Points</option>
                  <option value="race">Race to</option>
                  <option value="time">Timed</option>
                </select>
              </div>

              {/* Points/Time */}
              <div className="flex items-center justify-between gap-3 py-3">
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground">
                    {state.scoringMode === "time" ? "Minutes" : state.scoringMode === "race" ? "Race to" : "Total Points"}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1.5">
                    ({state.scoringMode === "time" ? "Duration" : "Target score"})
                  </span>
                </div>
                <div className="flex items-center bg-popover rounded-xl border border-border overflow-hidden">
                  <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center text-lg font-bold text-accent hover:bg-accent/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    disabled={state.pointsPerMatch <= 4}
                    onClick={() => dispatch({ type: "UPDATE_FIELD", key: "pointsPerMatch", value: state.pointsPerMatch - (state.scoringMode === "time" ? 1 : 2) })}
                  >
                    −
                  </button>
                  <div className="w-10 text-center font-bold text-foreground">{state.pointsPerMatch}</div>
                  <button
                    type="button"
                    className="w-10 h-10 flex items-center justify-center text-lg font-bold text-accent hover:bg-accent/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    disabled={state.pointsPerMatch >= 50}
                    onClick={() => dispatch({ type: "UPDATE_FIELD", key: "pointsPerMatch", value: state.pointsPerMatch + (state.scoringMode === "time" ? 1 : 2) })}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Tiebreaker */}
              <div className="flex items-center justify-between gap-3 py-3">
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground">Tiebreaker</span>
                  <span className="text-xs text-muted-foreground ml-1.5">(When points are equal)</span>
                </div>
                <select
                  className="px-3 py-2.5 rounded-lg bg-popover border border-border text-foreground focus:outline-none focus:border-accent transition-colors text-sm"
                  value={tiebreaker}
                  onChange={(e) => dispatch({ type: "UPDATE_FIELD", key: "tiebreaker", value: e.target.value })}
                >
                  <option value="difference">Game Difference</option>
                  <option value="most_won">Most Games Won</option>
                  <option value="shared">Shared (Equal)</option>
                </select>
              </div>
            </div>

            <Button
              size="lg"
              disabled={players.length < 3}
              onClick={handleGenerate}
              fullWidth
              className="mt-6"
            >
              Generate Schedule
            </Button>
          </GlassCard>
        </div>
      </div>

      {/* Divisions & Assignments (Full Width) */}
      <div className="mt-6">
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Divisions & Assignments
            </h4>
            <button
              type="button"
              className="text-xs font-bold text-accent hover:text-accent-dark transition-colors px-3 py-1 bg-accent/10 rounded-lg"
              onClick={() => {
                const newDiv = {
                  id: createId(),
                  name: String.fromCharCode(65 + (state.divisions?.length || 0)),
                  courts: 2,
                  order: state.divisions?.length || 0
                };
                dispatch({
                  type: "UPDATE_FIELD",
                  key: "divisions",
                  value: [...(state.divisions || []), newDiv]
                });
              }}
            >
              + Add Division
            </button>
          </div>

          {state.isLocked && (
            <div className="mb-6">
              <NoticeBar type={state.format === "division" ? "info" : "warning"}>
                Tournament is active. Division order and court counts are locked to ensure schedule consistency.
              </NoticeBar>
            </div>
          )}

          {(() => {
            const count = state.divisions?.length || 0;
            let gridClasses = "grid gap-6 items-start ";
            
            if (count === 1) {
              gridClasses += "grid-cols-1 max-w-2xl mx-auto";
            } else if (count === 2 || count === 4) {
              gridClasses += "grid-cols-1 md:grid-cols-2";
            } else if (count === 3 || count === 6) {
              gridClasses += "grid-cols-1 md:grid-cols-3";
            } else {
              gridClasses += "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
            }

            return (
              <div className={gridClasses}>
                {state.divisions?.map((division: any, index: number) => {
                const colors = DIVISION_COLORS[index % DIVISION_COLORS.length];
                const divPlayers = players
                  .map((p: any, pIdx: number) => ({ ...p, originalIndex: pIdx }))
                  .filter((p: any) => p.divisionId === division.id);
                
                return (
                  <div key={division.id} className={`rounded-xl border ${colors.border} ${colors.bg} flex flex-col overflow-hidden`}>
                    {/* Header: Reorder / Rename / Delete / Courts */}
                    <div className={`${colors.headerBg} p-3 border-b ${colors.border} flex flex-wrap items-center gap-3 justify-between transition-colors`}>
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="flex flex-col gap-0.5 mr-1">
                          <button 
                            title={state.isLocked ? "Cannot reorder during active tournament" : "Move Up"}
                            className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                            disabled={index === 0 || state.isLocked}
                            onClick={() => {
                              if (state.isLocked) return;
                              const divs = [...state.divisions];
                              [divs[index - 1], divs[index]] = [divs[index], divs[index - 1]];
                              divs.forEach((d, i) => d.order = i);
                              dispatch({ type: "UPDATE_FIELD", key: "divisions", value: divs });
                            }}
                          >▲</button>
                          <button 
                            title={state.isLocked ? "Cannot reorder during active tournament" : "Move Down"}
                            className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                            disabled={index === (state.divisions?.length || 1) - 1 || state.isLocked}
                            onClick={() => {
                              if (state.isLocked) return;
                              const divs = [...state.divisions];
                              [divs[index], divs[index + 1]] = [divs[index + 1], divs[index]];
                              divs.forEach((d, i) => d.order = i);
                              dispatch({ type: "UPDATE_FIELD", key: "divisions", value: divs });
                            }}
                          >▼</button>
                        </div>
                        <input
                          type="text"
                          className={`font-bold text-lg bg-transparent border-b border-transparent hover:border-border focus:border-accent focus:outline-none transition-colors max-w-[120px] ${colors.text} truncate`}
                          value={division.name}
                          onChange={(e) => {
                            if (state.isLocked) return; // Handler-level guard
                            
                            const newName = e.target.value;
                            const oldName = state.divisions[index].name;
                            const divs = [...state.divisions];
                            const oldId = divs[index].id;
                            divs[index] = { ...divs[index], name: newName };
                            
                            // 1. Sync custom court names key
                            const newCourtNames = { ...state.divisionCourtNames };
                            if (newCourtNames[oldName]) {
                              newCourtNames[newName] = newCourtNames[oldName];
                              delete newCourtNames[oldName];
                            }
                            
                            // 2. Sync player display labels
                            const newPlayers = state.players.map((p: any) => 
                              p.divisionId === oldId ? { ...p, division: newName } : p
                            );
                            
                            dispatch({ type: "SET_STATE", payload: { 
                              divisions: divs,
                              players: newPlayers,
                              divisionCourtNames: newCourtNames
                            }});
                          }}
                        />
                      </div>
                      
                      <div className="flex items-center gap-2 border-border/50 pt-0">
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <span className="text-muted-foreground font-medium">Courts:</span>
                          <div className="flex items-center bg-background rounded-lg border border-border overflow-hidden h-8">
                            <button
                              type="button"
                              title={state.isLocked ? "Locked during tournament" : "Decrease Courts"}
                              className="w-8 flex items-center justify-center font-bold text-accent hover:bg-accent/10 disabled:opacity-30 transition-colors"
                              disabled={division.courts <= 1 || state.isLocked}
                              onClick={() => {
                                if (state.isLocked) return;
                                const divs = [...state.divisions];
                                divs[index] = { ...divs[index], courts: divs[index].courts - 1 };
                                dispatch({ type: "UPDATE_FIELD", key: "divisions", value: divs });
                              }}
                            >−</button>
                            <div className="w-8 text-center font-bold">{division.courts}</div>
                            <button
                              type="button"
                              title={state.isLocked ? "Locked during tournament" : "Increase Courts"}
                              className="w-8 flex items-center justify-center font-bold text-accent hover:bg-accent/10 disabled:opacity-30 transition-colors"
                              disabled={state.isLocked}
                              onClick={() => {
                                if (state.isLocked) return;
                                const divs = [...state.divisions];
                                divs[index] = { ...divs[index], courts: divs[index].courts + 1 };
                                dispatch({ type: "UPDATE_FIELD", key: "divisions", value: divs });
                              }}
                            >+</button>
                          </div>
                        </div>

                        <button 
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-30 border border-transparent hover:border-red-500/30"
                          title={state.isLocked ? "Cannot delete division during active tournament" : divPlayers.length > 0 ? "Cannot delete division with teams" : state.divisions.length <= 1 ? "Minimum 1 division required" : "Delete Division"}
                          disabled={divPlayers.length > 0 || state.divisions.length <= 1 || state.isLocked}
                          onClick={() => {
                            if (state.isLocked) return;
                            if (divPlayers.length > 0) return;
                            if (state.divisions.length <= 1) return;

                            if (confirm(`Remove division ${division.name}?`)) {
                              const oldName = division.name;
                              const divs = state.divisions.filter((d: any) => d.id !== division.id);
                              divs.forEach((d: any, i: number) => d.order = i);
                              
                              // Cleanup custom names
                              const newCourtNames = { ...state.divisionCourtNames };
                              delete newCourtNames[oldName];
                              
                              dispatch({
                                type: "SET_STATE",
                                payload: { 
                                  divisions: divs,
                                  divisionCourtNames: newCourtNames
                                },
                              });
                            }
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Teams in this division */}
                    <div className="p-3 bg-background/30 relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-muted-foreground">Assigned Teams ({divPlayers.length})</span>
                      </div>
                      
                      {divPlayers.length === 0 ? (
                        <div className="flex items-center justify-center p-4 rounded-lg border border-dashed border-border/50">
                           <p className="text-xs text-muted-foreground/60 italic">No teams assigned yet</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {divPlayers.map((p: any) => {
                            const otherDivs = state.divisions.filter((d: any) => d.id !== division.id);
                            const isMenuOpen = movingPlayerId === p.id;
                            
                            return (
                              <div key={p.id} className="flex items-center justify-between gap-3 py-1.5 px-3 rounded-lg hover:bg-white/[0.03] transition-colors group relative">
                                <span className="text-sm font-medium text-foreground truncate flex-1 min-w-0">
                                  {p.name}
                                </span>
                                
                                <div className="flex gap-1 flex-shrink-0 items-center">
                                  {otherDivs.length <= 3 ? (
                                    /* Traditional Buttons for few divisions */
                                    otherDivs.map((targetDiv: any) => {
                                      const targetIndex = state.divisions.findIndex((dd: any) => dd.id === targetDiv.id);
                                      const tc = DIVISION_COLORS[targetIndex % DIVISION_COLORS.length];
                                      return (
                                        <button
                                          key={targetDiv.id}
                                          type="button"
                                          className={`px-2 py-1 text-[10px] font-bold rounded border ${tc.border} ${tc.text} ${tc.bg} hover:bg-background transition-colors`}
                                          title={`Move to ${targetDiv.name}`}
                                          onClick={() => {
                                            const newPlayers = [...players];
                                            newPlayers[p.originalIndex] = { 
                                              ...newPlayers[p.originalIndex], 
                                              divisionId: targetDiv.id,
                                              division: targetDiv.name // Sync display cache
                                            } as any;
                                            dispatch({ type: "SET_STATE", payload: { players: newPlayers } });
                                          }}
                                        >
                                          → {targetDiv.name}
                                        </button>
                                      );
                                    })
                                  ) : (
                                    /* Compact Menu for many divisions */
                                    <div className="relative">
                                      <button
                                        type="button"
                                        className={`w-7 h-7 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors ${isMenuOpen ? 'bg-accent/20 border-accent text-accent' : ''}`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setMovingPlayerId(isMenuOpen ? null : p.id);
                                        }}
                                        title="Move to division..."
                                      >
                                        →
                                      </button>
                                      
                                      {isMenuOpen && (
                                        <>
                                          <div 
                                            className="fixed inset-0 z-[60]" 
                                            onClick={() => setMovingPlayerId(null)}
                                          />
                                          <div className="absolute right-0 top-full mt-1 z-[70] p-2 rounded-xl bg-white dark:bg-black border border-border shadow-2xl min-w-[140px] animate-in fade-in zoom-in-95 duration-100">
                                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-muted-foreground/60 mb-2 px-1">Move {p.name} to:</p>
                                            <div className="grid grid-cols-2 gap-1.5">
                                              {otherDivs.map((targetDiv: any) => {
                                                const targetIndex = state.divisions.findIndex((dd: any) => dd.id === targetDiv.id);
                                                const tc = DIVISION_COLORS[targetIndex % DIVISION_COLORS.length];
                                                return (
                                                  <button
                                                    key={targetDiv.id}
                                                    type="button"
                                                    className={`px-3 py-2 text-[10px] font-bold rounded-lg border ${tc.border} ${tc.bg} ${tc.text} hover:opacity-80 transition-opacity text-center whitespace-nowrap`}
                                                    onClick={() => {
                                                      const newPlayers = [...players];
                                                      newPlayers[p.originalIndex] = { 
                                                        ...newPlayers[p.originalIndex], 
                                                        divisionId: targetDiv.id,
                                                        division: targetDiv.name // Sync display cache
                                                      } as any;
                                                      dispatch({ type: "SET_STATE", payload: { players: newPlayers } });
                                                      setMovingPlayerId(null);
                                                    }}
                                                  >
                                                    {targetDiv.name}
                                                  </button>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              </div>
            );
          })()}
        </GlassCard>
      </div>
    </div>
  );
};

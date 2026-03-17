import React, { useMemo, useState } from "react";
import { useTournament } from "@/context/TournamentContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Bracket,
  DualBracket,
  SingleBracket,
  BracketMatch,
  updateMatchResult,
} from "@/tournament/bracket/bracketCore";
import { BracketScoreModal } from "./BracketScoreModal";
import { cn } from "@/shared/utils";

// ============ BRACKET TREE LOGIC ============

interface TreeNode {
  match: BracketMatch;
  children: TreeNode[]; // Children are the *previous* matches that feed into this one
}

function buildBracketTree(matches: BracketMatch[]): TreeNode[] {
  const matchMap = new Map<number, BracketMatch>();
  matches.forEach((m) => matchMap.set(m.id, m));

  const nodes = new Map<number, TreeNode>();

  // Create all nodes
  matches.forEach((m) => {
    nodes.set(m.id, { match: m, children: [] });
  });

  // Link children
  const roots: TreeNode[] = [];
  matches.forEach((m) => {
    const node = nodes.get(m.id)!;
    // If I am a previous match for someone, I am their child in this reverse-tree
    if (m.nextMatchId) {
      const parent = nodes.get(m.nextMatchId);
      if (parent) {
        // We need to insert in order (team1 source, team2 source)
        // Check if I am prev1 or prev2
        if (parent.match.prevMatch1Id === m.id) {
          parent.children[0] = node;
        } else {
          parent.children[1] = node;
        }
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
}

// ============ COMPONENTS ============

interface MatchProps {
  match: BracketMatch;
  onClick: (matchId: number) => void;
  className?: string;
  poolColor?: { border: string; bg: string; text: string } | null;
}

const MatchCard: React.FC<MatchProps> = ({ match, onClick, className, poolColor }) => {
  const isEditable = match.team1 || match.team2;
  const isPlayed = match.score1 !== null && match.score2 !== null;
  const hasTwoTeams = match.team1 && match.team2;
  const isReadyToPlay = hasTwoTeams && !isPlayed;
  const loser = isPlayed
    ? match.winner?.id === match.team1?.id
      ? match.team2
      : match.team1
    : null;

  const accentColor = poolColor ? poolColor.border : "border-accent";

  return (
    <GlassCard
      padding="sm"
      variant={isEditable ? "hover" : "default"}
      className={cn(
        "w-48 min-w-[12rem] cursor-pointer relative z-10 border-2",
        isReadyToPlay ? accentColor : "border-white/60",
        className
      )}
      onClick={() => isEditable && onClick(match.id)}
    >
      {/* Team 1 */}
      <div className={cn(
        "flex justify-between items-center mb-1 px-2 py-1 rounded",
        match.winner?.id === match.team1?.id ? "bg-success/20" : "",
        loser?.id === match.team1?.id ? "opacity-40" : ""
      )}>
        <span
          className={cn(
            "text-sm font-medium truncate flex-1 mr-2",
            match.winner?.id === match.team1?.id
              ? "text-success font-bold"
              : "text-foreground",
            loser?.id === match.team1?.id ? "line-through" : ""
          )}
        >
          {match.team1?.name || "TBD"}
        </span>
        <span className="text-sm font-mono bg-black/40 px-1.5 rounded text-blue-400 font-bold">
          {match.score1 ?? "-"}
        </span>
      </div>

      {/* Team 2 */}
      <div className={cn(
        "flex justify-between items-center px-2 py-1 rounded",
        match.winner?.id === match.team2?.id ? "bg-success/20" : "",
        loser?.id === match.team2?.id ? "opacity-40" : ""
      )}>
        <span
          className={cn(
            "text-sm font-medium truncate flex-1 mr-2",
            match.winner?.id === match.team2?.id
              ? "text-success font-bold"
              : "text-foreground",
            loser?.id === match.team2?.id ? "line-through" : ""
          )}
        >
          {match.team2?.name || "TBD"}
        </span>
        <span className="text-sm font-mono bg-black/40 px-1.5 rounded text-blue-400 font-bold">
          {match.score2 ?? "-"}
        </span>
      </div>
      
      {/* Round Label (Optional, floating above) */}
       <div className="absolute -top-3 left-2 px-1.5 bg-background text-[10px] text-muted-foreground uppercase tracking-wider border border-border rounded shadow-sm">
         Round {match.round}
       </div>
    </GlassCard>
  );
};

interface BracketNodeProps {
  node: TreeNode;
  onMatchClick: (id: number) => void;
  poolColor?: { border: string; bg: string; text: string } | null;
}

const BracketNode: React.FC<BracketNodeProps> = ({ node, onMatchClick, poolColor }) => {
  const hasChildren = node.children.length > 0;
  
  return (
    <div className="flex items-center">
      {/* Recursively render children (Previous Rounds) to the LEFT */}
      {hasChildren && (
        <div className="flex flex-col justify-center mr-8 relative">
           {/* Connector Line Vertical */}
           <div className="absolute right-[-2rem] top-1/2 bottom-1/2 w-[2rem] border-r-2 border-border/30 transform -translate-y-1/2" />
          
          {node.children.map((child, index) => (
             child ? (
                <div key={child.match.id} className="flex items-center my-4 relative">
                   <BracketNode node={child} onMatchClick={onMatchClick} poolColor={poolColor} />
                   
                   {/* Connector Line Horizontal from Child to Parent */}
                   <div className={cn(
                      "absolute left-full w-6 h-0.5 bg-white/40",
                      
                    )} />
                </div>
             ) : (
                // Bye placeholder
                 <div key={`bye-${index}`} className="w-48 h-20 my-4" />
             )
          ))}
          
          <div className="absolute right-[-1rem] top-[25%] bottom-[25%] w-0.5 bg-white/40" />
          <div className="absolute right-[-1rem] top-1/2 w-6 h-0.5 bg-white/40" />
        </div>
      )}

      {/* The Match Itself */}
      <MatchCard match={node.match} onClick={onMatchClick} poolColor={poolColor} />
    </div>
  );
};

// Simplified Recursive Renderer that flows LEFT to RIGHT (Standard)
// Wait, the tree built above has Final as Root.
// If we render Root, we render Final.
// Its children are Semis.
// If we flex-row, Final is on Left, Semis on Right. That's backwards for standard brackets.
// Standard: Round 1 (Left) -> Final (Right).
// So getting `roots` (Finals) and displaying them at the end.
// We need to render the tree `flex-row-reverse`.

const StandardBracketTree: React.FC<{ root: TreeNode; onMatchClick: (id: number) => void; poolColor?: { border: string; bg: string; text: string } | null }> = ({
  root,
  onMatchClick,
  poolColor,
}) => {
  return (
    <div className="flex flex-row-reverse items-center">
      {/* Root (Final) */}
      <MatchCard match={root.match} onClick={onMatchClick} poolColor={poolColor} />

      {/* Children (Previous Rounds) */}
      {root.children.length > 0 && (
        <div className="flex flex-col justify-center mr-6 relative"> {/* mr (margin right) pushes children away to left */}
           <div className="absolute right-[-1.5rem] top-[25%] bottom-[25%] w-0.5 bg-white/40 border-r border-white/20" />
           
           {/* Horizontal line to Parent */}
           <div className="absolute right-[-1.5rem] top-1/2 w-6 h-0.5 bg-white/40" />
           
           {root.children.map((child, idx) => (
             child ? (
               <div key={child.match.id} className="relative py-4 pr-6"> {/* pr-6 space for connector */}
                 <StandardBracketTree root={child} onMatchClick={onMatchClick} poolColor={poolColor} />
                 {/* Horizontal line from Child to Vertical Bar */}
                 <div className="absolute right-0 top-1/2 w-6 h-0.5 bg-white/40" />
               </div>
             ) : (
                <div key={`bye-${idx}`} className="w-48 h-24 invisible" />
             )
           ))}
        </div>
      )}
    </div>
  );
};

// ... Wait, recursive `flex-row-reverse` nesting might get deep. 
// A flattened column view is safer for responsive scrolling.
// But let's try this for "Phase 3 Modernization".

const RecursiveBracket: React.FC<{ root: TreeNode; onMatchClick: (n: number) => void; poolColor?: { border: string; bg: string; text: string } | null }> = ({ root, onMatchClick, poolColor }) => {
    return (
        <div className="flex items-center">
             {root.children.length > 0 && (
                 <div className="flex flex-col justify-center mr-8 relative">
                     {/* Connectors */}
                     {/* Vertical Line spanning children centers */}
                     <div className="absolute right-[-1rem] top-[25%] bottom-[25%] w-0.5 bg-white/40" />
                     {/* Horizontal Line to Self */}
                     <div className="absolute right-[-1rem] top-1/2 w-6 h-0.5 bg-white/40" />
                     
                     {root.children.map((child, i) => (
                         child ? (
                             <div key={child.match.id} className="relative my-4 pr-4">
                                 <RecursiveBracket root={child} onMatchClick={onMatchClick} poolColor={poolColor} />
                                 {/* Line from Child to Vertical */}
                                 <div className="absolute right-0 top-1/2 w-6 h-0.5 bg-white/40" />
                             </div>
                         ) : (
                           // Just strict spacing
                           <div key={`bye-${i}`} className="my-4 h-[5.5rem] w-48 invisible" />
                         )
                     ))}
                 </div>
             )}
             <MatchCard match={root.match} onClick={onMatchClick} poolColor={poolColor} />
        </div>
    );
};

// ... 

export const BracketView: React.FC = () => {
  const { state, dispatch } = useTournament();
  const navigate = useNavigate();
  const [selectedMatchId, setSelectedMatchId] = React.useState<number | null>(null);

  const bracket = state.bracket;
  
  const handleMatchClick = (id: number) => setSelectedMatchId(id);
  const handleClear = () => dispatch({ type: "CLEAR_BRACKET" });
  
  const handleScoreSave = (s1: number, s2: number) => {
    if (!selectedMatchId || !bracket) return;
    const updated = updateMatchResult(bracket, selectedMatchId, s1, s2);
    dispatch({ type: "SET_BRACKET", bracket: updated });
    setSelectedMatchId(null);
  }

  const [poolLayout, setPoolLayout] = useState<"vertical" | "horizontal" | "grid">("vertical");
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const isMultiPool = (bracket as any)?.isMultiPool;
  const isMultiPoolDoubleElimination = (bracket as any)?.isMultiPoolDoubleElimination;
  const isDoubleElimination = (bracket as any)?.isDoubleElimination || isMultiPoolDoubleElimination;
  const poolCount = isMultiPool || isMultiPoolDoubleElimination ? (bracket as any).pools?.length || 0 : 0;

  interface Standing {
    rank: number;
    name: string;
    wins: number;
    losses: number;
    pointsFor: number;
    pointsAgainst: number;
    pool?: string;
    currentRound: number;
  }

  const leaderboard = useMemo(() => {
    if (!bracket) return [];
    
    const teamsMap = new Map<string, Standing>();
    const addTeam = (name: string, pool?: string) => {
      if (!teamsMap.has(name)) {
        teamsMap.set(name, { rank: 0, name, wins: 0, losses: 0, pointsFor: 0, pointsAgainst: 0, pool, currentRound: 0 });
      }
    };

    const getAllMatches = () => {
      if ((bracket as any).isMultiPool) {
        return (bracket as any).pools.flatMap((p: any) => {
          const poolLabel = p.name?.replace("Pool ", "") || "A";
          p.matches.forEach((m: BracketMatch) => {
            if (m.team1) m.team1.side = poolLabel;
            if (m.team2) m.team2.side = poolLabel;
          });
          return p.matches;
        });
      }
      if ((bracket as any).isMultiPoolDoubleElimination) {
        return (bracket as any).pools.flatMap((p: any) => {
          const poolLabel = p.name?.replace("Pool ", "") || "A";
          p.matches.forEach((m: BracketMatch) => {
            if (m.team1) m.team1.side = poolLabel;
            if (m.team2) m.team2.side = poolLabel;
          });
          return p.matches;
        });
      }
      if (bracket.isDualBracket) {
        return [...(bracket as any).matchesA, ...(bracket as any).matchesB];
      }
      if ((bracket as any).isDoubleElimination) {
        return [...(bracket as any).winnersMatches, ...(bracket as any).losersMatches];
      }
      return (bracket as any).matches;
    };

    const matches = getAllMatches();
    
    matches.forEach((m: BracketMatch) => {
      if (m.team1 && m.team2 && m.score1 !== null && m.score2 !== null) {
        addTeam(m.team1.name, m.team1.side);
        addTeam(m.team2.name, m.team2.side);
        
        const t1 = teamsMap.get(m.team1.name)!;
        const t2 = teamsMap.get(m.team2.name)!;
        
        t1.pointsFor += m.score1;
        t1.pointsAgainst += m.score2;
        t2.pointsFor += m.score2;
        t2.pointsAgainst += m.score1;
        
        if (m.score1 > m.score2) {
          t1.wins++;
          t2.losses++;
        } else {
          t2.wins++;
          t1.losses++;
        }
      }
    });

    const standings = Array.from(teamsMap.values())
      .filter(t => t.wins + t.losses > 0)
      .sort((a, b) => {
        if (a.wins !== b.wins) return b.wins - a.wins;
        return (b.pointsFor - b.pointsAgainst) - (a.pointsFor - a.pointsAgainst);
      })
      .map((t, i) => ({ ...t, rank: i + 1 }));

    return standings;
  }, [bracket]);

  const getPoolColor = (label: string) => {
    switch (label) {
      case "A":
        return { border: "border-pool-a/50", bg: "bg-pool-a/20", text: "text-pool-a" };
      case "B":
        return { border: "border-pool-b/50", bg: "bg-pool-b/20", text: "text-pool-b" };
      case "C":
        return { border: "border-pool-c/50", bg: "bg-pool-c/20", text: "text-pool-c" };
      case "D":
        return { border: "border-pool-d/50", bg: "bg-pool-d/20", text: "text-pool-d" };
      case "E":
        return { border: "border-pool-e/50", bg: "bg-pool-e/20", text: "text-pool-e" };
      case "F":
        return { border: "border-pool-f/50", bg: "bg-pool-f/20", text: "text-pool-f" };
      case "G":
        return { border: "border-pool-g/50", bg: "bg-pool-g/20", text: "text-pool-g" };
      case "H":
        return { border: "border-pool-h/50", bg: "bg-pool-h/20", text: "text-pool-h" };
      default:
        return { border: "border-white/20", bg: "", text: "" };
    }
  };

  // Build Trees
  const trees = useMemo(() => {
    if (!bracket) return [];
    
    if ((bracket as any).isMultiPool) {
      const multi = bracket as any; // MultiBracket
      if (multi.grandFinal) {
        // Find all matches including grand final
        const allMatches = [...multi.pools.flatMap((p: any) => p.matches), multi.grandFinal];
        return buildBracketTree(allMatches).map((tree, idx) => ({
          ...tree,
          poolLabel: multi.pools[idx]?.name?.replace("Pool ", "") || "A"
        }));
      } else {
        // Multiple independent trees
        return multi.pools.flatMap((p: any, idx: number) => 
          buildBracketTree(p.matches).map(tree => ({
            ...tree,
            poolLabel: p.name?.replace("Pool ", "") || String.fromCharCode(65 + idx)
          }))
        );
      }
    }

    if ((bracket as any).isMultiPoolDoubleElimination) {
      const multi = bracket as any;
      if (multi.grandFinal) {
        const allMatches = [...multi.pools.flatMap((p: any) => p.matches), multi.grandFinal];
        return buildBracketTree(allMatches).map((tree, idx) => ({
          ...tree,
          poolLabel: multi.pools[idx]?.name?.replace("Pool ", "") || "A"
        }));
      } else {
        return multi.pools.flatMap((p: any, idx: number) => 
          buildBracketTree(p.matches).map(tree => ({
            ...tree,
            poolLabel: p.name?.replace("Pool ", "") || String.fromCharCode(65 + idx)
          }))
        );
      }
    }

    if (bracket.isDualBracket) {
      const dual = bracket as DualBracket;
      if (dual.grandFinal) {
          const allMatches = [...dual.matchesA, ...dual.matchesB, dual.grandFinal];
          return buildBracketTree(allMatches); 
      } else {
        // Two separate trees
        return [
            ...buildBracketTree(dual.matchesA),
            ...buildBracketTree(dual.matchesB)
        ];
      }
    } 
    
    if ((bracket as any).isDoubleElimination) {
       const de = bracket as any;
       // Include all matches so buildBracketTree links them into one grand tree
       const allMatches = [...de.winnersMatches, ...de.losersMatches, de.grandFinal];
       return buildBracketTree(allMatches);
    }

    const single = bracket as SingleBracket;
    return buildBracketTree(single.matches);
  }, [bracket]);

  // Build Losers Trees (separate from winners)
  const losersTrees = useMemo(() => {
    if (!bracket) return [];
    const de = bracket as any;
    if (de.isDoubleElimination || de.isMultiPoolDoubleElimination) {
      return buildBracketTree(de.losersMatches || []);
    }
    return [];
  }, [bracket]);

  if (!bracket) return <div />; 

  const selectedMatch = useMemo(() => {
      if(!selectedMatchId) return null;
      
      let all: BracketMatch[] = [];
      if ((bracket as any).isMultiPool) {
        const multi = bracket as any;
        all = [...multi.pools.flatMap((p: any) => p.matches)];
        if (multi.grandFinal) all.push(multi.grandFinal);
      } else if (bracket.isDualBracket) {
        const dual = bracket as DualBracket;
        all = [...dual.matchesA, ...dual.matchesB];
        if (dual.grandFinal) all.push(dual.grandFinal);
      } else if ((bracket as any).isDoubleElimination) {
        const de = bracket as any;
        all = [...de.winnersMatches, ...de.losersMatches, de.grandFinal];
      } else {
        all = (bracket as SingleBracket).matches;
      }
      
      return all.find(m => m.id === selectedMatchId) || null;
  }, [bracket, selectedMatchId]);

  return (
    <div className="min-h-screen py-8 overflow-x-auto bg-background">
      <div className="text-center mb-8 px-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-accent bg-clip-text text-transparent mb-2">
           Tournament Bracket
        </h2>
        <div className="flex justify-center gap-4 mt-6">
           {isMultiPool && (
             <div className="flex gap-2 bg-white/5 p-1 rounded-lg">
               {(["vertical", "horizontal", "grid"] as const).map((layout) => (
                 <button
                   key={layout}
                   onClick={() => setPoolLayout(layout)}
                   className={cn(
                     "px-3 py-1 text-xs font-bold rounded transition-all capitalize",
                     poolLayout === layout
                       ? "bg-accent text-white"
                       : "text-muted-foreground hover:text-foreground"
                   )}
                 >
                   {layout}
                 </button>
               ))}
             </div>
            )}
            <Button 
              variant={showLeaderboard ? "primary" : "secondary"} 
              size="sm" 
              onClick={() => setShowLeaderboard(!showLeaderboard)}
            >
              Leaderboard
            </Button>
            <Button variant="secondary" size="sm" onClick={() => window.print()}>Print</Button>
            <Button variant="danger" size="sm" onClick={handleClear}>Reset Tournament</Button>
         </div>
       </div>

      {showLeaderboard && leaderboard.length > 0 && (
        <div className="px-4 pb-8">
          <GlassCard className="max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-4 text-center">Leaderboard</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-7 gap-2 text-xs font-black text-muted-foreground uppercase px-4">
                <div>#</div>
                <div className="col-span-2">Team</div>
                <div className="text-center">Pool</div>
                <div className="text-center">W</div>
                <div className="text-center">L</div>
                <div className="text-right">+/-</div>
              </div>
              {leaderboard.map((team) => (
                <div key={team.name} className="grid grid-cols-7 gap-2 items-center px-4 py-2 bg-white/5 rounded-lg">
                  <div className={cn(
                    "text-lg font-black",
                    team.rank === 1 ? "text-yellow-400" :
                    team.rank === 2 ? "text-gray-300" :
                    team.rank === 3 ? "text-amber-600" : "text-muted-foreground"
                  )}>{team.rank}</div>
                  <div className="col-span-2 font-bold truncate">{team.name}</div>
                  <div className="flex justify-center">
                    {team.pool && (
                      <span className={cn(
                        "px-2 py-0.5 rounded text-xs font-black",
                        getPoolColor(team.pool).bg,
                        getPoolColor(team.pool).border,
                        getPoolColor(team.pool).text
                      )}>
                        {team.pool}
                      </span>
                    )}
                  </div>
                  <div className="text-center text-success font-bold">{team.wins}</div>
                  <div className="text-center text-error font-bold">{team.losses}</div>
                  <div className="text-right font-mono text-sm">
                    {team.pointsFor - team.pointsAgainst > 0 ? "+" : ""}{team.pointsFor - team.pointsAgainst}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      <div className={cn(
        "px-8 pb-20 gap-8",
        isMultiPool && poolLayout === "horizontal" ? "flex flex-row items-start justify-center" :
        isMultiPool && poolLayout === "grid" ? "grid grid-cols-2 gap-8" :
        "flex flex-col items-center"
      )}>
        {/* Winners Bracket */}
        {trees.map((root, i) => {
          const poolColors = isMultiPool && (root as any).poolLabel 
            ? getPoolColor((root as any).poolLabel) 
            : isDoubleElimination ? { border: "border-accent/50", bg: "bg-accent/20", text: "text-accent" } : null;
          return (
            <div key={`w-${root.match.id}`} className="flex flex-col items-center">
              {isMultiPool && poolColors && (
                <div className={cn(
                  "px-4 py-1 rounded-full text-xs font-black mb-4 border",
                  (poolColors as any).bg,
                  (poolColors as any).border,
                  (poolColors as any).text
                )}>
                  Pool {(root as any).poolLabel || "A"}
                </div>
              )}
              {isDoubleElimination && i === 0 && (
                <div className="px-4 py-1 rounded-full text-xs font-black mb-4 border bg-accent/20 border-accent/50 text-accent">
                  Winners Bracket
                </div>
              )}
              <div className={cn(
                poolColors ? `border-2 ${(poolColors as any).border} rounded-2xl p-4` : ""
              )}>
                <RecursiveBracket root={root} onMatchClick={handleMatchClick} poolColor={poolColors} />
              </div>
            </div>
          );
        })}

        {/* Losers Bracket - only for double elimination */}
        {isDoubleElimination && (
          <div className="flex flex-col items-center">
            <div className="px-4 py-1 rounded-full text-xs font-black mb-4 border bg-error/20 border-error/50 text-error">
              Losers Bracket
            </div>
            <div className="border-2 border-error/50 rounded-2xl p-4">
              {losersTrees.length > 0 ? (
                losersTrees.slice(0, 1).map((root) => (
                  <RecursiveBracket 
                    key={`l-${root.match.id}`} 
                    root={root} 
                    onMatchClick={handleMatchClick} 
                    poolColor={{ border: "border-error/50", bg: "bg-error/20", text: "text-error" }} 
                  />
                ))
              ) : (
                <div className="text-sm text-muted-foreground py-8 px-4">
                  Losers bracket matches will appear here as teams lose
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedMatch && (
        <BracketScoreModal 
           match={selectedMatch} 
           onClose={() => setSelectedMatchId(null)}
           onSave={handleScoreSave}
        />
      )}
    </div>
  );
};

export default BracketView;

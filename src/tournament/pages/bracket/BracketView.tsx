import React, { useMemo } from "react";
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
}

const MatchCard: React.FC<MatchProps> = ({ match, onClick, className }) => {
  const isEditable = match.team1 || match.team2;
  const isPlayed = match.score1 !== null && match.score2 !== null;

  return (
    <GlassCard
      padding="sm"
      variant={isEditable ? "hover" : "default"}
      className={cn(
        "w-48 min-w-[12rem] cursor-pointer relative z-10", // z-10 to stay above connectors
        isPlayed ? "border-accent/40 bg-accent/5" : "",
        className
      )}
      onClick={() => isEditable && onClick(match.id)}
    >
      {/* Team 1 */}
      <div className="flex justify-between items-center mb-2">
        <span
          className={cn(
            "text-sm font-medium truncate flex-1 mr-2",
            match.winner?.id === match.team1?.id
              ? "text-success font-bold"
              : "text-foreground"
          )}
        >
          {match.team1?.name || "TBD"}
        </span>
        <span className="text-sm font-mono bg-black/20 px-1.5 rounded text-blue-400">
          {match.score1 ?? "-"}
        </span>
      </div>

      {/* Team 2 */}
      <div className="flex justify-between items-center">
        <span
          className={cn(
            "text-sm font-medium truncate flex-1 mr-2",
            match.winner?.id === match.team2?.id
              ? "text-success font-bold"
              : "text-foreground"
          )}
        >
          {match.team2?.name || "TBD"}
        </span>
        <span className="text-sm font-mono bg-black/20 px-1.5 rounded text-blue-400">
          {match.score2 ?? "-"}
        </span>
      </div>
      
      {/* Round Label (Optional, floating above) */}
       <div className="absolute -top-3 left-2 px-1.5 bg-background text-[10px] text-muted-foreground uppercase tracking-wider border border-border rounded shadow-sm">
         R{match.round}
       </div>
    </GlassCard>
  );
};

interface BracketNodeProps {
  node: TreeNode;
  onMatchClick: (id: number) => void;
}

const BracketNode: React.FC<BracketNodeProps> = ({ node, onMatchClick }) => {
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
                   <BracketNode node={child} onMatchClick={onMatchClick} />
                   
                   {/* Connector Line Horizontal from Child to Parent */}
                   {/* We need complex SVG or CSS lines here. 
                       Simple approach: 
                       - Horizontal line from child to 'center'.
                       - Parent has horizontal line from 'center' to itself.
                       - Vertical line connects them. 
                   */}
                   <div className={cn(
                     "absolute left-full w-4 h-px bg-border/50",
                     
                   )} />
                </div>
             ) : (
                // Bye placeholder
                 <div key={`bye-${index}`} className="w-48 h-20 my-4" />
             )
          ))}
          
           {/* Paint the connector lines via absolute positioning on the wrapper if possible. 
               Tree layout with flexbox makes standard CSS bracket lines tricky without fixed heights.
               Let's trust the 'flex items-center' aligns them horizontally.
               Vertical line connecting children:
           */}
           <div className="absolute right-[-1rem] top-[25%] bottom-[25%] w-px bg-border/50" />
           {/* Horizontal from vertical to parent */}
           <div className="absolute right-[-1rem] top-1/2 w-4 h-px bg-border/50" />
        </div>
      )}

      {/* The Match Itself */}
      <MatchCard match={node.match} onClick={onMatchClick} />
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

const StandardBracketTree: React.FC<{ root: TreeNode; onMatchClick: (id: number) => void }> = ({
  root,
  onMatchClick,
}) => {
  return (
    <div className="flex flex-row-reverse items-center">
      {/* Root (Final) */}
      <MatchCard match={root.match} onClick={onMatchClick} />

      {/* Children (Previous Rounds) */}
      {root.children.length > 0 && (
        <div className="flex flex-col justify-center mr-6 relative"> <!-- mr (margin right) pushes children away to left -->
           {/* We need to clear margin logic. Flex-row-reverse: 
              [Final] <--- [Semis] <--- [Quarters]
           */}
           
           {/* Connector System for this node's inputs */}
           {/* Vertical Bar connecting the children's outputs */}
           <div className="absolute right-[-1.5rem] top-[25%] bottom-[25%] w-px bg-border/50 border-r border-border/30" />
           
           {/* Horizontal line to Parent */}
           <div className="absolute right-[-1.5rem] top-1/2 w-6 h-px bg-border/50" />
           
           {root.children.map((child, idx) => (
             child ? (
               <div key={child.match.id} className="relative py-4 pr-6"> {/* pr-6 space for connector */}
                 <StandardBracketTree root={child} onMatchClick={onMatchClick} />
                 {/* Horizontal line from Child to Vertical Bar */}
                 <div className="absolute right-0 top-1/2 w-6 h-px bg-border/50" />
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

const RecursiveBracket: React.FC<{ root: TreeNode; onMatchClick: (n: number) => void }> = ({ root, onMatchClick }) => {
    // We want visual order: Round 1 -> Final.
    // The Tree is Final -> Round 1.
    // So if we render `flex-row-reverse` at the TOP level?
    // Let's implement a component that recurses but produces the layout:
    // <Sources> <Connector> <Self>
    
    // To do this recursively:
    // <Node> returns:
    // <div flex row>
    //    <div col> <Node(child1) /> <Node(child2) /> </div>
    //    <Connector />
    //    <MatchCard />
    // </div>
    // This renders Left-to-Right naturally if we start from Root and say "Children go Left".
    // So `flex-row` but children are *inserted before* match.
    
    return (
        <div className="flex items-center">
             {root.children.length > 0 && (
                 <div className="flex flex-col justify-center mr-8 relative">
                     {/* Connectors */}
                     {/* Vertical Line spanning children centers */}
                     <div className="absolute right-[-1rem] top-[25%] bottom-[25%] w-px bg-border/50" />
                     {/* Horizontal Line to Self */}
                     <div className="absolute right-[-1rem] top-1/2 w-4 h-px bg-border/50" />
                     
                     {root.children.map((child, i) => (
                         child ? (
                             <div key={child.match.id} className="relative my-4 pr-4">
                                 <RecursiveBracket root={child} onMatchClick={onMatchClick} />
                                 {/* Line from Child to Vertical */}
                                 <div className="absolute right-0 top-1/2 w-4 h-px bg-border/50" />
                             </div>
                         ) : (
                           // Just strict spacing
                           <div key={`bye-${i}`} className="my-4 h-[5.5rem] w-48 invisible" />
                         )
                     ))}
                 </div>
             )}
             <MatchCard match={root.match} onClick={onMatchClick} />
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

  // Build Trees
  const trees = useMemo(() => {
    if (!bracket) return [];
    
    if ((bracket as any).isMultiPool) {
      const multi = bracket as any; // MultiBracket
      if (multi.grandFinal) {
        // Find all matches including grand final
        const allMatches = [...multi.pools.flatMap((p: any) => p.matches), multi.grandFinal];
        return buildBracketTree(allMatches);
      } else {
        // Multiple independent trees
        return multi.pools.flatMap((p: any) => buildBracketTree(p.matches));
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
           <Button variant="secondary" size="sm" onClick={() => window.print()}>Print</Button>
           <Button variant="danger" size="sm" onClick={handleClear}>Reset Tournament</Button>
        </div>
      </div>

      <div className="px-8 pb-20 flex flex-col items-center gap-16">
        {trees.map((root, i) => (
           <div key={root.match.id} className="flex">
               {/* Label for Dual Bracket Pools if needed */}
               <RecursiveBracket root={root} onMatchClick={handleMatchClick} />
           </div>
        ))}
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

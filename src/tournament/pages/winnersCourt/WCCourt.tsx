import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/shared/utils";
import { motion } from "framer-motion";

interface WCCourtProps {
  court: {
    id: number;
    team1: { name: string }[];
    team2: { name: string }[];
    winner: 1 | 2 | null;
  };
  twist: boolean;
  round: number;
  onSelectWinner?: (winner: 1 | 2) => void;
  readOnly?: boolean;
}

export const WCCourt: React.FC<WCCourtProps> = ({
  court,
  twist,
  round,
  onSelectWinner,
  readOnly = false,
}) => {
  const isComplete = court.winner != null;
  const canSelect = !readOnly;

  const getTeamClasses = (teamNum: 1 | 2) => {
    const isWinner = court.winner === teamNum;
    const isLoser = court.winner !== null && court.winner !== teamNum;

    return cn(
      "flex-1 p-4 rounded-xl text-center transition-all duration-300 relative overflow-hidden group border",
      canSelect && !isComplete
        ? "cursor-pointer hover:bg-white/5 hover:border-white/20 hover:shadow-lg hover:-translate-y-0.5"
        : "",
      canSelect && isComplete && !isWinner && !isLoser
        ? "cursor-pointer hover:bg-white/5"
        : "", // When complete but re-selecting?
      // Winner State
      isWinner &&
        "bg-success/10 border-success/50 shadow-[0_0_15px_rgba(34,197,94,0.15)]",
      // Loser State
      isLoser && "opacity-60 bg-black/20 border-transparent grayscale-[0.5]",
      // Default
      !isWinner && !isLoser && "bg-card border-border",
    );
  };

  return (
    <GlassCard
      padding="none"
      className={cn(
        "overflow-visible",
        isComplete && "border-accent/20 bg-accent/5",
      )}
    >
      {/* Header */}
      <div className="px-4 py-2 bg-black/20 border-b border-white/5 text-xs font-bold uppercase tracking-wider flex justify-between items-center text-muted-foreground">
        <span>Court {court.id}</span>
        {isComplete && (
          <span className="text-success flex items-center gap-1">
            ✓ Complete
          </span>
        )}
      </div>

      <div className="p-4 flex items-stretch gap-4">
        {/* Team 1 */}
        <motion.div
          whileTap={canSelect ? { scale: 0.98 } : undefined}
          className={getTeamClasses(1)}
          onClick={() => canSelect && onSelectWinner?.(1)}
        >
          {court.winner === 1 && (
            <div className="absolute top-1 right-2 text-success text-xs font-bold">
              WINNER
            </div>
          )}

          <div className="space-y-1">
            {court.team1.map((p, i) => (
              <div
                key={i}
                className="font-semibold text-foreground text-sm truncate"
              >
                {p.name}
              </div>
            ))}
            {court.team1.length === 0 && (
              <span className="text-muted-foreground text-sm italic">
                Empty
              </span>
            )}
          </div>
        </motion.div>

        {/* VS Divider */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-px h-full bg-gradient-to-b from-transparent via-border to-transparent absolute" />
          <div className="z-10 bg-background rounded-full p-1 text-[10px] font-bold text-muted-foreground border border-border">
            VS
          </div>
        </div>

        {/* Team 2 */}
        <motion.div
          whileTap={canSelect ? { scale: 0.98 } : undefined}
          className={getTeamClasses(2)}
          onClick={() => canSelect && onSelectWinner?.(2)}
        >
          {court.winner === 2 && (
            <div className="absolute top-1 right-2 text-success text-xs font-bold">
              WINNER
            </div>
          )}

          <div className="space-y-1">
            {court.team2.map((p, i) => (
              <div
                key={i}
                className="font-semibold text-foreground text-sm truncate"
              >
                {p.name}
              </div>
            ))}
            {court.team2.length === 0 && (
              <span className="text-muted-foreground text-sm italic">
                Empty
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </GlassCard>
  );
};

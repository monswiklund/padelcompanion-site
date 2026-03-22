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
        ? "cursor-pointer hover:bg-surface-hover hover:border-glass-border hover:shadow-lg hover:-translate-y-0.5"
        : "",
      canSelect && isComplete && !isWinner && !isLoser
        ? "cursor-pointer hover:bg-surface-hover"
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
        "overflow-hidden relative",
        isComplete ? "border-glass-border shadow-2xl" : "border-glass-border/50",
      )}
    >
      {/* Court Background */}
      <div 
        className="absolute inset-0 opacity-100 pointer-events-none bg-center bg-no-repeat bg-cover z-0"
        style={{ backgroundImage: "url('/assets/court-bg.svg')" }}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="px-4 py-2 bg-black/40 backdrop-blur-sm border-b border-glass-border text-xs font-black uppercase tracking-wider flex justify-between items-center text-white/90">
          <span className="drop-shadow-sm">Court {court.id}</span>
          {isComplete && (
            <span className="text-success-light flex items-center gap-1 font-bold">
              ✓ Complete
            </span>
          )}
        </div>

        <div className="p-4 flex items-stretch gap-4">
          {/* Team 1 */}
          <motion.div
            whileTap={canSelect ? { scale: 0.98 } : undefined}
            className={cn(
              "flex-1 p-4 rounded-xl text-center transition-all duration-300 relative overflow-hidden group border",
              canSelect && !isComplete
                ? "cursor-pointer bg-black/60 hover:bg-black/70 border-white/30 hover:border-white/50 hover:shadow-lg hover:-translate-y-0.5 shadow-md"
                : "bg-black/50 border-white/20",
              // Winner State
              court.winner === 1 && "bg-success/80 border-success shadow-[0_0_25px_rgba(34,197,94,0.5)] scale-[1.02] z-10",
              // Loser State
              court.winner === 2 && "opacity-50 grayscale bg-black/70 border-transparent",
            )}
            onClick={() => canSelect && onSelectWinner?.(1)}
          >
            {court.winner === 1 && (
              <div className="absolute top-1 right-2 text-white text-[10px] font-black tracking-tighter bg-black/20 px-1.5 py-0.5 rounded shadow-sm border border-white/20">
                WINNER
              </div>
            )}

            <div className="space-y-1">
              {court.team1.map((p, i) => (
                <div
                  key={i}
                  className="font-black text-white text-base truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide"
                >
                  {p.name}
                </div>
              ))}
              {court.team1.length === 0 && (
                <span className="text-white/50 text-sm italic">Empty</span>
              )}
            </div>
          </motion.div>

          {/* VS Divider */}
          <div className="flex flex-col items-center justify-center relative px-1">
            <div className="w-px h-full bg-gradient-to-b from-white/0 via-white/50 to-white/0 absolute" />
            <div className="z-10 bg-black/80 backdrop-blur-md rounded-full w-8 h-8 flex items-center justify-center text-xs font-black text-white border border-glass-border shadow-lg">
              VS
            </div>
          </div>

          {/* Team 2 */}
          <motion.div
            whileTap={canSelect ? { scale: 0.98 } : undefined}
            className={cn(
              "flex-1 p-4 rounded-xl text-center transition-all duration-300 relative overflow-hidden group border",
              canSelect && !isComplete
                ? "cursor-pointer bg-black/60 hover:bg-black/70 border-white/30 hover:border-white/50 hover:shadow-lg hover:-translate-y-0.5 shadow-md"
                : "bg-black/50 border-white/20",
              // Winner State
              court.winner === 2 && "bg-success/80 border-success shadow-[0_0_25px_rgba(34,197,94,0.5)] scale-[1.02] z-10",
              // Loser State
              court.winner === 1 && "opacity-50 grayscale bg-black/70 border-transparent",
            )}
            onClick={() => canSelect && onSelectWinner?.(2)}
          >
            {court.winner === 2 && (
              <div className="absolute top-1 right-2 text-white text-[10px] font-black tracking-tighter bg-black/20 px-1.5 py-0.5 rounded shadow-sm border border-glass-border">
                WINNER
              </div>
            )}

            <div className="space-y-1">
              {court.team2.map((p, i) => (
                <div
                  key={i}
                  className="font-black text-white text-base truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide"
                >
                  {p.name}
                </div>
              ))}
              {court.team2.length === 0 && (
                <span className="text-white/50 text-sm italic">Empty</span>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </GlassCard>
  );
};

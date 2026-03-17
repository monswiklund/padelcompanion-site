import React, { useRef, useEffect } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { useTournament } from "@/context/TournamentContext";
import { formatEstimatedRoundStart } from "./scheduleTiming";

interface FullScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FullScheduleModal: React.FC<FullScheduleModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { state } = useTournament();
  const { schedule, allRounds } = state;
  const containerRef = useRef<HTMLDivElement>(null);
  const liveRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Small timeout to ensure the modal content is rendered and measurements are accurate
      const timer = setTimeout(() => {
        if (liveRowRef.current && containerRef.current) {
          liveRowRef.current.scrollIntoView({ 
            behavior: "smooth", 
            block: "center" 
          });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Merge played rounds with future rounds for the full overview
  const fullSchedule = allRounds || [];

  const getCourtName = (courtNum: number) => {
    if (
      state.courtFormat === "custom" &&
      state.customCourtNames[courtNum - 1]
    ) {
      return state.customCourtNames[courtNum - 1];
    }
    return `Court ${courtNum}`;
  };

  const getDivisionStyles = (division: string) => {
    switch (division.toUpperCase()) {
      case "A": return "bg-pool-a/10 text-pool-a border-pool-a/20";
      case "B": return "bg-pool-b/10 text-pool-b border-pool-b/20";
      case "C": return "bg-pool-c/10 text-pool-c border-pool-c/20";
      case "D": return "bg-pool-d/10 text-pool-d border-pool-d/20";
      default: return "bg-accent/10 text-accent border-accent/20";
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Full Tournament Schedule"
      width="xl"
    >
      <div 
        ref={containerRef}
        className="space-y-8 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar p-1"
      >
        {fullSchedule.map((round, rIdx) => {
          const isPlayed = rIdx < schedule.length;
          const isCurrent = rIdx === schedule.length - 1 && !schedule[rIdx].completed;
          const activeRound = isPlayed ? schedule[rIdx] : null;

          return (
            <div 
              key={rIdx}
              ref={isCurrent ? liveRowRef : null}
              className={`rounded-2xl border transition-all ${
                isCurrent 
                  ? "border-accent bg-accent/6 ring-1 ring-accent/20 shadow-sm" 
                  : isPlayed 
                    ? "border-border bg-card/70" 
                    : "border-border/80 bg-muted/30"
              } p-5`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${isCurrent ? "text-accent" : "text-foreground"}`}>
                    {round.name || `Round ${round.number}`}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {isPlayed && activeRound?.durationSeconds 
                      ? `${Math.round(activeRound.durationSeconds / 60)} min`
                      : `Est: ${formatEstimatedRoundStart(state, rIdx)}`
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isCurrent ? (
                    <span className="px-2 py-0.5 text-[10px] font-black bg-accent text-white rounded-full animate-pulse uppercase tracking-wider">
                      Live
                    </span>
                  ) : isPlayed ? (
                    <span className="px-2 py-0.5 text-[10px] font-black bg-success/15 text-success rounded-full border border-success/20 uppercase tracking-wider">
                      Done
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-black bg-muted text-muted-foreground rounded-full border border-border uppercase tracking-wider">
                      Upcoming
                    </span>
                  )}
                </div>
                {isPlayed && activeRound?.completed && (
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
                    Score recorded
                  </span>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {round.matches.map((match, mIdx) => {
                  const playedMatch = activeRound?.matches[mIdx];
                  const hasScores = playedMatch?.score1 != null && playedMatch?.score2 != null;
                  const matchDivision = (match.team1[0] as any)?.division || "A";

                  return (
                    <div 
                      key={mIdx}
                      className="rounded-xl border border-border bg-background/70 p-3 shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                          {getCourtName(match.court)}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${getDivisionStyles(matchDivision)}`}>
                          Div {matchDivision}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 flex flex-col min-w-0">
                          <span className="text-sm font-semibold truncate text-foreground">
                            {match.team1.map(p => p.name).join(" / ")}
                          </span>
                        </div>
                        
                        <div className="flex flex-col items-center px-2 shrink-0">
                          {hasScores ? (
                            <div className="flex items-center gap-1">
                              <span className={`text-xs font-black tabular-nums ${playedMatch.score1! > playedMatch.score2! ? "text-success" : playedMatch.score1! < playedMatch.score2! ? "text-destructive" : (playedMatch.score1 !== 0 || playedMatch.score2 !== 0) ? "text-orange-400" : "text-foreground"}`}>
                                {playedMatch.score1}
                              </span>
                              <span className="text-[10px] font-black text-muted-foreground/30 px-0.5">-</span>
                              <span className={`text-xs font-black tabular-nums ${playedMatch.score2! > playedMatch.score1! ? "text-success" : playedMatch.score2! < playedMatch.score1! ? "text-destructive" : (playedMatch.score2 !== 0 || playedMatch.score1 !== 0) ? "text-orange-400" : "text-foreground"}`}>
                                {playedMatch.score2}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">VS</span>
                          )}
                        </div>

                        <div className="flex-1 flex flex-col min-w-0 text-right">
                          <span className="text-sm font-semibold truncate text-foreground">
                            {match.team2.map(p => p.name).join(" / ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Dialog>
  );
};

export default FullScheduleModal;

import React from "react";
import { Dialog } from "@/components/ui/Dialog";
import { useTournament, Match } from "@/context/TournamentContext";

interface PlayerMatchHistoryProps {
  playerId: string;
  playerName: string;
  isOpen: boolean;
  onClose: () => void;
}

const PlayerMatchHistory: React.FC<PlayerMatchHistoryProps> = ({
  playerId,
  playerName,
  isOpen,
  onClose,
}) => {
  const { state } = useTournament();
  const { schedule } = state;

  // Find all matches for this player
  const playerMatches = schedule.flatMap((round, roundIdx) => 
    round.matches
      .map((match, matchIdx) => ({
        ...match,
        roundName: round.name || `Round ${round.number}`,
        roundIdx,
        matchIdx
      }))
      .filter(match => 
        match.team1.some(p => p.id === playerId) || 
        match.team2.some(p => p.id === playerId)
      )
  );

  const getMatchResult = (match: any) => {
    if (match.score1 == null || match.score2 == null) return "upcoming";
    
    const isTeam1 = match.team1.some((p: any) => p.id === playerId);
    const playerScore = isTeam1 ? match.score1 : match.score2;
    const opponentScore = isTeam1 ? match.score2 : match.score1;

    if (playerScore > opponentScore) return "win";
    if (playerScore < opponentScore) return "loss";
    return "draw";
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span className="text-accent">📊</span>
          <span>Match History: {playerName}</span>
        </div>
      }
      width="lg"
    >
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {playerMatches.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground italic">
            No matches found for this player yet.
          </div>
        ) : (
          playerMatches.map((match, i) => {
            const result = getMatchResult(match);
            const isTeam1 = match.team1.some(p => p.id === playerId);
            const opponent = isTeam1 ? match.team2 : match.team1;
            const playerScore = isTeam1 ? match.score1 : match.score2;
            const opponentScore = isTeam1 ? match.score2 : match.score1;
            
            const resultColors = {
              win: "bg-success/20 border-success/30 text-success",
              loss: "bg-error/20 border-error/30 text-error",
              draw: "bg-warning/20 border-warning/30 text-warning",
              upcoming: "bg-muted/10 border-border text-muted-foreground"
            };

            const resultLabels = {
              win: "Win",
              loss: "Loss",
              draw: "Draw",
              upcoming: "Upcoming"
            };

            return (
              <div 
                key={i}
                className={`flex flex-col p-4 rounded-xl border bg-white/5 transition-all hover:bg-white/10`}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {match.roundName} · Court {match.court}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${resultColors[result]}`}>
                    {resultLabels[result]}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 text-center">
                    <p className="font-bold truncate text-foreground">
                      {playerName}
                    </p>
                  </div>

                  <div className="flex flex-col items-center shrink-0">
                    <div className="text-xl font-black tabular-nums">
                      {playerScore != null && opponentScore != null
                        ? `${playerScore} - ${opponentScore}`
                        : "vs"}
                    </div>
                  </div>

                  <div className="flex-1 text-center">
                    <p className="font-bold truncate text-foreground">
                      {opponent.map(p => p.name).join(" / ")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Dialog>
  );
};

export default PlayerMatchHistory;

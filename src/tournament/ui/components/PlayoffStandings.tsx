import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useTournament } from "@/context/TournamentContext";

const PlayoffStandings: React.FC = () => {
  const { state } = useTournament();
  const { schedule, format, players } = state;

  if (format !== "division") return null;

  const semiRound = schedule.find((r) => r.name === "Semifinal");
  const finalRound = schedule.find((r) => r.name === "Final");

  if (!semiRound) return null;

  // Group by division
  const divisions = Array.from(new Map(players.map((p: any) => [p.division || "A", p.division || "A"])).values()).sort();

  return (
    <div className="space-y-8 mb-12 animate-fade-in">
      <div className="flex items-center gap-3 px-2">
        <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">Playoff Results</h3>
        <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {divisions.map((div) => {
          // Find semi matches for this division
          const divSemis = semiRound.matches.filter((m) => {
            const p1 = players.find(p => p.id === m.team1[0].id);
            return (p1 as any)?.division === div;
          });

          // Find final match for this division
          const divFinal = finalRound?.matches.find((m) => {
            const p1 = players.find(p => p.id === m.team1[0].id);
            return (p1 as any)?.division === div;
          });

          const getWinner = (m: any) => (m.score1 || 0) > (m.score2 || 0) ? m.team1 : m.team2;
          const getLoser = (m: any) => (m.score1 || 0) > (m.score2 || 0) ? m.team2 : m.team1;
          const isCompleted = (m: any) => m.score1 != null || m.score2 != null;

          const gold = divFinal && isCompleted(divFinal) ? getWinner(divFinal) : null;
          const silver = divFinal && isCompleted(divFinal) ? getLoser(divFinal) : null;
          
          // Determine 3rd and 4th place from semifinal losers based on league rank
          const semiLosers = divSemis.filter(isCompleted).map(getLoser);
          let third = null;
          let fourth = null;

          if (semiLosers.length > 0) {
            // Sort by league rank (lower currentRank is better)
            const sortedByLeague = [...semiLosers].sort((a, b) => {
              const rankA = state.leaderboard.find(p => p.id === a[0].id)?.currentRank || 999;
              const rankB = state.leaderboard.find(p => p.id === b[0].id)?.currentRank || 999;
              return rankA - rankB;
            });
            third = sortedByLeague[0];
            fourth = sortedByLeague[1];
          }

          const divColors: Record<string, string> = {
            A: "from-blue-500/20 to-indigo-500/5 border-blue-500/30",
            B: "from-emerald-500/20 to-teal-500/5 border-emerald-500/30",
            C: "from-orange-500/20 to-amber-500/5 border-orange-500/30",
          };

          return (
            <GlassCard 
              key={div} 
              className={`relative overflow-hidden border-2 ${divColors[div] || "border-border"}`}
              padding="none"
            >
              <div className="p-4 border-b border-border bg-accent/10 flex justify-between items-center">
                <span className="font-black text-sm uppercase tracking-widest text-foreground">Division {div}</span>
                {divFinal?.completed && <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full font-bold uppercase">Finished</span>}
              </div>

              <div className="p-6 space-y-6">
                {/* Gold */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/40 shrink-0">
                    <span className="text-2xl">🥇</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-yellow-600 dark:text-yellow-500 uppercase tracking-widest">1st Place</p>
                    <h4 className="text-lg font-bold text-foreground truncate">
                      {gold ? gold.map(p => p.name).join(" / ") : "TBD"}
                    </h4>
                  </div>
                </div>

                {/* Silver */}
                <div className="flex items-center gap-4 opacity-90">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center shadow-lg shadow-gray-400/20 shrink-0">
                    <span className="text-xl">🥈</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">2nd Place</p>
                    <h4 className="text-base font-bold text-foreground/90 truncate">
                      {silver ? silver.map(p => p.name).join(" / ") : "TBD"}
                    </h4>
                  </div>
                </div>

                {/* Third Place */}
                <div className="flex items-center gap-4 opacity-80">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-600/20 shrink-0">
                    <span className="text-xl">🥉</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">3rd Place</p>
                    <h4 className="text-sm font-bold text-foreground/80 truncate">
                      {third ? third.map(p => p.name).join(" / ") : "TBD"}
                    </h4>
                  </div>
                </div>

                {/* Fourth Place */}
                <div className="flex items-center gap-4 opacity-70">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-muted-foreground">4</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">4th Place</p>
                    <h4 className="text-sm font-bold text-foreground/60 truncate">
                      {fourth ? fourth.map(p => p.name).join(" / ") : "TBD"}
                    </h4>
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

export default PlayoffStandings;

import React, { useEffect, useState } from "react";
import { useTournament } from "@/context/TournamentContext";
import Leaderboard from "@/tournament/ui/components/Leaderboard";
import Schedule from "@/tournament/ui/components/Schedule";
import { showConfirmModal, showInputModal } from "@/tournament/core/modals";
import { showToast, createId } from "@/shared/utils";
import { MatchTimer } from "@/tournament/ui/components/MatchTimer";
import { launchConfetti } from "@/tournament/confetti";
import { saveToHistory } from "@/tournament/history/repository";

const TournamentActiveView: React.FC = () => {
  const { state, dispatch, undo, canUndo } = useTournament();
  const { tournamentName, format, courts, scoringMode, pointsPerMatch } = state;
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
// ...
        {/* Enhanced Sticky Toolbar */}
        <div className="sticky top-20 z-40 mb-8 mx-auto max-w-5xl">
          <div className="bg-card/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-2 transition-all duration-300">
            <div className="flex items-center justify-between gap-2">
              
              {/* Left Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center border ${
                    canUndo
                      ? "bg-popover hover:bg-accent/10 text-foreground hover:text-accent border-border hover:border-accent/30 shadow-sm"
                      : "opacity-30 cursor-not-allowed bg-popover/50 text-muted-foreground border-transparent"
                  }`}
                  onClick={handleUndo}
                  disabled={!canUndo}
                  title="Undo (Ctrl+Z)"
                >
                  <span className="text-lg">↩</span>
                </button>

                <button
                  className="h-10 px-3 bg-accent hover:bg-accent-dark text-white rounded-xl font-bold shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all flex items-center gap-2"
                  onClick={handleAddLatePlayer}
                  title="Add Late Player"
                >
                  <span className="text-xl">+</span>
                  <span className="hidden sm:inline text-xs uppercase tracking-tight">Player</span>
                </button>
              </div>

              {/* Center: Timer */}
              <div className="flex-shrink-0">
                <MatchTimer />
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-1.5">
                {/* View Toggle */}
                <div className="relative">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center border ${
                      showSettings 
                        ? "bg-accent text-white border-accent shadow-glow" 
                        : "bg-popover hover:bg-white/5 text-muted-foreground border-border"
                    }`}
                    title="View Settings"
                  >
                    <span className="text-lg">⚙️</span>
                  </button>

                  {showSettings && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-popover/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl p-4 animate-fade-in z-[60]">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-muted-foreground uppercase">Grid</span>
                            <span className="text-[10px] font-mono text-accent">{state.gridColumns || 'Auto'}</span>
                          </div>
                          <input
                            type="range" min="0" max="4" step="1"
                            className="w-full accent-accent"
                            value={state.gridColumns}
                            onChange={(e) => dispatch({ type: "UPDATE_FIELD", key: "gridColumns", value: parseInt(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-muted-foreground uppercase">Zoom</span>
                            <span className="text-[10px] font-mono text-accent">{state.textSize}%</span>
                          </div>
                          <input
                            type="range" min="50" max="350" step="10"
                            className="w-full accent-accent"
                            value={state.textSize}
                            onChange={(e) => dispatch({ type: "UPDATE_FIELD", key: "textSize", value: parseInt(e.target.value) })}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block" />

                {state.schedule.some((r) => r.completed) && (
                  <button
                    className="h-10 px-3 bg-success/20 hover:bg-success/30 text-success border border-success/30 rounded-xl font-bold transition-all flex items-center gap-2"
                    onClick={handleEnd}
                  >
                    🏆 <span className="hidden md:inline text-xs uppercase tracking-tight">Finish</span>
                  </button>
                )}

                <button
                  className="w-10 h-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors flex items-center justify-center border border-transparent hover:border-destructive/20"
                  onClick={handleReset}
                  title="Reset Tournament"
                >
                  <span>🔄</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </header>

      {/* Schedule */}
      <div className="mb-16">
        <Schedule />
      </div>

      {/* Leaderboard */}
      <div className="mb-24 leaderboard-section">
        <Leaderboard />
      </div>
    </div>
  );
};

export default TournamentActiveView;

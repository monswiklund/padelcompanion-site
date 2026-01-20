import React, { useState } from "react";
import { useTournament } from "@/context/TournamentContext";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { WCCourt } from "./WCCourt";
import { showConfirmModal } from "../../core/modals";
import { showToast, cn } from "@/shared/utils";
import { MatchTimer } from "@/tournament/ui/components/MatchTimer";
import { allCourtsComplete } from "@/tournament/winnersCourt/winnersCourtCore";

export const WinnersCourtActiveView: React.FC = () => {
  const { state, dispatch, undo, canUndo } = useTournament();
  const [showSettings, setShowSettings] = useState(false);
  const wc = state.winnersCourt;

  if (!wc || !wc.sides) return null;

  const { sides, twist } = wc;
  const activeSides = Object.keys(sides)
    .filter((s) => sides[s]?.courts?.length > 0)
    .sort();

  const handleNextRound = (side: string) => {
    if (!allCourtsComplete(wc, side)) {
      showToast("Not all courts have results", "error");
      return;
    }
    dispatch({ type: "ADVANCE_WC_ROUND", side });
    showToast(`Side ${side} - Round ${sides[side].round + 1} started`);
  };

  const handleClearSide = (side: string) => {
    showConfirmModal(
      `Clear Side ${side}?`,
      "This will reset this side.",
      "Clear",
      () => {
        dispatch({ type: "CLEAR_WC_SIDE", side });
        showToast(`Side ${side} cleared`);
      },
    );
  };

  const handleFullReset = () => {
    showConfirmModal(
      "Reset All Sides?",
      "This will clear all Winners Court progress.",
      "Reset All",
      () => {
        activeSides.forEach(side => dispatch({ type: "CLEAR_WC_SIDE", side }));
        showToast("Session reset");
      }
    );
  };

  const handleUndo = () => {
    if (canUndo) {
      undo();
      showToast("Undo successful");
    }
  };

  const handleWin = (side: string, courtIndex: number, winner: 1 | 2) => {
    dispatch({ type: "UPDATE_WC_RESULT", side, courtIndex, winner });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Winners Court
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          {activeSides.map(s => (
            <span key={s} className="px-3 py-1 bg-card border border-border rounded-full text-xs text-muted-foreground font-medium">
              Pool {s}
            </span>
          ))}
          {twist && <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-bold">Twist Active</span>}
        </div>
      </div>

      {/* Enhanced Sticky Toolbar */}
      <div className="sticky top-20 z-40 mb-8 mx-auto max-w-5xl">
        <div className="bg-card/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-2 transition-all duration-300">
          <div className="flex items-center justify-between gap-2">
            
            {/* Primary Actions Group */}
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
            </div>

            {/* Center: Timer */}
            <div className="flex-shrink-0">
              <MatchTimer />
            </div>

            {/* Settings & Destructive Group */}
            <div className="flex items-center gap-1.5">
              
              {/* View Settings Popover */}
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

              <button
                className="w-10 h-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors flex items-center justify-center border border-transparent hover:border-destructive/20"
                onClick={handleFullReset}
                title="Reset Session"
              >
                <span>🔄</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8 flex-wrap justify-center" style={{ zoom: state.textSize / 100 }}>
        {activeSides.map((side) => (
          <div key={side} className="flex-1 min-w-80 max-w-5xl">
            <GlassCard
              className={cn(
                "border-t-4",
                side === "A" ? "border-t-accent" :
                side === "B" ? "border-t-warning" :
                side === "C" ? "border-t-success" :
                side === "D" ? "border-t-purple-500" :
                side === "E" ? "border-t-destructive" :
                side === "F" ? "border-t-orange-500" : "border-t-white/20"
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col">
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    Pool {side}
                  </h3>
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Round {sides[side].round}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleClearSide(side)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors text-xs font-bold uppercase tracking-tighter"
                    title="Reset Pool"
                  >
                    Reset
                  </button>
                  <Button
                    size="md"
                    variant="primary"
                    className="px-6 shadow-glow"
                    onClick={() => handleNextRound(side)}
                  >
                    Next Round →
                  </Button>
                </div>
              </div>

              {twist && (
                <div className="text-xs text-muted-foreground italic mb-4">
                  Twist Mode Active
                </div>
              )}

              <div 
                className="grid gap-4"
                style={{
                  gridTemplateColumns: state.gridColumns > 0 
                    ? `repeat(${state.gridColumns}, minmax(0, 1fr))` 
                    : '1fr'
                }}
              >
                {sides[side].courts.map((court: any, idx: number) => (
                  <WCCourt
                    key={court.id}
                    court={court}
                    twist={twist}
                    round={sides[side].round}
                    onSelectWinner={(winner) => handleWin(side, idx, winner)}
                  />
                ))}
              </div>
            </GlassCard>

            {/* History for this side */}
            {sides[side].history && sides[side].history.length > 0 && (
              <div className="mt-8 space-y-4">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-2">
                  Match History
                </h4>
                <div className="flex flex-col gap-3">
                  {[...sides[side].history].reverse().map((roundData: any) => (
                    <details key={roundData.round} className="group open:bg-black/10 bg-black/5 rounded-xl border border-white/5 overflow-hidden transition-all duration-300">
                      <summary className="flex items-center justify-between p-3 cursor-pointer select-none hover:bg-white/5 transition-colors">
                        <span className="text-sm font-semibold text-muted-foreground group-open:text-foreground">
                          Round {roundData.round}
                        </span>
                        <span className="text-xs text-muted-foreground transition-transform duration-300 group-open:rotate-180">
                          ▼
                        </span>
                      </summary>
                      <div className="p-3 pt-0 animate-fade-in">
                        <div 
                          className="grid gap-3 opacity-80"
                          style={{
                            gridTemplateColumns: state.gridColumns > 0 
                              ? `repeat(${state.gridColumns}, minmax(0, 1fr))` 
                              : '1fr'
                          }}
                        >
                          {roundData.courts.map((court: any) => (
                            <WCCourt
                              key={court.id}
                              court={court}
                              twist={twist}
                              round={roundData.round}
                              readOnly
                            />
                          ))}
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WinnersCourtActiveView;

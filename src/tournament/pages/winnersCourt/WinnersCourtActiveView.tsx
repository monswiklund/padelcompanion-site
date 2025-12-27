import React from "react";
import { useTournament } from "@/context/TournamentContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { WCCourt } from "./WCCourt";
import { recordCourtResult, nextRound, clearWinnersCourt } from "./logic.js";
import { showConfirmModal } from "../../core/modals.js";
import { showToast } from "@/shared/utils.js";
import { state as legacyState } from "../../core/state.js";

export const WinnersCourtActiveView: React.FC = () => {
  const { state, dispatch } = useTournament();
  const wc = state.winnersCourt;

  if (!wc || !wc.sides) return null;

  const { sides, twist } = wc;
  const activeSides = Object.keys(sides).filter(
    (s) => sides[s]?.courts?.length > 0
  );

  const syncState = () => {
    dispatch({
      type: "SET_STATE",
      payload: { winnersCourt: { ...legacyState.winnersCourt } },
    });
  };

  const handleNextRound = (side: string) => {
    const result = nextRound(side);
    if (result?.error) {
      showToast(result.error, "error");
    } else {
      showToast(`Side ${side} - Round ${wc.sides[side].round} started`);
      syncState();
    }
  };

  const handleClearSide = (side: string) => {
    showConfirmModal(
      `Clear Side ${side}?`,
      "This will reset this side.",
      "Clear",
      () => {
        if (legacyState.winnersCourt.sides[side]) {
          delete legacyState.winnersCourt.sides[side];
          if (Object.keys(legacyState.winnersCourt.sides).length === 0) {
            legacyState.winnersCourt = null;
          }
          syncState();
          showToast(`Side ${side} cleared`);
        }
      },
      true
    );
  };

  const handleWin = (side: string, courtId: number, winner: number) => {
    recordCourtResult(side, courtId, winner, 0, 0);
    syncState();
  };

  return (
    <div className="winners-court-active animate-fade-in p-4 sm:p-8">
      <div className="page-intro-header text-center max-w-[600px] mx-auto mb-8">
        <h2 className="text-3xl mb-1 text-white">Winners Court</h2>
        <p className="text-text-muted">
          Promotion and relegation based on wins.
        </p>
      </div>

      <div className="flex gap-8 flex-wrap justify-center">
        {activeSides.map((side) => (
          <div
            key={side}
            className="wc-side-view flex-1 min-w-[320px] max-w-[600px]"
          >
            <Card
              className={`p-4 border-2 ${
                side === "A" ? "border-accent/40" : "border-warning/40"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={`text-xl font-bold ${
                    side === "A" ? "text-accent" : "text-warning"
                  }`}
                >
                  Side {side} — Round {sides[side].round}
                </h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleNextRound(side)}
                  >
                    Next Round
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleClearSide(side)}
                  >
                    Clear
                  </Button>
                </div>
              </div>

              {twist && (
                <div className="text-xs text-text-muted italic mb-4">
                  Twist Mode Active
                </div>
              )}

              <div className="wc-courts-grid grid gap-4">
                {sides[side].courts.map((court: any) => (
                  <WCCourt
                    key={court.id}
                    court={court}
                    twist={twist}
                    round={sides[side].round}
                    onSelectWinner={(winner) =>
                      handleWin(side, court.id, winner)
                    }
                  />
                ))}
              </div>
            </Card>

            {/* History for this side */}
            {sides[side].history && sides[side].history.length > 0 && (
              <div className="mt-8">
                <h4 className="text-sm font-bold text-text-muted mb-4 uppercase tracking-wider">
                  Previous Rounds
                </h4>
                <div className="flex flex-col gap-8 opacity-60">
                  {[...sides[side].history].reverse().map((roundData: any) => (
                    <div key={roundData.round} className="wc-history-round">
                      <div className="text-xs text-text-muted mb-2">
                        Round {roundData.round}
                      </div>
                      <div className="grid gap-2 scale-90 origin-top-left">
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

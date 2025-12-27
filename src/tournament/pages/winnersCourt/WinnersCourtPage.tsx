import React from "react";
import { useTournament } from "@/context/TournamentContext";
import { WinnersCourtSetup } from "./WinnersCourtSetup";
import { WinnersCourtActiveView } from "./WinnersCourtActiveView";

const WinnersCourtPage: React.FC = () => {
  const { state } = useTournament();
  const hasGame =
    state.winnersCourt &&
    state.winnersCourt.sides &&
    Object.keys(state.winnersCourt.sides).length > 0;

  return (
    <div className="winners-court-page">
      {!hasGame ? (
        <WinnersCourtSetup onGameActive={() => {}} />
      ) : (
        <WinnersCourtActiveView />
      )}
    </div>
  );
};

export default WinnersCourtPage;

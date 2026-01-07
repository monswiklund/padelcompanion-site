import React from "react";
import { useTournament } from "@/context/TournamentContext";
import { WinnersCourtSetup } from "./WinnersCourtSetup";
import { WinnersCourtActiveView } from "./WinnersCourtActiveView";
import { TournamentNav } from "@/components/tournament/TournamentNav";

const WinnersCourtPage: React.FC = () => {
  const { state } = useTournament();
  const hasGame =
    state.winnersCourt &&
    state.winnersCourt.sides &&
    Object.keys(state.winnersCourt.sides).length > 0;

  return (
    <div className="min-h-screen pb-12">
      <TournamentNav />
      {!hasGame ? <WinnersCourtSetup /> : <WinnersCourtActiveView />}
    </div>
  );
};

export default WinnersCourtPage;

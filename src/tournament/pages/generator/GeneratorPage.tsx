import React from "react";
import { useTournament } from "@/context/TournamentContext";
import { GeneratorSetup } from "./GeneratorSetup";
import TournamentActiveView from "./TournamentActiveView";
import { TournamentNav } from "@/components/tournament/TournamentNav";
import { HistorySection } from "@/components/tournament/HistorySection";

const GeneratorPage: React.FC = () => {
  const { state } = useTournament();
  const isGameActive = state.schedule && state.schedule.length > 0;

  return (
    <div className="generator-page-wrapper tournament-page">
      <TournamentNav />
      {isGameActive ? (
        <TournamentActiveView />
      ) : (
        <GeneratorSetup
          onGameActive={() => {
            /* handeled by state change */
          }}
        />
      )}

      {!isGameActive && <HistorySection />}
    </div>
  );
};

export default GeneratorPage;
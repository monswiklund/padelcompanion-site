import React from "react";
import { useTournament } from "@/context/TournamentContext";
import { GeneratorSetup } from "./GeneratorSetup";
import TournamentActiveView from "./TournamentActiveView";

import { HistorySection } from "@/components/tournament/HistorySection";

const GeneratorPage: React.FC = () => {
  const { state } = useTournament();
  const isGameActive = state.schedule && state.schedule.length > 0;

  return (
    <div className="generator-page-wrapper">
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

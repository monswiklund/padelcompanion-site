import React from "react";
import { useTournament } from "@/context/TournamentContext";
import { DivisionSetup } from "./DivisionSetup";
import TournamentActiveView from "../generator/TournamentActiveView";
import { TournamentNav } from "@/components/tournament/TournamentNav";
import { HistorySection } from "@/components/tournament/HistorySection";

const DivisionPage: React.FC = () => {
  const { state } = useTournament();
  const isGameActive =
    state.format === "division" &&
    state.schedule &&
    state.schedule.length > 0;

  return (
    <div className="min-h-screen pb-12">
      <TournamentNav />
      {isGameActive ? (
        <TournamentActiveView />
      ) : (
        <DivisionSetup
          onGameActive={() => {
            /* handled by state change */
          }}
        />
      )}

      {!isGameActive && <HistorySection />}
    </div>
  );
};

export default DivisionPage;

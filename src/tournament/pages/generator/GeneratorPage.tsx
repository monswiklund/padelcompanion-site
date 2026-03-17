import React from "react";
import { Link } from "react-router-dom";
import { useTournament } from "@/context/TournamentContext";
import { GeneratorSetup } from "./GeneratorSetup";
import TournamentActiveView from "./TournamentActiveView";
import { TournamentNav } from "@/components/tournament/TournamentNav";
import { HistorySection } from "@/components/tournament/HistorySection";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const GeneratorPage: React.FC = () => {
  const { state } = useTournament();
  const hasActiveSchedule = Boolean(state.schedule && state.schedule.length > 0);
  const hasDivisionGameActive = hasActiveSchedule && state.format === "division";
  const isGameActive = hasActiveSchedule && !hasDivisionGameActive;

  return (
    <div className="min-h-screen pb-12">
      <TournamentNav />
      {isGameActive ? (
        <TournamentActiveView />
      ) : hasDivisionGameActive ? (
        <div className="max-w-3xl mx-auto px-4 py-6 animate-fade-in">
          <Card className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Division tournament is active
            </h2>
            <p className="text-muted-foreground mb-6">
              The current schedule belongs to the Division format. Open the
              Division tab to continue that tournament.
            </p>
            <Link to="/tournament/division">
              <Button>Go to Division</Button>
            </Link>
          </Card>
        </div>
      ) : (
        <GeneratorSetup
          onGameActive={() => {
            /* handled by state change */
          }}
        />
      )}

      {!isGameActive && !hasDivisionGameActive && <HistorySection />}
    </div>
  );
};

export default GeneratorPage;

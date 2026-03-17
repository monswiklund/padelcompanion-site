import React from "react";
import { useTournament } from "@/context/TournamentContext";
import { BracketSetup } from "./BracketSetup";
import { BracketView } from "./BracketView";
import { TournamentNav } from "@/components/tournament/TournamentNav";

const BracketPage: React.FC = () => {
  const { state } = useTournament();

  const hasBracket = state.bracket && (
    (state.bracket as any).isDualBracket
      ? (((state.bracket as any).matchesA?.length ?? 0) > 0 ||
        ((state.bracket as any).matchesB?.length ?? 0) > 0)
      : (state.bracket as any).isMultiPool
        ? ((state.bracket as any).pools?.some((p: any) => p.matches.length > 0) ?? false)
        : (state.bracket as any).isDoubleElimination
          ? (((state.bracket as any).winnersMatches?.length ?? 0) > 0 ||
            ((state.bracket as any).losersMatches?.length ?? 0) > 0)
          : ((state.bracket as any).matches?.length ?? 0) > 0
  );

  return (
    <div className="min-h-screen pb-12">
      <TournamentNav />
      {!hasBracket ? <BracketSetup /> : <BracketView />}
    </div>
  );
};

export default BracketPage;

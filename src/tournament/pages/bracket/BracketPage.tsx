import React from "react";
import { useTournament } from "@/context/TournamentContext";
import { BracketSetup } from "./BracketSetup";
import { BracketView } from "./BracketView";
import { TournamentNav } from "@/components/tournament/TournamentNav";

const BracketPage: React.FC = () => {
  const { state } = useTournament();

  const hasBracket =
    state.bracket &&
    (state.bracket.isDualBracket
      ? (state.bracket.matchesA?.length ?? 0) > 0 ||
        (state.bracket.matchesB?.length ?? 0) > 0
      : (state.bracket.matches?.length ?? 0) > 0);

  return (
    <div className="min-h-screen pb-12">
      <TournamentNav />
      {!hasBracket ? <BracketSetup /> : <BracketView />}
    </div>
  );
};

export default BracketPage;

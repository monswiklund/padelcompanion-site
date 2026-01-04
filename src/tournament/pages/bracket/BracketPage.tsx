import React from "react";
import { useTournament } from "@/context/TournamentContext";
import { BracketSetup } from "./BracketSetup";
import { BracketView } from "./BracketView";
import { TournamentNav } from "@/components/tournament/TournamentNav";

const BracketPage: React.FC = () => {
  const { state } = useTournament();

  // Check for bracket existence - works with both single and dual brackets
  const hasBracket =
    state.bracket &&
    (state.bracket.isDualBracket
      ? (state.bracket.matchesA?.length ?? 0) > 0 ||
        (state.bracket.matchesB?.length ?? 0) > 0
      : (state.bracket.matches?.length ?? 0) > 0);

  return (
    <div className="bracket-page tournament-page">
      <TournamentNav />
      {!hasBracket ? <BracketSetup /> : <BracketView />}
    </div>
  );
};

export default BracketPage;

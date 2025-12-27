import React from "react";
import { useTournament } from "@/context/TournamentContext";
import { BracketSetup } from "./BracketSetup";
import { BracketView } from "./BracketView";

const BracketPage: React.FC = () => {
  const { state } = useTournament();
  const hasBracket =
    state.bracket && state.bracket.matches && state.bracket.matches.length > 0;

  return (
    <div className="bracket-page">
      {!hasBracket ? <BracketSetup /> : <BracketView />}
    </div>
  );
};

export default BracketPage;

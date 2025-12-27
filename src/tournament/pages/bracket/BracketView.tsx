import React, { useState, useMemo } from "react";
import { useTournament } from "@/context/TournamentContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BracketMatch } from "./BracketMatch";
import { BracketScoreModal } from "./BracketScoreModal";
import {
  updateMatchResult,
  getBracketRounds,
  isBracketComplete,
  getFinalStandings,
  getRoundName,
} from "../../bracket/index.js";
import { showConfirmModal } from "../../core/modals.js";
import { state as legacyState } from "../../core/state.js";

export const BracketView: React.FC = () => {
  const { state, dispatch } = useTournament();
  const { bracket, bracketScale, ui } = state;
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

  if (!bracket) return null;

  const isDual = bracket.isDualBracket;
  const isComplete = isBracketComplete();

  const handleUpdateScore = (matchId: number, s1: number, s2: number) => {
    // 1. Update legacy state
    updateMatchResult(matchId, s1, s2);

    // 2. Sync back to context
    dispatch({
      type: "SET_STATE",
      payload: { bracket: { ...legacyState.bracket } },
    });

    setSelectedMatchId(null);
  };

  const handleClear = () => {
    showConfirmModal(
      "Clear Bracket?",
      "This will delete the entire bracket and all results.",
      "Clear",
      () => {
        dispatch({ type: "CLEAR_BRACKET" });
      },
      true
    );
  };

  const handleScaleChange = (val: number) => {
    dispatch({ type: "UPDATE_BRACKET_SCALE", scale: val });
  };

  const renderRounds = (rounds: any[][], numRounds: number) => (
    <div
      className="bracket-container"
      style={{ "--bracket-scale": bracketScale / 100 } as any}
    >
      {rounds.map((roundMatches, i) => (
        <div className="bracket-round" key={i} data-round={i + 1}>
          <div className="round-header">{getRoundName(i + 1, numRounds)}</div>
          <div className="round-matches">
            {roundMatches.map((match) => (
              <BracketMatch
                key={match.id}
                match={match}
                onClick={(id) => setSelectedMatchId(id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const selectedMatch = selectedMatchId
    ? bracket.matches.find((m: any) => m.id === selectedMatchId)
    : null;

  const standings = isComplete ? getFinalStandings() : [];

  return (
    <div className="bracket-view-container min-h-screen py-8">
      <div className="page-intro-header text-center max-w-[600px] mx-auto mb-8 px-4">
        <h2 className="text-3xl mb-1 text-white">Tournament Bracket</h2>
        <p className="text-text-muted">
          {isDual
            ? "Side A vs Side B • Winners meet in Grand Final"
            : "Single elimination tournament bracket"}
        </p>
      </div>

      <div className="bracket-actions flex justify-center items-center gap-4 mb-8 flex-wrap">
        <div className="scale-control flex items-center gap-2">
          <span className="text-xs text-text-muted">Size</span>
          <input
            type="range"
            min="50"
            max="150"
            value={bracketScale}
            onChange={(e) => handleScaleChange(parseInt(e.target.value))}
            className="accent-accent w-24"
          />
          <span className="text-xs text-text-muted w-8">{bracketScale}%</span>
        </div>

        <div className="w-[1px] h-6 bg-white/10 hidden sm:block"></div>

        <Button variant="secondary" size="sm" onClick={() => window.print()}>
          Print
        </Button>
        <Button variant="danger" size="sm" onClick={handleClear}>
          Clear
        </Button>
      </div>

      {isDual ? (
        <DualBracketView
          bracket={bracket}
          bracketScale={bracketScale}
          onMatchClick={(id) => setSelectedMatchId(id)}
        />
      ) : (
        renderRounds(getBracketRounds(), bracket.numRounds || 0)
      )}

      {isComplete && <ChampionsView standings={standings} />}

      {selectedMatch && (
        <BracketScoreModal
          match={selectedMatch}
          onClose={() => setSelectedMatchId(null)}
          onSave={(s1, s2) => handleUpdateScore(selectedMatch.id, s1, s2)}
        />
      )}
    </div>
  );
};

const DualBracketView: React.FC<{
  bracket: any;
  bracketScale: number;
  onMatchClick: (id: number) => void;
}> = ({ bracket, bracketScale, onMatchClick }) => {
  const { state, dispatch } = useTournament();
  const activeTab = state.ui.activeBracketTab || "A";

  const roundsA = useMemo(() => {
    const grouped: any = {};
    (bracket.matchesA || []).forEach((m: any) => {
      if (!grouped[m.round]) grouped[m.round] = [];
      grouped[m.round].push(m);
    });
    return Object.values(grouped);
  }, [bracket.matchesA]);

  const roundsB = useMemo(() => {
    const grouped: any = {};
    (bracket.matchesB || []).forEach((m: any) => {
      if (!grouped[m.round]) grouped[m.round] = [];
      grouped[m.round].push(m);
    });
    return Object.values(grouped);
  }, [bracket.matchesB]);

  const setTab = (tab: string) => {
    dispatch({
      type: "UPDATE_FIELD",
      key: "ui" as any,
      value: { ...state.ui, activeBracketTab: tab },
    });
  };

  return (
    <div className="dual-bracket-wrapper">
      <div className="mobile-bracket-tabs flex justify-center gap-2 mb-4 sm:hidden">
        {["A", "Final", "B"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded text-sm font-bold ${
              activeTab === tab
                ? "bg-accent text-white"
                : "bg-black/20 text-text-muted"
            }`}
            onClick={() => setTab(tab)}
          >
            {tab === "A" ? "Side A" : tab === "B" ? "Side B" : "Final"}
          </button>
        ))}
      </div>

      <div
        className="dual-bracket-layout flex gap-8 items-start justify-center flex-wrap"
        style={{ "--bracket-scale": bracketScale / 100 } as any}
      >
        {/* Side A */}
        <div
          className={`bracket-side side-a flex-1 border-2 border-accent/30 rounded-xl p-4 bg-accent/5 ${
            activeTab === "A" ? "mobile-active" : "hidden sm:block"
          }`}
        >
          <div className="text-center mb-4">
            <span className="font-bold text-accent">Side A</span>
            <span className="text-xs text-text-muted ml-2">
              ({bracket.teamsA?.length || 0} teams)
            </span>
          </div>
          <div className="bracket-container flex gap-4 overflow-x-auto">
            {roundsA.map((roundMatches: any, i) => (
              <div className="bracket-round" key={i}>
                <div className="round-header">
                  {getRoundName(i + 1, bracket.numRoundsA)}
                </div>
                <div className="round-matches">
                  {roundMatches.map((m: any) => (
                    <BracketMatch key={m.id} match={m} onClick={onMatchClick} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grand Final */}
        <div
          className={`bracket-final flex-0 flex flex-col items-center justify-center p-8 ${
            activeTab === "Final" ? "mobile-active" : "hidden md:flex"
          }`}
        >
          <div className="text-xs text-success font-bold mb-4">
            🏆 GRAND FINAL 🏆
          </div>
          {bracket.grandFinal ? (
            <BracketMatch match={bracket.grandFinal} onClick={onMatchClick} />
          ) : (
            <div className="text-text-muted">TBD</div>
          )}
        </div>

        {/* Side B */}
        <div
          className={`bracket-side side-b flex-1 border-2 border-warning/30 rounded-xl p-4 bg-warning/5 ${
            activeTab === "B" ? "mobile-active" : "hidden sm:block"
          }`}
        >
          <div className="text-center mb-4">
            <span className="font-bold text-warning">Side B</span>
            <span className="text-xs text-text-muted ml-2">
              ({bracket.teamsB?.length || 0} teams)
            </span>
          </div>
          <div className="bracket-container flex gap-4 overflow-x-auto">
            {[...roundsB].reverse().map((roundMatches: any, i) => {
              const roundNum = bracket.numRoundsB - i;
              return (
                <div className="bracket-round" key={i}>
                  <div className="round-header">
                    {getRoundName(roundNum, bracket.numRoundsB)}
                  </div>
                  <div className="round-matches">
                    {roundMatches.map((m: any) => (
                      <BracketMatch
                        key={m.id}
                        match={m}
                        onClick={onMatchClick}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChampionsView: React.FC<{ standings: any[] }> = ({ standings }) => {
  const first = standings.find((s) => s.place === 1);
  const second = standings.find((s) => s.place === 2);
  const thirds = standings.filter((s) => s.place === 3);

  return (
    <div className="bracket-champions mt-12 text-center animate-fade-in">
      <h3 className="text-2xl font-bold mb-8 italic">Champions</h3>
      <div className="podium flex items-end justify-center gap-4 max-w-lg mx-auto">
        {second && (
          <div className="podium-place second flex-1">
            <div className="podium-medal text-xl font-bold mb-2">2</div>
            <div className="podium-team text-sm mb-4 truncate px-2">
              {second.team.name}
            </div>
            <div className="podium-block h-24 bg-gradient-to-t from-zinc-800 to-zinc-700 rounded-t-lg"></div>
          </div>
        )}
        {first && (
          <div className="podium-place first flex-1">
            <div className="podium-medal text-3xl mb-2">🏆</div>
            <div className="podium-team font-bold text-lg mb-4 truncate px-2 text-success">
              {first.team.name}
            </div>
            <div className="podium-block h-40 bg-gradient-to-t from-success/40 to-success/20 rounded-t-lg border-t-4 border-success"></div>
          </div>
        )}
        {thirds[0] && (
          <div className="podium-place third flex-1">
            <div className="podium-medal text-lg font-bold mb-2">3</div>
            <div className="podium-team text-sm mb-4 truncate px-2">
              {thirds[0].team.name}
            </div>
            <div className="podium-block h-16 bg-gradient-to-t from-warn-800 to-warn-700 rounded-t-lg"></div>
          </div>
        )}
      </div>
    </div>
  );
};

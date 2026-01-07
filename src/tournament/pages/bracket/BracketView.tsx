import React, { useMemo } from "react";
import { useTournament } from "@/context/TournamentContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import {
  Bracket,
  DualBracket,
  SingleBracket,
  BracketMatch,
  updateMatchResult,
} from "@/tournament/bracket/bracketCore";
import { BracketScoreModal } from "./BracketScoreModal";

function getRoundName(round: number, totalRounds: number): string {
  const remaining = totalRounds - round + 1;
  if (remaining === 1) return "FINAL";
  if (remaining === 2) return "SEMI-FINALS";
  if (remaining === 3) return "QUARTER-FINALS";
  return `ROUND ${round}`;
}

interface MatchProps {
  match: BracketMatch;
  onClick: (matchId: number) => void;
  editable?: boolean;
}

const Match: React.FC<MatchProps> = ({ match, onClick, editable = true }) => {
  const isEditable = editable && match.team1 && match.team2;

  return (
    <div
      className={`bg-elevated border border-theme rounded-lg p-3 mb-2 min-w-36 transition-colors ${
        isEditable ? "cursor-pointer hover:border-accent" : ""
      }`}
      onClick={() => isEditable && onClick(match.id)}
    >
      <div
        className={`flex justify-between py-1 ${
          match.winner?.id === match.team1?.id
            ? "font-semibold text-success"
            : "text-primary"
        }`}
      >
        <span>{match.team1?.name || "TBD"}</span>
        <span className="text-accent">{match.score1 ?? "-"}</span>
      </div>
      <div
        className={`flex justify-between py-1 ${
          match.winner?.id === match.team2?.id
            ? "font-semibold text-success"
            : "text-primary"
        }`}
      >
        <span>{match.team2?.name || "TBD"}</span>
        <span className="text-accent">{match.score2 ?? "-"}</span>
      </div>
    </div>
  );
};

interface RoundProps {
  matches: BracketMatch[];
  roundNum: number;
  totalRounds: number;
  onMatchClick: (matchId: number) => void;
}

const Round: React.FC<RoundProps> = ({
  matches,
  roundNum,
  totalRounds,
  onMatchClick,
}) => (
  <div className="flex flex-col items-center">
    <div className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
      {getRoundName(roundNum, totalRounds)}
    </div>
    <div className="flex flex-col gap-4">
      {matches.map((m) => (
        <Match key={m.id} match={m} onClick={onMatchClick} />
      ))}
    </div>
  </div>
);

interface SingleBracketViewProps {
  bracket: SingleBracket;
  onMatchClick: (matchId: number) => void;
}

const SingleBracketView: React.FC<SingleBracketViewProps> = ({
  bracket,
  onMatchClick,
}) => {
  const rounds = useMemo(() => {
    const grouped: { [round: number]: BracketMatch[] } = {};
    bracket.matches.forEach((m) => {
      if (!grouped[m.round]) grouped[m.round] = [];
      grouped[m.round].push(m);
    });
    return Object.entries(grouped).map(([round, matches]) => ({
      roundNum: parseInt(round),
      matches,
    }));
  }, [bracket.matches]);

  return (
    <div className="flex gap-8 overflow-x-auto p-4 justify-center">
      {rounds.map(({ roundNum, matches }) => (
        <Round
          key={roundNum}
          matches={matches}
          roundNum={roundNum}
          totalRounds={bracket.numRounds}
          onMatchClick={onMatchClick}
        />
      ))}
    </div>
  );
};

interface DualBracketViewProps {
  bracket: DualBracket;
  onMatchClick: (matchId: number) => void;
}

const DualBracketView: React.FC<DualBracketViewProps> = ({
  bracket,
  onMatchClick,
}) => {
  const roundsA = useMemo(() => {
    const grouped: { [round: number]: BracketMatch[] } = {};
    bracket.matchesA.forEach((m) => {
      if (!grouped[m.round]) grouped[m.round] = [];
      grouped[m.round].push(m);
    });
    return Object.entries(grouped).map(([round, matches]) => ({
      roundNum: parseInt(round),
      matches,
    }));
  }, [bracket.matchesA]);

  const roundsB = useMemo(() => {
    const grouped: { [round: number]: BracketMatch[] } = {};
    bracket.matchesB.forEach((m) => {
      if (!grouped[m.round]) grouped[m.round] = [];
      grouped[m.round].push(m);
    });
    return Object.entries(grouped).map(([round, matches]) => ({
      roundNum: parseInt(round),
      matches,
    }));
  }, [bracket.matchesB]);

  return (
    <div className="flex gap-6 flex-wrap justify-center p-4">
      {/* Side A */}
      <div className="flex-1 min-w-72 max-w-md border-2 border-accent/30 rounded-xl p-4 bg-accent/5">
        <div className="text-center mb-4">
          <span className="font-bold text-accent">Side A</span>
          <span className="text-xs text-muted ml-2">
            ({bracket.teamsA.length} teams)
          </span>
        </div>
        <div className="flex gap-6 overflow-x-auto justify-center">
          {roundsA.map(({ roundNum, matches }) => (
            <Round
              key={roundNum}
              matches={matches}
              roundNum={roundNum}
              totalRounds={bracket.numRoundsA}
              onMatchClick={onMatchClick}
            />
          ))}
        </div>
      </div>

      {/* Grand Final */}
      {bracket.grandFinal && (
        <div className="flex flex-col items-center justify-center p-6">
          <div className="text-xs text-success font-bold mb-4">
            🏆 GRAND FINAL 🏆
          </div>
          <Match match={bracket.grandFinal} onClick={onMatchClick} />
        </div>
      )}

      {/* Side B */}
      <div className="flex-1 min-w-72 max-w-md border-2 border-warning/30 rounded-xl p-4 bg-warning/5">
        <div className="text-center mb-4">
          <span className="font-bold text-warning">Side B</span>
          <span className="text-xs text-muted ml-2">
            ({bracket.teamsB.length} teams)
          </span>
        </div>
        <div className="flex flex-row-reverse gap-6 overflow-x-auto justify-center">
          {roundsB.map(({ roundNum, matches }) => (
            <Round
              key={roundNum}
              matches={matches}
              roundNum={roundNum}
              totalRounds={bracket.numRoundsB}
              onMatchClick={onMatchClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const BracketView: React.FC = () => {
  const { state, dispatch } = useTournament();
  const navigate = useNavigate();
  const [selectedMatchId, setSelectedMatchId] = React.useState<number | null>(
    null
  );

  const bracket = state.bracket as Bracket | null;

  const handleMatchClick = (matchId: number) => {
    setSelectedMatchId(matchId);
  };

  const handleScoreSave = (score1: number, score2: number) => {
    if (selectedMatchId === null || !bracket) return;

    const updatedBracket = updateMatchResult(
      bracket,
      selectedMatchId,
      score1,
      score2
    );
    dispatch({ type: "SET_BRACKET", bracket: updatedBracket });
    setSelectedMatchId(null);
  };

  const handleClear = () => {
    dispatch({ type: "CLEAR_BRACKET" });
  };

  const selectedMatch = useMemo(() => {
    if (!bracket || selectedMatchId === null) return null;

    if (bracket.isDualBracket) {
      const dual = bracket as DualBracket;
      return (
        dual.matchesA.find((m) => m.id === selectedMatchId) ||
        dual.matchesB.find((m) => m.id === selectedMatchId) ||
        (dual.grandFinal?.id === selectedMatchId ? dual.grandFinal : null)
      );
    } else {
      const single = bracket as SingleBracket;
      return single.matches.find((m) => m.id === selectedMatchId) || null;
    }
  }, [bracket, selectedMatchId]);

  if (!bracket) {
    return (
      <div className="min-h-screen py-8">
        <div className="text-center max-w-lg mx-auto mb-8 px-4">
          <h2 className="text-3xl font-bold text-primary mb-2">
            Tournament Bracket
          </h2>
          <p className="text-secondary">No bracket created yet.</p>
        </div>
        <div className="flex justify-center">
          <Button onClick={() => navigate("/tournament/bracket/setup")}>
            Create Bracket
          </Button>
        </div>
      </div>
    );
  }

  const subtitle = bracket.isDualBracket
    ? `Side A vs Side B${
        (bracket as DualBracket).hasSharedFinal
          ? " • Winners meet in Grand Final"
          : ""
      }`
    : `${bracket.teams.length} teams • Single Elimination`;

  return (
    <div className="min-h-screen py-8">
      {/* Header */}
      <div className="text-center max-w-lg mx-auto mb-8 px-4">
        <h2 className="text-3xl font-bold text-primary mb-2">
          Tournament Bracket
        </h2>
        <p className="text-secondary">{subtitle}</p>
      </div>

      {/* Actions */}
      <div className="flex justify-center items-center gap-4 mb-8 flex-wrap">
        <Button variant="secondary" size="sm" onClick={() => window.print()}>
          Print
        </Button>
        <Button variant="danger" size="sm" onClick={handleClear}>
          Clear
        </Button>
      </div>

      {/* Bracket */}
      {bracket.isDualBracket ? (
        <DualBracketView
          bracket={bracket as DualBracket}
          onMatchClick={handleMatchClick}
        />
      ) : (
        <SingleBracketView
          bracket={bracket as SingleBracket}
          onMatchClick={handleMatchClick}
        />
      )}

      {/* Score Modal */}
      {selectedMatch && (
        <BracketScoreModal
          match={selectedMatch}
          onClose={() => setSelectedMatchId(null)}
          onSave={handleScoreSave}
        />
      )}
    </div>
  );
};

export default BracketView;

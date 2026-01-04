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

// ============ HELPERS ============

function getRoundName(round: number, totalRounds: number): string {
  const remaining = totalRounds - round + 1;
  if (remaining === 1) return "FINAL";
  if (remaining === 2) return "SEMI-FINALS";
  if (remaining === 3) return "QUARTER-FINALS";
  return `ROUND ${round}`;
}

// ============ MATCH COMPONENT ============

interface MatchProps {
  match: BracketMatch;
  onClick: (matchId: number) => void;
  editable?: boolean;
}

const Match: React.FC<MatchProps> = ({ match, onClick, editable = true }) => {
  const isEditable = editable && match.team1 && match.team2;

  return (
    <div
      className={`bracket-match ${isEditable ? "editable" : ""}`}
      onClick={() => isEditable && onClick(match.id)}
      style={{
        background: "var(--bg-tertiary)",
        border: "1px solid var(--border-color)",
        borderRadius: "8px",
        padding: "8px 12px",
        marginBottom: "8px",
        cursor: isEditable ? "pointer" : "default",
        minWidth: "140px",
      }}
    >
      <div
        className={`match-team ${
          match.winner?.id === match.team1?.id ? "winner" : ""
        }`}
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "4px 0",
          fontWeight: match.winner?.id === match.team1?.id ? 600 : 400,
          color:
            match.winner?.id === match.team1?.id
              ? "var(--success)"
              : "var(--text-primary)",
        }}
      >
        <span>{match.team1?.name || "TBD"}</span>
        <span style={{ color: "var(--accent)" }}>{match.score1 ?? "-"}</span>
      </div>
      <div
        className={`match-team ${
          match.winner?.id === match.team2?.id ? "winner" : ""
        }`}
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "4px 0",
          fontWeight: match.winner?.id === match.team2?.id ? 600 : 400,
          color:
            match.winner?.id === match.team2?.id
              ? "var(--success)"
              : "var(--text-primary)",
        }}
      >
        <span>{match.team2?.name || "TBD"}</span>
        <span style={{ color: "var(--accent)" }}>{match.score2 ?? "-"}</span>
      </div>
    </div>
  );
};

// ============ ROUND COMPONENT ============

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
  <div
    className="bracket-round"
    style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
  >
    <div
      className="round-header"
      style={{
        fontSize: "0.75rem",
        fontWeight: 600,
        color: "var(--text-muted)",
        textTransform: "uppercase",
        marginBottom: "12px",
        letterSpacing: "0.05em",
      }}
    >
      {getRoundName(roundNum, totalRounds)}
    </div>
    <div
      className="round-matches"
      style={{ display: "flex", flexDirection: "column", gap: "16px" }}
    >
      {matches.map((m) => (
        <Match key={m.id} match={m} onClick={onMatchClick} />
      ))}
    </div>
  </div>
);

// ============ SINGLE BRACKET VIEW ============

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
    <div
      className="single-bracket-view"
      style={{
        display: "flex",
        gap: "32px",
        overflowX: "auto",
        padding: "16px",
        justifyContent: "center",
      }}
    >
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

// ============ DUAL BRACKET VIEW ============

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
    <div
      className="dual-bracket-view"
      style={{
        display: "flex",
        gap: "24px",
        flexWrap: "wrap",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      {/* Side A */}
      <div
        className="bracket-side side-a"
        style={{
          flex: 1,
          minWidth: "280px",
          maxWidth: "400px",
          border: "2px solid rgba(59, 130, 246, 0.3)",
          borderRadius: "12px",
          padding: "16px",
          background: "rgba(59, 130, 246, 0.05)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <span style={{ fontWeight: "bold", color: "var(--accent)" }}>
            Side A
          </span>
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              marginLeft: "8px",
            }}
          >
            ({bracket.teamsA.length} teams)
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: "24px",
            overflowX: "auto",
            justifyContent: "center",
          }}
        >
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
        <div
          className="bracket-final"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--success)",
              fontWeight: "bold",
              marginBottom: "16px",
            }}
          >
            🏆 GRAND FINAL 🏆
          </div>
          <Match match={bracket.grandFinal} onClick={onMatchClick} />
        </div>
      )}

      {/* Side B */}
      <div
        className="bracket-side side-b"
        style={{
          flex: 1,
          minWidth: "280px",
          maxWidth: "400px",
          border: "2px solid rgba(245, 158, 11, 0.3)",
          borderRadius: "12px",
          padding: "16px",
          background: "rgba(245, 158, 11, 0.05)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <span style={{ fontWeight: "bold", color: "var(--warning)" }}>
            Side B
          </span>
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              marginLeft: "8px",
            }}
          >
            ({bracket.teamsB.length} teams)
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            gap: "24px",
            overflowX: "auto",
            justifyContent: "center",
          }}
        >
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

// ============ MAIN VIEW ============

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

    // Update bracket using pure function
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

  // No bracket - show setup prompt
  if (!bracket) {
    return (
      <div className="bracket-page tournament-page">
        <div className="bracket-view-container min-h-screen py-8">
          <div className="page-intro-header text-center max-w-[600px] mx-auto mb-8 px-4">
            <h2 className="text-3xl mb-1 text-white">Tournament Bracket</h2>
            <p className="text-text-muted">No bracket created yet.</p>
          </div>
          <div className="flex justify-center">
            <Button onClick={() => navigate("/tournament/bracket/setup")}>
              Create Bracket
            </Button>
          </div>
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
    <div className="bracket-page tournament-page">
      <div className="bracket-view-container min-h-screen py-8">
        {/* Header */}
        <div className="page-intro-header text-center max-w-[600px] mx-auto mb-8 px-4">
          <h2 className="text-3xl mb-1 text-white">Tournament Bracket</h2>
          <p className="text-text-muted">{subtitle}</p>
        </div>

        {/* Actions */}
        <div className="bracket-actions flex justify-center items-center gap-4 mb-8 flex-wrap">
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
    </div>
  );
};

export default BracketView;

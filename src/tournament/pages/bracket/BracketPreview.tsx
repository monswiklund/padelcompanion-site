import React from "react";

interface BracketPreviewProps {
  teamCount: number;
  bracketCount?: number;
  sharedFinal?: boolean;
}

export const BracketPreview: React.FC<BracketPreviewProps> = ({
  teamCount,
  bracketCount = 1,
  sharedFinal = true,
}) => {
  const numRounds = Math.ceil(Math.log2(teamCount));
  const nextPower = Math.pow(2, numRounds);
  const byeCount = nextPower - teamCount;

  const roundNames = ["R1", "R2", "QF", "SF", "Final"];

  const getRoundLabel = (roundNum: number, total: number) => {
    const fromEnd = total - roundNum;
    if (fromEnd === 0) return "Final";
    if (fromEnd === 1) return "Semi-Finals";
    if (fromEnd === 2) return "Quarter-Finals";
    return `Round ${roundNum}`;
  };

  return (
    <div className="bracket-preview">
      <div className="bracket-preview__header">
        <span className="bracket-preview__title">Preview</span>
        {byeCount > 0 && (
          <span className="bracket-preview__warning">
            ⚠️ {byeCount} bye{byeCount > 1 ? "s" : ""} needed
          </span>
        )}
      </div>

      <div className="bracket-preview__flow">
        {Array.from({ length: numRounds }, (_, i) => i + 1).map((round) => (
          <React.Fragment key={round}>
            <div className="bracket-preview__round">
              <span className="bracket-preview__round-label">
                {getRoundLabel(round, numRounds)}
              </span>
              <div className="bracket-preview__boxes">
                {Array.from(
                  { length: Math.pow(2, numRounds - round) },
                  (_, j) => (
                    <div key={j} className="bracket-preview__box" />
                  )
                )}
              </div>
            </div>
            {round < numRounds && (
              <span className="bracket-preview__arrow">→</span>
            )}
          </React.Fragment>
        ))}
        <span className="bracket-preview__trophy">🏆</span>
      </div>

      {bracketCount > 1 && (
        <div className="bracket-preview__multi">
          <span>
            {bracketCount} pools {sharedFinal ? "with shared final" : ""}
          </span>
        </div>
      )}
    </div>
  );
};

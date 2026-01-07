import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/shared/utils";
import { useTournament } from "@/context/TournamentContext";

interface BracketScoreModalProps {
  match: any;
  onClose: () => void;
  onSave: (score1: number, score2: number) => void;
}

export const BracketScoreModal: React.FC<BracketScoreModalProps> = ({
  match,
  onClose,
  onSave,
}) => {
  const { state } = useTournament();
  const [score1, setScore1] = useState<string>(match.score1?.toString() || "");
  const [score2, setScore2] = useState<string>(match.score2?.toString() || "");

  const savedScoreType = state.bracketConfig?.scoreType || "points";
  const scoreTypeLabel =
    savedScoreType.charAt(0).toUpperCase() + savedScoreType.slice(1);

  const handleSave = () => {
    const s1 = parseInt(score1 || "0");
    const s2 = parseInt(score2 || "0");

    if (s1 === s2) {
      showToast("Scores cannot be tied in elimination", "error");
      return;
    }

    onSave(s1, s2);
    showToast("Match saved!", "success");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-card border border-theme rounded-2xl w-full max-w-md mx-4 overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-theme">
          <h3 className="text-xl font-bold text-primary">Enter Score</h3>
          <button
            className="text-muted hover:text-primary transition-colors"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="text-center text-sm text-muted mb-6">
            Scoring:{" "}
            <span className="text-accent font-medium">{scoreTypeLabel}</span>
          </div>

          <div className="flex items-center gap-4 justify-center">
            {/* Team 1 */}
            <div className="flex-1 max-w-32 text-center">
              <div className="text-sm font-medium text-primary mb-2 truncate">
                {match.team1?.name || "Team 1"}
              </div>
              <input
                type="number"
                className="w-full h-16 text-center text-3xl font-bold bg-elevated border border-theme rounded-xl text-primary focus:outline-none focus:border-accent"
                value={score1}
                onChange={(e) => setScore1(e.target.value)}
                min="0"
                max="99"
                placeholder="0"
                autoFocus
              />
            </div>

            <div className="text-lg font-bold text-muted">VS</div>

            {/* Team 2 */}
            <div className="flex-1 max-w-32 text-center">
              <div className="text-sm font-medium text-primary mb-2 truncate">
                {match.team2?.name || "Team 2"}
              </div>
              <input
                type="number"
                className="w-full h-16 text-center text-3xl font-bold bg-elevated border border-theme rounded-xl text-primary focus:outline-none focus:border-accent"
                value={score2}
                onChange={(e) => setScore2(e.target.value)}
                min="0"
                max="99"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-theme bg-elevated/30">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Score</Button>
        </div>
      </div>
    </div>
  );
};

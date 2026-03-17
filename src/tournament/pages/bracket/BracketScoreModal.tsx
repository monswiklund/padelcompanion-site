import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog"; // New Dialog
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
  const score2Ref = useRef<HTMLInputElement>(null);

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
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: "score1" | "score2") => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (field === "score1") {
        score2Ref.current?.focus();
      } else {
        handleSave();
      }
    }
  };

  return (
    <Dialog
      isOpen={true}
      onClose={onClose}
      title="Enter Score"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Score</Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="text-center text-sm text-muted-foreground">
          Scoring:{" "}
          <span className="text-accent font-medium">{scoreTypeLabel}</span>
        </div>

        <div className="flex items-center gap-6 justify-center">
          {/* Team 1 */}
          <div className="flex-1 text-center">
            <div className="text-sm font-bold text-foreground mb-2 truncate px-2">
              {match.team1?.name || "Team 1"}
            </div>
            <input
              type="number"
              className="w-full h-20 text-center text-4xl font-bold bg-black/20 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              value={score1}
              onChange={(e) => setScore1(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "score1")}
              min="0"
              max="99"
              placeholder="0"
              autoFocus
            />
          </div>

          <div className="text-xl font-bold text-muted-foreground pt-6">VS</div>

          {/* Team 2 */}
          <div className="flex-1 text-center">
            <div className="text-sm font-bold text-foreground mb-2 truncate px-2">
              {match.team2?.name || "Team 2"}
            </div>
            <input
              ref={score2Ref}
              type="number"
              className="w-full h-20 text-center text-4xl font-bold bg-black/20 border border-white/10 rounded-xl text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              value={score2}
              onChange={(e) => setScore2(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, "score2")}
              min="0"
              max="99"
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};

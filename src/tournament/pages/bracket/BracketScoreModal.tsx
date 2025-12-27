import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { StorageService } from "@/shared/storage.js";
import { showToast } from "@/shared/utils.js";

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
  const [score1, setScore1] = useState<string>(match.score1?.toString() || "");
  const [score2, setScore2] = useState<string>(match.score2?.toString() || "");

  const savedScoreType = StorageService.getItem("bracket_score_type", "points");
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
  };

  return (
    <div
      className="modal-overlay"
      style={{ display: "flex" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal score-modal">
        <div className="modal-header">
          <h3>Enter Score</h3>
          <button className="close-modal" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="modal-body">
          <div
            className="score-type-label"
            style={{
              textAlign: "center",
              marginBottom: "12px",
              fontSize: "0.85rem",
              color: "var(--text-muted)",
            }}
          >
            Scoring:{" "}
            <strong style={{ color: "var(--accent)" }}>{scoreTypeLabel}</strong>
          </div>
          <div className="score-entry-cards">
            <div className="score-card">
              <div className="score-card-team">{match.team1Name}</div>
              <input
                type="number"
                className="form-input score-input"
                value={score1}
                onChange={(e) => setScore1(e.target.value)}
                min="0"
                max="99"
                placeholder="0"
                autoFocus
              />
            </div>
            <div className="score-divider">VS</div>
            <div className="score-card">
              <div className="score-card-team">{match.team2Name}</div>
              <input
                type="number"
                className="form-input score-input"
                value={score2}
                onChange={(e) => setScore2(e.target.value)}
                min="0"
                max="99"
                placeholder="0"
              />
            </div>
          </div>
        </div>
        <div className="modal-actions">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Score</Button>
        </div>
      </div>
    </div>
  );
};

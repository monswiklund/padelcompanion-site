import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/shared/utils";

interface Pair {
  id: string;
  player1Id: string;
  player2Id: string;
}

interface Player {
  id: string;
  name: string;
}

interface PreferredPartnersProps {
  pairs: Pair[];
  players: Player[];
  onAddPair: (p1Id: string, p2Id: string) => void;
  onRemovePair: (pairId: string) => void;
}

export const PreferredPartners: React.FC<PreferredPartnersProps> = ({
  pairs,
  players,
  onAddPair,
  onRemovePair,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [p1, setP1] = useState<string>("");
  const [p2, setP2] = useState<string>("");

  const getAvailablePlayers = (currentSelection: string | null) => {
    const pairedIds = new Set<string>();
    pairs.forEach((p) => {
      pairedIds.add(p.player1Id);
      pairedIds.add(p.player2Id);
    });

    return players.filter(
      (p) => !pairedIds.has(p.id) || p.id === currentSelection
    );
  };

  const handleAdd = () => {
    if (p1 && p2 && p1 !== p2) {
      onAddPair(p1, p2);
      showToast("Partner pair added", "success");
      setP1("");
      setP2("");
      setIsAdding(false);
    }
  };

  const getPlayerName = (id: string) =>
    players.find((p) => p.id === id)?.name || "Unknown";

  return (
    <div className="mt-4 pt-4 border-t border-theme">
      {!isAdding && pairs.length === 0 && (
        <div className="text-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsAdding(true)}
          >
            + Add Fixed Pair
          </Button>
        </div>
      )}

      {(isAdding || pairs.length > 0) && (
        <div className="bg-elevated rounded-xl p-4 border border-theme">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-muted uppercase tracking-wider">
              Fixed Pairs
            </h4>
            {!isAdding && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsAdding(true)}
              >
                Add
              </Button>
            )}
          </div>

          {/* List */}
          {pairs.length > 0 && (
            <ul className="mb-4 space-y-2">
              {pairs.map((pair) => (
                <li
                  key={pair.id}
                  className="flex items-center justify-between bg-black/20 p-2.5 px-3 rounded-lg"
                >
                  <span className="text-sm font-medium text-accent-light">
                    {getPlayerName(pair.player1Id)} &{" "}
                    {getPlayerName(pair.player2Id)}
                  </span>
                  <button
                    className="text-muted hover:text-error font-bold transition-colors"
                    onClick={() => {
                      onRemovePair(pair.id);
                      showToast("Partner pair removed", "info");
                    }}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Add Form */}
          {isAdding && (
            <div className="bg-black/20 p-3 rounded-lg border border-theme animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <select
                  className="flex-1 bg-white/5 text-sm p-2 rounded-lg border border-theme text-primary focus:outline-none focus:border-accent"
                  value={p1}
                  onChange={(e) => setP1(e.target.value)}
                >
                  <option value="">Select Player 1...</option>
                  {getAvailablePlayers(p1)
                    .filter((p) => p.id !== p2)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                </select>
                <span className="text-muted font-bold">&</span>
                <select
                  className="flex-1 bg-white/5 text-sm p-2 rounded-lg border border-theme text-primary focus:outline-none focus:border-accent"
                  value={p2}
                  onChange={(e) => setP2(e.target.value)}
                >
                  <option value="">Select Player 2...</option>
                  {getAvailablePlayers(p2)
                    .filter((p) => p.id !== p1)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </Button>
                <Button size="sm" disabled={!p1 || !p2} onClick={handleAdd}>
                  Confirm Pair
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

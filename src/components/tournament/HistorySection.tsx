import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useTournament } from "@/context/TournamentContext";
import { getHistory, deleteFromHistory } from "@/tournament/history/repository";
import { exportTournamentData } from "@/tournament/ui/setup/exportShare";
import { showToast } from "@/shared/utils";
import { showConfirmModal } from "@/tournament/core/modals";

interface HistoryItem {
  id: string;
  savedAt: string;
  summary: {
    name: string;
    notes: string;
    format: string;
    winner: string;
    playerCount: number;
    roundCount: number;
  };
  data: any;
}

export const HistorySection: React.FC = () => {
  const { dispatch } = useTournament();
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const data = getHistory();
    setHistory(data);
  };

  const getTargetRoute = (data: any): string => {
    if (data.winnersCourt) {
      return "/tournament/winners-court";
    }
    if (data.bracket) {
      return "/tournament/bracket";
    }
    return "/tournament/generator";
  };

  const handleLoad = (item: HistoryItem) => {
    showConfirmModal(
      "Load Tournament",
      `This will overwrite your current progress with "${
        item.summary.name || "Untitled"
      }". Continue?`,
      "Load",
      () => {
        dispatch({ type: "SET_STATE", payload: item.data });
        showToast("Tournament loaded");
        const targetRoute = getTargetRoute(item.data);
        navigate(targetRoute);
      }
    );
  };

  const handleDelete = (id: string, name: string) => {
    showConfirmModal(
      "Delete History",
      `Are you sure you want to delete "${name || "this tournament"}"?`,
      "Delete",
      () => {
        deleteFromHistory(id);
        loadHistory();
        showToast("Item deleted");
      },
      true
    );
  };

  const filteredHistory = history.filter((item) => {
    const query = search.toLowerCase();
    return (
      item.summary.name.toLowerCase().includes(query) ||
      item.summary.winner.toLowerCase().includes(query) ||
      item.summary.format.toLowerCase().includes(query)
    );
  });

  if (history.length === 0) return null;

  return (
    <section className="px-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-primary mb-1">
            Tournament History
          </h3>
          <p className="text-sm text-muted">
            Your past {history.length} tournaments
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search history..."
            className="w-full px-4 py-2 rounded-lg bg-elevated border border-theme text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-theme rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-theme">
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3">
                  Date
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3">
                  Tournament
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3 hidden sm:table-cell">
                  Format
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                  Winner
                </th>
                <th className="text-left text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3 hidden lg:table-cell">
                  Players
                </th>
                <th className="text-right text-xs font-semibold text-muted uppercase tracking-wider px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-theme last:border-b-0 hover:bg-elevated/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-secondary">
                    {new Date(item.savedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-primary">
                      {item.summary.name || "Untitled Tournament"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted capitalize hidden sm:table-cell">
                    {item.summary.format}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-accent-light font-medium">
                      🏆 {item.summary.winner}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted hidden lg:table-cell">
                    {item.summary.playerCount} players ·{" "}
                    {item.summary.roundCount} rounds
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLoad(item)}
                      >
                        Load
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const data = exportTournamentData();
                          const blob = new Blob([data], {
                            type: "application/json",
                          });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `${
                            item.summary.name || "tournament"
                          }.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        title="Download"
                      >
                        📥
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id, item.summary.name)}
                        className="text-error hover:bg-error/10"
                      >
                        ×
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredHistory.length === 0 && (
          <div className="py-12 text-center text-muted">
            No history found matching "{search}"
          </div>
        )}
      </div>
    </section>
  );
};

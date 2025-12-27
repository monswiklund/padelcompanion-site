import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useTournament } from "@/context/TournamentContext";
import {
  getHistory,
  deleteFromHistory,
} from "@/tournament/history/repository.js";
import { exportTournamentData } from "@/tournament/ui/setup/exportShare.js";
import { showToast } from "@/shared/utils";
import { showConfirmModal } from "@/tournament/core/modals.js";

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
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const data = getHistory();
    setHistory(data);
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
        window.scrollTo({ top: 0, behavior: "smooth" });
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
    <section className="history-section mt-12 mb-20 animate-fade-in px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">
            Tournament History
          </h3>
          <p className="text-text-muted text-sm">
            Your past {history.length} tournaments
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search history..."
            className="w-full bg-bg-secondary border border-white/10 rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-500 transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/5 bg-bg-secondary/30">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="bg-white/5 text-text-muted font-medium border-b border-white/5">
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Tournament</th>
              <th className="px-6 py-4">Format</th>
              <th className="px-6 py-4">Winner</th>
              <th className="px-6 py-4">Players</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredHistory.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-white/5 transition-colors group"
              >
                <td className="px-6 py-4">
                  {new Date(item.savedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-white">
                    {item.summary.name || "Untitled Tournament"}
                  </span>
                </td>
                <td className="px-6 py-4 capitalize text-text-muted">
                  {item.summary.format}
                </td>
                <td className="px-6 py-4">
                  <span className="text-blue-400 font-medium">
                    🏆 {item.summary.winner}
                  </span>
                </td>
                <td className="px-6 py-4 text-text-muted">
                  {item.summary.playerCount} players · {item.summary.roundCount}{" "}
                  rounds
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLoad(item)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Load
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => exportTournamentData(item.data)}
                      title="Download CSV"
                    >
                      📥
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id, item.summary.name)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredHistory.length === 0 && (
          <div className="p-12 text-center text-text-muted">
            No history found matching "{search}"
          </div>
        )}
      </div>
    </section>
  );
};

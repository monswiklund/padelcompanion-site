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
    // Check if it's a Winners Court tournament
    if (data.winnersCourt) {
      return "/tournament/winners-court";
    }
    // Check if it's a Bracket tournament
    if (data.bracket) {
      return "/tournament/bracket";
    }
    // Default to Generator (Americano/Mexicano)
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

        // Navigate to the appropriate page based on tournament type
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
    <section
      className="history-section animate-fade-in"
      style={{ padding: "0 var(--space-md)" }}
    >
      <div
        className="section-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-md)",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "var(--text-primary)",
              marginBottom: "4px",
            }}
          >
            Tournament History
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Your past {history.length} tournaments
          </p>
        </div>

        <div style={{ position: "relative", width: "100%", maxWidth: "250px" }}>
          <input
            type="text"
            placeholder="Search history..."
            className="form-input"
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "var(--radius-md)",
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="history-table-wrapper">
        <table className="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Tournament</th>
              <th>Format</th>
              <th>Winner</th>
              <th>Players</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((item) => (
              <tr key={item.id}>
                <td>{new Date(item.savedAt).toLocaleDateString()}</td>
                <td>
                  <span
                    style={{ fontWeight: 600, color: "var(--text-primary)" }}
                  >
                    {item.summary.name || "Untitled Tournament"}
                  </span>
                </td>
                <td
                  style={{
                    textTransform: "capitalize",
                    color: "var(--text-muted)",
                  }}
                >
                  {item.summary.format}
                </td>
                <td>
                  <span
                    style={{ color: "var(--accent-light)", fontWeight: 500 }}
                  >
                    🏆 {item.summary.winner}
                  </span>
                </td>
                <td style={{ color: "var(--text-muted)" }}>
                  {item.summary.playerCount} players · {item.summary.roundCount}{" "}
                  rounds
                </td>
                <td className="text-right">
                  <div className="action-buttons desktop-only">
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
                        // Download as file
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
                      title="Download CSV"
                    >
                      📥
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id, item.summary.name)}
                      style={{ color: "var(--error)" }}
                    >
                      ×
                    </Button>
                  </div>
                  {/* Mobile Actions could be added here if needed, but for now desktop-only class handles hiding */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredHistory.length === 0 && (
          <div
            style={{
              padding: "3rem",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            No history found matching "{search}"
          </div>
        )}
      </div>
    </section>
  );
};

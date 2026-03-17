import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useTournament } from "@/context/TournamentContext";
import { getHistory, deleteFromHistory } from "@/tournament/history/repository";
import {
  importTournamentData,
  downloadTournamentData,
} from "@/tournament/ui/setup/exportShare";
import { showToast } from "@/shared/utils";
import { showConfirmModal } from "@/tournament/core/modals";
import { Dialog } from "@/components/ui/Dialog";
import { CloudService } from "@/tournament/sync/cloud";
import { getTournamentRoute } from "@/tournament/navigation";

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
  const [isOpenByCode, setIsOpenByCode] = useState(false);
  const [shareCode, setShareCode] = useState("");
  const [isLoadingCode, setIsLoadingCode] = useState(false);

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
        const targetRoute = getTournamentRoute(item.data);
        navigate(targetRoute);
      }
    );
  };

  const applyImportedState = (data: any, successMessage: string) => {
    dispatch({ type: "SET_STATE", payload: data });
    showToast(successMessage, "success");
    navigate(getTournamentRoute(data));
  };

  const handleLoadByCode = async () => {
    const code = shareCode.trim();
    if (!code) {
      showToast("Enter a share code", "warning");
      return;
    }

    setIsLoadingCode(true);
    try {
      const snapshot = await CloudService.getSession(code);
      const restoredState = CloudService.restoreState(snapshot);
      applyImportedState(restoredState, "Tournament loaded from cloud");
      setIsOpenByCode(false);
      setShareCode("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load tournament";
      showToast(message, "error");
    } finally {
      setIsLoadingCode(false);
    }
  };

  const handleImportFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const text = await file.text();
      const restoredState = importTournamentData(text);
      applyImportedState(restoredState, "Tournament imported");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to import tournament";
      showToast(message, "error");
    }
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

  return (
    <section className="px-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1">
            Tournament History
          </h3>
          <p className="text-sm text-muted-foreground">
            Your past {history.length} tournaments
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search history..."
            className="w-full px-4 py-2 rounded-lg bg-popover border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsOpenByCode(true)}
        >
          Open with code
        </Button>
        <label className="inline-flex">
          <input
            type="file"
            accept="application/json"
            className="sr-only"
            onChange={handleImportFile}
          />
          <span className="px-3 py-1.5 text-sm rounded-lg font-medium transition-all duration-200 inline-flex items-center justify-center gap-2 bg-card hover:bg-popover border border-border text-foreground hover:border-accent/50 cursor-pointer">
            Import JSON
          </span>
        </label>
      </div>

      {history.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl px-6 py-10 text-center text-muted-foreground">
          No saved local history yet. You can still open a tournament with a share code or import a JSON backup.
        </div>
      ) : (
        <>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Date
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Tournament
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 hidden sm:table-cell">
                  Format
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                  Winner
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3 hidden lg:table-cell">
                  Players
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border last:border-b-0 hover:bg-popover/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(item.savedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-foreground">
                      {item.summary.name || "Untitled Tournament"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground capitalize hidden sm:table-cell">
                    {item.summary.format}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-accent-light font-medium">
                      🏆 {item.summary.winner}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">
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
                        onClick={() =>
                          downloadTournamentData(
                            `${item.summary.name || "tournament"}.json`,
                            item.data,
                          )
                        }
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
          <div className="py-12 text-center text-muted-foreground">
            No history found matching "{search}"
          </div>
        )}
      </div>
        </>
      )}

      <Dialog
        isOpen={isOpenByCode}
        onClose={() => {
          if (!isLoadingCode) {
            setIsOpenByCode(false);
          }
        }}
        title="Open Tournament"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setIsOpenByCode(false)}
              disabled={isLoadingCode}
            >
              Cancel
            </Button>
            <Button onClick={handleLoadByCode} disabled={isLoadingCode}>
              {isLoadingCode ? "Loading..." : "Open"}
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Enter the share code from another device to restore the tournament here.
          </p>
          <input
            type="text"
            placeholder="ABC123"
            className="w-full px-4 py-3 rounded-xl bg-popover border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors uppercase tracking-[0.2em]"
            value={shareCode}
            onChange={(e) => setShareCode(e.target.value.toUpperCase())}
          />
        </div>
      </Dialog>
    </section>
  );
};

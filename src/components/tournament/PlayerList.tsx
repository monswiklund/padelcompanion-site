import React, { useState, ReactNode } from "react";
import { StorageService } from "@/shared/storage";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/utils";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";

export type ViewMode = "list" | "grid";

export interface PlayerListProps<T extends { name: string }> {
  title?: string;
  singularTitle?: string;
  items: T[];
  onAdd: (name: string) => void;
  onRemove: (index: number) => void;
  onClear?: () => void;
  onImport?: (text: string) => void;
  importTitle?: string;
  importDescription?: ReactNode;
  importPlaceholder?: string;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  renderItem?: (item: T, index: number) => ReactNode;
  renderPrefix?: (item: T, index: number) => ReactNode;
  renderActions?: (item: T, index: number) => ReactNode;
  hintText?: ReactNode;
  maxItems?: number;
  showViewToggle?: boolean;
  defaultView?: ViewMode;
  renderInput?: ReactNode;
}

export function PlayerList<T extends { name: string }>({
  title = "Players",
  singularTitle = "Player",
  items,
  onAdd,
  onRemove,
  onClear,
  onImport,
  importTitle = "Import names",
  importDescription = "Paste one entry per line.",
  importPlaceholder = "Anna\nLisa\nMaja",
  onReorder,
  renderItem,
  renderPrefix,
  renderActions,
  hintText,
  maxItems = 100,
  showViewToggle = true,
  defaultView = "list",
  renderInput,
}: PlayerListProps<T>) {
  const [inputValue, setInputValue] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>(
    () =>
      (StorageService.getItem("player_list_view", defaultView) as ViewMode) ||
      defaultView,
  );
  const [showAll, setShowAll] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importValue, setImportValue] = useState("");

  const handleAdd = () => {
    const name = inputValue.trim();
    if (!name) return;
    if (items.length >= maxItems) return;
    onAdd(name);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const toggleView = (mode: ViewMode) => {
    setViewMode(mode);
    StorageService.setItem("player_list_view", mode);
  };

  const handleImport = () => {
    if (!onImport) return;
    setIsImportOpen(true);
  };

  const submitImport = () => {
    const text = importValue.trim();
    if (!text || !onImport) return;
    onImport(text);
    setImportValue("");
    setIsImportOpen(false);
  };

  const closeImport = () => {
    setIsImportOpen(false);
    setImportValue("");
  };

  // Drag and drop handlers simplified
  const handleDragStart = (index: number) => setDragIndex(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
  };

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    if (onReorder) onReorder(dragIndex, index);
    setDragIndex(null);
  };

  const handleDragEnd = () => setDragIndex(null);

  const displayItems = showAll ? items : items.slice(0, 10);
  const hasMore = items.length > 10;

  const defaultItemRenderer = (item: T, index: number) => (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      key={(item as any).id || index}
      className={cn(
        "flex items-center gap-2 py-2 px-3 transition-colors rounded-lg border border-transparent",
        "bg-white/5 hover:bg-white/10 hover:border-white/10",
        dragIndex === index && "opacity-50 ring-2 ring-accent",
      )}
      draggable={!!onReorder}
      onDragStart={() => handleDragStart(index)}
      onDragOver={(e) => handleDragOver(e, index)}
      onDrop={() => handleDrop(index)}
      onDragEnd={handleDragEnd}
    >
      {onReorder && (
        <span
          className="cursor-move text-muted-foreground hover:text-foreground text-xs p-1"
          title="Drag to reorder"
        >
          ⋮⋮
        </span>
      )}

      <span className="text-xs font-mono font-medium text-muted-foreground w-6 text-right">
        {index + 1}.
      </span>

      {renderPrefix && renderPrefix(item, index)}
      <span className="flex-1 font-medium text-foreground truncate text-sm">
        {item.name}
      </span>

      {renderActions && (
        <div className="flex items-center gap-1">
          {renderActions(item, index)}
        </div>
      )}

      <button
        className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-error hover:bg-error/10 rounded-full transition-all text-sm"
        onClick={() => onRemove(index)}
        title={`Remove ${item.name}`}
      >
        ×
      </button>
    </motion.li>
  );

  return (
    <div className="space-y-4">
      <Dialog
        isOpen={isImportOpen}
        onClose={closeImport}
        title={importTitle}
        width="lg"
        footer={
          <>
            <Button variant="ghost" onClick={closeImport}>
              Cancel
            </Button>
            <Button onClick={submitImport} disabled={!importValue.trim()}>
              Import
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">{importDescription}</div>
          <textarea
            className="min-h-56 w-full rounded-xl bg-popover border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-sm resize-y"
            placeholder={importPlaceholder}
            value={importValue}
            onChange={(e) => setImportValue(e.target.value)}
          />
        </div>
      </Dialog>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">
          {title}{" "}
          <span className="text-muted-foreground font-normal text-sm bg-muted px-2 py-0.5 rounded-full ml-1">
            {items.length}/{maxItems}
          </span>
        </h3>
        <div className="flex items-center gap-2">
          {onImport && (
            <button
              className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-popover border border-border rounded-lg transition-colors"
              onClick={handleImport}
            >
              Import
            </button>
          )}
          {onClear && items.length > 0 && (
            <button
              className="px-3 py-1.5 text-xs font-medium text-error hover:bg-error/10 border border-error/30 rounded-lg transition-colors"
              onClick={() => {
                if (confirm("Clear all players?")) onClear();
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Input Row */}
      {renderInput ?? (
        <div className="relative">
          <input
            type="text"
            className="w-full pl-4 pr-20 py-3 rounded-xl bg-popover border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all shadow-sm"
            placeholder={`Add ${singularTitle.toLowerCase()}...`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={items.length >= maxItems}
          />
          <button
            className="absolute right-1 top-1 bottom-1 px-4 bg-accent hover:bg-accent-dark text-white font-medium rounded-lg transition-colors disabled:opacity-0 disabled:pointer-events-none text-sm"
            onClick={handleAdd}
            disabled={!inputValue.trim() || items.length >= maxItems}
          >
            Add
          </button>
        </div>
      )}

      {/* View Toggle */}
      {showViewToggle && items.length > 0 && (
        <div className="flex justify-end gap-1">
          {/* Using simple buttons for view toggle */}
          <button
            title="List"
            onClick={() => toggleView("list")}
            className={cn(
              "p-1.5 rounded",
              viewMode === "list"
                ? "bg-accent/20 text-accent"
                : "text-muted-foreground",
            )}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </button>
          <button
            title="Grid"
            onClick={() => toggleView("grid")}
            className={cn(
              "p-1.5 rounded",
              viewMode === "grid"
                ? "bg-accent/20 text-accent"
                : "text-muted-foreground",
            )}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </button>
        </div>
      )}

      {/* Items List */}
      <ul
        className={cn(
          "space-y-2",
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 gap-2 space-y-0"
            : "",
        )}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {displayItems.map((item, idx) =>
            renderItem ? renderItem(item, idx) : defaultItemRenderer(item, idx),
          )}
        </AnimatePresence>
      </ul>

      {/* Show More/Less */}
      {hasMore && (
        <button
          className="w-full py-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-accent transition-colors"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show Less" : `Show All (${items.length})`}
        </button>
      )}

      {/* Hint */}
      {hintText && (
        <div className="mt-2 text-sm text-center bg-accent/5 border border-accent/10 rounded-lg py-2 px-3">
          {hintText}
        </div>
      )}
    </div>
  );
}

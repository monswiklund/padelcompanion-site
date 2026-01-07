import React, { useState, ReactNode } from "react";
import { StorageService } from "@/shared/storage";

export type ViewMode = "list" | "grid";

export interface PlayerListProps<T extends { name: string }> {
  title?: string;
  singularTitle?: string;
  items: T[];
  onAdd: (name: string) => void;
  onRemove: (index: number) => void;
  onClear?: () => void;
  onImport?: (text: string) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  renderItem?: (item: T, index: number) => ReactNode;
  renderPrefix?: (item: T, index: number) => ReactNode;
  renderActions?: (item: T, index: number) => ReactNode;
  hintText?: ReactNode;
  maxItems?: number;
  showViewToggle?: boolean;
  defaultView?: ViewMode;
}

export function PlayerList<T extends { name: string }>({
  title = "Players",
  singularTitle = "Player",
  items,
  onAdd,
  onRemove,
  onClear,
  onImport,
  onReorder,
  renderItem,
  renderPrefix,
  renderActions,
  hintText,
  maxItems = 100,
  showViewToggle = true,
  defaultView = "list",
}: PlayerListProps<T>) {
  const [inputValue, setInputValue] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>(
    () =>
      (StorageService.getItem("player_list_view", defaultView) as ViewMode) ||
      defaultView
  );
  const [showAll, setShowAll] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

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
    const text = prompt("Paste names (one per line):");
    if (text) onImport(text);
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
  };

  const handleDrop = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    if (onReorder) {
      onReorder(dragIndex, index);
    }
    setDragIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  const displayItems = showAll ? items : items.slice(0, 10);
  const hasMore = items.length > 10;

  const defaultItemRenderer = (item: T, index: number) => (
    <li
      key={(item as any).id || index}
      className={`flex items-center gap-2 py-1.5 px-2 transition-all hover:bg-white/5 rounded border-b border-white/[0.06] last:border-b-0 ${
        dragIndex === index ? "opacity-50 scale-95" : ""
      }`}
      draggable={!!onReorder}
      onDragStart={() => handleDragStart(index)}
      onDragOver={(e) => handleDragOver(e, index)}
      onDrop={() => handleDrop(index)}
      onDragEnd={handleDragEnd}
    >
      {onReorder && (
        <span
          className="cursor-grab text-muted hover:text-secondary text-xs"
          title="Drag to reorder"
        >
          ⋮⋮
        </span>
      )}

      <span className="text-xs font-medium text-muted min-w-[1.5rem]">
        {index + 1}.
      </span>

      {renderPrefix && renderPrefix(item, index)}
      <span className="flex-1 font-medium text-primary truncate text-sm">
        {item.name}
      </span>

      {renderActions && (
        <div className="flex items-center gap-1">
          {renderActions(item, index)}
        </div>
      )}

      <button
        className="w-5 h-5 flex items-center justify-center text-muted hover:text-error rounded transition-colors text-sm"
        onClick={() => onRemove(index)}
        title={`Remove ${item.name}`}
      >
        ×
      </button>
    </li>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-primary">
          {title}{" "}
          <span className="text-muted font-normal">({items.length})</span>
        </h3>
        <div className="flex items-center gap-2">
          {onImport && (
            <button
              className="px-3 py-1.5 text-sm font-medium text-secondary hover:text-primary bg-elevated border border-theme rounded-lg transition-colors"
              onClick={handleImport}
            >
              Import...
            </button>
          )}
          {onClear && items.length > 0 && (
            <button
              className="px-3 py-1.5 text-sm font-medium text-error hover:bg-error/10 border border-error/30 rounded-lg transition-colors"
              onClick={() => {
                if (confirm("Clear all?")) onClear();
              }}
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Input Row */}
      <div>
        <label className="block text-sm font-medium text-secondary mb-2">
          {singularTitle} Name
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2.5 rounded-xl bg-elevated border border-theme text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
            placeholder={`Enter ${singularTitle.toLowerCase()} name...`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={items.length >= maxItems}
          />
          <button
            className="px-5 py-2.5 bg-accent hover:bg-accent-dark text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAdd}
            disabled={!inputValue.trim() || items.length >= maxItems}
          >
            Add
          </button>
        </div>
      </div>

      {/* View Toggle */}
      {showViewToggle && items.length > 0 && (
        <div className="flex justify-end gap-1">
          <button
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
              viewMode === "list"
                ? "bg-accent text-white"
                : "bg-elevated text-muted hover:text-primary"
            }`}
            onClick={() => toggleView("list")}
            title="List view"
          >
            ☰
          </button>
          <button
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
              viewMode === "grid"
                ? "bg-accent text-white"
                : "bg-elevated text-muted hover:text-primary"
            }`}
            onClick={() => toggleView("grid")}
            title="Grid view (2 columns)"
          >
            ⊞
          </button>
        </div>
      )}

      {/* Items List */}
      <ul
        className={`space-y-2 ${
          viewMode === "grid" ? "grid grid-cols-2 gap-2 space-y-0" : ""
        }`}
      >
        {displayItems.map((item, idx) =>
          renderItem ? renderItem(item, idx) : defaultItemRenderer(item, idx)
        )}
      </ul>

      {/* Show More/Less */}
      {hasMore && (
        <button
          className="w-full py-2 text-center text-sm font-medium text-accent hover:text-accent-light transition-colors"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? `Show Less ▲` : `Show All (${items.length}) ▼`}
        </button>
      )}

      {/* Hint */}
      {hintText && (
        <div className="text-sm text-muted text-center">{hintText}</div>
      )}
    </div>
  );
}

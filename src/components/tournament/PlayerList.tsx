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

  // Drag and Drop handlers
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

  // Show first 10 items by default, or all if expanded
  const displayItems = showAll ? items : items.slice(0, 10);
  const hasMore = items.length > 10;

  const defaultItemRenderer = (item: T, index: number) => (
    <li
      key={(item as any).id || index}
      className={`player-card ${
        viewMode === "grid" ? "player-card--grid" : ""
      } ${dragIndex === index ? "player-card--dragging" : ""}`}
      draggable={!!onReorder}
      onDragStart={() => handleDragStart(index)}
      onDragOver={(e) => handleDragOver(e, index)}
      onDrop={() => handleDrop(index)}
      onDragEnd={handleDragEnd}
    >
      {onReorder && (
        <span className="player-card__drag-handle" title="Drag to reorder">
          ⋮⋮
        </span>
      )}

      {renderPrefix && renderPrefix(item, index)}

      {!renderPrefix && (
        <span className="player-card__number">{index + 1}.</span>
      )}
      <span className="player-card__name">{item.name}</span>

      {renderActions && (
        <div className="player-card__custom-actions">
          {renderActions(item, index)}
        </div>
      )}

      <button
        className="player-card__remove"
        onClick={() => onRemove(index)}
        title={`Remove ${item.name}`}
      >
        ×
      </button>
    </li>
  );

  return (
    <div className="player-list">
      {/* Header */}
      <div className="player-list__header">
        <h3 className="player-list__title">
          {title} <span className="player-list__count">({items.length})</span>
        </h3>
        <div className="player-list__actions">
          {onImport && (
            <button
              className="btn btn--sm btn--secondary"
              onClick={handleImport}
            >
              Import...
            </button>
          )}
          {onClear && items.length > 0 && (
            <button
              className="btn btn--sm btn--danger"
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
      <div className="player-list__input-row">
        <label className="player-list__input-label">{singularTitle} Name</label>
        <div className="player-list__input-group">
          <input
            type="text"
            className="player-list__input"
            placeholder={`Enter ${singularTitle.toLowerCase()} name...`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={items.length >= maxItems}
          />
          <button
            className="btn btn--primary player-list__add-btn"
            onClick={handleAdd}
            disabled={!inputValue.trim() || items.length >= maxItems}
          >
            Add
          </button>
        </div>
      </div>

      {/* View Toggle */}
      {showViewToggle && items.length > 0 && (
        <div className="player-list__view-toggle">
          <button
            className={`view-toggle-btn ${
              viewMode === "list" ? "view-toggle-btn--active" : ""
            }`}
            onClick={() => toggleView("list")}
            title="List view"
          >
            ☰
          </button>
          <button
            className={`view-toggle-btn ${
              viewMode === "grid" ? "view-toggle-btn--active" : ""
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
        className={`player-list__items ${
          viewMode === "grid" ? "player-list__items--grid" : ""
        }`}
      >
        {displayItems.map((item, idx) =>
          renderItem ? renderItem(item, idx) : defaultItemRenderer(item, idx)
        )}
      </ul>

      {/* Show More/Less */}
      {hasMore && (
        <button
          className="player-list__show-more"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? `Show Less ▲` : `Show All (${items.length}) ▼`}
        </button>
      )}

      {/* Hint */}
      {hintText && <div className="player-list__hint">{hintText}</div>}
    </div>
  );
}

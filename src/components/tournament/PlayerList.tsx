import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

export interface PlayerListProps<T> {
  items: T[];
  onAdd: (name: string) => void;
  onRemove: (index: number) => void;
  onClear: () => void;
  onImport?: (text: string) => void;

  // Display configuration
  title?: string;
  singularTitle?: string;
  maxItems?: number;

  // Custom Renderers
  renderItem?: (item: T, index: number) => React.ReactNode;
  hintText?: React.ReactNode;

  // Validation
  validateName?: (name: string) => string | null; // returns error message or null
}

export function PlayerList<T extends { name: string; id?: string }>({
  items,
  onAdd,
  onRemove,
  onClear,
  onImport,
  title = "Players",
  singularTitle = "Player",
  maxItems,
  renderItem,
  hintText,
  validateName,
}: PlayerListProps<T>) {
  const [inputValue, setInputValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    const name = inputValue.trim();
    if (!name) return;

    if (validateName) {
      const valError = validateName(name);
      if (valError) {
        setError(valError);
        return;
      }
    }

    if (maxItems && items.length >= maxItems) {
      setError(`Maximum ${maxItems} ${title.toLowerCase()} allowed`);
      return;
    }

    onAdd(name);
    setInputValue("");
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
  };

  const visibleItems = isExpanded ? items : items.slice(0, 10);
  const hasMore = items.length > 10;

  return (
    <div className="player-manager-content w-full text-left">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="tex-lg font-bold m-0 flex items-center gap-2">
          {title}{" "}
          <span className="bg-white/10 px-2 py-0.5 rounded text-sm font-normal">
            ({items.length})
          </span>
        </h3>
        <div className="flex gap-2">
          {onImport && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const text = prompt(`Import ${title} (one per line):`);
                if (text) onImport(text);
              }}
            >
              Import...
            </Button>
          )}
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (confirm(`Remove all ${title.toLowerCase()}?`)) onClear();
            }}
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Input Row */}
      <div className="flex gap-3 items-end mb-4">
        <div className="flex-1">
          <label className="block text-xs text-text-muted mb-1">
            {singularTitle} Name
          </label>
          <input
            type="text"
            className={`form-input w-full ${error ? "border-red-500" : ""}`}
            placeholder={`Enter ${singularTitle.toLowerCase()} name...`}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={handleKeyDown}
          />
          {error && (
            <span className="text-red-400 text-xs is-error absolute mt-1">
              {error}
            </span>
          )}
        </div>
        <Button onClick={handleAdd} disabled={!inputValue.trim()}>
          Add
        </Button>
      </div>

      {/* List */}
      <ul className="player-list max-h-[400px] overflow-y-auto grid gap-2 p-1 m-0 list-none">
        {items.length === 0 ? (
          <li className="text-center text-text-muted p-5 bg-black/5 rounded">
            No {title.toLowerCase()} added yet
          </li>
        ) : (
          visibleItems.map((item, index) => (
            <React.Fragment key={index}>
              {renderItem ? (
                renderItem(item, index)
              ) : (
                <li className="player-item flex justify-between items-center p-2 bg-bg-tertiary rounded">
                  <span>{item.name}</span>
                  <button
                    className="text-text-muted hover:text-red-400 px-2"
                    onClick={() => onRemove(index)}
                  >
                    ×
                  </button>
                </li>
              )}
            </React.Fragment>
          ))
        )}
      </ul>

      {/* Footer / Toggle */}
      {hasMore && (
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          className="mt-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Show Less ▲" : `Show All (${items.length}) ▼`}
        </Button>
      )}

      {/* Hint */}
      {hintText && (
        <div className="mt-3 text-center text-sm text-text-muted">
          {hintText}
        </div>
      )}
    </div>
  );
}

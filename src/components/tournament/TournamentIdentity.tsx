import React, { useState, useEffect } from "react";

interface TournamentIdentityProps {
  format: string;
  initialName: string;
  initialNotes: string;
  onUpdate: (key: "name" | "notes", value: string) => void;
  className?: string;
}

export const TournamentIdentity: React.FC<TournamentIdentityProps> = ({
  format,
  initialName,
  initialNotes,
  onUpdate,
  className = "",
}) => {
  const [localName, setLocalName] = useState(initialName || "");
  const [localNotes, setLocalNotes] = useState(initialNotes || "");

  // Sync with global state if it changes from outside
  useEffect(() => {
    setLocalName(initialName || "");
  }, [initialName]);

  useEffect(() => {
    setLocalNotes(initialNotes || "");
  }, [initialNotes]);

  const handleBlur = (key: "name" | "notes", value: string) => {
    onUpdate(key, value.trim());
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    key: "name" | "notes",
    value: string,
  ) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <div className={`max-w-xl mx-auto mb-10 text-center ${className}`}>
      <input
        type="text"
        placeholder="Unnamed Tournament"
        className="w-full text-center text-4xl font-extrabold text-foreground bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground/30 mb-2 truncate"
        value={localName}
        onChange={(e) => setLocalName(e.target.value)}
        onBlur={() => handleBlur("name", localName)}
        onKeyDown={(e) => handleKeyDown(e, "name", localName)}
      />
      <input
        type="text"
        placeholder="Add a short description or location..."
        className="w-full text-center text-sm text-muted-foreground bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground/30 italic"
        value={localNotes}
        onChange={(e) => setLocalNotes(e.target.value)}
        onBlur={() => handleBlur("notes", localNotes)}
        onKeyDown={(e) => handleKeyDown(e, "notes", localNotes)}
      />
    </div>
  );
};

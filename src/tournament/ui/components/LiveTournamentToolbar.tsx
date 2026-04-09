import React from "react";
import { cn } from "@/shared/utils";

interface LiveTournamentToolbarProps {
  left: React.ReactNode;
  center?: React.ReactNode;
  right: React.ReactNode;
  className?: string;
}

export const LiveTournamentToolbar: React.FC<LiveTournamentToolbarProps> = ({
  left,
  center,
  right,
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-glass-background backdrop-blur-xl border border-glass-border shadow-2xl rounded-3xl p-2",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-shrink-0">{left}</div>
        <div className="flex-1 min-w-0 flex items-center justify-center">
          {center}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">{right}</div>
      </div>
    </div>
  );
};

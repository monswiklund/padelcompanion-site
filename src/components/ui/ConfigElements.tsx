import React from "react";
import { HelpButton } from "@/components/ui/HelpNotice";
import { cn } from "@/shared/utils";

export const ConfigSection: React.FC<{
  title: string;
  help?: { title: string; content: string };
  children: React.ReactNode;
}> = ({ title, help, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {title}
      </h4>
      {help && <HelpButton title={help.title} content={help.content} />}
    </div>
    {children}
  </div>
);

export const ConfigRow: React.FC<{
  label: string | React.ReactNode;
  hint?: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ label, hint, children, className }) => (
  <div className={cn("flex items-center justify-between gap-3 py-2", className)}>
    <div className="flex-1 min-w-0">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {hint && <span className="text-xs text-muted-foreground ml-1.5 whitespace-nowrap hidden sm:inline">({hint})</span>}
      {hint && <div className="text-xs text-muted-foreground sm:hidden mt-0.5">{hint}</div>}
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);

export const ConfigStepper: React.FC<{
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  disabledMax?: boolean;
}> = ({ value, min, max, step = 1, onChange, disabledMax }) => (
  <div className="flex items-center bg-popover rounded-xl border border-border overflow-hidden">
    <button
      type="button"
      className="w-10 h-10 flex items-center justify-center text-lg font-bold text-accent hover:bg-accent/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      disabled={value <= min}
      onClick={() => onChange(value - step)}
    >
      −
    </button>
    <div className="w-10 text-center font-bold text-foreground">{value}</div>
    <button
      type="button"
      className="w-10 h-10 flex items-center justify-center text-lg font-bold text-accent hover:bg-accent/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      disabled={disabledMax || value >= max}
      onClick={() => onChange(value + step)}
    >
      +
    </button>
  </div>
);

export const ConfigToggle: React.FC<{
  enabled: boolean;
  disabled?: boolean;
  onChange: () => void;
}> = ({ enabled, disabled, onChange }) => (
  <button
    type="button"
    onClick={disabled ? undefined : onChange}
    disabled={disabled}
    className={cn(
      "relative w-12 h-7 rounded-full transition-colors border",
      disabled
        ? "opacity-40 cursor-not-allowed bg-surface-hover border-transparent"
        : enabled
        ? "bg-accent border-accent"
        : "bg-muted/20 hover:bg-muted/30 border-border"
    )}
  >
    <span
      className={cn(
        "absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform",
        enabled ? "translate-x-5" : ""
      )}
    />
  </button>
);

export const ConfigSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <select
    {...props}
    className={cn(
      "w-full px-3 py-2.5 rounded-lg bg-popover border border-border text-foreground focus:outline-none focus:border-accent transition-colors text-sm",
      props.className
    )}
  >
    {props.children}
  </select>
);

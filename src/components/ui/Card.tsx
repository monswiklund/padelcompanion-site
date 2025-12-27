import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  padding?: "standard" | "compact";
}

/**
 * Standardized Card component for settings and content.
 * Replaces the old SettingsCard HTML string builder.
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  style = {},
  padding = "standard",
}) => {
  return (
    <div
      className={`setup-card ${
        padding === "compact" ? "compact" : ""
      } ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

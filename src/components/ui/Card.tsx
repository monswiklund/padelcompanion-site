import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  padding?: "standard" | "compact" | "none";
}

const paddingClasses = {
  standard: "p-6",
  compact: "p-4",
  none: "p-0",
};

/**
 * Standardized Card component with Tailwind styling.
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  style = {},
  padding = "standard",
}) => {
  return (
    <div
      className={`bg-card border border-theme rounded-2xl ${paddingClasses[padding]} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const variantClasses = {
  primary:
    "bg-accent hover:bg-accent-dark text-white shadow-sm hover:shadow-md",
  secondary:
    "bg-card hover:bg-elevated border border-theme text-primary hover:border-accent/50",
  danger: "bg-error/10 hover:bg-error/20 text-error border border-error/30",
  ghost: "bg-transparent hover:bg-white/5 text-secondary hover:text-primary",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2.5 text-base rounded-xl",
  lg: "px-6 py-3 text-lg rounded-xl",
};

/**
 * Standardized Button component with Tailwind styling.
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  disabled,
  ...props
}) => {
  const classes = [
    "font-medium transition-all duration-200 inline-flex items-center justify-center gap-2",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

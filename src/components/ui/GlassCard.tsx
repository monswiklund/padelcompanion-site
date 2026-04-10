import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/shared/utils"; // Assuming utils exists, or I need to create it

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  variant?: "default" | "hover" | "active";
  padding?: "none" | "sm" | "md" | "lg";
}

const variants = {
  default: "bg-glass-background backdrop-blur-md border border-glass-border shadow-lg",
  hover:
    "bg-glass-background backdrop-blur-md border border-glass-border shadow-lg hover:border-accent/30 hover:shadow-xl transition-all duration-300",
  active:
    "bg-accent/20 backdrop-blur-md border border-accent/50 shadow-[0_0_15px_rgba(249,115,22,0.2)]",
};

const paddingClasses = {
  none: "p-0",
  sm: "p-3",
  md: "p-6",
  lg: "p-8",
};

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  variant = "default",
  padding = "md",
  ...props
}) => {
  return (
    <motion.div
      className={cn(
        "rounded-xl relative overflow-hidden",
        variants[variant],
        paddingClasses[padding],
        className,
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

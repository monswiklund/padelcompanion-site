import React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { GlassCard } from "./GlassCard";
import { cn } from "@/shared/utils";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string; // For adding custom classes
}

const widths = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-[90vw]",
};

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  width = "md",
  className,
}) => {
  // Use Portal to render outside main DOM hierarchy
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4"
          >
            {/* Modal Content */}
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
              className={cn("w-full max-h-[90vh] flex flex-col", widths[width], className)}
            >
              <GlassCard padding="none" className="flex flex-col overflow-hidden shadow-2xl rounded-t-3xl rounded-b-none md:rounded-2xl border-b-0 md:border-b border-glass-border">
                {/* Header */}
                {title && (
                  <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-surface-hover">
                    <div className="text-xl font-bold text-foreground">
                      {title}
                    </div>
                    <button
                      onClick={onClose}
                      className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-surface-hover"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                )}

                {/* Body */}
                <div className="p-6 text-foreground">{children}</div>

                {/* Footer */}
                {footer && (
                  <div className="px-6 py-4 border-t border-border bg-muted/40 flex justify-end gap-3 rounded-b-xl">
                    {footer}
                  </div>
                )}
              </GlassCard>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
};

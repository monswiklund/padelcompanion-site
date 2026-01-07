import React, { useState } from "react";

interface HelpButtonProps {
  title: string;
  content: string;
}

/**
 * A small "?" button that shows help content in a popover/modal.
 */
export const HelpButton: React.FC<HelpButtonProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Simple markdown-like rendering
  const renderContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      // Bold: **text**
      let processed = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      // Bullet points
      if (processed.startsWith("• ") || processed.startsWith("- ")) {
        processed = `<li class="ml-4">${processed.slice(2)}</li>`;
      }
      return (
        <span
          key={i}
          className="block"
          dangerouslySetInnerHTML={{ __html: processed || "&nbsp;" }}
        />
      );
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-5 h-5 rounded-full bg-white/10 hover:bg-accent/20 text-muted hover:text-accent text-xs font-bold transition-colors flex items-center justify-center"
        title={title}
      >
        ?
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-card border border-theme rounded-2xl p-5 max-w-md w-full shadow-xl animate-fade-in-up text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">{title}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-muted hover:text-primary flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </div>
            <div className="text-sm text-secondary leading-relaxed">
              {renderContent(content)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface NoticeBarProps {
  type?: "info" | "warning" | "success";
  children: React.ReactNode;
  className?: string;
}

/**
 * A notice/alert bar for showing tips, warnings, or info messages.
 */
export const NoticeBar: React.FC<NoticeBarProps> = ({
  type = "info",
  children,
  className = "",
}) => {
  const styles = {
    info: "bg-accent/10 border-accent/30 text-accent",
    warning: "bg-warning/10 border-warning/30 text-warning",
    success: "bg-success/10 border-success/30 text-success",
  };

  const icons = {
    info: "ℹ️",
    warning: "⚠️",
    success: "✓",
  };

  return (
    <div
      className={`flex items-start gap-2 px-3 py-2 rounded-lg border text-sm ${styles[type]} ${className}`}
    >
      <span className="flex-shrink-0">{icons[type]}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
};

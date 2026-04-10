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
        className="w-5 h-5 rounded-full bg-white/10 hover:bg-accent/20 text-muted-foreground hover:text-accent text-xs font-bold transition-colors flex items-center justify-center"
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
            className="bg-card border border-border rounded-2xl p-5 max-w-md w-full shadow-xl animate-fade-in-up text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
              >
                ×
              </button>
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed">
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
    info: "bg-white/5 border-white/10 text-foreground",
    warning: "bg-warning/10 border-warning/30 text-warning",
    success: "bg-success/10 border-success/30 text-success",
  };

  const InfoIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 relative top-[1px]">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  );

  const WarningIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 relative top-[1px]">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  );

  const SuccessIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 relative top-[1px]">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );

  const icons = {
    info: <InfoIcon />,
    warning: <WarningIcon />,
    success: <SuccessIcon />,
  };

  return (
    <div
      className={`flex items-start gap-2 px-3 py-2 rounded-lg border text-sm ${styles[type]} ${className}`}
    >
      <span className="flex-shrink-0 opacity-80">{icons[type]}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
};

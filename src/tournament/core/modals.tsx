import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { launchConfetti } from "../confetti";

// Helper to mount a component and handle cleanup
function mountModal(component: React.ReactNode, container: HTMLDivElement) {
  const root = createRoot(container);
  root.render(component);
  return () => {
    // We can't easily unmount with animation out unless we control the "open" state from outside.
    // So the component itself should handle the closing animation and call a cleanup callback.
    // For now, we destroy after a small delay if needed, or rely on the component's onClose prop.
    setTimeout(() => {
      root.unmount();
      container.remove();
    }, 500); // Wait for AnimatePresence exit
  };
}

// Wrapper to handle stateful open/close for imperative calls
const ModalWrapper = ({
  children,
  onClose,
  initialOpen = true,
}: {
  children: (props: { isOpen: boolean; close: () => void }) => React.ReactNode;
  onClose: () => void;
  initialOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const close = () => {
    setIsOpen(false);
    onClose();
  };

  return <>{children({ isOpen, close })}</>;
};

export function showConfirmModal(
  title: string,
  message: string,
  confirmText = "Confirm",
  onConfirm: () => void,
  isDanger = false,
  secondaryText: string | null = null,
  onSecondary: (() => void) | null = null,
): void {
  const container = document.createElement("div");
  document.body.appendChild(container);

  mountModal(
    <ModalWrapper onClose={() => {}}>
      {({ isOpen, close }) => (
        <Dialog
          isOpen={isOpen}
          onClose={close}
          title={title}
          footer={
            <>
              {secondaryText && onSecondary && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    close();
                    onSecondary();
                  }}
                >
                  {secondaryText}
                </Button>
              )}
              <Button variant="ghost" onClick={close}>
                Cancel
              </Button>
              <Button
                variant={isDanger ? "danger" : "primary"}
                onClick={() => {
                  close();
                  onConfirm();
                }}
              >
                {confirmText}
              </Button>
            </>
          }
        >
          <div
            dangerouslySetInnerHTML={{ __html: message }}
            className="text-sm opacity-90"
          />
        </Dialog>
      )}
    </ModalWrapper>,
    container,
  );
}

export function showInputModal(
  title: string,
  placeholder: string,
  onConfirm: (value: string) => void,
  description = "",
  inputType: "text" | "textarea" = "text",
): void {
  const container = document.createElement("div");
  document.body.appendChild(container);

  mountModal(
    <ModalWrapper onClose={() => {}}>
      {({ isOpen, close }) => {
        const [val, setVal] = useState("");
        const handleConfirm = () => {
          if (val.trim()) {
            close();
            onConfirm(val.trim());
          }
        };
        return (
          <Dialog
            isOpen={isOpen}
            onClose={close}
            title={title}
            footer={
              <>
                <Button variant="ghost" onClick={close}>
                  Cancel
                </Button>
                <Button onClick={handleConfirm}>Add</Button>
              </>
            }
          >
            {description && (
              <p className="mb-4 text-sm text-muted-foreground">
                {description}
              </p>
            )}
            {inputType === "textarea" ? (
              <textarea
                className="w-full h-32 p-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-accent text-foreground"
                placeholder={placeholder}
                value={val}
                onChange={(e) => setVal(e.target.value)}
                autoFocus
              />
            ) : (
              <input
                type="text"
                className="w-full p-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-accent text-foreground"
                placeholder={placeholder}
                value={val}
                onChange={(e) => setVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                autoFocus
              />
            )}
          </Dialog>
        );
      }}
    </ModalWrapper>,
    container,
  );
}

export function showAlertModal(
  title: string,
  message: string,
  onDismiss?: () => void,
): void {
  const container = document.createElement("div");
  document.body.appendChild(container);

  mountModal(
    <ModalWrapper onClose={() => onDismiss && onDismiss()}>
      {({ isOpen, close }) => (
        <Dialog
          isOpen={isOpen}
          onClose={close}
          title={title}
          footer={<Button onClick={close}>OK</Button>}
        >
          <div
            dangerouslySetInnerHTML={{ __html: message }}
            className="text-sm opacity-90"
          />
        </Dialog>
      )}
    </ModalWrapper>,
    container,
  );
}

export function showInfoModal(title: string, htmlContent: string): void {
  const container = document.createElement("div");
  document.body.appendChild(container);

  mountModal(
    <ModalWrapper onClose={() => {}}>
      {({ isOpen, close }) => (
        <Dialog
          isOpen={isOpen}
          onClose={close}
          title={title}
          width="lg"
          footer={<Button onClick={close}>Got it</Button>}
        >
          <div
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            className="prose prose-invert prose-sm max-w-none"
          />
        </Dialog>
      )}
    </ModalWrapper>,
    container,
  );
}

// Re-implement showFinalStandings with new Dialog
interface Standing {
  name: string;
  points: number;
  played: number;
}

export function showFinalStandings(standings: Standing[]): void {
  const container = document.createElement("div");
  document.body.appendChild(container);
  launchConfetti();

  mountModal(
    <ModalWrapper
      onClose={() => {
        // Scroll to leaderboard logic from original
        const leaderboard = document.getElementById("leaderboardSection");
        if (leaderboard) {
          leaderboard.scrollIntoView({ behavior: "smooth" });
        }
      }}
    >
      {({ isOpen, close }) => (
        <Dialog
          isOpen={isOpen}
          onClose={close}
          title="Tournament Complete! 🏆"
          width="lg"
          footer={
            <div className="flex gap-2 w-full justify-center">
              <Button variant="ghost" onClick={close}>
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            {standings.map((p, i) => (
              <div
                key={i}
                className={`flex items-center p-3 rounded-lg ${i < 3 ? "bg-accent/10 border border-accent/20" : "bg-black/20"}`}
              >
                <div className="w-8 text-xl text-center mr-3">
                  {i === 0
                    ? "🥇"
                    : i === 1
                      ? "🥈"
                      : i === 2
                        ? "🥉"
                        : `${i + 1}.`}
                </div>
                <div className="flex-1 font-bold text-lg">{p.name}</div>
                <div className="text-sm text-muted-foreground">
                  {p.points} pts · {p.played} games
                </div>
              </div>
            ))}
          </div>
        </Dialog>
      )}
    </ModalWrapper>,
    container,
  );
}

export function closeFinalModal(): void {
  // This function originally acted on DOM elements by class name.
  // Since we used React, the modal closes itself via interactions.
  // If we need programmatic close from outside, we'd need to expose the close handler differently.
  // But currently, the new implementation handles closing via the Dialog usage.
  // We can leave this empty or try to remove the container if we stored a reference.
  // For now, it's likely safe to be no-op as the new modal is self-contained.
}

// Countdown is purely visual and ephemeral, can stay as manual JS or be modernized.
// Keeping manual for performance/simplicity as it's just an overlay.
export function showCountdown(): Promise<void> {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    // Use Tailwind classes for the overlay
    overlay.className =
      "fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md cursor-pointer";
    overlay.innerHTML =
      '<div class="text-[150px] font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] animate-bounce">3</div>';
    document.body.appendChild(overlay);

    let skipped = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const skipCountdown = () => {
      if (skipped) return;
      skipped = true;
      if (timeoutId) clearTimeout(timeoutId);
      overlay.classList.add("opacity-0", "transition-opacity", "duration-200");
      setTimeout(() => {
        overlay.remove();
        resolve();
      }, 200);
    };

    overlay.addEventListener("click", skipCountdown);

    const numberEl = overlay.querySelector("div") as HTMLElement;
    const sequence = ["3", "2", "1", "GO!"];
    let index = 0;

    const showNext = () => {
      if (skipped) return;

      if (index >= sequence.length) {
        overlay.classList.add(
          "opacity-0",
          "transition-opacity",
          "duration-200",
        );
        setTimeout(() => {
          overlay.remove();
          resolve();
        }, 200);
        return;
      }

      const val = sequence[index];
      numberEl.textContent = val;

      // Reset animation
      numberEl.style.animation = "none";
      // Force reflow
      void numberEl.offsetWidth;

      if (val === "GO!") {
        numberEl.style.animation = ""; // No bounce for GO?
        numberEl.className =
          "text-[120px] font-black text-success drop-shadow-[0_0_50px_rgba(34,197,94,0.8)] scale-110 transition-all duration-300";
      } else {
        numberEl.style.animation = "bounce 0.5s infinite";
      }

      index++;
      timeoutId = setTimeout(showNext, val === "GO!" ? 600 : 800);
    };

    timeoutId = setTimeout(showNext, 100);
  });
}

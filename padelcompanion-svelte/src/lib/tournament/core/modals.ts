import { get, writable } from "svelte/store";
import { launchConfetti } from "../confetti";

export interface ModalState {
  isOpen: boolean;
  type: "alert" | "confirm" | "input" | "info" | "standings";
  title: string;
  message?: string;
  placeholder?: string;
  description?: string;
  confirmText?: string;
  isDanger?: boolean;
  secondaryText?: string | null;
  onConfirm?: (value?: any) => void;
  onSecondary?: () => void;
  onDismiss?: () => void;
  standings?: Array<{ name: string; points: number; played: number }>;
}

export const activeModal = writable<ModalState | null>(null);

export function showConfirmModal(
  title: string,
  message: string,
  confirmText = "Confirm",
  onConfirm: () => void,
  isDanger = false,
  secondaryText: string | null = null,
  onSecondary: (() => void) | null = null
): void {
  activeModal.set({
    isOpen: true,
    type: "confirm",
    title,
    message,
    confirmText,
    isDanger,
    secondaryText,
    onConfirm: () => {
      onConfirm();
      activeModal.set(null);
    },
    onSecondary: () => {
      if (onSecondary) onSecondary();
      activeModal.set(null);
    },
    onDismiss: () => activeModal.set(null)
  });
}

export function showInputModal(
  title: string,
  placeholder: string,
  onConfirm: (value: string) => void,
  description = "",
  inputType: "text" | "textarea" = "text"
): void {
  activeModal.set({
    isOpen: true,
    type: "input",
    title,
    placeholder,
    description,
    onConfirm: (val) => {
      onConfirm(val);
      activeModal.set(null);
    },
    onDismiss: () => activeModal.set(null)
  });
}

export function showAlertModal(
  title: string,
  message: string,
  onDismiss?: () => void
): void {
  activeModal.set({
    isOpen: true,
    type: "alert",
    title,
    message,
    onConfirm: () => {
      if (onDismiss) onDismiss();
      activeModal.set(null);
    },
    onDismiss: () => {
      if (onDismiss) onDismiss();
      activeModal.set(null);
    }
  });
}

export function showInfoModal(title: string, htmlContent: string): void {
  activeModal.set({
    isOpen: true,
    type: "info",
    title,
    message: htmlContent,
    onDismiss: () => activeModal.set(null)
  });
}

interface Standing {
  name: string;
  points: number;
  played: number;
}

export function showFinalStandings(standings: Standing[]): void {
  launchConfetti();
  activeModal.set({
    isOpen: true,
    type: "standings",
    title: "Tournament Complete! 🏆",
    standings,
    onDismiss: () => {
      activeModal.set(null);
      const leaderboard = document.getElementById("leaderboardSection");
      if (leaderboard) {
        leaderboard.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
}

export function closeFinalModal(): void {
  activeModal.set(null);
}

// Countdown utility
export function showCountdown(): Promise<void> {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className =
      "fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-md cursor-pointer select-none";
    overlay.innerHTML =
      '<div class="text-[150px] font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300">3</div>';
    document.body.appendChild(overlay);

    let skipped = false;
    let timeoutId: any = null;

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
        overlay.classList.add("opacity-0", "transition-opacity", "duration-200");
        setTimeout(() => {
          overlay.remove();
          resolve();
        }, 200);
        return;
      }

      const val = sequence[index];
      numberEl.textContent = val;

      if (val === "GO!") {
        numberEl.className =
          "text-[120px] font-black text-emerald-500 drop-shadow-[0_0_50px_rgba(34,197,94,0.8)] scale-110 transition-all duration-300";
      } else {
        numberEl.className = "text-[150px] font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all duration-300 scale-95";
        setTimeout(() => {
          if (!skipped) numberEl.classList.remove("scale-95");
        }, 50);
      }

      index++;
      timeoutId = setTimeout(showNext, val === "GO!" ? 600 : 800);
    };

    timeoutId = setTimeout(showNext, 100);
  });
}

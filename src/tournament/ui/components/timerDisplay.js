import { MatchTimer } from "../../timer.js";
import { getElements } from "../elements.js";
import { showInputModal, showConfirmModal } from "../../modals.js";
import { showToast } from "../../../shared/utils.js";

let timer = null;

/**
 * Initialize and manage the match timer
 * @param {Object} state - Current application state
 * @param {Function} saveState - Function to save state
 * @returns {MatchTimer|null} The timer instance
 */
export function initTimer(state, saveState) {
  const els = getElements();
  if (!els.matchTimerContainer) return null;

  if (state.scoringMode !== "time") {
    els.matchTimerContainer.style.display = "none";
    if (timer) {
      timer.pause();
      timer = null;
    }
    return null;
  }

  els.matchTimerContainer.style.display = "flex";

  if (!timer) {
    timer = new MatchTimer({
      duration: state.pointsPerMatch || 12,
      onTimeUpdate: (time) => {
        if (els.timerDisplay) els.timerDisplay.textContent = time;
        document.title = `${time} - Tournament`;
      },
      onStatusChange: (status) => {
        if (status === "running") {
          els.timerStartBtn.style.display = "none";
          els.timerPauseBtn.style.display = "inline-block";
          els.matchTimerContainer.classList.add("running");
          els.matchTimerContainer.classList.remove("completed");

          if (els.runningBadge) {
            els.runningBadge.style.display = "inline-flex";
            els.runningBadge.classList.add("running");
          }
        } else if (status === "paused" || status === "idle") {
          els.timerStartBtn.style.display = "inline-block";
          els.timerPauseBtn.style.display = "none";
          els.matchTimerContainer.classList.remove("running");

          if (els.runningBadge) {
            els.runningBadge.style.display = "none";
            els.runningBadge.classList.remove("running");
          }

          if (status === "idle")
            els.matchTimerContainer.classList.remove("completed");
          document.title = "Tournament Generator - Padel Companion";
        } else if (status === "completed") {
          els.matchTimerContainer.classList.remove("running");
          els.matchTimerContainer.classList.add("completed");
          document.title = "TIME UP!";

          // Flash screen green
          document.body.classList.add("timer-finished-flash");
          setTimeout(() => {
            document.body.classList.remove("timer-finished-flash");
          }, 1000);
        }
      },
    });

    els.timerDisplay.textContent = timer.formatTime(state.pointsPerMatch * 60);

    els.timerStartBtn.onclick = () => timer.start();
    els.timerPauseBtn.onclick = () => timer.pause();
    els.timerResetBtn.onclick = () => timer.reset();
    els.timerAddBtn.onclick = () => timer.addTime(60);
    if (els.timerSubBtn) els.timerSubBtn.onclick = () => timer.addTime(-60);

    const editHandler = () => {
      const openModal = () => {
        showInputModal(
          "Set Timer Duration",
          "Enter minutes (e.g. 12)",
          (val) => {
            const minutes = parseInt(val);
            if (minutes > 0) {
              state.pointsPerMatch = minutes;
              saveState();
              timer.setDuration(minutes);
              showToast(`Timer set to ${minutes} minutes`);
            } else {
              showToast("Invalid minutes", "error");
            }
          }
        );
      };

      if (timer.isRunning) {
        showConfirmModal(
          "Pause Timer?",
          "The timer is currently running. Pause to change duration?",
          "Pause & Edit",
          () => {
            timer.pause();
            openModal();
          }
        );
      } else {
        openModal();
      }
    };

    els.timerDisplay.onclick = editHandler;
  } else {
    // If timer exists, just ensure duration is synced
    // Only set duration if not running? Or always?
    // MatchTimer handling handles dynamic updates usually.
    if (timer.duration !== state.pointsPerMatch) {
      timer.setDuration(state.pointsPerMatch);
    }
  }

  return timer;
}

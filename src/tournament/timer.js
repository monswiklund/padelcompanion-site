export class MatchTimer {
  constructor(options = {}) {
    this.duration = options.duration || 12; // Minutes
    this.onTimeUpdate = options.onTimeUpdate || (() => {});
    this.onStatusChange = options.onStatusChange || (() => {});
    this.onComplete = options.onComplete || (() => {});

    this.remainingSeconds = this.duration * 60;
    this.isRunning = false;
    this.intervalId = null;
    this.audioContext = null;
  }

  start() {
    if (this.isRunning) return;

    if (this.remainingSeconds <= 0) {
      this.reset();
    }

    this.isRunning = true;
    this.onStatusChange("running");

    this.intervalId = setInterval(() => {
      this.tick();
    }, 1000);

    this.playBeep(880, 0.1); // High pitch start beep
  }

  pause() {
    if (!this.isRunning) return;

    this.isRunning = false;
    clearInterval(this.intervalId);
    this.onStatusChange("paused");
  }

  reset() {
    this.pause();
    this.remainingSeconds = this.duration * 60;
    this.onTimeUpdate(this.formatTime(this.remainingSeconds));
    this.onStatusChange("idle");
  }

  setDuration(minutes) {
    this.duration = minutes;
    this.reset();
  }

  addTime(seconds) {
    this.remainingSeconds += seconds;
    this.onTimeUpdate(this.formatTime(this.remainingSeconds));
  }

  tick() {
    this.remainingSeconds--;

    // Critical time warnings (Audio)
    if (this.remainingSeconds <= 3 && this.remainingSeconds > 0) {
      this.playBeep(440, 0.2); // Low pitch warning
    }

    if (this.remainingSeconds <= 0) {
      this.complete();
    } else {
      this.onTimeUpdate(this.formatTime(this.remainingSeconds));
    }
  }

  complete() {
    this.remainingSeconds = 0;
    this.pause();
    this.onTimeUpdate("00:00");
    this.onStatusChange("completed");
    this.playBeep(880, 1.0); // Long finish beep
    this.onComplete();
  }

  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  // Simple Audio Context Beep
  playBeep(frequency = 440, duration = 0.5) {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
      }

      if (this.audioContext.state === "suspended") {
        this.audioContext.resume();
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.start();

      // Fade out to avoid clicking
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.audioContext.currentTime + duration
      );

      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (e) {
      console.warn("Audio play failed", e);
    }
  }
}

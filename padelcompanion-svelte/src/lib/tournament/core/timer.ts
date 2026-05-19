type TimerStatus = "idle" | "running" | "paused" | "completed";

interface MatchTimerOptions {
  duration?: number;
  onTimeUpdate?: (time: string) => void;
  onStatusChange?: (status: TimerStatus) => void;
  onComplete?: () => void;
}

export class MatchTimer {
  private duration: number;
  private remainingSeconds: number;
  private isRunning: boolean;
  private intervalId: ReturnType<typeof setInterval> | null;
  private audioContext: AudioContext | null;
  private onTimeUpdate: (time: string) => void;
  private onStatusChange: (status: TimerStatus) => void;
  private onComplete: () => void;

  constructor(options: MatchTimerOptions = {}) {
    this.duration = options.duration || 12;
    this.onTimeUpdate = options.onTimeUpdate || (() => {});
    this.onStatusChange = options.onStatusChange || (() => {});
    this.onComplete = options.onComplete || (() => {});

    this.remainingSeconds = this.duration * 60;
    this.isRunning = false;
    this.intervalId = null;
    this.audioContext = null;
  }

  start(): void {
    if (this.isRunning) return;

    if (this.remainingSeconds <= 0) {
      this.reset();
    }

    this.isRunning = true;
    this.onStatusChange("running");

    this.intervalId = setInterval(() => {
      this.tick();
    }, 1000);

    this.playBeep(880, 0.1);
  }

  pause(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.intervalId) clearInterval(this.intervalId);
    this.onStatusChange("paused");
  }

  reset(): void {
    this.pause();
    this.remainingSeconds = this.duration * 60;
    this.onTimeUpdate(this.formatTime(this.remainingSeconds));
    this.onStatusChange("idle");
  }

  setDuration(minutes: number): void {
    this.duration = minutes;
    this.reset();
  }

  addTime(seconds: number): void {
    this.remainingSeconds += seconds;
    this.onTimeUpdate(this.formatTime(this.remainingSeconds));
  }

  private tick(): void {
    this.remainingSeconds--;

    if (this.remainingSeconds <= 3 && this.remainingSeconds > 0) {
      this.playBeep(440, 0.2);
    }

    if (this.remainingSeconds <= 0) {
      this.complete();
    } else {
      this.onTimeUpdate(this.formatTime(this.remainingSeconds));
    }
  }

  private complete(): void {
    this.remainingSeconds = 0;
    this.pause();
    this.onTimeUpdate("00:00");
    this.onStatusChange("completed");
    this.playBeep(880, 1.0);
    this.onComplete();
  }

  private formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  private playBeep(frequency = 440, duration = 0.5): void {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
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

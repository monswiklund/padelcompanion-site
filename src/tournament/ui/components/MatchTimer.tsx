import React, { useEffect, useRef, useState } from "react";
import { useTournament } from "@/context/TournamentContext";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/shared/utils.js";

export const MatchTimer: React.FC = () => {
  const { state, dispatch } = useTournament();
  const { timer, scoringMode } = state;
  const [localSeconds, setLocalSeconds] = useState(timer.remainingSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Sync with context if it changes from outside (e.g. load)
  useEffect(() => {
    setLocalSeconds(timer.remainingSeconds);
  }, [timer.remainingSeconds]);

  // Handle the ticking
  useEffect(() => {
    if (timer.isRunning && timer.status !== "completed") {
      intervalRef.current = setInterval(() => {
        setLocalSeconds((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          if (prev <= 4) {
            playBeep(440, 0.2); // Warning beeps
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timer.isRunning, timer.status]);

  // Update context periodically or on stop to persist
  useEffect(() => {
    const timerId = setTimeout(() => {
      dispatch({
        type: "UPDATE_TIMER",
        payload: { remainingSeconds: localSeconds },
      });
    }, 2000); // Debounce context updates

    return () => clearTimeout(timerId);
  }, [localSeconds]);

  const handleComplete = () => {
    dispatch({
      type: "UPDATE_TIMER",
      payload: { isRunning: false, status: "completed", remainingSeconds: 0 },
    });
    playBeep(880, 1.0); // Finish beep
    showToast("TIME UP!", "info");
    document.title = "TIME UP!";

    // Flash effect
    document.body.classList.add("timer-finished-flash");
    setTimeout(
      () => document.body.classList.remove("timer-finished-flash"),
      1000
    );
  };

  const toggleStart = () => {
    if (timer.status === "completed") {
      resetTimer();
      return;
    }
    const newRunning = !timer.isRunning;
    dispatch({
      type: "UPDATE_TIMER",
      payload: {
        isRunning: newRunning,
        status: newRunning ? "running" : "paused",
      },
    });
    if (newRunning) playBeep(880, 0.1);
  };

  const resetTimer = () => {
    const seconds = timer.duration * 60;
    setLocalSeconds(seconds);
    dispatch({
      type: "UPDATE_TIMER",
      payload: { isRunning: false, status: "idle", remainingSeconds: seconds },
    });
    document.title = "Tournament";
  };

  const addMinute = (mins: number) => {
    setLocalSeconds((prev) => Math.max(0, prev + mins * 60));
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const playBeep = (freq: number, dur: number) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.stop(ctx.currentTime + dur);
    } catch (e) {
      console.warn("Audio failed", e);
    }
  };

  if (scoringMode !== "time") return null;

  return (
    <div className={`match-timer-container ${timer.status}`}>
      <div className="timer-display-card">
        <div className="timer-header">
          <span className="timer-label">Match Clock</span>
          {timer.status === "running" && (
            <span className="live-badge">LIVE</span>
          )}
        </div>

        <div className="timer-main">
          <button className="timer-adjust" onClick={() => addMinute(-1)}>
            −1
          </button>
          <div className="timer-digits" onClick={toggleStart}>
            {formatTime(localSeconds)}
          </div>
          <button className="timer-adjust" onClick={() => addMinute(1)}>
            +1
          </button>
        </div>

        <div className="timer-controls">
          <Button
            variant={timer.isRunning ? "secondary" : "primary"}
            size="sm"
            onClick={toggleStart}
          >
            {timer.isRunning ? "Pause" : "Start"}
          </Button>
          <Button variant="ghost" size="sm" onClick={resetTimer}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

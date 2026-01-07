import React, { useEffect, useRef, useState } from "react";
import { useTournament } from "@/context/TournamentContext";
import { Button } from "@/components/ui/Button";
import { showToast } from "@/shared/utils";

export const MatchTimer: React.FC = () => {
  const { state, dispatch } = useTournament();
  const { timer, scoringMode } = state;
  const [localSeconds, setLocalSeconds] = useState(timer.remainingSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    setLocalSeconds(timer.remainingSeconds);
  }, [timer.remainingSeconds]);

  useEffect(() => {
    if (timer.isRunning && timer.status !== "completed") {
      intervalRef.current = setInterval(() => {
        setLocalSeconds((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          if (prev <= 4) {
            playBeep(440, 0.2);
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

  useEffect(() => {
    const timerId = setTimeout(() => {
      dispatch({
        type: "UPDATE_TIMER",
        payload: { remainingSeconds: localSeconds },
      });
    }, 2000);

    return () => clearTimeout(timerId);
  }, [localSeconds]);

  const handleComplete = () => {
    dispatch({
      type: "UPDATE_TIMER",
      payload: { isRunning: false, status: "completed", remainingSeconds: 0 },
    });
    playBeep(880, 1.0);
    showToast("TIME UP!", "info");
    document.title = "TIME UP!";

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

  const isLow = localSeconds <= 60;
  const isCompleted = timer.status === "completed";

  return (
    <div className="flex justify-center mb-6">
      <div
        className={`bg-card border rounded-2xl p-4 inline-flex flex-col items-center gap-4 transition-all ${
          isCompleted
            ? "border-error bg-error/10"
            : timer.isRunning
            ? "border-accent shadow-glow"
            : "border-theme"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">
            Match Clock
          </span>
          {timer.isRunning && (
            <span className="px-2 py-0.5 text-xs font-bold bg-error text-white rounded-full animate-pulse">
              LIVE
            </span>
          )}
        </div>

        {/* Timer Display */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => addMinute(-1)}
            className="w-10 h-10 flex items-center justify-center text-lg font-bold text-muted hover:text-primary bg-elevated rounded-lg transition-colors"
          >
            −1
          </button>
          <button
            onClick={toggleStart}
            className={`font-mono text-5xl font-bold tracking-wider transition-colors cursor-pointer ${
              isCompleted
                ? "text-error"
                : isLow
                ? "text-warning"
                : "text-primary"
            }`}
          >
            {formatTime(localSeconds)}
          </button>
          <button
            onClick={() => addMinute(1)}
            className="w-10 h-10 flex items-center justify-center text-lg font-bold text-muted hover:text-primary bg-elevated rounded-lg transition-colors"
          >
            +1
          </button>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button
            variant={timer.isRunning ? "secondary" : "primary"}
            size="sm"
            onClick={toggleStart}
          >
            {timer.isRunning ? "Pause" : isCompleted ? "Restart" : "Start"}
          </Button>
          <Button variant="ghost" size="sm" onClick={resetTimer}>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

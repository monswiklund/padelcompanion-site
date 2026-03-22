import React, { useEffect, useRef, useState } from "react";
import { useTournament } from "@/context/TournamentContext";
import { showToast } from "@/shared/utils";
import { showConfirmModal } from "../../core/modals";

/**
 * Compact Round Clock for the Toolbar
 * Handles Countdown (Timed mode) or Count-up (Standard mode)
 */
export const MatchTimer: React.FC = () => {
  const { state, dispatch } = useTournament();
  const { timer, scoringMode, roundStartedAt, sessionStartedAt } = state;
  const isTimed = scoringMode === "time";
  
  // Local display state for smooth ticking
  const [roundSeconds, setRoundSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Sync with global state
  useEffect(() => {
    if (isTimed) {
      setRoundSeconds(timer.remainingSeconds);
    } else if (roundStartedAt) {
      setRoundSeconds(Math.floor((Date.now() - roundStartedAt) / 1000));
    }
    
    if (sessionStartedAt) {
      setTotalSeconds(Math.floor((Date.now() - sessionStartedAt) / 1000));
    }
  }, [timer.remainingSeconds, roundStartedAt, sessionStartedAt, isTimed]);

  // Tick logic
  useEffect(() => {
    if (timer.isRunning && timer.status !== "completed") {
      intervalRef.current = setInterval(() => {
        // Round Timer
        if (isTimed) {
          setRoundSeconds((prev) => {
            if (prev <= 1) {
              handleComplete();
              return 0;
            }
            if (prev <= 4) playBeep(440, 0.2);
            return prev - 1;
          });
        } else {
          setRoundSeconds((prev) => prev + 1);
        }

        // Total Timer
        setTotalSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timer.isRunning, timer.status, isTimed]);

  const handleComplete = () => {
    dispatch({
      type: "UPDATE_TIMER",
      payload: { isRunning: false, status: "completed", remainingSeconds: 0 },
    });
    playBeep(880, 1.0);
    showToast("TIME UP!", "info");
    document.body.classList.add("timer-finished-flash");
    setTimeout(() => document.body.classList.remove("timer-finished-flash"), 1000);
  };

  const toggleStart = () => {
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

  const resetRound = () => {
    showConfirmModal(
      "Reset Round Timer?",
      "This will set the round clock back to zero (or the starting duration). Continue?",
      "Reset Clock",
      () => {
        if (isTimed) {
          const seconds = timer.duration * 60;
          dispatch({
            type: "UPDATE_TIMER",
            payload: { isRunning: false, status: "idle", remainingSeconds: seconds },
          });
        } else {
          dispatch({ type: "UPDATE_FIELD", key: "roundStartedAt", value: Date.now() });
        }
        showToast("Round timer reset");
      }
    );
  };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    const timeStr = `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return h > 0 ? `${h}:${timeStr}` : timeStr;
  };

  const playBeep = (freq: number, dur: number) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
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
    } catch (e) {}
  };

  const isCompleted = timer.status === "completed";
  const isLow = isTimed && roundSeconds <= 60;

  return (
    <div className="flex items-center gap-2">
      {/* Round Timer Pill */}
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${
          isCompleted
            ? "bg-error/20 border-error/50 text-error"
            : timer.isRunning
            ? "bg-accent/10 border-accent/40 text-accent shadow-sm"
            : "bg-surface-hover border-border text-muted-foreground"
        }`}
      >
        <button
          onClick={toggleStart}
          className="w-5 h-5 flex items-center justify-center hover:scale-110 transition-transform"
          title={timer.isRunning ? "Pause" : "Start"}
        >
          {timer.isRunning ? "⏸" : "▶"}
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[8px] font-black uppercase tracking-tighter leading-none opacity-60">
            {isTimed ? "Round" : "Round"}
          </span>
          <span 
            className={`font-mono text-sm font-black tracking-tight leading-tight ${
              isLow ? "animate-pulse text-warning" : ""
            }`}
            onClick={resetRound}
            style={{ cursor: 'pointer' }}
            title="Reset Round Clock"
          >
            {formatTime(roundSeconds)}
          </span>
        </div>
      </div>

      {/* Total Timer Pill */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface-hover text-muted-foreground/60 min-w-[70px]">
        <div className="flex flex-col items-center w-full">
          <span className="text-[8px] font-black uppercase tracking-tighter leading-none opacity-40">
            Total
          </span>
          <span className="font-mono text-sm font-bold tracking-tight leading-tight">
            {formatTime(totalSeconds)}
          </span>
        </div>
      </div>
    </div>
  );
};

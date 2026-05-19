<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { tournament } from "$lib/stores/tournament.svelte";
  import { showToast } from "$lib/shared/utils";
  import { showConfirmModal } from "$lib/tournament/core/modals";

  let timer = $derived(tournament.state.timer);
  let scoringMode = $derived(tournament.state.scoringMode);
  let roundStartedAt = $derived(tournament.state.roundStartedAt);
  let sessionStartedAt = $derived(tournament.state.sessionStartedAt);
  let isTimed = $derived(scoringMode === "time");

  let roundSeconds = $state(0);
  let totalSeconds = $state(0);
  let intervalId: any = null;
  let audioCtx: AudioContext | null = null;

  $effect(() => {
    if (isTimed) {
      roundSeconds = timer.remainingSeconds;
    } else if (roundStartedAt) {
      roundSeconds = Math.floor((Date.now() - roundStartedAt) / 1000);
    }

    if (sessionStartedAt) {
      totalSeconds = Math.floor((Date.now() - sessionStartedAt) / 1000);
    }
  });

  $effect(() => {
    if (timer.isRunning && timer.status !== "completed") {
      if (!intervalId) {
        intervalId = setInterval(() => {
          if (isTimed) {
            if (roundSeconds <= 1) {
              handleComplete();
              roundSeconds = 0;
            } else {
              if (roundSeconds <= 4) playBeep(440, 0.2);
              roundSeconds -= 1;
              tournament.updateTimer({ remainingSeconds: roundSeconds });
            }
          } else {
            roundSeconds += 1;
          }
          totalSeconds += 1;
        }, 1000);
      }
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }
  });

  onDestroy(() => {
    if (intervalId) clearInterval(intervalId);
  });

  function handleComplete() {
    tournament.updateTimer({ isRunning: false, status: "completed", remainingSeconds: 0 });
    playBeep(880, 1.0);
    showToast("TIME UP!", "info");
    document.body.classList.add("timer-finished-flash");
    setTimeout(() => document.body.classList.remove("timer-finished-flash"), 1000);
  }

  function toggleStart() {
    const newRunning = !timer.isRunning;
    tournament.updateTimer({
      isRunning: newRunning,
      status: newRunning ? "running" : "paused",
    });
    if (newRunning) playBeep(880, 0.1);
  }

  function resetRound() {
    showConfirmModal(
      "Reset Round Timer?",
      "This will set the round clock back to zero (or the starting duration). Continue?",
      "Reset Clock",
      () => {
        if (isTimed) {
          const seconds = timer.duration * 60;
          tournament.updateTimer({ isRunning: false, status: "idle", remainingSeconds: seconds });
        } else {
          tournament.updateField("roundStartedAt", Date.now());
        }
        showToast("Round timer reset", "success");
      }
    );
  }

  function formatTime(secs: number) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    const timeStr = `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return h > 0 ? `${h}:${timeStr}` : timeStr;
  }

  function playBeep(freq: number, dur: number) {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtx.state === "suspended") audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      osc.stop(audioCtx.currentTime + dur);
    } catch (e) {}
  }

  let isCompleted = $derived(timer.status === "completed");
  let isLow = $derived(isTimed && roundSeconds <= 60);
</script>

<div class="flex items-center gap-2 select-none font-sans">
  <!-- Round Timer Pill -->
  <div
    class="flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-300 {
      isCompleted
        ? 'bg-red-500/10 border-red-500/30 text-red-500'
        : timer.isRunning
          ? 'bg-accent/10 border-accent/30 text-accent shadow-sm'
          : 'bg-white/[0.04] border-white/5 text-muted-foreground'
    }"
  >
    <button
      type="button"
      onclick={toggleStart}
      class="w-5 h-5 flex items-center justify-center hover:scale-115 transition-transform text-xs"
      title={timer.isRunning ? "Pause" : "Start"}
    >
      {timer.isRunning ? "⏸" : "▶"}
    </button>

    <div class="flex flex-col items-center">
      <span class="text-[7px] font-black uppercase tracking-wider leading-none opacity-50">
        Round
      </span>
      <button
        type="button"
        class="font-mono text-[13px] font-black tracking-tight leading-tight {
          isLow ? 'animate-pulse text-warning font-black' : 'text-white'
        }"
        onclick={resetRound}
        title="Reset Round Clock"
      >
        {formatTime(roundSeconds)}
      </button>
    </div>
  </div>

  <!-- Total Timer Pill -->
  <div class="flex items-center gap-2 px-3 py-1 rounded-full border border-white/5 bg-white/[0.04] text-muted-foreground/60 min-w-[70px]">
    <div class="flex flex-col items-center w-full">
      <span class="text-[7px] font-black uppercase tracking-wider leading-none opacity-45">
        Total
      </span>
      <span class="font-mono text-[13px] font-bold tracking-tight leading-tight text-muted-foreground">
        {formatTime(totalSeconds)}
      </span>
    </div>
  </div>
</div>

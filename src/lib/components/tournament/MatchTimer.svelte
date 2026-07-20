<script lang="ts">
	import { onDestroy } from 'svelte';
	import { tournament } from '$lib/stores/tournament.svelte';
	import { showToast, cn } from '$lib/shared/utils';
	import { showConfirmModal } from '$lib/tournament/core/modals';

	const timer = $derived(tournament.state.timer);
	const scoringMode = $derived(tournament.state.scoringMode);
	const roundStartedAt = $derived(tournament.state.roundStartedAt);
	const sessionStartedAt = $derived(tournament.state.sessionStartedAt);
	const isTimed = $derived(scoringMode === 'time');

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
		if (timer.isRunning && timer.status !== 'completed') {
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
		tournament.updateTimer({ isRunning: false, status: 'completed', remainingSeconds: 0 });
		playBeep(880, 1.0);
		showToast('TIME UP!', 'info');
		document.body.classList.add('timer-finished-flash');
		setTimeout(() => document.body.classList.remove('timer-finished-flash'), 1000);
	}

	function toggleStart() {
		const newRunning = !timer.isRunning;
		tournament.updateTimer({
			isRunning: newRunning,
			status: newRunning ? 'running' : 'paused'
		});
		if (newRunning) playBeep(880, 0.1);
	}

	function resetRound() {
		showConfirmModal(
			'RESET ROUND CLOCK?',
			'DANGER: THIS WILL RESET THE CURRENT ROUND TIMER. PROCEED?',
			'RESET CLOCK',
			() => {
				if (isTimed) {
					const seconds = timer.duration * 60;
					tournament.updateTimer({ isRunning: false, status: 'idle', remainingSeconds: seconds });
				} else {
					tournament.updateField('roundStartedAt', Date.now());
				}
				showToast('ROUND TIMER RESET', 'success');
			}
		);
	}

	function formatTime(secs: number) {
		const h = Math.floor(secs / 3600);
		const m = Math.floor((secs % 3600) / 60);
		const s = Math.floor(secs % 60);
		const timeStr = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
		return h > 0 ? `${h}:${timeStr}` : timeStr;
	}

	function playBeep(freq: number, dur: number) {
		try {
			if (!audioCtx) {
				audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
			}
			if (audioCtx.state === 'suspended') audioCtx.resume();
			const osc = audioCtx.createOscillator();
			const gain = audioCtx.createGain();
			osc.type = 'sine';
			osc.frequency.value = freq;
			osc.connect(gain);
			gain.connect(audioCtx.destination);
			osc.start();
			gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
			osc.stop(audioCtx.currentTime + dur);
		} catch {
			// Audio feedback is optional.
		}
	}

	const isCompleted = $derived(timer.status === 'completed');
	const isLow = $derived(isTimed && roundSeconds <= 60);
</script>

<div class="flex items-center gap-1 font-sans select-none">
	<!-- Round Timer Pill -->
	<div
		class={cn(
			'flex items-center gap-1 rounded-xl border px-1 py-0 ring-1 transition-all duration-200 md:gap-3 md:px-4 md:py-2',
			isCompleted
				? 'border-[#FF3B30]/30 bg-[#FF3B30]/10 text-[#FF3B30] ring-[#FF3B30]/10'
				: timer.isRunning
					? 'border-accent/40 bg-accent/10 text-accent ring-accent/10'
					: 'border-white/5 bg-white/[0.04] text-white/20 ring-transparent'
		)}
	>
		<button
			type="button"
			onclick={toggleStart}
			class="flex h-[44px] w-[44px] shrink-0 items-center justify-center text-[10px] font-black text-accent transition-all active:scale-95"
			title={timer.isRunning ? 'Pause' : 'Start'}
			aria-label={timer.isRunning ? 'Pause round clock' : 'Start round clock'}
		>
			{#if timer.isRunning}
				<div class="flex gap-1">
					<div class="h-3 w-1 rounded-full bg-accent"></div>
					<div class="h-3 w-1 rounded-full bg-accent"></div>
				</div>
			{:else}
				<div
					class="ml-0.5 h-0 w-0 border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-accent"
				></div>
			{/if}
		</button>

		<div class="flex flex-col items-center">
			<span class="mb-1 text-[8px] leading-none font-black tracking-wider uppercase opacity-50">
				ROUND
			</span>
			<button
				type="button"
				class={cn(
					'h-[44px] w-[48px] font-mono text-sm leading-none font-black tracking-tight md:w-[54px] md:text-base',
					isLow ? 'animate-pulse text-warning' : 'text-white'
				)}
				onclick={resetRound}
				title="Reset Round Clock"
				aria-label="Reset round clock"
			>
				{formatTime(roundSeconds)}
			</button>
		</div>
	</div>

	<!-- Total Timer Pill -->
	<div
		class="hidden items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-2 ring-1 ring-white/5 md:flex"
	>
		<div class="flex w-full min-w-[60px] flex-col items-center">
			<span class="mb-1 text-[8px] leading-none font-black tracking-wider uppercase opacity-35">
				SESSION
			</span>
			<span class="font-mono text-base leading-none font-black tracking-tight text-white/40">
				{formatTime(totalSeconds)}
			</span>
		</div>
	</div>
</div>

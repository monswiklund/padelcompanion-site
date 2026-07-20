<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { cn } from '$lib/shared/utils';

	let orangeScore = $state<string | number>('0');
	let blueScore = $state<string | number>('0');
	const gameWinners = $state<(string | null)[]>(Array(5).fill(null));

	const POINTS = ['0', '15', '30', '40'];

	function handleScore(team: 'orange' | 'blue') {
		if (team === 'orange') {
			const nextIdx = POINTS.indexOf(orangeScore.toString()) + 1;
			if (nextIdx >= POINTS.length) {
				orangeScore = '0';
				blueScore = '0';
				const emptyIdx = gameWinners.indexOf(null);
				if (emptyIdx !== -1) {
					gameWinners[emptyIdx] = 'orange';
				} else {
					gameWinners.fill(null);
					gameWinners[0] = 'orange';
				}
			} else {
				orangeScore = POINTS[nextIdx];
			}
		} else {
			const nextIdx = POINTS.indexOf(blueScore.toString()) + 1;
			if (nextIdx >= POINTS.length) {
				orangeScore = '0';
				blueScore = '0';
				const emptyIdx = gameWinners.indexOf(null);
				if (emptyIdx !== -1) {
					gameWinners[emptyIdx] = 'blue';
				} else {
					gameWinners.fill(null);
					gameWinners[0] = 'blue';
				}
			} else {
				blueScore = POINTS[nextIdx];
			}
		}
	}
</script>

<div
	class="relative z-10 hidden h-[220px] w-[180px] flex-col self-center rounded-[44px] border-[3px] border-[#3a3a3a] bg-[#1a1a1a] shadow-[0_0_0_2px_#111,0_10px_40px_rgba(0,0,0,0.5),0_0_40px_rgba(66,165,245,0.1)] select-none md:flex lg:h-[280px] lg:w-[230px] lg:rounded-[56px] lg:border-4"
>
	<!-- Crown -->
	<div
		class="absolute top-[45px] -right-[10px] -z-10 h-[35px] w-[11px] rounded-[4px_6px_6px_4px] border border-[#111] bg-gradient-to-r bg-[repeating-linear-gradient(to_bottom,transparent,transparent_2px,rgba(0,0,0,0.3)_2px,rgba(0,0,0,0.3)_4px)] from-[#2a2a2a] via-[#444] to-[#2a2a2a] shadow-sm lg:top-[58px] lg:-right-[12px] lg:h-[44px] lg:w-[14px] lg:rounded-[5px_7px_7px_5px]"
	></div>

	<!-- Button -->
	<div
		class="absolute top-[95px] -right-[7px] -z-10 h-[50px] w-[7px] rounded-[2px_4px_4px_2px] border border-[#111] bg-[#2a2a2a] shadow-sm lg:top-[120px] lg:-right-[9px] lg:h-[64px] lg:w-[10px] lg:rounded-[3px_5px_5px_3px]"
	></div>

	<!-- Screen -->
	<div
		class="relative m-[4px] flex flex-1 flex-col overflow-hidden rounded-[38px] bg-black shadow-inner lg:m-[5px] lg:rounded-[48px]"
	>
		<div
			class="pointer-events-none absolute top-0 right-0 left-0 z-10 h-1/2 bg-gradient-to-br from-white/10 to-transparent"
		></div>

		<!-- Orange Score Area -->
		<button
			class="relative flex w-full flex-1 cursor-pointer items-center justify-center overflow-hidden border-0 bg-gradient-to-br from-[#FF9500] to-[#FF3B30] p-2 transition-all hover:brightness-110 active:brightness-90"
			onclick={() => handleScore('orange')}
		>
			<div class="absolute top-2 right-4 text-[0.7rem] font-bold text-white/80">9:41</div>

			{#key orangeScore}
				<div
					in:scale={{ duration: 200, start: 0.8 }}
					out:fade={{ duration: 100 }}
					class="text-[2.2rem] font-black tracking-normal text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] lg:text-[2.8rem]"
				>
					{orangeScore}
				</div>
			{/key}

			<div
				class="absolute left-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/30 text-[0.8rem] font-black text-white"
			>
				R
			</div>
		</button>

		<!-- Center bar -->
		<div
			class="z-[20] flex items-center justify-between border-y border-white/5 bg-gradient-to-r from-[#FF3B30] to-[#42A5F5] px-3 py-1.5 shadow-md"
		>
			<div
				class="rounded-full bg-white/20 px-2 py-0.5 text-[0.6rem] font-black text-white backdrop-blur-sm"
			>
				00:42:15
			</div>
			<div class="flex items-center gap-[4px]">
				{#each gameWinners as winner}
					<span
						class={cn(
							'h-2 w-2 rounded-full border border-white/10 shadow-sm transition-colors',
							winner === 'orange'
								? 'scale-110 bg-[#FF9500]'
								: winner === 'blue'
									? 'scale-110 bg-[#64B5F6]'
									: 'bg-white/20'
						)}
					></span>
				{/each}
			</div>
		</div>

		<!-- Blue Score Area -->
		<button
			class="relative flex w-full flex-1 cursor-pointer items-center justify-center overflow-hidden border-0 bg-gradient-to-br from-[#42A5F5] to-[#64B5F6] p-2 transition-all hover:brightness-110 active:brightness-90"
			onclick={() => handleScore('blue')}
		>
			{#key blueScore}
				<div
					in:scale={{ duration: 200, start: 0.8 }}
					out:fade={{ duration: 100 }}
					class="text-[2.2rem] font-black tracking-normal text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] lg:text-[2.8rem]"
				>
					{blueScore}
				</div>
			{/key}

			<div
				class="absolute left-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/30 text-[0.8rem] font-black text-white"
			>
				↩
			</div>
		</button>
	</div>
</div>

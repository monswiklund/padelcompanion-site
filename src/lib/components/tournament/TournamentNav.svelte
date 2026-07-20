<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/shared/utils';

	const modes = [
		{ name: 'Americano / Mexicano', path: '/tournament/generator/', color: 'mode-americano' },
		{ name: 'Division', path: '/tournament/division/', color: 'mode-division' },
		{ name: 'Bracket', path: '/tournament/bracket/', color: 'mode-bracket' },
		{ name: 'Winners Court', path: '/tournament/winners-court/', color: 'mode-winners' },
		{ name: 'History', path: '/tournament/history/', color: 'foreground' }
	];

	const pathname = $derived(
		$page.url.pathname.endsWith('/') ? $page.url.pathname : `${$page.url.pathname}/`
	);
</script>

<nav
	aria-label="Tournament sections"
	class="relative z-20 mx-auto mb-6 flex w-full max-w-full flex-wrap justify-center gap-2 px-3 py-2 md:mb-8 md:gap-4 md:p-3"
>
	{#each modes as mode}
		{@const isActive = pathname === mode.path}
		<a
			href={mode.path}
			class={cn(
				'group relative min-h-11 shrink-0 overflow-hidden rounded-xl border px-3 py-2.5 font-display text-[10px] font-black tracking-wider uppercase shadow-sm transition-all duration-300 md:px-5 md:text-[11px]',
				isActive
					? 'z-10 border-foreground bg-foreground text-background shadow-md'
					: 'border-border bg-card text-foreground-70 hover:border-foreground/20 hover:bg-secondary hover:text-foreground'
			)}
		>
			<span class="relative z-10">{mode.name}</span>

			{#if !isActive}
				<div
					class={cn(
						'absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-10',
						mode.color === 'foreground' ? 'bg-foreground' : `bg-${mode.color}`
					)}
				></div>
			{/if}

			{#if isActive}
				<div class="absolute inset-0 bg-gradient-to-tr from-foreground/10 to-transparent"></div>
			{/if}
		</a>
	{/each}
</nav>

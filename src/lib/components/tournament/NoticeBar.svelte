<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/shared/utils';

	interface Props {
		type?: 'info' | 'warning' | 'success' | 'accent';
		children: Snippet;
		class?: string;
	}

	const { type = 'info', children, class: className = '' }: Props = $props();

	const styles = {
		info: 'bg-white/[0.03] border-white/10 text-white/60',
		warning: 'bg-[#FF9500]/10 border-[#FF9500]/20 text-[#FF9500]',
		success: 'bg-success/10 border-success/20 text-success',
		accent: 'bg-accent/10 border-accent/20 text-accent'
	};
</script>

<div
	class={cn(
		'flex items-start gap-4 rounded-2xl border px-6 py-4 text-xs font-black tracking-wider uppercase backdrop-blur-md transition-all',
		styles[type],
		className
	)}
>
	<div class="mt-0.5 shrink-0">
		{#if type === 'info'}
			<svg
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="3"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="12" cy="12" r="10"></circle>
				<line x1="12" y1="16" x2="12" y2="12"></line>
				<line x1="12" y1="8" x2="12.01" y2="8"></line>
			</svg>
		{:else if type === 'success'}
			<svg
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="3"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
				<polyline points="22 4 12 14.01 9 11.01"></polyline>
			</svg>
		{:else}
			<svg
				width="14"
				height="14"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="3"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path
					d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
				></path>
				<line x1="12" y1="9" x2="12" y2="13"></line>
				<line x1="12" y1="17" x2="12.01" y2="17"></line>
			</svg>
		{/if}
	</div>
	<div class="flex-1 leading-relaxed">
		{@render children()}
	</div>
</div>

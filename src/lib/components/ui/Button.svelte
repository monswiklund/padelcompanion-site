<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/shared/utils';

	type Variant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'shiny' | 'glass';
	type Size = 'sm' | 'md' | 'lg';

	interface Props {
		href?: string;
		variant?: Variant;
		size?: Size;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		onclick?: (e: MouseEvent) => void;
		class?: string;
		children: Snippet;
		target?: string;
		rel?: string;
		fullWidth?: boolean;
	}

	const {
		href,
		variant = 'primary',
		size = 'md',
		type = 'button',
		disabled = false,
		onclick,
		class: klass = '',
		children,
		target,
		rel,
		fullWidth = false
	}: Props = $props();

	const base =
		'relative inline-flex min-h-[44px] items-center justify-center rounded-xl font-black uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden active:scale-[0.98] select-none';

	const variants: Record<Variant, string> = {
		primary: 'bg-primary text-primary-foreground hover:bg-primary/95 shadow-md hover:shadow-[0_4px_20px_rgba(0,122,255,0.25)]',
		secondary:
			'bg-white/[0.02] hover:bg-white/[0.06] border border-white/8 text-foreground shadow-md',
		accent: 'bg-accent text-accent-foreground hover:bg-accent-light shadow-md hover:shadow-[0_4px_20px_rgba(0,122,255,0.25)]',
		ghost: 'bg-transparent hover:bg-white/5 text-muted-foreground hover:text-foreground',
		shiny:
			'bg-accent text-accent-foreground shadow-[0_10px_28px_rgba(0,122,255,0.25)] hover:bg-accent-light border-0',
		glass:
			'glass-premium hover:bg-white/5 text-foreground border border-white/8 hover:border-white/15'
	};

	const sizes: Record<Size, string> = {
		sm: 'px-4 py-2 text-xs tracking-wider',
		md: 'px-6 py-3 text-sm tracking-wider',
		lg: 'px-8 py-4 text-base tracking-wider'
	};

	const cls = $derived(cn(base, variants[variant], sizes[size], fullWidth && 'w-full', klass));
</script>

{#if href}
	<a {href} class={cls} {target} {rel}>
		{#if variant === 'shiny'}
			<div
				class="pointer-events-none absolute inset-0 h-full w-full -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"
			></div>
		{/if}
		<span class="relative z-10">{@render children()}</span>
	</a>
{:else}
	<button {type} {disabled} {onclick} class={cls}>
		{#if variant === 'shiny'}
			<div
				class="pointer-events-none absolute inset-0 h-full w-full -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"
			></div>
		{/if}
		<span class="relative z-10">{@render children()}</span>
	</button>
{/if}

<style>
	@keyframes shimmer {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}
	.animate-shimmer {
		animation: shimmer 2s infinite ease-in-out;
	}
</style>

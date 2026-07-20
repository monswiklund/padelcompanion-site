<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/shared/utils';

	interface Props {
		children: Snippet;
		variant?: 'default' | 'hover' | 'active' | 'premium';
		padding?: 'none' | 'sm' | 'md' | 'lg';
		withNoise?: boolean;
		class?: string;
		[key: string]: any;
	}

	const {
		children,
		variant = 'default',
		padding = 'md',
		withNoise = true,
		class: klass = '',
		...props
	}: Props = $props();

	const variants = {
		default: 'glass',
		premium: 'glass-premium',
		hover:
			'glass hover:border-accent/20 hover:shadow-[0_14px_34px_rgba(0,122,255,0.08)] hover:scale-[1.01] transition-all duration-300',
		active:
			'border border-accent/20 bg-accent/5 backdrop-blur-md shadow-[0_12px_28px_rgba(0,122,255,0.1)]'
	};

	const paddingClasses = {
		none: 'p-0',
		sm: 'p-4',
		md: 'p-6 md:p-8',
		lg: 'p-8 md:p-12'
	};
</script>

<div
	class={cn(
		'relative overflow-hidden rounded-card transition-all duration-300',
		variants[variant],
		paddingClasses[padding],
		withNoise && 'noise',
		klass
	)}
	{...props}
>
	<!-- Subtle top light for depth -->
	<div
		class="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent"
	></div>

	<div class="relative z-10">
		{@render children()}
	</div>
</div>

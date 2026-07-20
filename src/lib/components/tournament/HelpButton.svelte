<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { Dialog, Tooltip } from 'bits-ui';
	import GlassCard from '../ui/GlassCard.svelte';

	interface Props {
		title: string;
		content: string;
	}

	const { title, content }: Props = $props();

	let isOpen = $state(false);

	function renderContent(text: string) {
		return text.split('\n').map((line) => {
			const trimmed = line.replace(/\*\*/g, '');
			return {
				text: trimmed.replace(/^[-•]\s+/, ''),
				isBullet: /^[-•]\s+/.test(trimmed)
			};
		});
	}

	const lines = $derived(renderContent(content));
</script>

<Dialog.Root bind:open={isOpen}>
	<Tooltip.Provider>
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props: tooltipProps })}
					<Dialog.Trigger>
						{#snippet child({ props: dialogProps })}
							<button
								{...tooltipProps}
								{...dialogProps}
								class="flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-lg border border-border bg-foreground/5 font-display text-[10px] font-black text-foreground/35 transition-all hover:bg-foreground hover:text-background"
							>
								?
							</button>
						{/snippet}
					</Dialog.Trigger>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Portal>
				<Tooltip.Content
					sideOffset={8}
					class="z-[2000] animate-fade-in rounded-lg border border-border bg-popover px-3 py-2 font-display text-[9px] font-black tracking-wider text-foreground uppercase shadow-md"
				>
					{title}
				</Tooltip.Content>
			</Tooltip.Portal>
		</Tooltip.Root>
	</Tooltip.Provider>

	<Dialog.Portal>
		<Dialog.Overlay forceMount>
			{#snippet child({ props, open: isModalOpen })}
				{#if isModalOpen}
					<div
						{...props}
						transition:fade={{ duration: 200 }}
						class="fixed inset-0 z-[1000] bg-background/80 backdrop-blur-md"
					></div>
				{/if}
			{/snippet}
		</Dialog.Overlay>

		<Dialog.Content forceMount>
			{#snippet child({ props, open: isModalOpen })}
				{#if isModalOpen}
					<div
						{...props}
						transition:scale={{ duration: 220, start: 0.97, opacity: 0 }}
						class="fixed top-1/2 left-1/2 z-[1001] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 px-4"
					>
						<GlassCard
							variant="premium"
							padding="none"
							class="overflow-hidden shadow-lg ring-1 ring-border"
						>
							<!-- Header -->
							<div class="flex items-center justify-between border-b border-border p-6">
								<div class="space-y-1">
									<Dialog.Title
										class="m-0 font-display text-2xl font-black tracking-normal text-foreground"
									>
										{title}
									</Dialog.Title>
									<p class="text-[10px] font-black tracking-wider text-accent uppercase">
										Quick help
									</p>
								</div>
								<Dialog.Close
									class="flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-xl border border-border bg-foreground/5 text-foreground/40 transition-all hover:bg-foreground/10 hover:text-foreground"
								>
									<span class="text-lg">✕</span>
								</Dialog.Close>
							</div>

							<!-- Content -->
							<div class="custom-scrollbar max-h-[60dvh] overflow-y-auto p-6">
								<Dialog.Description
									class="space-y-4 font-sans text-xs leading-relaxed text-muted-foreground"
								>
									{#each lines as line}
										<span class={line.isBullet ? 'ml-4 block list-item' : 'block'}>
											{line.text || '\u00a0'}
										</span>
									{/each}
								</Dialog.Description>
							</div>

							<!-- Footer -->
							<div class="flex justify-center border-t border-border bg-foreground/[0.01] p-5">
								<Dialog.Close>
									<button
										class="min-h-[44px] px-4 text-[10px] font-black tracking-wider text-foreground/35 uppercase transition-colors hover:text-foreground"
									>
										UNDERSTOOD
									</button>
								</Dialog.Close>
							</div>
						</GlassCard>
					</div>
				{/if}
			{/snippet}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 2px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 10px;
	}
</style>

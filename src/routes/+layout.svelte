<script lang="ts">
	import './layout.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import SmoothScroll from '$lib/components/SmoothScroll.svelte';
	import { activeModal } from '$lib/tournament/core/modals';
	import { fade, scale } from 'svelte/transition';
	import { Dialog } from 'bits-ui';

	const { children } = $props();
	let modalVal = $state('');

	let open = $state(false);

	// Keep a local copy of modal state to react to changes smoothly
	let modal = $state<any>(null);
	activeModal.subscribe((val) => {
		modal = val;
		open = !!(val && val.isOpen);
		if (val && val.type === 'input') {
			modalVal = '';
		}
	});

	function handleOpenChange(v: boolean) {
		open = v;
		if (!v && modal?.onDismiss) {
			modal.onDismiss();
		}
	}

	function handleConfirm() {
		if (modal.onConfirm) {
			if (modal.type === 'input') {
				modal.onConfirm(modalVal);
			} else {
				modal.onConfirm();
			}
		}
	}

	function focusOnMount(node: HTMLInputElement) {
		queueMicrotask(() => node.focus());
	}
</script>

<SmoothScroll>
	<div
		class="flex min-h-dvh flex-col overflow-x-clip bg-background text-foreground selection:bg-accent selection:text-white"
	>
		<Header />
		<main class="flex-1 pt-20">
			{@render children()}
		</main>
		<Footer />
	</div>
</SmoothScroll>

<Dialog.Root {open} onOpenChange={handleOpenChange}>
	<Dialog.Portal>
		<Dialog.Overlay forceMount>
			{#snippet child({ props, open: isOpen })}
				{#if isOpen}
					<div
						{...props}
						transition:fade={{ duration: 200 }}
						class="fixed inset-0 z-[800] bg-black/60 backdrop-blur-md"
					></div>
				{/if}
			{/snippet}
		</Dialog.Overlay>

		<Dialog.Content forceMount>
			{#snippet child({ props, open: isOpen })}
				{#if isOpen}
					<div
						{...props}
						transition:scale={{ duration: 250, start: 0.95 }}
						class="fixed top-1/2 left-1/2 z-[801] max-h-[min(90dvh,720px)] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-card border border-border bg-popover p-6 shadow-lg select-none md:p-8"
					>
						<!-- Title -->
						<Dialog.Title
							class="mb-3 font-display text-2xl font-black tracking-normal text-foreground"
						>
							{modal?.title}
						</Dialog.Title>

						<!-- Description / Message -->
						{#if modal?.description}
							<Dialog.Description
								class="mb-4 font-sans text-sm leading-relaxed text-muted-foreground"
							>
								{modal.description}
							</Dialog.Description>
						{/if}

						{#if modal?.message}
							<div
								class="mb-6 space-y-2 text-sm leading-relaxed text-muted-foreground/90 md:text-base"
							>
								{modal.message}
							</div>
						{/if}

						<!-- Input modal field -->
						{#if modal?.type === 'input'}
							<div class="mb-6">
								<input
									type="text"
									enterkeyhint="done"
									bind:value={modalVal}
									placeholder={modal.placeholder || 'Enter value...'}
									class="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground transition-colors placeholder:text-muted-foreground focus:border-accent focus:outline-none"
									onkeydown={(e) => e.key === 'Enter' && handleConfirm()}
									use:focusOnMount
								/>
							</div>
						{/if}

						<!-- Standings list for complete tournament -->
						{#if modal?.type === 'standings' && modal.standings}
							<div class="custom-scrollbar mb-6 max-h-[460px] space-y-3 overflow-y-auto pr-1">
								{#each modal.standings as p, i}
									<div
										class="flex items-center rounded-xl p-3 transition-all md:p-4 {i < 3
											? 'border border-accent/20 bg-accent/10'
											: 'border border-border bg-foreground/5'}"
									>
										<div class="mr-3 w-8 text-center font-display text-xl">
											{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
										</div>
										<div class="flex-1 font-display text-lg font-bold text-foreground">
											{p.name}
										</div>
										<div class="text-sm font-semibold text-muted-foreground">
											{p.points} pts · {p.played} games
										</div>
									</div>
								{/each}
							</div>
						{/if}

						<!-- Footer Buttons -->
						<div class="mt-2 flex justify-end gap-3 border-t border-border pt-5">
							{#if modal?.type === 'confirm'}
								{#if modal.secondaryText && modal.onSecondary}
									<button
										class="inline-flex h-[44px] cursor-pointer items-center rounded-xl border-0 bg-transparent px-5 font-display text-sm font-bold text-foreground-70 transition-all hover:bg-foreground/5 hover:text-foreground"
										style="min-height: 44px"
										onclick={() => modal.onSecondary && modal.onSecondary()}
									>
										{modal.secondaryText}
									</button>
								{/if}
								<Dialog.Close
									class="inline-flex h-[44px] cursor-pointer items-center rounded-xl border-0 bg-transparent px-5 font-display text-sm font-bold text-muted-foreground transition-all hover:bg-foreground/5 hover:text-foreground"
									style="min-height: 44px"
								>
									Cancel
								</Dialog.Close>
								<button
									class="hover-glow inline-flex h-[44px] cursor-pointer items-center rounded-xl border-0 px-5 font-display text-sm font-bold shadow-sm transition-all {modal.isDanger
										? 'bg-destructive text-white hover:bg-destructive/90'
										: 'bg-accent text-white hover:bg-accent/90'}"
									style="min-height: 44px"
									onclick={handleConfirm}
								>
									{modal.confirmText || 'Confirm'}
								</button>
							{:else if modal?.type === 'input'}
								<Dialog.Close
									class="inline-flex h-[44px] cursor-pointer items-center rounded-xl border-0 bg-transparent px-5 font-display text-sm font-bold text-muted-foreground transition-all hover:bg-foreground/5 hover:text-foreground"
									style="min-height: 44px"
								>
									Cancel
								</Dialog.Close>
								<button
									class="hover-glow inline-flex h-[44px] cursor-pointer items-center rounded-xl border-0 bg-accent px-5 font-display text-sm font-bold text-white shadow-sm transition-all hover:bg-accent/90"
									style="min-height: 44px"
									onclick={handleConfirm}
								>
									Add
								</button>
							{:else if modal?.type === 'alert' || modal?.type === 'info' || modal?.type === 'standings'}
								<Dialog.Close
									class="hover-glow inline-flex h-[44px] cursor-pointer items-center rounded-xl border-0 bg-accent px-6 font-display text-sm font-bold text-white shadow-sm transition-all hover:bg-accent/90"
									style="min-height: 44px"
								>
									{modal.type === 'standings' ? 'Done' : 'OK'}
								</Dialog.Close>
							{/if}
						</div>
					</div>
				{/if}
			{/snippet}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

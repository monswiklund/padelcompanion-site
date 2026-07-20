<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import Icons from '$lib/components/Icons.svelte';
	import { Select } from 'bits-ui';

	const SUBJECT_OPTIONS = [
		{ value: 'General Inquiry', label: 'General Inquiry' },
		{ value: 'Bug Report', label: 'Bug Report' },
		{ value: 'Feature Request', label: 'Feature Request' }
	];

	const FAQ_DATA = [
		{
			category: 'General',
			items: [
				{
					q: 'How do I track a match?',
					a: 'Open the app and tap "New Match" on the home screen. Add the players, select the scoring format, and tap "Start Match". During the match, simply tap the team that won the point to update the score.'
				},
				{
					q: 'Can I use the app on my smartwatch?',
					a: 'Yes! Padel Companion has fully-featured smartwatch apps for both Apple Watch and Wear OS. You can start matches, track scores, and view statistics directly from your wrist.'
				},
				{
					q: "Can I edit a match after it's finished?",
					a: 'Yes, you can edit the final score, date, and players of any completed match. Go to your "History" tab, select the match you want to modify, and tap the "Edit" button.'
				}
			]
		},
		{
			category: 'Tournaments',
			items: [
				{
					q: 'How do I organize an Americano tournament?',
					a: 'Go to "Tournaments" and tap "New Tournament". Select "Americano" as the format, add your players, set the number of courts, and the app will automatically generate the schedule.'
				},
				{
					q: 'What is Mexicano format?',
					a: 'Mexicano is a dynamic tournament format where pairings change after each round based on the leaderboard. The top players are paired against each other.'
				},
				{
					q: 'Can I handle uneven numbers of players?',
					a: 'Absolutely. The tournament engine automatically handles "bye" rounds if you have an uneven number of players (e.g., 5, 9, 13).'
				}
			]
		},
		{
			category: 'Account & Privacy',
			items: [
				{
					q: 'Is my data synced across devices?',
					a: "Yes! When you're signed in, your matches and statistics sync automatically across all your devices via iCloud (iOS) or Google Cloud (Android)."
				},
				{
					q: 'How do I delete my account?',
					a: 'To delete your account, open the app, go to Settings, scroll to the bottom and tap "Delete Account". This action is permanent.'
				}
			]
		}
	];

	let search = $state('');
	let contactName = $state('');
	let contactEmail = $state('');
	let contactSubject = $state('');
	let contactMessage = $state('');

	// Track open detail items (so we can close others or style properly)
	const openItems = $state<Record<string, boolean>>({});

	function toggleItem(key: string) {
		openItems[key] = !openItems[key];
	}

	// Reactive filtered FAQs
	const filteredFaqs = $derived.by(() => {
		return FAQ_DATA.map((cat) => ({
			...cat,
			items: cat.items.filter(
				(i) =>
					i.q.toLowerCase().includes(search.toLowerCase()) ||
					i.a.toLowerCase().includes(search.toLowerCase())
			)
		})).filter((cat) => cat.items.length > 0);
	});

	function handleContactSubmit(e: Event) {
		e.preventDefault();
		const subject = encodeURIComponent(`Support: ${contactSubject}`);
		const body = encodeURIComponent(
			`Name: ${contactName}\nEmail: ${contactEmail}\n\nMessage:\n${contactMessage}`
		);
		window.location.href = `mailto:wiklund.labs@gmail.com?subject=${subject}&body=${body}`;
	}

	onMount(() => {
		window.scrollTo(0, 0);
	});
</script>

<svelte:head>
	<title>Support | Padel Companion</title>
	<meta
		name="description"
		content="Find Padel Companion support answers, contact the team, and get help with matches, tournaments, account, and privacy."
	/>
	<link rel="canonical" href="https://padelcompanion.se/support/" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://padelcompanion.se/support/" />
	<meta property="og:title" content="Support | Padel Companion" />
	<meta property="og:description" content="Get help with Padel Companion." />
	<meta property="og:image" content="https://padelcompanion.se/assets/app-icon.jpeg" />
</svelte:head>

<main class="min-h-dvh py-20">
	<div class="mx-auto max-w-4xl px-6">
		<!-- Header -->
		<div class="mb-14 animate-fade-in-up text-center">
			<h1 class="mb-5 font-display text-4xl font-black tracking-normal text-foreground md:text-5xl">
				How Can We Help?
			</h1>
			<p class="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
				Find answers to common questions or get in touch with our support team.
			</p>

			<!-- Search Input -->
			<div class="relative mx-auto max-w-md">
				<input
					type="search"
					enterkeyhint="search"
					placeholder="Search for answers..."
					bind:value={search}
					class="w-full rounded-xl border border-border bg-card px-5 py-3.5 pr-12 text-foreground transition-colors placeholder:text-muted-foreground focus:border-accent focus:outline-none"
				/>
				<span
					class="absolute top-1/2 right-5 flex -translate-y-1/2 items-center text-muted-foreground"
				>
					<Icons name="search" size={18} />
				</span>
			</div>
		</div>

		<!-- FAQ Section -->
		<section class="mb-20">
			{#if filteredFaqs.length > 0}
				{#each filteredFaqs as cat, catIdx}
					<div class="mb-10 animate-fade-in">
						<h3 class="mb-4 font-display text-lg font-black tracking-normal text-foreground">
							{cat.category}
						</h3>

						<div class="space-y-3">
							{#each cat.items as item, itemIdx}
								{@const itemKey = `${catIdx}-${itemIdx}`}
								<div
									class="overflow-hidden rounded-xl border border-border bg-card transition-all duration-300"
								>
									<button
										onclick={() => toggleItem(itemKey)}
										class="flex w-full cursor-pointer items-center justify-between border-0 bg-transparent p-5 text-left font-display text-base font-semibold text-foreground transition-colors hover:bg-popover"
									>
										<span>{item.q}</span>
										<span
											class="text-xl text-accent transition-transform duration-300 select-none"
											style="transform: rotate({openItems[itemKey] ? '45deg' : '0deg'})"
										>
											+
										</span>
									</button>

									{#if openItems[itemKey]}
										<div
											transition:slide={{ duration: 250 }}
											class="border-t border-border/10 px-5 pt-3 pb-5 text-[0.95rem] leading-relaxed text-muted-foreground"
										>
											<p>{item.a}</p>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{/each}
			{:else}
				<div class="animate-fade-in py-12 text-center">
					<p class="text-lg text-muted-foreground">
						No results found for "{search}"
					</p>
				</div>
			{/if}
		</section>

		<!-- Contact Section -->
		<section class="animate-fade-in-up">
			<div class="overflow-hidden rounded-card border border-border bg-card shadow-sm">
				<div class="grid md:grid-cols-2">
					<!-- Contact Info -->
					<div class="flex flex-col justify-between bg-popover/40 p-8 md:p-10">
						<div>
							<h3 class="mb-4 font-display text-3xl font-black text-foreground">
								Still Need Help?
							</h3>
							<p class="mb-10 text-muted-foreground">
								Our support team is available Monday through Friday to assist you.
							</p>
						</div>

						<div class="space-y-8">
							<div class="flex items-start gap-4">
								<span class="mt-1 flex items-center text-2xl text-accent"
									><Icons name="cloud" size={24} /></span
								>
								<div>
									<strong class="mb-1 block font-display text-foreground"> Email Us </strong>
									<a
										href="mailto:wiklund.labs@gmail.com"
										class="inline-flex min-h-[44px] items-center font-semibold text-accent transition-colors hover:text-accent-light"
									>
										wiklund.labs@gmail.com
									</a>
								</div>
							</div>

							<div class="flex items-start gap-4">
								<span class="mt-1 flex items-center text-2xl text-accent"
									><Icons name="globe" size={24} /></span
								>
								<div>
									<strong class="mb-1 block font-display text-foreground"> Instagram </strong>
									<a
										href="https://www.instagram.com/padelcompanion/"
										target="_blank"
										rel="noreferrer"
										class="inline-flex min-h-[44px] items-center font-semibold text-accent transition-colors hover:text-accent-light"
									>
										@padelcompanion
									</a>
								</div>
							</div>
						</div>
					</div>

					<!-- Contact Form -->
					<form
						class="border-t border-border p-8 md:border-t-0 md:border-l md:p-10"
						onsubmit={handleContactSubmit}
					>
						<h3 class="mb-6 font-display text-2xl font-black text-foreground">Send us a Message</h3>

						<div class="space-y-4">
							<div>
								<label
									for="contact-name"
									class="mb-2 block text-xs font-bold tracking-wider text-muted-foreground uppercase"
								>
									Name
								</label>
								<input
									id="contact-name"
									type="text"
									autocomplete="name"
									enterkeyhint="next"
									required
									bind:value={contactName}
									placeholder="Your name"
									class="w-full rounded-xl border border-border bg-popover px-4 py-3 text-foreground transition-colors placeholder:text-muted-foreground focus:border-accent focus:outline-none"
								/>
							</div>

							<div>
								<label
									for="contact-email"
									class="mb-2 block text-xs font-bold tracking-wider text-muted-foreground uppercase"
								>
									Email
								</label>
								<input
									id="contact-email"
									type="email"
									inputmode="email"
									autocomplete="email"
									enterkeyhint="next"
									required
									bind:value={contactEmail}
									placeholder="your@email.com"
									class="w-full rounded-xl border border-border bg-popover px-4 py-3 text-foreground transition-colors placeholder:text-muted-foreground focus:border-accent focus:outline-none"
								/>
							</div>

							<div>
								<span
									id="contact-subject-label"
									class="mb-2 block text-xs font-bold tracking-wider text-muted-foreground uppercase"
								>
									Subject
								</span>
								<Select.Root type="single" bind:value={contactSubject} required>
									<Select.Trigger
										class="flex w-full cursor-pointer items-center justify-between rounded-xl border border-border bg-popover px-4 py-3 text-foreground transition-colors focus:border-accent focus:outline-none"
										aria-labelledby="contact-subject-label"
									>
										{SUBJECT_OPTIONS.find((o) => o.value === contactSubject)?.label ??
											'Select a topic'}
										<svg
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg
										>
									</Select.Trigger>
									<Select.Portal>
										<Select.Content
											class="z-[1001] min-w-[var(--bits-select-anchor-width)] rounded-xl border border-border bg-popover p-1 shadow-md"
											sideOffset={4}
										>
											<Select.Viewport>
												{#each SUBJECT_OPTIONS as o}
													<Select.Item
														value={o.value}
														label={o.label}
														class="cursor-pointer rounded-lg px-3 py-2 text-foreground transition-colors outline-none data-[highlighted]:bg-accent/10"
													>
														{o.label}
													</Select.Item>
												{/each}
											</Select.Viewport>
										</Select.Content>
									</Select.Portal>
								</Select.Root>
							</div>

							<div>
								<label
									for="contact-message"
									class="mb-2 block text-xs font-bold tracking-wider text-muted-foreground uppercase"
								>
									Message
								</label>
								<textarea
									id="contact-message"
									rows="4"
									enterkeyhint="send"
									required
									bind:value={contactMessage}
									placeholder="How can we help?"
									class="w-full resize-none rounded-xl border border-border bg-popover px-4 py-3 text-foreground transition-colors placeholder:text-muted-foreground focus:border-accent focus:outline-none"
								></textarea>
							</div>

							<button
								type="submit"
								class="hover-glow w-full cursor-pointer rounded-xl border-0 bg-accent py-3.5 font-bold text-white shadow-md transition-all hover:bg-accent-dark"
							>
								Send Message
							</button>
						</div>
					</form>
				</div>
			</div>
		</section>
	</div>
</main>

<script lang="ts">
	const year = new Date().getFullYear();
</script>

<footer class="mt-auto border-t border-border bg-background pt-20 pb-12" id="footer">
	<div class="container mx-auto max-w-[1200px] px-6">
		<div class="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-5">
			<!-- Info column -->
			<div class="md:col-span-2">
				<a
					href="/"
					class="mb-6 flex min-h-[44px] min-w-[44px] items-center gap-3 font-display text-xl font-black text-foreground uppercase"
				>
					<img
						src="/assets/app-icon.jpeg"
						alt="Padel Companion Logo"
						width="40"
						height="40"
						class="h-10 w-10 rounded-xl"
					/>
					<span>PADEL<span class="text-accent">COMPANION</span></span>
				</a>
				<p class="max-w-sm text-sm leading-relaxed text-muted-foreground">
					Your digital padel companion. Track scores, view statistics, and organize exciting tournaments directly on your phone or your wrist.
				</p>
			</div>

			<!-- Appen column -->
			<div>
				<h5 class="mb-4 text-xs font-black tracking-wider text-muted-foreground uppercase">
					App
				</h5>
				<ul class="m-0 flex list-none flex-col gap-2.5 p-0">
					<li>
						<a href="/#features" class="inline-flex min-h-[44px] items-center px-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
							Features
						</a>
					</li>
					<li>
						<a href="/#app" class="inline-flex min-h-[44px] items-center px-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
							Pricing
						</a>
					</li>
					<li>
						<a href="/support" class="inline-flex min-h-[44px] items-center px-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
							FAQ
						</a>
					</li>
				</ul>
			</div>

			<!-- Turneringar column -->
			<div>
				<h5 class="mb-4 text-xs font-black tracking-wider text-muted-foreground uppercase">
					Tournaments
				</h5>
				<ul class="m-0 flex list-none flex-col gap-2.5 p-0">
					<li>
						<a href="/tournament/generator" class="inline-flex min-h-[44px] items-center px-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
							Create Tournament
						</a>
					</li>
					<li>
						<a href="/support" class="inline-flex min-h-[44px] items-center px-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
							Rules
						</a>
					</li>
					<li>
						<a href="/tournament/history" class="inline-flex min-h-[44px] items-center px-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
							Standings & History
						</a>
					</li>
				</ul>
			</div>

			<!-- Företag column -->
			<div>
				<h5 class="mb-4 text-xs font-black tracking-wider text-muted-foreground uppercase">
					Company
				</h5>
				<ul class="m-0 flex list-none flex-col gap-2.5 p-0">
					<li>
						<a href="/#app" class="inline-flex min-h-[44px] items-center px-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
							About Us
						</a>
					</li>
					<li>
						<a href="mailto:wiklund.labs@gmail.com" class="inline-flex min-h-[44px] items-center px-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
							Contact
						</a>
					</li>
					<li>
						<a href="/#partners" class="inline-flex min-h-[44px] items-center px-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
							Partnerships
						</a>
					</li>
				</ul>
			</div>
		</div>

		<!-- Legal row -->
		<div class="mt-16 border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
			<p>&copy; {year} Padel Companion. All rights reserved.</p>
			
			<div class="flex gap-6">
				<a href="/privacy" class="inline-flex min-h-[44px] min-w-[44px] items-center hover:text-foreground transition-colors">
					Privacy Policy
				</a>
				<a href="/terms" class="inline-flex min-h-[44px] min-w-[44px] items-center hover:text-foreground transition-colors">
					Terms of Service
				</a>
			</div>
		</div>
	</div>
</footer>

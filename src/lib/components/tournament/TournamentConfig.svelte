<script lang="ts">
	import { Select, Switch } from 'bits-ui';
	import HelpButton from './HelpButton.svelte';
	import {
		HELP_AMERICANO,
		HELP_MEXICANO,
		HELP_TEAM,
		HELP_TEAM_MEXICANO
	} from '$lib/tournament/content/help';

	export interface TournamentConfigState {
		format: 'americano' | 'mexicano' | 'team' | 'teamMexicano' | 'division';
		courts: number;
		scoringMode: 'total' | 'race' | 'time';
		pointsPerMatch: number;
		maxRepeats: number;
		pairingStrategy: 'optimal' | 'oneTwo' | 'oneThree' | 'oneFour';
		strictStrategy: boolean;
		allowCourtChange: boolean;
		courtFormat: 'number' | 'court' | 'custom';
		customCourtNames: string[];
	}

	interface Props {
		config: TournamentConfigState;
		playerCount: number;
		onChange: (key: keyof TournamentConfigState, value: any) => void;
	}

	let { config, playerCount, onChange }: Props = $props();

	const CONFIG_OPTIONS = {
		format: [
			{
				value: 'americano',
				label: 'Americano',
				desc: 'Fixed rounds',
				help: HELP_AMERICANO
			},
			{
				value: 'mexicano',
				label: 'Mexicano',
				desc: 'Dynamic pairs',
				help: HELP_MEXICANO
			},
			{ value: 'team', label: 'Team', desc: 'Fixed teams', help: HELP_TEAM },
			{
				value: 'teamMexicano',
				label: 'Team Mex',
				desc: 'Dynamic teams',
				help: HELP_TEAM_MEXICANO
			}
		],
		scoringMode: [
			{ value: 'total', label: 'Total Points' },
			{ value: 'race', label: 'Race to' },
			{ value: 'time', label: 'Timed' }
		],
		maxRepeats: [
			{ value: 0, label: 'No repeats' },
			{ value: 1, label: 'Max 1x' },
			{ value: 2, label: 'Max 2x' },
			{ value: 3, label: 'Max 3x' },
			{ value: 99, label: 'Unlimited' }
		],
		pairingStrategy: [
			{ value: 'optimal', label: 'Optimal' },
			{ value: 'oneThree', label: '1&3 vs 2&4' },
			{ value: 'oneTwo', label: '1&2 vs 3&4' },
			{ value: 'oneFour', label: '1&4 vs 2&3' }
		],
		courtFormat: [
			{ value: 'number', label: 'Numbered (1)' },
			{ value: 'court', label: 'Court Label (Court 1)' },
			{ value: 'custom', label: 'Custom Names' }
		]
	};

	let isTeamMex = $derived(config.format === 'teamMexicano');
	let baseFormat = $derived(
		isTeamMex ? 'mexicano' : config.format === 'team' ? 'americano' : config.format
	);
	let isMexicano = $derived(config.format === 'mexicano' || config.format === 'teamMexicano');
	let effectiveMaxCourts = $derived(Math.max(1, Math.floor(playerCount / 4)));

	function handleFormatChange(f: any) {
		onChange('format', f);
	}

	function toggleTeamMexicano() {
		onChange('format', config.format === 'mexicano' ? 'teamMexicano' : 'mexicano');
	}

	function handleNumberChange(
		key: keyof TournamentConfigState,
		val: number,
		min: number,
		max: number
	) {
		const clamped = Math.min(max, Math.max(min, val));
		onChange(key, clamped);
	}

	function getPointsLabel() {
		if (config.scoringMode === 'time') return 'Minutes';
		if (config.scoringMode === 'race') return 'Race to';
		return 'Total Points';
	}
</script>

<div class="space-y-6 font-sans select-none">
	<!-- Format Selector -->
	<div>
		<div class="mb-3 flex items-center gap-2">
			<h4 class="text-[10px] font-black tracking-wider text-muted-foreground uppercase">Format</h4>
			<HelpButton
				title={CONFIG_OPTIONS.format.find((o) => o.value === config.format)?.help.title || 'Format'}
				content={CONFIG_OPTIONS.format.find((o) => o.value === config.format)?.help.content || ''}
			/>
		</div>

		<div class="grid grid-cols-2 gap-2.5">
			{#each ['americano', 'mexicano'] as f}
				{@const opt = CONFIG_OPTIONS.format.find((o) => o.value === f)!}
				{@const isActive = baseFormat === f}
				<button
					type="button"
					class="group relative overflow-hidden rounded-2xl border px-4 py-3 text-left transition-all duration-300 {isActive
						? 'border-accent bg-accent text-accent-foreground shadow-lg shadow-accent/15'
						: 'border-white/5 bg-black/20 text-muted-foreground hover:border-white/10 hover:text-white'}"
					onclick={() => handleFormatChange(f)}
				>
					<div class="font-display text-sm font-bold tracking-tight">{opt.label}</div>
					<div
						class="mt-0.5 font-sans text-[11px] opacity-70 transition-opacity group-hover:opacity-100"
					>
						{opt.desc}
					</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Game Settings -->
	<div>
		<div class="mb-3 flex items-center gap-2">
			<h4 class="text-[10px] font-black tracking-wider text-muted-foreground uppercase">
				Game Settings
			</h4>
		</div>

		<div class="space-y-4 rounded-2xl border border-white/5 bg-black/20 p-4 shadow-xl">
			{#if baseFormat === 'mexicano'}
				<div class="flex items-center justify-between border-b border-white/5 py-1 pb-3">
					<div>
						<span class="text-sm font-bold text-white">Team Mode</span>
						<div class="text-[11px] text-muted-foreground">Fixed teams</div>
					</div>
					<Switch.Root
						checked={isTeamMex}
						onCheckedChange={toggleTeamMexicano}
						aria-label="Team Mexicano"
						class="relative h-[44px] w-16 cursor-pointer rounded-full border transition-colors data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=unchecked]:border-white/10 data-[state=unchecked]:bg-white/[0.04]"
					>
						<Switch.Thumb
							class="absolute top-1.5 left-1.5 h-8 w-8 rounded-full bg-white shadow-lg transition-transform duration-300 data-[state=checked]:translate-x-5"
						/>
					</Switch.Root>
				</div>
			{/if}

			<!-- Courts -->
			<div class="flex items-center justify-between border-b border-white/5 py-1 pb-3">
				<div>
					<span class="text-sm font-bold text-white">Courts</span>
					<div class="text-[11px] text-muted-foreground">
						Simultaneous courts ({playerCount} players ready)
					</div>
				</div>
				<div class="flex items-center overflow-hidden rounded-xl border border-white/5 bg-black/30">
					<button
						type="button"
						class="flex h-[44px] w-[44px] shrink-0 items-center justify-center text-lg font-bold text-accent transition-colors hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-30"
						disabled={config.courts <= 1}
						onclick={() => handleNumberChange('courts', config.courts - 1, 1, effectiveMaxCourts)}
					>
						−
					</button>
					<div class="w-9 text-center font-display text-sm font-bold text-white">
						{config.courts}
					</div>
					<button
						type="button"
						class="flex h-[44px] w-[44px] shrink-0 items-center justify-center text-lg font-bold text-accent transition-colors hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-30"
						disabled={config.courts >= effectiveMaxCourts}
						onclick={() => handleNumberChange('courts', config.courts + 1, 1, effectiveMaxCourts)}
					>
						+
					</button>
				</div>
			</div>

			<!-- Scoring Mode -->
			<div class="flex items-center justify-between border-b border-white/5 py-1 pb-3">
				<div>
					<span class="text-sm font-bold text-white">Scoring</span>
					<div class="text-[11px] text-muted-foreground">Win condition</div>
				</div>
				<Select.Root
					type="single"
					value={config.scoringMode}
					onValueChange={(v) => {
						const mode = v as any;
						onChange('scoringMode', mode);
						const presets: Record<string, number> = {
							total: 24,
							race: 14,
							time: 11
						};
						if (presets[mode]) {
							onChange('pointsPerMatch', presets[mode]);
						}
					}}
				>
					<Select.Trigger
						class="flex min-h-[44px] min-w-[120px] cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-black/30 px-3 py-2 font-sans text-xs font-bold text-white outline-none focus:border-accent focus:outline-none"
					>
						{CONFIG_OPTIONS.scoringMode.find((o) => o.value === config.scoringMode)?.label}
						<span class="ml-2 text-[10px] text-white/50">▼</span>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content
							class="z-[1001] min-w-[140px] rounded-xl border border-white/10 bg-[#1c1c1e] p-1 font-sans text-sm shadow-2xl"
							sideOffset={4}
						>
							<Select.Viewport>
								{#each CONFIG_OPTIONS.scoringMode as o}
									<Select.Item
										value={o.value}
										label={o.label}
										class="cursor-pointer rounded-lg px-3 py-2 text-white transition-colors outline-none data-[highlighted]:bg-white/10"
									>
										{o.label}
									</Select.Item>
								{/each}
							</Select.Viewport>
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			</div>

			<!-- Points stepper -->
			<div class="flex items-center justify-between py-1">
				<div>
					<span class="text-sm font-bold text-white">{getPointsLabel()}</span>
					<div class="text-[11px] text-muted-foreground">
						{config.scoringMode === 'time' ? 'Duration (min)' : 'Target score'}
					</div>
				</div>
				<div class="flex items-center overflow-hidden rounded-xl border border-white/5 bg-black/30">
					<button
						type="button"
						class="flex h-[44px] w-[44px] shrink-0 items-center justify-center text-lg font-bold text-accent transition-colors hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-30"
						disabled={config.pointsPerMatch <= 4}
						onclick={() =>
							handleNumberChange(
								'pointsPerMatch',
								config.pointsPerMatch - (config.scoringMode === 'time' ? 1 : 2),
								4,
								50
							)}
					>
						−
					</button>
					<div class="w-9 text-center font-display text-sm font-bold text-white">
						{config.pointsPerMatch}
					</div>
					<button
						type="button"
						class="flex h-[44px] w-[44px] shrink-0 items-center justify-center text-lg font-bold text-accent transition-colors hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-30"
						disabled={config.pointsPerMatch >= 50}
						onclick={() =>
							handleNumberChange(
								'pointsPerMatch',
								config.pointsPerMatch + (config.scoringMode === 'time' ? 1 : 2),
								4,
								50
							)}
					>
						+
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Mexicano Settings -->
	{#if isMexicano}
		<div>
			<div class="mb-3 flex items-center gap-2">
				<h4 class="text-[10px] font-black tracking-wider text-muted-foreground uppercase">
					Advanced Matchup Logic
				</h4>
			</div>

			<div class="space-y-4 rounded-2xl border border-white/5 bg-black/20 p-4 shadow-xl">
				<!-- Partner Repeats -->
				<div class="flex items-center justify-between border-b border-white/5 py-1 pb-3">
					<div>
						<span class="text-sm font-bold text-white">Partner Repeats</span>
						<div class="text-[11px] text-muted-foreground">Max same pair plays</div>
					</div>
					<Select.Root
						type="single"
						value={config.maxRepeats.toString()}
						onValueChange={(v) => onChange('maxRepeats', parseInt(v))}
					>
						<Select.Trigger
							class="flex min-h-[44px] min-w-[120px] cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-black/30 px-3 py-2 font-sans text-xs font-bold text-white outline-none focus:border-accent focus:outline-none"
						>
							{CONFIG_OPTIONS.maxRepeats.find((o) => o.value === config.maxRepeats)?.label}
							<span class="ml-2 text-[10px] text-white/50">▼</span>
						</Select.Trigger>
						<Select.Portal>
							<Select.Content
								class="z-[1001] min-w-[140px] rounded-xl border border-white/10 bg-[#1c1c1e] p-1 font-sans text-sm shadow-2xl"
								sideOffset={4}
							>
								<Select.Viewport>
									{#each CONFIG_OPTIONS.maxRepeats as o}
										<Select.Item
											value={o.value.toString()}
											label={o.label}
											class="cursor-pointer rounded-lg px-3 py-2 text-white transition-colors outline-none data-[highlighted]:bg-white/10"
										>
											{o.label}
										</Select.Item>
									{/each}
								</Select.Viewport>
							</Select.Content>
						</Select.Portal>
					</Select.Root>
				</div>

				<!-- Pairing Style -->
				<div class="flex items-center justify-between border-b border-white/5 py-1 pb-3">
					<div>
						<span class="text-sm font-bold text-white">Pairing Style</span>
						<div class="text-[11px] text-muted-foreground">Matchup logic</div>
					</div>
					<Select.Root
						type="single"
						value={config.pairingStrategy}
						onValueChange={(v) => onChange('pairingStrategy', v)}
					>
						<Select.Trigger
							class="flex min-h-[44px] min-w-[120px] cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-black/30 px-3 py-2 font-sans text-xs font-bold text-white outline-none focus:border-accent focus:outline-none"
						>
							{CONFIG_OPTIONS.pairingStrategy.find((o) => o.value === config.pairingStrategy)
								?.label}
							<span class="ml-2 text-[10px] text-white/50">▼</span>
						</Select.Trigger>
						<Select.Portal>
							<Select.Content
								class="z-[1001] min-w-[140px] rounded-xl border border-white/10 bg-[#1c1c1e] p-1 font-sans text-sm shadow-2xl"
								sideOffset={4}
							>
								<Select.Viewport>
									{#each CONFIG_OPTIONS.pairingStrategy as o}
										<Select.Item
											value={o.value}
											label={o.label}
											class="cursor-pointer rounded-lg px-3 py-2 text-white transition-colors outline-none data-[highlighted]:bg-white/10"
										>
											{o.label}
										</Select.Item>
									{/each}
								</Select.Viewport>
							</Select.Content>
						</Select.Portal>
					</Select.Root>
				</div>

				<!-- Strict Pattern -->
				<div class="flex items-center justify-between py-1">
					<div>
						<span class="text-sm font-bold text-white">Strict Pattern</span>
						<div class="text-[11px] text-muted-foreground">Force pattern pairings</div>
					</div>
					<Switch.Root
						checked={config.strictStrategy && config.pairingStrategy !== 'optimal'}
						disabled={config.pairingStrategy === 'optimal'}
						onCheckedChange={(v) => onChange('strictStrategy', v)}
						aria-label="Strict Pattern"
						class="relative h-[44px] w-16 cursor-pointer rounded-full border transition-colors data-[disabled]:cursor-not-allowed data-[disabled]:border-white/5 data-[disabled]:bg-black/10 data-[disabled]:opacity-30 data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=unchecked]:border-white/10 data-[state=unchecked]:bg-white/[0.04]"
					>
						<Switch.Thumb
							class="absolute top-1.5 left-1.5 h-8 w-8 rounded-full bg-white shadow-lg transition-transform duration-300 data-[state=checked]:translate-x-5"
						/>
					</Switch.Root>
				</div>
			</div>
		</div>
	{/if}

	<!-- Court Display Settings -->
	<div>
		<div class="mb-3 flex items-center gap-2">
			<h4 class="text-[10px] font-black tracking-wider text-muted-foreground uppercase">Display</h4>
		</div>

		<div class="space-y-4 rounded-2xl border border-white/5 bg-black/20 p-4 shadow-xl">
			<div
				class="flex items-center justify-between py-1 {config.courtFormat === 'custom'
					? 'border-b border-white/5 pb-3'
					: ''}"
			>
				<div>
					<span class="text-sm font-bold text-white">Court Names</span>
					<div class="text-[11px] text-muted-foreground">Label format</div>
				</div>
				<Select.Root
					type="single"
					value={config.courtFormat}
					onValueChange={(v) => onChange('courtFormat', v as any)}
				>
					<Select.Trigger
						class="flex min-h-[44px] min-w-[120px] cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-black/30 px-3 py-2 font-sans text-xs font-bold text-white outline-none focus:border-accent focus:outline-none"
					>
						{CONFIG_OPTIONS.courtFormat.find((o) => o.value === config.courtFormat)?.label}
						<span class="ml-2 text-[10px] text-white/50">▼</span>
					</Select.Trigger>
					<Select.Portal>
						<Select.Content
							class="z-[1001] min-w-[140px] rounded-xl border border-white/10 bg-[#1c1c1e] p-1 font-sans text-sm shadow-2xl"
							sideOffset={4}
						>
							<Select.Viewport>
								{#each CONFIG_OPTIONS.courtFormat as o}
									<Select.Item
										value={o.value}
										label={o.label}
										class="cursor-pointer rounded-lg px-3 py-2 text-white transition-colors outline-none data-[highlighted]:bg-white/10"
									>
										{o.label}
									</Select.Item>
								{/each}
							</Select.Viewport>
						</Select.Content>
					</Select.Portal>
				</Select.Root>
			</div>

			{#if config.courtFormat === 'custom'}
				<div class="mt-2 grid grid-cols-2 gap-2">
					{#each Array.from({ length: config.courts }) as _, i}
						<input
							type="text"
							class="min-h-[44px] rounded-xl border border-white/5 bg-black/30 px-3.5 py-2.5 font-sans text-sm text-white transition-colors placeholder:text-muted-foreground/30 focus:border-accent focus:outline-none"
							placeholder={`Court ${i + 1}...`}
							value={config.customCourtNames[i] || ''}
							oninput={(e) => {
								const newNames = [...config.customCourtNames];
								newNames[i] = (e.target as HTMLInputElement).value;
								onChange('customCourtNames', newNames);
							}}
						/>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

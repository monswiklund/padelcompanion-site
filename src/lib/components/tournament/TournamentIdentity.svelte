<script lang="ts">
	import { cn } from '$lib/shared/utils';

	interface Props {
		format: string;
		initialName: string;
		initialNotes: string;
		onUpdate: (key: 'name' | 'notes', value: string) => void;
		className?: string;
	}

	const { format, initialName, initialNotes, onUpdate, className = '' }: Props = $props();

	let localName = $derived(initialName || '');
	let localNotes = $derived(initialNotes || '');

	function handleBlur(key: 'name' | 'notes', value: string) {
		onUpdate(key, value.trim());
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			(e.target as HTMLElement).blur();
		}
	}

	const modeColors: Record<string, string> = {
		americano: 'text-[#42A5F5] bg-[#42A5F5]/10 border-[#42A5F5]/20',
		mexicano: 'text-[#34C759] bg-[#34C759]/10 border-[#34C759]/20',
		division: 'text-[#FF9500] bg-[#FF9500]/10 border-[#FF9500]/20',
		bracket: 'text-[#AF52DE] bg-[#AF52DE]/10 border-[#AF52DE]/20',
		'winners-court': 'text-[#FFD700] bg-[#FFD700]/10 border-[#FFD700]/20'
	};

	const activeModeStyle = $derived(modeColors[format] || modeColors.americano);
</script>

<div class={cn('group relative z-15 mb-4 text-left', className)}>
	<div class="mb-3 flex items-center gap-4">
		<div class="relative">
			<span
				class={cn(
					'relative z-10 inline-block rounded-lg border px-2.5 py-1 text-[8px] font-black tracking-wider uppercase transition-all duration-300',
					activeModeStyle
				)}
			>
				{format === 'winners-court'
					? 'Winners Court'
					: format === 'bracket'
						? 'Bracket'
						: format.charAt(0).toUpperCase() + format.slice(1)}
			</span>
		</div>
		<div class="h-px flex-1 bg-gradient-to-r from-border/50 via-border/10 to-transparent"></div>
	</div>

	<div class="relative space-y-2">
		<div class="relative">
			<input
				type="text"
				enterkeyhint="done"
				aria-label="Tournament name"
				placeholder="TOURNAMENT NAME"
				class="w-full truncate border-none bg-transparent py-1 text-left font-display text-xl leading-[1] font-black tracking-normal text-foreground placeholder:text-muted-foreground/30 focus:ring-0 focus:outline-none md:text-2xl"
				bind:value={localName}
				onblur={() => handleBlur('name', localName)}
				onkeydown={handleKeyDown}
			/>
		</div>

		<div class="relative flex items-center gap-2">
			<div class="h-px w-4 bg-border transition-all group-hover:w-6"></div>
			<input
				type="text"
				enterkeyhint="done"
				aria-label="Tournament notes"
				placeholder="ADD TOURNAMENT NOTES OR RULES..."
				class="flex-1 border-none bg-transparent text-left text-xs font-semibold tracking-wider text-muted-foreground transition-colors placeholder:text-muted-foreground/30 hover:text-foreground/80 focus:ring-0 focus:outline-none"
				bind:value={localNotes}
				onblur={() => handleBlur('notes', localNotes)}
				onkeydown={handleKeyDown}
			/>
		</div>
	</div>
</div>

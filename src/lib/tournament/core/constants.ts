/**
 * Shared constants for the tournament system
 */

export const DIVISION_COLORS = [
	/* 0: A - light blue */ {
		bg: 'bg-[#64B5F6]/10',
		border: 'border-[#64B5F6]/20',
		text: 'text-[#64B5F6] dark:text-[#64B5F6]',
		badge: 'bg-[#64B5F6]',
		headerBg: 'bg-[#64B5F6]/5',
		glow: 'shadow-[#64B5F6]/20'
	},
	/* 1: B - light green */ {
		bg: 'bg-[#34C759]/10',
		border: 'border-[#34C759]/20',
		text: 'text-[#34C759] dark:text-[#34C759]',
		badge: 'bg-[#34C759]',
		headerBg: 'bg-[#34C759]/5',
		glow: 'shadow-[#34C759]/20'
	},
	/* 2: C - yellow */ {
		bg: 'bg-[#FFD700]/10',
		border: 'border-[#FFD700]/20',
		text: 'text-[#FFD700] dark:text-[#FFD700]',
		badge: 'bg-[#FFD700]',
		headerBg: 'bg-[#FFD700]/5',
		glow: 'shadow-[#FFD700]/20'
	},
	/* 3: D - purple */ {
		bg: 'bg-[#AF52DE]/10',
		border: 'border-[#AF52DE]/20',
		text: 'text-[#AF52DE] dark:text-[#AF52DE]',
		badge: 'bg-[#AF52DE]',
		headerBg: 'bg-[#AF52DE]/5',
		glow: 'shadow-[#AF52DE]/20'
	},
	/* 4: E - red */ {
		bg: 'bg-[#FF3B30]/10',
		border: 'border-[#FF3B30]/20',
		text: 'text-[#FF3B30] dark:text-[#FF3B30]',
		badge: 'bg-[#FF3B30]',
		headerBg: 'bg-[#FF3B30]/5',
		glow: 'shadow-[#FF3B30]/20'
	},
	/* 5: F - dark blue */ {
		bg: 'bg-[#42A5F5]/10',
		border: 'border-[#42A5F5]/20',
		text: 'text-[#42A5F5] dark:text-[#42A5F5]',
		badge: 'bg-[#42A5F5]',
		headerBg: 'bg-[#42A5F5]/5',
		glow: 'shadow-[#42A5F5]/20'
	},
	/* 6: G - dark green */ {
		bg: 'bg-[#34C759]/10',
		border: 'border-[#34C759]/20',
		text: 'text-[#34C759] dark:text-[#34C759]',
		badge: 'bg-[#34C759]',
		headerBg: 'bg-[#34C759]/5',
		glow: 'shadow-[#34C759]/20'
	},
	/* 7: H - Orange */ {
		bg: 'bg-[#FF9500]/10',
		border: 'border-[#FF9500]/20',
		text: 'text-[#FF9500] dark:text-[#FF9500]',
		badge: 'bg-[#FF9500]',
		headerBg: 'bg-[#FF9500]/5',
		glow: 'shadow-[#FF9500]/20'
	},
	/* 8: I - Lila */ {
		bg: 'bg-[#AF52DE]/10',
		border: 'border-[#AF52DE]/20',
		text: 'text-[#AF52DE] dark:text-[#AF52DE]',
		badge: 'bg-[#AF52DE]',
		headerBg: 'bg-[#AF52DE]/5',
		glow: 'shadow-[#AF52DE]/20'
	}
];

export const getDivisionColor = (divisions: any[], divisionIdOrName: string | null | undefined) => {
	if (!divisionIdOrName || !divisions) return DIVISION_COLORS[0];

	// Try finding by ID first, then by name
	let index = divisions.findIndex((d) => d.id === divisionIdOrName);
	if (index === -1) {
		index = divisions.findIndex((d) => d.name === divisionIdOrName);
	}

	if (index === -1) return DIVISION_COLORS[0];
	return DIVISION_COLORS[index % DIVISION_COLORS.length];
};

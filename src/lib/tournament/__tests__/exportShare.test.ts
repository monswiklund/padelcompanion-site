import { describe, expect, it } from 'vitest';
import { buildSchedulePrintHtml } from '../ui/setup/exportShare';

describe('tournament export helpers', () => {
	it('builds printable schedule HTML with escaped team names', () => {
		const html = buildSchedulePrintHtml({
			tournamentName: 'Club <Final>',
			format: 'americano',
			players: [
				{ id: '1', name: 'A <One>' },
				{ id: '2', name: 'B' },
				{ id: '3', name: 'C' },
				{ id: '4', name: 'D' }
			],
			schedule: [
				{
					number: 1,
					matches: [
						{
							court: 1,
							team1: [{ id: '1', name: 'A <One>' }],
							team2: [{ id: '2', name: 'B' }],
							score1: 12,
							score2: 10
						}
					]
				}
			]
		} as any);

		expect(html).toContain('Club &lt;Final&gt;');
		expect(html).toContain('A &lt;One&gt;');
		expect(html).toContain('12 - 10');
	});
});

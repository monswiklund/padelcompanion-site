import { expect, test, type Page } from '@playwright/test';

const routes = [
	'/',
	'/tournament',
	'/tournament/generator',
	'/tournament/division',
	'/tournament/winners-court',
	'/tournament/bracket',
	'/tournament/history',
	'/support',
	'/privacy',
	'/terms'
];

async function expectHealthyPage(page: Page) {
	await expect(page.locator('body')).toBeVisible();
	const bodyText = (await page.locator('body').innerText()).toLowerCase();
	expect(bodyText).not.toContain('undefined');
	expect(bodyText).not.toContain('nan');
	expect(bodyText).not.toContain('internal server error');

	const hasHorizontalOverflow = await page.evaluate(
		() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
	);
	expect(hasHorizontalOverflow).toBe(false);
}

test.describe('launch smoke', () => {
	test.beforeEach(async ({ page }) => {
		const errors: string[] = [];
		page.on('console', (message) => {
			if (message.type() === 'error') errors.push(message.text());
		});
		page.on('pageerror', (error) => errors.push(error.message));
		await page.exposeFunction('__getConsoleErrors', () => errors);
	});

	for (const route of routes) {
		test(`renders ${route}`, async ({ page }) => {
			await page.goto(route);
			await expectHealthyPage(page);
			const errors = await page.evaluate(async () => window.__getConsoleErrors());
			expect(errors).toEqual([]);
		});
	}

	test('tournament mode pages expose expected setup controls', async ({ page }) => {
		await page.goto('/tournament/generator');
		await expect(page.getByRole('button', { name: 'Americano', exact: true })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Mexicano', exact: true })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Generate Match Schedule' })).toBeDisabled();
		await expect(page.getByText('Need at least 4 players')).toBeVisible();

		await page.goto('/tournament/division');
		await expect(page.getByText('Tournament Setup')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Generate Division Schedule' })).toBeDisabled();

		await page.goto('/tournament/winners-court');
		await expect(page.getByText('Tournament Setup')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Start Winners Court' })).toBeDisabled();

		await page.goto('/tournament/bracket');
		await expect(page.getByText('Tournament Setup')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Generate Bracket' })).toBeDisabled();
	});
});

declare global {
	interface Window {
		__getConsoleErrors: () => string[];
	}
}

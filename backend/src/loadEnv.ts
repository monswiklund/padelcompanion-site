import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ENV_PATHS = [
	resolve(process.cwd(), 'backend/.env'),
	resolve(process.cwd(), 'backend/.env.local')
];

for (const envPath of ENV_PATHS) {
	if (!existsSync(envPath)) continue;

	const content = readFileSync(envPath, 'utf8');

	for (const rawLine of content.split(/\r?\n/)) {
		const line = rawLine.trim();
		if (!line || line.startsWith('#')) continue;

		const separatorIndex = line.indexOf('=');
		if (separatorIndex === -1) continue;

		const key = line.slice(0, separatorIndex).trim();
		const value = line
			.slice(separatorIndex + 1)
			.trim()
			.replace(/\$\$/g, '$');

		if (key && !(key in process.env)) {
			process.env[key] = value;
		}
	}
}

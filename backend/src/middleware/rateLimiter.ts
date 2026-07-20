import type { IncomingMessage, ServerResponse } from 'node:http';

interface RateLimitInfo {
	count: number;
	resetTime: number;
}

const limits = new Map<string, RateLimitInfo>();

export function rateLimiter(req: IncomingMessage, res: ServerResponse, next: () => void) {
	const ip = req.socket.remoteAddress || 'unknown';
	const now = Date.now();
	const windowMs = 60000; // 1 minute
	const maxRequests = parseInt(process.env.RATE_LIMIT_MAX || '100', 10);

	let info = limits.get(ip);

	if (!info || now > info.resetTime) {
		info = { count: 0, resetTime: now + windowMs };
		limits.set(ip, info);
	}

	info.count++;

	if (info.count > maxRequests) {
		res.statusCode = 429;
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify({ error: 'Too many requests' }));
		return;
	}

	next();
}

import './loadEnv.ts';
import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { rateLimiter } from './middleware/rateLimiter.ts';
import { handleCreateSession, handleGetSession, handleUpdateSession } from './routes/tournament.ts';

const PORT = process.env.PORT || 8787;
const BODY_LIMIT = parseInt(process.env.BODY_LIMIT_BYTES || '1048576', 10); // 1MB

export const requestHandler = async (req: IncomingMessage, res: ServerResponse) => {
	// CORS
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Session-Token');

	if (req.method === 'OPTIONS') {
		res.statusCode = 204;
		res.end();
		return;
	}

	// Rate Limiting
	rateLimiter(req, res, async () => {
		try {
			const url = new URL(req.url || '', `http://${req.headers.host}`);
			const path = url.pathname;

			// Health Check
			if (path === '/api/health') {
				res.statusCode = 200;
				res.end(JSON.stringify({ status: 'ok' }));
				return;
			}

			// POST /api/tournament-sessions
			if (path === '/api/tournament-sessions' && req.method === 'POST') {
				const body = await readJsonBody(req);
				const result = await handleCreateSession(req, res, body);
				sendJson(res, result);
				return;
			}

			// GET /api/tournament-sessions/:code
			const getMatch = path.match(/^\/api\/tournament-sessions\/([^/]+)$/);
			if (getMatch && req.method === 'GET') {
				const result = await handleGetSession(getMatch[1]);
				if (!result) {
					res.statusCode = 404;
					sendJson(res, { error: 'Session not found' });
				} else {
					sendJson(res, result);
				}
				return;
			}

			// PUT /api/tournament-sessions/:id/snapshot
			const updateMatch = path.match(/^\/api\/tournament-sessions\/([^/]+)\/snapshot$/);
			if (updateMatch && req.method === 'PUT') {
				const token =
					req.headers.authorization?.replace('Bearer ', '') ||
					(typeof req.headers['x-session-token'] === 'string'
						? req.headers['x-session-token']
						: '');
				const body = await readJsonBody(req);
				const result = await handleUpdateSession(
					updateMatch[1],
					token,
					body,
					req.socket.remoteAddress
				);
				res.statusCode = result.status;
				sendJson(res, result.error ? { error: result.error } : result.data);
				return;
			}

			// 404
			res.statusCode = 404;
			sendJson(res, { error: 'Not Found' });
		} catch (error: any) {
			console.error('Request error:', error);
			res.statusCode = error.status || 500;
			sendJson(res, { error: error.message || 'Internal Server Error' });
		}
	});
};

async function readJsonBody(req: IncomingMessage): Promise<any> {
	return new Promise((resolve, reject) => {
		let body = '';
		let size = 0;
		req.on('data', (chunk) => {
			size += chunk.length;
			if (size > BODY_LIMIT) {
				const err: any = new Error('Payload too large');
				err.status = 413;
				reject(err);
			}
			body += chunk;
		});
		req.on('end', () => {
			try {
				resolve(body ? JSON.parse(body) : {});
			} catch {
				const err: any = new Error('Invalid JSON');
				err.status = 400;
				reject(err);
			}
		});
	});
}

function sendJson(res: ServerResponse, data: any) {
	if (!res.writableEnded) {
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(data));
	}
}

export const server = createServer(requestHandler);

if (process.env.NODE_ENV !== 'test') {
	server.listen(PORT, () => {
		console.log(`🚀 Airtight TS Backend running on http://localhost:${PORT}`);
	});
}

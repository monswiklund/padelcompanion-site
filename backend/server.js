import "./loadEnv.js";
import { createServer } from "node:http";
import {
  createSession,
  getSessionByShareCode,
  getSessionStore,
  updateSession,
} from "./sessionStore.js";

const PORT = Number(process.env.PORT || 8787);
const store = getSessionStore();
const BODY_LIMIT_BYTES = Number(process.env.BODY_LIMIT_BYTES || 1024 * 1024);
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
const RATE_LIMIT_WRITE_MAX = Number(process.env.RATE_LIMIT_WRITE_MAX || 60);
const ALLOWED_ORIGINS = (process.env.CORS_ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const rateLimitBuckets = new Map();

function getRequestIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "unknown";
}

function createRequestId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function logRequest(level, requestId, req, extra = {}) {
  const payload = {
    level,
    requestId,
    method: req.method,
    path: req.url,
    ip: getRequestIp(req),
    ...extra,
  };
  console.log(JSON.stringify(payload));
}

function buildCorsHeaders(req) {
  const origin = req.headers.origin;
  const corsHeaders = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS,HEAD",
  };

  if (!origin) return corsHeaders;
  if (ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin)) {
    return {
      ...corsHeaders,
      "Access-Control-Allow-Origin": origin,
      Vary: "Origin",
    };
  }

  return corsHeaders;
}

function sendJson(req, res, statusCode, body) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "X-Request-ID": req.requestId,
    ...buildCorsHeaders(req),
  });
  res.end(JSON.stringify(body));
}

async function readJsonBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > BODY_LIMIT_BYTES) {
      const error = new Error("Request body too large");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function enforceRateLimit(req) {
  if (req.method !== "POST" && req.method !== "PUT") return;

  const ip = getRequestIp(req);
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const current = rateLimitBuckets.get(ip) || [];
  const recent = current.filter((timestamp) => timestamp > windowStart);

  if (recent.length >= RATE_LIMIT_WRITE_MAX) {
    const error = new Error("Rate limit exceeded");
    error.statusCode = 429;
    throw error;
  }

  recent.push(now);
  rateLimitBuckets.set(ip, recent);
}

function getSnapshot(body) {
  if (!body || typeof body !== "object" || !body.snapshot) {
    const error = new Error("Missing snapshot payload");
    error.statusCode = 400;
    throw error;
  }
  return body.snapshot;
}

function getEditToken(req) {
  const header = req.headers["x-session-token"];
  if (typeof header === "string" && header.trim()) {
    return header.trim();
  }
  const error = new Error("Missing edit token");
  error.statusCode = 401;
  throw error;
}

function publicSession(session) {
  const { editToken: _editToken, ...rest } = session;
  return rest;
}

const server = createServer(async (req, res) => {
  req.requestId = createRequestId();
  const startedAt = Date.now();
  try {
    if (!req.url || !req.method) {
      sendJson(req, res, 400, { error: "Invalid request" });
      return;
    }

    enforceRateLimit(req);

    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "X-Request-ID": req.requestId,
        ...buildCorsHeaders(req),
      });
      res.end();
      return;
    }

    if ((req.method === "GET" || req.method === "HEAD") && req.url === "/api/health") {
      if (req.method === "HEAD") {
        res.writeHead(200, {
          "X-Request-ID": req.requestId,
          ...buildCorsHeaders(req),
        });
        res.end();
        return;
      }
      sendJson(req, res, 200, { ok: true, store: store.mode });
      return;
    }

    if (req.method === "POST" && req.url === "/api/tournament-sessions") {
      const body = await readJsonBody(req);
      const session = await createSession(getSnapshot(body));
      sendJson(req, res, 201, session);
      return;
    }

    if (req.method === "POST" && req.url === "/api/beta-signup") {
      const body = await readJsonBody(req);
      if (!body.email || typeof body.email !== 'string') {
        sendJson(req, res, 400, { error: "Email is required" });
        return;
      }
      
      console.log(`[BETA SIGNUP] New beta tester registered: ${body.email}`);
      sendJson(req, res, 200, { success: true });
      return;
    }

    const updateMatch = req.url.match(/^\/api\/tournament-sessions\/([^/]+)\/snapshot$/);
    if (req.method === "PUT" && updateMatch) {
      const body = await readJsonBody(req);
      const session = await updateSession(
        decodeURIComponent(updateMatch[1]),
        getSnapshot(body),
        store,
        getEditToken(req),
      );
      sendJson(req, res, 200, session);
      return;
    }

    const getMatch = req.url.match(/^\/api\/tournament-sessions\/([^/]+)$/);
    if (req.method === "GET" && getMatch) {
      const session = await getSessionByShareCode(decodeURIComponent(getMatch[1]));
      sendJson(req, res, 200, publicSession(session));
      return;
    }

    sendJson(req, res, 404, { error: "Not found" });
  } catch (error) {
    const statusCode = error?.statusCode || 500;
    const message = error instanceof Error ? error.message : "Server error";
    sendJson(req, res, statusCode, { error: message });
    logRequest("error", req.requestId, req, {
      statusCode,
      durationMs: Date.now() - startedAt,
      message,
    });
    return;
  }

  logRequest("info", req.requestId, req, {
    statusCode: res.statusCode,
    durationMs: Date.now() - startedAt,
  });
});

server.listen(PORT, () => {
  console.log(
    `Padel backend listening on http://localhost:${PORT} using ${store.mode} storage`,
  );
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    await store.close();
    process.exit(0);
  });
}

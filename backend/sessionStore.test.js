import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";

import {
  createSession,
  createSessionStore,
  getSessionByShareCode,
  listSessions,
  updateSession,
} from "./sessionStore.js";

const tempDirs = [];

async function createTempStorePath() {
  const dir = await mkdtemp(join(tmpdir(), "padel-session-store-"));
  tempDirs.push(dir);
  return join(dir, "sessions.json");
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe("sessionStore", () => {
  it("creates and fetches a session by share code", async () => {
    const storePath = await createTempStorePath();
    const created = await createSession({ metadata: { name: "Tuesday" } }, storePath);

    const fetched = await getSessionByShareCode(created.shareCode, storePath);

    expect(fetched.id).toBe(created.id);
    expect(fetched.editToken).toBe(created.editToken);
    expect(fetched.snapshot.metadata.name).toBe("Tuesday");
  });

  it("updates an existing session", async () => {
    const storePath = await createTempStorePath();
    const created = await createSession({ metadata: { name: "Before" } }, storePath);

    const updated = await updateSession(
      created.id,
      { metadata: { name: "After" } },
      storePath,
      created.editToken,
    );

    expect(updated.shareCode).toBe(created.shareCode);
    expect(updated.snapshot.metadata.name).toBe("After");
  });

  it("lists stored sessions", async () => {
    const storePath = await createTempStorePath();
    await createSession({ metadata: { name: "One" } }, storePath);
    await createSession({ metadata: { name: "Two" } }, storePath);

    const sessions = await listSessions(storePath);

    expect(sessions).toHaveLength(2);
  });

  it("creates an explicit file store instance", async () => {
    const storePath = await createTempStorePath();
    const store = createSessionStore({ storePath });

    const created = await store.createSession({ metadata: { name: "Scoped" } });
    const fetched = await store.getSessionByShareCode(created.shareCode);

    expect(fetched.snapshot.metadata.name).toBe("Scoped");
    await store.close();
  });

  it("rejects updates with the wrong edit token", async () => {
    const storePath = await createTempStorePath();
    const created = await createSession({ metadata: { name: "Before" } }, storePath);

    await expect(
      updateSession(
        created.id,
        { metadata: { name: "After" } },
        storePath,
        "wrong-token",
      ),
    ).rejects.toThrow("Invalid edit token");
  });
});

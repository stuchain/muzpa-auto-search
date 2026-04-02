import { describe, expect, it } from "vitest";
import type { RunnerSession } from "../../shared/types";
import { advanceAfterMark, markCurrentRow, searchCurrentForEmbedded } from "./runnerLogic";

function makeSession(currentIndex: number): RunnerSession {
  return {
    id: "s1",
    csvPath: "demo.csv",
    browser: "embedded",
    currentIndex,
    startedAt: new Date("2020-01-01T00:00:00.000Z").toISOString(),
    updatedAt: new Date("2020-01-01T00:00:00.000Z").toISOString(),
    state: "running",
    rows: [
      { index: 0, track: "T0", artist: "A0", query: "T0 A0", status: "pending" },
      { index: 1, track: "T1", artist: "A1", query: "T1 A1", status: "pending" }
    ]
  };
}

describe("runnerLogic.markCurrentRow", () => {
  it("marks current row with done/skipped/failed and sets updatedAt", () => {
    const nowIso = "2026-04-02T00:00:00.000Z";
    const session = makeSession(0);

    markCurrentRow(session, "done", undefined, nowIso);
    expect(session.rows[0].status).toBe("done");
    expect(session.rows[0].error).toBeUndefined();
    expect(session.updatedAt).toBe(nowIso);

    session.rows[0].status = "pending";
    session.updatedAt = nowIso;
    markCurrentRow(session, "skipped", undefined, nowIso);
    expect(session.rows[0].status).toBe("skipped");

    session.rows[0].status = "pending";
    session.updatedAt = nowIso;
    markCurrentRow(session, "failed", "boom", nowIso);
    expect(session.rows[0].status).toBe("failed");
    expect(session.rows[0].error).toBe("boom");
  });

  it("no-ops when currentIndex points past the end", () => {
    const session = makeSession(5);
    const before = session.updatedAt;
    expect(() => markCurrentRow(session, "done")).not.toThrow();
    expect(session.updatedAt).toBe(before); // unchanged because there is no current row
  });
});

describe("runnerLogic.searchCurrentForEmbedded", () => {
  it("sets current row to in_progress and session.state to running when row exists", () => {
    const nowIso = "2026-04-02T00:00:00.000Z";
    const session = makeSession(0);

    const hasRow = searchCurrentForEmbedded(session, nowIso);
    expect(hasRow).toBe(true);
    expect(session.rows[0].status).toBe("in_progress");
    expect(session.state).toBe("running");
    expect(session.updatedAt).toBe(nowIso);
  });

  it("sets session to completed when there is no current row", () => {
    const nowIso = "2026-04-02T00:00:00.000Z";
    const session = makeSession(123);

    const hasRow = searchCurrentForEmbedded(session, nowIso);
    expect(hasRow).toBe(false);
    expect(session.state).toBe("completed");
    expect(session.updatedAt).toBe(nowIso);
  });
});

describe("runnerLogic.advanceAfterMark", () => {
  it("advances to next row and prepares it for search", () => {
    const nowIso = "2026-04-02T00:00:00.000Z";
    const session = makeSession(0);

    const hasMore = advanceAfterMark(session, "done", nowIso);
    expect(hasMore).toBe(true);

    // Marked row is done
    expect(session.rows[0].status).toBe("done");
    // Moved to next row
    expect(session.currentIndex).toBe(1);
    // Next row prepared for searching
    expect(session.rows[1].status).toBe("in_progress");
    expect(session.state).toBe("running");
    expect(session.updatedAt).toBe(nowIso);
  });

  it("handles skipped and failed markAs", () => {
    const nowIso = "2026-04-02T00:00:00.000Z";

    const sessionSkipped = makeSession(0);
    const hasMoreSkipped = advanceAfterMark(sessionSkipped, "skipped", nowIso);
    expect(hasMoreSkipped).toBe(true);
    expect(sessionSkipped.rows[0].status).toBe("skipped");
    expect(sessionSkipped.rows[1].status).toBe("in_progress");

    const sessionFailed = makeSession(0);
    const hasMoreFailed = advanceAfterMark(sessionFailed, "failed", nowIso);
    expect(hasMoreFailed).toBe(true);
    expect(sessionFailed.rows[0].status).toBe("failed");
    expect(sessionFailed.rows[1].status).toBe("in_progress");
  });

  it("completes when marking the last row", () => {
    const nowIso = "2026-04-02T00:00:00.000Z";
    const session = makeSession(1);

    const hasMore = advanceAfterMark(session, "done", nowIso);
    expect(hasMore).toBe(false);

    expect(session.rows[1].status).toBe("done");
    // Incremented past last row
    expect(session.currentIndex).toBe(2);
    expect(session.state).toBe("completed");
    expect(session.updatedAt).toBe(nowIso);
  });
});


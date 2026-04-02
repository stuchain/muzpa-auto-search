import { describe, expect, it } from "vitest";
import { computeProgress } from "./progress";
import type { RunnerSession } from "./types";

function makeSession(): RunnerSession {
  return {
    id: "1",
    csvPath: "a.csv",
    browser: "chrome",
    currentIndex: 1,
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    state: "running",
    rows: [
      { index: 0, track: "A", artist: "B", query: "A B", status: "done" },
      { index: 1, track: "C", artist: "D", query: "C D", status: "in_progress" },
      { index: 2, track: "E", artist: "F", query: "E F", status: "skipped" },
      { index: 3, track: "G", artist: "H", query: "G H", status: "failed" }
    ]
  };
}

describe("computeProgress", () => {
  it("calculates summary counts", () => {
    const summary = computeProgress(makeSession());
    expect(summary.total).toBe(4);
    expect(summary.done).toBe(1);
    expect(summary.skipped).toBe(1);
    expect(summary.failed).toBe(1);
    expect(summary.pending).toBe(1);
    expect(summary.percent).toBe(75);
  });

  it("returns all zeros for null session", () => {
    const summary = computeProgress(null);
    expect(summary).toEqual({ total: 0, done: 0, skipped: 0, failed: 0, pending: 0, percent: 0 });
  });

  it("returns percent 0 when total is 0", () => {
    const session = makeSession();
    session.rows = [];
    const summary = computeProgress(session);
    expect(summary.total).toBe(0);
    expect(summary.percent).toBe(0);
    expect(summary.pending).toBe(0);
  });

  it("returns 100% when all tracks are done/skipped/failed", () => {
    const session = makeSession();
    session.rows = [
      { index: 0, track: "A", artist: "B", query: "A B", status: "done" },
      { index: 1, track: "C", artist: "D", query: "C D", status: "skipped" },
      { index: 2, track: "E", artist: "F", query: "E F", status: "failed" }
    ];
    const summary = computeProgress(session);
    expect(summary.percent).toBe(100);
    expect(summary.pending).toBe(0);
  });

  it("rounds percent down/up correctly (Math.round)", () => {
    const session = makeSession();
    session.rows = [
      { index: 0, track: "A", artist: "B", query: "A B", status: "done" }, // 1/3
      { index: 1, track: "C", artist: "D", query: "C D", status: "in_progress" },
      { index: 2, track: "E", artist: "F", query: "E F", status: "in_progress" }
    ];
    const summary = computeProgress(session);
    // 1/3 => 33.33 => 33
    expect(summary.percent).toBe(33);

    session.rows[1].status = "done"; // 2/3 => 66.66 => 67
    const summary2 = computeProgress(session);
    expect(summary2.percent).toBe(67);
  });
});

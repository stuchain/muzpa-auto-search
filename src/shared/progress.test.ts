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
});

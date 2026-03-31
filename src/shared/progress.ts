import type { ProgressSummary, RunnerSession } from "./types";

export function computeProgress(current: RunnerSession | null): ProgressSummary {
  if (!current) return { total: 0, done: 0, skipped: 0, failed: 0, pending: 0, percent: 0 };
  const total = current.rows.length;
  const done = current.rows.filter((r) => r.status === "done").length;
  const skipped = current.rows.filter((r) => r.status === "skipped").length;
  const failed = current.rows.filter((r) => r.status === "failed").length;
  const pending = total - done - skipped - failed;
  const percent = total ? Math.round(((done + skipped + failed) / total) * 100) : 0;
  return { total, done, skipped, failed, pending, percent };
}

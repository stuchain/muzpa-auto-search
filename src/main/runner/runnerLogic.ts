import type { RunnerSession, TrackStatus } from "../../shared/types";

export type MarkAsStatus = Extract<TrackStatus, "done" | "skipped" | "failed">;

/**
 * Marks the currently selected row with the provided status.
 * Also updates `session.updatedAt`.
 */
export function markCurrentRow(session: RunnerSession, status: TrackStatus, error?: string, nowIso = new Date().toISOString()): void {
  const row = session.rows[session.currentIndex];
  if (!row) return;
  row.status = status;
  row.error = error;
  session.updatedAt = nowIso;
}

/**
 * Updates session state to reflect the current row search in embedded mode.
 * - If a row exists: row.status becomes `in_progress`, session.state becomes `running`.
 * - If no row exists: session.state becomes `completed`.
 *
 * Returns true when a row exists.
 */
export function searchCurrentForEmbedded(session: RunnerSession, nowIso = new Date().toISOString()): boolean {
  const row = session.rows[session.currentIndex];
  if (!row) {
    session.state = "completed";
    session.updatedAt = nowIso;
    return false;
  }

  row.status = "in_progress";
  session.state = "running";
  session.updatedAt = nowIso;
  return true;
}

/**
 * Advances to the next row after marking the current one.
 * - Marks current row with `markAs`
 * - Increments currentIndex
 * - If more rows exist, prepares the next row for search (`in_progress` + `running`)
 * - Otherwise marks session as completed
 *
 * Returns true if there is another row to search.
 */
export function advanceAfterMark(session: RunnerSession, markAs: MarkAsStatus, nowIso = new Date().toISOString()): boolean {
  markCurrentRow(session, markAs, undefined, nowIso);
  session.currentIndex += 1;

  if (session.currentIndex >= session.rows.length) {
    session.state = "completed";
    session.updatedAt = nowIso;
    return false;
  }

  // Prepare the next row for searching.
  return searchCurrentForEmbedded(session, nowIso);
}


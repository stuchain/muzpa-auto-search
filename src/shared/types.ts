export type BrowserType = "chrome" | "brave" | "firefox" | "edge";

export type TrackStatus = "pending" | "in_progress" | "done" | "skipped" | "failed";

export interface TrackRow {
  index: number;
  track: string;
  artist: string;
  query: string;
  status: TrackStatus;
  error?: string;
}

export interface RunnerSession {
  id: string;
  csvPath: string;
  browser: BrowserType;
  rows: TrackRow[];
  currentIndex: number;
  startedAt: string;
  updatedAt: string;
  state: "idle" | "ready" | "running" | "paused" | "completed" | "error";
}

export interface ProgressSummary {
  total: number;
  done: number;
  skipped: number;
  failed: number;
  pending: number;
  percent: number;
}

export interface CsvPreview {
  csvPath: string;
  rows: TrackRow[];
  warnings: string[];
}

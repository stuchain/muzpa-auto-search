import { create } from "zustand";
import type { BrowserType, CsvPreview, ProgressSummary, RunnerSession } from "../../shared/types";

interface RunnerStore {
  browser: BrowserType;
  csvPath: string;
  warnings: string[];
  session: RunnerSession | null;
  progress: ProgressSummary;
  loading: boolean;
  setBrowser: (browser: BrowserType) => void;
  setCsvPath: (csvPath: string) => void;
  pickCsv: () => Promise<void>;
  createSession: () => Promise<void>;
  run: () => Promise<void>;
  next: (markAs: "done" | "skipped" | "failed") => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
  hydrate: () => Promise<void>;
  exportHistory: () => Promise<void>;
}

const emptyProgress: ProgressSummary = { total: 0, done: 0, skipped: 0, failed: 0, pending: 0, percent: 0 };

export const useRunnerStore = create<RunnerStore>((set, get) => ({
  browser: "chrome",
  csvPath: "",
  warnings: [],
  session: null,
  progress: emptyProgress,
  loading: false,
  setBrowser: (browser) => set({ browser }),
  setCsvPath: (csvPath) => set({ csvPath }),
  pickCsv: async () => {
    const preview = (await window.muzpaAPI.pickCsv()) as CsvPreview | null;
    if (!preview) return;
    set({ csvPath: preview.csvPath, warnings: preview.warnings });
  },
  createSession: async () => {
    const { csvPath, browser } = get();
    if (!csvPath) return;
    set({ loading: true });
    try {
      const result = (await window.muzpaAPI.createSession(csvPath, browser)) as {
        session: RunnerSession;
        progress: ProgressSummary;
        warnings: string[];
      };
      set({ session: result.session, progress: result.progress, warnings: result.warnings });
    } finally {
      set({ loading: false });
    }
  },
  run: async () => {
    set({ loading: true });
    try {
      const result = (await window.muzpaAPI.run()) as { session: RunnerSession; progress: ProgressSummary };
      set({ session: result.session, progress: result.progress });
    } finally {
      set({ loading: false });
    }
  },
  next: async (markAs) => {
    set({ loading: true });
    try {
      const result = (await window.muzpaAPI.next(markAs)) as { session: RunnerSession; progress: ProgressSummary };
      set({ session: result.session, progress: result.progress });
    } finally {
      set({ loading: false });
    }
  },
  pause: async () => {
    const result = (await window.muzpaAPI.pause()) as { session: RunnerSession; progress: ProgressSummary };
    set({ session: result.session, progress: result.progress });
  },
  resume: async () => {
    set({ loading: true });
    try {
      const result = (await window.muzpaAPI.resume()) as { session: RunnerSession; progress: ProgressSummary };
      set({ session: result.session, progress: result.progress });
    } finally {
      set({ loading: false });
    }
  },
  stop: async () => {
    await window.muzpaAPI.stop();
    set({ session: null, progress: emptyProgress, csvPath: "", warnings: [] });
  },
  hydrate: async () => {
    const result = (await window.muzpaAPI.getSession()) as { session: RunnerSession | null; progress: ProgressSummary };
    set({ session: result.session, progress: result.progress });
  },
  exportHistory: async () => {
    await window.muzpaAPI.exportHistory();
  }
}));

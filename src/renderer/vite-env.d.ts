/// <reference types="vite/client" />
import type { BrowserType } from "../shared/types";

declare global {
  interface Window {
    muzpaAPI: {
      pickCsv: () => Promise<unknown>;
      createSession: (csvPath: string, browser: BrowserType) => Promise<unknown>;
      getSession: () => Promise<unknown>;
      run: () => Promise<unknown>;
      next: (markAs: "done" | "skipped" | "failed") => Promise<unknown>;
      pause: () => Promise<unknown>;
      resume: () => Promise<unknown>;
      stop: () => Promise<unknown>;
      exportHistory: () => Promise<unknown>;
    };
  }
}

export {};

import { describe, expect, it, vi, beforeEach } from "vitest";
import { useRunnerStore } from "./useRunnerStore";
import type { BrowserType, ProgressSummary, RunnerSession } from "../../shared/types";

const emptyProgress: ProgressSummary = { total: 0, done: 0, skipped: 0, failed: 0, pending: 0, percent: 0 };

function makeSession(browser: BrowserType): RunnerSession {
  return {
    id: "1",
    csvPath: "demo.csv",
    browser,
    rows: [
      { index: 0, track: "T0", artist: "A0", query: "T0 A0", status: "in_progress" }
    ],
    currentIndex: 0,
    startedAt: new Date("2020-01-01T00:00:00.000Z").toISOString(),
    updatedAt: new Date("2020-01-01T00:00:00.000Z").toISOString(),
    state: "running",
  };
}

async function flushPromises(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe("useRunnerStore.setBrowser", () => {
  const setSessionBrowserMock = vi.fn();

  beforeEach(() => {
    // Reset zustand state.
    useRunnerStore.setState({
      browser: "chrome",
      csvPath: "",
      warnings: [],
      session: null,
      progress: emptyProgress,
      loading: false,
    });

    (window as any).muzpaAPI = {
      setSessionBrowser: setSessionBrowserMock
    };
    setSessionBrowserMock.mockReset();
  });

  it("does not call IPC when there is no active session", async () => {
    useRunnerStore.getState().setBrowser("embedded");
    expect(useRunnerStore.getState().browser).toBe("embedded");
    expect(setSessionBrowserMock).not.toHaveBeenCalled();
    expect(useRunnerStore.getState().loading).toBe(false);
  });

  it("syncs the active session browser and toggles loading during the IPC call", async () => {
    const beforeSession = makeSession("brave");
    const afterSession = makeSession("embedded");
    const afterProgress: ProgressSummary = { total: 1, done: 0, skipped: 0, failed: 0, pending: 1, percent: 0 };

    setSessionBrowserMock.mockResolvedValue({ session: afterSession, progress: afterProgress });
    useRunnerStore.setState({ session: beforeSession, browser: "brave", loading: false, progress: emptyProgress });

    useRunnerStore.getState().setBrowser("embedded");

    // Loading is set immediately.
    expect(useRunnerStore.getState().loading).toBe(true);
    expect(setSessionBrowserMock).toHaveBeenCalledWith("embedded");

    await flushPromises();
    expect(useRunnerStore.getState().loading).toBe(false);
    expect(useRunnerStore.getState().session?.browser).toBe("embedded");
    expect(useRunnerStore.getState().progress).toEqual(afterProgress);
  });

  it("clears loading even if the IPC call rejects", async () => {
    const beforeSession = makeSession("brave");
    const deferred = new Promise((_, reject) => {
      reject(new Error("IPC failed"));
    });

    setSessionBrowserMock.mockReturnValue(deferred);
    useRunnerStore.setState({ session: beforeSession, browser: "brave", loading: false, progress: emptyProgress });

    useRunnerStore.getState().setBrowser("embedded");
    expect(useRunnerStore.getState().loading).toBe(true);

    await flushPromises();
    expect(useRunnerStore.getState().loading).toBe(false);
  });
});


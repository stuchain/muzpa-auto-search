import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import { App } from "./App";
import { useRunnerStore } from "./state/useRunnerStore";
import type { ProgressSummary } from "../shared/types";

const emptyProgress: ProgressSummary = { total: 0, done: 0, skipped: 0, failed: 0, pending: 0, percent: 0 };

describe("App keyboard guards", () => {
  const nextMock = vi.fn();
  const pauseMock = vi.fn();
  const resumeMock = vi.fn();
  const hydrateMock = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    nextMock.mockReset();
    pauseMock.mockReset();
    resumeMock.mockReset();
    hydrateMock.mockClear();

    useRunnerStore.setState({
      browser: "chrome",
      csvPath: "",
      warnings: [],
      session: null,
      progress: emptyProgress,
      loading: false,
      hydrate: hydrateMock,
      next: nextMock as any,
      pause: pauseMock as any,
      resume: resumeMock as any,
    });
  });

  afterEach(() => {
    // Ensure no cross-test key handlers linger.
    useRunnerStore.setState({ loading: false });
  });

  it("blocks keyboard shortcuts when loading is true (including after toggling)", async () => {
    render(<App />);

    // When loading is false, Enter triggers Next(Done)
    fireEvent.keyDown(window, { key: "Enter" });
    expect(nextMock).toHaveBeenCalledWith("done");

    // Toggle loading to true after mount; shortcuts should no longer fire.
    act(() => {
      useRunnerStore.setState({ loading: true });
    });

    fireEvent.keyDown(window, { key: "Enter" });
    fireEvent.keyDown(window, { key: "s" });
    fireEvent.keyDown(window, { key: "p" });
    fireEvent.keyDown(window, { key: "r" });

    // Still only the first Enter call should have occurred.
    expect(nextMock).toHaveBeenCalledTimes(1);
    expect(pauseMock).not.toHaveBeenCalled();
    expect(resumeMock).not.toHaveBeenCalled();
  });
});


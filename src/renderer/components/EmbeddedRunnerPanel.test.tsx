import { describe, expect, it, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { useRunnerStore } from "../state/useRunnerStore";
import type { RunnerSession } from "../../shared/types";
import { buildMuzpaSearchUrl } from "../../shared/muzpaUrl";
import { EmbeddedRunnerPanel } from "./EmbeddedRunnerPanel";

function makeSession(partial: Partial<RunnerSession>): RunnerSession {
  return {
    id: "s1",
    csvPath: "demo.csv",
    browser: "embedded",
    rows: [{ index: 0, track: "T0", artist: "A0", query: "T0 A0", status: "pending" }],
    currentIndex: 0,
    startedAt: new Date("2020-01-01T00:00:00.000Z").toISOString(),
    updatedAt: new Date("2020-01-01T00:00:00.000Z").toISOString(),
    state: "running",
    ...partial,
  };
}

describe("EmbeddedRunnerPanel", () => {
  beforeEach(() => {
    useRunnerStore.setState({
      session: null,
      browser: "chrome",
      loading: false,
      csvPath: "",
      warnings: []
    });
  });

  it("renders nothing when there is no session", () => {
    const { container } = render(<EmbeddedRunnerPanel />);
    expect(container.firstChild).toBeNull();
  });

  it("renders webview with about:blank in ready state", () => {
    useRunnerStore.setState({ session: makeSession({ state: "ready" }) });

    const { container } = render(<EmbeddedRunnerPanel />);
    const webview = container.querySelector("webview");
    expect(webview).toBeTruthy();
    expect(webview?.getAttribute("src")).toBe("about:blank");
  });

  it("renders nothing when session.browser is not embedded", () => {
    useRunnerStore.setState({
      session: makeSession({ browser: "chrome" as any })
    });
    const { container } = render(<EmbeddedRunnerPanel />);
    expect(container.firstChild).toBeNull();
  });

  it("updates webview src to the current Muzpa search URL when running", async () => {
    const query = "My Track My Artist";
    useRunnerStore.setState({
      session: makeSession({
        state: "running",
        browser: "embedded",
        rows: [{ index: 0, track: "My Track", artist: "My Artist", query, status: "pending" }],
      })
    });

    const { container } = render(<EmbeddedRunnerPanel />);
    const webview = container.querySelector("webview");
    expect(webview).toBeTruthy();

    await waitFor(() => {
      expect(webview?.getAttribute("src")).toBe(buildMuzpaSearchUrl(query));
    });
  });
});


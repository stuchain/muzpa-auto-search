import { describe, expect, it } from "vitest";
import type { BrowserType } from "../../shared/types";
import { buildOpenCommands } from "./browserController";

const url = "https://srv.muzpa.com/#/search?text=hello%20world";

function check(platform: "win32" | "darwin", browser: BrowserType, expected: string) {
  expect(buildOpenCommands(browser, url, platform)).toBe(expected);
}

describe("buildOpenCommands", () => {
  it("win32 uses cmd/start with chosen exe when known", () => {
    check(
      "win32",
      "chrome",
      `cmd /c start "" "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" "${url}"`
    );
  });

  it("win32 falls back to cmd/start without exe when unknown browser", () => {
    // embedded isn't supported by external opener; should fall back to opening URL.
    check("win32", "embedded", `cmd /c start "" "${url}"`);
  });

  it("darwin uses open -a with app name when mapping exists", () => {
    check("darwin", "firefox", `open -a "Firefox" "${url}" || open "${url}"`);
  });

  it("darwin falls back to default open when mapping doesn't exist", () => {
    check("darwin", "embedded", `open "${url}"`);
  });

  it("escapes double quotes in url", () => {
    const urlWithQuote = `https://example.com/?q=he"llo`;
    const cmd = buildOpenCommands("chrome", urlWithQuote, "win32");
    // We just assert escaping happened, not exact structure.
    expect(cmd).toContain('\\"');
  });
});


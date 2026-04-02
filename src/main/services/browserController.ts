import { exec } from "node:child_process";
import type { BrowserType } from "../../shared/types";
import { buildMuzpaSearchUrl } from "../../shared/muzpaUrl";

const MUZPA_URL = "https://srv.muzpa.com/";

function escapeForDoubleQuotes(value: string): string {
  return value.replaceAll('"', '\\"');
}

/**
 * Builds the OS-specific command string used to open a URL.
 * Pure helper so it can be unit-tested without launching anything.
 */
export function buildOpenCommands(browser: BrowserType, url: string, platform: NodeJS.Platform = process.platform): string {
  const safeUrl = escapeForDoubleQuotes(url);
  if (platform === "win32") {
    const exe =
      browser === "chrome"
        ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
        : browser === "brave"
          ? "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe"
          : browser === "edge"
            ? "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
            : browser === "firefox"
              ? "C:\\Program Files\\Mozilla Firefox\\firefox.exe"
              : null;

    // Keep the existing behavior exactly, including cmd/start quoting.
    return exe ? `cmd /c start "" "${exe}" "${safeUrl}"` : `cmd /c start "" "${safeUrl}"`;
  }

  if (platform === "darwin") {
    const app =
      browser === "chrome"
        ? "Google Chrome"
        : browser === "brave"
          ? "Brave Browser"
          : browser === "edge"
            ? "Microsoft Edge"
            : browser === "firefox"
              ? "Firefox"
              : null;
    // Try to open the selected browser app; if the app isn't installed the command will fallback to default browser.
    return app ? `open -a "${escapeForDoubleQuotes(app)}" "${safeUrl}" || open "${safeUrl}"` : `open "${safeUrl}"`;
  }

  // Fallback for other platforms: open the URL with default handler.
  return `open "${safeUrl}"`;
}

function openInBrowser(browser: BrowserType, url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Embedded mode doesn't use this.
    const command = buildOpenCommands(browser, url);
    exec(command, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

export class BrowserController {
  private currentBrowser: BrowserType | null = null;

  async launch(browser: BrowserType): Promise<void> {
    this.currentBrowser = browser;
    await openInBrowser(browser, MUZPA_URL);
  }

  async search(query: string): Promise<void> {
    if (!this.currentBrowser) {
      throw new Error("Browser is not running yet.");
    }
    const url = buildMuzpaSearchUrl(query);
    await openInBrowser(this.currentBrowser, url);
  }

  async close(): Promise<void> {
    this.currentBrowser = null;
  }
}

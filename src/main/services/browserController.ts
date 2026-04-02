import { exec } from "node:child_process";
import type { BrowserType } from "../../shared/types";
import { buildMuzpaSearchUrl } from "../../shared/muzpaUrl";

const MUZPA_URL = "https://srv.muzpa.com/";

function browserExecutable(browser: BrowserType): string | null {
  if (process.platform !== "win32") return null;
  if (browser === "chrome") return "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  if (browser === "brave") return "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe";
  if (browser === "edge") return "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  if (browser === "firefox") return "C:\\Program Files\\Mozilla Firefox\\firefox.exe";
  return null;
}

function openInBrowser(browser: BrowserType, url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const exe = browserExecutable(browser);
    const command = exe
      ? `cmd /c start "" "${exe}" "${url}"`
      : `cmd /c start "" "${url}"`;
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

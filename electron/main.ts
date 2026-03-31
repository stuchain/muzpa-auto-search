import path from "node:path";
import { app, BrowserWindow, dialog, ipcMain } from "electron";
import { BrowserController } from "../src/main/services/browserController";
import { parseCsv } from "../src/main/services/csvService";
import { appendHistory, clearSession, exportHistory, loadSession, saveSession } from "../src/main/services/sessionService";
import { computeProgress } from "../src/shared/progress";
import type { BrowserType, RunnerSession, TrackStatus } from "../src/shared/types";

const browserController = new BrowserController();
let mainWindow: BrowserWindow | null = null;
let session: RunnerSession | null = null;

function isDev(): boolean {
  return Boolean(process.env.VITE_DEV_SERVER_URL);
}

function markCurrentRow(status: TrackStatus, error?: string): void {
  if (!session) return;
  const row = session.rows[session.currentIndex];
  if (!row) return;
  row.status = status;
  row.error = error;
  session.updatedAt = new Date().toISOString();
}

async function searchCurrent(): Promise<void> {
  if (!session) throw new Error("Session not loaded.");
  const row = session.rows[session.currentIndex];
  if (!row) {
    session.state = "completed";
    return;
  }
  row.status = "in_progress";
  await browserController.launch(session.browser);
  await browserController.search(row.query);
  session.state = "running";
  session.updatedAt = new Date().toISOString();
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1480,
    height: 920,
    minWidth: 1180,
    minHeight: 780,
    backgroundColor: "#07070f",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (isDev()) {
    void mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL as string);
  } else {
    void mainWindow.loadFile(path.join(process.cwd(), "dist", "index.html"));
  }
}

app.whenReady().then(async () => {
  createWindow();
  session = await loadSession();
});

app.on("window-all-closed", async () => {
  await browserController.close();
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("dialog:pickCsv", async () => {
  const result = await dialog.showOpenDialog({
    title: "Select CSV",
    filters: [{ name: "CSV", extensions: ["csv"] }],
    properties: ["openFile"]
  });
  if (result.canceled || result.filePaths.length === 0) return null;
  const csvPath = result.filePaths[0];
  return parseCsv(csvPath);
});

ipcMain.handle("session:create", async (_, csvPath: string, browser: BrowserType) => {
  const preview = await parseCsv(csvPath);
  session = {
    id: `${Date.now()}`,
    csvPath: preview.csvPath,
    browser,
    rows: preview.rows,
    currentIndex: 0,
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    state: "ready"
  };
  await saveSession(session);
  return { session, progress: computeProgress(session), warnings: preview.warnings };
});

ipcMain.handle("session:get", async () => {
  return { session, progress: computeProgress(session) };
});

ipcMain.handle("runner:run", async () => {
  if (!session) throw new Error("No active session.");
  await searchCurrent();
  await saveSession(session);
  return { session, progress: computeProgress(session) };
});

ipcMain.handle("runner:next", async (_, markAs: "done" | "skipped" | "failed") => {
  if (!session) throw new Error("No active session.");
  markCurrentRow(markAs);
  session.currentIndex += 1;
  if (session.currentIndex >= session.rows.length) {
    session.state = "completed";
    await appendHistory(session);
    await saveSession(session);
    return { session, progress: computeProgress(session) };
  }
  await searchCurrent();
  await saveSession(session);
  return { session, progress: computeProgress(session) };
});

ipcMain.handle("runner:pause", async () => {
  if (!session) throw new Error("No active session.");
  session.state = "paused";
  await saveSession(session);
  return { session, progress: computeProgress(session) };
});

ipcMain.handle("runner:resume", async () => {
  if (!session) throw new Error("No active session.");
  await searchCurrent();
  await saveSession(session);
  return { session, progress: computeProgress(session) };
});

ipcMain.handle("runner:stop", async () => {
  await browserController.close();
  if (session) {
    session.state = "completed";
    await appendHistory(session);
  }
  await clearSession();
  session = null;
  return { session, progress: computeProgress(session) };
});

ipcMain.handle("history:export", async () => {
  const result = await dialog.showSaveDialog({
    title: "Export Run History",
    defaultPath: "muzpa-run-history.json",
    filters: [{ name: "JSON", extensions: ["json"] }]
  });
  if (result.canceled || !result.filePath) return { exported: false };
  await exportHistory(result.filePath);
  return { exported: true, filePath: result.filePath };
});

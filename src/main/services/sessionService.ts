import fs from "node:fs/promises";
import path from "node:path";
import { app } from "electron";
import type { RunnerSession } from "../../shared/types";

const SESSION_FILE = "last-session.json";
const HISTORY_FILE = "run-history.json";

function storagePath(fileName: string): string {
  return path.join(app.getPath("userData"), fileName);
}

export async function saveSession(session: RunnerSession): Promise<void> {
  const filePath = storagePath(SESSION_FILE);
  await fs.writeFile(filePath, JSON.stringify(session, null, 2), "utf-8");
}

export async function loadSession(): Promise<RunnerSession | null> {
  try {
    const filePath = storagePath(SESSION_FILE);
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as RunnerSession;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  try {
    await fs.unlink(storagePath(SESSION_FILE));
  } catch {
    // Ignore missing file.
  }
}

export async function appendHistory(session: RunnerSession): Promise<void> {
  const filePath = storagePath(HISTORY_FILE);
  let entries: RunnerSession[] = [];
  try {
    entries = JSON.parse(await fs.readFile(filePath, "utf-8")) as RunnerSession[];
  } catch {
    entries = [];
  }
  entries.unshift(session);
  await fs.writeFile(filePath, JSON.stringify(entries.slice(0, 100), null, 2), "utf-8");
}

export async function exportHistory(exportPath: string): Promise<void> {
  const raw = await fs.readFile(storagePath(HISTORY_FILE), "utf-8");
  await fs.writeFile(exportPath, raw, "utf-8");
}

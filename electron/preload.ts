import { contextBridge, ipcRenderer } from "electron";
import type { BrowserType } from "../src/shared/types";

contextBridge.exposeInMainWorld("muzpaAPI", {
  pickCsv: () => ipcRenderer.invoke("dialog:pickCsv"),
  createSession: (csvPath: string, browser: BrowserType) => ipcRenderer.invoke("session:create", csvPath, browser),
  getSession: () => ipcRenderer.invoke("session:get"),
  setSessionBrowser: (browser: BrowserType) => ipcRenderer.invoke("session:setBrowser", browser),
  run: () => ipcRenderer.invoke("runner:run"),
  next: (markAs: "done" | "skipped" | "failed") => ipcRenderer.invoke("runner:next", markAs),
  pause: () => ipcRenderer.invoke("runner:pause"),
  resume: () => ipcRenderer.invoke("runner:resume"),
  stop: () => ipcRenderer.invoke("runner:stop"),
  exportHistory: () => ipcRenderer.invoke("history:export")
});

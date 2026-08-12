import { contextBridge } from "electron";

// Minimal, deliberate bridge: expose read-only platform info to the renderer
// under a single namespace. Never expose Node IPC or arbitrary methods here —
// keep this surface as small as possible per Electron's security guidance.
contextBridge.exposeInMainWorld("mikio", {
  platform: process.platform,
});
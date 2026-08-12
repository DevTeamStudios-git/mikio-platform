import type { BrowserWindowConstructorOptions } from "electron";

/**
 * Secure default window options for the Mikio AI shell.
 *
 * Security posture (per Electron's security checklist): context isolation on,
 * node integration off, sandbox on, and a preview-loading preload. Pure and
 * side-effect free so it can be unit-tested without launching Electron.
 */
export interface MikioWindowOptions {
  preloadPath: string;
}

export function createWindowOptions({
  preloadPath,
}: MikioWindowOptions): BrowserWindowConstructorOptions {
  return {
    width: 1200,
    height: 800,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  };
}
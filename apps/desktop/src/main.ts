import { app, BrowserWindow } from "electron";
import * as path from "node:path";
import { createWindowOptions } from "./window-options";
import { resolveWebAppUrl } from "./web-app-url";

function createMainWindow(): void {
  const preloadPath = path.join(__dirname, "preload.js");
  const mainWindow = new BrowserWindow(createWindowOptions({ preloadPath }));
  void mainWindow.loadURL(resolveWebAppUrl());
}

app.whenReady().then(() => {
  createMainWindow();

  // macOS convention — recreate a window when the dock icon is clicked after
  // all windows are closed.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
import { describe, expect, it } from "vitest";
import { createWindowOptions } from "../src/window-options";

describe("createWindowOptions", () => {
  it("enforces the secure renderer defaults", () => {
    const options = createWindowOptions({ preloadPath: "/apps/desktop/dist/preload.js" });
    expect(options.webPreferences).toMatchObject({
      preload: "/apps/desktop/dist/preload.js",
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    });
  });
});
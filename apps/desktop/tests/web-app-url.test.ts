import { describe, expect, it } from "vitest";
import { resolveWebAppUrl, DEFAULT_WEB_APP_URL } from "../src/web-app-url";

describe("resolveWebAppUrl", () => {
  it("defaults to the apps/web dev server when no override is set", () => {
    expect(resolveWebAppUrl({})).toBe(DEFAULT_WEB_APP_URL);
  });

  it("uses MIKIO_WEB_APP_URL when set", () => {
    expect(resolveWebAppUrl({ MIKIO_WEB_APP_URL: "http://localhost:5000" })).toBe(
      "http://localhost:5000",
    );
  });

  it("falls back to the default for a blank override", () => {
    expect(resolveWebAppUrl({ MIKIO_WEB_APP_URL: "   " })).toBe(DEFAULT_WEB_APP_URL);
  });
});
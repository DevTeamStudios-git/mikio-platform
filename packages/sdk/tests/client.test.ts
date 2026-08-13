import { describe, expect, it } from "vitest";
import { createClient, isOk } from "../src/client";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("MikioApi.status", () => {
  it("returns the backend status on a successful call", async () => {
    const client = createClient({
      baseUrl: "http://localhost:3001",
      fetchImpl: async () => jsonResponse({ status: "ok", service: "mikio-ai-backend" }),
    });

    const result = await client.status();
    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value).toEqual({ status: "ok", service: "mikio-ai-backend" });
    }
  });

  it("returns an error result on a non-ok HTTP status", async () => {
    const client = createClient({
      baseUrl: "http://localhost:3001",
      fetchImpl: async () => jsonResponse({ message: "boom" }, 500),
    });

    const result = await client.status();
    expect(isOk(result)).toBe(false);
    if (!isOk(result)) {
      expect(result.error.status).toBe(500);
      expect(result.error.message).toContain("500");
    }
  });

  it("returns an error result when the transport throws", async () => {
    const client = createClient({
      baseUrl: "http://localhost:3001",
      fetchImpl: async () => {
        throw new Error("network down");
      },
    });

    const result = await client.status();
    expect(isOk(result)).toBe(false);
    if (!isOk(result)) {
      expect(result.error.message).toBe("network down");
    }
  });

  it("normalizes a trailing slash on baseUrl", async () => {
    let called = "";
    const client = createClient({
      baseUrl: "http://localhost:3001/",
      fetchImpl: async (url) => {
        called = String(url);
        return jsonResponse({ status: "ok", service: "mikio-ai-backend" });
      },
    });

    await client.status();
    expect(called).toBe("http://localhost:3001/");
  });
});
import { describe, expect, it } from "vitest";
import { ok, err, isOk, isErr } from "../src/result";
import { assertNever } from "../src/assert-never";

describe("result", () => {
  it("builds and narrows ok values", () => {
    const result = ok(42);
    expect(isOk(result)).toBe(true);
    expect(isErr(result)).toBe(false);
    if (isOk(result)) expect(result.value).toBe(42);
  });

  it("builds and narrows err values", () => {
    const result = err("boom");
    expect(isErr(result)).toBe(true);
    expect(isOk(result)).toBe(false);
    if (isErr(result)) expect(result.error).toBe("boom");
  });
});

describe("assertNever", () => {
  it("throws on unexpected values", () => {
    expect(() => assertNever("anything" as never)).toThrow("Unexpected value");
  });
});
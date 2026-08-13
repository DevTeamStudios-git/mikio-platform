import { describe, expect, it } from "vitest";
import { createLogger, type LogEntry } from "../src/logger";

describe("createLogger", () => {
  it("filters entries below the configured level", () => {
    const entries: LogEntry[] = [];
    const logger = createLogger({ level: "warn", sink: (e) => entries.push(e) });

    logger.debug("d");
    logger.info("i");
    logger.warn("w");
    logger.error("e");

    expect(entries.map((e) => e.level)).toEqual(["warn", "error"]);
  });

  it("attaches meta to emitted entries", () => {
    const entries: LogEntry[] = [];
    const logger = createLogger({ level: "info", sink: (e) => entries.push(e) });

    logger.info("hello", { userId: "u1" });

    expect(entries[0]).toMatchObject({ message: "hello", meta: { userId: "u1" } });
  });

  it("child merges bindings into every entry", () => {
    const entries: LogEntry[] = [];
    const logger = createLogger({ level: "info", sink: (e) => entries.push(e) });
    const scoped = logger.child({ requestId: "r-1" });

    scoped.info("one", { userId: "u1" });
    scoped.info("two");

    const first = entries[0];
    const second = entries[1];
    expect(first?.meta).toEqual({ requestId: "r-1", userId: "u1" });
    expect(second?.meta).toEqual({ requestId: "r-1" });
  });
});
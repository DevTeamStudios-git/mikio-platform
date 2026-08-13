export type LogLevel = "debug" | "info" | "warn" | "error";

export const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

export interface LogEntry {
  level: LogLevel;
  message: string;
  meta?: Record<string, unknown>;
}

export interface LoggerOptions {
  level: LogLevel;
  sink: (entry: LogEntry) => void;
}

export interface Logger {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
  child(bindings: Record<string, unknown>): Logger;
}

/**
 * Minimal structured logger. The sink is injected (rather than calling
 * console directly) so callers can capture output in tests or route it to a
 * transport later. `child` merges bindings into every subsequent entry's
 * meta — the one operation real logging adds over `console`.
 */
export function createLogger(options: LoggerOptions): Logger {
  const { level, sink } = options;
  const threshold = LOG_LEVELS[level];

  function emit(entryLevel: LogLevel, message: string, meta?: Record<string, unknown>): void {
    if (LOG_LEVELS[entryLevel] < threshold) return;
    sink({ level: entryLevel, message, meta });
  }

  function child(bindings: Record<string, unknown>): Logger {
    return createLogger({
      level,
      sink: (entry) => sink({ ...entry, meta: { ...bindings, ...entry.meta } }),
    });
  }

  return {
    debug: (message, meta) => emit("debug", message, meta),
    info: (message, meta) => emit("info", message, meta),
    warn: (message, meta) => emit("warn", message, meta),
    error: (message, meta) => emit("error", message, meta),
    child,
  };
}

export const consoleSink = (entry: LogEntry): void => {
  const line = `[${entry.level}] ${entry.message}${entry.meta ? ` ${JSON.stringify(entry.meta)}` : ""}`;
  switch (entry.level) {
    case "debug":
    case "info":
      console.log(line);
      break;
    case "warn":
      console.warn(line);
      break;
    case "error":
      console.error(line);
      break;
  }
};

export function defaultLogger(level: LogLevel = "info"): Logger {
  return createLogger({ level, sink: consoleSink });
}
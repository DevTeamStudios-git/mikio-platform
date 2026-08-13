import { err, isOk, ok, type Result } from "@mikio-ai/common";
import { createLogger, type Logger } from "@mikio-ai/logger";

export interface ApiConfig {
  baseUrl: string;
  fetchImpl?: typeof fetch;
  logger?: Logger;
}

/** Response of the backend's root status endpoint. */
export interface StatusResponse {
  status: "ok";
  service: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

/**
 * Typed client for the backend API (`backend/`, NestJS).
 *
 * The single existing endpoint is `GET /` → `StatusResponse`. `fetch` is
 * injected so tests can stub the transport without a real server; in
 * browsers it defaults to the global `fetch`.
 *
 * Calls return a `Result` rather than throwing, so consumers decide how to
 * surface failures (per `packages/common` — `Result` is the sanctioned way to
 * report errors across the service boundaries). Failures are logged via
 * `@mikio-ai/logger`.
 */
export class MikioApi {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private readonly logger: Logger;

  constructor(config: ApiConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.fetchImpl = config.fetchImpl ?? globalThis.fetch;
    this.logger = config.logger ?? createLogger({ level: "warn", sink: () => {} });
  }

  async status(): Promise<Result<StatusResponse, ApiError>> {
    return this.get<StatusResponse>("/");
  }

  private async get<T>(path: string): Promise<Result<T, ApiError>> {
    try {
      const res = await this.fetchImpl(`${this.baseUrl}${path}`, {
        headers: { accept: "application/json" },
      });

      if (!res.ok) {
        const message = `Mikio API request failed: ${res.status} ${res.statusText}`;
        this.logger.warn(message, { status: res.status });
        return err({ message, status: res.status });
      }

      const body = (await res.json()) as T;
      return ok(body);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : String(cause);
      this.logger.error(`Mikio API request threw`, { message });
      return err({ message });
    }
  }
}

export function createClient(config: ApiConfig): MikioApi {
  return new MikioApi(config);
}

export { isOk };
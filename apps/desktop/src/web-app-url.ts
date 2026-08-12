/**
 * The desktop shell is a thin wrapper around the shared web UI (per
 * ARCHITECTURE.md §8). It needs to know where that UI lives. In development
 * that is the apps/web dev server; the URL can be overridden via
 * `MIKIO_WEB_APP_URL` for some other environment.
 */
export const DEFAULT_WEB_APP_URL = "http://localhost:3000";

export function resolveWebAppUrl(env: NodeJS.ProcessEnv = process.env): string {
  const override = env.MIKIO_WEB_APP_URL;
  return override?.trim() ? override : DEFAULT_WEB_APP_URL;
}
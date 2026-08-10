/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /**
   * `@mikio-ai/frontend` ships raw TS/TSX sources (source-first exports) so
   * that it can be consumed without a build step. Next needs to transpile
   * those workspace sources itself — otherwise `next build` chokes on JSX
   * outside `apps/web/node_modules`.
   */
  transpilePackages: ["@mikio-ai/frontend"],
};

export default nextConfig;

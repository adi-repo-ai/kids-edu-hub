import type { NextConfig } from "next";

// STATIC_EXPORT=1 produces a plain-file build in out/ (GitHub Pages, hosted previews).
const staticExport = process.env.STATIC_EXPORT === "1";
// Set when the site is served from a sub-path, e.g. BASE_PATH=/kids-edu-hub on GitHub Pages.
const basePath = process.env.BASE_PATH || undefined;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath ?? "" },
  ...(staticExport && { output: "export", trailingSlash: true }),
};

export default nextConfig;

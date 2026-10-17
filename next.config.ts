import type { NextConfig } from "next";

// STATIC_EXPORT=1 produces a plain-file build in out/ (used for hosted previews).
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(staticExport && { output: "export", trailingSlash: true }),
};

export default nextConfig;

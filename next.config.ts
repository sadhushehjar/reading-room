import type { NextConfig } from "next";

/**
 * GitHub Pages serves this from a project subpath
 * (https://sadhushehjar.github.io/reading-room/), so every asset has to carry
 * that prefix or the browser asks the domain root for /_next/... and gets a
 * 404 — the page arrives as unstyled HTML. The deploy workflow sets
 * PAGES_BASE_PATH; local `next dev` leaves it unset and serves from /.
 */
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),

  /** next/image and next/link get the prefix for free; a raw <img src> to a
   *  file in public/ does not, so the value is published for those call sites. */
  env: { NEXT_PUBLIC_BASE_PATH: basePath },

  /** the Image Optimization API needs a server; static export cannot use it */
  images: { unoptimized: true },

  /** emit /about/index.html style paths, which static hosts resolve cleanly */
  trailingSlash: true,
};

export default nextConfig;

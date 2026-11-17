import type { NextConfig } from "next";

/**
 * Base path for GitHub Pages (https://generalstan.github.io/Nnamdi-site).
 * The deploy workflow sets PAGES_BASE_PATH=/Nnamdi-site; locally it is empty
 * so `pnpm dev` and `pnpm build` serve from the root.
 */
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Static HTML export to /out, as GitHub Pages only serves files.
  output: "export",
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // Pages cannot run Next's image optimizer; images are pre-compressed WebP.
  images: { unoptimized: true },
  // cacheComponents / partialPrefetching (from the scaffold) are left off:
  // partial prerendering cannot run in a static export, and every page here
  // is fully static anyway.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

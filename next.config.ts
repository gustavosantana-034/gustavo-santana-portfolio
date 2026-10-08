import type { NextConfig } from 'next'

// Fully static export: the portfolio has no server-side behavior, so it can be
// served from any CDN and every page ships as pre-rendered HTML.
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  // The root layout lives in app/[[...locale]], so unmatched URLs need a
  // standalone 404 page (app/global-not-found.tsx).
  experimental: { globalNotFound: true },
}

export default nextConfig

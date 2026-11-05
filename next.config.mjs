/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/privacy.html",
        destination: "/privacy-policy",
        permanent: true,
      },
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      {
        source: "/termini.html",
        destination: "/termini-e-condizioni",
        permanent: true,
      },
      {
        source: "/termini",
        destination: "/termini-e-condizioni",
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      ...["/admin/:path*", "/agenzia/:id/dashboard", "/agenzia/login"].map(source => ({
        source,
        headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }],
      })),
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig

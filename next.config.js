/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false, // don't leak "Next.js" + version in response headers
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }, // tighten to your CDN domain(s) in production
    ],
  },
  eslint: { ignoreDuringBuilds: false },
  // Keep mongoose as a single shared native module instead of letting Next.js
  // bundle a separate copy of it into each server layer (RSC vs Route
  // Handlers). Bundling separate copies is what causes the Mongoose
  // "Cannot overwrite model once compiled" error in dev mode.
  serverExternalPackages: ["mongoose"],
};

module.exports = nextConfig;

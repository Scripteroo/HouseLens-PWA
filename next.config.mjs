/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export for Capacitor iOS builds: CAPACITOR_BUILD=1 npx next build
  ...(process.env.CAPACITOR_BUILD === "1" ? {
    output: "export",
    images: { unoptimized: true },
    trailingSlash: true,
  } : {}),
};

export default nextConfig;

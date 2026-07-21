/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Standalone output produces a self-contained server bundle with only the
  // node_modules it actually needs, avoiding pnpm workspace resolution at
  // container runtime — the image only ever runs `node server.js`.
  output: 'standalone',
};

export default nextConfig;

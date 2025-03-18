/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  images: {
    domains: ["avatars.githubusercontent.com", "lh3.googleusercontent.com", "avatar.vercel.sh"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // güncellenmiş yapılandırma - Next.js 15.2.3 ile uyumlu
  serverExternalPackages: ["bcrypt", "@prisma/client", "prisma"],
  async headers() {
    return [
      {
        // API routes CORS ayarları
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      // Genel yönlendirmeler
      {
        source: '/:path*',
        destination: '/:path*',
      },
      // API yönlendirmeleri
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
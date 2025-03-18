/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'production'
  },
  // Geliştirici göstergeleri üretim ortamında zaten devre dışı
  devIndicators: {},
  // Varsa diğer yapılandırmalar buraya eklenebilir
}

module.exports = nextConfig
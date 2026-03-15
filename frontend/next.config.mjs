/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.buscalibre.cl',
      },
      {
        protocol: 'https',
        hostname: '**.buscalibre.pe',
      },
      {
        protocol: 'https',
        hostname: '**.buscalibre.co',
      },
      {
        protocol: 'https',
        hostname: '**.buscalibre.com.mx',
      },
      {
        protocol: 'https',
        hostname: '**.buscalibre.com.ar',
      },
      {
        protocol: 'https',
        hostname: '**.buscalibre.uy',
      },
      {
        protocol: 'https',
        hostname: '**.buscalibre.com.ve',
      },
      {
        protocol: 'https',
        hostname: '**.buscalibre.com',
      },
    ],
  },
}

export default nextConfig

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'cp25nk2.sit.kmutt.ac.th',
        port: '8000',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig

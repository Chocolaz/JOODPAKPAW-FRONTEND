import type { NextConfig } from 'next'

// Define a minimal type for RuleSetRule
type WebpackRuleSetRule = {
  test?: {
    test: (value: string) => boolean
    source: string
  }
  exclude?: RegExp | RegExp[]
  use?: any
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'cp25nk2.sit.kmutt.ac.th',
        port: '8000',
        pathname: '/properties/**',
      },
    ],
  },
  webpack(config, { isServer }) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find(
      (rule: WebpackRuleSetRule) =>
        rule.test && rule.test.test && rule.test.test('.svg')
    )

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/
    }

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    // ❌ Exclude GitHub Actions runner folders from being compiled
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      exclude: /(_actions|actions-runner|node_modules)/,
      use: [],
    })

    return config
  },
}

export default nextConfig

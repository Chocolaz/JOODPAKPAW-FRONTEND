import type { NextConfig } from 'next'
import type { RuleSetRule } from 'webpack'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'cp25nk2.sit.kmutt.ac.th',
        port: '8900',
        pathname: '/joodpakpaw/**',
      },
      {
        protocol: 'http',
        hostname: 'cp25nk2.sit.kmutt.ac.th',
        port: '8900',
        pathname: '/joodpakpaw//**',
      },
    ],
  },

  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find(
      (rule: RuleSetRule | '...'): rule is RuleSetRule => {
        if (
          typeof rule === 'object' &&
          rule !== null &&
          'test' in rule &&
          rule.test instanceof RegExp
        ) {
          return rule.test.test('.svg')
        }
        return false
      }
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

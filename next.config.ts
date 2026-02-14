import type { NextConfig } from 'next'
import type { RuleSetRule } from 'webpack'

const nextConfig: NextConfig = {
  basePath: '/capstone25/cp25nk2',
  trailingSlash: true,

  images: {
    domains: ['cp25nk2.sit.kmutt.ac.th'],
  },

  webpack(config) {
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

    return config
  },
}

export default nextConfig

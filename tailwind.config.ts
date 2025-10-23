import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-afacad)'],
        heading: ['var(--font-baloo-2)'],
      },
      colors: {
        'accent-orange': 'var(--accent-orange)',
      },
    },
  },
  plugins: [],
}
export default config

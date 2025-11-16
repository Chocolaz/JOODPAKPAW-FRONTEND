import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        'accent-orange': 'var(--accent-orange)',
        'deep-teal': 'var(--deep-teal)',
        'positive-green': 'var(--positive-green)',
      },
      fontSize: {
        sm: '14px',
        base: '16px',
        lg: '18px',
      },
      fontFamily: {
        baloo2: ['var(--font-baloo2)'],
      },
    },
  },
  plugins: [],
}
export default config

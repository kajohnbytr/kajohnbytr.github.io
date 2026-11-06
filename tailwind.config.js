/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { 'neon-blue': '#00f7ff', 'neon-cyan': '#00ffff', 'neon-teal': '#00ffea', 'dark-bg': '#0a0f1f', glass: 'rgba(255, 255, 255, 0.1)' },
      fontFamily: { poppins: ['Poppins', 'sans-serif'] },
    },
  },
  plugins: [],
}

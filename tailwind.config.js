/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:       '#FAFAF7',
        navy:     '#0A1F44',
        gold:     '#C9A84C',
        'gold-dark': '#b8943e',
        sky:      '#38BDF8',
        sand:     '#F5EFE0',
        charcoal: '#2C2C2C',
        muted:    '#6B6B6B',
        border:   '#E0D9CC',
      },
      fontFamily: {
        display: ["'Playfair Display'", 'serif'],
        sans:    ["'DM Sans'", 'sans-serif'],
        grotesk: ["'Space Grotesk'", 'sans-serif'],
      },
    },
  },
  plugins: [],
}

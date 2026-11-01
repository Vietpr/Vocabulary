/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f7f4',
          100: '#e1ede6',
          200: '#c5dcd0',
          300: '#9cc1b1',
          400: '#6ea08e',
          500: '#4a8270',
          600: '#386859',
          700: '#2d5448',
          800: '#25443b',
          900: '#1e3831',
          950: '#10201c',
        },
        cream: {
          50: '#fbfbfa',
          100: '#f7f6f3',
          200: '#eeebe5',
          300: '#dfdad0',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        serif: [
          '"Newsreader"',
          'Charter',
          'Georgia',
          'serif',
        ],
        ipa: [
          '"Lucida Sans Unicode"',
          '"Charis SIL"',
          '"DejaVu Sans"',
          'sans-serif'
        ]
      }
    },
  },
  plugins: [],
}

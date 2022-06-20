/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.html"],
  safelist: ["flash-message"],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            }
          }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

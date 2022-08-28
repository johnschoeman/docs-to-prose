/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/sample.html"],
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

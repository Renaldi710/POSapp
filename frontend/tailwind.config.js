/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#004AC6', light: '#2563EB' },
        text: { dark: '#191C1E', medium: '#434655', light: '#737686' },
        border: { DEFAULT: '#C3C6D7' },
        bg: { page: '#F7F9FB', input: '#F2F4F6', search: '#ECEEF0' },
        sidebar: { active: '#D0E1FB' },
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      fontFamily: {
        sans: ['Inter_400Regular', 'sans-serif'],
        semibold: ['Inter_600SemiBold', 'sans-serif'],
        bold: ['Inter_700Bold', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'],
        heading: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      colors: {
        heading: '#B81BD0',
        darkBlueDetails: '#1B3069',
        blackText: '#000000',
        accentBackground: '#8B5CF6',
        greyBackground: '#D9D9D9',
      },
      backgroundImage: {
        'gradient-background': 'linear-gradient(to bottom, #F7F7FD 0%, #F5F3FF 100%)',
        'gradient-card': 'linear-gradient(to bottom, #B81BD0 0%, #2563EB 100%)',
      },
    },
  },
  plugins: [],
}

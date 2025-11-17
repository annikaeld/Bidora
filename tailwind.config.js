/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./profile.html",
    "./profile/**/*.html",
    "./auctions/**/*.html",
    "./public/**/*.html",
    "./js/**/*.{js,jsx,ts,tsx,html}",
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--sans-font-family, 'Open Sans')", "sans-serif"],
        heading: ["var(--headings-font-family, 'Outfit')", "sans-serif"],
      },
      colors: {
        text: "var(--color-text, #1B3069)",
        "text-primary": "var(--color-text-primary, #1B3069)",
        "black-text": "var(--color-black-text, #000000)",
        "background-accent-color": "var(--color-background-accent, #8B5CF6)",
        "card-background": "var(--color-card-background, #F7F7FD)",
        "grey-background": "var(--color-grey-background, #D9D9D9)",
        cta: "var(--color-cta, #B81BD0)",
        "cta-hover": "var(--color-cta-hover, #7E168E)",
        "color-border": "var(--color-border, #2563EB)",
        accent: "var(--accent-color, #8B5CF6)",
      },
      backgroundImage: {
        "gradient-background":
          "var(--gradient-background, linear-gradient(to bottom, #F7F7FD 0%, #F5F3FF 100%))",
        "gradient-card":
          "var(--gradient-card, linear-gradient(to bottom, #B81BD0, #2563EB))",
      },
    },
    screens: {
      xs: "450px",
      sm: "640px",
      md: "768px",
    },
  },
  plugins: [],
};

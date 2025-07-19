/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
        },
        secondary: "#4B5563",
        background: "#F3F4F6",
        surface: "#FFFFFF",
        error: "#DC2626",
        success: "#16A34A",
      },
    },
  },
  plugins: [],
};

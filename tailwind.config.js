/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Lexend", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          DEFAULT: "#1B2430",
          light: "#4B5768",
        },
        clinical: {
          50: "#EAF4F3",
          100: "#CFE6E4",
          200: "#9FCDC9",
          300: "#6FB3AD",
          400: "#3F9A92",
          500: "#146B6B",
          600: "#115A5A",
          700: "#0D4747",
          800: "#0A3737",
          900: "#072626",
        },
        pulse: {
          50: "#FDECEF",
          100: "#FAD2D9",
          200: "#F3A7B4",
          300: "#EC7C8F",
          400: "#E8637A",
          500: "#DE4363",
          600: "#C23052",
          700: "#992541",
        },
        surface: {
          DEFAULT: "#F7F9FA",
          dark: "#0F1519",
        },
        panel: {
          DEFAULT: "#FFFFFF",
          dark: "#161E24",
        },
        border: {
          DEFAULT: "#E1E7EA",
          dark: "#232E36",
        },
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 25, 30, 0.06), 0 1px 1px rgba(15,25,30,0.04)",
      },
      borderRadius: {
        card: "10px",
      },
    },
  },
  plugins: [],
};

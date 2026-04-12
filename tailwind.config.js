/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/Components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/Pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        phase: {
          orange: "#f97316",
          "orange-dark": "#ea580c",
          slate: {
            950: "#020617",
            900: "#0f172a",
            800: "#1e293b",
          },
        },
      },
      fontFamily: {
        geist: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        geistMono: ["var(--font-geist-mono)", "monospace"],
        // Nabla Google font – loaded in layout.js via next/font/google (--font-nabla)
        nabla: ["var(--font-nabla)", "Nabla", "system-ui"],
        // Asimovian – Google Fonts link in layout.js; --font-asimovian in globals.css @theme
        asimovian: ["var(--font-asimovian)", "sans-serif"],
        // Electrolize – Google Fonts link in layout.js (same as .electrolize-regular in globals.css)
        electrolize: ['"Electrolize"', "sans-serif"],
      },
      maxWidth: {
        "sphere-canvas": "1400px",
      },
    },
  },
  plugins: [],
};

export default config;

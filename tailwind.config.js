/** @type {import('tailwindcss').Config} */
export default {
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
        nabla: ["var(--font-nabla)", "Nabla", "system-ui"],
      },
      maxWidth: {
        "sphere-canvas": "1400px",
      },
    },
  },
  plugins: [],
};

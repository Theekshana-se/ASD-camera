import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-yellow':'#FED700',
      }
    },
  },  
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms"), require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#DC2626",
          "primary-content": "#ffffff",
          secondary: "#000000",
          accent: "#ffffff",
          neutral: "#111111",
          "base-100": "#ffffff",
          "base-200": "#f5f5f5",
          "base-300": "#e5e7eb",
          info: "#2563eb",
          success: "#16a34a",
          warning: "#f59e0b",
          error: "#dc2626"
        }
      }
    ]
  },
};
export default config;

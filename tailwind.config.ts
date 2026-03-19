import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "SF Pro Display", "SF Pro Text", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        lens: { bg: "#F2F2F7", card: "#FFFFFF", accent: "#007AFF", text: "#1C1C1E", secondary: "#8E8E93", border: "#E5E5EA", green: "#34C759" },
      },
      boxShadow: {
        card: "0 2px 16px rgba(0, 0, 0, 0.06)",
        elevated: "0 8px 32px rgba(0, 0, 0, 0.1)",
        logo: "0 4px 24px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;

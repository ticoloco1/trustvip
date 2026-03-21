import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { accent: "#a855f7" },
    fontFamily: { sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"] }
  }},
  plugins: [],
} satisfies Config;

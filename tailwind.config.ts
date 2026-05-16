import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07111f",
        brand: "#0f766e",
        soft: "#eef7f5"
      }
    }
  },
  plugins: []
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "media",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      gridTemplateRows: {
        "base-layout": "80px 1fr 80px",
        "max-content-layout-2": "max-content max-content",
        "max-content-layout-3": "max-content max-content max-content",
        "max-content-layout-4":
          "max-content max-content max-content max-content",
      },
      gridTemplateColumns: {
        "max-content-layout-2": "max-content 1fr",
      },
    },
  },
  plugins: [],
};
export default config;

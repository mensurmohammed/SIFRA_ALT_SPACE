import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // New design system tokens
        "primary-dark": "#352214",
        "primary-light": "#F7F4EE",
        "accent-gold": "#D4A359",
        "card-bg": "#FFFFFF",
        "text-muted": "#706F6F",
        "border-color": "#E0DCD3",
        "badge-avail-bg": "#E2F0D9",
        "badge-avail-text": "#385723",
        "badge-borrow-bg": "#FCE4D6",
        "badge-borrow-text": "#C65911",

        // Backwards-compat aliases (keep old names so internal pages still work)
        olive: "#352214",
        "olive-light": "#4A3220",
        cream: "#F7F4EE",
        dark: "#352214",
        gold: "#D4A359",
        "gold-light": "#E0BC7F",
        beige: "#E0DCD3",

        // Status colors
        success: "#385723",
        "success-light": "#E2F0D9",
        warning: "#92400E",
        "warning-light": "#F59E0B",
        danger: "#991B1B",
        "danger-light": "#EF4444",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(53, 34, 20, 0.05)",
        "soft-md": "0 4px 16px rgba(53, 34, 20, 0.08)",
        card: "0 2px 8px rgba(53, 34, 20, 0.05)",
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "24px",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
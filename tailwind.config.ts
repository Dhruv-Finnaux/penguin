import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: ["src/**/*.{js,jsx,ts,tsx}"],
  // ColorField builds these class names at runtime, so Tailwind can't find them in source.
  safelist: [
    // next-themes adds these to <html> at runtime; globals.css keys the palettes off them.
    "light",
    "dark",
    "color-rose",
    "color-orange",
    "color-teal",
    "color-purple",
    "color-blue",
    "color-coral",
    "color-amber",
  ],
  theme: {
    extend: {
      transitionDelay: {
        "2000": "2000ms",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
        },
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "shadcn-sweep-1": {
          "0%": { left: "-35%", right: "100%" },
          "60%": { left: "100%", right: "-90%" },
          "100%": { left: "100%", right: "-90%" },
        },
        "shadcn-sweep-2": {
          "0%": { left: "-200%", right: "100%" },
          "60%": { left: "107%", right: "-8%" },
          "100%": { left: "107%", right: "-8%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "progress-bar1": "shadcn-sweep-1 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite",
        "progress-bar2": "shadcn-sweep-2 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) 1.15s infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwind-scrollbar-hide"),
    require("tailwind-scrollbar"),
  ],
} satisfies Config

export default config

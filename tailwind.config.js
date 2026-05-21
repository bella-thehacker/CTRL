/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
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
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
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
        // Custom Ctrl theme colors
        forest: {
          deep: '#0d1a0d',
          mid: '#152415',
          light: '#1a2e1a',
        },
        cream: {
          DEFAULT: '#e8dcc4',
          dim: '#b8a88a',
          faded: 'rgba(232, 220, 196, 0.25)',
        },
        'error-orange': {
          DEFAULT: '#ff4d00',
          dim: '#cc3d00',
        },
      },
      fontFamily: {
        display: ['"Press Start 2P"', 'monospace'],
        serif: ['"EB Garamond"', 'Georgia', 'serif'],
        mono: ['"Fragment Mono"', 'monospace'],
        script: ['"Caveat"', 'cursive'],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
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
        "grain-shift": {
          "0%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(-2%, -1%)" },
          "50%": { transform: "translate(1%, 2%)" },
          "75%": { transform: "translate(-1%, 1%)" },
          "100%": { transform: "translate(0, 0)" },
        },
        "scanline-scroll": {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "0 100%" },
        },
        "hiccup": {
          "0%": { filter: "invert(0)", transform: "translateX(0)" },
          "30%": { filter: "invert(1)", transform: "translateX(-2px)" },
          "60%": { filter: "invert(0.5)", transform: "translateX(2px)" },
          "100%": { filter: "invert(0)", transform: "translateX(0)" },
        },
        "pulse-opacity": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        "cursor-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "grain-shift": "grain-shift 0.5s steps(4) infinite",
        "scanline-scroll": "scanline-scroll 8s linear infinite",
        "hiccup": "hiccup 150ms ease-out",
        "pulse-opacity": "pulse-opacity 2s ease-in-out infinite",
        "cursor-blink": "cursor-blink 1s step-end infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
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
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
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
        pixel: {
          light: "#e6e6e6",
          dark: "#1a1a2e",
          blue: "#4361ee",
          red: "#ff5e5b",
          green: "#2ec4b6",
          yellow: "#ffd166",
          purple: "#7209b7",
          orange: "#fb8500",
          pink: "#FF69B4",
          cyan: "#00FFFF",
          indigo: "#4B0082",
          teal: "#008080",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        pixelFont: ["var(--font-pixelify-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        "pixel-bounce": "pixel-bounce 0.5s infinite alternate",
        "pixel-pulse": "pixel-pulse 2s infinite",
        "pixel-float": "pixel-float 3s ease-in-out infinite",
      },
      keyframes: {
        "pixel-bounce": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-5px)" },
        },
        "pixel-pulse": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
        "pixel-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

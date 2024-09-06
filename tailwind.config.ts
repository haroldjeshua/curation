import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        mono: ["var(--font-mono)", ...fontFamily.mono],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
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
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },

        // --- custom ---
        // main
        "lavender-pink": {
          "50": "#fef1f9",
          "100": "#fee5f4",
          "200": "#feccea",
          "300": "#ffb6e1",
          "400": "#fe68bd",
          "500": "#f83ca2",
          "600": "#e81a7f",
          "700": "#ca0c64",
          "800": "#a70d52",
          "900": "#8b1047",
          "950": "#550227",
        },
        carnation: {
          "50": "#fff1f1",
          "100": "#ffe1e1",
          "200": "#ffc7c7",
          "300": "#ffa0a0",
          "400": "#ff6b6b",
          "500": "#f83b3b",
          "600": "#e51d1d",
          "700": "#c11414",
          "800": "#a01414",
          "900": "#841818",
          "950": "#480707",
        },
        "azure-radiance": {
          "50": "#edfaff",
          "100": "#d6f2ff",
          "200": "#b5eaff",
          "300": "#83dfff",
          "400": "#48cbff",
          "500": "#1eadff",
          "600": "#068fff",
          "700": "#007bff",
          "800": "#085ec5",
          "900": "#0d519b",
          "950": "#0e315d",
        },
        emerald: {
          "50": "#f1fcf5",
          "100": "#defaea",
          "200": "#bef4d4",
          "300": "#8beab3",
          "400": "#52d689",
          "500": "#2ecc71",
          "600": "#1d9c53",
          "700": "#1b7a43",
          "800": "#1a6139",
          "900": "#175031",
          "950": "#072c18",
        },
        "carrot-orange": {
          "50": "#fffaeb",
          "100": "#fdf0c8",
          "200": "#fbe08c",
          "300": "#f9c950",
          "400": "#f7b328",
          "500": "#f1920e",
          "600": "#d56e0a",
          "700": "#b14b0c",
          "800": "#903b10",
          "900": "#763011",
          "950": "#441704",
        },
        amethyst: {
          "50": "#faf6fd",
          "100": "#f5edfa",
          "200": "#eadaf4",
          "300": "#dbbdea",
          "400": "#c695dd",
          "500": "#ad6bca",
          "600": "#9b59b6",
          "700": "#783c8f",
          "800": "#643375",
          "900": "#552e61",
          "950": "#33143e",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        moss: {
          DEFAULT: "var(--moss)",
          light: "var(--moss-light)",
          subtle: "var(--moss-subtle)"
        },
        sage: "var(--sage)",
        cream: "var(--cream)",
        stone: "var(--stone)",
        bark: {
          DEFAULT: "var(--bark)",
          light: "var(--bark-light)",
          faint: "var(--bark-faint)"
        },
        verified: "var(--verified)",
        unverified: "var(--unverified)",
        gone: "var(--gone)",
        urgent: "var(--urgent)",
        night: {
          DEFAULT: "var(--night)",
          card: "var(--night-card)",
          text: "var(--night-text)"
        }
      },
      fontFamily: {
        serif: ["var(--font-instrument-serif)"],
        sans: ["var(--font-dm-sans)"],
        mono: ["var(--font-dm-mono)"]
      },
      boxShadow: {
        soft: "0 24px 60px rgba(61, 56, 49, 0.12)",
        note: "0 10px 30px rgba(61, 56, 49, 0.12)",
        float: "0 14px 36px rgba(45, 106, 79, 0.18)"
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
        "3xl": "2.5rem"
      },
      backgroundImage: {
        paper:
          "linear-gradient(180deg, rgba(254,250,224,0.96) 0%, rgba(245,241,235,0.95) 100%)",
        grain:
          "radial-gradient(circle at 20% 20%, rgba(149,213,178,0.18), transparent 40%), radial-gradient(circle at 80% 0%, rgba(212,168,67,0.12), transparent 35%), radial-gradient(circle at 50% 80%, rgba(231,111,81,0.10), transparent 30%)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        },
        pulseDot: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(45, 106, 79, 0.34)" },
          "70%": { boxShadow: "0 0 0 14px rgba(45, 106, 79, 0)" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseDot: "pulseDot 2s infinite"
      }
    }
  },
  plugins: []
};

export default config;

import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
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
          50: "hsl(var(--primary-50))",
          100: "hsl(var(--primary-100))",
          200: "hsl(var(--primary-200))",
          300: "hsl(var(--primary-300))",
          400: "hsl(var(--primary-400))",
          600: "hsl(var(--primary-600))",
          700: "hsl(var(--primary-700))",
          800: "hsl(var(--primary-800))",
          900: "hsl(var(--primary-900))",
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
        neutral: {
          0: "hsl(var(--neutral-0))",
          50: "hsl(var(--neutral-50))",
          100: "hsl(var(--neutral-100))",
          200: "hsl(var(--neutral-200))",
          300: "hsl(var(--neutral-300))",
          400: "hsl(var(--neutral-400))",
          500: "hsl(var(--neutral-500))",
          600: "hsl(var(--neutral-600))",
          700: "hsl(var(--neutral-700))",
          800: "hsl(var(--neutral-800))",
          900: "hsl(var(--neutral-900))",
        },
        success: {
          light: "hsl(var(--success-light))",
          DEFAULT: "hsl(var(--success))",
          dark: "hsl(var(--success-dark))",
        },
        warning: {
          light: "hsl(var(--warning-light))",
          DEFAULT: "hsl(var(--warning))",
          dark: "hsl(var(--warning-dark))",
        },
        error: {
          light: "hsl(var(--error-light))",
          DEFAULT: "hsl(var(--error))",
          dark: "hsl(var(--error-dark))",
        },
        info: {
          light: "hsl(var(--info-light))",
          DEFAULT: "hsl(var(--info))",
          dark: "hsl(var(--info-dark))",
        },
        status: {
          pending: "hsl(var(--status-pending))",
          accepted: "hsl(var(--status-accepted))",
          cooking: "hsl(var(--status-cooking))",
          ready: "hsl(var(--status-ready))",
          rejected: "hsl(var(--status-rejected))",
          delayed: "hsl(var(--status-delayed))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },

      /* XML 명세 1.7 Z-Index */
      zIndex: {
        base: "0",
        dropdown: "10",
        sticky: "20",
        overlay: "30",
        modal: "40",
        toast: "50",
        tooltip: "60",
      },

      /* XML 명세 1.3 간격 시스템 (base=4px) */
      spacing: {
        "space-0": "0px",
        "space-1": "4px",
        "space-2": "8px",
        "space-3": "12px",
        "space-4": "16px",
        "space-5": "20px",
        "space-6": "24px",
        "space-8": "32px",
        "space-10": "40px",
        "space-12": "48px",
        "space-16": "64px",
        "space-20": "80px",
      },

      /* XML 명세 1.6 모션 */
      transitionDuration: {
        instant: "0ms",
        fast: "100ms",
        normal: "200ms",
        slow: "300ms",
        gentle: "400ms",
        spring: "500ms",
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1.25rem",
        "2xl": "1.5rem",
        none: "0px",
        xs: "4px",
        full: "9999px",
      },
      fontSize: {
        "heading-xl": [
          "28px",
          { lineHeight: "1.3", fontWeight: "700", letterSpacing: "-0.02em" },
        ],
        "heading-lg": [
          "24px",
          { lineHeight: "1.3", fontWeight: "700", letterSpacing: "-0.01em" },
        ],
        "heading-md": [
          "20px",
          { lineHeight: "1.4", fontWeight: "600", letterSpacing: "-0.01em" },
        ],
        "heading-sm": ["18px", { lineHeight: "1.4", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "body-sm": [
          "12px",
          { lineHeight: "1.5", fontWeight: "400", letterSpacing: "0.01em" },
        ],
        "body-xs": [
          "10px",
          { lineHeight: "1.4", fontWeight: "500", letterSpacing: "0.02em" },
        ],
        "btn-lg": [
          "16px",
          { lineHeight: "1", fontWeight: "600", letterSpacing: "0.02em" },
        ],
        "btn-md": [
          "14px",
          { lineHeight: "1", fontWeight: "600", letterSpacing: "0.02em" },
        ],
        "btn-sm": [
          "12px",
          { lineHeight: "1", fontWeight: "600", letterSpacing: "0.02em" },
        ],
        price: [
          "20px",
          { lineHeight: "1.2", fontWeight: "700", letterSpacing: "-0.01em" },
        ],
      },
      boxShadow: {
        xs: "0 1px 2px rgba(0,0,0,0.05)",
        sm: "0 2px 4px rgba(0,0,0,0.08)",
        md: "0 4px 12px rgba(0,0,0,0.10)",
        lg: "0 8px 24px rgba(0,0,0,0.12)",
        xl: "0 16px 48px rgba(0,0,0,0.16)",
        top: "0 -2px 8px rgba(0,0,0,0.06)",
        inner: "inset 0 2px 4px rgba(0,0,0,0.04)",
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
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-down": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(100%)" },
        },
        /* Toast: translateY(-16→0) + opacity */
        "toast-in": {
          from: { transform: "translateY(-16px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "toast-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        /* Modal: opacity + scale */
        "modal-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "modal-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        /* Spinner rotation */
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        /* Skeleton pulse */
        "skeleton-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-up": "slide-up 0.3s ease-in-out",
        "slide-down": "slide-down 0.3s ease-in-out",
        "toast-in": "toast-in 0.2s ease-out",
        "toast-out": "toast-out 0.2s ease-in",
        "modal-in": "modal-in 0.2s ease-out",
        "modal-out": "modal-out 0.2s ease-in",
        spin: "spin 1s linear infinite",
        "skeleton-pulse":
          "skeleton-pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

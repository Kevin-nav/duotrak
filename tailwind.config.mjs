// import {主题 } from "./src/styles/主题";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        'sm': '640px',    // Default Tailwind sm, can be used if needed
        'md': '768px',    // Corresponds to DuoTrak 'tablet'
        'lg': '1024px',   // Corresponds to DuoTrak 'desktop'
        'xl': '1280px',   // Default Tailwind xl, for max content width
        '2xl': '1536px',  // Default Tailwind 2xl
      },
    },
    extend: {
      colors: {
        'primary-beige': 'var(--color-primary-beige)',
        'primary-accent': 'var(--color-primary-accent)',
        'card-modal-background': 'var(--color-card-modal-background)',
        'secondary-beige-light': 'var(--color-secondary-beige-light)',
        'secondary-accent-darker': 'var(--color-secondary-accent-darker)',
        'navbar-background': 'var(--color-navbar-background)',
        'user-message-bubble-bg': 'var(--color-user-message-bubble-bg)',
        'duotrak-brand-text': 'var(--color-duotrak-brand-text)',
        'success-green': 'var(--color-success-green)',
        'notification-orange': 'var(--color-notification-alert-orange-amber)', // As per PRD section 3 example
        'notification-amber': 'var(--color-notification-alert-orange-amber)', // Alias as per PRD section 3 example
        'error-red': 'var(--color-error-red)',
        'verification-blue': 'var(--color-verification-pending-blue-purple)', // As per PRD section 3 example
        'verification-purple': 'var(--color-verification-pending-blue-purple)', // Alias as per PRD section 3 example
        'primary-text-dark': 'var(--color-primary-text-dark)',
        'secondary-text-medium': 'var(--color-secondary-text-medium)',
        'disabled-text-border': 'var(--color-disabled-text-border-light)', // As per PRD section 3 example
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      spacing: { // As per PRD Section 5
        'xxs': '0.25rem', // 4px
        'xs': '0.5rem',   // 8px
        'sm': '0.75rem',  // 12px
        'md': '1rem',     // 16px
        'lg': '1.5rem',   // 24px
        'xl': '2rem',     // 32px
        'xxl': '3rem',    // 48px
        'xxxl': '4rem',   // 64px
      },
      boxShadow: { // As per PRD Section 7.B (Card shadow)
        'duotrak-card': '0 2px 8px rgba(139, 69, 19, 0.1)',
        'duotrak-card-hover': '0px 6px 16px rgba(139, 69, 19, 0.15), 0px 3px 8px rgba(139, 69, 19, 0.12)',
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
        shimmer: {
          '0%, 100%': { backgroundPosition: '-100% 0' },
          '50%': { backgroundPosition: '100% 0' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: 'shimmer 2s infinite linear',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tw-animate-css"),
    require("@tailwindcss/postcss"),
    // 主题,
  ],
}

export default config; 
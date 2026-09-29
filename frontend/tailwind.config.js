/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        navy: {
          950: '#070E20', 900: '#0A1330', 850: '#0A0F1D',
          800: '#0F1A35', 700: '#162447', 600: '#1F3160', 500: '#2A4074',
        },
        pulse: { DEFAULT: '#E23B2E', dark: '#C82D21' },
        cyan: { DEFAULT: '#38BDF8' },
        magenta: { DEFAULT: '#EC4899' },
        gold: { DEFAULT: '#FACC15' },
        greenok: { DEFAULT: '#22C55E' },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))', input: 'hsl(var(--input))', ring: 'hsl(var(--ring))',
      },
      borderRadius: { lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)' },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        pulsering: { '0%': { transform: 'scale(0.9)', opacity: '0.6' }, '100%': { transform: 'scale(1.6)', opacity: '0' } },
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        pulsering: 'pulsering 3s ease-out infinite',
        floaty: 'floaty 6s ease-in-out infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

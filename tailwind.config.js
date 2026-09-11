/**
 * Single source of truth for the design system.
 * Colours live as CSS custom properties in src/index.css and are surfaced to
 * Tailwind here, so nothing in the components ever hardcodes a hex value.
 */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: 'var(--cream)',
        paper: 'var(--paper)',
        sand: 'var(--sand)',
        line: 'var(--line)',
        'line-strong': 'var(--line-strong)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        muted: 'var(--muted)',
        terracotta: 'var(--terracotta)',
        'terracotta-deep': 'var(--terracotta-deep)',
        'terracotta-tint': 'var(--terracotta-tint)',
        teal: 'var(--teal)',
        'teal-deep': 'var(--teal-deep)',
        'teal-tint': 'var(--teal-tint)',
        gold: 'var(--gold)',
        'gold-tint': 'var(--gold-tint)',
        coral: 'var(--coral)',
        'coral-tint': 'var(--coral-tint)',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        label: ['0.6875rem', { lineHeight: '1.1', letterSpacing: '0.15em' }],
        caption: ['0.8125rem', { lineHeight: '1.5' }],
        body: ['1.0625rem', { lineHeight: '1.65' }],
        lead: ['1.25rem', { lineHeight: '1.6' }],
        tutor: ['1.1875rem', { lineHeight: '1.6' }],
        h3: ['1.5rem', { lineHeight: '1.25' }],
        h2: ['clamp(2.1rem, 3.6vw, 3.1rem)', { lineHeight: '1.08', letterSpacing: '-0.015em' }],
        display: ['clamp(3rem, 8vw, 5.75rem)', { lineHeight: '0.92', letterSpacing: '-0.03em' }],
      },
      spacing: { section: 'clamp(5rem, 10vw, 9rem)' },
      maxWidth: { shell: '1280px', prose: '68ch' },
      borderRadius: { tile: '0.75rem', panel: '1.25rem' },
      boxShadow: {
        tile: '0 1px 0 var(--line-strong), 0 2px 4px -1px rgba(120, 78, 62, 0.14)',
        'tile-raised': '0 2px 0 var(--line-strong), 0 10px 18px -8px rgba(120, 78, 62, 0.3)',
        panel: '0 1px 2px rgba(28, 27, 25, 0.04), 0 24px 48px -32px rgba(120, 78, 62, 0.35)',
        lift: '0 10px 24px -12px rgba(120, 78, 62, 0.45)',
        inset: 'inset 0 1px 2px rgba(120, 78, 62, 0.08)',
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
        quart: 'cubic-bezier(0.25, 1, 0.5, 1)',
        exit: 'cubic-bezier(0.7, 0, 0.84, 0)',
      },
    },
  },
  plugins: [],
};

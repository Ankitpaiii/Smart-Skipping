import React from 'react';

const VARIANTS = {
  primary:
    'bg-terracotta text-paper border border-terracotta-deep shadow-lift hover:bg-terracotta-deep hover:shadow-panel',
  secondary: 'bg-paper text-ink border border-line-strong hover:border-ink-soft hover:shadow-lift',
  quiet: 'bg-transparent text-ink-soft border border-transparent hover:bg-sand hover:text-ink',
  dark: 'bg-ink text-cream border border-ink hover:bg-ink-soft',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-caption',
  md: 'px-4 py-2.5 text-[0.9375rem]',
  lg: 'px-6 py-3.5 text-[1.0625rem]',
};

export function Button({ variant = 'primary', size = 'md', className = '', ...rest }) {
  return <button type="button" className={`btn ${VARIANTS[variant]} ${SIZES[size]} ${className}`} {...rest} />;
}

/** Small tracked-out uppercase label. Used for eyebrows and step counters. */
export function Eyebrow({ children, className = '', tone = 'muted' }) {
  const tones = { muted: 'text-muted', terracotta: 'text-terracotta', teal: 'text-teal', ink: 'text-ink' };
  return (
    <span className={`text-label font-medium uppercase ${tones[tone]} ${className}`}>{children}</span>
  );
}

const CHIP_TONES = {
  neutral: 'bg-sand text-ink-soft border-line-strong',
  match: 'bg-teal-tint text-teal-deep border-teal',
  miss: 'bg-coral-tint text-coral border-coral',
  shift: 'bg-gold-tint text-ink border-gold',
  found: 'bg-teal text-paper border-teal-deep',
  done: 'bg-ink text-cream border-ink',
};

export function Chip({ tone = 'neutral', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-label font-semibold uppercase ${CHIP_TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export const CHIP_TONE_FOR_KIND = {
  compare: 'match',
  mismatch: 'miss',
  shift: 'shift',
  occurrence: 'found',
  end: 'done',
};

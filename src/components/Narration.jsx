import React from 'react';
import { Chip, Eyebrow, CHIP_TONE_FOR_KIND } from './ui.jsx';

function RuleRow({ label, value, chosen, reason }) {
  return (
    <div className={`flex items-baseline gap-3 py-2.5 ${chosen ? '' : 'opacity-60'}`}>
      <span className={`num w-9 shrink-0 font-mono text-[1.375rem] leading-none ${chosen ? 'text-ink' : 'text-muted'}`}>
        {value}
      </span>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[0.9375rem] font-medium">{label}</span>
          {chosen && <Chip tone="shift">chosen</Chip>}
        </div>
        <p className="text-caption text-muted">{reason}</p>
      </div>
    </div>
  );
}

/**
 * The tutor voice. Reads like a person explaining, not a textbook, and is wired
 * to aria-live so screen readers follow the animation too.
 */
export default function Narration({ frame, cursor, total, pattern }) {
  if (!frame) {
    return (
      <div className="rounded-panel border border-dashed border-line-strong bg-paper p-6">
        <Eyebrow>Waiting</Eyebrow>
        <p className="mt-3 font-display text-tutor text-ink-soft">
          Fix the input above and the narration will pick right back up.
        </p>
      </div>
    );
  }

  const shift = frame.kind === 'shift' ? frame.shift : null;
  const hasRules = shift && shift.badChar !== null;

  return (
    <div className="rounded-panel border border-line bg-paper p-6 shadow-panel">
      <div className="flex items-center justify-between gap-3">
        <Eyebrow>
          Step {cursor + 1} of {total}
        </Eyebrow>
        <Chip tone={CHIP_TONE_FOR_KIND[frame.kind]}>{frame.chip}</Chip>
      </div>

      <p
        aria-live="polite"
        className="mt-4 font-display text-tutor font-normal text-ink"
        style={{ minHeight: '5.5rem' }}
      >
        {frame.narration}
      </p>

      {hasRules && (
        <div className="mt-5 border-t border-line pt-2">
          <Eyebrow className="block pb-1">Shift arithmetic</Eyebrow>
          <RuleRow
            label="Bad character rule"
            value={shift.badChar}
            chosen={shift.winner !== 'good-suffix'}
            reason="Align the offending text character with its last copy in the pattern."
          />
          <div className="hairline" />
          <RuleRow
            label="Good suffix rule"
            value={shift.goodSuffix}
            chosen={shift.winner !== 'bad-char'}
            reason={
              frame.matched.length
                ? `Reuse the suffix "${pattern.slice(pattern.length - frame.matched.length)}" we already matched.`
                : 'Nothing matched yet, so this rule has little to offer.'
            }
          />
          <div className="hairline mt-1 pt-3 text-caption text-ink-soft">
            Boyer-Moore always takes the larger jump, so the pattern moves{' '}
            <strong className="font-semibold text-ink">{shift.by}</strong> to position {shift.to}.
          </div>
        </div>
      )}
    </div>
  );
}

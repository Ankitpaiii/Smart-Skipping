import React from 'react';
import { Eyebrow } from './ui.jsx';

function Bar({ label, value, max, tone, done }) {
  const ratio = max > 0 ? Math.min(value / max, 1) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[0.9375rem] font-medium">{label}</span>
        <span className="num font-mono text-[1.125rem] text-ink">
          {value}
          {done && <span className="ml-1.5 text-label uppercase text-muted">done</span>}
        </span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-sand">
        <div
          className="h-full origin-left rounded-full transition-transform duration-500 ease-expo"
          style={{ transform: `scaleX(${ratio})`, background: tone, width: '100%' }}
        />
      </div>
    </div>
  );
}

/**
 * Live comparison counters. Both numbers are real: the naive count comes from
 * the same precomputed run, walked by the same cursor.
 */
export default function Stats({ bmFrame, naiveFrame, run, bmDone, naiveDone }) {
  const bmValue = bmFrame ? bmFrame.comparisons : 0;
  const naiveValue = naiveFrame ? naiveFrame.comparisons : 0;
  const max = Math.max(run.naive.comparisons, run.bm.comparisons, 1);
  const saved = run.naive.comparisons ? Math.round((1 - run.bm.comparisons / run.naive.comparisons) * 100) : 0;

  return (
    <div className="rounded-panel border border-line bg-cream p-6">
      <div className="flex items-center justify-between">
        <Eyebrow>Character comparisons</Eyebrow>
        <span className="text-caption text-muted">live</span>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <Bar label="Boyer-Moore" value={bmValue} max={max} tone="var(--teal)" done={bmDone} />
        <Bar label="Brute force" value={naiveValue} max={max} tone="var(--coral)" done={naiveDone} />
      </div>

      <p className="mt-5 border-t border-line pt-4 text-caption text-ink-soft">
        {run.valid && saved > 0 ? (
          <>
            On this input Boyer-Moore finishes the whole search in{' '}
            <strong className="font-semibold text-ink">{run.bm.comparisons}</strong> comparisons against brute force&rsquo;s{' '}
            <strong className="font-semibold text-ink">{run.naive.comparisons}</strong>:{' '}
            <strong className="font-semibold text-teal">{saved}% fewer</strong>.
          </>
        ) : run.valid ? (
          <>
            A rare tie: this input gives Boyer-Moore nothing to skip, so both algorithms spend{' '}
            <strong className="font-semibold text-ink">{run.bm.comparisons}</strong> comparisons. Worth knowing about.
          </>
        ) : (
          'Counters resume once the input is valid.'
        )}
      </p>
    </div>
  );
}

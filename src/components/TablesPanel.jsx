import React from 'react';
import { Eyebrow } from './ui.jsx';

/**
 * The precomputed tables, on screen. Cheap to render, and it turns the two
 * heuristics from "magic numbers" into something an evaluator can audit live.
 */
export default function TablesPanel({ pattern, tables, activeSuffixIndex }) {
  const { lastOccurrence, goodSuffix } = tables;

  return (
    <details className="group rounded-panel border border-line bg-paper px-6 py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <span className="font-display text-[1.0625rem] font-semibold">Precomputed tables</span>
        <span className="text-caption text-muted transition-colors group-hover:text-ink">
          built once per pattern &middot; tap to open
        </span>
      </summary>

      <div className="mt-5 grid gap-7 lg:grid-cols-2">
        <div>
          <Eyebrow tone="terracotta">Bad character &middot; last occurrence</Eyebrow>
          <div className="mt-3 flex flex-wrap gap-2">
            {lastOccurrence.map(([char, index]) => (
              <span
                key={char}
                className="inline-flex items-center gap-2 rounded-lg border border-line bg-cream px-2.5 py-1.5 font-mono text-caption"
              >
                <span className="text-ink">{char === ' ' ? '␣' : char}</span>
                <span className="text-muted">&rarr;</span>
                <span className="num text-terracotta">{index}</span>
              </span>
            ))}
          </div>
          <p className="mt-3 max-w-[42ch] text-caption text-muted">
            Anything missing from this list can never match, so the pattern clears it completely.
          </p>
        </div>

        <div>
          <Eyebrow tone="teal">Good suffix &middot; shift table</Eyebrow>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {goodSuffix.map((value, i) => {
              const active = i === activeSuffixIndex;
              return (
                <span
                  key={i}
                  className={`flex w-11 flex-col items-center rounded-lg border px-1 py-1.5 font-mono text-caption transition-colors duration-200 ${
                    active ? 'border-teal bg-teal-tint text-teal-deep' : 'border-line bg-cream text-ink-soft'
                  }`}
                >
                  <span className="num text-[0.625rem] text-muted">{i === 0 ? 'full' : `j=${i - 1}`}</span>
                  <span className="num text-[0.9375rem]">{value}</span>
                </span>
              );
            })}
          </div>
          <p className="mt-3 max-w-[46ch] text-caption text-muted">
            Read as: mismatch at pattern index <span className="font-mono">j</span> &rarr; slide by this much. Pattern{' '}
            <span className="font-mono text-ink">{pattern}</span>.
          </p>
        </div>
      </div>
    </details>
  );
}

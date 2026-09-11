import React from 'react';
import Reveal from './Reveal.jsx';
import { Eyebrow } from './ui.jsx';

const ROWS = [
  { label: 'Preprocessing', naive: 'none', bm: 'O(m + k)' },
  { label: 'Best case', naive: 'O(n)', bm: 'O(n / m)' },
  { label: 'Average, large alphabet', naive: 'O(n × m)', bm: 'sublinear' },
  { label: 'Worst case', naive: 'O(n × m)', bm: 'O(n × m)' },
  { label: 'Extra space', naive: 'O(1)', bm: 'O(m + k)' },
];

function Race({ run }) {
  const naive = run && run.valid ? run.naive.comparisons : 0;
  const bm = run && run.valid ? run.bm.comparisons : 0;
  const max = Math.max(naive, bm, 1);

  const bars = [
    { label: 'Brute force', value: naive, tone: 'var(--coral)' },
    { label: 'Boyer-Moore', value: bm, tone: 'var(--teal)' },
  ];

  return (
    <div>
      <Eyebrow>On the input you are running</Eyebrow>
      <div className="mt-5 flex flex-col gap-6">
        {bars.map((bar) => (
          <div key={bar.label}>
            <div className="flex items-baseline justify-between">
              <span className="text-[0.9375rem] font-medium">{bar.label}</span>
              <span className="num font-mono text-[1.25rem]">{bar.value}</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-sand">
              <div
                className="h-full w-full origin-left rounded-full transition-transform duration-700 ease-expo"
                style={{ transform: `scaleX(${bar.value / max})`, background: bar.tone }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-caption text-muted">
        {bm > 0 && naive > bm
          ? `${(naive / bm).toFixed(2)}× fewer comparisons, measured on the exact run above.`
          : 'Change the text or pattern in the simulator and these bars follow it.'}
      </p>
    </div>
  );
}

export default function Complexity({ run }) {
  return (
    <section id="complexity" className="scroll-mt-24 border-y border-line bg-sand py-section">
      <div className="mx-auto max-w-shell px-6">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <Reveal>
              <Eyebrow>Takeaways</Eyebrow>
              <h2 className="mt-5 font-display text-h2 font-semibold">The payoff: why skipping wins.</h2>
            </Reveal>

            <Reveal i={1} className="mt-10">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-line-strong">
                    <th className="pb-3 text-label font-medium uppercase tracking-[0.15em] text-muted">Measure</th>
                    <th className="pb-3 text-label font-medium uppercase tracking-[0.15em] text-muted">Brute force</th>
                    <th className="pb-3 text-label font-medium uppercase tracking-[0.15em] text-muted">Boyer-Moore</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row) => (
                    <tr key={row.label} className="border-b border-line">
                      <td className="py-4 pr-4 text-[0.9375rem]">{row.label}</td>
                      <td className="py-4 pr-4 font-mono text-caption text-ink-soft">{row.naive}</td>
                      <td className="py-4 font-mono text-caption text-teal">{row.bm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 text-caption text-muted">
                n = text length, m = pattern length, k = alphabet size.
              </p>
            </Reveal>
          </div>

          <div className="flex flex-col gap-10">
            <Reveal i={2} className="rounded-panel border border-line bg-paper p-7 shadow-panel">
              <Race run={run} />
            </Reveal>

            <Reveal i={3}>
              <p className="max-w-prose text-body text-ink-soft">
                Both algorithms share the same worst case on paper, and that is the honest headline. The difference is
                what happens on real input: the longer the pattern and the larger the alphabet, the more text
                Boyer-Moore never looks at. Brute force pays for every character. Boyer-Moore pays for the ones that
                could plausibly matter, which is why it gets{' '}
                <em className="font-display not-italic text-ink">faster</em> as patterns get longer.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

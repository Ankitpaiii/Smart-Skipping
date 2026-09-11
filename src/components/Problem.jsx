import React, { useMemo } from 'react';
import TileBoard from './TileBoard.jsx';
import Reveal from './Reveal.jsx';
import { Chip, Eyebrow } from './ui.jsx';
import { naiveSteps } from '../algorithms/index.js';
import { useAutoPlayer } from '../hooks/useSimulation.js';
import { useInView } from '../hooks/useInView.js';

const TEXT = 'AABAACAADAABAABA';
const PATTERN = 'AABA';

export default function Problem() {
  const [ref, inView] = useInView({ once: false, threshold: 0.25 });
  const run = useMemo(() => naiveSteps(TEXT, PATTERN), []);
  const frame = useAutoPlayer(run.steps, { delay: 300, active: inView, loopPause: 1600 });

  return (
    <section id="problem" className="scroll-mt-24 border-t border-line bg-sand py-section">
      <div className="mx-auto max-w-shell px-6">
        <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-20">
          <div>
            <Reveal>
              <Eyebrow>The problem</Eyebrow>
              <h2 className="mt-5 font-display text-h2 font-semibold">
                Before we skip ahead, let&rsquo;s see why brute force struggles.
              </h2>
            </Reveal>

            <Reveal i={1} className="mt-7 flex max-w-prose flex-col gap-5 text-body text-ink-soft">
              <p>
                String matching is a simple ask: given a <strong className="font-semibold text-ink">text</strong> and a{' '}
                <strong className="font-semibold text-ink">pattern</strong>, find every place the pattern appears.
              </p>
              <p>
                Brute force does the obvious thing. Line the pattern up at position 0, compare left to right, and the
                instant something disagrees, slide over by exactly one character and start again. It never learns
                anything from the comparison it just failed.
              </p>
            </Reveal>

            <Reveal i={2} className="mt-9">
              <div className="flex flex-wrap items-end gap-x-10 gap-y-4 border-t border-line-strong pt-6">
                <div>
                  <Eyebrow>Naive comparisons</Eyebrow>
                  <div className="num mt-2 flex items-baseline gap-1.5 font-mono leading-none text-coral">
                    <span className="text-[2.75rem]">{frame ? frame.comparisons : 0}</span>
                    <span className="text-lead text-muted">/ {run.comparisons}</span>
                  </div>
                </div>
                <p className="max-w-[24ch] text-caption text-muted">
                  to search a 16 character text for a 4 character pattern. Boyer-Moore settles it in 16.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal i={1} className="min-w-0">
            <div ref={ref} className="min-w-0 rounded-panel border border-line bg-paper p-5 shadow-panel sm:p-7">
              <div className="mb-4 flex items-center justify-between gap-3">
                <Eyebrow>Brute force, on loop</Eyebrow>
                <Chip tone={frame && frame.kind === 'mismatch' ? 'miss' : 'neutral'}>
                  {frame ? frame.chip : 'idle'}
                </Chip>
              </div>
              <TileBoard text={TEXT} pattern={PATTERN} frame={frame} tone="naive" showIndices={false} maxCell={44} />
              <p className="mt-4 min-h-[3rem] border-t border-line pt-4 text-caption text-ink-soft">
                {frame ? frame.narration : ''}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

import React, { useMemo, useState } from 'react';
import TileBoard from './TileBoard.jsx';
import { Button, Eyebrow } from './ui.jsx';
import { boyerMooreSteps } from '../algorithms/index.js';
import { useAutoPlayer } from '../hooks/useSimulation.js';
import { useInView } from '../hooks/useInView.js';
import { scrollToSection } from '../lib/scroll.js';

const GLYPHS = ['A', 'B', 'C', 'A', 'B', 'D', 'A', 'B', 'C', 'B', 'A', 'D'];

/** Abstract drifting character blocks. Typographic, not clipart, not blobs. */
function DriftField() {
  const items = useMemo(
    () =>
      GLYPHS.map((char, i) => ({
        char,
        i,
        top: [6, 90, 22, 74, 12, 52, 40, 34, 82, 16, 62, 96][i],
        left: [58, 4, 88, 93, 70, 62, 96, 76, 84, 66, 92, 7][i],
        size: [42, 30, 54, 26, 34, 48, 28, 32, 44, 24, 38, 30][i],
        dx: ['14px', '-18px', '10px', '-12px', '16px', '-10px', '12px', '-16px', '8px', '-14px', '18px', '-8px'][i],
        dy: ['-22px', '16px', '-14px', '20px', '-18px', '14px', '-20px', '12px', '-16px', '18px', '-12px', '22px'][i],
        rot: ['-6deg', '4deg', '8deg', '-5deg', '3deg', '-8deg', '6deg', '-3deg', '5deg', '-7deg', '2deg', '7deg'][i],
        dur: `${16 + (i % 5) * 3}s`,
      })),
    [],
  );

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((item) => (
        <span
          key={item.i}
          className="drift absolute grid place-items-center rounded-tile border border-line font-mono text-muted"
          style={{
            top: `${item.top}%`,
            left: `${item.left}%`,
            width: item.size,
            height: item.size,
            fontSize: item.size * 0.42,
            background: 'var(--paper)',
            opacity: 0.55,
            '--dx': item.dx,
            '--dy': item.dy,
            '--r': item.rot,
            '--dur': item.dur,
            '--i': item.i,
          }}
        >
          {item.char}
        </span>
      ))}
    </div>
  );
}

function Teaser() {
  const [ref, inView] = useInView({ once: false, threshold: 0.3 });
  const steps = useMemo(() => boyerMooreSteps('SKIP AHEAD FAST', 'FAST').steps, []);
  const frame = useAutoPlayer(steps, { delay: 340, active: inView, loopPause: 1200 });

  return (
    <div ref={ref} className="rounded-panel border border-line bg-paper p-5 shadow-panel">
      <div className="mb-3 flex items-center justify-between gap-3">
        <Eyebrow>Live preview</Eyebrow>
        <span className="num text-caption text-muted">
          {frame ? frame.comparisons : 0} comparisons
        </span>
      </div>
      <TileBoard
        text="SKIP AHEAD FAST"
        pattern="FAST"
        frame={frame}
        maxCell={34}
        showIndices={false}
        showShift={false}
      />
    </div>
  );
}

export default function Hero() {
  const [replayKey, setReplayKey] = useState(0);
  const word = 'Skipping';

  return (
    <section id="hero" className="relative overflow-hidden pt-28 pb-section sm:pt-32">
      <DriftField />

      <div className="relative mx-auto grid max-w-shell gap-14 px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-16">
        <div key={replayKey}>
          <div className="rise" style={{ '--i': 0 }}>
            <Eyebrow tone="terracotta">CSE533 &middot; Design and Analysis of Algorithms</Eyebrow>
          </div>

          <h1 className="mt-6 font-display text-display font-semibold text-ink">
            <span className="rise block" style={{ '--i': 1 }}>
              Smart
            </span>
            <span className="relative inline-block whitespace-nowrap">
              {Array.from(word, (letter, i) => (
                <span key={i} className="letter" style={{ '--i': i }}>
                  {letter}
                </span>
              ))}
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="16"
                viewBox="0 0 320 16"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  className="underline-draw"
                  d="M3 11C58 5 128 3 190 6c40 2 78 5 127 3"
                  stroke="var(--terracotta)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>
          </h1>

          <p className="rise mt-9 max-w-[52ch] text-lead text-ink-soft" style={{ '--i': 5 }}>
            Watch how Boyer-Moore outsmarts brute-force string search, one clever skip at a time.
          </p>

          <div className="rise mt-9 flex flex-wrap items-center gap-3" style={{ '--i': 6 }}>
            <Button size="lg" onClick={() => scrollToSection('simulator')}>
              Start the simulation
            </Button>
            <Button variant="quiet" size="lg" onClick={() => scrollToSection('problem')}>
              Why brute force struggles &rarr;
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setReplayKey((k) => k + 1)}
            className="mt-8 text-caption text-muted underline decoration-line-strong decoration-dotted underline-offset-4 transition-colors hover:text-ink"
          >
            Replay the intro
          </button>
        </div>

        <div className="rise min-w-0" style={{ '--i': 4 }}>
          <Teaser />
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { Button, Eyebrow } from './ui.jsx';
import { SPEEDS } from '../hooks/useSimulation.js';

function Icon({ name }) {
  const common = { width: 15, height: 15, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true };
  const stroke = { stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (name === 'play') return <svg {...common}><path d="M4.5 2.6l8 5.4-8 5.4z" fill="currentColor" /></svg>;
  if (name === 'pause') return <svg {...common}><path d="M5 3v10M11 3v10" {...stroke} strokeWidth="2.2" /></svg>;
  if (name === 'next') return <svg {...common}><path d="M5 3l5 5-5 5M13 3v10" {...stroke} /></svg>;
  if (name === 'prev') return <svg {...common}><path d="M11 3L6 8l5 5M3 3v10" {...stroke} /></svg>;
  return (
    <svg {...common}>
      <path d="M13 8a5 5 0 11-1.6-3.7M13 2v3h-3" {...stroke} />
    </svg>
  );
}

export default function Controls({ sim }) {
  const { playing, cursor, total, atEnd, speedIndex, setSpeedIndex, toggle, stepBack, stepForward, reset, seek } = sim;
  const disabled = total === 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2.5">
        <Button onClick={toggle} disabled={disabled} className="min-w-[7.5rem] justify-center">
          <Icon name={playing ? 'pause' : 'play'} />
          {playing ? 'Pause' : atEnd ? 'Replay' : 'Play'}
        </Button>
        <Button variant="secondary" size="sm" onClick={stepBack} disabled={disabled || cursor === 0}>
          <Icon name="prev" /> Step back
        </Button>
        <Button variant="secondary" size="sm" onClick={stepForward} disabled={disabled || atEnd}>
          Step forward <Icon name="next" />
        </Button>
        <Button variant="quiet" size="sm" onClick={reset} disabled={disabled || cursor === 0}>
          <Icon name="reset" /> Reset
        </Button>

        <div className="ml-auto flex items-center gap-3">
          <Eyebrow>Tempo</Eyebrow>
          <div className="flex rounded-xl border border-line bg-paper p-0.5 shadow-inset">
            {SPEEDS.map((speed, i) => (
              <button
                key={speed.id}
                type="button"
                onClick={() => setSpeedIndex(i)}
                aria-pressed={speedIndex === i}
                className={`rounded-[0.6rem] px-2.5 py-1.5 text-caption transition-colors duration-200 ease-quart ${
                  speedIndex === i ? 'bg-ink text-cream' : 'text-ink-soft hover:bg-sand'
                }`}
              >
                {speed.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="range"
          min={0}
          max={Math.max(total - 1, 0)}
          value={cursor}
          onChange={(event) => seek(Number(event.target.value))}
          disabled={disabled}
          aria-label="Scrub through the algorithm steps"
          className="h-4 flex-1"
        />
        <span className="num w-24 text-right text-caption text-muted">
          {total ? `${cursor + 1} / ${total}` : '0 / 0'}
        </span>
      </div>

      <p className="text-caption text-muted">
        Keyboard: <kbd className="font-mono text-ink">space</kbd> play or pause,{' '}
        <kbd className="font-mono text-ink">&larr;</kbd> <kbd className="font-mono text-ink">&rarr;</kbd> step,{' '}
        <kbd className="font-mono text-ink">R</kbd> reset.
      </p>
    </div>
  );
}

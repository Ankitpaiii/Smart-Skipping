import React, { useEffect } from 'react';
import TileBoard from './TileBoard.jsx';
import Controls from './Controls.jsx';
import Narration from './Narration.jsx';
import Stats from './Stats.jsx';
import TablesPanel from './TablesPanel.jsx';
import { Chip, Eyebrow } from './ui.jsx';
import { useSimulation } from '../hooks/useSimulation.js';
import { cleanInput, LIMITS, PRESETS } from '../algorithms/index.js';

function Field({ id, label, value, onChange, error, hint, maxLength }) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 flex items-baseline justify-between gap-3">
        <Eyebrow tone="ink">{label}</Eyebrow>
        <span className="num text-[0.6875rem] text-muted">
          {value.length}/{maxLength}
        </span>
      </span>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(cleanInput(event.target.value))}
        spellCheck="false"
        autoComplete="off"
        className={`field w-full rounded-xl border bg-paper px-4 py-3 font-mono text-[1.0625rem] tracking-[0.06em] text-ink placeholder:text-muted ${
          error ? 'border-coral' : 'border-line-strong'
        }`}
      />
      <span className={`mt-2 block text-caption ${error ? 'text-coral' : 'text-muted'}`}>{error || hint}</span>
    </label>
  );
}

export default function Simulator({ text, pattern, setText, setPattern, showNaive, setShowNaive, onRun }) {
  const sim = useSimulation(text, pattern);
  const { run, bmFrame, naiveFrame, toggle, stepBack, stepForward, reset } = sim;

  useEffect(() => {
    if (onRun) onRun(run);
  }, [run, onRun]);

  // Keyboard control, ignored while typing in a field.
  useEffect(() => {
    const onKey = (event) => {
      const tag = event.target && event.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || event.metaKey || event.ctrlKey) return;
      if (event.code === 'Space') {
        event.preventDefault();
        toggle();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        stepForward();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        stepBack();
      } else if (event.key === 'r' || event.key === 'R') {
        reset();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle, stepForward, stepBack, reset]);

  const activePreset = PRESETS.find((p) => p.text === text && p.pattern === pattern);
  const validationError = run.valid ? null : run.validation;
  const shiftFrame = bmFrame && bmFrame.kind === 'shift' ? bmFrame : null;
  const activeSuffixIndex = shiftFrame
    ? shiftFrame.shift.badChar === null
      ? 0
      : pattern.length - shiftFrame.matched.length
    : -1;

  return (
    <div className="flex flex-col gap-8">
      {/* INPUT */}
      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-start">
        <div className="grid gap-5 sm:grid-cols-[1.6fr_1fr]">
          <Field
            id="sim-text"
            label="Text"
            value={text}
            maxLength={LIMITS.text}
            onChange={setText}
            error={validationError && validationError.field === 'text' ? validationError.message : null}
            hint="Anything you like. Case sensitive, spaces allowed."
          />
          <Field
            id="sim-pattern"
            label="Pattern"
            value={pattern}
            maxLength={LIMITS.pattern}
            onChange={setPattern}
            error={validationError && validationError.field === 'pattern' ? validationError.message : null}
            hint="What we are hunting for."
          />
        </div>

        <div>
          <Eyebrow className="block">Curated examples</Eyebrow>
          <div className="mt-3 flex flex-wrap gap-2">
            {PRESETS.map((preset) => {
              const active = activePreset && activePreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setText(preset.text);
                    setPattern(preset.pattern);
                  }}
                  className={`btn rounded-xl border px-3 py-2 text-caption ${
                    active
                      ? 'border-ink bg-ink text-cream'
                      : 'border-line-strong bg-paper text-ink-soft hover:border-ink-soft hover:text-ink'
                  }`}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>
          <p className="mt-3 min-h-[3rem] max-w-[46ch] text-caption text-muted">
            {activePreset ? activePreset.note : 'Custom input. Every rule still applies, live.'}
          </p>
        </div>
      </div>

      {/* CANVAS */}
      <div className="min-w-0 rounded-panel border border-line bg-paper p-5 shadow-panel sm:p-7">
        {run.valid ? (
          <div className="flex min-w-0 flex-col gap-9">
            <TileBoard
              text={text}
              pattern={pattern}
              frame={bmFrame}
              title="Boyer-Moore"
              subtitle="right to left, jumps ahead"
              badge={
                bmFrame && bmFrame.found.length ? (
                  <Chip tone="found">
                    {bmFrame.found.length} {bmFrame.found.length === 1 ? 'match' : 'matches'} at {bmFrame.found.join(', ')}
                  </Chip>
                ) : (
                  <Chip tone="neutral">searching</Chip>
                )
              }
            />

            {showNaive && (
              <div className="min-w-0 border-t border-dashed border-line pt-8">
                <TileBoard
                  text={text}
                  pattern={pattern}
                  frame={naiveFrame}
                  tone="naive"
                  title="Brute force"
                  subtitle="left to right, one step at a time"
                  badge={
                    naiveFrame && naiveFrame.kind === 'end' ? (
                      <Chip tone="done">finished</Chip>
                    ) : (
                      <Chip tone="neutral">still grinding</Chip>
                    )
                  }
                />
              </div>
            )}

            <div className="flex items-center justify-between gap-4 border-t border-line pt-6">
              <label htmlFor="race" className="flex cursor-pointer items-center gap-3">
                <input
                  id="race"
                  type="checkbox"
                  checked={showNaive}
                  onChange={(event) => setShowNaive(event.target.checked)}
                  className="h-4 w-4 accent-[var(--terracotta)]"
                />
                <span className="text-[0.9375rem]">Race brute force in the same window</span>
              </label>
              <span className="hidden text-caption text-muted sm:block">
                Both rows share one clock, so the gap you see is the real gap.
              </span>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[14rem] flex-col items-start justify-center gap-3 px-2">
            <Chip tone="miss">Nothing to animate</Chip>
            <p className="max-w-prose font-display text-tutor text-ink-soft">
              {run.validation.message}
            </p>
          </div>
        )}
      </div>

      {/* CONTROLS + NARRATION */}
      <div className="grid gap-7 lg:grid-cols-[1.15fr_1fr] lg:items-start">
        <div className="flex flex-col gap-7">
          <Controls sim={sim} />
          <Stats
            bmFrame={bmFrame}
            naiveFrame={naiveFrame}
            run={run}
            bmDone={sim.bmDone}
            naiveDone={sim.naiveDone}
          />
        </div>
        <Narration frame={bmFrame} cursor={sim.cursor} total={Math.max(sim.total, 1)} pattern={pattern} />
      </div>

      {run.valid && (
        <TablesPanel pattern={pattern} tables={run.bm.tables} activeSuffixIndex={activeSuffixIndex} />
      )}
    </div>
  );
}

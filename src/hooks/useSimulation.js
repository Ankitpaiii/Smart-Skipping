import { useCallback, useEffect, useMemo, useState } from 'react';
import { buildRun, frameAt } from '../algorithms/index.js';

/** Four discrete tempos. Values are the delay between steps, in ms. */
export const SPEEDS = [
  { id: 'slow', label: 'Slow', delay: 1150 },
  { id: 'normal', label: 'Normal', delay: 620 },
  { id: 'fast', label: 'Fast', delay: 300 },
  { id: 'blitz', label: 'Blitz', delay: 130 },
];

/**
 * Owns the playback clock. The algorithm never runs while animating: the whole
 * step array is computed the moment the input changes, and playback is nothing
 * more than an index walking that array.
 */
export function useSimulation(text, pattern) {
  const run = useMemo(() => buildRun(text, pattern), [text, pattern]);
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(1);

  const total = run.totalSteps;
  const lastIndex = Math.max(total - 1, 0);
  const atEnd = cursor >= lastIndex;

  // New input means a new run: rewind and stop.
  useEffect(() => {
    setCursor(0);
    setPlaying(false);
  }, [run]);

  useEffect(() => {
    if (!playing || !total) return undefined;
    if (atEnd) {
      setPlaying(false);
      return undefined;
    }
    const id = window.setTimeout(() => {
      setCursor((c) => Math.min(c + 1, lastIndex));
    }, SPEEDS[speedIndex].delay);
    return () => window.clearTimeout(id);
  }, [playing, cursor, speedIndex, total, atEnd, lastIndex]);

  const play = useCallback(() => {
    if (!total) return;
    setCursor((c) => (c >= lastIndex ? 0 : c));
    setPlaying(true);
  }, [total, lastIndex]);

  const pause = useCallback(() => setPlaying(false), []);
  const toggle = useCallback(() => (playing ? pause() : play()), [playing, pause, play]);

  const stepForward = useCallback(() => {
    setPlaying(false);
    setCursor((c) => Math.min(c + 1, lastIndex));
  }, [lastIndex]);

  const stepBack = useCallback(() => {
    setPlaying(false);
    setCursor((c) => Math.max(c - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setPlaying(false);
    setCursor(0);
  }, []);

  const seek = useCallback(
    (value) => {
      setPlaying(false);
      setCursor(Math.min(Math.max(value, 0), lastIndex));
    },
    [lastIndex],
  );

  const bmFrame = frameAt(run.bm.steps, cursor);
  const naiveFrame = frameAt(run.naive.steps, cursor);

  return {
    run,
    cursor,
    total,
    playing,
    atEnd,
    speed: SPEEDS[speedIndex],
    speedIndex,
    setSpeedIndex,
    play,
    pause,
    toggle,
    stepForward,
    stepBack,
    reset,
    seek,
    bmFrame,
    naiveFrame,
    bmDone: run.bm.steps.length > 0 && cursor >= run.bm.steps.length - 1,
    naiveDone: run.naive.steps.length > 0 && cursor >= run.naive.steps.length - 1,
  };
}

/**
 * A self-driving loop used by the hero teaser and the brute-force explainer.
 * Pauses itself whenever it is off screen so it never competes with the
 * simulator for frames.
 */
export function useAutoPlayer(steps, { delay = 420, active = true, loopPause = 1400 } = {}) {
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    setCursor(0);
  }, [steps]);

  useEffect(() => {
    if (!active || steps.length < 2) return undefined;
    const atEnd = cursor >= steps.length - 1;
    const id = window.setTimeout(
      () => setCursor((c) => (c >= steps.length - 1 ? 0 : c + 1)),
      atEnd ? loopPause : delay,
    );
    return () => window.clearTimeout(id);
  }, [cursor, steps, delay, active, loopPause]);

  return steps.length ? steps[Math.min(cursor, steps.length - 1)] : null;
}

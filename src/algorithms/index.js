import { boyerMooreSteps } from './boyerMoore.js';
import { naiveSteps } from './naive.js';
import { LIMITS } from './presets.js';

export { boyerMooreSteps } from './boyerMoore.js';
export { naiveSteps } from './naive.js';
export { PRESETS, DEFAULT_PRESET, LIMITS } from './presets.js';
export * from './tables.js';

/**
 * Friendly, inline-message validation. Never throws, never logs.
 * @returns {{ok: boolean, field?: 'text'|'pattern', message?: string}}
 */
export function validateInput(text, pattern) {
  if (!text.length) return { ok: false, field: 'text', message: 'Give me some text to search through.' };
  if (!pattern.length) return { ok: false, field: 'pattern', message: 'Add a pattern to hunt for.' };
  if (pattern.length > text.length) {
    return {
      ok: false,
      field: 'pattern',
      message: 'The pattern is longer than the text, so it can never fit. Shorten it or lengthen the text.',
    };
  }
  if (text.length > LIMITS.text) {
    return { ok: false, field: 'text', message: 'Keep the text under ' + LIMITS.text + ' characters so the tiles stay readable.' };
  }
  if (pattern.length > LIMITS.pattern) {
    return { ok: false, field: 'pattern', message: 'Keep the pattern under ' + LIMITS.pattern + ' characters.' };
  }
  return { ok: true };
}

/**
 * Build a complete, frozen run for both algorithms.
 * Called once per input change, never during animation.
 */
export function buildRun(text, pattern) {
  const validation = validateInput(text, pattern);
  if (!validation.ok) {
    return {
      valid: false,
      validation,
      text,
      pattern,
      bm: { steps: [], comparisons: 0, matches: [], tables: { lastOccurrence: [], goodSuffix: [] } },
      naive: { steps: [], comparisons: 0, matches: [] },
      totalSteps: 0,
    };
  }

  const bm = boyerMooreSteps(text, pattern);
  const naive = naiveSteps(text, pattern);

  return {
    valid: true,
    validation,
    text,
    pattern,
    bm,
    naive,
    totalSteps: Math.max(bm.steps.length, naive.steps.length),
    speedup: bm.comparisons ? naive.comparisons / bm.comparisons : 1,
    saved: naive.comparisons ? Math.round((1 - bm.comparisons / naive.comparisons) * 100) : 0,
  };
}

/**
 * Clamp a step cursor onto a step array, returning the last frame when the
 * shorter of the two runs has already finished.
 */
export function frameAt(steps, cursor) {
  if (!steps.length) return null;
  return steps[Math.min(Math.max(cursor, 0), steps.length - 1)];
}

/** Sanitize typed input: strip newlines, collapse tabs, keep everything else. */
export function cleanInput(value) {
  return value.replace(/[\r\n\t]+/g, ' ');
}

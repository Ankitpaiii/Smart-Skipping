/**
 * Naive (brute force) string matching, expanded into the same step shape as
 * boyerMooreSteps so both engines can drive identical UI components.
 *
 * Left to right, one character at a time, and the pattern only ever moves by 1.
 * That single-step shift is exactly what Boyer-Moore refuses to accept.
 *
 * @param {string} text
 * @param {string} pattern
 * @returns {{steps: Array, comparisons: number, matches: number[]}}
 */
export function naiveSteps(text, pattern) {
  const n = text.length;
  const m = pattern.length;
  const steps = [];
  const found = [];
  let comparisons = 0;

  if (n === 0 || m === 0 || m > n) return { steps, comparisons, matches: found };

  const push = (step) => {
    steps.push({ index: steps.length, algo: 'naive', ...step });
  };

  for (let align = 0; align <= n - m; align += 1) {
    const matched = [];
    let j = 0;

    while (j < m) {
      comparisons += 1;
      const hit = pattern[j] === text[align + j];
      if (hit) matched.push(align + j);
      push({
        kind: hit ? 'compare' : 'mismatch',
        align,
        compare: { text: align + j, pattern: j },
        matched: [...matched],
        found: [...found],
        comparisons,
        shift: null,
        chip: hit ? 'Match' : 'Mismatch',
        narration: hit
          ? '"' + pattern[j] + '" matches at position ' + (align + j) + '.'
          : '"' + pattern[j] + '" vs "' + text[align + j] + '": mismatch. Slide over by exactly one and start again.',
      });
      if (!hit) break;
      j += 1;
    }

    if (j === m) {
      found.push(align);
      push({
        kind: 'occurrence',
        align,
        compare: null,
        matched: [...matched],
        found: [...found],
        comparisons,
        shift: null,
        chip: 'Found it',
        narration: 'Full match at position ' + align + '.',
      });
    }

    if (align < n - m) {
      push({
        kind: 'shift',
        align,
        compare: null,
        matched: [...matched],
        found: [...found],
        comparisons,
        shift: {
          by: 1,
          from: align,
          to: align + 1,
          badChar: null,
          goodSuffix: null,
          winner: 'none',
          label: 'Shift 1',
          detail: 'Brute force has no rules to reason with, so it always shifts by 1.',
        },
        chip: 'Shift 1',
        narration: 'No shortcuts available. Move one position right and restart the comparison.',
      });
    }
  }

  push({
    kind: 'end',
    align: n - m,
    compare: null,
    matched: [],
    found: [...found],
    comparisons,
    shift: null,
    chip: 'Done',
    narration:
      found.length === 0
        ? 'Finished with no match, after ' + comparisons + ' comparisons of grinding.'
        : 'Finished: ' + found.length + (found.length === 1 ? ' occurrence' : ' occurrences') +
          ' at position ' + found.join(', ') + ', after ' + comparisons + ' comparisons.',
  });

  return { steps, comparisons, matches: found };
}

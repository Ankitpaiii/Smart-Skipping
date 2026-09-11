import {
  buildGoodSuffixTable,
  buildLastOccurrence,
  badCharacterShift,
  describeGoodSuffix,
} from './tables.js';

/**
 * Boyer-Moore, expanded into a flat array of discrete, replayable steps.
 *
 * The whole run is computed up front (before a single frame is drawn), so the
 * UI never has to run algorithm logic mid-animation: Play / Step / Scrub all
 * just move an index into this array. That is what makes the demo crash-proof.
 *
 * Every step is a complete snapshot of what should be on screen:
 *   { kind, align, compare, matched, found, comparisons, shift, narration }
 *
 * kind: 'compare' | 'mismatch' | 'occurrence' | 'shift' | 'end'
 *
 * @param {string} text
 * @param {string} pattern
 * @returns {{steps: Array, comparisons: number, matches: number[], tables: object}}
 */
export function boyerMooreSteps(text, pattern) {
  const n = text.length;
  const m = pattern.length;
  const last = buildLastOccurrence(pattern);
  const goodSuffix = buildGoodSuffixTable(pattern);
  const steps = [];
  const found = [];
  let comparisons = 0;

  const tables = {
    lastOccurrence: Array.from(last.entries()).sort((a, b) => a[1] - b[1]),
    goodSuffix,
  };

  if (n === 0 || m === 0 || m > n) {
    return { steps, comparisons, matches: found, tables };
  }

  const push = (step) => {
    steps.push({ index: steps.length, algo: 'boyer-moore', ...step });
  };

  let align = 0;

  while (align <= n - m) {
    const matched = [];
    let j = m - 1;

    // Walk the pattern from RIGHT to LEFT. This is the whole trick: mismatches
    // discovered at the far end tell us the most about how far we can jump.
    while (j >= 0 && pattern[j] === text[align + j]) {
      comparisons += 1;
      matched.unshift(align + j);
      push({
        kind: 'compare',
        align,
        compare: { text: align + j, pattern: j },
        matched: [...matched],
        found: [...found],
        comparisons,
        shift: null,
        chip: 'Match',
        narration:
          '"' + pattern[j] + '" matches "' + text[align + j] + '" at position ' + (align + j) +
          (j === m - 1
            ? '. Start from the right and keep walking backwards.'
            : '. Still holding, keep walking left.'),
      });
      j -= 1;
    }

    if (j < 0) {
      // --- Complete match ---
      found.push(align);
      const by = goodSuffix[0];
      push({
        kind: 'occurrence',
        align,
        compare: null,
        matched: [...matched],
        found: [...found],
        comparisons,
        shift: null,
        chip: 'Found it',
        narration:
          'Every character lined up: "' + pattern + '" sits at position ' + align +
          '. That is occurrence #' + found.length + '.',
      });
      push({
        kind: 'shift',
        align,
        compare: null,
        matched: [...matched],
        found: [...found],
        comparisons,
        shift: {
          by,
          from: align,
          to: align + by,
          badChar: null,
          goodSuffix: by,
          winner: 'good-suffix',
          label: 'Match found, shift ' + by,
          detail: 'Good Suffix Rule: ' + describeGoodSuffix(pattern, -1, by) + ', so shift by ' + by + '.',
        },
        chip: 'Shift ' + by,
        narration:
          'Now we slide ' + by + ' along and keep hunting for the next occurrence.',
      });
      align += by;
    } else {
      // --- Mismatch at pattern index j ---
      comparisons += 1;
      const badChar = text[align + j];
      const bc = badCharacterShift(last, badChar, j);
      const gs = goodSuffix[j + 1];
      const by = Math.max(bc, gs);
      const winner = bc === gs ? 'tie' : bc > gs ? 'bad-char' : 'good-suffix';
      const inPattern = last.has(badChar);

      push({
        kind: 'mismatch',
        align,
        compare: { text: align + j, pattern: j },
        matched: [...matched],
        found: [...found],
        comparisons,
        shift: null,
        chip: 'Mismatch',
        narration:
          'Comparing "' + pattern[j] + '" (pattern) with "' + badChar + '" (text) at position ' +
          (align + j) + ': mismatch. Time to work out how far we are allowed to jump.',
      });

      const bcReason = inPattern
        ? '"' + badChar + '" last appears at index ' + last.get(badChar) +
          ' in the pattern, so the bad character rule slides it under that copy: ' + bc + '.'
        : '"' + badChar + '" is nowhere in the pattern, so the bad character rule clears it completely: ' + bc + '.';
      const gsReason = matched.length
        ? ' Meanwhile ' + describeGoodSuffix(pattern, j, gs) + ': ' + gs + '.'
        : '';

      let verdict;
      if (winner === 'bad-char') verdict = ' Bad character wins, so the pattern jumps ' + by + '.';
      else if (winner === 'good-suffix') verdict = ' Good suffix wins, so the pattern jumps ' + by + '.';
      else verdict = ' Both rules agree: jump ' + by + '.';

      push({
        kind: 'shift',
        align,
        compare: null,
        matched: [...matched],
        found: [...found],
        comparisons,
        shift: {
          by,
          from: align,
          to: align + by,
          badChar: bc,
          goodSuffix: gs,
          winner,
          label:
            (winner === 'good-suffix' ? 'Good Suffix' : 'Bad Character') + ' Rule, shift ' + by,
          detail: 'Bad Character: ' + bc + ' | Good Suffix: ' + gs + ' | take the larger: ' + by,
        },
        chip: 'Shift ' + by,
        narration: bcReason + gsReason + verdict
      });
      align += by;
    }
  }

  push({
    kind: 'end',
    align: Math.min(align, n - m),
    compare: null,
    matched: [],
    found: [...found],
    comparisons,
    shift: null,
    chip: 'Done',
    narration:
      found.length === 0
        ? 'Reached the end of the text with no match found, and it only cost ' + comparisons +
          ' comparisons to prove it.'
        : 'Done. ' + found.length + (found.length === 1 ? ' occurrence' : ' occurrences') +
          ' found at position ' + found.join(', ') + ', in ' + comparisons + ' character comparisons.',
  });

  return { steps, comparisons, matches: found, tables };
}

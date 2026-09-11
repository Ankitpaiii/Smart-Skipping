/**
 * Zero-dependency test suite. Run with:  npm test   (node --test)
 * Cross-validates the step engines against a reference implementation over
 * tens of thousands of random inputs, then checks the invariants the UI relies on.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { boyerMooreSteps } from '../algorithms/boyerMoore.js';
import { naiveSteps } from '../algorithms/naive.js';
import { buildGoodSuffixTable, buildLastOccurrence, badCharacterShift } from '../algorithms/tables.js';
import { buildRun, validateInput } from '../algorithms/index.js';
import { PRESETS } from '../algorithms/presets.js';

/** Reference matcher: every start index where pattern occurs. */
function reference(text, pattern) {
  const out = [];
  if (!pattern.length || pattern.length > text.length) return out;
  for (let i = 0; i + pattern.length <= text.length; i += 1) {
    if (text.startsWith(pattern, i)) out.push(i);
  }
  return out;
}

function randomString(len, alphabet) {
  let s = '';
  for (let i = 0; i < len; i += 1) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}

test('boyer-moore finds exactly the same occurrences as brute force', () => {
  const alphabets = ['AB', 'ABC', 'ACGT', 'ABCDEFGH', 'AB CD'];
  for (let i = 0; i < 20000; i += 1) {
    const alphabet = alphabets[i % alphabets.length];
    const text = randomString(1 + Math.floor(Math.random() * 40), alphabet);
    const pattern = randomString(1 + Math.floor(Math.random() * 6), alphabet);
    const expected = reference(text, pattern);
    assert.deepEqual(boyerMooreSteps(text, pattern).matches, expected, `BM failed on "${pattern}" in "${text}"`);
    assert.deepEqual(naiveSteps(text, pattern).matches, expected, `naive failed on "${pattern}" in "${text}"`);
  }
});

test('boyer-moore never needs more comparisons than brute force on the presets', () => {
  for (const preset of PRESETS) {
    const run = buildRun(preset.text, preset.pattern);
    assert.equal(run.valid, true, preset.id);
    assert.ok(run.bm.comparisons <= run.naive.comparisons, `${preset.id}: ${run.bm.comparisons} > ${run.naive.comparisons}`);
  }
});

test('every step is a renderable snapshot with monotonic counters', () => {
  for (let i = 0; i < 3000; i += 1) {
    const text = randomString(4 + Math.floor(Math.random() * 30), 'ABCD');
    const pattern = randomString(1 + Math.floor(Math.random() * 4), 'ABCD');
    for (const { steps } of [boyerMooreSteps(text, pattern), naiveSteps(text, pattern)]) {
      let comparisons = -1;
      let align = -1;
      for (const step of steps) {
        assert.ok(step.comparisons >= comparisons, 'comparison counter went backwards');
        comparisons = step.comparisons;
        if (step.kind !== 'end') {
          assert.ok(step.align >= align, 'pattern moved backwards');
          align = step.align;
          assert.ok(step.align >= 0 && step.align + pattern.length <= text.length, 'pattern left the text');
        }
        assert.equal(typeof step.narration, 'string');
        assert.ok(step.narration.length > 0, 'empty narration');
        if (step.compare) {
          assert.equal(text[step.compare.text], text[step.align + step.compare.pattern]);
        }
      }
      if (steps.length) assert.equal(steps.at(-1).kind, 'end');
    }
  }
});

test('shifts always move forward and always pick the larger heuristic', () => {
  for (let i = 0; i < 5000; i += 1) {
    const text = randomString(6 + Math.floor(Math.random() * 24), 'ABC');
    const pattern = randomString(2 + Math.floor(Math.random() * 4), 'ABC');
    const last = buildLastOccurrence(pattern);
    const gs = buildGoodSuffixTable(pattern);
    for (const step of boyerMooreSteps(text, pattern).steps) {
      if (step.kind !== 'shift' || step.shift.badChar === null) continue;
      const j = step.matched.length ? pattern.length - 1 - step.matched.length : pattern.length - 1;
      assert.ok(step.shift.by >= 1, 'zero or negative shift');
      assert.equal(step.shift.by, Math.max(step.shift.badChar, step.shift.goodSuffix));
      assert.equal(step.shift.goodSuffix, gs[j + 1]);
      assert.equal(step.shift.badChar, badCharacterShift(last, text[step.align + j], j));
    }
  }
});

test('good suffix table matches its brute-force definition', () => {
  const bruteGoodSuffix = (pattern) => {
    const m = pattern.length;
    const table = new Array(m + 1);
    for (let j = -1; j < m; j += 1) {
      // smallest s >= 1 such that shifting by s is consistent with the strong rule
      let s = 1;
      for (; s < m + 1; s += 1) {
        let ok = true;
        for (let k = j + 1; k < m; k += 1) {
          const src = k - s;
          if (src >= 0 && pattern[src] !== pattern[k]) { ok = false; break; }
        }
        if (ok && j >= 0) {
          const src = j - s;
          if (src >= 0 && pattern[src] === pattern[j]) ok = false;
        }
        if (ok) break;
      }
      table[j + 1] = s;
    }
    return table;
  };
  for (const pattern of ['A', 'AB', 'ABAB', 'AABA', 'GCAGAGAG', 'AAAATA', 'ABCABD', 'ABABABC', 'AAAA', 'JUMPS']) {
    assert.deepEqual(buildGoodSuffixTable(pattern), bruteGoodSuffix(pattern), pattern);
  }
});

test('edge cases degrade gracefully instead of throwing', () => {
  assert.equal(validateInput('', 'AB').ok, false);
  assert.equal(validateInput('AB', '').ok, false);
  assert.equal(validateInput('AB', 'ABC').ok, false);
  assert.equal(validateInput('A'.repeat(200), 'A').ok, false);
  const empty = buildRun('', '');
  assert.equal(empty.valid, false);
  assert.equal(empty.totalSteps, 0);
  assert.deepEqual(boyerMooreSteps('ABC', '').matches, []);
  assert.deepEqual(boyerMooreSteps('', 'ABC').matches, []);
  assert.deepEqual(boyerMooreSteps('AB', 'ABC').matches, []);
  assert.deepEqual(boyerMooreSteps('AAAA', 'A').matches, [0, 1, 2, 3]);
  assert.deepEqual(boyerMooreSteps('AAAA', 'AAAA').matches, [0]);
  assert.deepEqual(boyerMooreSteps('a b a', ' ').matches, [1, 3]);
});

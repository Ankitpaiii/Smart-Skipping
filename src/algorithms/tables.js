/**
 * Preprocessing tables for Boyer-Moore.
 * Pure functions, zero dependencies, no DOM. Safe to unit test in Node.
 */

/**
 * Bad Character Heuristic table.
 * Maps every character of the pattern to its LAST index inside the pattern.
 * Characters that never appear are simply absent (treated as -1).
 * @param {string} pattern
 * @returns {Map<string, number>}
 */
export function buildLastOccurrence(pattern) {
  const last = new Map();
  for (let i = 0; i < pattern.length; i += 1) last.set(pattern[i], i);
  return last;
}

/**
 * How far can we slide when text char `c` mismatched the pattern at index `j`?
 * Align `c` with its last occurrence in the pattern, never shifting backwards.
 * @param {Map<string, number>} last
 * @param {string} c mismatched character from the TEXT
 * @param {number} j index in the pattern where the mismatch happened
 */
export function badCharacterShift(last, c, j) {
  const occurrence = last.has(c) ? last.get(c) : -1;
  return Math.max(1, j - occurrence);
}

/**
 * Good Suffix Heuristic table (strong good suffix rule).
 * `shift[j + 1]` is the jump after a mismatch at pattern index `j`.
 * `shift[0]` is the jump after a complete match.
 * @param {string} pattern
 * @returns {number[]}
 */
export function buildGoodSuffixTable(pattern) {
  const m = pattern.length;
  const shift = new Array(m + 1).fill(0);
  const border = new Array(m + 1).fill(0);

  // Case 1: the matched suffix occurs again elsewhere in the pattern.
  let i = m;
  let j = m + 1;
  border[i] = j;
  while (i > 0) {
    while (j <= m && pattern[i - 1] !== pattern[j - 1]) {
      if (shift[j] === 0) shift[j] = j - i;
      j = border[j];
    }
    i -= 1;
    j -= 1;
    border[i] = j;
  }

  // Case 2: only a prefix of the pattern matches a suffix of the match.
  j = border[0];
  for (i = 0; i <= m; i += 1) {
    if (shift[i] === 0) shift[i] = j;
    if (i === j) j = border[j];
  }

  return shift;
}

/**
 * Human-readable reason for a good-suffix jump, used by the narration engine.
 * @param {string} pattern
 * @param {number} j mismatch index in the pattern (-1 means "full match")
 * @param {number} amount the shift the table produced
 */
export function describeGoodSuffix(pattern, j, amount) {
  const m = pattern.length;
  if (j < 0) return 'the whole pattern matched, so we slide it along to hunt for the next one';
  if (j === m - 1) return 'nothing matched yet, so the suffix rule has no opinion';
  const suffix = pattern.slice(j + 1);
  if (amount >= m) return 'the matched suffix "' + suffix + '" never repeats inside the pattern, so we clear it entirely';
  return 'the matched suffix "' + suffix + '" turns up again ' + amount + (amount === 1 ? ' step' : ' steps') + ' along';
}

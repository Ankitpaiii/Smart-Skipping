/**
 * Curated demo inputs. Each one is chosen to make a specific behaviour obvious
 * on screen, and each is honest: the numbers come from the engine, not copy.
 */
export const PRESETS = [
  {
    id: 'balanced',
    name: 'Warm-up',
    text: 'ABAAABCDABABCABAB',
    pattern: 'ABAB',
    note: 'Both rules take turns. Two occurrences, a few ties.',
  },
  {
    id: 'bad-char',
    name: 'Bad character shines',
    text: 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG',
    pattern: 'JUMPS',
    note: 'Most letters in the text are nowhere in the pattern, so the pattern leapfrogs whole words.',
  },
  {
    id: 'good-suffix',
    name: 'Good suffix takes over',
    text: 'TAATAAAAAATATTTAAAAAAA',
    pattern: 'AAAATA',
    note: 'A two-letter alphabet cripples the bad character rule. The suffix rule carries every single jump.',
  },
  {
    id: 'no-match',
    name: 'Nothing to find',
    text: 'NEEDLE IN A HAYSTACK OF WORDS',
    pattern: 'ZEBRA',
    note: 'Proving absence is where skipping is most brutal: five comparisons instead of twenty-five.',
  },
  {
    id: 'worst-case',
    name: 'Worst case (honest)',
    text: 'AAAAAAAAAAAAAAAA',
    pattern: 'AAAA',
    note: 'Every alignment matches almost fully, so Boyer-Moore has nothing to skip. It ties brute force.',
  },
];

export const DEFAULT_PRESET = PRESETS[0];

export const LIMITS = { text: 64, pattern: 16 };

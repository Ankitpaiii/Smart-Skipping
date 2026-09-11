# Smart Skipping

An interactive visualizer for the **Boyer-Moore string matching algorithm**, racing it against
**naive (brute force) search** on the same input, so you can watch exactly where the skipping comes from.

Built for **CSE533 · Design and Analysis of Algorithms — CIA 3, Component 1**.

---

## Run it in 60 seconds

```bash
npm install     # needs an internet connection once
npm run dev     # opens http://localhost:5173
```

```bash
npm test        # 6 suites, ~25,000 randomized cases, zero dependencies
npm run build   # static bundle in dist/, deploy the folder anywhere
```

### No Node on the demo machine?

Open **`standalone/smart-skipping.html`** by double clicking it. That is the whole app prebuilt into a
single file: same code, no install, no server, no build step. Keep it on a USB stick as your demo
parachute. (It pulls fonts from Google Fonts; offline it falls back to system serif/sans/mono and still
works perfectly.)

---

## What is on the page

| Section | What it does |
| --- | --- |
| Hero | Kinetic headline, drifting character blocks, and a live looping teaser of a real Boyer-Moore run |
| The problem | Brute force on loop with a live comparison counter climbing to 30 while Boyer-Moore needs 16 |
| Try it yourself | The simulator: any text, any pattern, play / pause / step / scrub / tempo, live narration, live stats, both precomputed tables |
| This isn't just theory | Find-and-replace, plagiarism detection, antivirus signatures, genome search |
| The payoff | Complexity table plus bars driven by whatever you just ran in the simulator |
| Footer | Names, course code, replay controls |

---

## Architecture

```
src/
├── algorithms/          ← pure JS, no React, no DOM, unit tested
│   ├── tables.js         bad character + strong good suffix preprocessing
│   ├── boyerMoore.js     the step generator (the important file)
│   ├── naive.js          brute force, same step shape
│   ├── presets.js        five curated demo inputs
│   └── index.js          validation + buildRun()
├── hooks/
│   ├── useSimulation.js  playback clock, keyboard-friendly API, autoplay loops
│   ├── useCellSize.js    tiles resize to fit any text length
│   ├── useInView.js      scroll reveals
│   └── useReducedMotion.js
├── components/          ← UI only, no algorithm logic anywhere
└── tests/               ← node --test, cross-validated against brute force
```

### The one design decision that matters

The algorithm **never runs while anything is animating.** The moment the text or pattern changes,
`buildRun()` expands the entire search into a flat array of immutable step snapshots:

```js
{ kind: 'shift', align: 4, compare: null, matched: [...], found: [...],
  comparisons: 7, shift: { by: 4, badChar: 4, goodSuffix: 1, winner: 'bad-char' },
  narration: '"C" is nowhere in the pattern, so ...' }
```

Playback is then nothing but an index walking that array. Consequences:

- **Step back is exactly as correct as step forward.** Every frame is a full snapshot, so there is no
  state to rewind and nothing to desynchronize.
- **The tempo slider only changes a timeout.** It cannot change results.
- **Nothing can break mid-demo.** If the input is invalid, the array is empty and the UI says so in
  plain English. There is no code path where an evaluator's weird input throws during an animation.
- Both algorithms are driven by **one shared cursor**, which is why the race is honest: when the
  Boyer-Moore row goes quiet and brute force is still grinding, that gap is real.

### Correctness

`npm test` cross-checks both engines against a reference matcher over ~25,000 randomized text/pattern
pairs across five alphabets, verifies the good suffix table against a brute-force implementation of its
own definition, and asserts the invariants the UI depends on: comparison counters never decrease, the
pattern never moves backwards or off the end of the text, every shift equals
`max(badCharacter, goodSuffix)`, and every step carries narration.

### Edge cases handled

Empty text, empty pattern, pattern longer than text, pattern of length 1, pattern with all repeated
characters, no match anywhere, matches at the very start and very end, spaces (rendered as `·`),
over-length input, and rapid input changes mid-playback. All produce friendly inline messages, never a
console error.

---

## Design system

Light theme only, warm and editorial, deliberately not the default SaaS gradient look.

| Token | Value | Used for |
| --- | --- | --- |
| `--cream` | `#FAF7F2` | Page background |
| `--paper` | `#FFFDFA` | Raised surfaces, tiles |
| `--ink` | `#1C1B19` | Primary text |
| `--terracotta` | `#E8593D` | CTAs, active comparison, accents |
| `--teal` | `#1F6F5C` | Matches, Boyer-Moore stats |
| `--gold` | `#D9A441` | Shift arrows and labels |
| `--coral` | `#D64550` | Mismatches, brute force stats |
| `--sand` / `--line` | `#EFE9E1` / `#E4DCD0` | Warm fills and hairlines |

Type: **Fraunces** (display), **Inter** (UI), **JetBrains Mono** (every string character).
Every colour and font lives once in `src/index.css` as a custom property and is surfaced to Tailwind in
`tailwind.config.js`. No component hardcodes a hex value.

Motion: only `transform` and `opacity` are ever animated, on exponential ease-out curves, so the
pattern glide holds 60fps with no layout thrash. `prefers-reduced-motion` keeps the fades and drops the
movement. A print stylesheet freezes every reveal so PDF exports never catch a half-faded frame.

---

## Recording a clean demo video

1. Set the browser to **1440×900** or full screen on the projector. Zoom at 100%.
2. Hide bookmarks and notifications. Use a fresh window with one tab.
3. Load the page and let the hero animation finish before you start recording.
4. Suggested 90 second run:
   - **Hero** → read the headline, click *Start the simulation*.
   - **Warm-up preset**, tempo *Normal*, hit **Play**. Let it find both matches.
   - Hit **Step back** twice on a shift step and talk through the *shift arithmetic* panel:
     bad character says X, good suffix says Y, we take the larger.
   - Switch to **Bad character shines** and tick **Race brute force**. Tempo *Fast*.
     Point out Boyer-Moore finishing while brute force is still in the first third of the sentence.
   - Switch to **Good suffix takes over** to show the rule that usually loses doing all the work.
   - Switch to **Worst case (honest)** and say out loud that both algorithms tie here. Evaluators
     like being told the limitation before they find it.
   - Type something of your own to prove nothing is hardcoded, then scroll to **The payoff**.
5. Keyboard while recording: `space` play/pause, `←` `→` step, `R` reset. No mouse jitter on camera.

---

## Choices I made, and why

The brief suggested a few libraries. Everything asked for is implemented; some of it is implemented
without the dependency, on purpose:

- **Framer Motion / GSAP → CSS transforms and IntersectionObserver.** Every required animation is here
  (staggered hero letters, scroll reveals, spring-ish tile pulses, gliding pattern row, fading shift
  labels). Hand-rolled CSS keeps the bundle at ~150KB total, animates only compositor-friendly
  properties, and removes two libraries that could fail to install the night before a submission.
- **Recharts → a hand-built SVG/CSS bar.** The live comparison chart is two bars. Recharts would have
  added ~500KB and a generic default look for that.
- **Lenis smooth scroll → native `scroll-behavior`.** Lenis hijacks the scroll thread, which fights
  sticky panels and reduced-motion preferences. Native smooth scroll is one line and respects both.
- **Spline / Three.js hero → typographic drift field.** A 3D scene is megabytes of load time for
  decoration. Drifting character tiles say "this page is about strings" and cost nothing.
- **Added: precomputed tables panel.** Both heuristic tables are on screen and highlight the entry
  being used, so the maths is auditable live rather than asserted.
- **Added: a scrubber, a tempo control with four stops, keyboard shortcuts, and a fifth preset that
  shows the worst case** where Boyer-Moore ties brute force.

## Before you submit

- Put your names in `TEAM` at the top of `src/components/Footer.jsx`.
- Run `npm test` once so you can say the engine is verified.
- Deploy: `npm run build`, then drop `dist/` on Vercel or Netlify for a live link.

Boyer, R. S. and Moore, J. S. *A Fast String Searching Algorithm*, CACM 20(10), 1977.

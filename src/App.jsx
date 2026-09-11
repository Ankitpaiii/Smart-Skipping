import React, { useCallback, useState } from 'react';
import TopBar from './components/TopBar.jsx';
import Hero from './components/Hero.jsx';
import Problem from './components/Problem.jsx';
import Simulator from './components/Simulator.jsx';
import RealWorld from './components/RealWorld.jsx';
import Complexity from './components/Complexity.jsx';
import Footer from './components/Footer.jsx';
import Reveal from './components/Reveal.jsx';
import { Eyebrow } from './components/ui.jsx';
import { DEFAULT_PRESET } from './algorithms/index.js';

export default function App() {
  const [text, setText] = useState(DEFAULT_PRESET.text);
  const [pattern, setPattern] = useState(DEFAULT_PRESET.pattern);
  const [showNaive, setShowNaive] = useState(false);
  const [run, setRun] = useState(null);

  // Complexity section reads the live run so its bars match what was just demoed.
  const handleRun = useCallback((value) => setRun(value), []);

  return (
    <>
      <div className="grain" />
      <TopBar />

      <main>
        <Hero />
        <Problem />

        <section id="simulator" className="scroll-mt-20 py-section">
          <div className="mx-auto max-w-shell px-6">
            <Reveal className="max-w-prose">
              <Eyebrow tone="terracotta">Try it yourself</Eyebrow>
              <h2 className="mt-5 font-display text-h2 font-semibold">
                The pattern moves. You decide how fast.
              </h2>
              <p className="mt-5 text-body text-ink-soft">
                Type any text and any pattern. The entire run is computed before the first frame draws, so stepping
                backwards is just as accurate as playing forwards, and nothing can break mid-demo.
              </p>
            </Reveal>

            <Reveal i={1} className="mt-12">
              <Simulator
                text={text}
                pattern={pattern}
                setText={setText}
                setPattern={setPattern}
                showNaive={showNaive}
                setShowNaive={setShowNaive}
                onRun={handleRun}
              />
            </Reveal>
          </div>
        </section>

        <RealWorld />
        <Complexity run={run} />
      </main>

      <Footer />
    </>
  );
}

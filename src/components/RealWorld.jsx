import React from 'react';
import Reveal from './Reveal.jsx';
import { Eyebrow } from './ui.jsx';

const USES = [
  {
    glyph: 'Ctrl F',
    title: 'Find and replace',
    body: 'Every editor, IDE and browser search box. On a 200,000 line file the difference between skipping and grinding is the difference between instant and irritating.',
  },
  {
    glyph: '%',
    title: 'Plagiarism detection',
    body: 'Millions of candidate phrases checked against millions of documents. Skipping is what keeps the bill finite.',
  },
  {
    glyph: '4D 5A',
    title: 'Antivirus scanning',
    body: 'Malware signatures are exact byte patterns hunted through entire binaries, and scanning cannot slow the machine down.',
  },
  {
    glyph: 'ACGT',
    title: 'Genome search',
    body: 'A four letter alphabet and billions of bases. This is exactly where the good suffix rule earns its keep.',
  },
];

export default function RealWorld() {
  return (
    <section id="real-world" className="scroll-mt-24 py-section">
      <div className="mx-auto max-w-shell px-6">
        <Reveal className="max-w-prose">
          <Eyebrow>Where it lands</Eyebrow>
          <h2 className="mt-5 font-display text-h2 font-semibold">This isn&rsquo;t just theory.</h2>
          <p className="mt-5 text-body text-ink-soft">
            Boyer-Moore and its descendants sit under tools you have already used today.
          </p>
        </Reveal>

        <div className="mt-14">
          {USES.map((use, i) => (
            <Reveal
              key={use.title}
              i={i}
              className="group grid gap-4 border-t border-line py-8 sm:grid-cols-[4rem_10rem_1fr] sm:items-baseline sm:gap-8"
            >
              <span className="num font-mono text-caption text-muted">0{i + 1}</span>
              <span className="inline-flex w-fit items-center rounded-lg border border-line-strong bg-sand px-2.5 py-1.5 font-mono text-caption tracking-tight text-ink transition-transform duration-300 ease-expo group-hover:-translate-y-0.5">
                {use.glyph}
              </span>
              <div>
                <h3 className="font-display text-h3 font-semibold">{use.title}</h3>
                <p className="mt-2 max-w-prose text-body text-ink-soft">{use.body}</p>
              </div>
            </Reveal>
          ))}
          <div className="border-t border-line" />
        </div>
      </div>
    </section>
  );
}

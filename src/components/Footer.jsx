import React from 'react';
import { Button, Eyebrow } from './ui.jsx';
import { scrollToSection } from '../lib/scroll.js';

/* ---- Edit these two lines with your details before the demo ---- */
const TEAM = ['Ankit', 'Dean', 'Evan', 'Joshua', 'Shrayana'];
const COURSE = { code: 'CSE533', title: 'Design and Analysis of Algorithms', component: 'CIA 3 · Component 1' };

export default function Footer() {
  return (
    <footer className="py-section">
      <div className="mx-auto max-w-shell px-6">
        <div className="grid gap-10 sm:grid-cols-2 sm:items-end">
          <div>
            <Eyebrow>Submitted by</Eyebrow>
            <p className="mt-3 font-display text-h3 font-semibold">{TEAM.join(' · ')}</p>
            <p className="mt-2 text-caption text-muted">
              {COURSE.code} · {COURSE.title}
            </p>
            <p className="text-caption text-muted">{COURSE.component}</p>
          </div>

          <div className="flex flex-wrap gap-3 sm:justify-end">
            <Button variant="secondary" size="sm" onClick={() => scrollToSection('simulator')}>
              Back to simulator
            </Button>
            <Button variant="quiet" size="sm" onClick={() => scrollToSection('hero')}>
              Replay hero animation
            </Button>
          </div>
        </div>

        <p className="mt-12 border-t border-line pt-6 text-caption text-muted">
          Boyer-Moore, R. S. Boyer and J. S. Moore, 1977. Every number on this page is computed live in the browser from
          the input you provide, including the brute force baseline.
        </p>
      </div>
    </footer>
  );
}

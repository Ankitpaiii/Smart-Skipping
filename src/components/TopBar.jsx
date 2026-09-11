import React, { useEffect, useState } from 'react';
import { Button } from './ui.jsx';
import { scrollToSection } from '../lib/scroll.js';

const LINKS = [
  { id: 'problem', label: 'The problem' },
  { id: 'simulator', label: 'Simulator' },
  { id: 'real-world', label: 'In the wild' },
  { id: 'complexity', label: 'Takeaways' },
];

export default function TopBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 260);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b bg-cream transition-[transform,opacity,border-color] duration-500 ease-expo ${
        visible ? 'translate-y-0 border-line opacity-100' : '-translate-y-full border-transparent opacity-0'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-shell items-center gap-6 px-6">
        <button
          type="button"
          onClick={() => scrollToSection('hero')}
          className="font-display text-[1.0625rem] font-semibold tracking-tight"
        >
          Smart Skipping
        </button>

        <nav className="ml-auto hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => scrollToSection(link.id)}
              className="text-caption text-ink-soft transition-colors duration-200 hover:text-terracotta"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <Button size="sm" className="ml-auto md:ml-0" onClick={() => scrollToSection('simulator')}>
          Run it
        </Button>
      </div>
    </header>
  );
}

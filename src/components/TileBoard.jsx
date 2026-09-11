import React, { useEffect, useMemo, useRef } from 'react';
import { useCellSize } from '../hooks/useCellSize.js';
import { useReducedMotion } from '../hooks/useReducedMotion.js';

const GAP = 6;

/** Which visual state does text index `i` deserve on this frame? */
function textTileState(i, frame, matchedSet, foundSet) {
  if (!frame) return 'idle';
  if (frame.compare && frame.compare.text === i) {
    return frame.kind === 'mismatch' ? 'miss' : 'match';
  }
  if (matchedSet.has(i)) return 'match';
  if (foundSet.has(i)) return 'found';
  return 'idle';
}

const STATE_CLASS = {
  idle: '',
  dim: 'tile-dim',
  match: 'tile-match',
  miss: 'tile-miss',
  found: 'tile-found',
};

/**
 * The visualization canvas: a row of TEXT tiles with the PATTERN sliding
 * underneath. Every position is derived from the current frame, so scrubbing
 * backwards is exactly as correct as playing forwards.
 */
export default function TileBoard({
  text,
  pattern,
  frame,
  tone = 'bm',
  title,
  subtitle,
  badge,
  maxCell = 52,
  showIndices = true,
  showShift = true,
}) {
  const [wrapRef, cell] = useCellSize(text.length, { max: maxCell, gap: GAP });
  const reducedMotion = useReducedMotion();
  const step = cell + GAP;
  const scrollRef = useRef(null);

  const align = frame ? frame.align : 0;
  const matchedSet = useMemo(() => new Set(frame ? frame.matched : []), [frame]);
  const foundSet = useMemo(() => {
    const set = new Set();
    (frame ? frame.found : []).forEach((start) => {
      for (let k = 0; k < pattern.length; k += 1) set.add(start + k);
    });
    return set;
  }, [frame, pattern.length]);

  const windowStart = align;
  const windowEnd = align + pattern.length - 1;
  const shift = showShift && frame && frame.kind === 'shift' ? frame.shift : null;

  // Keep the action on screen when the text is too long to fit at minimum size.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    const target = align * step - el.clientWidth / 2 + (pattern.length * step) / 2;
    el.scrollTo({ left: Math.max(0, target), behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [align, step, pattern.length, reducedMotion]);

  const rowWidth = Math.max(text.length * step - GAP, 0);
  const fontSize = Math.max(11, Math.round(cell * 0.42));
  const isNaive = tone === 'naive';

  return (
    <div>
      {(title || badge) && (
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2.5">
            <h4 className="font-display text-[1.0625rem] font-semibold tracking-tight">{title}</h4>
            {subtitle && <span className="text-caption text-muted">{subtitle}</span>}
          </div>
          {badge}
        </div>
      )}

      <div ref={wrapRef} className="min-w-0">
        <div ref={scrollRef} className="board-scroll pb-1">
          <div className="relative" style={{ width: rowWidth }}>
            {showIndices && (
              <div className="relative mb-1.5" style={{ height: 14 }}>
                {Array.from(text, (_, i) => {
                  const isActive = frame && frame.compare && frame.compare.text === i;
                  const visible = cell >= 30 || i % 5 === 0 || isActive;
                  if (!visible) return null;
                  return (
                    <span
                      key={i}
                      className={`num absolute top-0 text-center text-[0.625rem] tabular-nums ${
                        isActive ? 'font-semibold text-terracotta' : 'text-muted'
                      }`}
                      style={{ left: i * step, width: cell }}
                    >
                      {i}
                    </span>
                  );
                })}
              </div>
            )}

            {/* TEXT */}
            <div className="relative" style={{ height: cell }}>
              {Array.from(text, (char, i) => {
                const state = textTileState(i, frame, matchedSet, foundSet);
                const inWindow = i >= windowStart && i <= windowEnd;
                const isCompare = frame && frame.compare && frame.compare.text === i;
                return (
                  <div
                    key={i}
                    className={`tile absolute top-0 ${STATE_CLASS[state]} ${
                      !inWindow && state === 'idle' ? 'tile-dim' : ''
                    } ${isCompare ? 'tile-focus hit' : ''}`}
                    style={{ left: i * step, width: cell, height: cell, fontSize }}
                  >
                    {char === ' ' ? <span className="text-muted">·</span> : char}
                  </div>
                );
              })}
            </div>

            {/* PATTERN */}
            <div className="relative mt-2" style={{ height: cell }}>
              <div
                className="pattern-track absolute top-0 left-0"
                style={{ transform: `translate3d(${align * step}px, 0, 0)` }}
              >
                {Array.from(pattern, (char, j) => {
                  const textIndex = align + j;
                  const isCompare = frame && frame.compare && frame.compare.pattern === j;
                  let state = 'idle';
                  if (isCompare) state = frame.kind === 'mismatch' ? 'miss' : 'match';
                  else if (matchedSet.has(textIndex)) state = 'match';
                  return (
                    <div
                      key={j}
                      className={`tile absolute top-0 ${
                        state === 'idle' ? (isNaive ? 'tile-pattern-alt' : 'tile-pattern') : STATE_CLASS[state]
                      } ${isCompare ? 'tile-focus hit' : ''}`}
                      style={{ left: j * step, width: cell, height: cell, fontSize }}
                    >
                      {char === ' ' ? <span className="text-muted">·</span> : char}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SHIFT EXPLANATION */}
            {showShift && (
            <div className="relative mt-2" style={{ height: 34 }}>
              {shift && (
                <div
                  key={frame.index}
                  className="pop absolute top-0 flex items-center gap-2"
                  style={{ left: shift.from * step }}
                >
                  <svg
                    width={Math.max(shift.by * step - GAP, 26)}
                    height="14"
                    viewBox={`0 0 ${Math.max(shift.by * step - GAP, 26)} 14`}
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d={`M1 7H${Math.max(shift.by * step - GAP - 8, 16)}`}
                      stroke="var(--gold)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="4 4"
                    />
                    <path
                      d={`M${Math.max(shift.by * step - GAP - 12, 12)} 2l6 5-6 5`}
                      stroke="var(--gold)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="whitespace-nowrap rounded-lg border border-gold bg-gold-tint px-2 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-ink">
                    {shift.label}
                  </span>
                </div>
              )}
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

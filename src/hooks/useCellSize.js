import { useEffect, useRef, useState } from 'react';

/**
 * Tiles size themselves to the available width, so a 17 character demo and a
 * 43 character sentence both stay on screen without a horizontal scrollbar.
 */
export function useCellSize(count, { min = 20, max = 52, gap = 6 } = {}) {
  const ref = useRef(null);
  const [cell, setCell] = useState(max);

  useEffect(() => {
    const el = ref.current;
    if (!el || !count) return undefined;

    const measure = () => {
      const width = el.clientWidth;
      if (!width) return;
      const raw = Math.floor((width - gap * (count - 1)) / count);
      setCell(Math.max(min, Math.min(max, raw)));
    };

    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [count, min, max, gap]);

  return [ref, cell];
}

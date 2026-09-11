/**
 * Section navigation. `scroll-margin-top` on each section handles the sticky
 * header offset, and the browser's own smooth scrolling handles the easing,
 * which stays perfectly in step with prefers-reduced-motion.
 */
export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
}

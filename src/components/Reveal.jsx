import React from 'react';
import { useInView } from '../hooks/useInView.js';

/** Fade and lift into place on first scroll-in. Stagger with the `i` prop. */
export default function Reveal({ as: Tag = 'div', i = 0, className = '', children, ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag ref={ref} style={{ '--i': i }} className={`reveal ${inView ? 'is-in' : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

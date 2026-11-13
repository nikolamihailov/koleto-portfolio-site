import { m } from 'framer-motion';
import type { ReactNode } from 'react';
import { jsAnimated } from '../utils/motion';

export default function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.main
      {...jsAnimated}
      id="main"
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.main>
  );
}

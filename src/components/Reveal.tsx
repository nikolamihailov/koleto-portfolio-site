import { motion, type Variants } from 'framer-motion';
import { createContext, useContext, type ReactNode } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { jsAnimated } from '../utils/motion';

const EASE = [0.22, 1, 0.36, 1] as const;

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'li' | 'article' | 'header' | 'nav';
  'aria-label'?: string;
}

/** Fades + slides content in once it scrolls into view. */
export function Reveal({ children, className, delay = 0, as = 'div', 'aria-label': ariaLabel }: RevealProps) {
  const Tag = motion[as];
  return (
    <Tag
      {...jsAnimated}
      className={className}
      aria-label={ariaLabel}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: revealItem.hidden,
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay } },
      }}
    >
      {children}
    </Tag>
  );
}

// Trigger on a fixed offset, not a ratio: `amount` is relative to the element's
// height, and a tall stacked grid on mobile would need hundreds of px on screen
// before revealing, leaving an apparently empty section.
const VIEWPORT = { once: true, amount: 'some', margin: '0px 0px -80px 0px' } as const;

/** Below this width grids stack into one column, so items reveal one by one. */
const STACKED_QUERY = '(max-width: 767px)';

const IndividualReveal = createContext(false);

/**
 * Props for a direct child of `RevealGroup`. On wide screens the group staggers
 * its children; when the grid is stacked each child reveals as it scrolls in.
 */
export function useRevealItem() {
  const individual = useContext(IndividualReveal);
  return individual
    ? ({ variants: revealItem, initial: 'hidden', whileInView: 'show', viewport: VIEWPORT } as const)
    : ({ variants: revealItem } as const);
}

/** Staggers its `revealItem` children as the group scrolls into view. */
export function RevealGroup({
  children,
  className,
  stagger = 0.1,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: 'div' | 'ul';
}) {
  const Tag = motion[as];
  const individual = useMediaQuery(STACKED_QUERY);

  if (individual) {
    const Plain = as;
    return (
      <IndividualReveal.Provider value>
        <Plain className={className}>{children}</Plain>
      </IndividualReveal.Provider>
    );
  }

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Tag>
  );
}

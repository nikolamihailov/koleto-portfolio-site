import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiArrowUpRight, FiMenu, FiX } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import { profile } from '../data/profile';
import { useActiveSection } from '../hooks/useActiveSection';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { jsAnimated } from '../utils/motion';

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
];
const IDS = LINKS.map((l) => l.id);

const EASE = [0.22, 1, 0.36, 1] as const;
const panel: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25, when: 'beforeChildren', staggerChildren: 0.06 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};
const panelItem: Variants = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } },
};

export default function Navbar() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const active = useActiveSection(IDS, isHome);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on navigation and lock body scroll while it is open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    // Close if the viewport grows to desktop width while the menu is open
    const mq = window.matchMedia('(min-width: 768px)');
    const onMq = () => mq.matches && setOpen(false);
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => {
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, [open]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const links = LINKS.map(({ id, label }) => (
    <li key={id}>
      <Link
        to={{ pathname: '/', hash: `#${id}` }}
        className={`nav__link ${active === id ? 'is-active' : ''}`}
        onClick={() => setOpen(false)}
      >
        {label}
        {active === id && <motion.span layoutId="nav-underline" className="nav__underline" />}
      </Link>
    </li>
  ));

  return (
    <header className={`nav ${open ? 'nav--open' : scrolled ? 'nav--scrolled' : ''}`}>
      <nav className="nav__inner" aria-label="Main">
        <Logo />
        <ul className="nav__links">{links}</ul>
        <div className="nav__actions">
          <ThemeToggle />
          <button
            type="button"
            className="nav__burger"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="nav__mobile"
            {...jsAnimated}
            variants={panel}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <ul className="nav__mobile-links">
              {LINKS.map(({ id, label }, i) => (
                <motion.li key={id} {...jsAnimated} variants={panelItem}>
                  <Link
                    to={{ pathname: '/', hash: `#${id}` }}
                    className={`nav__mobile-link ${active === id ? 'is-active' : ''}`}
                    onClick={() => setOpen(false)}
                  >
                    <span className="nav__mobile-index">0{i + 1}</span>
                    {label}
                  </Link>
                </motion.li>
              ))}
            </ul>

            <motion.div className="nav__mobile-footer" {...jsAnimated} variants={panelItem}>
              <a href={`mailto:${profile.email}`} className="btn btn--primary">
                Get in touch <FiArrowUpRight aria-hidden="true" />
              </a>
              <ul className="nav__mobile-socials">
                {profile.socials.map(({ label, url, icon: Icon }) => (
                  <li key={label}>
                    <a href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className="icon-btn">
                      <Icon />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

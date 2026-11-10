import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import { useActiveSection } from '../hooks/useActiveSection';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
];
const IDS = LINKS.map((l) => l.id);

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
    <header className={`nav ${scrolled || open ? 'nav--scrolled' : ''}`}>
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
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            className="nav__mobile"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {links}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}

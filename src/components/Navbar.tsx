import { AnimatePresence, m, type Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FiArrowUpRight, FiMenu, FiX } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import { useActiveSection } from '../hooks/useActiveSection';
import { useI18n } from '../i18n/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { jsAnimated } from '../utils/motion';

// Section ids double as their translation keys (nav.about, nav.projects, …)
const IDS = ['about', 'projects', 'skills', 'experience'] as const;
const ACTIVE_IDS = [...IDS];

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
  const active = useActiveSection(ACTIVE_IDS, isHome);
  const { t, content } = useI18n();
  const { profile } = content;
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

  const links = IDS.map((id) => (
    <li key={id}>
      <Link
        to={{ pathname: '/', hash: `#${id}` }}
        className={`nav__link ${active === id ? 'is-active' : ''}`}
        onClick={() => setOpen(false)}
      >
        {t(`nav.${id}`)}
        {active === id && <m.span layoutId="nav-underline" className="nav__underline" />}
      </Link>
    </li>
  ));

  return (
    <header className={`nav ${open ? 'nav--open' : scrolled ? 'nav--scrolled' : ''}`}>
      <nav className="nav__inner" aria-label={t('nav.label')}>
        <Logo />
        <ul className="nav__links">{links}</ul>
        <div className="nav__actions">
          <LanguageSwitcher className="lang-switch--nav" />
          <ThemeToggle />
          <button
            type="button"
            className="nav__burger"
            aria-label={t(open ? 'nav.closeMenu' : 'nav.openMenu')}
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
          <m.div
            id="mobile-menu"
            className="nav__mobile"
            {...jsAnimated}
            variants={panel}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <ul className="nav__mobile-links">
              {IDS.map((id, i) => (
                <m.li key={id} {...jsAnimated} variants={panelItem}>
                  <Link
                    to={{ pathname: '/', hash: `#${id}` }}
                    className={`nav__mobile-link ${active === id ? 'is-active' : ''}`}
                    onClick={() => setOpen(false)}
                  >
                    <span className="nav__mobile-index">0{i + 1}</span>
                    {t(`nav.${id}`)}
                  </Link>
                </m.li>
              ))}
            </ul>

            <m.div className="nav__mobile-lang" {...jsAnimated} variants={panelItem}>
              <span className="nav__mobile-lang-label" aria-hidden="true">
                {t('language.label')}
              </span>
              <LanguageSwitcher />
            </m.div>

            <m.div className="nav__mobile-footer" {...jsAnimated} variants={panelItem}>
              <a href={`mailto:${profile.email}`} className="btn btn--primary">
                {t('common.getInTouch')} <FiArrowUpRight aria-hidden="true" />
              </a>
              <ul className="nav__mobile-socials">
                {profile.socials.map(({ id, url, icon: Icon }) => (
                  <li key={id}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t(`socials.${id}`)}
                      className="icon-btn"
                    >
                      <Icon />
                    </a>
                  </li>
                ))}
              </ul>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}

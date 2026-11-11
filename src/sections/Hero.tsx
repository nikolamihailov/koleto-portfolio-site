import { motion, type Variants } from 'framer-motion';
import { lazy, Suspense, useEffect, useState } from 'react';
import { FiArrowDown, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { loadHeroScene } from '../components/loadHeroScene';
import { useI18n } from '../i18n/LanguageContext';
import { rich } from '../i18n/rich';
import { jsAnimated } from '../utils/motion';

const HeroScene = lazy(loadHeroScene);

const EASE = [0.22, 1, 0.36, 1] as const;
const group: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } } };
// opacity + transform only (no blur filter, which is expensive to animate)
const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

type IdleWindow = Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number };

/**
 * Mount the three.js scene only once the browser is idle after the hero text has
 * rendered, so downloading/parsing ~220 kB of three.js never delays first paint or LCP.
 */
function useIdleMount() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const w = window as IdleWindow;
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setReady(true), { timeout: 1200 });
      return () => window.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(() => setReady(true), 300);
    return () => window.clearTimeout(t);
  }, []);
  return ready;
}

export default function Hero() {
  const showScene = useIdleMount();
  const { t, content } = useI18n();
  const { profile } = content;
  return (
    <section className="hero" id="home">
      {showScene && (
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      )}

      <motion.div className="hero__content" variants={group} initial="hidden" animate="show">
        <motion.p {...jsAnimated} variants={item} className="hero__eyebrow">
          <span className="hero__pulse" aria-hidden="true" /> {t('hero.available')}
        </motion.p>
        <motion.h1 {...jsAnimated} variants={item} className="hero__title">
          {rich(t('hero.greeting', { name: profile.shortName }), {
            name: (s) => <span className="hero__name">{s}</span>,
          })}
          <br />
          {profile.role}.
        </motion.h1>
        <motion.p {...jsAnimated} variants={item} className="hero__tagline">
          {profile.tagline}
        </motion.p>
        <motion.div {...jsAnimated} variants={item} className="hero__actions">
          <Link to={{ pathname: '/', hash: '#projects' }} className="btn btn--primary btn--lg">
            {t('hero.viewProjects')} <FiArrowRight aria-hidden="true" />
          </Link>
          <a href={`mailto:${profile.email}`} className="btn btn--ghost btn--lg">
            {t('hero.contact')}
          </a>
        </motion.div>
        <motion.ul {...jsAnimated} variants={item} className="hero__socials">
          {profile.socials.map(({ id, url, icon: Icon }) => (
            <li key={id}>
              <a href={url} target="_blank" rel="noopener noreferrer" aria-label={t(`socials.${id}`)} className="icon-btn">
                <Icon />
              </a>
            </li>
          ))}
        </motion.ul>
      </motion.div>

      <motion.a
        href="#about"
        {...jsAnimated}
        className="hero__scroll"
        aria-label={t('hero.scrollToAbout')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <FiArrowDown />
      </motion.a>
    </section>
  );
}

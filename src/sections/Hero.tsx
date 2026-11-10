import { motion, type Variants } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { FiArrowDown, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { loadHeroScene } from '../components/loadHeroScene';
import { profile } from '../data/profile';

const HeroScene = lazy(loadHeroScene);

const EASE = [0.22, 1, 0.36, 1] as const;
const group: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE } },
};

export default function Hero() {
  return (
    <section className="hero" id="home">
      <Suspense fallback={<div className="hero-scene" aria-hidden="true" />}>
        <HeroScene />
      </Suspense>

      <motion.div className="hero__content" variants={group} initial="hidden" animate="show">
        <motion.p variants={item} className="hero__eyebrow">
          <span className="hero__pulse" aria-hidden="true" /> Available for new opportunities
        </motion.p>
        <motion.h1 variants={item} className="hero__title">
          Hi, I&apos;m <span className="hero__name">{profile.shortName}</span>
          <br />
          {profile.role}.
        </motion.h1>
        <motion.p variants={item} className="hero__tagline">
          {profile.tagline}
        </motion.p>
        <motion.div variants={item} className="hero__actions">
          <Link to={{ pathname: '/', hash: '#projects' }} className="btn btn--primary btn--lg">
            View projects <FiArrowRight aria-hidden="true" />
          </Link>
          <a href={`mailto:${profile.email}`} className="btn btn--ghost btn--lg">
            Contact me
          </a>
        </motion.div>
        <motion.ul variants={item} className="hero__socials">
          {profile.socials.map(({ label, url, icon: Icon }) => (
            <li key={label}>
              <a href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className="icon-btn">
                <Icon />
              </a>
            </li>
          ))}
        </motion.ul>
      </motion.div>

      <motion.a
        href="#about"
        className="hero__scroll"
        aria-label="Scroll to about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <FiArrowDown />
      </motion.a>
    </section>
  );
}

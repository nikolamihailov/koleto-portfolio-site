import { AnimatePresence, LazyMotion, MotionConfig } from 'framer-motion';
import { Suspense, useEffect, useState, type ReactNode } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ParticlesBackground from './components/ParticlesBackground';
import { useI18n } from './i18n/LanguageContext';
import Home from './pages/Home';
import { NotFound, ProjectDetail } from './pages/lazyPages';

// The KOLETO intro lives in index.html (#boot) so it paints before any JS loads.
// Keep it up at least this long, measured from navigation start, so its animation
// completes; then fade it out and remove it.
const MIN_INTRO_MS = 1800;
const INTRO_FADE_MS = 700;

function dismissBootLoader() {
  const boot = document.getElementById('boot');
  if (!boot) return;
  boot.classList.add('is-done');
  window.setTimeout(() => boot.remove(), INTRO_FADE_MS);
}

// Lazy pages render an empty full-height placeholder while their chunk loads
// (usually instant, since project cards prefetch it on hover/touch).
const Lazy = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<div className="page-fallback" aria-busy="true" />}>{children}</Suspense>
);
const wait = (ms: number) => new Promise((r) => setTimeout(r, Math.max(0, ms)));

// Animation features download in parallel with the intro, which covers the page
// until well after they arrive. Components use the lightweight `m.*`; `strict`
// throws in development if a full `motion.*` component slips back in.
const loadMotionFeatures = () => import('./utils/motionFeatures').then((mod) => mod.default);

export default function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { t, lang } = useI18n();

  useEffect(() => {
    // Only wait for fonts (preloaded) — the three.js hero loads after the reveal.
    // The Cyrillic subset only downloads once Cyrillic text renders, which is after the
    // intro, so request it up front for Bulgarian to avoid a fallback-font flash.
    const cyrillic = lang === 'bg' ? document.fonts?.load('1em Inter', 'Б') : undefined;
    Promise.all([document.fonts?.ready, cyrillic, wait(MIN_INTRO_MS - performance.now())])
      .catch(() => undefined)
      .finally(() => {
        setLoading(false);
        dismissBootLoader();
      });
    // Runs once for the intro; a later language switch must not replay it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user">
        <ParticlesBackground />

        {!loading && (
          <>
            <a href="#main" className="skip-link">
              {t('common.skipToContent')}
            </a>
            <Navbar />
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route
                  path="/projects/:slug"
                  element={
                    <Lazy>
                      <ProjectDetail />
                    </Lazy>
                  }
                />
                <Route
                  path="*"
                  element={
                    <Lazy>
                      <NotFound />
                    </Lazy>
                  }
                />
              </Routes>
            </AnimatePresence>
            <Footer />
          </>
        )}
      </MotionConfig>
    </LazyMotion>
  );
}

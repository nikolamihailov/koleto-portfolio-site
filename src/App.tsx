import { AnimatePresence, MotionConfig } from 'framer-motion';
import { Suspense, useEffect, useState, type ReactNode } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Loader from './components/Loader';
import { loadHeroScene } from './components/loadHeroScene';
import Navbar from './components/Navbar';
import ParticlesBackground from './components/ParticlesBackground';
import Home from './pages/Home';
import { NotFound, ProjectDetail } from './pages/lazyPages';

const MIN_LOADER_MS = 2200;

// Lazy pages render an empty full-height placeholder while their chunk loads
// (usually instant, since project cards prefetch it on hover/touch).
const Lazy = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<div className="page-fallback" aria-busy="true" />}>{children}</Suspense>
);
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Wait for fonts (+ the three.js chunk when landing on the home page, the only page
    // that uses it), but never show the intro for less than MIN_LOADER_MS.
    const onHome = window.location.pathname === '/';
    Promise.all([document.fonts?.ready, onHome ? loadHeroScene() : null, wait(MIN_LOADER_MS)])
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <ParticlesBackground />

      <AnimatePresence>{loading && <Loader key="loader" />}</AnimatePresence>

      {!loading && (
        <>
          <a href="#main" className="skip-link">
            Skip to content
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
  );
}

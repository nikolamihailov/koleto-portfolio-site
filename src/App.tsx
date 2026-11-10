import { AnimatePresence, MotionConfig } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import Loader from './components/Loader';
import { loadHeroScene } from './components/loadHeroScene';
import Navbar from './components/Navbar';
import ParticlesBackground from './components/ParticlesBackground';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ProjectDetail from './pages/ProjectDetail';

const MIN_LOADER_MS = 2200;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Wait for fonts + the three.js chunk, but never show the intro for less than MIN_LOADER_MS.
    Promise.all([document.fonts?.ready, loadHeroScene(), wait(MIN_LOADER_MS)])
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
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
          <Footer />
        </>
      )}
    </MotionConfig>
  );
}

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import About from '../sections/About';
import Experience from '../sections/Experience';
import Hero from '../sections/Hero';
import Projects from '../sections/Projects';
import Skills from '../sections/Skills';
import PageTransition from './PageTransition';

export default function Home() {
  const { hash, key } = useLocation();

  // Scroll to the requested section (also when navigating here from another page).
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      return;
    }
    const t = window.setTimeout(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
    return () => window.clearTimeout(t);
  }, [hash, key]);

  return (
    <PageTransition>
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Experience />
    </PageTransition>
  );
}

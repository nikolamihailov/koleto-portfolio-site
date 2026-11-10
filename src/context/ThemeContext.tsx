import { createContext, useCallback, useContext, useLayoutEffect, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';

export type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const readInitial = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

type ViewTransitionDoc = Document & { startViewTransition?: (cb: () => void) => unknown };

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readInitial);

  // Layout effect so the attribute is set before children's effects read CSS variables.
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* storage unavailable */
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute('content', theme === 'dark' ? '#04080a' : '#f4fafb');
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const next = () => flushSync(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')));
    const doc = document as ViewTransitionDoc;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Smooth cross-fade where the View Transitions API exists (Chromium, Safari 18+).
    if (doc.startViewTransition && !reduced) doc.startViewTransition(next);
    else next();
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}

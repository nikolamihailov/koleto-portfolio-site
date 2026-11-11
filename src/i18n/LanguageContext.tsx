import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { getContent, type Content } from './content';
import { DEFAULT_LANG, isLang, translate, type Lang, type MessageKey, type Vars } from './messages';

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Type-safe lookup: t('nav.about'), t('about.portraitAlt', { name }) */
  t: (key: MessageKey, vars?: Vars) => string;
  /** Profile, projects and experience merged with their text in the current language. */
  content: Content;
}

const I18nContext = createContext<I18nContextValue | null>(null);

// index.html picks the language before first paint (English, unless the visitor chose
// Bulgarian on an earlier visit) and writes it to <html lang>, so React starts in it.
const readInitial = (): Lang => {
  const lang = document.documentElement.lang;
  return isLang(lang) ? lang : DEFAULT_LANG;
};

type ViewTransitionDoc = Document & { startViewTransition?: (cb: () => void) => unknown };

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitial);

  useLayoutEffect(() => {
    document.documentElement.lang = lang;
    document.title = translate(lang, 'meta.title');
    document.querySelector('meta[name="description"]')?.setAttribute('content', translate(lang, 'meta.description'));
  }, [lang]);

  const setLang = useCallback(
    (next: Lang) => {
      if (next === lang) return;
      // Only an explicit choice is remembered; first visits always start in English.
      try {
        localStorage.setItem('lang', next);
      } catch {
        /* storage unavailable */
      }
      const apply = () => flushSync(() => setLangState(next));
      const doc = document as ViewTransitionDoc;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      // Cross-fade the whole page between languages, like the theme switch.
      if (doc.startViewTransition && !reduced) doc.startViewTransition(apply);
      else apply();
    },
    [lang],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      lang,
      setLang,
      t: (key, vars) => translate(lang, key, vars),
      content: getContent(lang),
    }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}

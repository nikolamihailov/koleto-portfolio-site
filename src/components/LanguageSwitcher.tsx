import { m } from 'framer-motion';
import { useId } from 'react';
import { useI18n } from '../i18n/LanguageContext';
import { LANGS, messages } from '../i18n/messages';

/**
 * EN | BG segmented switch. Both options stay visible, so the current language and the
 * alternative are obvious at a glance. The highlight slides between them.
 */
export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  // Unique per instance: the navbar and the mobile menu each render one
  const pillId = useId();

  return (
    <div className={`lang-switch ${className}`} role="group" aria-label={t('language.label')}>
      {LANGS.map((code) => {
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            className={`lang-switch__btn ${active ? 'is-active' : ''}`}
            aria-pressed={active}
            // The option's own name in its own language, e.g. "Български"
            title={messages[code].language[code]}
            lang={code}
            onClick={() => setLang(code)}
          >
            {active && (
              <m.span
                layoutId={pillId}
                className="lang-switch__pill"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="lang-switch__code">{code.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
}

import { AnimatePresence, m } from 'framer-motion';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../i18n/LanguageContext';
import { jsAnimated } from '../utils/motion';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const { t } = useI18n();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={t(isDark ? 'theme.toLight' : 'theme.toDark')}
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={theme}
          {...jsAnimated}
          className="theme-toggle__icon"
          initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        >
          {isDark ? <FiMoon /> : <FiSun />}
        </m.span>
      </AnimatePresence>
    </button>
  );
}

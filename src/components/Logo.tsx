import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/LanguageContext';

/** Circular initials mark. Swap the inner span for an <img> once a logo file exists. */
export default function Logo() {
  const { t, content } = useI18n();
  const { profile } = content;
  return (
    <Link to="/" className="logo" aria-label={t('nav.home', { name: profile.name })}>
      <span className="logo__mark">{profile.initials}</span>
    </Link>
  );
}

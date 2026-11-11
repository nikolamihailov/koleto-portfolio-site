import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/LanguageContext';
import PageTransition from './PageTransition';

export default function NotFound() {
  const { t } = useI18n();
  return (
    <PageTransition className="not-found">
      <h1>404</h1>
      <p>{t('notFound.message')}</p>
      <Link to="/" className="btn btn--primary">
        {t('notFound.back')}
      </Link>
    </PageTransition>
  );
}

import { FiArrowUpRight } from 'react-icons/fi';
import { useI18n } from '../i18n/LanguageContext';
import { rich } from '../i18n/rich';
import { Reveal } from './Reveal';

export default function Footer() {
  const { t, content } = useI18n();
  const { profile } = content;
  return (
    <footer className="footer" id="contact">
      <Reveal className="footer__cta">
        <h2>{rich(t('footer.cta'), { accent: (s) => <span className="text-accent">{s}</span> })}</h2>
        <a href={`mailto:${profile.email}`} className="btn btn--primary btn--lg">
          {t('common.getInTouch')} <FiArrowUpRight aria-hidden="true" />
        </a>
      </Reveal>

      <div className="footer__bottom">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <ul className="footer__socials">
          {profile.socials.map(({ id, url, icon: Icon }) => (
            <li key={id}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t(`socials.${id}`)}
                className="icon-btn"
              >
                <Icon />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

import { FiDownload, FiMapPin } from 'react-icons/fi';
import { Reveal } from '../components/Reveal';
import SectionHeader from '../components/SectionHeader';
import { experience } from '../data/experience';
import { projects } from '../data/projects';
import { useI18n } from '../i18n/LanguageContext';
import { imgSrc } from '../utils/images';

// Sum the time actually spent at each company (first role start → latest role end).
const toMonths = (ym?: string) => {
  const d = ym ? new Date(`${ym}-01`) : new Date();
  return d.getFullYear() * 12 + d.getMonth();
};
const totalMonths = experience.reduce((sum, e) => {
  const first = e.roles[e.roles.length - 1];
  const last = e.roles[0];
  return sum + (toMonths(last.end) - toMonths(first.start) + 1);
}, 0);
const years = Math.floor(totalMonths / 12);

export default function About() {
  const { t, content } = useI18n();
  const { profile } = content;
  const stats = [
    {
      value: years >= 1 ? `${years}+` : `${totalMonths}`,
      label: t(years >= 1 ? 'about.yearsOfExperience' : 'about.monthsOfExperience'),
    },
    { value: `${projects.length}+`, label: t('about.projectsShipped') },
    { value: `${experience.length}`, label: t('about.companies') },
  ];

  return (
    <section className="section about" id="about">
      <div className="container">
        <SectionHeader index="01" title={t('about.title')} />
        <div className={`about__grid ${profile.photo ? 'about__grid--photo' : ''}`}>
          {profile.photo && (
            <Reveal className="about__media">
              <figure className="portrait">
                <div className="portrait__frame">
                  {/* The original portrait is 400px, so the 480 variant is the full-res WebP */}
                  <img
                    src={imgSrc(profile.photo, 480)}
                    alt={t('about.portraitAlt', { name: profile.name })}
                    width={400}
                    height={400}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </figure>
            </Reveal>
          )}

          <Reveal className="about__text" delay={0.1}>
            {profile.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="about__location">
              <FiMapPin aria-hidden="true" /> {profile.location}
            </p>

            <ul className="about__stats">
              {stats.map((s) => (
                <li key={s.label} className="stat card">
                  <span className="stat__value">{s.value}</span>
                  <span className="stat__label">{s.label}</span>
                </li>
              ))}
            </ul>

            {profile.cvUrl && (
              <a href={profile.cvUrl} className="btn btn--ghost" download>
                <FiDownload aria-hidden="true" /> {t('about.downloadCv')}
              </a>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

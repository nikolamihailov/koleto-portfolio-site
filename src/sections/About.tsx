import { FiDownload, FiMapPin } from 'react-icons/fi';
import { Reveal } from '../components/Reveal';
import SectionHeader from '../components/SectionHeader';
import { experience } from '../data/experience';
import { profile } from '../data/profile';
import { projects } from '../data/projects';

const firstYear = Math.min(...experience.flatMap((e) => e.roles.map((r) => Number(r.start.slice(0, 4)))));

const stats = [
  { value: `${new Date().getFullYear() - firstYear}+`, label: 'Years of experience' },
  { value: `${projects.length}+`, label: 'Projects shipped' },
  { value: `${experience.length}`, label: 'Companies' },
];

export default function About() {
  return (
    <section className="section about" id="about">
      <div className="container">
        <SectionHeader index="01" title="About me" />
        <div className={`about__grid ${profile.photo ? 'about__grid--photo' : ''}`}>
          {profile.photo && (
            <Reveal className="about__media">
              <figure className="portrait">
                <div className="portrait__frame">
                  <img
                    src={profile.photo}
                    alt={`Portrait of ${profile.name}`}
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
                <FiDownload aria-hidden="true" /> Download CV
              </a>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

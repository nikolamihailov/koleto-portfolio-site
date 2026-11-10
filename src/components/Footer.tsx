import { FiArrowUpRight } from 'react-icons/fi';
import { profile } from '../data/profile';
import { Reveal } from './Reveal';

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <Reveal className="footer__cta">
        <h2>
          Let&apos;s build something <span className="text-accent">great</span> together.
        </h2>
        <a href={`mailto:${profile.email}`} className="btn btn--primary btn--lg">
          Get in touch <FiArrowUpRight aria-hidden="true" />
        </a>
      </Reveal>

      <div className="footer__bottom">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <ul className="footer__socials">
          {profile.socials.map(({ label, url, icon: Icon }) => (
            <li key={label}>
              <a href={url} target="_blank" rel="noopener noreferrer" aria-label={label} className="icon-btn">
                <Icon />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

import { motion, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { FiFlag, FiMapPin } from 'react-icons/fi';
import type { ExperienceEntry } from '../data/types';
import { formatDuration, formatMonth } from '../utils/date';
import TechChip from './TechChip';

const EASE = [0.22, 1, 0.36, 1] as const;

function CompanyLogo({ entry }: { entry: ExperienceEntry }) {
  if (entry.logo)
    return (
      <img
        src={entry.logo}
        alt={`${entry.company} logo`}
        className={`timeline__logo-img timeline__logo-img--${entry.logoFit ?? 'cover'}`}
        loading="lazy"
      />
    );
  const initials = entry.company
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('');
  return <span className="timeline__logo-initials">{initials}</span>;
}

function CompanyCard({ entry, side }: { entry: ExperienceEntry; side: 'left' | 'right' }) {
  const { company, url, location, roles } = entry;
  const first = roles[roles.length - 1];
  const last = roles[0];
  const multi = roles.length > 1;

  return (
    <motion.article
      className={`xp-card xp-card--${side}`}
      initial={{ opacity: 0, x: side === 'left' ? -48 : 48 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <header className="xp-card__header">
        <div>
          <h3 className="xp-card__company">
            {url ? (
              <a href={url} target="_blank" rel="noopener noreferrer">
                {company}
              </a>
            ) : (
              company
            )}
          </h3>
          {(location || multi) && (
            <p className="xp-card__meta">
              {location && (
                <>
                  <FiMapPin aria-hidden="true" /> {location}
                </>
              )}
              {multi && (
                <span className="xp-card__total">
                  {location && ' · '}
                  {formatDuration(first.start, last.end)}
                </span>
              )}
            </p>
          )}
        </div>
      </header>

      <ol className={`xp-card__roles ${multi ? 'xp-card__roles--multi' : ''}`}>
        {roles.map((role, i) => {
          const isCurrent = !role.end;
          const isPromotion = i < roles.length - 1;
          return (
            <li key={role.title + role.start} className="xp-role">
              <span className="xp-role__dot" aria-hidden="true" />
              <div className="xp-role__head">
                <h4 className="xp-role__title">{role.title}</h4>
                <div className="xp-role__badges">
                  {isCurrent && <span className="badge badge--accent">Current</span>}
                  {isPromotion && <span className="badge">Promotion</span>}
                </div>
              </div>
              <p className="xp-role__dates">
                {role.employmentType && <>{role.employmentType} · </>}
                <time dateTime={role.start}>{formatMonth(role.start)}</time> –{' '}
                {role.end ? <time dateTime={role.end}>{formatMonth(role.end)}</time> : 'Present'}
                <span className="xp-role__duration"> · {formatDuration(role.start, role.end)}</span>
              </p>
              <p className="xp-role__desc">{role.description}</p>
              {role.highlights && (
                <ul className="xp-role__highlights">
                  {role.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              )}
              {role.stack && (
                <ul className="xp-role__stack" aria-label="Technologies">
                  {role.stack.map((id) => (
                    <li key={id}>
                      <TechChip id={id} size="sm" />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </motion.article>
  );
}

/**
 * Alternating left/right career timeline. Newest at the top, the starting point at the bottom.
 * The centre line fills as you scroll through it.
 */
export default function ExperienceTimeline({ entries }: { entries: ExperienceEntry[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div ref={ref} className="timeline">
      <div className="timeline__track" aria-hidden="true">
        <motion.div className="timeline__fill" style={{ scaleY: fill }} />
      </div>

      <div className="timeline__cap timeline__cap--top">
        <span className="badge badge--accent">Now</span>
      </div>

      <ol className="timeline__list">
        {entries.map((entry, i) => {
          const side = i % 2 === 0 ? 'left' : 'right';
          return (
            <li key={entry.id} className={`timeline__item timeline__item--${side}`}>
              <motion.span
                className="timeline__node"
                initial={{ scale: 0.4, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              >
                <CompanyLogo entry={entry} />
              </motion.span>
              <CompanyCard entry={entry} side={side} />
            </li>
          );
        })}
      </ol>

      <div className="timeline__cap timeline__cap--bottom">
        <span className="timeline__start">
          <FiFlag aria-hidden="true" /> Where it all started
        </span>
      </div>
    </div>
  );
}

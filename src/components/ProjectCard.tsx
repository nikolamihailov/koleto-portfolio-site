import { m, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { PointerEvent } from 'react';
import { FiArrowUpRight, FiGithub } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import type { LocalizedProject } from '../data/types';
import { useI18n } from '../i18n/LanguageContext';
import { loadProjectDetail } from '../pages/lazyPages';
import { GALLERY_SIZES, imgSrc, imgSrcSet, preloadImage } from '../utils/images';
import { useRevealItem } from './Reveal';
import TechChip from './TechChip';
import { jsAnimated } from '../utils/motion';

const SPRING = { stiffness: 220, damping: 22, mass: 0.6 };

export default function ProjectCard({ project }: { project: LocalizedProject }) {
  const { t } = useI18n();
  const revealProps = useRevealItem();
  const { slug, title, summary, images, stack, liveUrl, repoUrl, year } = project;

  // Pointer-driven 3D tilt + spotlight glow (fine pointers only, via CSS media query).
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [5, -5]), SPRING);
  const rotateY = useSpring(useTransform(px, [0, 1], [-6, 6]), SPRING);

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    px.set(x);
    py.set(y);
    e.currentTarget.style.setProperty('--mx', `${x * 100}%`);
    e.currentTarget.style.setProperty('--my', `${y * 100}%`);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  // Fetch the detail page code and its first gallery image before the click,
  // so navigation feels instant and the gallery doesn't open empty
  const prefetch = () => {
    loadProjectDetail();
    preloadImage(images[0], GALLERY_SIZES);
  };

  return (
    <m.article
      className="project-card"
      {...jsAnimated}
      {...revealProps}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerEnter={prefetch}
      onFocus={prefetch}
      onTouchStart={prefetch}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', ...SPRING }}
    >
      <Link to={`/projects/${slug}`} className="project-card__media" aria-label={t('projects.details', { title })}>
        <img
          src={imgSrc(images[0])}
          srcSet={imgSrcSet(images[0])}
          // Matches the grid: 3 columns ≈380px, 2 columns ≈ half minus gaps, 1 column = width minus gutters
          sizes="(min-width: 1200px) 380px, (min-width: 768px) calc(50vw - 3rem), calc(100vw - 2rem)"
          width={1600}
          height={1000}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <span className="project-card__year">{year}</span>
      </Link>

      <div className="project-card__body">
        <h3 className="project-card__title">
          <Link to={`/projects/${slug}`}>{title}</Link>
        </h3>
        <p className="project-card__summary">{summary}</p>

        <ul className="project-card__stack" aria-label={t('common.techStack')}>
          {stack.map((id) => (
            <li key={id}>
              <TechChip id={id} size="sm" />
            </li>
          ))}
        </ul>

        <div className="project-card__actions">
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn--primary btn--sm">
              {t('common.liveDemo')} <FiArrowUpRight aria-hidden="true" />
            </a>
          )}
          {repoUrl && (
            <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--sm">
              <FiGithub aria-hidden="true" /> {t('common.viewCode')}
            </a>
          )}
        </div>
      </div>
    </m.article>
  );
}

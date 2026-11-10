import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import type { PointerEvent } from 'react';
import { FiArrowUpRight, FiGithub } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import type { Project } from '../data/types';
import { loadProjectDetail } from '../pages/lazyPages';
import { imgSrc, imgSrcSet } from '../utils/images';
import { revealItem } from './Reveal';
import TechChip from './TechChip';

const SPRING = { stiffness: 220, damping: 22, mass: 0.6 };

export default function ProjectCard({ project }: { project: Project }) {
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

  return (
    <motion.article
      className="project-card"
      variants={revealItem}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      // Fetch the detail page code before the click so navigation feels instant
      onPointerEnter={loadProjectDetail}
      onFocus={loadProjectDetail}
      onTouchStart={loadProjectDetail}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', ...SPRING }}
    >
      <Link to={`/projects/${slug}`} className="project-card__media" aria-label={`${title} — details`}>
        <img
          src={imgSrc(images[0])}
          srcSet={imgSrcSet(images[0])}
          sizes="(min-width: 1200px) 380px, (min-width: 768px) 50vw, 100vw"
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

        <ul className="project-card__stack" aria-label="Tech stack">
          {stack.map((id) => (
            <li key={id}>
              <TechChip id={id} size="sm" />
            </li>
          ))}
        </ul>

        <div className="project-card__actions">
          {liveUrl && (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn--primary btn--sm">
              Live demo <FiArrowUpRight aria-hidden="true" />
            </a>
          )}
          {repoUrl && (
            <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--sm">
              <FiGithub aria-hidden="true" /> View code
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

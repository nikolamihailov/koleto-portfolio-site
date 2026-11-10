import { useEffect } from 'react';
import { FiArrowLeft, FiArrowRight, FiArrowUpRight, FiGithub } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';
import Gallery from '../components/Gallery';
import { Reveal } from '../components/Reveal';
import TechChip from '../components/TechChip';
import { getProject, projects } from '../data/projects';
import NotFound from './NotFound';
import PageTransition from './PageTransition';

export default function ProjectDetail() {
  const { slug = '' } = useParams();
  const project = getProject(slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    if (project) document.title = `${project.title} · Koleto`;
    return () => {
      document.title = 'Koleto · Portfolio';
    };
  }, [project]);

  if (!project) return <NotFound />;

  const idx = projects.indexOf(project);
  const next = projects[(idx + 1) % projects.length];
  const { title, summary, description, images, stack, liveUrl, repoUrl, year, role } = project;

  return (
    <PageTransition className="project-page">
      <div className="container">
        <Link to={{ pathname: '/', hash: '#projects' }} className="back-link">
          <FiArrowLeft aria-hidden="true" /> All projects
        </Link>

        <Reveal as="header" className="project-page__header">
          <p className="project-page__meta">
            {year}
            {role && <> · {role}</>}
          </p>
          <h1 className="project-page__title">{title}</h1>
          <p className="project-page__summary">{summary}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <Gallery images={images} title={title} />
        </Reveal>

        <div className="project-page__grid">
          <Reveal className="project-page__body">
            <h2>Overview</h2>
            {description.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>

          <Reveal as="article" className="project-page__aside card" delay={0.1}>
            <h2>Tech stack</h2>
            <ul className="project-page__stack">
              {stack.map((id) => (
                <li key={id}>
                  <TechChip id={id} />
                </li>
              ))}
            </ul>
            <div className="project-page__actions">
              {liveUrl && (
                <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
                  Live demo <FiArrowUpRight aria-hidden="true" />
                </a>
              )}
              {repoUrl && (
                <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
                  <FiGithub aria-hidden="true" /> View code
                </a>
              )}
            </div>
          </Reveal>
        </div>

        {next !== project && (
          <Reveal>
            <Link to={`/projects/${next.slug}`} className="next-project card">
              <span className="next-project__label">Next project</span>
              <span className="next-project__title">
                {next.title} <FiArrowRight aria-hidden="true" />
              </span>
            </Link>
          </Reveal>
        )}
      </div>
    </PageTransition>
  );
}

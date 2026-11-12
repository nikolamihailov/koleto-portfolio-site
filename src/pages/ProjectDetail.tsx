import { useEffect } from 'react';
import { FiArrowLeft, FiArrowRight, FiArrowUpRight, FiGithub } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';
import Gallery from '../components/Gallery';
import { Reveal } from '../components/Reveal';
import TechChip from '../components/TechChip';
import { useI18n } from '../i18n/LanguageContext';
import NotFound from './NotFound';
import PageTransition from './PageTransition';

export default function ProjectDetail() {
  const { slug = '' } = useParams();
  const { t, content } = useI18n();
  const { projects } = content;
  const project = projects.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [slug]);

  // Re-run on language change too: the provider resets the title to the home page's.
  const pageTitle = project ? t('meta.projectTitle', { project: project.title }) : '';
  const homeTitle = t('meta.title');
  useEffect(() => {
    if (!pageTitle) return;
    document.title = pageTitle;
    return () => {
      document.title = homeTitle;
    };
  }, [pageTitle, homeTitle]);

  if (!project) return <NotFound />;

  const idx = projects.indexOf(project);
  // No wrap-around: the first project has no "previous", the last no "next"
  const prev = projects[idx - 1];
  const next = projects[idx + 1];
  const { title, summary, description, images, stack, liveUrl, repoUrl, year, role } = project;

  return (
    <PageTransition className="project-page">
      <div className="container">
        <Link to={{ pathname: '/', hash: '#projects' }} className="back-link">
          <FiArrowLeft aria-hidden="true" /> {t('project.back')}
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
            <h2>{t('project.overview')}</h2>
            {description.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>

          <Reveal as="article" className="project-page__aside card" delay={0.1}>
            <h2>{t('common.techStack')}</h2>
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
                  {t('common.liveDemo')} <FiArrowUpRight aria-hidden="true" />
                </a>
              )}
              {repoUrl && (
                <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
                  <FiGithub aria-hidden="true" /> {t('common.viewCode')}
                </a>
              )}
            </div>
          </Reveal>
        </div>

        {(prev || next) && (
          <Reveal
            as="nav"
            className={`project-page__nav ${prev && next ? '' : 'project-page__nav--single'}`}
            aria-label={t('project.navLabel')}
          >
            {prev && (
              <Link to={`/projects/${prev.slug}`} className="next-project next-project--prev card" rel="prev">
                <span className="next-project__label">{t('project.previous')}</span>
                <span className="next-project__title">
                  <FiArrowLeft aria-hidden="true" />
                  <span className="next-project__name" title={prev.title}>
                    {prev.title}
                  </span>
                </span>
              </Link>
            )}
            {next && (
              <Link to={`/projects/${next.slug}`} className="next-project next-project--next card" rel="next">
                <span className="next-project__label">{t('project.next')}</span>
                <span className="next-project__title">
                  <span className="next-project__name" title={next.title}>
                    {next.title}
                  </span>
                  <FiArrowRight aria-hidden="true" />
                </span>
              </Link>
            )}
          </Reveal>
        )}
      </div>
    </PageTransition>
  );
}

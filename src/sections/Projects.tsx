import ProjectCard from '../components/ProjectCard';
import { RevealGroup } from '../components/Reveal';
import SectionHeader from '../components/SectionHeader';
import { useI18n } from '../i18n/LanguageContext';

export default function Projects() {
  const { t, content } = useI18n();
  return (
    <section className="section" id="projects">
      <div className="container">
        <SectionHeader index="02" title={t('projects.title')} lead={t('projects.lead')} />
        <RevealGroup className="projects__grid" stagger={0.12}>
          {content.projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

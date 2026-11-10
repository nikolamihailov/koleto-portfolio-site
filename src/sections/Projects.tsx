import ProjectCard from '../components/ProjectCard';
import { RevealGroup } from '../components/Reveal';
import SectionHeader from '../components/SectionHeader';
import { projects } from '../data/projects';

export default function Projects() {
  return (
    <section className="section" id="projects">
      <div className="container">
        <SectionHeader index="02" title="Projects" lead="A selection of things I have designed and built." />
        <RevealGroup className="projects__grid" stagger={0.12}>
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

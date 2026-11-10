import ExperienceTimeline from '../components/ExperienceTimeline';
import SectionHeader from '../components/SectionHeader';
import { experience } from '../data/experience';

export default function Experience() {
  return (
    <section className="section" id="experience">
      <div className="container">
        <SectionHeader index="04" title="Experience" lead="My career so far, from where it started to where I am now." />
        <ExperienceTimeline entries={experience} />
      </div>
    </section>
  );
}

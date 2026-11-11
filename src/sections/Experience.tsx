import ExperienceTimeline from '../components/ExperienceTimeline';
import SectionHeader from '../components/SectionHeader';
import { useI18n } from '../i18n/LanguageContext';

export default function Experience() {
  const { t, content } = useI18n();
  return (
    <section className="section" id="experience">
      <div className="container">
        <SectionHeader index="04" title={t('experience.title')} lead={t('experience.lead')} />
        <ExperienceTimeline entries={content.experience} />
      </div>
    </section>
  );
}

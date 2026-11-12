import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { RevealGroup, useRevealItem } from '../components/Reveal';
import SectionHeader from '../components/SectionHeader';
import { skills } from '../data/skills';
import { tech } from '../data/tech';
import type { TechId } from '../data/types';
import { useI18n } from '../i18n/LanguageContext';
import { jsAnimated } from '../utils/motion';

export default function Skills() {
  const { t } = useI18n();
  return (
    <section className="section" id="skills">
      <div className="container">
        <SectionHeader index="03" title={t('skills.title')} lead={t('skills.lead')} />
        <RevealGroup className="skills__grid" stagger={0.1}>
          {skills.map((group) => (
            <SkillGroup key={group.id} title={t(`skills.groups.${group.id}`)} items={group.items} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function SkillGroup({ title, items }: { title: string; items: TechId[] }) {
  const revealProps = useRevealItem();
  return (
    <motion.div {...jsAnimated} className="skill-group card" {...revealProps}>
      <h3 className="skill-group__title">{title}</h3>
      <ul className="skill-group__list">
        {items.map((id) => {
          const { name, icon: Icon, color, onDark } = tech[id];
          return (
            <motion.li
              key={id}
              className="skill"
              style={{ '--brand': color, '--brand-on-dark': onDark } as CSSProperties}
              whileHover={{ y: -4, scale: 1.04 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            >
              <Icon className="skill__icon" aria-hidden="true" />
              <span>{name}</span>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}

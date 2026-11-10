import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { RevealGroup, revealItem } from '../components/Reveal';
import SectionHeader from '../components/SectionHeader';
import { skills } from '../data/skills';
import { tech } from '../data/tech';
import { jsAnimated } from '../utils/motion';

export default function Skills() {
  return (
    <section className="section" id="skills">
      <div className="container">
        <SectionHeader index="03" title="Skills" lead="Tools and technologies I work with every day." />
        <RevealGroup className="skills__grid" stagger={0.1}>
          {skills.map((group) => (
            <motion.div key={group.title} {...jsAnimated} className="skill-group card" variants={revealItem}>
              <h3 className="skill-group__title">{group.title}</h3>
              <ul className="skill-group__list">
                {group.items.map((id) => {
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
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

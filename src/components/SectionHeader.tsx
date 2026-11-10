import { Reveal } from './Reveal';

export default function SectionHeader({ index, title, lead }: { index: string; title: string; lead?: string }) {
  return (
    <Reveal as="header" className="section-header">
      <span className="section-header__eyebrow">{index}</span>
      <h2 className="section-header__title">{title}</h2>
      {lead && <p className="section-header__lead">{lead}</p>}
    </Reveal>
  );
}

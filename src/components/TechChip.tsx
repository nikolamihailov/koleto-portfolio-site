import { tech } from '../data/tech';
import type { TechId } from '../data/types';

export default function TechChip({ id, size = 'md' }: { id: TechId; size?: 'sm' | 'md' }) {
  const { name, icon: Icon } = tech[id];
  return (
    <span className={`chip chip--${size}`}>
      <Icon aria-hidden="true" className="chip__icon" />
      {name}
    </span>
  );
}

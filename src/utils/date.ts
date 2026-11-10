const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const parse = (ym: string) => {
  const [y, m] = ym.split('-').map(Number);
  return { y, m };
};

export const formatMonth = (ym?: string) => {
  if (!ym) return 'Present';
  const { y, m } = parse(ym);
  return `${MONTHS[m - 1]} ${y}`;
};

const monthsBetween = (start: string, end?: string) => {
  const s = parse(start);
  const now = new Date();
  const e = end ? parse(end) : { y: now.getFullYear(), m: now.getMonth() + 1 };
  return Math.max(1, (e.y - s.y) * 12 + (e.m - s.m) + 1);
};

/** LinkedIn-style duration, e.g. "1 yr 4 mos". */
export const formatDuration = (start: string, end?: string) => {
  const total = monthsBetween(start, end);
  const yrs = Math.floor(total / 12);
  const mos = total % 12;
  const parts: string[] = [];
  if (yrs) parts.push(`${yrs} yr${yrs > 1 ? 's' : ''}`);
  if (mos) parts.push(`${mos} mo${mos > 1 ? 's' : ''}`);
  return parts.join(' ');
};

import { messages, translate, type Lang } from '../i18n/messages';

const parse = (ym: string) => {
  const [y, m] = ym.split('-').map(Number);
  return { y, m };
};

/** "Mar 2026" / "март 2026"; no date means the role is current ("Present" / "досега"). */
export const formatMonth = (ym: string | undefined, lang: Lang) => {
  if (!ym) return translate(lang, 'experience.present');
  const { y, m } = parse(ym);
  // Month names come from the locale files rather than Intl, so the output is identical
  // in every browser and in Node at build time (which may ship without Bulgarian data).
  return `${messages[lang].experience.months[m - 1]} ${y}`;
};

const monthsBetween = (start: string, end?: string) => {
  const s = parse(start);
  const now = new Date();
  const e = end ? parse(end) : { y: now.getFullYear(), m: now.getMonth() + 1 };
  return Math.max(1, (e.y - s.y) * 12 + (e.m - s.m) + 1);
};

/** LinkedIn-style duration, e.g. "1 yr 4 mos" / "1 г. 4 мес.". */
export const formatDuration = (start: string, end: string | undefined, lang: Lang) => {
  const total = monthsBetween(start, end);
  const yrs = Math.floor(total / 12);
  const mos = total % 12;
  const plural = new Intl.PluralRules(lang);
  const unit = (count: number, kind: 'year' | 'month') =>
    translate(lang, `experience.duration.${kind}.${plural.select(count) === 'one' ? 'one' : 'other'}`, { count });
  const parts: string[] = [];
  if (yrs) parts.push(unit(yrs, 'year'));
  if (mos) parts.push(unit(mos, 'month'));
  return parts.join(' ');
};

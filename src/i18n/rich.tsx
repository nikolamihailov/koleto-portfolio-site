import { Fragment, type ReactNode } from 'react';

type Renderers = Record<string, (chunk: string) => ReactNode>;

/**
 * Renders simple tags inside a translated string, so styled words can move freely
 * within the sentence in each language:
 *
 *   rich(t('footer.cta'), { accent: (s) => <span className="text-accent">{s}</span> })
 *   // "Let's build something <accent>great</accent> together."
 */
export function rich(text: string, renderers: Renderers): ReactNode[] {
  const out: ReactNode[] = [];
  const tag = /<(\w+)>(.*?)<\/\1>/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = tag.exec(text))) {
    if (match.index > last) out.push(text.slice(last, match.index));
    const render = renderers[match[1]];
    out.push(<Fragment key={match.index}>{render ? render(match[2]) : match[2]}</Fragment>);
    last = tag.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

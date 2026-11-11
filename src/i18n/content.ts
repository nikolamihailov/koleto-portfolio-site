import { experience } from '../data/experience';
import { profile } from '../data/profile';
import { projects } from '../data/projects';
import type {
  ExperienceText,
  LocalizedExperienceEntry,
  LocalizedProfile,
  LocalizedProject,
  ProjectText,
} from '../data/types';
import { messages, type Lang } from './messages';

export interface Content {
  profile: LocalizedProfile;
  projects: LocalizedProject[];
  experience: LocalizedExperienceEntry[];
}

function missing(lang: Lang, path: string): never {
  throw new Error(`[i18n] Missing "content.${path}" in src/i18n/locales/${lang}.json`);
}

function build(lang: Lang): Content {
  const text = messages[lang].content;
  const projectText = text.projects as Record<string, ProjectText>;
  const experienceText = text.experience as Record<string, ExperienceText>;

  return {
    profile: { ...profile, ...text.profile },
    projects: projects.map((p) => ({ ...p, ...(projectText[p.slug] ?? missing(lang, `projects.${p.slug}`)) })),
    experience: experience.map((entry) => {
      const t = experienceText[entry.id] ?? missing(lang, `experience.${entry.id}`);
      return {
        ...entry,
        location: t.location || undefined,
        roles: entry.roles.map((role) => ({
          ...role,
          ...(t.roles[role.id] ?? missing(lang, `experience.${entry.id}.roles.${role.id}`)),
        })),
      };
    }),
  };
}

const cache = new Map<Lang, Content>();

/** Structural data from src/data merged with the text for `lang` (built once per language). */
export function getContent(lang: Lang): Content {
  let content = cache.get(lang);
  if (!content) {
    content = build(lang);
    cache.set(lang, content);
  }
  return content;
}

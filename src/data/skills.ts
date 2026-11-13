import type { SkillGroup } from './types';

// Group titles are translated: see `skills.groups` in src/i18n/locales/*.json.
export const skills: SkillGroup[] = [
  {
    id: 'frontend',
    items: ['react', 'nextjs', 'angular', 'typescript', 'javascript', 'html', 'sass', 'tailwind', 'redux'],
  },
  { id: 'backend', items: ['node', 'express', 'nestjs', 'mongodb', 'postgresql'] },
  { id: 'creative', items: ['threejs', 'framer', 'figma'] },
  { id: 'tooling', items: ['git', 'github', 'gitlab', 'docker', 'vite'] },
  { id: 'ai', items: ['claude', 'cursor', 'chatgpt'] },
  { id: 'deployment', items: ['netlify', 'vercel', 'render'] },
];

import type { SkillGroup } from './types';

export const skills: SkillGroup[] = [
  { title: 'Frontend', items: ['react', 'nextjs', 'angular', 'typescript', 'javascript', 'html', 'sass', 'tailwind', 'redux'] },
  { title: 'Backend', items: ['node', 'express', 'nestjs', 'mongodb', 'postgresql'] },
  { title: 'Creative', items: ['threejs', 'framer', 'figma'] },
  { title: 'Tooling', items: ['git', 'docker', 'vite', 'jest'] },
  { title: 'AI', items: ['claude', 'cursor', 'chatgpt'] },
  { title: 'Deployment', items: ['netlify', 'vercel', 'render'] },
];

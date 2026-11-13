import type { ExperienceEntry } from './types';

// Order: newest company first; inside a company, newest role first.
// The timeline renders newest at the top, so the starting point sits at the bottom.
// Role titles, descriptions and locations are translated: see `content.experience.<id>`
// in src/i18n/locales/*.json (keep each description to 1–2 sentences).
export const experience: ExperienceEntry[] = [
  {
    id: 'wiser',
    company: 'Wiser Technology',
    logo: '/images/companies/wiser-technology.webp',
    roles: [
      {
        id: 'regular',
        employmentType: 'fullTime',
        start: '2026-03',
        stack: ['react', 'nextjs', 'nestjs', 'typescript', 'javascript', 'html', 'css'],
      },
      {
        id: 'junior',
        employmentType: 'fullTime',
        start: '2025-01',
        end: '2026-03',
        stack: ['react', 'typescript', 'javascript', 'html', 'css'],
      },
      {
        id: 'intern',
        employmentType: 'internship',
        start: '2024-07',
        end: '2025-01',
        stack: ['react', 'nextjs', 'typescript', 'javascript', 'html', 'css'],
      },
    ],
  },
  {
    id: 'timag',
    company: 'Timag',
    logo: '/images/companies/timag.webp',
    logoFit: 'contain',
    roles: [
      {
        id: 'frontend',
        employmentType: 'internship',
        start: '2022-02',
        end: '2022-03',
        stack: ['css', 'php', 'wordpress'],
      },
    ],
  },
];

import type { ExperienceEntry } from './types';

// TODO: replace with real data.
// Order: newest company first; inside a company, newest role first.
// The timeline renders newest at the top, so your starting point sits at the bottom.
export const experience: ExperienceEntry[] = [
  {
    id: 'orbit',
    company: 'Orbit Systems',
    url: 'https://example.com',
    location: 'Sofia, Bulgaria · Hybrid',
    roles: [
      {
        title: 'Senior Frontend Engineer',
        employmentType: 'Full-time',
        start: '2025-03',
        description: 'Leading the frontend of the core SaaS platform and mentoring a team of four developers.',
        highlights: [
          'Cut bundle size by 38% with route-level code splitting',
          'Introduced a shared design system used across 3 products',
        ],
        stack: ['react', 'typescript', 'nextjs'],
      },
      {
        title: 'Frontend Engineer',
        employmentType: 'Full-time',
        start: '2023-07',
        end: '2025-03',
        description: 'Built customer-facing features and an internal component library.',
        highlights: ['Shipped real-time collaboration features', 'Raised Lighthouse performance from 62 to 96'],
        stack: ['react', 'redux', 'sass'],
      },
    ],
  },
  {
    id: 'nebula',
    company: 'Nebula Labs',
    url: 'https://example.com',
    location: 'Plovdiv, Bulgaria · On-site',
    roles: [
      {
        title: 'Software Developer',
        employmentType: 'Full-time',
        start: '2022-04',
        end: '2023-06',
        description: 'Owned full-stack features across a Node.js API and React dashboard.',
        stack: ['node', 'express', 'react', 'mongodb'],
      },
      {
        title: 'Junior Software Developer',
        employmentType: 'Full-time',
        start: '2021-06',
        end: '2022-04',
        description: 'Started on bug fixes and small features, then grew into owning the reporting module.',
        stack: ['javascript', 'react', 'node'],
      },
    ],
  },
  {
    id: 'pixel',
    company: 'Pixel Forge',
    location: 'Remote',
    roles: [
      {
        title: 'Web Developer Intern',
        employmentType: 'Internship',
        start: '2020-09',
        end: '2021-05',
        description: 'Built marketing websites and learned modern frontend workflows.',
        stack: ['html', 'sass', 'javascript'],
      },
    ],
  },
];

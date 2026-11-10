import type { ExperienceEntry } from './types';

// Order: newest company first; inside a company, newest role first.
// The timeline renders newest at the top, so the starting point sits at the bottom.
// Keep each description to 1–2 sentences.
export const experience: ExperienceEntry[] = [
  {
    id: 'wiser',
    company: 'Wiser Technology',
    logo: '/images/companies/wiser-technology.webp',
    location: 'Remote',
    roles: [
      {
        title: 'Regular Front-end Developer',
        employmentType: 'Full-time',
        start: '2026-03',
        description:
          'Building and maintaining front-end features for client projects. Driving UI quality and best practices across the team.',
        stack: ['react', 'typescript', 'javascript'],
      },
      {
        title: 'Junior Front-end Developer',
        employmentType: 'Full-time',
        start: '2025-01',
        end: '2026-03',
        description:
          'Researched and developed libraries to support and enhance project architecture. Consulted internal teams on UI design best practices and front-end development strategies.',
        stack: ['react', 'javascript'],
      },
      {
        title: 'Full-stack Engineer Intern',
        employmentType: 'Internship',
        start: '2024-07',
        end: '2025-01',
        description:
          'Developed a personal full-stack project based on given requirements. Worked closely with other interns on a team project.',
        stack: ['javascript', 'java'],
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
        title: 'Front-end Web Developer',
        employmentType: 'Internship',
        start: '2022-02',
        end: '2022-03',
        description:
          'Developed a website using a custom template and integrated it into WordPress. Customized and improved the WordPress theme.',
        stack: ['css', 'php', 'wordpress'],
      },
    ],
  },
];

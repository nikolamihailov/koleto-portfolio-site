import type { Project } from './types';

const dir = (folder: string) => (file: string) => `/images/projects/${folder}/${file}`;
const portfolio = dir('portfolio');
const tennis = dir('tennis-court');
const autohub = dir('autohub');
const kolplace = dir('kolplace');
const solar = dir('solar-system');
const sipspot = dir('sipspot');

// Newest first. The first image is the card thumbnail.
// Summary, description and role are translated: see `content.projects.<slug>` in src/i18n/locales/*.json.
// Put original screenshots in /images-src/projects/<project>/ and run `npm run images`;
// reference them here by name without extension (see src/utils/images.ts).
export const projects: Project[] = [
  {
    slug: 'koleto-portfolio',
    title: 'Koleto Portfolio',
    images: [
      portfolio('01-hero'),
      portfolio('02-about'),
      portfolio('03-projects'),
      portfolio('04-skills'),
      portfolio('05-experience'),
      portfolio('06-project-page'),
      portfolio('07-light'),
      portfolio('08-light-skills'),
      portfolio('09-bulgarian'),
    ],
    stack: ['react', 'typescript', 'threejs', 'sass', 'framer', 'vite', 'netlify'],
    // No liveUrl: this is the site itself, a "Live demo" link would just loop back here
    repoUrl: 'https://github.com/nikolamihailov/koleto-portfolio-site',
    year: 2026,
  },
  {
    slug: 'tennis-court-asenovgrad',
    title: 'Tennis Club Asenovgrad',
    images: [
      tennis('01-home'),
      tennis('02-booking'),
      tennis('03-confirmation'),
      tennis('05-profile'),
      tennis('06-admin-dashboard'),
      tennis('08-admin-courts'),
      tennis('10-trainer-dashboard'),
      tennis('11-trainer-schedule'),
    ],
    stack: ['nextjs', 'typescript', 'tailwind', 'prisma', 'postgresql', 'zod', 'vercel'],
    liveUrl: 'https://tennis-court-asenovgrad.vercel.app',
    repoUrl: 'https://github.com/nikolamihailov/tennis-court-asenovgrad',
    year: 2026,
  },
  {
    slug: 'sipspot',
    title: 'SipSpot',
    images: [
      sipspot('01-home'),
      sipspot('02-recipes'),
      sipspot('03-recipe-detail'),
      sipspot('04-signature'),
      sipspot('05-gallery'),
      sipspot('06-gallery-lightbox'),
      sipspot('07-testimonials'),
      sipspot('08-reservation'),
      sipspot('09-about'),
    ],
    stack: ['react', 'typescript', 'reactquery', 'axios', 'reactrouter', 'framer', 'sass', 'vite', 'netlify'],
    liveUrl: 'https://sipspot.netlify.app/',
    repoUrl: 'https://github.com/nikolamihailov/React-Projects/tree/main/sipspot',
    year: 2026,
  },
  {
    slug: 'autohub',
    title: 'AutoHub',
    images: [
      autohub('00-offers'),
      autohub('01-home'),
      autohub('02-perks'),
      autohub('03-about'),
      autohub('04-contacts'),
      autohub('05-login'),
    ],
    stack: ['angular', 'typescript', 'node', 'express', 'mongodb', 'mongoose', 'jwt'],
    liveUrl: 'https://autohub-k.netlify.app/home',
    repoUrl: 'https://github.com/nikolamihailov/AutoHub',
    year: 2025,
  },
  {
    slug: 'kolplace',
    title: 'KolPlace',
    images: [
      kolplace('01-home'),
      kolplace('02-home-dark'),
      kolplace('03-category'),
      kolplace('04-promotions'),
      kolplace('05-stores'),
      kolplace('06-about'),
      kolplace('07-login'),
    ],
    stack: ['react', 'reactrouter', 'framer', 'node', 'express', 'mongodb', 'mongoose', 'jwt'],
    liveUrl: 'https://kolplace.netlify.app/',
    repoUrl:
      'https://github.com/nikolamihailov/React-Projects/tree/main/kolplace%20-%20Final%20React%20Project%20SoftUni',
    year: 2024,
  },
  {
    slug: 'solar-system-planets',
    title: 'Solar System Planets',
    images: [solar('01-overview'), solar('02-saturn'), solar('03-mars')],
    stack: ['react', 'typescript', 'threejs', 'vite'],
    liveUrl: 'https://planets-sl.netlify.app/',
    repoUrl: 'https://github.com/nikolamihailov/React-Projects/tree/main/solar-system-planets',
    year: 2024,
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

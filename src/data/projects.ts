import type { Project } from './types';

const dir = (folder: string) => (file: string) => `/images/projects/${folder}/${file}`;
const portfolio = dir('portfolio');
const tennis = dir('tennis-court');

// Newest first. The first image is the card thumbnail.
// Put images in /public/images/projects/<project>/.
export const projects: Project[] = [
  {
    slug: 'koleto-portfolio',
    title: 'Koleto Portfolio',
    summary: 'This site: a personal portfolio with an interactive three.js hero, light/dark themes and smooth scroll animations.',
    description: [
      'A fast, fully responsive single-page portfolio built with React and TypeScript. The hero features an interactive particle sphere rendered with React Three Fiber that assembles on load and scatters away from the cursor, over an ambient canvas of drifting particles.',
      'Styling follows the SCSS 7-1 architecture, with theme colours defined as CSS custom properties so light and dark modes switch instantly. Framer Motion powers scroll reveals, card interactions and page transitions, and all content is served from typed local data, so no backend is needed.',
    ],
    images: [portfolio('01-hero.jpg'), portfolio('02-about.jpg'), portfolio('03-experience.jpg'), portfolio('04-light.jpg')],
    stack: ['react', 'typescript', 'threejs', 'sass', 'framer', 'vite', 'netlify'],
    repoUrl: 'https://github.com/nikolamihailov/koleto-portfolio-site',
    year: 2026,
    role: 'Design & development',
  },
  {
    slug: 'tennis-court-asenovgrad',
    title: 'Tennis Club Asenovgrad',
    summary: 'Court booking platform for a tennis club, with a customer site, an admin panel and a trainer dashboard.',
    description: [
      'A full-stack booking platform for a tennis club in Asenovgrad, Bulgaria. Customers can check availability, book a court as a guest or with Google sign-in, add an optional trainer, and reschedule or cancel up to two hours before the start.',
      'Staff manage everything from an admin panel with bookings, revenue and occupancy stats, court management (surfaces, working hours, pricing, photos) and user roles. Trainers get their own dashboard for sessions, working hours and time off. Double bookings for both courts and trainers are prevented at the database level with exclusion constraints, and transactional emails go out for confirmations and cancellations.',
    ],
    images: [
      tennis('01-home.jpg'),
      tennis('02-booking.png'),
      tennis('03-confirmation.png'),
      tennis('05-profile.png'),
      tennis('06-admin-dashboard.png'),
      tennis('08-admin-courts.png'),
      tennis('10-trainer-dashboard.png'),
      tennis('11-trainer-schedule.png'),
    ],
    stack: ['nextjs', 'typescript', 'tailwind', 'prisma', 'postgresql', 'zod', 'vercel'],
    liveUrl: 'https://tennis-court-asenovgrad.vercel.app',
    repoUrl: 'https://github.com/nikolamihailov/tennis-court-asenovgrad',
    year: 2026,
    role: 'Full-stack developer',
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

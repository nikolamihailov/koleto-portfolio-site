import type { Project } from './types';

const dir = (folder: string) => (file: string) => `/images/projects/${folder}/${file}`;
const portfolio = dir('portfolio');
const tennis = dir('tennis-court');
const autohub = dir('autohub');

// Newest first. The first image is the card thumbnail.
// Put original screenshots in /images-src/projects/<project>/ and run `npm run images`;
// reference them here by name without extension (see src/utils/images.ts).
export const projects: Project[] = [
  {
    slug: 'koleto-portfolio',
    title: 'Koleto Portfolio',
    summary: 'This site: a personal portfolio with an interactive three.js hero, light/dark themes and smooth scroll animations.',
    description: [
      'A fast, fully responsive single-page portfolio built with React and TypeScript. The hero features an interactive particle sphere rendered with React Three Fiber that assembles on load and scatters away from the cursor, over an ambient canvas of drifting particles.',
      'Styling follows the SCSS 7-1 architecture, with theme colours defined as CSS custom properties so light and dark modes switch instantly. Framer Motion powers scroll reveals, card interactions and page transitions, and all content is served from typed local data, so no backend is needed.',
    ],
    images: [portfolio('01-hero'), portfolio('02-about'), portfolio('03-experience'), portfolio('04-light')],
    stack: ['react', 'typescript', 'threejs', 'sass', 'framer', 'vite', 'netlify'],
    liveUrl: 'https://koleto.eu',
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
    role: 'Full-stack developer',
  },
  {
    slug: 'autohub',
    title: 'AutoHub',
    summary: 'Full-stack car marketplace for browsing, selling and managing car offers, with user and admin roles.',
    description: [
      'AutoHub is a car marketplace with an Angular front end and a Node.js/Express REST API backed by MongoDB. Visitors can search and filter offers by brand, model or category, sort by price or date, and browse image galleries, with infinite scrolling throughout.',
      'Registered users manage their profile and their own car offers, mark cars as sold, save favourites and view all offers from a dealership. Admins get a central panel to manage users, categories and every offer. Authentication uses JWT with bcrypt-hashed passwords, and the UI combines custom components with Angular Material, animations and toast notifications.',
    ],
    images: [autohub('01-home'), autohub('02-perks'), autohub('03-about'), autohub('04-contacts'), autohub('05-login')],
    stack: ['angular', 'typescript', 'node', 'express', 'mongodb', 'mongoose', 'jwt'],
    liveUrl: 'https://autohub-k.netlify.app/home',
    repoUrl: 'https://github.com/nikolamihailov/AutoHub',
    year: 2025,
    role: 'Full-stack developer',
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

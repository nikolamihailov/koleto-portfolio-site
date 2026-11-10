import type { Project } from './types';

const img = (slug: string, n: number) => `/images/projects/${slug}-${n}.svg`;

// TODO: replace with real data. Put images in /public/images/projects/.
export const projects: Project[] = [
  {
    slug: 'nebula-dashboard',
    title: 'Nebula Dashboard',
    summary: 'Real-time analytics dashboard with live charts, filters and role-based access.',
    description: [
      'Nebula is an analytics dashboard that streams live metrics over WebSockets and renders them in smooth, interactive charts.',
      'I designed the component system, implemented role-based access control and optimised rendering so the UI stays at 60fps with thousands of data points.',
    ],
    images: [img('nebula-dashboard', 1), img('nebula-dashboard', 2), img('nebula-dashboard', 3)],
    stack: ['react', 'typescript', 'redux', 'node', 'postgresql'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/',
    year: 2025,
    role: 'Full-stack developer',
  },
  {
    slug: 'orbit-3d-store',
    title: 'Orbit 3D Store',
    summary: 'E-commerce storefront with interactive 3D product previews.',
    description: [
      'An online store where every product can be rotated and inspected in 3D, built with React Three Fiber.',
      'Includes a cart, checkout flow and a headless CMS integration for products.',
    ],
    images: [img('orbit-3d-store', 1), img('orbit-3d-store', 2)],
    stack: ['nextjs', 'threejs', 'typescript', 'tailwind'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/',
    year: 2025,
    role: 'Frontend developer',
  },
  {
    slug: 'taskflow',
    title: 'TaskFlow',
    summary: 'Kanban-style task manager with drag & drop and a REST API.',
    description: [
      'TaskFlow lets teams organise work on drag-and-drop boards with labels, due dates and comments.',
      'The backend is a documented REST API with JWT auth, rate limiting and full test coverage.',
    ],
    images: [img('taskflow', 1), img('taskflow', 2), img('taskflow', 3)],
    stack: ['react', 'express', 'mongodb', 'jest', 'docker'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/',
    year: 2024,
    role: 'Solo project',
  },
  {
    slug: 'pulse-weather',
    title: 'Pulse Weather',
    summary: 'Minimal weather app with animated conditions and 7-day forecasts.',
    description: [
      'A minimal, fast weather app with animated backgrounds that react to current conditions.',
      'It works offline as a PWA and caches the latest forecast.',
    ],
    images: [img('pulse-weather', 1), img('pulse-weather', 2)],
    stack: ['react', 'sass', 'framer', 'vite'],
    liveUrl: 'https://example.com',
    repoUrl: 'https://github.com/',
    year: 2024,
    role: 'Solo project',
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

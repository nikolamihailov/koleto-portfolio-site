import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import type { Profile } from './types';

// TODO: replace with real data
export const profile: Profile = {
  name: 'Nikola Mihaylov',
  shortName: 'Nikola',
  initials: 'NM',
  role: 'Full-Stack Developer',
  photo: '/images/profile.jpg',
  tagline: 'I build fast, accessible and beautifully animated web experiences.',
  bio: [
    'I am a developer who enjoys turning complex problems into clean, intuitive interfaces. I care about performance, accessibility and the small details that make a product feel polished.',
    'When I am not coding, you will usually find me training, hiking in the mountains or flying my drone to capture views from above.',
  ],
  location: 'Sofia, Bulgaria',
  email: 'hello@example.com',
  cvUrl: '#',
  socials: [
    { label: 'GitHub', url: 'https://github.com/nikolamihailov', icon: FiGithub },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/nikola-mihaylov/', icon: FiLinkedin },
    { label: 'Email', url: 'mailto:hello@example.com', icon: FiMail },
  ],
};

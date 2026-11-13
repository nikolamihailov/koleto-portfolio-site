import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import type { Profile } from './types';

// Name, role, tagline, bio and location are translated: see `content.profile` in src/i18n/locales/*.json.
const EMAIL = 'nikolam0612@gmail.com';

export const profile: Profile = {
  initials: 'NM',
  birthDate: '2000-12-06',
  photo: '/images/profile/profile',
  email: EMAIL,
  // To update the CV, replace public/cv/Nikola_Mihaylov_CV.pdf (keep the name).
  cvUrl: '/cv/Nikola_Mihaylov_CV.pdf',
  socials: [
    { id: 'github', url: 'https://github.com/nikolamihailov', icon: FiGithub },
    { id: 'linkedin', url: 'https://www.linkedin.com/in/nikola-mihaylov/', icon: FiLinkedin },
    { id: 'email', url: `mailto:${EMAIL}`, icon: FiMail },
  ],
};

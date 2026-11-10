import type { IconType } from 'react-icons';

export type TechId =
  | 'react'
  | 'typescript'
  | 'javascript'
  | 'node'
  | 'express'
  | 'nextjs'
  | 'mongodb'
  | 'postgresql'
  | 'sass'
  | 'tailwind'
  | 'threejs'
  | 'redux'
  | 'vite'
  | 'docker'
  | 'git'
  | 'figma'
  | 'html'
  | 'python'
  | 'framer'
  | 'jest'
  | 'css'
  | 'java'
  | 'php'
  | 'wordpress'
  | 'prisma'
  | 'zod'
  | 'vercel'
  | 'netlify'
  | 'angular'
  | 'mongoose'
  | 'jwt'
  | 'reactrouter';

export interface Tech {
  name: string;
  icon: IconType;
  /** Official brand colour, e.g. `#61DAFB`. */
  color: string;
  /** Brand colour if it stays legible on the dark theme, otherwise undefined. */
  onDark?: string;
}

export interface Profile {
  name: string;
  shortName: string;
  initials: string;
  role: string;
  /** Path to a portrait in /public, e.g. `/images/profile.jpg`. */
  photo?: string;
  tagline: string;
  bio: string[];
  location: string;
  email: string;
  cvUrl?: string;
  socials: { label: string; url: string; icon: IconType }[];
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  description: string[];
  /** Base paths of responsive images (no size suffix / extension), first = card thumbnail. */
  images: string[];
  stack: TechId[];
  liveUrl?: string;
  repoUrl?: string;
  year: number;
  role?: string;
}

export interface SkillGroup {
  title: string;
  items: TechId[];
}

/** One role within a company. Dates are `YYYY-MM`; omit `end` for a current role. */
export interface Role {
  title: string;
  employmentType?: 'Full-time' | 'Part-time' | 'Internship' | 'Contract' | 'Freelance';
  start: string;
  end?: string;
  description: string;
  highlights?: string[];
  stack?: TechId[];
}

/** A company with one or more roles, newest role first (LinkedIn style). */
export interface ExperienceEntry {
  id: string;
  company: string;
  /** Path to a logo in /public, e.g. `/images/companies/orbit.svg`. Falls back to initials. */
  logo?: string;
  /** `cover` (default) fills the circle; `contain` fits wide logos on a white background. */
  logoFit?: 'cover' | 'contain';
  url?: string;
  location?: string;
  roles: Role[];
}

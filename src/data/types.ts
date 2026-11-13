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
  | 'reactrouter'
  | 'nestjs'
  | 'claude'
  | 'cursor'
  | 'chatgpt'
  | 'render'
  | 'github'
  | 'gitlab'
  | 'reactquery'
  | 'axios';

export interface Tech {
  name: string;
  icon: IconType;
  /** Official brand colour, e.g. `#61DAFB`. */
  color: string;
  /** Brand colour if it stays legible on the dark theme, otherwise undefined. */
  onDark?: string;
}

/*
 * Content types. Structural data (links, images, dates, stack) lives in src/data/; every
 * human-readable string lives in src/i18n/locales/<lang>.json under `content`, keyed by the
 * same ids. src/i18n/content.ts merges the two into the `Localized*` types below.
 */

export interface Profile {
  initials: string;
  /** "YYYY-MM-DD"; fills `{age}` in the bio so it never needs a yearly edit. */
  birthDate: string;
  /** Base path of the portrait from the image pipeline (images-src/profile/), e.g. `/images/profile/profile`. */
  photo?: string;
  email: string;
  cvUrl?: string;
  /** `id` doubles as the translation key in `socials.<id>`. */
  socials: { id: 'github' | 'linkedin' | 'email'; url: string; icon: IconType }[];
}

export interface ProfileText {
  name: string;
  shortName: string;
  role: string;
  tagline: string;
  location: string;
  /** Paragraphs; `{name}` and `{age}` are filled in from the profile. */
  bio: string[];
}

export type LocalizedProfile = Profile & ProfileText;

export interface Project {
  /** Also the key of the project's text in `content.projects`. */
  slug: string;
  /** Product name: the same in every language. */
  title: string;
  /** Base paths of responsive images (no size suffix / extension), first = card thumbnail. */
  images: string[];
  stack: TechId[];
  liveUrl?: string;
  repoUrl?: string;
  year: number;
}

export interface ProjectText {
  role?: string;
  summary: string;
  description: string[];
}

export type LocalizedProject = Project & ProjectText;

export type SkillGroupId = 'frontend' | 'backend' | 'creative' | 'tooling' | 'ai' | 'deployment';

export interface SkillGroup {
  /** Translation key in `skills.groups`. */
  id: SkillGroupId;
  items: TechId[];
}

export type EmploymentType = 'fullTime' | 'partTime' | 'internship' | 'contract' | 'freelance';

/** One role within a company. Dates are `YYYY-MM`; omit `end` for a current role. */
export interface Role {
  /** Key of the role's title/description in `content.experience.<company id>.roles`. */
  id: string;
  employmentType?: EmploymentType;
  start: string;
  end?: string;
  stack?: TechId[];
}

export interface RoleText {
  title: string;
  description: string;
}

export type LocalizedRole = Role & RoleText;

/** A company with one or more roles, newest role first (LinkedIn style). */
export interface ExperienceEntry {
  /** Also the key of the company's text in `content.experience`. */
  id: string;
  /** Company name: the same in every language. */
  company: string;
  /** Path to a logo in /public, e.g. `/images/companies/orbit.svg`. Falls back to initials. */
  logo?: string;
  /** `cover` (default) fills the circle; `contain` fits wide logos on a white background. */
  logoFit?: 'cover' | 'contain';
  url?: string;
  roles: Role[];
}

export interface ExperienceText {
  /** Empty string = no location shown. */
  location: string;
  roles: Record<string, RoleText>;
}

export interface LocalizedExperienceEntry extends Omit<ExperienceEntry, 'roles'> {
  location?: string;
  roles: LocalizedRole[];
}

import { GenIcon, type IconType } from 'react-icons/lib';
import {
  SiNestjs,
  SiOpenai,
  SiCss3,
  SiDocker,
  SiOpenjdk,
  SiPhp,
  SiWordpress,
  SiPrisma,
  SiZod,
  SiVercel,
  SiNetlify,
  SiRender,
  SiGithub,
  SiGitlab,
  SiAngular,
  SiMongoose,
  SiJsonwebtokens,
  SiReactrouter,
  SiExpress,
  SiFigma,
  SiFramer,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiJest,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedux,
  SiSass,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVite,
} from 'react-icons/si';
import {
  siNestjs,
  siClaude,
  siCursor,
  siReact,
  siTypescript,
  siJavascript,
  siNodedotjs,
  siExpress,
  siNextdotjs,
  siMongodb,
  siPostgresql,
  siSass,
  siTailwindcss,
  siThreedotjs,
  siRedux,
  siVite,
  siDocker,
  siGit,
  siFigma,
  siHtml5,
  siPython,
  siFramer,
  siJest,
  siCss,
  siOpenjdk,
  siPhp,
  siWordpress,
  siPrisma,
  siZod,
  siVercel,
  siNetlify,
  siRender,
  siGithub,
  siGitlab,
  siAngular,
  siMongoose,
  siJsonwebtokens,
  siReactrouter,
} from 'simple-icons';
import type { Tech, TechId } from './types';

/**
 * Builds a react-icons component from a simple-icons entry, for logos the installed
 * react-icons version doesn't ship yet (Claude, Cursor). Same 24×24 viewBox as the
 * other `Si*` icons, so sizing and colouring behave identically.
 */
const fromSimpleIcon = ({ path }: { path: string }): IconType =>
  GenIcon({ tag: 'svg', attr: { viewBox: '0 0 24 24' }, child: [{ tag: 'path', attr: { d: path }, child: [] }] });

// simple-icons removed OpenAI's logo; this is the colour it last listed for it.
const OPENAI_HEX = '412991';

/**
 * A brand's official colour (from simple-icons) plus the colour to draw it in on the
 * dark theme. Several brands are black or near-black (Next.js, Express, Three.js…) and
 * would vanish on the near-black surface, so anything under 2:1 contrast against it
 * gets no `onDark` and the icon falls back to the text colour — which is how those
 * brands present themselves on dark backgrounds anyway.
 */
function brand({ hex }: { hex: string }): Pick<Tech, 'color' | 'onDark'> {
  const color = `#${hex}`;
  return { color, onDark: contrast(hex, '081014') >= 2 ? color : undefined };
}

function luminance(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export const tech: Record<TechId, Tech> = {
  react: { name: 'React', icon: SiReact, ...brand(siReact) },
  typescript: { name: 'TypeScript', icon: SiTypescript, ...brand(siTypescript) },
  javascript: { name: 'JavaScript', icon: SiJavascript, ...brand(siJavascript) },
  node: { name: 'Node.js', icon: SiNodedotjs, ...brand(siNodedotjs) },
  express: { name: 'Express', icon: SiExpress, ...brand(siExpress) },
  nextjs: { name: 'Next.js', icon: SiNextdotjs, ...brand(siNextdotjs) },
  mongodb: { name: 'MongoDB', icon: SiMongodb, ...brand(siMongodb) },
  postgresql: { name: 'PostgreSQL', icon: SiPostgresql, ...brand(siPostgresql) },
  sass: { name: 'SCSS', icon: SiSass, ...brand(siSass) },
  tailwind: { name: 'Tailwind', icon: SiTailwindcss, ...brand(siTailwindcss) },
  threejs: { name: 'Three.js', icon: SiThreedotjs, ...brand(siThreedotjs) },
  redux: { name: 'Redux', icon: SiRedux, ...brand(siRedux) },
  vite: { name: 'Vite', icon: SiVite, ...brand(siVite) },
  docker: { name: 'Docker', icon: SiDocker, ...brand(siDocker) },
  git: { name: 'Git', icon: SiGit, ...brand(siGit) },
  figma: { name: 'Figma', icon: SiFigma, ...brand(siFigma) },
  html: { name: 'HTML5', icon: SiHtml5, ...brand(siHtml5) },
  python: { name: 'Python', icon: SiPython, ...brand(siPython) },
  framer: { name: 'Framer Motion', icon: SiFramer, ...brand(siFramer) },
  jest: { name: 'Jest', icon: SiJest, ...brand(siJest) },
  css: { name: 'CSS', icon: SiCss3, ...brand(siCss) },
  java: { name: 'Java', icon: SiOpenjdk, ...brand(siOpenjdk) },
  php: { name: 'PHP', icon: SiPhp, ...brand(siPhp) },
  wordpress: { name: 'WordPress', icon: SiWordpress, ...brand(siWordpress) },
  prisma: { name: 'Prisma', icon: SiPrisma, ...brand(siPrisma) },
  zod: { name: 'Zod', icon: SiZod, ...brand(siZod) },
  vercel: { name: 'Vercel', icon: SiVercel, ...brand(siVercel) },
  netlify: { name: 'Netlify', icon: SiNetlify, ...brand(siNetlify) },
  render: { name: 'Render', icon: SiRender, ...brand(siRender) },
  github: { name: 'GitHub', icon: SiGithub, ...brand(siGithub) },
  gitlab: { name: 'GitLab', icon: SiGitlab, ...brand(siGitlab) },
  angular: { name: 'Angular', icon: SiAngular, ...brand(siAngular) },
  mongoose: { name: 'Mongoose', icon: SiMongoose, ...brand(siMongoose) },
  jwt: { name: 'JWT', icon: SiJsonwebtokens, ...brand(siJsonwebtokens) },
  reactrouter: { name: 'React Router', icon: SiReactrouter, ...brand(siReactrouter) },
  nestjs: { name: 'NestJS', icon: SiNestjs, ...brand(siNestjs) },
  claude: { name: 'Claude', icon: fromSimpleIcon(siClaude), ...brand(siClaude) },
  cursor: { name: 'Cursor', icon: fromSimpleIcon(siCursor), ...brand(siCursor) },
  chatgpt: { name: 'ChatGPT', icon: SiOpenai, ...brand({ hex: OPENAI_HEX }) },
};

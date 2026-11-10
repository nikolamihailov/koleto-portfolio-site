# Koleto — Portfolio

React + TypeScript SPA (Vite) with SCSS 7-1 styling, Framer Motion animations, a three.js particle-sphere hero and a light/dark theme. No backend: all content lives in typed files in `src/data/`.

## Scripts

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm run preview  # serve dist/ locally
```

## Editing content

| What | File |
| --- | --- |
| Name, bio, socials, email, CV link | `src/data/profile.ts` |
| Projects (cards + `/projects/:slug` pages) | `src/data/projects.ts` |
| Skills | `src/data/skills.ts` |
| Experience timeline | `src/data/experience.ts` |
| Technology names/icons | `src/data/tech.ts` |

- **Project images**: put them in `public/images/projects/` and reference them as `/images/projects/name.png`. The first image is the card thumbnail.
- **Company logos**: put them in `public/images/companies/` and set `logo: '/images/companies/acme.png'`. Without a logo the company's initials are shown.
- **Promotions**: list several roles under one company (newest first) and they're connected LinkedIn-style.
- **New tech**: add an id to `TechId` in `types.ts`, then an entry in `tech.ts` (icons from `react-icons/si`).
- **Logo / favicon**: replace `public/favicon.svg`; for the navbar edit `src/components/Logo.tsx`.

## Project structure

```
src/
├── data/        content + types (the "backend")
├── components/  Loader, Navbar, ParticlesBackground, HeroScene, ProjectCard, ExperienceTimeline, Gallery…
├── sections/    Hero, About, Projects, Skills, Experience
├── pages/       Home, ProjectDetail, NotFound
├── context/     ThemeContext
├── hooks/       useActiveSection, useCssVar
└── styles/      7-1: abstracts, base, components, layout, pages, themes, vendors + main.scss
```

Theme colours are CSS custom properties in `styles/themes/_dark.scss` and `_light.scss`; the particles and the 3D scene read them too.

## Deploy (Netlify) + custom domain from SuperHosting.bg

1. Push the repo to GitHub, then in Netlify: **Add new site → Import from Git**.
   Build command `npm run build`, publish directory `dist`.
   (`public/_redirects` makes `/projects/...` URLs work on refresh.)
2. Netlify → **Domain management → Add a domain** → enter `yourdomain.bg`.
3. At SuperHosting.bg, either:
   - **Option A: keep DNS at SuperHosting** (cPanel → Zone Editor):
     - `A` record for `@` → `75.2.60.5` (Netlify's load balancer)
     - `CNAME` for `www` → `your-site.netlify.app`
   - **Option B: use Netlify DNS**: change the domain's nameservers at SuperHosting to the 4 nameservers Netlify gives you.
4. Wait for DNS to propagate (minutes to a few hours). Netlify then issues a free HTTPS (Let's Encrypt) certificate automatically.

Use option A if you have email or other services on the domain at SuperHosting.

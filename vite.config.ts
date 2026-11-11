import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { experience } from './src/data/experience';
import { profile } from './src/data/profile';
import { projects } from './src/data/projects';
import { skills } from './src/data/skills';
import { tech } from './src/data/tech';
import { formatMonth } from './src/utils/date';

const SITE_URL = 'https://koleto.eu';

/**
 * Emits llms.txt (https://llmstxt.org): a Markdown summary of the site for AI
 * assistants and agents, built from the same data as the site so it never goes stale.
 */
function llmsTxt(): Plugin {
  return {
    name: 'llms-txt',
    apply: 'build',
    generateBundle() {
      const names = (ids: (keyof typeof tech)[]) => ids.map((id) => tech[id].name).join(', ');
      const lines = [
        `# ${profile.name} — ${profile.role}`,
        '',
        `> Portfolio of ${profile.name} ("Koleto"), a ${profile.role.toLowerCase()} based in ${profile.location}. ${profile.tagline}`,
        '',
        ...profile.bio.flatMap((p) => [p, '']),
        '## Projects',
        '',
        ...projects.map((p) => {
          const links = [p.liveUrl && `[live demo](${p.liveUrl})`, p.repoUrl && `[source code](${p.repoUrl})`]
            .filter(Boolean)
            .join(', ');
          return `- [${p.title}](${SITE_URL}/projects/${p.slug}) (${p.year}): ${p.summary} Tech: ${names(p.stack)}.${links ? ` Links: ${links}.` : ''}`;
        }),
        '',
        '## Experience',
        '',
        ...experience.flatMap((e) =>
          e.roles.map(
            (r) =>
              `- ${r.title} at ${e.company}${e.location ? ` (${e.location})` : ''}, ${formatMonth(r.start)} – ${formatMonth(r.end)}: ${r.description}`,
          ),
        ),
        '',
        '## Skills',
        '',
        ...skills.map((g) => `- ${g.title}: ${names(g.items)}`),
        '',
        '## Contact',
        '',
        `- [Email](mailto:${profile.email})`,
        ...profile.socials.filter((s) => !s.url.startsWith('mailto:')).map((s) => `- [${s.label}](${s.url})`),
        ...(profile.cvUrl ? [`- [CV (PDF)](${SITE_URL}${profile.cvUrl})`] : []),
        '',
        '## Optional',
        '',
        `- [Sitemap](${SITE_URL}/sitemap.xml)`,
        '',
      ];
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: lines.join('\n') });
    },
  };
}

/** Emits sitemap.xml at build time from the project list, so it never goes stale. */
function sitemap(): Plugin {
  return {
    name: 'sitemap',
    apply: 'build',
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10);
      const urls = ['/', ...projects.map((p) => `/projects/${p.slug}`)];
      const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls.map((u) => `  <url><loc>${SITE_URL}${u}</loc><lastmod>${today}</lastmod></url>`),
        '</urlset>',
        '',
      ].join('\n');
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: xml });
    },
  };
}

export default defineConfig({
  plugins: [react(), sitemap(), llmsTxt()],
  css: {
    preprocessorOptions: {
      scss: { api: 'modern' },
    },
  },
  build: {
    // three.js is ~220 kB gzipped; it's code-split and only loaded on idle on the home page.
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber'],
          vendor: ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
        },
      },
    },
  },
});

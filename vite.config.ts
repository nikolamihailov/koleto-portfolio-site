import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import sharp from 'sharp';
import { defineConfig, type Plugin } from 'vite';
import { projects } from './src/data/projects';
import { skills } from './src/data/skills';
import { tech } from './src/data/tech';
import { getContent } from './src/i18n/content';
import { findKeyMismatches, LANGS, messages, translate } from './src/i18n/messages';
import { formatMonth } from './src/utils/date';

const SITE_URL = 'https://koleto.eu';

/**
 * Fails the build if any locale is missing a key (or has an extra one) compared with
 * en.json, so a half-translated page can never ship.
 */
function i18nCheck(): Plugin {
  return {
    name: 'i18n-check',
    buildStart() {
      for (const lang of LANGS) {
        const diff = findKeyMismatches(messages.en, messages[lang]);
        if (diff.length) this.error(`[i18n] ${lang}.json does not match en.json:\n  ${diff.join('\n  ')}`);
      }
      // Throws if a project/role in src/data has no text in some language
      LANGS.forEach(getContent);
    },
  };
}

/**
 * Emits llms.txt (https://llmstxt.org): a Markdown summary of the site for AI
 * assistants and agents, built from the same data as the site so it never goes stale.
 */
function llmsTxt(): Plugin {
  return {
    name: 'llms-txt',
    apply: 'build',
    generateBundle() {
      // llms.txt is written in English
      const { profile, projects, experience } = getContent('en');
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
              `- ${r.title} at ${e.company}${e.location ? ` (${e.location})` : ''}, ${formatMonth(r.start, 'en')} – ${formatMonth(r.end, 'en')}: ${r.description}`,
          ),
        ),
        '',
        '## Skills',
        '',
        ...skills.map((g) => `- ${translate('en', `skills.groups.${g.id}`)}: ${names(g.items)}`),
        '',
        '## Contact',
        '',
        `- [Email](mailto:${profile.email})`,
        ...profile.socials
          .filter((s) => s.id !== 'email')
          .map((s) => `- [${translate('en', `socials.${s.id}`)}](${s.url})`),
        ...(profile.cvUrl ? [`- [CV (PDF)](${SITE_URL}${profile.cvUrl})`] : []),
        '',
        '## Languages',
        '',
        'The site is available in English and Bulgarian (switch in the navigation; the choice is remembered).',
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

const escapeHtml = (s: string) =>
  s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

/**
 * Link previews for project pages. Crawlers that build previews (LinkedIn, WhatsApp,
 * Slack, Facebook…) don't run JavaScript, so on a plain SPA every /projects/<slug>
 * link shows the home page's title and image. This writes projects/<slug>.html: a
 * copy of the built index.html whose <head> describes that project, plus a
 * 1200×630 preview image cut from its first screenshot. Netlify serves the file for
 * /projects/<slug> ahead of the SPA fallback; in the browser the app runs as usual.
 */
function projectPreviews(): Plugin {
  let outDir = 'dist';
  return {
    name: 'project-previews',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const template = await readFile(join(outDir, 'index.html'), 'utf8');
      await mkdir(join(outDir, 'projects'), { recursive: true });
      await mkdir(join(outDir, 'og'), { recursive: true });

      // Previews are in English, like the default page
      for (const p of getContent('en').projects) {
        const url = `${SITE_URL}/projects/${p.slug}`;
        const title = escapeHtml(translate('en', 'meta.projectTitle', { project: p.title }));
        const description = escapeHtml(p.summary);
        const image = `${SITE_URL}/og/${p.slug}.jpg`;

        // Each pattern must match exactly once, so a change to index.html can't
        // silently leave a page with the home page's tags.
        const replacements: [RegExp, string][] = [
          [/<title>[^<]*<\/title>/, `<title>${title}</title>`],
          [/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`],
          [/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`],
          [/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`],
          [/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`],
          [
            /<meta property="og:description" content="[^"]*" \/>/,
            `<meta property="og:description" content="${description}" />`,
          ],
          [/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${image}" />`],
        ];
        let html = template;
        for (const [pattern, value] of replacements) {
          if (!pattern.test(html)) this.error(`[project-previews] index.html has no tag matching ${pattern}`);
          html = html.replace(pattern, value);
        }
        await writeFile(join(outDir, 'projects', `${p.slug}.html`), html);

        // Top of the first screenshot (usually the hero), cropped to the 1.91:1 preview ratio
        const screenshot = join(outDir, `${p.images[0]}-1600.webp`);
        await sharp(screenshot)
          .resize(1200, 630, { fit: 'cover', position: 'top' })
          .jpeg({ quality: 82, mozjpeg: true })
          .toFile(join(outDir, 'og', `${p.slug}.jpg`));
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), i18nCheck(), sitemap(), llmsTxt(), projectPreviews()],
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
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});

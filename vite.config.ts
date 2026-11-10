import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { projects } from './src/data/projects';

const SITE_URL = 'https://koleto.eu';

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
  plugins: [react(), sitemap()],
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

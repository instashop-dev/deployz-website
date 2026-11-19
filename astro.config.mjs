// @ts-check
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { createLastmodSerializer } from './scripts/sitemap-lastmod.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://deployz.dev',
  integrations: [react(), sitemap({ serialize: createLastmodSerializer() })],
  vite: {
    plugins: [tailwindcss()],
  },
});

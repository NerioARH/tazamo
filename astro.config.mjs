import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://tazamo.com',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    preact({
      compat: true,
    }),
    mdx(),
  ],
});

import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { config } from './src/config';

export default defineConfig({
  integrations: [mdx()],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'github-light',
      langs: [],
      wrap: true,
      lineNumbers: true,
    },
  },
  site: config.site,
  title: config.title,
  description: config.description,
});

import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { config } from './src/config';
import remarkGfm from 'remark-gfm';
import remarkMermaid from 'remark-mermaidjs';

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
    remarkPlugins: [remarkGfm, remarkMermaid],
  },
  vite: {
    server: {
      fs: {
        allow: ['node_modules'],
      },
    },
  },
  site: config.site,
  title: config.title,
  description: config.description,
});

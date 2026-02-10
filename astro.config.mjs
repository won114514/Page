import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { config } from './src/config';
import remarkGfm from 'remark-gfm';

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
    remarkPlugins: [remarkGfm],
  },
  vite: {
    server: {
      fs: {
        allow: ['node_modules'],
      },
    },
    build: {
      minify: 'terser',
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            mathjax: ['mathjax'],
            search: ['fuse.js'],
          },
        },
      },
    },
  },
  output: 'static',
  compressHTML: true,
  site: config.site,
  title: config.title,
  description: config.description,
});

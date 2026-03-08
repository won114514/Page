import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { config } from './src/config';
import remarkGfm from 'remark-gfm';
import remarkImageOptimizer from './src/plugins/remarkImageOptimizer';
import imageOptimizerPlugin from './src/plugins/imageOptimizerPlugin';

export default defineConfig({
  integrations: [mdx(), imageOptimizerPlugin()],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'github-light',
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
      langs: [],
      wrap: true,
      lineNumbers: true,
    },
    remarkPlugins: [remarkGfm, remarkImageOptimizer],
  },
  vite: {
    server: {
      fs: {
        allow: ['node_modules', '.'],
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

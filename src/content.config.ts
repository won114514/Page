import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const postsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const notificationsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/notifications" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    draft: z.boolean().default(false),
    important: z.boolean().default(false),
  }),
});

export const collections = {
  posts: postsCollection,
  notifications: notificationsCollection,
};

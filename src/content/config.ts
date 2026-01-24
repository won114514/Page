import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const notificationsCollection = defineCollection({
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

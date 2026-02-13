import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    excerpt: z.string().optional(),
    draft: z.boolean().default(false),
    encrypt: z.boolean().default(false),
    aes_key_hint: z.string().optional(),
    aes_key: z.string().optional(),
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

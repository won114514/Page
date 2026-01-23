import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { config } from '../config';

export async function GET() {
  const posts = await getCollection('posts', ({ data }) => {
    return data.draft !== true;
  });

  // 按日期倒序排序
  posts.sort((a, b) => {
    const dateA = new Date(a.data.date);
    const dateB = new Date(b.data.date);
    return dateB.getTime() - dateA.getTime();
  });

  return rss({
    title: config.title,
    description: config.description,
    site: config.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt || '',
      pubDate: post.data.date,
      link: `/posts/${post.slug}`,
    })),
    customData: `<language>zh-CN</language>`,
  });
}

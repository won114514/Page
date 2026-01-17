import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';

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
    title: '我的博客',
    description: '一个极简的静态博客',
    site: 'https://example.com',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt || '',
      pubDate: post.data.date,
      link: `/${post.slug}`,
    })),
    customData: `<language>zh-CN</language>`,
  });
}

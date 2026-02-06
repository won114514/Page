import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { config } from '../config';
import MarkdownIt from 'markdown-it';
import { parse as htmlParser } from 'node-html-parser';
import sanitizeHtml from 'sanitize-html';

const markdownParser = new MarkdownIt();

export async function GET(context: any) {
  if (!context.site) {
    throw Error('site not set');
  }

  const posts = await getCollection('posts', ({ data }) => {
    return data.draft !== true;
  });

  // 按日期倒序排序
  posts.sort((a, b) => {
    const dateA = new Date(a.data.date);
    const dateB = new Date(b.data.date);
    return dateB.getTime() - dateA.getTime();
  });

  const feedItems = [];

  for (const post of posts) {
    // 将markdown转换为html
    const body = markdownParser.render(String(post.body ?? ''));
    // 解析html结构
    const html = htmlParser.parse(body);
    // 处理图片
    const images = html.querySelectorAll('img');

    for (const img of images) {
      const src = img.getAttribute('src');
      if (!src) continue;

      if (src.startsWith('/')) {
        // 处理绝对路径的图片
        img.setAttribute('src', new URL(src, context.site).href);
      }
    }

    feedItems.push({
      title: post.data.title,
      description: post.data.excerpt || '',
      pubDate: post.data.date,
      link: `/posts/${post.slug}`,
      content: sanitizeHtml(html.toString(), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      }),
    });
  }

  return rss({
    title: config.title,
    description: config.description,
    site: config.site,
    items: feedItems,
    customData: `<language>zh-CN</language>`,
  });
}

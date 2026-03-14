import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { config } from '../config';
import MarkdownIt from 'markdown-it';
import { parse as htmlParser } from 'node-html-parser';
import sanitizeHtml from 'sanitize-html';

const markdownParser = new MarkdownIt();

// 图片路径映射
const imageMap: Record<string, string> = {
  'content/posts/assets/img/': '/assets/optimized/',
  '/content/posts/assets/img/': '/assets/optimized/',
  'assets/img/': '/assets/optimized/',
  '/assets/img/': '/assets/optimized/',
};

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
      let src = img.getAttribute('src');
      if (!src) continue;

      // 转换本地图片路径为优化后的图片路径
      for (const [oldPath, newPath] of Object.entries(imageMap)) {
        if (src.includes(oldPath)) {
          // 提取图片文件名
          const fileName = src.split('/').pop() || '';
          // 转换为 WebP 格式路径
          const optimizedFileName = fileName.replace(/\.[^.]+$/, '.webp');
          src = newPath + optimizedFileName;
          break;
        }
      }

      // 处理绝对路径的图片（外部链接保持不变）
      if (src.startsWith('http')) {
        // 外部链接，保持原样
      } else if (src.startsWith('/')) {
        // 绝对路径，移除开头的 /
        img.setAttribute('src', src.substring(1));
      } else {
        // 相对路径，保持原样
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

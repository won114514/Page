import { getCollection } from 'astro:content';
import { unified } from 'unified';
import markdown from 'remark-parse';
import html from 'remark-html';
import strip from 'strip-markdown';

export async function GET() {
  // 获取所有非草稿文章
  const posts = await getCollection('posts', ({ data }) => {
    return data.draft !== true;
  });

  // 按日期倒序排序
  posts.sort((a, b) => {
    const dateA = new Date(a.data.date);
    const dateB = new Date(b.data.date);
    return dateB.getTime() - dateA.getTime();
  });

  // 转换 Markdown 为纯文本
  async function markdownToPlainText(content: string) {
    const processor = unified().use(markdown).use(strip).use(html);
    const result = await processor.process(content);
    return String(result).replace(/<[^>]*>/g, '').trim();
  }

  // 生成搜索索引
  const searchIndex = [];
  
  for (const post of posts) {
    // 转换文章内容为纯文本
    const plainText = await markdownToPlainText(post.body);
    
    // 生成搜索索引项
    searchIndex.push({
      slug: post.slug,
      title: post.data.title,
      date: post.data.date.toISOString().split('T')[0],
      excerpt: post.data.excerpt || plainText.substring(0, 150) + '...',
      content: plainText
    });
  }

  // 返回 JSON 响应
  return new Response(JSON.stringify(searchIndex, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600' // 缓存 1 小时
    }
  });
}
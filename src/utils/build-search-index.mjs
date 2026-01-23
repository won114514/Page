import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { unified } from 'unified';
import markdown from 'remark-parse';
import html from 'remark-html';
import strip from 'strip-markdown';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取所有 Markdown 文件
async function buildSearchIndex() {
  const postsDir = path.join(__dirname, '../../src/content/posts');
  const outputFile = path.join(__dirname, '../../public/search-index.json');
  
  // 确保 output 目录存在
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  
  // 遍历 posts 目录
  const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
  
  const searchIndex = [];
  
  for (const file of files) {
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 解析 Frontmatter
    const frontmatterMatch = content.match(/---([\s\S]*?)---/);
    if (!frontmatterMatch) continue;
    
    const frontmatter = frontmatterMatch[1];
    const body = content.replace(/---[\s\S]*?---/, '').trim();
    
    // 解析 Frontmatter 为对象
    const frontmatterObj = {};
    frontmatter.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length) {
        const value = valueParts.join(':').trim().replace(/^"|"$/g, '');
        frontmatterObj[key.trim()] = value;
      }
    });
    
    // 跳过草稿
    if (frontmatterObj.draft === 'true') continue;
    
    // 转换 Markdown 为纯文本
    const processor = unified().use(markdown).use(strip).use(html);
    const result = await processor.process(body);
    const plainText = String(result).replace(/<[^>]*>/g, '').trim();
    
    // 生成搜索索引项
    const indexItem = {
      slug: file.replace('.md', ''),
      title: frontmatterObj.title || 'Untitled',
      date: frontmatterObj.date || '1970-01-01',
      excerpt: frontmatterObj.excerpt || plainText.substring(0, 150) + '...',
      content: plainText
    };
    
    searchIndex.push(indexItem);
  }
  
  // 写入搜索索引文件
  fs.writeFileSync(outputFile, JSON.stringify(searchIndex, null, 2));
  console.log(`Search index built: ${searchIndex.length} posts`);
}

buildSearchIndex().catch(err => {
  console.error('Error building search index:', err);
  process.exit(1);
});

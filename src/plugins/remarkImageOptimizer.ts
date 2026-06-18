import { visit } from 'unist-util-visit';

interface ImageNode {
  type: 'image';
  url: string;
  alt: string;
  title?: string;
}

interface HtmlNode {
  type: 'html';
  value: string;
}

/**
 * Remark 插件，用于将 Markdown 中的图片转换为优化的图片组件
 */
export default function remarkImageOptimizer() {
  return function (tree: any) {
    visit(tree, 'image', (node: ImageNode) => {
      // 检查是否是本地图片路径
      if (node.url.startsWith('/content/posts/assets/img/') || 
          node.url.startsWith('content/posts/assets/img/')) {
        
        // 转换为组件使用的路径格式
        const src = node.url.replace(/^\/content\/posts\/assets\/img\//, '/content/posts/assets/img/');
        
        // 替换为 Astro 组件语法
        const htmlNode = node as unknown as HtmlNode;
        htmlNode.type = 'html';
        htmlNode.value = `
          <OptimizedImage
            src="${src}"
            alt="${node.alt}"
            ${node.title ? `title="${node.title}"` : ''}
          />
        `;
      }
    });
  };
}
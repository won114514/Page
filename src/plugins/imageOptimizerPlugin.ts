import { AstroIntegration } from 'astro';
import ImageOptimizer from '../utils/imageOptimizer';
import path from 'path';
import fs from 'fs';

interface ImageOptimizerPluginOptions {
  inputDir?: string;
  outputDir?: string;
  quality?: number;
  formats?: string[];
  placeholderSize?: number;
}

export default function imageOptimizerPlugin(options: ImageOptimizerPluginOptions = {}): AstroIntegration {
  return {
    name: 'image-optimizer',
    hooks: {
      'astro:build:start': async () => {
        console.log('🔍 开始处理图片...');
        
        const optimizer = new ImageOptimizer({
          inputDir: options.inputDir || 'src/content/posts/assets/img',
          outputDir: options.outputDir || 'public/assets/optimized',
          quality: options.quality || 80,
          formats: options.formats || ['webp', 'avif'],
          placeholderSize: options.placeholderSize || 20,
        });

        const result = await optimizer.processDirectory();
        
        console.log(`✅ 处理完成 ${result.size} 张图片`);
        
        // 生成图片映射文件，供运行时使用
        const imageMap = Object.fromEntries(result);
        const imageMapPath = path.join('public', 'assets', 'image-map.json');
        
        // 确保目录存在
        const dirname = path.dirname(imageMapPath);
        if (!fs.existsSync(dirname)) {
          fs.mkdirSync(dirname, { recursive: true });
        }
        
        fs.writeFileSync(
          imageMapPath,
          JSON.stringify(imageMap, null, 2)
        );
        
        console.log(`📄 生成图片映射文件: ${imageMapPath}`);
      },
    },
  };
}
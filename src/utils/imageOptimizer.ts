import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// 图片优化配置
interface ImageOptimizerConfig {
  inputDir: string;
  outputDir: string;
  quality: number;
  formats: string[];
  placeholderSize: number;
}

// 图片处理结果
interface ImageProcessResult {
  original: string;
  optimized: string[];
  placeholder: {
    base64: string;
    width: number;
    height: number;
  };
}

class ImageOptimizer {
  private config: ImageOptimizerConfig;

  constructor(config: Partial<ImageOptimizerConfig> = {}) {
    this.config = {
      inputDir: config.inputDir || 'src/content/posts/assets/img',
      outputDir: config.outputDir || 'public/assets/optimized',
      quality: config.quality || 80,
      formats: config.formats || ['webp', 'avif'],
      placeholderSize: config.placeholderSize || 20,
    };

    // 确保输出目录存在
    this.ensureOutputDir();
  }

  // 确保输出目录存在
  private ensureOutputDir() {
    if (!fs.existsSync(this.config.outputDir)) {
      fs.mkdirSync(this.config.outputDir, { recursive: true });
    }
  }

  // 处理单个图片
  async processImage(imagePath: string): Promise<ImageProcessResult | null> {
    try {
      // 检查图片是否存在
      if (!fs.existsSync(imagePath)) {
        console.warn(`Image not found: ${imagePath}`);
        return null;
      }

      // 获取图片信息
      const imageInfo = await sharp(imagePath).metadata();
      if (!imageInfo.width || !imageInfo.height) {
        console.warn(`Invalid image: ${imagePath}`);
        return null;
      }

      // 生成输出文件名
      const fileName = path.basename(imagePath);
      const nameWithoutExt = path.parse(fileName).name;
      const ext = path.extname(fileName).toLowerCase();

      // 生成模糊占位图
      const placeholder = await this.generatePlaceholder(imagePath, imageInfo.width, imageInfo.height);

      // 生成优化后的图片
      const optimized: string[] = [];
      for (const format of this.config.formats) {
        const outputPath = path.join(
          this.config.outputDir,
          `${nameWithoutExt}.${format}`
        );

        // 根据格式设置不同的参数
        const sharpInstance = sharp(imagePath);
        
        // 对于不同格式设置不同的质量参数
        if (format === 'webp') {
          await sharpInstance.webp({ quality: this.config.quality }).toFile(outputPath);
        } else if (format === 'avif') {
          await sharpInstance.avif({ quality: this.config.quality }).toFile(outputPath);
        } else {
          await sharpInstance.toFormat(format as any).toFile(outputPath);
        }

        // 生成相对于 public 目录的路径
        const relativePath = outputPath.replace('public/', '');
        optimized.push(relativePath);
      }

      // 复制原始图片到输出目录
      const originalOutputPath = path.join(
        this.config.outputDir,
        fileName
      );
      fs.copyFileSync(imagePath, originalOutputPath);
      const originalRelativePath = originalOutputPath.replace('public/', '');

      return {
        original: originalRelativePath,
        optimized,
        placeholder,
      };
    } catch (error) {
      console.error(`Error processing image ${imagePath}:`, error);
      return null;
    }
  }

  // 生成模糊占位图
  private async generatePlaceholder(
    imagePath: string,
    width: number,
    height: number
  ): Promise<{
    base64: string;
    width: number;
    height: number;
  }> {
    // 计算占位图尺寸（保持宽高比）
    const aspectRatio = width / height;
    let placeholderWidth = this.config.placeholderSize;
    let placeholderHeight = Math.round(placeholderWidth / aspectRatio);

    if (placeholderHeight > this.config.placeholderSize) {
      placeholderHeight = this.config.placeholderSize;
      placeholderWidth = Math.round(placeholderHeight * aspectRatio);
    }

    // 生成占位图
    const buffer = await sharp(imagePath)
      .resize(placeholderWidth, placeholderHeight, {
        fit: 'cover',
      })
      .toBuffer();

    const base64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;

    return {
      base64,
      width,
      height,
    };
  }

  // 批量处理目录中的所有图片
  async processDirectory(directory: string = this.config.inputDir): Promise<Map<string, ImageProcessResult>> {
    const result = new Map<string, ImageProcessResult>();

    if (!fs.existsSync(directory)) {
      console.warn(`Directory not found: ${directory}`);
      return result;
    }

    const files = fs.readdirSync(directory);
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

    for (const file of files) {
      const filePath = path.join(directory, file);
      const ext = path.extname(file).toLowerCase();

      if (imageExtensions.includes(ext)) {
        const processed = await this.processImage(filePath);
        if (processed) {
          // 存储相对路径作为键
          const relativePath = filePath.replace(`${this.config.inputDir}/`, '');
          result.set(relativePath, processed);
        }
      }
    }

    return result;
  }
}

export default ImageOptimizer;
export type { ImageProcessResult };
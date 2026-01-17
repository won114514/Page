---
title: 你好，世界
date: 2024-01-01
excerpt: 这是我的第一篇博客文章，欢迎来到我的极简博客。
draft: false
---

# 你好，世界

这是我的第一篇博客文章，欢迎来到我的极简博客。

## 关于这个博客

这个博客使用 [Astro](https://astro.build/) 构建，是一个极简的静态博客系统。它的特点是：

- 内容优先，只需编写 Markdown 文件即可发布文章
- 零配置发布，保存 Markdown 文件后，运行一条命令即可生成完整的静态网站
- 开发者友好，项目结构清晰、类型安全、易于扩展
- 支持深色/浅色模式切换
- 支持 RSS 订阅

## 如何使用

1. 在 `content/posts/` 目录下创建 Markdown 文件
2. 编写文章内容，使用 Frontmatter 定义标题、日期等元数据
3. 运行 `pnpm dev` 本地预览
4. 运行 `pnpm build` 构建生产版本

## 代码示例

```javascript
function helloWorld() {
  console.log('Hello, World!');
}

helloWorld();
```

## 结语

希望你喜欢这个极简博客系统！

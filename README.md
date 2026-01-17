# 极简静态博客系统

一个基于 Astro 构建的极简、高可维护性的静态博客系统，核心目标是让用户专注于用 Markdown 编写文章内容，无需关心样式与部署细节。

## 核心理念

- **内容优先**：用户只需在指定目录（`content/posts/`）中编写 .md 文件即可发布文章。
- **零配置发布**：保存 Markdown 文件后，运行一条命令即可生成完整的静态网站。
- **开发者友好**：项目结构清晰、类型安全、易于扩展。

## 技术栈

- **构建工具**：Astro（内容优先、轻量、支持多种框架集成）
- **包管理**：pnpm
- **语言**：TypeScript
- **Markdown 支持**：
  - 原生支持 GitHub Flavored Markdown（GFM）
  - 支持 Frontmatter（YAML 格式）用于定义标题、日期、标签等元数据
  - 集成 Shiki 实现代码高亮
- **UI/UX**：
  - 极简设计，白底黑字，良好排版
  - 响应式布局，适配手机/桌面
  - 支持深色/浅色模式切换
  - 自动生成文章列表页、RSS 订阅

## 项目结构

```
my-blog/
├── content/                 # 文章内容目录
│   └── posts/              # Markdown 文章
│       ├── hello-world.md  # 示例文章1
│       └── my-thoughts.md  # 示例文章2
├── src/
│   ├── components/         # 可复用组件
│   │   ├── Header.astro    # 头部组件
│   │   ├── Footer.astro    # 底部组件
│   │   └── ThemeToggle.astro # 主题切换组件
│   ├── layouts/            # 布局组件
│   │   └── BaseLayout.astro # 基础布局
│   └── pages/              # 页面组件
│       ├── index.astro     # 首页（文章列表）
│       ├── [slug].astro    # 文章详情页
│       └── rss.xml.ts      # RSS 订阅
├── public/                 # 静态资源
│   └── favicon.ico
├── astro.config.mjs        # Astro 配置
├── tsconfig.json           # TypeScript 配置
├── package.json            # 依赖配置
└── README.md               # 项目说明
```

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 本地开发

```bash
pnpm dev
```

启动本地开发服务器，默认地址为 `http://localhost:4321`。编辑 Markdown 文件后，浏览器会自动刷新。

### 构建生产版本

```bash
pnpm build
```

构建产物将输出到 `dist/` 目录。

### 预览生产版本

```bash
pnpm preview
```

## 如何添加新文章

1. 在 `content/posts/` 目录下创建 Markdown 文件
2. 使用 Frontmatter 定义文章元数据，例如：
   ```yaml
   ---
   title: 文章标题
   date: 2024-01-01
   excerpt: 文章摘要
   draft: false
   ---
   ```
3. 编写 Markdown 内容
4. 运行 `pnpm dev` 本地预览，或 `pnpm build` 构建生产版本

## 配置说明

### Astro 配置

编辑 `astro.config.mjs` 文件，可配置：
- Markdown 处理选项
- Shiki 代码高亮主题
- 构建输出目录
- 站点地址

### TypeScript 配置

编辑 `tsconfig.json` 文件，可配置 TypeScript 编译选项。

## 部署

### Vercel

1. 连接 GitHub 仓库到 Vercel
2. 配置构建命令：`pnpm build`
3. 配置输出目录：`dist`
4. 部署完成

### Netlify

1. 连接 GitHub 仓库到 Netlify
2. 配置构建命令：`pnpm build`
3. 配置输出目录：`dist`
4. 部署完成

### GitHub Pages

1. 配置 `.github/workflows/deploy.yml` 文件
2. 推送代码到 GitHub
3. GitHub Actions 自动构建并部署到 GitHub Pages

## 功能特性

- ✅ 内容优先，只需编写 Markdown 文件
- ✅ 零配置发布
- ✅ 支持 TypeScript
- ✅ 自动生成文章列表页（按时间倒序）
- ✅ 支持 RSS 订阅
- ✅ 支持深色/浅色模式切换
- ✅ 响应式设计，适配手机/桌面
- ✅ 代码高亮（Shiki）
- ✅ 支持数学公式（KaTeX）
- ✅ 支持图片懒加载

## 许可证

MIT

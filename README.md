# Yu's Blog

个人博客，记录 AI Agent、Coding Agent、LLM 应用、工程实践与源码阅读。基于 Astro 5、TypeScript、Astro Theme Pure 和 Bun。

## 本地运行

```sh
bun install --frozen-lockfile
bun dev
```

提交前可以运行：

```sh
bun test
bun run build:checked
```

## 内容与页面

- 文章位于 `src/content/blog/`，路由位于 `src/pages/blog/`。
- 首页与个人页面位于 `src/pages/`；通用布局和组件位于 `src/layouts/`、`src/components/`。
- 个人信息、导航、友链和评论配置位于 `src/site.config.ts` 与 `public/links.json`。
- 联系页与友联页目前只展示已确认的信息；评论服务暂未启用。

## 部署

项目使用 Vercel 适配器。部署时设置 `SITE_URL` 为正式站点的完整 HTTPS 域名（推荐）；未设置时会读取 Vercel 提供的生产域名。`bun run build:checked` 会先检查内容与类型，再生成站点和 SEO 文件。

首次上线后请检查首页、文章、联系页、友联页、`/robots.txt` 与 `/sitemap-index.xml`，确认站点域名和个人信息正确。

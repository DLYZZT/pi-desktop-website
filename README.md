# Pi Agent Desktop Website

Pi Agent Desktop 官网

## 本地开发

```bash
npm install
npm run dev
```

构建并执行 Astro、TypeScript 检查：

```bash
npm run build
```

## 多语言内容

网站提供简体中文（根路径）、英文（`/en/`）、法语（`/fr/`）、德语（`/de/`）、西班牙语（`/es/`）、日语（`/ja/`）、韩语（`/ko/`）和繁体中文（`/zh-TW/`）。四类页面共用 `src/components/pages/` 下的英文模板；翻译统一保存在 `src/i18n/messages/`，以英文原文为键。构建时 `src/middleware.ts` 为每个语言的静态页面填入译文，并保留正确的语言链接和 SEO 元信息。

修改英文页面后，先运行 `npx astro build && npm run i18n:extract` 更新英文词条清单，再为其他语言补齐新增词条。`npm run build` 会检查所有页面和词条覆盖情况。页面加载后才出现的文案定义在 `src/i18n/client.ts`，同样使用这些词条文件。

## GitHub Pages 部署

项目包含两条 GitHub Actions 工作流：

- `Website CI`：Pull Request 和非 `main` 分支推送时执行依赖安装、类型检查和静态构建。
- `Deploy to GitHub Pages`：推送到 `main` 或手动触发时构建并部署网站。

首次部署前，在 GitHub 仓库中打开 **Settings → Pages → Build and deployment**，将 **Source** 设置为 **GitHub Actions**。

默认配置会根据 `GITHUB_REPOSITORY` 自动生成 Pages 地址：

- 普通项目仓库：`https://<owner>.github.io/<repository>/`
- `<owner>.github.io` 仓库：`https://<owner>.github.io/`

项目中的页面、图片、样式背景和客户端回退链接都会自动添加 Astro 的 `base` 路径。

### 自定义域名

在仓库的 **Settings → Secrets and variables → Actions → Variables** 中添加：

| 变量 | 示例 |
| --- | --- |
| `ASTRO_SITE_URL` | `https://example.com` |
| `ASTRO_BASE_PATH` | `/` |

然后在 **Settings → Pages → Custom domain** 配置域名和 DNS。使用 GitHub Actions 发布时无需在仓库中维护 `CNAME` 文件。

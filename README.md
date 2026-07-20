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

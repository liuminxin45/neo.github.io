# neo.github.io

这是一个基于 `React + TypeScript + Vite` 的个人网站项目，已经配置好通过 GitHub Actions 自动发布到 GitHub Pages。

## 本地开发

```bash
npm ci
npm run dev
```

## 生产构建

```bash
npm run build
```

构建产物会输出到 `dist/`。

## 自动部署到 GitHub Pages

仓库内已经包含工作流文件 [deploy.yml](/E:/Neo/neo.github.io/.github/workflows/deploy.yml)，当你推送到 `main` 分支时会自动构建并部署。

### 一次性设置

1. 在 GitHub 上创建仓库。
2. 如果你要把它作为个人主页显示，仓库名应为 `你的用户名.github.io`。
3. 进入仓库的 `Settings -> Pages`。
4. 将 `Source` 设置为 `GitHub Actions`。

### 首次推送

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-name>/<your-repo>.git
git push -u origin main
```

### 发布地址

- 用户主页仓库：`https://<your-name>.github.io`
- 普通项目仓库：`https://<your-name>.github.io/<your-repo>/`

## 说明

- [vite.config.ts](/E:/Neo/neo.github.io/vite.config.ts) 当前使用相对 `base`，同时兼容用户主页仓库和普通项目仓库。
- 站点图片资源已按 GitHub Pages 路径规则处理，避免部署后出现资源 404。

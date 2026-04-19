# 部署到 GitHub Pages 指南

## 方式一：GitHub Actions 自动部署（推荐）

项目已配置好自动部署工作流 [deploy.yml](/E:/Neo/neo.github.io/.github/workflows/deploy.yml)，推送到 `main` 分支后会自动构建并发布。

### 1. 在 GitHub 创建仓库

访问 https://github.com/new 创建一个新仓库，名称建议：

- 项目站点：任意仓库名，访问地址为 `https://你的用户名.github.io/仓库名/`
- 用户站点：`你的用户名.github.io`，访问地址为 `https://你的用户名.github.io`

### 2. 推送代码到 GitHub

在项目根目录执行：

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

### 3. 启用 GitHub Pages

1. 打开 GitHub 仓库页面
2. 进入 `Settings`
3. 打开左侧的 `Pages`
4. 将 `Source` 设为 `GitHub Actions`
5. 保存后，之后每次推送到 `main` 都会自动部署

### 4. 查看部署结果

- 用户站点：访问 `https://你的用户名.github.io`
- 项目站点：访问 `https://你的用户名.github.io/仓库名/`
- 部署状态：在仓库 `Actions` 页面查看

---

## 当前项目的路径配置说明

这个项目当前在 [vite.config.ts](/E:/Neo/neo.github.io/vite.config.ts) 中使用：

```ts
base: './'
```

这意味着：

- 发布到 `username.github.io` 根域名时可正常访问
- 发布到 `username.github.io/repo-name/` 子路径时也可正常访问
- 静态资源不会因为仓库名变化而丢失

---

## 常见问题

### 页面空白或资源加载失败

当前项目已经使用兼容 GitHub Pages 的相对路径配置，无需再手动修改 `base`。

### GitHub Actions 没有触发

检查以下几项：

- 代码是否推送到了 `main` 分支
- 仓库 `Settings -> Pages -> Source` 是否设置为 `GitHub Actions`
- 仓库的 Actions 权限是否被禁用

### 自定义域名

1. 在 `public` 目录下创建名为 `CNAME` 的文件，内容为你的域名：

   ```
   www.yourdomain.com
   ```

2. 在域名 DNS 中添加 CNAME 记录指向 `你的用户名.github.io`
3. 如果只使用自定义根域名，可将 `vite.config.ts` 中的 `base` 改为 `/`

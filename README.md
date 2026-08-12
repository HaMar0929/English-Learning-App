# English Learning App

适合英语初学者的轻量、可安装离线网页学习工具。

第一版包含：

- 10 句常用日常英语、中文翻译和使用场景
- 5 组简单日常英语对话
- 基于浏览器 `SpeechSynthesis` 的免费英文朗读
- 适配电脑、iPad 和手机的响应式页面
- 可添加到 iPhone、iPad 主屏幕和 Mac Dock
- 首次正常打开后缓存页面资源，支持离线学习

## 本地运行

```bash
npm install
npm run dev
```

浏览器访问 `http://localhost:3000/`。

## 本地测试 PWA

```bash
npm run pwa
```

浏览器访问终端中显示的本地地址。PWA 只能在生产构建、`localhost` 或 HTTPS
环境中安装和使用离线缓存。

## 检查

```bash
npm test
```

## GitHub Pages 发布准备

项目使用 Vinext 静态导出，生成目录为 `dist/client`。发布工作流会根据仓库名称
自动设置 GitHub Pages 子路径，构建、测试并部署纯静态文件。

在本机模拟仓库名为 `English-Learning-App` 的 Pages 构建：

```bash
npm run test:pages
```

工作流文件位于 `.github/workflows/deploy-pages.yml`。它只会在代码被推送到
`main` 分支后或手动触发时运行；当前准备过程不会上传代码或修改 GitHub 设置。

---
id: introduction
title: 入门
sidebar_label: 入门
slug: /
---

创建 Zmi App ,它提供了无需配置的现代化构建设置。

### 快速开始

```bash
yarn create @zmi-cli/zmi-app my-app # npx @zmi-cli/create-zmi-app my-app

[Make]:  .editorconfig
[Make]:  .gitignore
[Make]:  .prettierignore
[Make]:  .prettierrc
[Make]:  .zmirc.js
[Make]:  package.json
[Make]:  README.md
[Make]:  src/app.css
[Make]:  src/app.jsx
[Make]:  src/index.css
[Make]:  src/index.jsx
[Make]:  src/logo.svg
┌────────────────────────────────────┐
│ Install dependencies: $ yarn       │
│ Start the dev server: $ yarn start │
└────────────────────────────────────┘
```

```bash
 cd my-app
```

### 安装依赖

```bash
$ yarn # npm install

yarn install v1.21.1
[1/4] 🔍  Resolving packages...
success Already up-to-date.
✨  Done in 0.71s.

```

### 启动项目

```bash
yarn run start # npm run start

 DONE  Compiled successfully !
┌────────────────────────────────────────────┐
│ Running metro bundler on Port: 8000        │
│ You can now view your Project: normal-vue  |
├────────────────────────────────────────────┤
│ Localhost: http://localhost:8000/          │
│ Network:   http://192.168.93.104:8000/     │
└────────────────────────────────────────────┘
🎯 time 1.368s
```

然后打开 [http://localhost:8000/](http://localhost:8000/) 查看您的应用.

准备部署到生产环境时，请使用 `npm run build` 创建一个缩小的捆绑包.

```bash
 BUILD  Compiled successfully !

📦 Name: - Size
➜  dist/main.3166ab31.js  42 KB (-4 B)
➜  dist/main.86a8dd21.css  304 B
```

### 立即开始

你并不需要安装或类似的 `Webpack` 还是别的配置工具。它们是预先配置和隐藏的，因此您可以专注于代码。创建一个项目，一切顺利。

**注:您需要 node >= 10**

---
id: scripts
title: 可用的命令
---

在项目目录中，你可以运行：

### zmi dev

在开发模式下运行应用程序。打开 `http://localhost:8000` 以在浏览器中查看它。

如果你进行编辑，页面将重新加载。你还将在控制台中看到任何 **lint** 错误。

### zmi build

将生产应用程序构建到 **dist** 文件夹。它能正确地打包为生产模式中并优化构建以获得最佳性能。

构建将被压缩，文件名中将包含**哈希**。

### zmi webpack

查看当前 **webpack** 配置, 会自动打开浏览器在 `http://localhost:8976` 输出

为了方便阅读, 再输出之前会去掉 **ESLint Config** 和 **HTML template** 相关的配置

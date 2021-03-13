---
id: runtime
title: 运行时配置
---

运行时配置和配置的区别是他跑在浏览器端，基于此，我们可以在这里写函数、jsx、import 浏览器端依赖等等，注意不要引入 node 依赖。

### 入口文件

约定 `src/index.tsx` or `src/index.ts` or `src/index.js` or `src/index.jsx` 为运行时入口。

### HTML

默认没有 html 文件, 如果想自定义模板, 则新建 `src/document.ejs` 会作为默认模板, 比如:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Your App</title>
  </head>
  <body></body>
</html>
```

**注意: 不需要添加 `<div id="root"></div>` 标签, 启动服务时会自动添加**

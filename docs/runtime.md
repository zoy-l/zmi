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
  <body>
    <div id="root"></div>
  </body>
</html>
```

### CSS 预处理器

Zmi 内置支持 `less`，不支持 `sass` 和 `stylus`，但如果有需求,安装对应的 `loader` 即可, 无需其它设置

注: 不支持 **.sass** 文件,默认只支持 **.scss**

### CSS Modules

Zmi 会自动识别 CSS Modules 的使用

```js
// CSS Modules
import styles from './foo.css'

// 非 CSS Modules
import './foo.css'
```

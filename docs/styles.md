---
id: styles
title: 样式表
---

### CSS 预处理器

Zmi 项目默认支持 PostCSS、CSS Modules 和包含 Sass、Less、Stylus 在内的预处理器。

默认内置支持`less`

`sass` 和 `stylus`，需要安装对应的 `loader` 即可

**注: 不支持 .sass 文件,默认只支持 .scss**

### CSS Modules

Zmi 会自动识别 CSS Modules 的使用

```js
// CSS Modules
import styles from './foo.css'

// 非 CSS Modules
import './foo.css'
```

```html
// .vue
<style lang="less" module>
  .div {
    color: blue;
  }
</style>
```

### loaderOptions 配置:

包括:

- [css-loader](https://github.com/webpack-contrib/css-loader)
- [postcss-loader](https://github.com/webpack-contrib/postcss-loader)
- [sass-loader](https://github.com/webpack-contrib/sass-loader)
- [less-loader](https://github.com/webpack-contrib/less-loader)
- [stylus-loader](https://github.com/webpack-contrib/stylus-loader)

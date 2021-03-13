---
id: https
title: 在开发环境中使用 HTTPS
---

### 介绍

在 `.zmirc` 中添加

```js
export default defineConfig({
  devServer: {
    https: true
  }
})
```

然后像往常一样使用 yarn run dev 启动开发服务器

更详细配置参考 [webpack-dev-server](https://webpack.docschina.org/configuration/dev-server/#devserverhttps)

**注意: 服务器将使用自签名证书，因此你的 Web 浏览器在访问页面时基本上会显示警告。**

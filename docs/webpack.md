---
id: webpack
title: Webpack相关
---

### 介绍

Zmi 内部的 webpack 配置是通过 webpack-chain 维护的。这个库提供了一个 webpack 原始配置的上层抽象，使其可以定义具名的 loader 规则和具名插件，并有机会在后期进入这些规则并对它们的选项进行修改。

它允许我们更细粒度的控制其内部配置。接下来有一些常见的在 `.zmirc` 中的 chainWebpack 修改的例子。

### 警告

**应该优先在.zmirc 中修改配置,如果无法完成您的需求,才使用此选项**

> 有些 webpack 选项是基于 .zmirc 中的值设置的，所以不能直接修改。例如你应该修改 .zmirc 中的 outputPath 选项而不是修改 output.path；你应该修改 .zmirc 中的 publicPath 选项而不是修改 output.publicPath。这样做是因为 .zmirc 中的值会被用在配置里的多个地方，以确保所有的部分都能正常工作在一起

### 修改 Loader 选项

```js
// .zmirc.js
module.exports = {
  chainWebpack: (webpackConfig, { createCSSRule, env }) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        // 修改它的选项...
        return options
      })
  }
}
```

**env**:环境变量

**createCSSRule**:创建 css 相关 loader, 一般情况下用不到

比如:

```js
createCSSRule({
  lang: 'less',
  test: /\.less$/,
  loader: 'less-loader',
  options: {...}
})
```

**你需要熟悉 [webpack-chain 的 API ](https://github.com/Yatoo2018/webpack-chain/tree/zh-cmn-Hans)并阅读[一些源码](https://github.com/l-zoy/zmi/tree/main/packages/zmi-webpack/src)以便了解如何最大程度利用好这个选项，但是比起直接修改 webpack 配置，它的表达能力更强，也更为安全**

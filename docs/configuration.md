---
id: configuration
title: 配置参考
sidebar_label: 配置参考
---

### config

Zmi 在 `.zmirc.js` 中配置项目和插件，支持 ts。一份常见的配置如下，

```javascript
export default {
  publicPath: '/static/',
  hash: true
}
```

如果你想在写配置时也有提示，可以通过 zmi 的 `defineConfig` 方法定义配置，然后把 `.zmirc.js` 后缀改成 `.ts`

```js
import { defineConfig } from 'zmi'

export default defineConfig({})
```

### alias

- Type: `object`
- Default: `{}`

配置别名，对引用路径进行映射。

比如：

```js
export default {
  alias: {
    foo: '/tmp/a/b/foo'
  }
}
```

### autoprefixer

- Type: `object`
- Default: `{ flexbox: 'no-2009' }`

设置 [autoprefixer 的配置项](https://github.com/postcss/autoprefixer#options)。

注意：

- 不要设置 `overrideBrowserslist`，此配置被内部接管，通过 `targets` 配置项选择你要兼容的浏览器。

### cache

- Type: `memory | filesystem`
- Default: `memory`

注意:

- `filesystem` 暂时不支持配置其它选项, 缓存位置默认为 `node_modules/.cache/webpack`

### chainWebpack

- Type: `Function`

通过 [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain) 的 API 修改 webpack 配置。

比如：

```js
export default {
  chainWebpack(memo, { env, webpack, createCSSRule }) {
    // 设置 alias
    memo.resolve.alias.set('foo', '/tmp/a/b/foo')

    // 删除内置插件
    memo.plugins.delete('progress')
  }
}
```

支持异步，

```js
export default {
  async chainWebpack(memo) {
    await delay(100)
    memo.resolve.alias.set('foo', '/tmp/a/b/foo')
  }
}
```

### cssModulesTypescript

- type: `{ mode: 'verify' | 'emit' }`
- Default: `undefined`

对按照 css modules 方式引入的 css 或 less 等样式文件，自动生成 ts 类型定义文件。

比如：

```js
export default {
  cssModulesTypescriptLoader: {}
}
```

等同于以下配置，`mode` 默认为 `emit`，

```js
export default {
  cssModulesTypescriptLoader: {
    mode: 'emit'
  }
}
```

### define

- Type: `object`
- Default: `{}`

用于提供给代码中可用的变量。

比如：

```js
export default {
  define: {
    FOO: 'bar'
  }
}
```

然后你写 `console.log(hello, FOO);` 会被编译成 `console.log(hello, 'bar')`。

注意：

- define 对象的属性值会经过一次 JSON.stringify 转换

内置的 define 属性，

- process.env.NODE_ENV，值为 `development` 或 `production`

如果你有一些不想在生成环境运行的代码，比如断言判断，可以这样，

```js
if (process.env.NODE_ENV === 'development') {
  assert(foo === bar, 'foo is not equal to bar')
}
```

dev 时正常运行，build 后会变成为，

```js
if (false) {
  assert(foo === bar, 'foo is not equal to bar')
}
```

进而被压缩掉，不输出在生成环境的代码中。

### devServer

- Type: `object`
- Default: `{}`

配置开发服务器。

详细配置请查看: [Webpack-dev-server](https://webpack.js.org/configuration/dev-server/)

### devtool

- Type: `string`
- Default: `eval-cheap-module-source-map` in dev, `false` in build

用户配置 sourcemap 类型。

常见的可选类型有：

- eval，最快的类型，但不支持低版本浏览器，如果编译慢，可以试试
- source-map，最慢最全的类型

详细配置请查看: [webpack-devtool](https://webpack.js.org/configuration/devtool/#devtool)。

### disableESLint

- Type: `boolean`
- Default: `true`

编译时的检查:

```js
┌────────────────────────────────────────────┐
│ Running metro bundler on Port: 8000        │
│ You can now view your Project: normal-vue  |
├────────────────────────────────────────────┤
│ Localhost: http://localhost:8000/          │
│ Network:   http://192.168.93.104:8000/     │
└────────────────────────────────────────────┘
🚸 Compile warning.

src/tsx.tsx
  Line 6:9:  Property name "tsx" is not PascalCase  vue/component-definition-name-casing

src/home.vue
  Line 11:9:  Property name "home" is not PascalCase  vue/component-definition-name-casing
```

### externals

- Type: `object`
- Default: `{}`

设置哪些模块可以不被打包，通过 `<script>` 或其他方式引入。

比如，

```js
export default {
  externals: {
    react: 'window.React'
  },
  scripts: ['https://unpkg.com/browse/react@16.12.0/umd/react.production.min.js']
}
```

简单理解的话，可以理解为 `import react from 'react'` 会被替换为 `const react = window.React`。

### extraBabelPlugins

- Type: `Array`
- Default: `[]`

配置额外的 babel 插件。

比如：

```js
export default {
  extraBabelPlugins: ['babel-plugin-react-require']
}
```

### extraBabelPresets

- Type: `Array`
- Default: `[]`

配置额外的 babel 插件集。

### extraPostCSSPlugins

- Type: `Array`
- Default: `[]`

配置额外的 [postcss 插件](https://github.com/postcss/postcss/blob/master/docs/plugins.md)。

### favicon

- Type: `string`

配置 favicon 地址（href 属性）。

比如，

```js
export default {
  favicon: '/assets/favicon.ico'
}
```

> 如果要使用本地的图片，图片请放到 `public` 目录

HTML 中会生成，

```html
<link rel="shortcut icon" type="image/x-icon" href="/assets/favicon.ico" />
```

### frameType

- Type: `vue | react | miniApp`
- Default: `undefined`

指定运行框架

> 一般不用指定, 会自动识别, 如果遇到识别错误可以手动指定

### frameOptions

- Type: `object`
- Default: `{}`

特定于框架的选项

### hash

- Type: `boolean`
- Default: `false`

配置是否让生成的文件包含 hash 后缀，通常用于增量发布和避免浏览器加载缓存。

启用 hash 后，产物通常是这样，

```bash
+ dist
  - logo.sw892d.png
  - main.df723s.js
  - main.8sd8fw.css
  - index.html
```

注：

- html 文件始终没有 hash

### headScripts

- Type: `Array`
- Default: `[]`

配置 `<head>` 里的额外脚本，数组项为字符串或对象。

大部分场景下用字符串格式就够了，比如：

```js
export default {
  headScripts: [`alert(1);`, `https://a.com/b.js`]
}
```

会生成 HTML，

```html
<head>
  <script>
    alert(1)
  </script>
  <script src="https://a.com/b.js"></script>
</head>
```

如果要使用额外属性，可以用对象的格式，

```js
export default {
  headScripts: [
    { src: '/foo.js', defer: true },
    { content: `alert('你好');`, charset: 'utf-8' }
  ]
}
```

会生成 HTML，

```html
<head>
  <script src="/foo.js" defer></script>
  <script charset="utf-8">
    alert('你好')
  </script>
</head>
```

### htmlPlugin

- Type: `object`
- Default: `{}`

详细配置:[html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)

### ignoreMomentLocale

- Type: `true`
- Default: `false`

忽略 moment 的 locale 文件，用于减少尺寸。

### links

- Type: `Array`
- Default: `[]`

配置额外的 link 标签。

### loaderOptions

- Type: `object`
- Default: `{ lessLoader: {}, scssLoader: {}, stylusLoader: {}, styleLoader: {}, cssLoader: {} },`

设置各 `loader` 的配置

### metas

- Type: `Array`
- Default: `[]`

配置额外的 meta 标签。数组中可以配置`key:value`形式的对象。

最终生成的 meta 标签格式为: `<meta key1="value1" key2="value2"/>`。

如以下配置:

```js
export default {
  metas: [
    {
      bar: 'foo'
    }
  ]
}
```

最终生成的 html 标签是:

```html
<meta bar="foo" />
```

### outputPath

- Type: `string`
- Default: `dist`

指定输出路径。

注意：

- 不允许设定为 `src`、`public`、`pages`、`mock`、`config` 等约定目录

### publicPath

- Type: `publicPath`
- Default: `/`

配置 `webpack` 的 `publicPath`。当打包的时候，`webpack` 会在静态文件路径前面添加 `publicPath` 的值，当你需要修改静态文件地址时，比如使用 CDN 部署，把 `publicPath` 的值设为 CDN 的值就可以。如果使用一些特殊的文件系统，比如混合开发或者 cordova 等技术，可以尝试将 `publicPath` 设置成 `./`。

### scripts

- Type: `Array`
- Default: `[]`

同 `headScripts`，配置 `<body>` 里的额外脚本。

### styles

- Type: `Array(string)`
- Default: `[]`

配置额外 CSS。

比如：

```js
export default {
  styles: [`body { color: red; }`, `https://a.com/b.css`]
}
```

会生成 HTML，

```html
<head>
  <style>
    body {
      color: red;
    }
  </style>
  <link rel="stylesheet" href="https://a.com/b.css" />
</head>
```

### targets

- Type: `object`
- Default: `{ chrome: 49, firefox: 64, safari: 10, edge: 13, ios: 10 }`

配置需要兼容的浏览器最低版本，会自动引入 polyfill 和做语法转换。

比如要兼容 ie11，需配置：

```js
export default {
  targets: {
    ie: 11
  }
}
```

注意：

- 配置的 targets 会和合并到默认值，不需要重复配置
- 子项配置为 `false` 可删除默认配置的版本号

### terserOptions

- Type: `object`
- Default: [terserOptions.ts](https://github.com/umijs/umi/blob/master/packages/bundler-webpack/src/getConfig/terserOptions.ts)

配置[压缩器 terser 的配置项](https://github.com/terser/terser#minify-options)。

### title

- Type: `string`
- Default: `''`

配置标题。

比如：

```js
export default {
  title: 'hi'
}
```

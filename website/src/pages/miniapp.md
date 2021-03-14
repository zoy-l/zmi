---
id: miniapp
title: 小程序配置
---

### 介绍

小程序配置是独立的, 默认模板的是 `微信小程序` 的, 如果想用于其它小程序, 手动拷贝一下代码到`src`目录下, 安装相关小程序的`types`即可, js 编译也是支持的

小程序编译是 file for file 模式, 默认支持 `less` 预处理器,

### ESLint

默认是支持的, 由于小程序官方没有 eslint 插件

只能用

```js
extends:["zmi/base"] //js
```

或者

```js
extends:["zmi/typescript"] // typescript
```

比如:

```js
// .erlintrc
{
  "root": true,
  "extends": ["zmi/typescript"]
}
```

### config

Zmi 在 `.zmirc.js` 中配置项目和插件，支持 ts。一份常见的配置如下，

```javascript
export default {
  entry: 'src'
}
```

### paths

- Type: `object`
- Default: `{}`

配置别名，对引用路径进行映射。

比如：

```js
export default {
  paths: {
    '@': '/tmp/a/b/foo'
  }
}

import foo from '@/foo'
// 编译成
import foo from './src/foo'
```

### entry

- Type: `string`
- Default: `src`

监听的目录。

### output

- Type: `string`
- Default: `miniprogram`

输出的目录。

### esBuild

- Type: `boolean`
- Default: `false`

是否启用`esbuild`编译, 默认是`babel`

### disableTypes

- Type: `boolean`
- Default: `false`

是否需要输出 d.ts 文件

### lessOptions

- Type: `object`
- Default: `{}`

详细配置请参考[gulp-less](https://github.com/gulp-community/gulp-less)

### extraBabelPlugins

- Type: `string[]`
- Default: `[]`

额外的 babel 插件

### extraBabelPresets

- Type: `string[]`
- Default: `[]`

额外的 babel 预设

### beforeReadWriteStream

- Type: `Function`

文件 tranfrom 开始前执行

会传入三个参数

- [through2](https://github.com/rvagg/through2)
- [insert](https://github.com/rschmukler/gulp-insert)
- [gulpIf](https://github.com/robrich/gulp-if)

可以直接使用 `gulp` 插件

### afterHook

- Type: `Function`

输出文件至目录后执行

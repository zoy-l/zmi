---
id: environment
title: 环境变量
---

### 执行命令时添加

比如，

**OS X, Linux**

```bash
$ PORT=3000 zmi dev
```

**Windows (cmd.exe)**

```bash
$ set PORT=3000&&zmi dev
```

如果要同时考虑 **OS X** 和 **Windows**，可借助三方工具 `cross-env`，

```bash
$ yarn add cross-env --dev $ cross-env PORT=3000 umi dev
```

### 在 .env 文件中定义

Zmi 中约定根目录下的 .env 为环境变量配置文件。

比如：

```bash
PORT=3000
```

然后执行，

```bash
$ zmi dev
```

会以 `3000` 端口启动 dev server, 默认为 `8000`.

### NODE_ENV

设置 `开发环境` 或 `生产环境`, 一般不需要特别设置

默认 dev `NODE_ENV = 'development'` or build `NODE_ENV = 'production'`

### ANALYZER

用于分析 bundle 构成，默认关闭。

比如：

```bash
$ ANALYZE=1 zmi dev # $ ANALYZE=1 zmi build
```

### APP_ROOT

指定项目根目录。

注意：`APP_ROOT` 不能配在 `.env` 中，只能在命令行里添加

### HOST

默认是 `0.0.0.0`

### PORT

指定端口号，默认是 `8000`.

### ZMI_ENV

可以通过环境变量 ZMI_ENV 区分不同环境来指定配置。

举个例子

```js
// .zmirc.js  export default { a: 1, b: 2 };

// .zmirc.cloud.js  export default { b: 'cloud', c: 'cloud' };

// .zmirc.local.js  export default { c: 'local' };
```

不指定 ZMI_ENV 时，拿到的配置是：

```js
{ a: 1, b: 2, c: 'local', }
```

指定 ZMI_ENV=cloud 时，拿到的配置是：

```js
{ a: 1, b: 'cloud', c: 'cloud', }
```

### ZMI_TEST

内部测试使用

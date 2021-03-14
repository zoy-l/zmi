## Zmi

[![codecov](https://codecov.io/gh/l-zoy/zmi/branch/main/graph/badge.svg?token=804YLQMX9B)](https://codecov.io/gh/l-zoy/zmi) [![GitHub license](https://img.shields.io/github/license/l-zoy/zmi)](https://github.com/l-zoy/zmi/blob/master/LICENSE) [![<ORG_NAME>](https://circleci.com/gh/l-zoy/zmi.svg?style=svg)](https://app.circleci.com/pipelines/github/l-zoy/zmi) ![node-current](https://img.shields.io/node/v/zmi)

🎃 一个纯粹的 react / vue / miniapp-ts 应用程序脚手架。

> 考虑点击 star, 谢谢您的 🌟 和支持
>
> 此项目插件机制是 fork `UmiJs` 的重写及修改

## Features

- 🔩 **可扩展** 一切皆为插件,完整的生命周期

- 📦 **开箱即用** 一个依赖项即可同时支持 `vue` / `react` / `miniapp`. 默认支持 `typescript`, 安装 `typescript`, 添加 `tsconfig.json` 即可

- 🙅 **大量不自研** 优先使用成熟的社区解决方案, 保证稳定性

- 🤷‍♂️ **没有路由** 不参与 runtime，`zmi` 是一个纯粹的脚手架工具

- 🎉 基于最新的 **webpack5** 支持 vue3.x, react 17.x, 小程序 file to file 编译

## Documentation

- 有关更多详细信息请访问:
- [Doc v1](https://l-zoy.github.io/zmi/) [Doc v1(国内)](https://zaire.gitee.io/zmi/)

## Quick start

创建项目

```bash
$ yarn create @zmi-cli/zmi-app
# npx @zmi-cli/create-zmi-app
```

Install dependency

```bash
$ cd myApp && yarn
```

Start development

```bash
$ zmi dev
```

![Image text](./website/static/img/code.gif)

## LICENSE

[MIT](https://github.com/l-zoy/zmi/blob/main/LICENSE)

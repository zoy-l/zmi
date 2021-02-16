简体中文 | [English](./README.md)

## Zmi

🎃 一个纯粹的 react / vue / miniapp-ts 应用程序脚手架。

> 考虑点击 star, 谢谢您的 🌟 和支持
>
> 此项目是 fork `UmiJs` 的重写及修改

## Features

- 🔩 **可扩展** 一切皆为插件,完整的生命周期

- 📦 **开箱即用** 一个依赖项即可同时支持 `vue` / `react` / `miniapp`. 默认支持 `typescript`, 安装 `typescript`, 添加 `tsconfig.json` 即可

- 🙅 **大量不自研** 优先使用成熟的社区解决方案, 保证稳定性

- 🤷‍♂️ **没有路由** 不参与 runtime，`zmi` 是一个纯粹的脚手架工具

- 🎉 基于最新的 **webpack5** 支持vue3.x, react 17.x, 小程序file to file 编译

## Why?

- 那为什么不直接使用 UmiJs?

  - Zmi 定位是一个纯粹通用型**脚手架**工具 ,没有过多的集成,所以如果您需要高度集成,那么 UmiJs 可能更适合您

- 为什么不是 create-react-app
  - 不想要高度集成, 又想可配置

## Quick start

```bash
# Create project
$ yarn create @zmi-cli/zmi-app
# or npx @zmi-cli/create-zmi-app

# Install dependency
$ cd myApp && yarn

# Start development
$ zmi dev
```

## LICENSE

[MIT](https://github.com/l-zoy/zmi/blob/main/LICENSE)

English | [简体中文](https://github.com/l-zoy/zmi/blob/main/README.zh-CN.md)

## Zmi

[![codecov](https://codecov.io/gh/l-zoy/zmi/branch/main/graph/badge.svg?token=804YLQMX9B)](https://codecov.io/gh/l-zoy/zmi) [![GitHub license](https://img.shields.io/github/license/l-zoy/zmi)](https://github.com/l-zoy/zmi/blob/master/LICENSE) [![<ORG_NAME>](https://circleci.com/gh/l-zoy/zmi.svg?style=svg)](https://app.circleci.com/pipelines/github/l-zoy/zmi)

🎃 A purely controllable react/vue/miniapp-ts application framework.

> Consider starring, thank you 🌟 and support.
>
> The plug-in mechanism of this project is a rewrite and modification of fork `UmiJs`

## Features

- 🔩 **Extensible** Everything is plug-in, complete life cycle

- 📦 **Out of the box** One dependency can support both `vue` / `react` / `miniapp` `typescript` is supported by default, install `typescript`, add `tsconfig.json`

- 🙅 **A large number of no self-research** Use mature community solutions first

- 🤷‍♂️ **No routing** Not involved in runtime, `zmi` is a pure scaffolding tool

- 🎉 **Based** on the latest `webpack 5`, Support vue3.x, react 17.x, miniapp file to file transform

## Why?

- Then why not use UmiJs directly?

  - Zmi positioning is a purely universal **scaffolding** tool without too much integration, so if you need a high degree of integration, then UmiJs may be more suitable for you

- Why not create-react-app
  - Don't want to be highly integrated, but also configurable

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

<!-- yarn debug examples/normal dev -->

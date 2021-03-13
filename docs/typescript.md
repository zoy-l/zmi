---
id: typescript
title: 添加Typescript
---

### 简介

Zmi 默认支持 Typescript

要使用 TypeScript 启动新的项目，你可以运行：

```js
$ yarn create @zmi-cli/zmi-app my-app
$ Choose the template you want:
➜ 'react-ts'
➜ 'vue-ts'
```

选择带**ts**后缀的模板即可

如果是在已有的项目中开启 `Typescript` 则只需要添加`tsconfig.json` 和安装 `typescript` 即可

### 常用配置:

如果是 vue 项目 这里改成 请把**jsx**改成`preserve`.

`zmi/client` 提供了一些 **媒体文件** 及 **css 文件** 的类型定义,比如:`.css` `.mp4` `.jpg` 等

```json
{
  "compilerOptions": {
    "strict": true,
    "jsx": "react"
    "target": "esnext",
    "module": "esnext",
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "sourceMap": true,
    "suppressImplicitAnyIndexErrors": true,
    "types": ["zmi/client"]
  },
  "include": ["src"],
  "exclude": ["dist", "node_modules"]
}
```

### Vue 配置

Vue 项目 默认支持 `tsx/jsx` 编写组件

如果需要在模板组件里编写 ts, 则建议安装 `VueDx` vscode 插件,获取友好的开发体验

如果不想安装, 则需要自己手动添加 `.vue` 文件的类型定义

```typescript
declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const componentOptions: ComponentOptions
  export default componentOptions
}
```

---
id: eslint
title: 添加ESlint
---

### 简介

Zmi 默认支持`ESLint`

默认是关闭的, 只需要在项目根目录添加`.eslintrc`文件即可

内部添加了常用的规则项,开箱即用, `typescript/javascript` 无需区分, 内部会自动识别添加相关的规则

更详细配置请参考 [eslint-config-zmi](https://github.com/l-zoy/eslint-config-zmi)

### React

```json
{
  "root": true,
  "extends": ["zmi/react"]
}
```

### Vue

```json
{
  "root": true,
  "extends": ["zmi/vue"]
}
```

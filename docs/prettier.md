---
id: prettier
title: 添加Prettier
---

### 介绍

Zmi 默认支持`prettier`

在项目根目录添加 `.prettierrc` 文件

### 常用配置

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 80,
  "overrides": [
    {
      "files": ".prettierrc",
      "options": { "parser": "json" }
    }
  ]
}
```

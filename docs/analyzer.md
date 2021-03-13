---
id: analyzer
title: 分析包大小
---

### 介绍

使用 `webpack-bundle-analyzer` 分析 JavaScript 包。 这有助于你了解代码膨胀的来源。

默认已添加,通过设置环境变量来开启,比如:

```js
$ ANALYZE=1 zmi dev
// or
$ ANALYZE=1 zmi build
```

或者在`.env`文件中定义

```json
PORT=3000
ANALYZE=1
```

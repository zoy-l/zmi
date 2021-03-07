## 提交消息约定

> 这是改编自 Angular 的 commit 约定[Angular's commit convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular).

#### TL;DR:

消息必须使用以下正则表达式进行匹配：

```js
;/^(revert: )?(feat|fix|docs|dx|style|refactor|perf|test|workflow|build|ci|chore|types|wip|dep)(\(.+\))?: .{1,50}/
```

#### Examples

出现在 "Features" 标题下的 `compiler` 子标题：

```
feat(compiler): add 'comments' option
```

出现在 "Bug Fixes" 标题下的, `v-model` 子标题, 带有发出问题`＃28`的链接:

```
fix(v-model): handle events on blur

close #28
```

出现在 "Performance Improvements" 标题和 "Breaking Changes" 下, 需要带有重大更改说明:

```
perf(core): improve vdom diffing by removing 'foo' option

BREAKING CHANGE: The 'foo' option has been removed.
```

如果下面的 commit 和 commit `667ecc1` 在同一发行版中，则它们不会出现在更改日志中.如果不是，则还原提交将显示在 "Reverts" 标题下。

```
revert: feat(compiler): add 'comments' option

This reverts commit 667ecc1654a317a13331b17617d973392f415f02.
```

### Full Message Format

提交消息由 **header**, **body** 和 **footer** 组成. 标题具有 **type**, **scope** 和 **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

**header** 是必填的，标题的 **scope** 是可选的。

### Revert

如果该提交恢复了先前的提交，则应以`revert：`开头，后跟该恢复的提交的标题。在主体中，它应该说：`his reverts commit <hash>`，其中哈希是要还原的提交的 SHA。

### Type

如果前缀为`feat`，`fix`或`perf`，它将出现在变更日志中。但是，如果有任何 [BREAKING CHANGE](＃footer)，则提交将始终出现在更改日志中。

其他前缀由您自行决定。对于与变更日志无关的任务，建议的前缀为`docs`，`chore`，`style`，`refactor`和`test`。

### Scope

范围可以是指定提交更改位置的任何内容。例如`core`，`compiler`，`ssr`，`v-model`，`transition`等...

### Subject

该主题包含对变更的简洁描述：

- 使用命令式现在的时态: "change" 而不是 "changed" 或 "changes"
- 不要将首字母大写
- 末尾没有点(.)

### Body

就像在 **subject** 中一样, 使用命令式现在时态: "change" 而不是 "changed" 或 "changes".

身体应包括改变的动机，并将其与以前的行为进行对比。

### Footer

页脚应包含有关**Breaking Changes** 的所有信息，并且也是引用 **Closes** 的 GitHub 问题的地方。

**Breaking Changes** 应以单词 `BREAKING CHANGE:` 开头. 并以空格或两个换行符开头.然后，将其余的提交消息用于此目的.

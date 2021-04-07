import HtmlWebpackPlugin from 'html-webpack-plugin'
import { prettier } from 'eslint-config-zmi'
import { Compiler } from 'webpack'

export default class PrettierHtml {
  isInit = false

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap('PrettierHtml', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'PrettierHtml',
        (data, cb) => {
          // prettier the content
          // Node 8 not support prettier v2
          // https://github.com/prettier/eslint-plugin-prettier/issues/278
          // It only needs to be done once
          /* istanbul ignore next */
          if (!this.isInit) {
            try {
              data.html = prettier.format(data.html, {
                parser: 'html'
              })
            } catch {
              // ig-ignore
            }

            this.isInit = true
          }

          cb(null, data)
        }
      )
    })
  }
}

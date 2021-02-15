import HtmlWebpackPlugin from 'html-webpack-plugin'
import { Compiler } from 'webpack'
import prettier from 'prettier'

export default class PrettierHtml {
  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap('PrettierHtml', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'PrettierHtml',
        (data, cb) => {
          // prettier the content
          // Node 8 not support prettier v2
          // https://github.com/prettier/eslint-plugin-prettier/issues/278
          try {
            data.html = prettier.format(data.html, {
              parser: 'html'
            })
          } catch {
            // ig-ignore
          }

          cb(null, data)
        }
      )
    })
  }
}

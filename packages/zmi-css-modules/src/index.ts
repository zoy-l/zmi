import { NodePath } from '@babel/traverse'
import { babelTypes } from '@zmi-cli/utils'
import path from 'path'

const cssExtenders = ['.css', '.less', '.sass', '.scss', '.stylus', '.styl']

export default function () {
  return {
    visitor: {
      ImportDeclaration(content: NodePath<babelTypes.ImportDeclaration>) {
        const { specifiers, source } = content.node
        const { value } = source

        if (specifiers.length && cssExtenders.includes(path.extname(value))) {
          source.value = `${value}?module`
        }
      }
    }
  }
}

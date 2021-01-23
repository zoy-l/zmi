import { NodePath } from '@babel/traverse'
import { babelTypes } from '@zmi/utils'
import { extname } from 'path'

const cssExtenders = ['.css', '.less', '.sass', '.scss', '.stylus', '.styl']

export default function () {
  return {
    visitor: {
      ImportDeclaration(path: NodePath<babelTypes.ImportDeclaration>) {
        const { specifiers, source } = path.node
        const { value } = source

        if (specifiers.length && cssExtenders.includes(extname(value))) {
          source.value = `${value}?module`
        }
      }
    }
  }
}

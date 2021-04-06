import path from 'path'

const cssExtenders = ['.css', '.less', '.sass', '.scss', '.stylus', '.styl']

export default function () {
  return {
    visitor: {
      ImportDeclaration(content: any) {
        const { specifiers, source } = content.node
        const { value } = source

        if (specifiers.length && cssExtenders.includes(path.extname(value))) {
          source.value = `${value}?module`
        }
      }
    }
  }
}

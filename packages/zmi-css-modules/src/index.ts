import { extname } from 'path'

export interface IOpts {
  flag?: string
}

const CSS_EXTNAMES = ['.css', '.less', '.sass', '.scss', '.stylus', '.styl']

export default function () {
  return {
    visitor: {
      ImportDeclaration(path: any, state: any) {
        const {
          specifiers,
          source,
          source: { value }
        } = path.node
        if (specifiers.length && CSS_EXTNAMES.includes(extname(value))) {
          source.value = `${value}?${state.flag || 'modules'}`
        }
      }
    }
  }
}

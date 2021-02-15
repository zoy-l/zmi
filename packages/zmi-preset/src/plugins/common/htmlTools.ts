import { IScriptConfig, IStyleConfig, IStyle } from '@zmi-cli/types'
import { lodash } from '@zmi-cli/utils'

const EXP_URL = /^(http:|https:)?\/\//

export const formatScripts = (option: IScriptConfig): IScriptConfig => {
  if (Array.isArray(option) && option.length > 0) {
    return option
      .filter((script) => !lodash.isEmpty(script))
      .map((script) =>
        // [{ content: '', async: true, crossOrigin: true }]
        typeof script !== 'string'
          ? script
          : EXP_URL.test(script)
          ? { src: script }
          : { content: script }
      )
  }
  return []
}

export const formatStyles = (
  option: IStyleConfig
): [Partial<HTMLLinkElement>[], IStyle[]] => {
  const linkArr: Partial<HTMLLinkElement>[] = []
  const styleArr: IStyle[] = []
  if (Array.isArray(option) && option.length > 0) {
    option.forEach((style) => {
      if (typeof style === 'string') {
        if (EXP_URL.test(style)) {
          linkArr.push({
            charset: 'utf-8',
            rel: 'stylesheet',
            type: 'text/css',
            href: style
          })
        } else {
          styleArr.push({
            content: style
          })
        }
      }
      if (typeof style === 'object') {
        styleArr.push(style)
      }
    })
  }
  return [linkArr, styleArr]
}

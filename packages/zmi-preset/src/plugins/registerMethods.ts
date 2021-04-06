import { IApi } from '@zmi-cli/types'

export default function (api: IApi) {
  const presetApiMethods = [
    'onBuildComplete',
    'chainWebpack',
    'addHTMLMetas',
    'addHTMLLinks',
    'addHTMLStyles',
    'addHTMLHeadScripts',
    'addHTMLScripts',
    'modifyHTML'
  ]

  presetApiMethods.forEach((name) => {
    api.registerMethod({ name })
  })
}

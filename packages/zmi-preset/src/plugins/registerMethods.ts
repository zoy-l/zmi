export default function (api: any) {
  const presetApiMethods = [
    'onExit',
    'onBuildComplete',
    'onDevCompileDone',
    'chainWebpack',
    'addHTMLMetas',
    'addHTMLLinks',
    'addHTMLStyles',
    'addHTMLHeadScripts',
    'addHTMLScripts'
  ]
  presetApiMethods.forEach((name) => {
    api.registerMethod({ name })
  })
}

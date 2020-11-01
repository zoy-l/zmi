export default function (api: any) {
  const presetApiMethods = [
    'onExit',
    'onBuildComplete',
    'onDevCompileDone',
    'chainWebpack'
  ]
  presetApiMethods.forEach((name) => {
    api.registerMethod({ name })
  })
}

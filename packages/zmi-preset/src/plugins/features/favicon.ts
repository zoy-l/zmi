export default function (api: any) {
  api.describe({
    key: 'favicon',
    config: {
      schema(joi: any) {
        return joi.string()
      }
    }
  })

  console.log(api)

  // api.addHTMLLinks(() => [
  //   {
  //     rel: 'shortcut icon',
  //     type: 'image/x-icon',
  //     href:
  //       api.config.favicon ??
  //       'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg'
  //   }
  // ])
}

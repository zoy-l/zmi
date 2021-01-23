import { IApi } from '@zmi/types'

export default function (api: IApi) {
  api.describe({
    key: 'favicon',
    config: {
      default: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
      schema(joi) {
        return joi.string()
      }
    }
  })

  api.addHTMLLinks(() => [
    {
      rel: 'shortcut icon',
      type: 'image/x-icon',
      href: api.config.favicon
    }
  ])
}

import { IApi } from '@zmi/types'

export default function (api: IApi) {
  api.describe({
    key: 'loaderOptions',
    config: {
      default: { less: {}, scss: {}, stylus: {} },
      schema(joi) {
        return joi.object({
          less: joi.object(),
          scss: joi.object(),
          stylus: joi.object()
        })
      }
    }
  })
}

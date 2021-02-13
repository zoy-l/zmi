import { IApi } from '@zmi-cli/types'

export default function (api: IApi) {
  api.describe({
    key: 'loaderOptions',
    config: {
      default: {
        lessLoader: {},
        scssLoader: {},
        stylusLoader: {},
        styleLoader: {},
        cssLoader: {}
      },
      schema(joi) {
        return joi.object({
          lessLoader: joi.object(),
          scssLoader: joi.object(),
          stylusLoader: joi.object(),
          styleLoader: joi.object(),
          cssLoader: joi.object()
        })
      }
    }
  })
}

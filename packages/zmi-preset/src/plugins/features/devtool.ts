import { IApi } from '@zmi/types'

export default function (api: IApi) {
  api.describe({
    key: 'devtool',
    config: {
      default: api.env === 'development' ? 'eval-cheap-module-source-map' : false,
      schema(joi) {
        return joi.any().valid(joi.string(), false)
      }
    }
  })
}

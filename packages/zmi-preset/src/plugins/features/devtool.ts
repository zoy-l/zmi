import { IApi } from '@zmi-cli/types'

export default (api: IApi) => {
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

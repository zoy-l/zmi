import { IApi } from '@zmi-cli/types'

export default (api: IApi) => {
  api.describe({
    key: 'devtool',
    config: {
      schema(joi) {
        return joi.any().valid(joi.string(), false)
      }
    }
  })
}

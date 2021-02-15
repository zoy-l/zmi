import { IApi } from '@zmi-cli/types'

export default (api: IApi) => {
  api.describe({
    key: 'devServer',
    config: {
      default: {},
      schema(joi) {
        return joi.object()
      }
    }
  })
}

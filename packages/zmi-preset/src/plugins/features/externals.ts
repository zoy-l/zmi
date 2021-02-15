import { IApi } from '@zmi-cli/types'

export default (api: IApi) => {
  api.describe({
    key: 'externals',
    config: {
      default: {},
      schema(joi) {
        return joi.object()
      }
    }
  })
}

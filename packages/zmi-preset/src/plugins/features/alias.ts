import { IApi } from '@zmi-cli/types'

export default (api: IApi) => {
  api.describe({
    key: 'alias',
    config: {
      default: {},
      schema(joi) {
        return joi.object()
      }
    }
  })
}

import { IApi } from '@zmi-cli/types'

export default (api: IApi) => {
  api.describe({
    key: 'output',
    config: {
      schema(joi) {
        return joi.string()
      }
    }
  })
}

import { IApi } from '@zmi-cli/types'

export default (api: IApi) => {
  api.describe({
    key: 'disableTypes',
    config: {
      schema(joi) {
        return joi.boolean()
      }
    }
  })
}

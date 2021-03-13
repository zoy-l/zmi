import { IApi } from '@zmi-cli/types'

export default (api: IApi) => {
  api.describe({
    key: 'afterHook',
    config: {
      schema(joi) {
        return joi.func()
      }
    }
  })
}

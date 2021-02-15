import { IApi } from '@zmi-cli/types'

export default function (api: IApi) {
  api.describe({
    key: 'cache',
    config: {
      schema(joi) {
        return joi.valid('memory', 'filesystem')
      }
    }
  })
}

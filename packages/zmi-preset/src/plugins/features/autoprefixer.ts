import { IApi } from '@zmi-cli/types'

export default (api: IApi) => {
  api.describe({
    key: 'autoprefixer',
    config: {
      default: {
        autoprefixer: {
          flexbox: 'no-2009'
        },
        stage: 3
      },
      schema(joi) {
        return joi.object()
      }
    }
  })
}

import { IApi } from '@zmi-cli/types'

export default (api: IApi) => {
  api.describe({
    key: 'title',
    config: {
      schema(joi) {
        return joi.string()
      }
    }
  })

  api.modifyHTML(($) => {
    const { title } = api.config
    if (title) {
      const titleEl = $('head > title')
      if (titleEl.length) {
        titleEl.html(title)
      } else {
        $('head').append(`<title>${title}</title>`)
      }
    }
  })
}

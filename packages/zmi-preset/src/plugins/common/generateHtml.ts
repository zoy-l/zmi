import { IApi } from '@zmi-cli/types'
import path from 'path'
import fs from 'fs'

export function getHtmlGenerator({ api }: { api: IApi }): any {
  function getDocumentTplPath() {
    const docPath = path.join(api.paths.appPagesPath, 'document.ejs')
    return fs.existsSync(docPath) ? docPath : ''
  }

  class Html extends api.Html {
    constructor() {
      super({
        config: api.config,
        tplPath: getDocumentTplPath()
      })
    }

    async getContent(): Promise<string> {
      async function applyPlugins(opts: { initialState?: any[]; key: string }) {
        return api.applyPlugins({
          key: opts.key,
          type: api.ApplyPluginsType.add,
          initialValue: opts.initialState ?? []
        })
      }

      await api.applyPlugins({
        key: 'modifyPublicPathStr',
        type: api.ApplyPluginsType.modify,
        initialValue: api.config.publicPath
      })

      return super.getContent({
        headScripts: await applyPlugins({
          key: 'addHTMLHeadScripts'
        }),
        links: await applyPlugins({
          key: 'addHTMLLinks'
        }),
        metas: await applyPlugins({
          key: 'addHTMLMetas'
        }),
        scripts: await applyPlugins({
          key: 'addHTMLScripts'
        }),
        styles: await applyPlugins({
          key: 'addHTMLStyles'
        }),

        async modifyHTML(memo: any, args: Record<string, any>) {
          return api.applyPlugins({
            key: 'modifyHTML',
            type: api.ApplyPluginsType.modify,
            initialValue: memo,
            args: { args }
          })
        }
      })
    }
  }

  return new Html()
}

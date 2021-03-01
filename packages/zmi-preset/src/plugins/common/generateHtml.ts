import { IApi } from '@zmi-cli/types'
import { Html } from '@zmi-cli/webpack'
import path from 'path'
import fs from 'fs'

export function getHtmlGenerator(api: IApi) {
  function getDocumentTplPath() {
    const docPath = path.join(api.paths.appPagesPath, 'document.ejs')
    return fs.existsSync(docPath) ? docPath : ''
  }

  const html = new Html({
    config: api.config,
    tplPath: getDocumentTplPath()
  })

  return {
    getContent: async () => {
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

      return html.getContent({
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
}

import { IApi } from '@zmi-cli/types'
import { html } from '@zmi-cli/webpack'
import path from 'path'
import fs from 'fs'

export function getHtmlGenerator(api: IApi) {
  function getDocumentTplPath() {
    const docPath = path.join(api.paths.appPagesPath, 'document.ejs')
    return fs.existsSync(docPath) ? docPath : undefined
  }

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

      return html({
        config: api.config,
        tplPath: getDocumentTplPath(),
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
        async modifyHTML(memo) {
          return api.applyPlugins({
            key: 'modifyHTML',
            type: api.ApplyPluginsType.modify,
            initialValue: memo
          })
        }
      })
    }
  }
}

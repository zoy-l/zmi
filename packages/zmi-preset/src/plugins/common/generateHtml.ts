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
      async function applyHooks(opts: { initialState?: any[]; key: string }) {
        return api.applyAddHooks({
          key: opts.key,
          initialValue: opts.initialState
        })
      }

      await api.applyModifyHooks({
        key: 'modifyPublicPathStr',
        initialValue: api.config.publicPath
      })

      return html({
        config: api.config,
        tplPath: getDocumentTplPath(),
        headScripts: await applyHooks({
          key: 'addHTMLHeadScripts'
        }),
        links: await applyHooks({
          key: 'addHTMLLinks'
        }),
        metas: await applyHooks({
          key: 'addHTMLMetas'
        }),
        scripts: await applyHooks({
          key: 'addHTMLScripts'
        }),
        styles: await applyHooks({
          key: 'addHTMLStyles'
        }),
        async modifyHTML(memo) {
          return api.applyModifyHooks({
            key: 'modifyHTML',
            initialValue: memo
          })
        }
      })
    }
  }
}

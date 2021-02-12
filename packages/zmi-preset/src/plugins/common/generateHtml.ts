import { assert, lodash } from '@zmi-cli/utils'
import { IApi } from '@zmi-cli/types'
import path from 'path'
import fs from 'fs'

export function chunksToFiles(opts: {
  htmlChunks: (string | Record<string, unknown>)[]
  chunks?: any[]
  noChunk?: boolean
}): any {
  let chunksMap = {}
  if (opts.chunks) {
    chunksMap = opts.chunks.reduce((memo, chunk) => {
      const key = chunk.name || chunk.id
      if (key && chunk.files) {
        chunk.files.forEach((file: string) => {
          if (!file.includes('.hot-update')) {
            memo[`${key}${path.extname(file)}`] = file
          }
        })
      }
      return memo
    }, {})
  }
  const cssFiles: string[] = []
  const jsFiles: string[] = []
  const headJSFiles: string[] = []

  const htmlChunks = opts.htmlChunks.map((htmlChunk) =>
    lodash.isPlainObject(htmlChunk) ? htmlChunk : { name: htmlChunk }
  )
  htmlChunks.forEach(({ name, headScript }: any) => {
    const cssFile = opts.noChunk ? `${name}.css` : chunksMap[`${name}.css`]
    if (cssFile) {
      cssFiles.push(cssFile)
    }

    const jsFile = opts.noChunk ? `${name}.js` : chunksMap[`${name}.js`]
    assert(`chunk of ${name} not found.`, jsFile)

    if (headScript) {
      headJSFiles.push(jsFile)
    } else {
      jsFiles.push(jsFile)
    }
  })
}

export function getHtmlGenerator({ api }: { api: IApi }): any {
  function getDocumentTplPath() {
    const docPath = path.join(api.paths.appPagesPath!, 'document.ejs')
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

      // let publicPathStr = JSON.stringify(api.config.publicPath)

      // if (api.config.exportStatic?.dynamicRoot) {
      //   publicPathStr = `location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + window.routerBase`
      // }

      // publicPathStr = await api.applyPlugins({
      //   key: 'modifyPublicPathStr',
      //   type: api.ApplyPluginsType.modify,
      //   initialValue: publicPathStr
      // })

      // const htmlChunks = await api.applyPlugins({
      //   key: 'modifyHTMLChunks',
      //   type: api.ApplyPluginsType.modify,
      //   initialValue: api.config.chunks ?? ['zmi']
      // })
      // const { cssFiles, jsFiles, headJSFiles } = chunksToFiles({
      //   htmlChunks
      // })

      return super.getContent({
        // cssFiles,
        // headJSFiles,
        // jsFiles,
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

import path from 'path'
import fs from 'fs'
import { assert, lodash } from '@zmi/utils'

export function chunksToFiles(opts: {
  htmlChunks: (string | Record<string, unknown>)[]
  chunks?: any[]
  noChunk?: boolean
}): any {
  let chunksMap = {}
  if (opts.chunks) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

export function getHtmlGenerator({ api }: { api: any }): any {
  function getDocumentTplPath() {
    const docPath = path.join(api.paths.absPagesPath!, 'document.ejs')
    return fs.existsSync(docPath) ? docPath : ''
  }

  class Html extends api.Html {
    constructor() {
      super({
        config: api.config,
        tplPath: getDocumentTplPath()
      })
    }

    async getContent(args: any): Promise<string> {
      async function applyPlugins(opts: { initialState?: any[]; key: string }) {
        return api.applyPlugins({
          key: opts.key,
          type: api.ApplyPluginsType.add,
          initialValue: opts.initialState ?? [],
          args: {
            route: args.route
          }
        })
      }

      let routerBaseStr = JSON.stringify(api.config.base)
      let publicPathStr = JSON.stringify(api.config.publicPath)

      if (api.config.exportStatic?.dynamicRoot) {
        routerBaseStr = `location.pathname.split('/').slice(0, -${
          args.route.path!.split('/').length - 1
        }).concat('').join('/')`
        publicPathStr = `location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + window.routerBase`
      }

      publicPathStr = await api.applyPlugins({
        key: 'modifyPublicPathStr',
        type: api.ApplyPluginsType.modify,
        initialValue: publicPathStr,
        args: {
          route: args.route
        }
      })

      const htmlChunks = await api.applyPlugins({
        key: 'modifyHTMLChunks',
        type: api.ApplyPluginsType.modify,
        initialValue: api.config.chunks ?? ['zmi'],
        args: {
          chunks: args.chunks
        }
      })
      const { cssFiles, jsFiles, headJSFiles } = chunksToFiles({
        htmlChunks,
        chunks: args.chunks,
        noChunk: args.noChunk
      })

      return super.getContent({
        cssFiles,
        headJSFiles,
        jsFiles,
        headScripts: await applyPlugins({
          key: 'addHTMLHeadScripts',
          initialState: [
            // routerBase 只在部署路径不固定时才会用到，exportStatic.dynamicRoot
            // UPDATE: 内部 render 会依赖 routerBase，先始终生成
            api.config.exportStatic?.dynamicRoot && {
              content: `window.routerBase = ${routerBaseStr};`
            },
            // html 里的 publicPath
            // 只在设置了 runtimePublicPath 或 exportStatic?.dynamicRoot 时才会用到
            // 设置了 exportStatic?.dynamicRoot 时会自动设置 runtimePublicPath
            api.config.runtimePublicPath && {
              content: `window.publicPath = ${publicPathStr};`
            }
          ].filter(Boolean)
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

        async modifyHTML(memo: any, args: Record<string, unknown>) {
          return api.applyPlugins({
            key: 'modifyHTML',
            type: api.ApplyPluginsType.modify,
            initialValue: memo,
            args
          })
        }
      })
    }
  }

  return new Html()
}

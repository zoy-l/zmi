import { cheerio, deepmerge } from '@zmi-cli/utils'
import { readFileSync } from 'fs'
import assert from 'assert'
import { join } from 'path'
import ejs from 'ejs'

import { IGetContentArgs, IConfig, IScript, INonEmpty } from './types'
import { htmlDefaultOptions } from './defaultConfig'

export type IHtml = {
  config?: IConfig
  tplPath?: string
} & IGetContentArgs

function getProps(attrs: Record<string, any>) {
  return Object.keys(attrs).reduce((memo, key) => {
    return memo.concat(` ${key}="${attrs[key]}"`)
  }, '')
}

function getScriptsContent(scripts: IScript[]) {
  return scripts.reduce((memo, script) => {
    const { content, ...attrs } = script
    return memo.concat(`<script${getProps(attrs)}>${!attrs.src ? content ?? '' : ''}</script>`)
  }, '')
}

export default async function html(options: IHtml = {}) {
  const { headScripts, scripts, styles, metas, links, modifyHTML, tplPath, config } = deepmerge(
    htmlDefaultOptions,
    options
  ) as INonEmpty<IHtml, ''>

  let html = readFileSync(tplPath ?? join(__dirname, 'document.ejs'), 'utf-8')
  if (tplPath) {
    html = ejs.render(
      html,
      { config },
      {
        _with: false,
        localsName: 'context',
        filename: 'document.ejs'
      }
    )
  }
  const $ = cheerio.load(html, { decodeEntities: false })

  if (config.mountElementId && config.mountElementId.length) {
    const bodyEl = $('body')
    assert(bodyEl.length, '<body> not found in html template.')
    bodyEl.append(`<div id="${config.mountElementId}"></div>`)
  }

  if (metas.length) {
    $('head').append(metas.reduce((memo, meta) => memo.concat(`<meta${getProps(meta)}/>`), ''))
  }

  if (links.length) {
    $('head').append(links.reduce((memo, link) => memo.concat(`<link${getProps(link)}/>`), ''))
  }

  if (styles.length) {
    $('head').append(
      styles.reduce((memo, style) => {
        const { content, ...attrs } = style
        return memo.concat(`<style${getProps(attrs)}>${content ?? ''}</style>`)
      }, '')
    )
  }

  if (headScripts.length) {
    $('head').append(getScriptsContent(headScripts))
  }

  if (scripts.length) {
    $('body').append(getScriptsContent(scripts))
  }

  if (modifyHTML) {
    modifyHTML($)
  }
  return $.html()
}

// class Html {
//   /**
//    * @desc user config
//    */
//   config: IConfig

//   /**
//    * @desc Template path
//    */
//   tplPath?: string

//   constructor(options: IOpts = { config: {}, tplPath: undefined }) {
//     this.config = deepmerge(defaultConfig, options.config)
//     this.tplPath = options.tplPath
//   }

//   async getContent(args: IGetContentArgs): Promise<string> {
//     const { headScripts, scripts, styles, metas, links, modifyHTML } = args

//     let html = readFileSync(this.tplPath ?? join(__dirname, 'document.ejs'), 'utf-8')

//     if (this.tplPath) {
//       html = ejs.render(
//         html,
//         {
//           config: this.config
//         },
//         {
//           _with: false,
//           localsName: 'context',
//           filename: 'document.ejs'
//         }
//       )
//     }

//     const $ = cheerio.load(html, {
//       decodeEntities: false
//     })

//     if (this.config.mountElementId!.length) {
//       const bodyEl = $('body')
//       assert(bodyEl.length, '<body> not found in html template.')
//       bodyEl.append(`<div id="${this.config.mountElementId}"></div>`)
//     }

//     if (metas.length) {
//       $('head').append(metas.reduce((memo, meta) => memo.concat(`<meta${getProps(meta)}/>`), ''))
//     }

//     if (links.length) {
//       $('head').append(links.reduce((memo, link) => memo.concat(`<link${getProps(link)}/>`), ''))
//     }

//     if (styles.length) {
//       $('head').append(
//         styles.reduce((memo, style) => {
//           const { content, ...attrs } = style
//           return memo.concat(`<style${getProps(attrs)}>${content ?? ''}</style>`)
//         }, '')
//       )
//     }

//     if (headScripts.length) {
//       $('head').append(getScriptsContent(headScripts))
//     }

//     if (scripts.length) {
//       $('body').append(getScriptsContent(scripts))
//     }

//     if (modifyHTML) {
//       modifyHTML($)
//     }

//     return $.html()
//   }
// }

// export default Html

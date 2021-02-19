import { IConfig, IScript } from '@zmi-cli/webpack'
import { cheerio, assert } from '@zmi-cli/utils'
import { readFileSync } from 'fs'
import { join } from 'path'
import ejs from 'ejs'

import { IOpts, IGetContentArgs } from './types'

class Html {
  /**
   * @desc user config
   */
  config: IConfig

  /**
   * @desc Template path
   */
  tplPath?: string

  constructor(opts: IOpts) {
    this.config = opts.config
    this.tplPath = opts.tplPath
  }

  getHtmlPath(path: string) {
    if (path === '/') {
      return 'index.html'
    }

    // remove first and last slash
    path = path.replace(/^\//, '')
    path = path.replace(/\/$/, '')

    // this.config.exportStatic?.htmlSuffix
    if (path === 'index.html') {
      return `${path}`
    }
    return `${path}/index.html`
  }

  getRelPathToPublicPath(path: string) {
    const htmlPath = this.getHtmlPath(path)
    const len = htmlPath.split('/').length
    return Array(len - 1).join('../') || './'
  }

  getAsset(opts: { file: string; path?: string }) {
    if (/^https?:\/\//.test(opts.file)) {
      return opts.file
    }
    const file = opts.file.charAt(0) === '/' ? opts.file.slice(1) : opts.file

    return `${this.config.publicPath}${file}`
  }

  getScriptsContent(scripts: IScript[]) {
    return scripts
      .map((script: any) => {
        const { content, ...attrs } = script
        if (content && !attrs.src) {
          const newAttrs = Object.keys(attrs).reduce(
            (memo: any, key: string) => [...memo, `${key}="${attrs[key]}"`],
            []
          )
          return [
            `<script${newAttrs.length ? ' ' : ''}${newAttrs.join(' ')}>`,
            content
              .split('\n')
              .map((line: any) => `  ${line}`)
              .join('\n'),
            '</script>'
          ].join('\n')
        }
        const newAttrs = Object.keys(attrs).reduce(
          (memo: any, key: any) => [...memo, `${key}="${attrs[key]}"`],
          []
        )
        return `<script ${newAttrs.join(' ')}></script>`
      })
      .join('\n')
  }

  async getContent(args: IGetContentArgs): Promise<string> {
    const { headScripts, scripts, styles, metas, links, modifyHTML } = args

    const tpl = readFileSync(this.tplPath || join(__dirname, 'document.ejs'), 'utf-8')
    const context = {
      config: this.config
    }
    const html = ejs.render(tpl, context, {
      _with: false,
      localsName: 'context',
      filename: 'document.ejs'
    })

    let $ = cheerio.load(html, {
      decodeEntities: false
    })

    // metas
    metas.forEach((meta) => {
      $('head').append(
        [
          '<meta',
          ...Object.keys(meta).reduce(
            (memo, key) => memo.concat(`${key}="${meta[key]}"`),
            [] as string[]
          ),
          '/>'
        ].join(' ')
      )
    })

    // links
    links.forEach((link) => {
      $('head').append(
        [
          '<link',
          ...Object.keys(link).reduce(
            (memo, key) => memo.concat(`${key}="${link[key]}"`),
            [] as string[]
          ),
          '/>'
        ].join(' ')
      )
    })

    // styles
    styles.forEach((style) => {
      const { content = '', ...attrs } = style
      const newAttrs = Object.keys(attrs).reduce(
        (memo, key) => memo.concat(`${key}="${attrs[key]}"`),
        [] as string[]
      )
      $('head').append(
        [
          `<style${newAttrs.length ? ' ' : ''}${newAttrs.join(' ')}>`,
          content
            .split('\n')
            .map((line: any) => `  ${line}`)
            .join('\n'),
          '</style>'
        ].join('\n')
      )
    })

    // root element
    // this.config.mountElementId ??
    const mountElementId = 'root'
    if (!$(`#${mountElementId}`).length) {
      const bodyEl = $('body')
      assert('<body> not found in html template.', bodyEl.length)
      bodyEl.append(`<div id="${mountElementId}"></div>`)
    }

    // js
    if (headScripts.length) {
      $('head').append(this.getScriptsContent(headScripts))
    }

    if (scripts.length) {
      $('body').append(this.getScriptsContent(scripts))
    }

    if (modifyHTML) {
      $ = await modifyHTML($)
    }

    return $.html()
  }
}

export default Html

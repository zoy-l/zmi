import { existsSync, readFileSync } from 'fs'
import { cheerio, assert } from '@zmi/utils'
import prettier from 'prettier'
import { join } from 'path'
import ejs from 'ejs'

import { IOpts, IGetContentArgs, IScript } from './types'
import { IConfig } from './Service'

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

    if (this.config.exportStatic?.htmlSuffix || path === 'index.html') {
      return `${path}`
    }
    return `${path}/index.html`
  }

  getRelPathToPublicPath(path: string) {
    const htmlPath = this.getHtmlPath(path)
    const len = htmlPath.split('/').length
    return (
      Array(this.config.exportStatic?.htmlSuffix ? len : len - 1).join('../') ||
      './'
    )
  }

  getAsset(opts: { file: string; path?: string }) {
    if (/^https?:\/\//.test(opts.file)) {
      return opts.file
    }
    const file = opts.file.charAt(0) === '/' ? opts.file.slice(1) : opts.file
    if (this.config.exportStatic?.dynamicRoot) {
      return `${this.getRelPathToPublicPath(opts.path ?? '/')}${file}`
    }
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
    const { tplPath = this.tplPath } = args
    const {
      headJSFiles = [],
      headScripts = [],
      cssFiles = [],
      scripts = [],
      jsFiles = [],
      styles = [],
      metas = [],
      links = [],
      modifyHTML
    } = args

    if (tplPath) {
      assert(
        `getContent() failed, tplPath of ${tplPath} not exists.`,
        existsSync(tplPath)
      )
    }
    const tpl = readFileSync(
      tplPath || join(__dirname, 'document.ejs'),
      'utf-8'
    )
    const context = {
      config: this.config
    }
    let html = ejs.render(tpl, context, {
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

    // css
    cssFiles.forEach((file) => {
      $('head').append(
        `<link rel="stylesheet" href="${this.getAsset({
          file
        })}" />`
      )
    })

    // root element
    const mountElementId = this.config.mountElementId ?? 'root'
    if (!$(`#${mountElementId}`).length) {
      const bodyEl = $('body')
      assert('<body> not found in html template.', bodyEl.length)
      bodyEl.append(`<div id="${mountElementId}"></div>`)
    }

    // js
    if (headScripts.length) {
      $('head').append(this.getScriptsContent(headScripts))
    }
    headJSFiles.forEach((file) => {
      $('head').append(`<script src="${this.getAsset({ file })}"></script>`)
    })
    if (scripts.length) {
      $('body').append(this.getScriptsContent(scripts))
    }
    jsFiles.forEach((file) => {
      $('body').append(`<script src="${this.getAsset({ file })}"></script>`)
    })

    if (modifyHTML) {
      $ = await modifyHTML($)
    }

    html = $.html()
    // Node 8 not support prettier v2
    // https://github.com/prettier/eslint-plugin-prettier/issues/278
    try {
      html = prettier.format(html, {
        parser: 'html'
      })
    } catch {
      // empty
    }

    return html
  }
}

export default Html

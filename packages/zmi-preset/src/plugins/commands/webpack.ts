import { prettier } from '@zmi-cli/webpack'
import { IApi } from '@zmi-cli/types'
import { exec } from 'child_process'
import express from 'express'

import { getBundleAndConfigs } from '../common/BundleUtils'

function highLight(json: string) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    function (match: string) {
      let cls = 'number'
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key'
        } else {
          cls = 'string'
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean'
      } else if (/null/.test(match)) {
        cls = 'null'
      }
      return '<span class="' + cls + '">' + match + '</span>'
    }
  )
}

export default (api: IApi) => {
  const app = express()
  api.registerCommand({
    name: 'webpack',
    description: 'inspect webpack configurations',
    async fn() {
      const { bundleConfigs } = await getBundleAndConfigs({ api })

      bundleConfigs.plugins.forEach((plugin: any, index: number) => {
        const pg = JSON.stringify(plugin)
        if (/templateContent/.test(pg)) {
          bundleConfigs.plugins[index].userOptions.templateContent = ''
        }

        if (/baseConfig/.test(pg)) {
          bundleConfigs.plugins[index].options.baseConfig = ''
        }
      })

      app.get('/', function (_, response) {
        response.writeHead(200, { 'Content-Type': 'text/html' })
        response.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
        </head>
        <style>
        body {
          margin: 0;
        }
        pre {
          margin: 0;
        }
        .string {
          color: green;
        }
        .number {
          color: darkorange;
        }
        .boolean {
          color: blue;
        }
        .null {
          color: magenta;
        }
        .key {
          color: red;
        }
      </style>
        <body>
        <pre>${highLight(prettier.format(JSON.stringify(bundleConfigs), { parser: 'json' }))}</pre>
        </body>
        </html>
        `)
        response.end()
      })

      app.listen(8976, function () {
        const openDefaultBrowser = function (url: string) {
          switch (process.platform) {
            case 'darwin':
              exec('open ' + url)
              break
            case 'win32':
              exec('start ' + url)
              break
            default:
              exec('xdg-open ' + url)
          }
          console.log('Please check in your browser http://localhost:8976')
        }
        openDefaultBrowser('http://localhost:8976')
      })
    }
  })
}

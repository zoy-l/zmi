import WebpackDevServer from 'webpack-dev-server'
import { chalk, clearConsole } from '@zmi/utils'
import defaultWebpack from 'webpack'
import fs from 'fs-extra'

import createCompiler, { prepareUrls } from './createCompiler'
import formatWebpackMessages from './formatWebpackMessages'
import getConfig, { IGetConfigOpts } from './getConfig'

import { measureFileSizesBeforeBuild, printFileSizesAfterBuild } from './reporterFileSize'

interface ISetupOpts {
  bundleConfigs: defaultWebpack.Configuration & {
    devServer: WebpackDevServer.Configuration
  }
  bundleImplementor: typeof defaultWebpack
  port: number
  host: string
  appName?: string
}

interface IOpts {
  cwd: string
  config: any
  pkg: Record<string, any>
}

export default class Bundler {
  cwd: string

  config: any

  pkg = {}

  constructor({ cwd, config, pkg }: IOpts) {
    this.cwd = cwd
    this.config = config
    this.pkg = pkg
  }

  async getConfig(options: IGetConfigOpts) {
    return getConfig({
      ...options,
      cwd: this.cwd,
      config: this.config,
      pkg: this.pkg
    })
  }

  async setupDevServer(options: ISetupOpts) {
    const {
      bundleConfigs,
      bundleImplementor = defaultWebpack,
      appName = 'project',
      host,
      port
    } = options

    const urls = prepareUrls({ host, port })

    const { devServer: devServerConfig } = bundleConfigs

    const compiler = createCompiler({
      config: bundleConfigs,
      bundleImplementor,
      appName,
      urls,
      port
    })

    const devServer = new WebpackDevServer(compiler, devServerConfig)

    return devServer
  }

  async build(options: {
    bundleConfigs: defaultWebpack.Configuration
    bundleImplementor: typeof defaultWebpack
    appOutputPath: string
  }): Promise<defaultWebpack.Stats | undefined> {
    const { bundleImplementor = defaultWebpack, bundleConfigs, appOutputPath } = options
    clearConsole()
    console.log(chalk.redBright('Start packing, please don’t worry, officer...\n'))
    const previousFileSizes = await measureFileSizesBeforeBuild(appOutputPath)
    fs.emptyDirSync(appOutputPath)

    return new Promise((resolve) => {
      const compiler = bundleImplementor(bundleConfigs)

      compiler.run((err, stats) => {
        let messages
        if (err) {
          if (!err.message) {
            throw new Error('build fail')
          }

          messages = formatWebpackMessages({
            errors: [err.message],
            warnings: []
          })
        } else {
          messages = formatWebpackMessages(
            stats?.toJson({ all: false, warnings: true, errors: true })
          )
        }

        if (messages.errors.length) {
          if (messages.errors.length > 1) {
            messages.errors.length = 1
          }
          throw new Error(messages.errors.join('\n\n'))
        }

        if (messages.warnings.length) {
          console.warn(messages.warnings.join('\n'))
        } else {
          clearConsole()
          console.log(
            `📦 ${chalk.yellowBright('Compiled successfully !')} Size: - Gzip \n`
          )
        }

        printFileSizesAfterBuild(stats, previousFileSizes, appOutputPath)
        console.log()

        resolve(stats)
      })
    })
  }
}

import { chalk, clearConsole, deepmerge, isWin, fsExtra as fs } from '@zmi-cli/utils'
import WebpackDevServer from 'webpack-dev-server'
import webpack from 'webpack'

import { measureFileSizesBeforeBuild, printFileSizesAfterBuild } from './reporterFileSize'
import createCompiler, { prepareUrls } from './createCompiler'
import { IConfigOpts, IPrivate } from './types'
import formatMessages from './formatMessages'
import defaultConfig from './defaultConfig'
import getConfig from './getConfig'

interface ISetupOpts {
  bundleConfigs: webpack.Configuration
  port: number
  host: string
  appName?: string
}

interface IOpts {
  cwd: string
  config?: IPrivate
  pkg?: Record<string, any>
}

export default class Bundler {
  cwd: string

  config: IPrivate

  pkg: Record<string, any>

  constructor({ cwd, config, pkg }: IOpts) {
    this.config = deepmerge(defaultConfig, config ?? {})
    this.cwd = cwd
    this.pkg = pkg ?? {}
  }

  async getConfig(options: Omit<IConfigOpts, 'cwd' | 'config' | 'pkg'>) {
    return getConfig({
      ...options,
      cwd: this.cwd,
      config: this.config,
      pkg: this.pkg
    })
  }

  async setupDevServer(options: ISetupOpts) {
    const { appName = 'project', bundleConfigs, host, port } = options
    const { devServer: devServerConfig } = bundleConfigs

    const urls = prepareUrls({
      host,
      port,
      protocol: devServerConfig?.https ? 'https' : 'http',
      pathname: this.config.publicPath
    })

    const compiler = createCompiler({
      config: bundleConfigs,
      appName,
      urls,
      port
    })

    const devServer = new WebpackDevServer(compiler, devServerConfig)

    return devServer
  }

  async build(options: {
    bundleConfigs: webpack.Configuration
    appOutputPath: string
  }): Promise<webpack.Stats | undefined> {
    const { bundleConfigs, appOutputPath } = options
    clearConsole()
    console.log(chalk.blue('Start packing, please don’t worry, officer...\n'))
    const previousFileSizes = await measureFileSizesBeforeBuild(appOutputPath)

    fs.emptyDirSync(appOutputPath)

    return new Promise((resolve) => {
      const compiler = webpack(bundleConfigs)

      compiler.run((err, stats) => {
        let messages

        if (err) {
          if (!err.message) {
            throw new Error(`build fail: ${err.message}`)
          }
        } else if (stats) {
          messages = formatMessages(stats.toJson({ all: false, warnings: true, errors: true }))
        }

        if (messages && messages.errors.length && messages.errors.length > 1) {
          messages.errors.length = 1
        }

        clearConsole()
        console.log(
          `${chalk.bgBlueBright.black(' BUILD ')} ${chalk.blue('Compiled successfully !\n')} `
        )
        console.log(`${isWin ? '✨' : '📦'} Name: - Size`)
        if (stats) {
          printFileSizesAfterBuild(
            stats.toJson({ all: false, assets: true }),
            previousFileSizes,
            appOutputPath
          )
        }
        console.log()

        if (messages && messages.warnings.length) {
          console.warn(messages.warnings.join('\n'))
        }

        resolve(stats)
      })
    })
  }
}

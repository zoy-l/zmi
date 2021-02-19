import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import { chalk, clearConsole } from '@zmi-cli/utils'
import stripAnsi from 'strip-ansi'
import address from 'address'
import webpack from 'webpack'
import url from 'url'

import formatWebpackMessages from './formatWebpackMessages'

interface IUrlType {
  lanUrlForTerminal: string | undefined
  localUrlForTerminal: string
  lanUrlForConfig: any
}

interface IPrepareUrlOpts {
  protocol?: 'http' | 'https'
  port: string | number
  pathname?: string
  host: string
}

const urlRegex = /^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/

export function prepareUrls(prepareUrlOptions: IPrepareUrlOpts) {
  const { protocol, host, port, pathname } = prepareUrlOptions
  const formatUrl = (hostname: string) =>
    url.format({
      protocol,
      hostname,
      port,
      pathname
    })

  const isUnspecifiedHost = host === '0.0.0.0' || host === '::'

  let prettyHost
  let lanUrlForConfig
  let lanUrlForTerminal

  if (isUnspecifiedHost) {
    prettyHost = 'localhost'
    try {
      lanUrlForConfig = address.ip()
      if (lanUrlForConfig) {
        if (urlRegex.test(lanUrlForConfig)) {
          lanUrlForTerminal = formatUrl(lanUrlForConfig)
        } else {
          lanUrlForConfig = undefined
        }
      }
    } catch {
      // ignored
    }
  } else {
    prettyHost = host
  }

  const localUrlForTerminal = formatUrl(prettyHost)

  return {
    lanUrlForConfig,
    lanUrlForTerminal,
    localUrlForTerminal
  }
}

function printInstructions(opts: { appName: string; urls: IUrlType; port: number }) {
  const { appName, urls, port } = opts
  const { yellow, cyan } = chalk
  const { log } = console

  const portText = ` Running metro bundler on Port: ${yellow(port)}`
  const appNameText = ` You can now view your Project: ${yellow(appName)}`
  const localhostText = ` Localhost: ${cyan(urls.localUrlForTerminal)}`
  const netWorkText = ` Network:   ${cyan(urls.lanUrlForTerminal ?? '')}`

  const textLength = [portText, appNameText, localhostText, netWorkText].map(
    (text) => stripAnsi(text).length
  )
  const maxLength = Math.max(...textLength) + 3

  function padEnd(text: string, index: number) {
    return text.padEnd(text.length + maxLength - textLength[index] - 1)
  }
  // devConifg.target !== 'web' &&
  log(
    [
      '┌'.padEnd(maxLength, '─') + '┐',
      `│${padEnd(portText, 0)}│`,
      `│${padEnd(appNameText, 1)}|`,
      '├'.padEnd(maxLength, '─') + '┤'
    ].join('\n')
  )

  if (urls.lanUrlForTerminal) {
    log(`│${padEnd(localhostText, 2)}│`)
    log(`│${padEnd(netWorkText, 3)}│`)
  } else {
    log(`│${padEnd(localhostText, 2)}│`)
  }

  log('└'.padEnd(maxLength, '─') + '┘')
}

function createCompiler(opts: {
  config: webpack.Configuration
  appName: string
  urls: IUrlType
  port: number
}) {
  const { appName, config, urls, port } = opts
  const { log } = console

  let compiler: webpack.Compiler

  try {
    compiler = webpack(config)
  } catch (err) {
    log(chalk.red('❌ Compilation failed.'))
    log()
    log(err.message ?? err)
    process.exit(1)
  }

  // I don't know what happened,
  // I need to return a Date type
  compiler.hooks.invalid.tap('invalid', () => {
    clearConsole()
    log(chalk.cyan('Accelerating compilation ,Wait a moment...'))
    log()
  })

  const forkHook = ForkTsCheckerWebpackPlugin.getCompilerHooks(compiler)
  forkHook.issues.tap('ForkTsCheckerWebpackPlugin', (issues: string | any[]) => {
    if (issues.length) {
      //
    }
    return issues
  })

  compiler.hooks.done.tap('done', (stats) => {
    const statsData = stats.toJson({
      all: false,
      warnings: true,
      errors: true
    })

    const messages = formatWebpackMessages(statsData)
    const isSuccessful = !messages.errors.length && !messages.warnings.length

    if (isSuccessful) {
      clearConsole()
      log(chalk.bgBlue.black(' DONE '), chalk.blue('Compiled successfully !'))
      printInstructions({ appName, urls, port })
    }

    // isFirstCompile = false

    if (messages.errors.length) {
      if (messages.errors.length > 1) {
        messages.errors.length = 1
      }
      clearConsole()
      log('\n')
      log(chalk.red('❌ Compilation failed.\n'))
      log(chalk.red(messages.errors.join('\n\n')))
      log()
      return
    }

    if (messages.warnings.length) {
      log(chalk.yellow(`🚸 Compile warning.\n`))
      log(messages.warnings.join('\n\n'))
      log()
    }
  })

  return compiler
}

export default createCompiler

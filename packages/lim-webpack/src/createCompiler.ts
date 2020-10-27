import webpack from 'webpack'
import forkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import { Issue } from 'fork-ts-checker-webpack-plugin/lib/issue'
import { chalk, clearConsole } from '../../lim-utils/lib'
import formatWebpackMessages from './formatWebpackMessages'

const makeLine = (num: number, sign = ' ') => new Array(num).join(sign)

const line = (interval: string, isTop: boolean) =>
  `${isTop ? '┌' : '└'}${makeLine(29, '─')}${interval}${isTop ? '┐' : '┘'}`

function printInstructions(opts: { appName: string; urls: any; port: number }) {
  const { appName, urls, port } = opts

  console.log('📦  Compiled successfully! ')
  console.log()

  const interval = makeLine(appName.length + 6, '─')

  console.log(
    [
      line(interval, true),
      // devConifg.target !== 'web' &&
      `│ Running metro bundler on Port: ${chalk.yellow.bold(port)} ${makeLine(
        appName.length - 3
      )}│`,

      `│ You can now view your Project: ${chalk.yellow.bold(appName)} │`,

      line(interval, false)
    ]
      .filter(Boolean)
      .join('\n')
  )

  // if (devConifg.target === 'web') {
  if (urls.lanUrlForTerminal) {
    console.log('|')
    console.log(
      `|- Localhost: ${chalk.cyan(`http://${urls.localUrlForTerminal}`)}`
    )
    console.log('|')
    console.log(`|- Network: ${chalk.cyan(`http://${urls.lanUrlForTerminal}`)}`)
  } else {
    console.log(
      `|- Localhost: ${chalk.cyan(`http://${urls.localUrlForTerminal}`)}`
    )
  }
  // }

  console.log()
}

function createCompiler(opts: {
  appName: string
  config: any
  urls: any
  port: number
}) {
  const { appName, config, urls, port } = opts

  // const { error, process: pack, warning } = compilerEndStaticText
  let compiler

  try {
    compiler = webpack(config)
  } catch (err) {
    console.log(chalk.red('❌ Compilation failed.'))
    console.log()
    console.log(err.message || err)
    process.exit(1)
  }

  let isFirstCompile = true

  compiler.hooks.invalid.tap('invalid', () => {
    clearConsole()
    console.log(chalk.cyan('🎯 Accelerating compilation ,Wait a moment...'))
  })

  const forkHook = forkTsCheckerWebpackPlugin.getCompilerHooks(compiler)

  forkHook.issues.tap('ForkTsCheckerWebpackPlugin', (issues): Issue[] => {
    if (issues.length) {
      clearConsole()
    }
    return []
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
      printInstructions({ appName, urls, port })
    }

    isFirstCompile = false

    if (messages.errors.length) {
      if (messages.errors.length > 1) {
        messages.errors.length = 1
      }
      console.log(chalk.red('❌ Compilation failed.\n'))
      console.log(chalk.red(messages.errors.join('\n\n')))
      return
    }
    if (messages.warnings.length) {
      console.log(chalk.yellow(`🚸 Compile warning.\n`))
      console.log(messages.warnings.join('\n\n'))
      console.log()
    }
  })

  return compiler
}

export default createCompiler
